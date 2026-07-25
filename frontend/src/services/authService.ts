import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import api from './api';

export interface UserProfile {
  email: string;
  name: string;
  role: string;
  department?: string;
  avatar_url?: string;
  uid?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export async function loginWithEmailApi(email: string, password: string): Promise<TokenResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    const token = await fbUser.getIdToken();

    const userProfile: UserProfile = {
      email: fbUser.email || email,
      name: fbUser.displayName || 'Bhanu Sreekar',
      role: 'Executive Logistics Admin',
      department: 'Global Supply Chain Operations',
      avatar_url: fbUser.photoURL || undefined,
      uid: fbUser.uid,
    };

    return {
      access_token: token,
      token_type: 'Bearer',
      user: userProfile,
    };
  } catch (error) {
    throw error;
  }
}

export async function loginWithGoogleApi(): Promise<TokenResponse> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const token = await fbUser.getIdToken();

    const userProfile: UserProfile = {
      email: fbUser.email || 'bhanu.sreekar@chainiq.ai',
      name: fbUser.displayName || 'Bhanu Sreekar',
      role: 'Executive Logistics Admin',
      department: 'Global Supply Chain Operations',
      avatar_url: fbUser.photoURL || undefined,
      uid: fbUser.uid,
    };

    return {
      access_token: token,
      token_type: 'Bearer',
      user: userProfile,
    };
  } catch (error: any) {
    throw error;
  }
}

export async function logoutUserApi(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (e) {}
  try {
    await api.post('/auth/logout');
  } catch (e) {}
}

export async function getCurrentUserApi(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/auth/me');
  return response.data;
}
