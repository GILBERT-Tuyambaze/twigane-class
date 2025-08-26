import React, { createContext, useContext, useEffect, useState } from 'react';

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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('twigane_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - in real app, this would call Supabase
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isAdmin: email === 'admin@twigane.com',
        xp: 150,
        level: 'Leaf',
        badges: ['First Steps', 'HTML Master'],
        streak: 5,
        completedLessons: ['html-1', 'html-2', 'css-1']
      };
      
      setUser(mockUser);
      localStorage.setItem('twigane_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Mock registration - in real app, this would call Supabase
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isAdmin: false,
        xp: 0,
        level: 'Seed',
        badges: [],
        streak: 0,
        completedLessons: []
      };
      
      setUser(newUser);
      localStorage.setItem('twigane_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('twigane_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('twigane_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};