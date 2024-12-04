'use client';

import Link from 'next/link';
import { Brain, Book, Settings, FlaskConical, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-context';

export default function Hero() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-500`}>
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full 
          bg-purple-500/5
          blur-[120px] bottom-[-400px] left-[-200px] transition-colors duration-500" />
        <div className="absolute w-[600px] h-[600px] rounded-full 
          bg-teal-500/5
          blur-[100px] top-[-300px] right-[-100px] transition-colors duration-500" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8884_1px,transparent_1px),linear-gradient(to_bottom,#8884_1px,transparent_1px)] 
        bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Hero Content */}
      <div className="relative pt-32 pb-20 sm:pt-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-full lg:mx-0 flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 
                transition-all duration-300 ring-1 
                ${isDark 
                  ? 'bg-zinc-800/50 text-zinc-300 ring-zinc-700/50 hover:bg-zinc-800 hover:ring-zinc-700' 
                  : 'bg-zinc-100 text-zinc-800 ring-zinc-200/50 hover:bg-zinc-200 hover:ring-zinc-300'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isDark ? 'bg-teal-400' : 'bg-teal-500'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isDark ? 'bg-teal-500' : 'bg-teal-600'
                  }`} />
                </span>
                <span className="text-sm font-medium">Your Ultimate Learning Companion</span>
              </div>

              <h1 className={`mt-8 font-semibold tracking-tight text-5xl sm:text-6xl leading-[1.1] 
                ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Elevate Your Learning with{' '}
                <span className="relative inline-flex flex-col">
                  <span className={`absolute -inset-1 rounded-lg ${
                    isDark ? 'bg-teal-500/10' : 'bg-teal-50'
                  } blur-md`} />
                  <span className="relative">
                    AI-Powered
                    <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-full h-[0.6em] w-full fill-teal-500/10" preserveAspectRatio="none">
                      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                    </svg>
                  </span>
                </span>{' '}
                Insights
              </h1>

              <p className={`mt-8 text-xl leading-8 ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              } max-w-xl`}>
                Upload PDFs, paste text, or share YouTube videos. Our AI-powered platform helps you understand, 
                analyze, and learn from any content through interactive conversations.
              </p>

              <div className="mt-10 flex items-center gap-x-6">
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
                    Get Started 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="#features"
                  className={`group inline-flex items-center gap-2 text-sm font-medium transition-all duration-300
                    ${isDark 
                      ? 'text-zinc-400 hover:text-zinc-200' 
                      : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                  Learn more
                  <span className="relative mt-px h-px w-5 bg-current transition-all group-hover:w-8" />
                </Link>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-3xl">
              <div className={`relative rounded-2xl overflow-hidden
                ${isDark 
                  ? 'ring-1 ring-white/10 bg-zinc-900' 
                  : 'ring-1 ring-black/5 bg-white/70'
                } backdrop-blur-sm shadow-2xl`}
              >
                {/* Browser-like Top Bar */}
                <div className={`flex items-center gap-2 px-4 py-3 border-b
                  ${isDark ? 'border-white/10' : 'border-black/5'}`}
                >
                  <div className="flex gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
                  </div>
                </div>

                {/* Video Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/dashboard-preview.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
