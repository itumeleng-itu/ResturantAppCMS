import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ErrorDetails {
  type: 'network' | 'auth' | 'profile' | 'permission' | 'unknown'
  message: string
  originalError?: unknown
}

function parseError(error: unknown): ErrorDetails {
  const err = error as { message?: string; status?: number; relation?: string }

  if (error instanceof TypeError && err.message?.includes('Failed to fetch')) {
    return {
      type: 'network',
      message: 'Network error: Unable to reach Supabase. Check your internet connection.',
      originalError: error,
    }
  }

  if (err.message?.includes('ERR_CONNECTION_TIMED_OUT') || err.message?.includes('timeout')) {
    return {
      type: 'network',
      message: 'Connection timeout: The server took too long to respond. Please try again.',
      originalError: error,
    }
  }

  if (err.message?.includes('Invalid login credentials')) {
    return {
      type: 'auth',
      message: 'Invalid email or password. Please check your credentials.',
      originalError: error,
    }
  }

  if (err.status === 401 || err.status === 403) {
    return {
      type: 'auth',
      message: `Authentication failed (${err.status}): ${err.message || 'Invalid credentials'}`,
      originalError: error,
    }
  }

  if (err.relation === 'profiles' || err.message?.includes('profiles')) {
    return {
      type: 'profile',
      message: `Failed to fetch user profile: ${err.message || 'Profile not found'}`,
      originalError: error,
    }
  }

  if (err.message) {
    return {
      type: 'unknown',
      message: err.message,
      originalError: error,
    }
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error,
  }
}

export function useAuth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        const errorDetails = parseError(authError)
        setError(errorDetails.message)
        throw authError
      }

      if (!data.user) {
        throw new Error('No user data returned from authentication')
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          await supabase.auth.signOut()
          const errorDetails = parseError(profileError)
          setError(errorDetails.message)
          return
        }

        if (!profile) {
          await supabase.auth.signOut()
          setError('User profile not found in database.')
          return
        }

        if (profile.role !== 'admin') {
          await supabase.auth.signOut()
          setError(`Access denied: Your role is '${profile.role}' but admin privileges are required.`)
          return
        }

        navigate('/dashboard')
      } catch (profileError: unknown) {
        await supabase.auth.signOut()
        const errorDetails = parseError(profileError)
        setError(errorDetails.message)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      if (!err.message?.includes('signOut')) {
        const errorDetails = parseError(error)
        setError(errorDetails.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}