
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// A temporary user type for when Firebase is not configured
type TempUser = {
  email: string | null;
};

interface AuthContextType {
  user: User | TempUser | null;
  loading: boolean;
  setTempUser: (user: TempUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setTempUser: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | TempUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setTempUser = (tempUser: TempUser | null) => {
    setUser(tempUser);
  }

  useEffect(() => {
    // If Firebase is not configured, don't set up the listener
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, setTempUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
