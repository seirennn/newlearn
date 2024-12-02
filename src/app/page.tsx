'use client';

import Hero from '@/components/landing/hero';
import { ThemeProvider } from '@/components/landing/theme-context';

export default function LandingPage() {
  return (
    <ThemeProvider>
      <div>
        <Hero />
      </div>
    </ThemeProvider>
  );
}