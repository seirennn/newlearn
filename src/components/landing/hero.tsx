'use client';

import Link from 'next/link';
import { Brain, Book, Settings, FlaskConical, GraduationCap, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-context';

const features = [
  {
    icon: Brain,
    name: 'AI Quiz',
    description: 'Test your knowledge with AI-generated quizzes on any topic.',
    href: '/quiz',
  },
  {
    icon: FlaskConical,
    name: 'Flashcards',
    description: 'Create and study with AI-powered flashcards.',
    href: '/flashcards',
  },
  {
    icon: Book,
    name: 'Study Notes',
    description: 'Generate comprehensive study notes and summaries.',
    href: '/notes',
  },
  {
    icon: Settings,
    name: 'Settings',
    description: 'Customize your AI learning experience.',
    href: '/settings',
  },
];

export default function Hero() {
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
        <div className={`${
          isDark 
            ? 'bg-[#111111]/80 border-[#1a1a1a]' 
            : 'bg-white/80 border-gray-200'
          } backdrop-blur-lg border rounded-2xl shadow-lg transition-colors duration-300`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            <Link href="/" className="flex items-center space-x-3">
              <GraduationCap className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                StudyBuddy
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className={`text-sm ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors flex items-center space-x-2 group`}
                >
                  <feature.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{feature.name}</span>
                </Link>
              ))}
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDark
                    ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          {/* Main Content */}
          <div className="text-center mb-20">
            <h1 className={`text-5xl md:text-7xl font-bold mb-8 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your
              <span className={isDark 
                ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 text-transparent bg-clip-text'
                : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 text-transparent bg-clip-text'
              }> AI-Powered </span>
              Study Companion
            </h1>
            <p className={`text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
              Enhance your learning experience with intelligent study tools. Master any subject with AI assistance.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link 
                href="/quiz" 
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isDark 
                    ? 'bg-white text-[#080808] hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Get Started
              </Link>
              <Link 
                href="/about" 
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isDark
                    ? 'border border-[#1a1a1a] hover:bg-[#111111]'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link key={feature.name} href={feature.href}>
                <div className={`group relative rounded-xl border p-6 transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-b from-[#111111] to-[#0c0c0c] border-[#1a1a1a] hover:border-[#2a2a2a]'
                    : 'bg-gradient-to-b from-white to-gray-50 border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex flex-col h-full">
                    <div className={`mb-4 inline-flex p-2 rounded-lg transition-transform group-hover:scale-110 ${
                      isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                    }`}>
                      <feature.icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDark 
                        ? 'text-white group-hover:text-gray-200'
                        : 'text-gray-900 group-hover:text-gray-700'
                    }`}>
                      {feature.name}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      isDark 
                        ? 'text-gray-400 group-hover:text-gray-300'
                        : 'text-gray-600 group-hover:text-gray-500'
                    }`}>
                      {feature.description}
                    </p>
                    
                    <div className={`mt-auto flex items-center group-hover:translate-x-1 transition-transform ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
