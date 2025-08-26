import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabase';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  xp: number;
  level: string;
  badges: string[];
  streak: number;
  completedLessons: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: supabaseUser, session, loading, signUp, signIn, signOut } = useSupabaseAuth();
  const [user, setUser] = useState<User | null>(null);

  // Map Supabase user to app User type
  useEffect(() => {
    if (supabaseUser) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        isAdmin: false, // fetch from user_profiles table if needed
        xp: 0, // fetch from user_profiles
        level: 'Seed', // fetch from user_profiles
        badges: [], // fetch from achievements table
        streak: 0, // fetch from user_profiles
        completedLessons: [] // fetch from user_progress
      });
    } else {
      setUser(null);
    }
  }, [supabaseUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
    return !error;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const { error } = await signUp(email, password, name);
    return !error;
  };

  const logout = () => {
    signOut();
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      // Optional: sync updates to Supabase user_profiles table
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
