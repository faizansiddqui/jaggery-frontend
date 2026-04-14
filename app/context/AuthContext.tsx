'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getUserSession, setUserSession, clearUserSession, UserSession } from '@/app/lib/session';
import { fetchUserProfile, sendOtp, verifyOtp } from '@/app/lib/apiClient';

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginStep: 'email' | 'otp';
  loginEmail: string;
  error: string | null;
  returnUrl: string;
  setReturnUrl: (url: string) => void;
  sendLoginOtp: (email: string) => Promise<void>;
  verifyLoginOtp: (otp: string) => Promise<void>;
  logout: () => void;
  resetLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginStep, setLoginStep] = useState<'email' | 'otp'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState('/user/profile');

  useEffect(() => {
    const session = getUserSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;

    const validateAccess = async () => {
      try {
        await fetchUserProfile();
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (!cancelled && /blocked|auth|unauthorized|forbidden/i.test(message)) {
          clearUserSession();
          setUser(null);
          setError(message || 'You are blocked. Please contact support.');
        }
      }
    };

    validateAccess();
    const timer = window.setInterval(validateAccess, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [user?.email]);

  const sendLoginOtp = useCallback(async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await sendOtp(email);
      setLoginEmail(email);
      setLoginStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyLoginOtp = useCallback(async (otp: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await verifyOtp(loginEmail, otp);
      const session: UserSession = {
        token: result.token,
        email: result.email,
      };
      setUserSession(session);
      setUser(session);
      setLoginStep('email');
      setLoginEmail('');
      // Redirect to return URL or profile page
      window.location.href = returnUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  }, [loginEmail, returnUrl]);

  const logout = useCallback(() => {
    clearUserSession();
    setUser(null);
    setLoginStep('email');
    setLoginEmail('');
    setError(null);
    window.location.href = '/';
  }, []);

  const resetLogin = useCallback(() => {
    setLoginStep('email');
    setLoginEmail('');
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: Boolean(user?.token && user?.email),
    loginStep,
    loginEmail,
    error,
    returnUrl,
    setReturnUrl,
    sendLoginOtp,
    verifyLoginOtp,
    logout,
    resetLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth(redirectPath = '/user/auth') {
  const { isAuthenticated, isLoading, setReturnUrl } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      // Store current page as return URL before redirecting to login
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath && !currentPath.startsWith('/user/auth')) {
        setReturnUrl(currentPath);
      }
      if (window.location.pathname !== redirectPath) {
        window.location.replace(redirectPath);
      }
    }
  }, [isAuthenticated, isLoading, redirectPath, setReturnUrl]);

  return { isAuthenticated, isLoading };
}

// Hook to prevent logged-in users from accessing auth pages
export function useRedirectIfAuth(redirectPath = '/user/profile') {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && typeof window !== 'undefined') {
      window.location.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectPath]);

  return { isAuthenticated, isLoading };
}
