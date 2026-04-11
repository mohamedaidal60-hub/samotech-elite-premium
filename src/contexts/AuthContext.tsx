import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.full_name || 'User',
            role: profile.role as Role
          });
        }
      } else {
        // Check local storage for super admin session
        const saved = localStorage.getItem('gp_user');
        if (saved) setUser(JSON.parse(saved));
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.full_name || 'User',
            role: profile.role as Role
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('gp_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      // 1. Check Super Admin Hardcoded
      if (email === 'aidalmimo@gmail.com' && pass === '@sba-Trs40') {
        const superUser: User = {
          id: 'super-admin-id',
          email,
          name: 'Directeur Général',
          role: 'super_admin'
        };
        setUser(superUser);
        localStorage.setItem('gp_user', JSON.stringify(superUser));
        setIsLoading(false);
        return;
      }

      // 2. Real Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('gp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
