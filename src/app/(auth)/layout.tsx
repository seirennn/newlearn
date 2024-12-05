import NoisyBackground from '@/components/noise-overlay';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background GIF with blur */}
      <div 
        className="fixed inset-0 z-1"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: '105%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          filter: 'blur(3px)',
        }}
      />

      {/* Dynamic noise overlay */}
      <NoisyBackground opacity={0.06} fps={30} />
      
      {/* Logo and Brand */}
      <div className="absolute top-8 left-8 flex items-center space-x-3 z-30">
        <Image
          src="/whitelogo.svg"
          alt="LearnFlow Logo"
          width={32}
          height={32}
          className="relative"
        />
        <span className="text-white text-xl font-semibold">LearnFlow</span>
      </div>

      <div className="relative z-20 flex justify-center w-full">
        {children}
      </div>
    </div>
  );
}
