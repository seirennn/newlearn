'use client';

import { useTheme } from './theme-context';
import { 
  BookOpen, 
  MessageSquareText, 
  Youtube, 
  FileText, 
  Sparkles, 
  Brain,
  Zap,
  Share2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    name: 'Smart PDF Analysis',
    description: 'Upload PDFs and get instant, AI-powered insights and summaries.',
    icon: FileText,
  },
  {
    name: 'YouTube Integration',
    description: 'Extract and analyze content from YouTube videos effortlessly.',
    icon: Youtube,
  },
  {
    name: 'Interactive Chat',
    description: 'Engage in meaningful conversations about your content with our AI.',
    icon: MessageSquareText,
  },
  {
    name: 'Text Processing',
    description: 'Paste any text and transform it into structured learning material.',
    icon: BookOpen,
  },
  {
    name: 'AI-Powered Insights',
    description: 'Get deep understanding with advanced AI analysis and explanations.',
    icon: Brain,
  },
  {
    name: 'Quick Summaries',
    description: 'Generate concise summaries of complex content in seconds.',
    icon: Zap,
  },
  {
    name: 'Smart Sharing',
    description: 'Share your insights and learning materials with others easily.',
    icon: Share2,
  },
  {
    name: 'Custom Learning',
    description: 'Personalized learning experience tailored to your needs.',
    icon: Sparkles,
  },
];

export default function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="features" className={`relative py-24 sm:py-32 ${isDark ? 'bg-black' : 'bg-white'} overflow-hidden`}>
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-[800px] h-[800px] rounded-full 
          ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} 
          blur-[120px] top-[-400px] right-[-200px]`} />
        <div className={`absolute w-[600px] h-[600px] rounded-full 
          ${isDark ? 'bg-teal-500/10' : 'bg-teal-500/5'} 
          blur-[100px] bottom-[-300px] left-[-100px]`} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8884_1px,transparent_1px),linear-gradient(to_bottom,#8884_1px,transparent_1px)] 
        bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

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
            <span className="text-sm font-medium">Powerful Features</span>
          </div>

          <h2 className={`mt-8 text-4xl font-bold tracking-tight sm:text-5xl 
            ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Everything you need to{' '}
            <span className="relative inline-flex flex-col">
              <span className={`absolute -inset-2 rounded-2xl 
                ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'} blur-xl`} />
              <span className="relative">learn effectively</span>
            </span>
          </h2>

          <p className={`mt-6 text-lg leading-8 
            ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Our platform combines cutting-edge AI technology with intuitive design 
            to create a seamless learning experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`group relative overflow-hidden rounded-3xl p-8
                transition-all duration-300 
                ${isDark 
                  ? 'bg-zinc-900/50 hover:bg-zinc-800/50 ring-1 ring-white/10' 
                  : 'bg-white hover:bg-zinc-50 ring-1 ring-zinc-200'} 
                hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Feature Icon */}
              <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl
                transition-all duration-300 group-hover:scale-110
                ${isDark 
                  ? 'bg-zinc-800 text-teal-400 ring-1 ring-zinc-700' 
                  : 'bg-zinc-100 text-teal-600 ring-1 ring-zinc-200'}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="mt-6 space-y-2">
                <h3 className={`text-xl font-semibold 
                  ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {feature.name}
                </h3>
                <p className={`text-base leading-7 
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {feature.description}
                </p>
              </div>

              {/* Gradient Hover Effect */}
              <div className="absolute inset-0 rounded-3xl transition duration-300
                bg-gradient-to-b from-transparent via-transparent to-black/5 
                group-hover:opacity-100 opacity-0" />
            </div>
          ))}
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
              Explore Features
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
