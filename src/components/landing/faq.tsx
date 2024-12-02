'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const faqs = [
  {
    question: 'What types of content can I use with LearnFlow?',
    answer: 'LearnFlow supports various content formats including PDFs, text documents, and YouTube videos. You can easily upload documents, paste text directly, or share video links to start learning.',
  },
  {
    question: 'How does the AI-powered learning assistant work?',
    answer: 'Our AI learning assistant uses advanced natural language processing to analyze your content and engage in meaningful conversations. It can provide explanations, summaries, and answer questions specific to your learning materials.',
  },
  {
    question: 'Is my content secure and private?',
    answer: 'Yes, we take privacy seriously. Your uploaded content is encrypted and securely stored. We never share your personal data or learning materials with third parties.',
  },
  {
    question: 'Can I use LearnFlow for different subjects?',
    answer: 'Absolutely! LearnFlow is designed to work with any subject matter. Whether you&apos;re studying science, history, literature, or any other topic, our AI can help you understand and learn effectively.',
  },
  {
    question: 'What makes LearnFlow different from other learning platforms?',
    answer: 'LearnFlow combines AI technology with interactive learning in a unique way. Instead of passive reading, you can engage in dynamic conversations about your content, getting personalized explanations and insights.',
  },
];

export default function FAQ() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`relative py-24 sm:py-32 ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-500`}>
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-[800px] h-[800px] rounded-full 
          ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} 
          blur-[120px] bottom-[-400px] left-[-200px] transition-colors duration-500`} />
        <div className={`absolute w-[600px] h-[600px] rounded-full 
          ${isDark ? 'bg-teal-500/10' : 'bg-teal-500/5'} 
          blur-[100px] top-[-300px] right-[-100px] transition-colors duration-500`} />
      </div>

      {/* Grid Pattern */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${isDark ? '#ffffff0a' : '#8884'}_1px,transparent_1px),linear-gradient(to_bottom,${isDark ? '#ffffff0a' : '#8884'}_1px,transparent_1px)] 
        bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] transition-colors duration-500`} />

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
            <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>FAQ</span>
          </div>

          <h2 className={`mt-8 text-4xl font-bold tracking-tight sm:text-5xl transition-colors duration-500 
            ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Frequently asked{' '}
            <span className="relative inline-flex flex-col">
              <span className={`absolute -inset-2 rounded-2xl transition-colors duration-500 
                ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'} blur-xl`} />
              <span className="relative">questions</span>
            </span>
          </h2>

          <p className={`mt-6 text-lg leading-8 transition-colors duration-500 
            ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Find answers to common questions about our platform and how it can help you learn more effectively
          </p>
        </div>

        {/* FAQ List */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 
                  ${isDark 
                    ? 'bg-zinc-900/50 hover:bg-zinc-800/50' 
                    : 'bg-white hover:bg-zinc-50'} 
                  ${openIndex === index 
                    ? `ring-2 ${isDark ? 'ring-teal-500/20' : 'ring-teal-500/30'}` 
                    : `ring-1 ${isDark ? 'ring-zinc-800' : 'ring-zinc-200'}`}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-6"
                >
                  <span className={`text-lg font-medium text-left transition-colors duration-500 
                    ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {faq.question}
                  </span>
                  <span className={`ml-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full 
                    transition-all duration-500
                    ${isDark 
                      ? 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white' 
                      : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-900'}`}>
                    {openIndex === index ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-6 text-base leading-7 transition-colors duration-500 
                        ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gradient Border */}
                <div className={`absolute inset-0 rounded-2xl transition duration-500
                  bg-gradient-to-b ${isDark ? 'from-zinc-800/0 via-zinc-800/0 to-zinc-800/30' : 'from-transparent via-transparent to-black/5'}
                  group-hover:opacity-100 opacity-0`} />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <p className={`text-base transition-colors duration-500 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Can't find what you're looking for?{' '}
            <Link
              href="mailto:support@learnflow.ai"
              className={`relative inline-flex font-medium group transition-colors duration-500
                ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-500'}`}
            >
              Contact our support team
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 
                transition-all duration-500 group-hover:w-full
                ${isDark ? 'bg-teal-400' : 'bg-teal-600'}`} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
