'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTheme } from './theme-context';
import { useId } from 'react';

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const patternId = useId();
  const lineGradientId = useId();
  const bottomGradientId = useId();
  const middleGradientId = useId();
  
  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-500 overflow-hidden`}>
     
      {/* Decorative line pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg 
          aria-hidden="true"
          className="absolute w-full h-screen"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            <linearGradient
              id={lineGradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.15" : "0.4"} />
              <stop offset="50%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.2" : "0.3"} />
              <stop offset="100%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.15" : "0.2"} />
            </linearGradient>
            <linearGradient
              id={bottomGradientId}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop offset="0%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.15" : "0.4"} />
              <stop offset="50%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.2" : "0.3"} />
              <stop offset="100%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.15" : "0.2"} />
            </linearGradient>
            <linearGradient
              id={middleGradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.08" : "0.08"} />
              <stop offset="50%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.05" : "0.05"} />
              <stop offset="100%" stopColor={isDark ? '#b1b3b5' : '#4B5563'} stopOpacity={isDark ? "0.08" : "0.08"} />
            </linearGradient>
          </defs>
          
          {/* Top Pattern */}
          <g className={isDark ? "opacity-30" : "opacity-20"}>
            {/* Main trapezoid shape */}
            <path
              d="M0 100 L400 180 L800 180 L1200 100 L1200 0 L0 0 Z"
              fill="none"
              stroke={`url(#${lineGradientId})`}
              strokeWidth="2"
            />
            
            {/* Decorative inner trapezoid */}
            <path
              d="M100 50 L450 140 L750 140 L1100 50"
              fill="none"
              stroke={isDark ? '#E5E7EB' : '#1F2937'}
              strokeWidth="1"
            />
          </g>
          
          {/* Middle faded lines */}
          <g className={isDark ? "opacity-40" : "opacity-50"}>
            {Array.from({ length: 4 }).map((_, i) => (
              <path
                key={`middle-${i}`}
                d={`M${200 + i * 250} 180 L${300 + i * 250} 500`}
                stroke={`url(#${middleGradientId})`}
                strokeWidth="1"
                fill="none"
              />
            ))}
          </g>
          
          {/* Bottom Pattern - Moved up */}
          <g className={isDark ? "opacity-90" : "opacity-90"} transform="translate(0, 500)">
            {/* Main bottom trapezoid shape */}
            <path
              d="M0 80 L400 0 L800 0 L1200 80 L1200 180 L0 180 Z"
              fill="none"
              stroke={`url(#${bottomGradientId})`}
              strokeWidth="2"
            />
            
            {/* Decorative inner bottom trapezoid */}
            <path
              d="M100 130 L450 40 L750 40 L1100 130"
              fill="none"
              stroke={isDark ? '#E5E7EB' : '#1F2937'}
              strokeWidth="1"
            />

            {/* Additional bottom lines */}
            <path
              d="M200 20 C400 60, 800 60, 1000 20"
              fill="none"
              stroke={isDark ? '#E5E7EB' : '#1F2937'}
              strokeWidth="1"
            />
            <path
              d="M300 100 C500 140, 700 140, 900 100"
              fill="none"
              stroke={isDark ? '#E5E7EB' : '#1F2937'}
              strokeWidth="1"
            />
          </g>
          
          {/* Vertical lines spanning full height with fade in middle */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} className={isDark ? "opacity-40" : "opacity-30"}>
              {/* Top section of vertical line */}
              <path
                d={`M${150 + i * 130} 0 L${150 + i * 130} 180`}
                stroke={isDark ? '#E5E7EB' : '#4B5563'}
                strokeWidth="1"
                fill="none"
              />
              
              {/* Bottom section of vertical line */}
              <path
                d={`M${150 + i * 130} 500 L${150 + i * 130} 680`}
                stroke={isDark ? '#E5E7EB' : '#4B5563'}
                strokeWidth="1"
                fill="none"
              />
              
              {/* Decorative elements for top */}
              <circle cx={150 + i * 130} cy={90} r="2" fill={isDark ? '#E5E7EB' : '#4B5563'} />
              <path
                d={`M${150 + i * 130 - 5} 60 L${150 + i * 130 + 5} 60`}
                stroke={isDark ? '#E5E7EB' : '#4B5563'}
                strokeWidth="1"
              />
              
              {/* Decorative elements for bottom */}
              <circle cx={150 + i * 130} cy={590} r="2" fill={isDark ? '#E5E7EB' : '#4B5563'} />
              <path
                d={`M${150 + i * 130 - 5} 620 L${150 + i * 130 + 5} 620`}
                stroke={isDark ? '#E5E7EB' : '#4B5563'}
                strokeWidth="1"
              />
            </g>
          ))}
          
          {/* Diagonal accents - top */}
          <path
            d="M300 0 L400 180"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          <path
            d="M900 0 L800 180"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          
          {/* Diagonal accents - bottom */}
          <path
            d="M300 680 L400 500"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          <path
            d="M900 680 L800 500"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          
          {/* Decorative corner elements - top */}
          <path
            d="M0 0 C50 30, 100 30, 150 0"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          <path
            d="M1050 0 C1100 30, 1150 30, 1200 0"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          
          {/* Decorative corner elements - bottom */}
          <path
            d="M0 680 C50 650, 100 650, 150 680"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
          <path
            d="M1050 680 C1100 650, 1150 650, 1200 680"
            fill="none"
            stroke={isDark ? '#E5E7EB' : '#4B5563'}
            strokeWidth="1"
            className={isDark ? "opacity-40" : "opacity-30"}
          />
        </svg>
      </div>

      {/* Existing dot pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg 
          aria-hidden="true" 
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern
              id={patternId}
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
              className={isDark ? '[fill:#6b6e73] [opacity:0.0005]' : '[fill:#6B7280] [opacity:0.005]'}
            >
              <circle cx="1" cy="1" r="0.8" />
            </pattern>

            {/* Base fade for all dots */}
            <linearGradient id="fade-all" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.6" />
            </linearGradient>

            {/* Bottom center fade */}
            <linearGradient id="fade-bottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.5" />
              <stop offset="40%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.9" />
              <stop offset="80%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.9" />
            </linearGradient>

            {/* Left side fade */}
            <linearGradient id="fade-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.95" />
              <stop offset="40%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0" />
            </linearGradient>

            {/* Right side fade */}
            <linearGradient id="fade-right" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.95" />
              <stop offset="40%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0" />
            </linearGradient>

            {/* Bottom left corner fade */}
            <radialGradient id="fade-bottom-left" cx="0" cy="1" r="1">
              <stop offset="0%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.9" />
              <stop offset="50%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0" />
            </radialGradient>

            {/* Bottom right corner fade */}
            <radialGradient id="fade-bottom-right" cx="1" cy="1" r="1">
              <stop offset="0%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.9" />
              <stop offset="50%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={isDark ? 'black' : 'white'} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base pattern */}
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />

          {/* Fade overlays */}
          <g className="opacity-95">
            {/* Base fade for all dots */}
            <rect width="100%" height="100%" fill="url(#fade-all)" />
            
            {/* Side fades */}
            <rect 
              width="40%" 
              height="100%" 
              fill="url(#fade-left)" 
            />
            <rect 
              x="60%"
              width="40%" 
              height="100%" 
              fill="url(#fade-right)" 
            />
            
            {/* Bottom center fade */}
            <rect 
              width="100%" 
              height="80%" 
              y="20%" 
              fill="url(#fade-bottom)" 
            />
            
            {/* Bottom corner fades */}
            <rect 
              x="0" 
              y="30%" 
              width="50%" 
              height="70%" 
              fill="url(#fade-bottom-left)" 
            />
            <rect 
              x="50%" 
              y="30%" 
              width="50%" 
              height="70%" 
              fill="url(#fade-bottom-right)" 
            />
          </g>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative pt-32 pb-20 sm:pt-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-full lg:mx-0 flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              <div className={`inline-flex items-center space-x-3 rounded-full px-5 py-2
                transition-all duration-300 ring-1 backdrop-blur-sm
                ${isDark 
                  ? 'bg-zinc-900/70 text-zinc-200 ring-zinc-700/80 hover:bg-zinc-800/90 hover:ring-zinc-600' 
                  : 'bg-white/80 text-zinc-700 ring-zinc-200/80 hover:bg-white/90 hover:ring-zinc-300'
                }`}
              >
                <div className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isDark ? 'bg-emerald-400/40' : 'bg-emerald-500/40'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isDark ? 'bg-emerald-400' : 'bg-emerald-500'
                  }`} />
                </div>
                <span className="text-sm font-medium tracking-wide">Beta Preview</span>
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
                    <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-full h-[0.6em] w-full fill-teal-500/25" preserveAspectRatio="none">
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
