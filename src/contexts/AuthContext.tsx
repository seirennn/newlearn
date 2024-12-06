'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthService } from '@/lib/services/auth.service';
import { UserProfile } from '@/types/auth';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { getAuthErrorMessage } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profile = await AuthService.getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      await AuthService.logLoginActivity(
        user.uid,
        email,
        'email',
        'signin',
        true
      );

      toast.success('Signed in successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = getAuthErrorMessage((error as AuthError).code);
        toast.error(errorMessage);
        console.error('Signin error:', error);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      await AuthService.createUserProfile(
        user.uid,
        email,
        fullName,
        user.photoURL || '',
        'email'
      );

      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = getAuthErrorMessage((error as AuthError).code);
        toast.error(errorMessage);
        console.error('Signup error:', error);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { user } = userCredential;

      const userProfile = await AuthService.getUserProfile(user.uid);
      if (!userProfile) {
        await AuthService.createUserProfile(
          user.uid,
          user.email || '',
          user.displayName || '',
          user.photoURL || '',
          'google'
        );
      } else {
        await AuthService.logLoginActivity(
          user.uid,
          user.email || '',
          'google',
          'signin',
          true
        );
      }

      toast.success('Signed in with Google successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = getAuthErrorMessage((error as AuthError).code);
        toast.error(errorMessage);
        console.error('Google sign in error:', error);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is first time sign in
      const profile = await AuthService.getUserProfile(result.user.uid);
      if (!profile) {
        await AuthService.createUserProfile(
          result.user.uid,
          result.user.email!,
          result.user.displayName!,
          result.user.photoURL!,
          'apple'
        );
      } else {
        await AuthService.logLoginActivity(
          result.user.uid,
          result.user.email!,
          'apple',
          'signin',
          true
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = getAuthErrorMessage((error as AuthError).code);
        toast.error(errorMessage);
        console.error('Apple sign in error:', error);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const signout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await AuthService.logLoginActivity(
          user.uid,
          user.email || '',
          'email',
          'logout',
          true
        );
      }
      await signOut(auth);
      toast.success('Signed out successfully');
      router.push('/signin');
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = getAuthErrorMessage((error as AuthError).code);
        toast.error(errorMessage);
        console.error('Signout error:', error);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user) {
      await AuthService.updateUserProfile(user.uid, data);
      const updatedProfile = await AuthService.getUserProfile(user.uid);
      setUserProfile(updatedProfile);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signin,
    signup,
    signInWithGoogle,
    signInWithApple,
    signout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
