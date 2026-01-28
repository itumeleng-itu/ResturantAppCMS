import { supabase } from '../lib/supabaseClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Step 1: Attempting authentication...');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        setError(authError.message);
        throw authError;
      }

      console.log('Step 2: Authentication successful, user:', data.user?.id);

      if (data.user) {
        console.log('Step 3: Checking user profile...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // DEBUGGING: Log raw response
        console.log('profile', profile, 'profileError', profileError);
        console.log('Profile data:', profile);
        console.log('Profile error:', profileError);

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          await supabase.auth.signOut();
          setError(`Profile error: ${profileError.message}`);
          return;
        }

        if (profile?.role !== 'admin') {
          console.error('User role is not admin:', profile?.role);
          await supabase.auth.signOut();
          setError("Access denied: You do not have admin privileges.");
          return;
        }

        console.log('Step 4: Admin access confirmed, navigating to dashboard...');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (!error.message) {
        setError("An unexpected error occurred");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}