'use client';

import { useTheme } from './theme-context';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Linkedin } from 'lucide-react';

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ],
  support: [
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'Help Center', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#policy' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'License', href: '#' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://x.com/jordann_lh',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/seirennn',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/lanso-humtsoe-9454b8308/',
      icon: Linkedin,
    },
  ],
};

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`${isDark ? 'bg-zinc-900' : 'bg-zinc-50'} border-t ${
      isDark ? 'border-zinc-800' : 'border-zinc-200'
    } overflow-hidden`}>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center group">
              <div className="relative w-11 h-11 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={isDark ? '/whitelogo.svg' : '/blacklogo.svg'}
                  alt="LearnFlow Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className={`text-lg font-medium tracking-tight ${
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              }`}>
                LearnFlow
              </span>
            </Link>
            <p className={`text-sm leading-6 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Transform any content into an interactive learning experience with AI-powered insights.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    isDark 
                      ? 'text-zinc-400 hover:text-zinc-300' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={`text-sm font-semibold ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}>
                  Product
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`text-sm ${
                          isDark 
                            ? 'text-zinc-400 hover:text-zinc-300' 
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className={`text-sm font-semibold ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}>
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`text-sm ${
                          isDark 
                            ? 'text-zinc-400 hover:text-zinc-300' 
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={`text-sm font-semibold ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}>
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`text-sm ${
                          isDark 
                            ? 'text-zinc-400 hover:text-zinc-300' 
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className={`text-sm font-semibold ${
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}>
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`text-sm ${
                          isDark 
                            ? 'text-zinc-400 hover:text-zinc-300' 
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className={`mt-16 border-t ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        } pt-8 sm:mt-20 lg:mt-24`}>
          <p className={`text-xs leading-5 ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            &copy; {new Date().getFullYear()} LearnFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
