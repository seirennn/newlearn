import Navbar from '@/components/landing/navbar';
import { useTheme } from '@/components/landing/theme-context';

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className="pt-24">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`
            rounded-2xl 
            border
            ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50/50'}
            backdrop-blur-xl
            p-8 sm:p-12
          `}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
