'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';
import { useTheme } from './theme-context';
import { useState, useEffect } from 'react';

const navItems = [
  {
    name: 'Features',
    id: 'features',
  },
  {
    name: 'How It Works',
    id: 'how-it-works',
  },
  {
    name: 'FAQ',
    id: 'faq',
  },
];

const legalItems = [
  {
    name: 'Terms of Use',
    href: '/terms',
  },
  {
    name: 'Privacy Policy',
    href: '/policy',
  },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    // Handle hash changes for direct links
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        scrollToSection(hash);
      }
    };

    // Handle initial hash if present
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
      <div className={`${
        isDark 
          ? 'bg-zinc-900/40 border-zinc-800' 
          : 'bg-white/40 border-zinc-200'
        } backdrop-blur-md border rounded-xl shadow-sm transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-14 px-5">
          {/* Logo */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100/10"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`} />
            )}
          </button>
          
          {/* Center Nav Items - Desktop */}
          <div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-sm font-medium transition-all duration-300 
                  group hover:scale-105 ${
                  isDark 
                    ? 'text-zinc-400 hover:text-zinc-200' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 
                  transition-all duration-300 group-hover:w-full
                  ${isDark ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
              </button>
            ))}
            
            {/* Terms & Conditions Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`relative text-sm font-medium transition-all duration-300 
                  group hover:scale-105 inline-flex items-center ${
                  isDark 
                    ? 'text-zinc-400 hover:text-zinc-200' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Terms & Conditions
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 
                  transition-all duration-300 group-hover:w-full
                  ${isDark ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
              </button>
              
              <div className={`absolute right-0 mt-1 w-48 origin-top-right rounded-xl overflow-hidden
                transition-all duration-300 transform
                ${isDropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'}
                ${isDark 
                  ? 'bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50' 
                  : 'bg-white/95 backdrop-blur-sm border border-zinc-200/50'}
                shadow-lg ring-1 ring-black ring-opacity-5`}
              >
                <div className="py-1">
                  {legalItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-2 text-sm transition-all duration-200
                        ${isDark
                          ? 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white' 
                          : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'}
                        first:hover:rounded-t-lg last:hover:rounded-b-lg`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden fixed inset-x-0 top-[72px] p-4 ${
            isDark ? 'bg-zinc-900/95' : 'bg-white/95'
          } backdrop-blur-md border-b ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          } transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}>
            <div className="space-y-4">
              {/* Navigation Items */}
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isDark 
                      ? 'text-zinc-100 hover:bg-zinc-800' 
                      : 'text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDark 
                    ? 'text-zinc-100 hover:bg-zinc-800' 
                    : 'text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>Theme</span>
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Auth Buttons */}
              <div className="pt-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800">
                <Link
                  href="/login"
                  className={`block w-full text-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isDark 
                      ? 'text-zinc-100 hover:bg-zinc-800' 
                      : 'text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={`block w-full text-center px-4 py-2 rounded-lg text-sm font-medium ${
                    isDark
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-black text-white hover:bg-zinc-800'
                  } transition-all duration-300`}
                >
                  Sign Up
                </Link>
              </div>

              {/* Legal Links */}
              <div className="pt-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800">
                {legalItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isDark 
                        ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/signin"
              className={`px-4 py-1.5 text-sm font-medium rounded-lg 
                transition-all duration-300 border
                ${isDark
                  ? 'border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-800/50' 
                  : 'border-zinc-300 hover:border-zinc-400 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/50'
                } hover:scale-105`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`px-4 py-1.5 text-sm font-medium rounded-lg 
                transition-all duration-300 
                ${isDark
                  ? 'bg-white/90 text-zinc-900 hover:bg-white hover:shadow-lg hover:shadow-white/10' 
                  : 'bg-zinc-900/90 text-white hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-900/10'
                } hover:scale-105`}
            >
              Sign up
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg transition-all duration-300 
                ${isDark
                  ? 'bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white' 
                  : 'bg-zinc-100/70 hover:bg-zinc-200/70 text-zinc-700 hover:text-zinc-900'
                } hover:scale-105`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
