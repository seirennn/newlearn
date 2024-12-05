'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './theme-context';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

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
    answer: 'LearnFlow is designed to work with any subject matter. Whether you&apos;re studying science, history, literature, or any other topic, our AI can help you understand and learn effectively.',
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
    <section id="faq" className={cn(
      "relative py-24 sm:py-32 overflow-hidden scroll-mt-32",
      isDark ? "bg-black" : "bg-white"
    )}>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 
              transition-all duration-300 ring-1 
              ${isDark
                ? 'bg-zinc-800/50 text-zinc-300 ring-zinc-700/50'
                : 'bg-zinc-100 text-zinc-800 ring-zinc-200/50'}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 
                ${isDark ? 'bg-teal-500' : 'bg-teal-600'}`} />
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>FAQ</span>
          </motion.div>

          <motion.h2 
            className={`mt-8 text-4xl font-bold tracking-tight sm:text-5xl transition-colors duration-500 
              ${isDark ? 'text-white' : 'text-zinc-900'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Frequently asked{' '}
            <span className="relative inline-flex flex-col">
              <span className={`absolute -inset-2 rounded-2xl transition-colors duration-500 
                ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'} blur-xl`} />
              <span className="relative">questions</span>
            </span>
          </motion.h2>

          <motion.p 
            className={`mt-6 text-lg leading-8 transition-colors duration-500 
              ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Find answers to common questions about our platform and how it can help you learn more effectively
          </motion.p>
        </motion.div>

        {/* FAQ List */}
        <motion.div 
          className="mx-auto mt-16 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isDark
                      ? 'bg-zinc-900/50 hover:bg-zinc-800/50'
                      : 'bg-white hover:bg-zinc-50'} 
                    ${openIndex === index
                      ? `ring-2 ${isDark ? 'ring-teal-500/20' : 'ring-teal-500/30'}`
                      : `ring-1 ${isDark ? 'ring-zinc-800' : 'ring-zinc-200'}`}
                    rounded-2xl`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-left p-6 focus:outline-none"
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-medium transition-colors duration-500 
                        ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`${openIndex === index ? 'rotate-180' : ''} 
                          h-5 w-5 transition-transform duration-300
                          ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
                      />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-6 pb-6">
                          <motion.p 
                            className={`text-base leading-7 transition-colors duration-500 
                              ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            {faq.answer}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
