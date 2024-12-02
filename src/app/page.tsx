'use client';

import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import FAQ from '@/components/landing/faq';
import PrivacyPolicy from '@/components/landing/privacy-policy';
import Footer from '@/components/landing/footer';
import { ThemeProvider } from '@/components/landing/theme-context';
import { Suspense } from 'react';

export default function LandingPage() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col">
        {/* Performance optimized background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] 
            bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <main className="flex-grow isolate">
          {/* Lazy load components with suspense */}
          <div className="relative">
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

            <Suspense fallback={<div className="min-h-[600px]" />}>
              <PrivacyPolicy />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}