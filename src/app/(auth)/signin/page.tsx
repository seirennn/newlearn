'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { BsApple } from 'react-icons/bs';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signin(email, password);
      toast.success('Successfully signed in!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        toast.error('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in with Google');
      } else {
        toast.error('Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithApple();
      toast.success('Successfully signed in with Apple!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in with Apple');
      } else {
        toast.error('Failed to sign in with Apple');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10">
      <div className="backdrop-blur-xl bg-zinc-900/30 border border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="relative flex flex-col items-center justify-center mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-sm text-zinc-400">Sign in to continue to LearnFlow</p>
        </div>

        <div className="space-y-6">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition-all hover:bg-white/10"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </button>
            <button
              onClick={handleAppleSignIn}
              disabled={loading}
              className="group flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition-all hover:bg-white/10"
            >
              <BsApple className="w-5 h-5 mr-2" />
              Apple
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-zinc-900/30 px-2 text-zinc-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 backdrop-blur-xl transition-all focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 backdrop-blur-xl transition-all focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-white focus:ring-1 focus:ring-white/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-zinc-400 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-zinc-300 hover:text-white transition-colors">
            Sign up
            
          </Link>
        </p>
      </div>
    </div>
  );
}
