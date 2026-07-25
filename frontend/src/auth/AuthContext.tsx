import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import type { UserProfile } from '../services/authService';
import {
  loginWithEmailApi,
  loginWithGoogleApi,
  logoutUserApi,
} from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('chainiq_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = localStorage.getItem('chainiq_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Subscribe to Firebase Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        localStorage.setItem('chainiq_token', idToken);

        const profile: UserProfile = {
          email: fbUser.email || 'bhanu.sreekar@chainiq.ai',
          name: fbUser.displayName || 'Bhanu Sreekar',
          role: 'Executive Logistics Admin',
          department: 'Global Supply Chain Operations',
          avatar_url: fbUser.photoURL || undefined,
          uid: fbUser.uid,
        };
        setUser(profile);
        localStorage.setItem('chainiq_user', JSON.stringify(profile));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    const res = await loginWithEmailApi(email, password);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('chainiq_token', res.access_token);
    localStorage.setItem('chainiq_user', JSON.stringify(res.user));
  };

  const loginWithGoogle = async () => {
    const res = await loginWithGoogleApi();
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('chainiq_token', res.access_token);
    localStorage.setItem('chainiq_user', JSON.stringify(res.user));
  };

  const logout = () => {
    logoutUserApi().catch(() => {});
    localStorage.removeItem('chainiq_token');
    localStorage.removeItem('chainiq_user');
    setToken(null);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        isAuthenticated: !!token || !!user,
        loading,
        loginWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
