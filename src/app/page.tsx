'use client';

import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import FAQ from '@/components/landing/faq';
import Footer from '@/components/landing/footer';
import Navbar from '@/components/landing/navbar';
import { ThemeProvider, useTheme } from '@/components/landing/theme-context';
import { Suspense } from 'react';

function MainContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-screen"  style={{ zoom: '80%' }}>
      <div className={`fixed inset-0 -z-10 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`} />
      </div>

      <Navbar />
        
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<div className="min-h-[800px]" />}>
          <Features />
        </Suspense>

        <Suspense fallback={<div className="min-h-[600px]" />}>
          <HowItWorks />
        </Suspense>

        <Suspense fallback={<div className="min-h-[600px]" />}>
          <FAQ />
        </Suspense>

        <Footer />
      </main>
    </div>
  );
}

export default function LandingPage() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}