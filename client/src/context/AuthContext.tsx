import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChange } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  saveUserToDatabase: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  setLoading: () => {},
  saveUserToDatabase: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Save user to database
  const saveUserToDatabase = async (user: User) => {
    try {
      // First, check if the user already exists
      const checkResponse = await fetch(`/api/users/${user.uid}`);
      
      // If user doesn't exist (404), create them
      if (checkResponse.status === 404) {
        await apiRequest('POST', '/api/users', {
          uid: user.uid,
          email: user.email || `${user.uid}@example.com`, // Provide a fallback email
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          preferences: {}
        });
      } else if (!checkResponse.ok) {
        // Handle other error statuses
        throw new Error(`Error checking user: ${checkResponse.status}`);
      }
      // If user exists (200), do nothing
    } catch (error) {
      toast({
        title: 'Error saving user',
        description: 'There was a problem saving your user information.',
        variant: 'destructive',
      });
      console.error('Error saving user to database:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Save user to database when they sign in
        await saveUserToDatabase(user);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    setLoading,
    saveUserToDatabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
