import { useState } from 'react';
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  logoutUser 
} from '@/lib/firebase';
import { useToast } from './use-toast';

export const useAuth = () => {
  const { currentUser, loading: authLoading, setLoading } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      await signInWithEmail(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to sign in';
      
      setError(errorMessage);
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    setError(null);
    setLoading(true);
    
    try {
      await signUpWithEmail(email, password, displayName);
      toast({
        title: 'Welcome to Scrumpts!',
        description: 'Your account has been created successfully.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create account';
      
      setError(errorMessage);
      toast({
        title: 'Registration Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await signInWithGoogle();
      // No need for toast here as it will redirect to Google and back
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to sign in with Google';
      
      setError(errorMessage);
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    
    try {
      await logoutUser();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to log out';
      
      setError(errorMessage);
      toast({
        title: 'Logout Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    loading: authLoading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout
  };
};
