'use client';

import { useTheme } from './theme-context';
import { Upload, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    name: 'Upload Content',
    description: 'Upload any PDF, paste text, or share a YouTube video link.',
    icon: Upload,
  },
  {
    name: 'Interactive Chat',
    description: 'Engage in meaningful conversations with our AI about your content.',
    icon: MessageSquare,
  },
  {
    name: 'Learn & Understand',
    description: 'Get personalized explanations, summaries, and deep insights.',
    icon: Sparkles,
  },
];

export default function HowItWorks() {

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="how-it-works" className={`relative py-24 sm:py-32 ${isDark ? 'dark:bg-black' : 'bg-white'} overflow-hidden`}>
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-[800px] h-[800px] rounded-full 
          ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} 
          blur-[120px] bottom-[-400px] left-[-200px]`} />
        <div className={`absolute w-[600px] h-[600px] rounded-full 
          ${isDark ? 'bg-teal-500/10' : 'bg-teal-500/5'} 
          blur-[100px] top-[-300px] right-[-100px]`} />
      </div>

      {/* Grid Pattern */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${isDark ? '#ffffff0a' : '#8884'}_1px,transparent_1px),linear-gradient(to_bottom,${isDark ? '#ffffff0a' : '#8884'}_1px,transparent_1px)] 
        bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]`} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 
            transition-all duration-300 ring-1 
            ${isDark
              ? 'bg-zinc-800/50 text-zinc-300 ring-zinc-700/50'
              : 'bg-zinc-100 text-zinc-800 ring-zinc-200/50'}`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 
                ${isDark ? 'bg-teal-500' : 'bg-teal-600'}`} />
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Process</span>
          </div>

          <h2 className={`mt-8 text-4xl font-bold tracking-tight sm:text-5xl 
            ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            How it{' '}
            <span className="relative inline-flex flex-col">
              <span className={`absolute -inset-2 rounded-2xl 
                ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'} blur-xl`} />
              <span className="relative">works</span>
            </span>
          </h2>

          <p className={`mt-6 text-lg leading-8 
            ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Learn how our platform helps you master new skills effectively
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300
                  ${isDark
                    ? 'bg-zinc-900/50 hover:bg-zinc-800/50'
                    : 'bg-white hover:bg-zinc-50'} 
                  ring-1 ${isDark ? 'ring-zinc-800' : 'ring-zinc-200'}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg 
                  ${isDark
                    ? 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white'
                    : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-900'}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className={`mt-6 text-xl font-semibold 
                  ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {step.name}
                </h3>
                <p className={`mt-2 text-base leading-7 
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {step.description}
                </p>

                {/* Gradient Border */}
                <div className={`absolute inset-0 rounded-2xl transition duration-300
                  bg-gradient-to-b ${isDark ? 'from-zinc-800/0 via-zinc-800/0 to-zinc-800/30' : 'from-transparent via-transparent to-black/5'}
                  group-hover:opacity-100 opacity-0`} />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/dashboard"
            className={`group relative overflow-hidden rounded-xl px-8 py-3 text-sm font-medium
              shadow-sm transition-all duration-300 
              ${isDark
                ? 'bg-white text-zinc-900 hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/10'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/10'
              } hover:-translate-y-1`}
          >
            <span className="relative flex items-center gap-2">
              Get Started Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
