'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Github } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic will be implemented later
  };

  return (
    <div className="relative w-full max-w-md  mx-auto z-10">
      {/* Auth Card */}
      <div className="backdrop-blur-2xl bg-black/40 border border-zinc-800/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/5 to-zinc-900/5 pointer-events-none" />
        
        {/* Card Header */}
        <div className="relative flex flex-col items-center justify-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Create an account
          </h2>
          <p className="text-sm text-zinc-400">
            Sign up to get started with LearnFlow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg px-3 py-2.5 text-sm bg-black/50 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700 border focus:outline-none focus:ring-2 focus:ring-zinc-700/10 transition-all hover:bg-black/70"
              />
            </div>
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
                className="mt-1 block w-full rounded-lg px-3 py-2.5 text-sm bg-black/50 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700 border focus:outline-none focus:ring-2 focus:ring-zinc-700/10 transition-all hover:bg-black/70"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg px-3 py-2.5 text-sm bg-black/50 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700 border focus:outline-none focus:ring-2 focus:ring-zinc-700/10 transition-all hover:bg-black/70"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              className="relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-700 transition-all"
            >
              Create account
            </button>

            <button
              type="button"
              className="relative w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-lg bg-black/50 hover:bg-black/70 text-white border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-700 transition-all hover:border-zinc-700 group"
            >
              <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Continue with GitHub
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-zinc-500">
          By signing up, you agree to our{' '}
          <Link href="#" className="underline hover:text-zinc-400">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-zinc-400">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
