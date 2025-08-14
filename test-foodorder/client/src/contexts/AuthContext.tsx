import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, handleRedirect } from '@/lib/auth';
import type { User as DatabaseUser } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  dbUser: DatabaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Save user to database
  const saveUserToDatabase = async (firebaseUser: User) => {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }),
      });

      if (response.ok) {
        const dbUser = await response.json();
        setDbUser(dbUser);
        console.log('User saved to database:', dbUser);
      }
    } catch (error) {
      console.error('Failed to save user to database:', error);
    }
  };

  useEffect(() => {
    // Handle redirect result on app load
    handleRedirect()
      .then((user: any) => {
        if (user) {
          setUser(user);
          saveUserToDatabase(user);
        }
      })
      .catch((error: any) => {
        console.error("Error handling redirect:", error);
      });

    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((user: User | null) => {
      setUser(user);
      if (user) {
        saveUserToDatabase(user);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    dbUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}