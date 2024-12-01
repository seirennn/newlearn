'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Book, Settings, FlaskConical, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    name: 'AI Quiz',
    description: 'Test your knowledge with AI-generated quizzes on any topic.',
    href: '/quiz',
    color: 'from-violet-600 to-indigo-600',
  },
  {
    icon: FlaskConical,
    name: 'Flashcards',
    description: 'Create and study with AI-powered flashcards.',
    href: '/flashcards',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    icon: Book,
    name: 'Study Notes',
    description: 'Generate comprehensive study notes and summaries.',
    href: '/notes',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    icon: Settings,
    name: 'Settings',
    description: 'Customize your AI learning experience.',
    href: '/settings',
    color: 'from-orange-600 to-red-600',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
        <div className="bg-[#0c0c0c]/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-violet-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text">
                StudyBuddy
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <feature.icon className="w-4 h-4" />
                  <span>{feature.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-gradient"
            >
              Your AI Study Companion
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              Enhance your learning experience with AI-powered study tools. Generate quizzes, create flashcards, and master any subject with intelligent assistance.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <Link key={feature.name} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  className="group relative bg-[#0c0c0c]/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:bg-white/5 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${feature.color} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                  
                  <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-violet-500/20 blur-[128px] animate-pulse" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[96px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full bg-purple-500/20 blur-[112px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
