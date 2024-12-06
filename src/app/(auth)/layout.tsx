'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import NoisyBackground from '@/components/noise-overlay';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background GIF with blur */}
        <div
          className="fixed inset-0 z-1"
          style={{
            backgroundImage: 'url("/background.gif")',
            backgroundSize: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            filter: 'blur(4px)',
          }}
        />

        {/* Dynamic noise overlay */}
        <NoisyBackground opacity={0.05} fps={30} />

        {/* Logo and Brand */}
        <div className="absolute top-8 left-8 z-30">
          <Link href="/" className="flex items-center space-x-1">
            <Image
              src="/whitelogo.svg"
              alt="LearnFlow Logo"
              width={42}
              height={42}
              className="relative"
            />
            <span className="text-white text-xl font-semibold">LearnFlow</span>
          </Link>
        </div>

        <div className="relative z-20 flex justify-center w-full">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
