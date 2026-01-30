import { supabase } from '../lib/supabaseClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorDetails {
  type: 'network' | 'auth' | 'profile' | 'permission' | 'unknown';
  message: string;
  originalError?: any;
}

function parseError(error: any): ErrorDetails {
  // Network/Fetch errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return {
      type: 'network',
      message: 'Network error: Unable to reach Supabase. Check your internet connection or if the service is accessible.',
      originalError: error,
    };
  }

  if (error?.message?.includes('ERR_CONNECTION_TIMED_OUT') || error?.message?.includes('timeout')) {
    return {
      type: 'network',
      message: 'Connection timeout: The Supabase server took too long to respond. Please try again.',
      originalError: error,
    };
  }

  // Invalid credentials
  if (error?.message?.includes('Invalid login credentials')) {
    return {
      type: 'auth',
      message: 'Invalid email or password. Please check your credentials.',
      originalError: error,
    };
  }

  // Auth-related errors
  if (error?.status === 401 || error?.status === 403) {
    return {
      type: 'auth',
      message: `Authentication failed (${error?.status}): ${error?.message || 'Invalid credentials'}`,
      originalError: error,
    };
  }

  // Profile fetch errors
  if (error?.relation === 'profiles' || error?.message?.includes('profiles')) {
    return {
      type: 'profile',
      message: `Failed to fetch user profile: ${error?.message || 'Profile not found'}`,
      originalError: error,
    };
  }

  // Generic message
  if (error?.message) {
    return {
      type: 'unknown',
      message: error.message,
      originalError: error,
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error,
  };
}

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        const errorDetails = parseError(authError);
        setError(errorDetails.message);
        throw authError;
      }

      if (!data.user) {
        throw new Error('No user data returned from authentication');
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          await supabase.auth.signOut();
          const errorDetails = parseError(profileError);
          setError(errorDetails.message);
          return;
        }

        if (!profile) {
          await supabase.auth.signOut();
          setError('User profile not found in database.');
          return;
        }

        if (profile.role !== 'admin') {
          await supabase.auth.signOut();
          setError(`Access denied: Your role is '${profile.role}' but admin privileges are required.`);
          return;
        }

        navigate('/dashboard');
      } catch (profileError: any) {
        await supabase.auth.signOut();
        const errorDetails = parseError(profileError);
        setError(errorDetails.message);
      }
    } catch (error: any) {
      // Only set error if not already set by previous handlers
      if (!error.message?.includes('signOut')) {
        const errorDetails = parseError(error);
        setError(errorDetails.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}