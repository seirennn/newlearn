'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Github } from 'lucide-react';
import NoiseBackground from '@/components/ui/noise-background';
import FluidBackground from '@/components/ui/fluid-background';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your signin logic here
    setTimeout(() => setIsLoading(false), 1500); // Simulate loading
  };

  return (
    <div className="relative min-h-screen w-full bg-[#131313] flex items-center justify-center overflow-hidden">
      <NoiseBackground />
      <FluidBackground />
      
      <div className="relative z-10 w-full max-w-md px-8">
        <div className="backdrop-blur-xl bg-[#1a1a1a]/80 rounded-2xl border border-zinc-800 shadow-2xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-100">Welcome back</h1>
            <p className="text-zinc-400">Sign in to your account to continue</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="hello@example.com"
                className="w-full px-3 py-2 bg-[#202020] border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 bg-[#202020] border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all text-zinc-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-[#131313] rounded-lg px-4 py-2 font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="px-4 text-sm text-zinc-500">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <button className="w-full flex items-center justify-center space-x-2 bg-[#202020] hover:bg-[#252525] border border-zinc-800 rounded-lg px-4 py-2 transition-all text-zinc-100">
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </button>
          </div>

          <p className="text-sm text-zinc-400 text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="text-zinc-100 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
