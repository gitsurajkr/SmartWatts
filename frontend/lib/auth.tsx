'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginData, SignupData } from './types';
import * as api from './api';
import { useStore } from './store';
import { useAIStore } from './aiStore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartwatts_token');
    const storedUser = localStorage.getItem('smartwatts_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('smartwatts_token');
        localStorage.removeItem('smartwatts_user');
      }
      // Validate token in background
      api.getMe().then((u) => {
        setUser(u);
        localStorage.setItem('smartwatts_user', JSON.stringify(u));
      }).catch(() => {
        setUser(null);
        localStorage.removeItem('smartwatts_token');
        localStorage.removeItem('smartwatts_user');
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginData) => {
    const result = await api.login(data);
    localStorage.setItem('smartwatts_token', result.token);
    localStorage.setItem('smartwatts_user', JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const signupFn = useCallback(async (data: SignupData) => {
    const result = await api.signup(data);
    localStorage.setItem('smartwatts_token', result.token);
    localStorage.setItem('smartwatts_user', JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('smartwatts_token');
    localStorage.removeItem('smartwatts_user');
    setUser(null);
    useStore.getState().reset();
    useAIStore.getState().reset();
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup: signupFn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
