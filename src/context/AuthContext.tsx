import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  userAvatar: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { full_name: string; email: string; password: string; confirm_password: string }) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserAvatar: (avatarId: string) => void;
  uploadCustomAvatar: (dataUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mindmate_token'));
  const [userAvatar, setUserAvatarState] = useState<string>(() => {
    return localStorage.getItem('mindmate_user_avatar') || 'boy-gamer';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setUserAvatar = useCallback((avatarId: string) => {
    setUserAvatarState(avatarId);
    localStorage.setItem('mindmate_user_avatar', avatarId);
  }, []);

  const uploadCustomAvatar = useCallback((dataUrl: string) => {
    setUserAvatarState(dataUrl);
    localStorage.setItem('mindmate_user_avatar', dataUrl);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mindmate_token');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('mindmate_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (err) {
      console.warn('Session check failed, logging out:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('mindmate_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
  }) => {
    setIsLoading(true);
    try {
      const data = await api.register(formData);
      localStorage.setItem('mindmate_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const data = await api.loginDemo();
      localStorage.setItem('mindmate_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    await api.deleteAccount();
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userAvatar,
        isLoading,
        login,
        register,
        loginDemo,
        logout,
        deleteAccount,
        refreshUser,
        setUserAvatar,
        uploadCustomAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
