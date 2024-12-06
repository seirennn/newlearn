'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, FileText, MessageSquare, Plus, User2, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { useTheme } from '@/components/landing/theme-context';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface StudySession {
  id: string;
  title: string;
  date: string;
  type: 'pdf' | 'text';
}

const recentStudySessions: StudySession[] = [
  { id: '1', title: 'Machine Learning Basics', date: '2024-01-20', type: 'pdf' },
  { id: '2', title: 'React Fundamentals', date: '2024-01-19', type: 'text' },
  { id: '3', title: 'Data Structures', date: '2024-01-18', type: 'pdf' },
];

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-800"></div>
    </div>;
  }

  return (
    <>
      <div className="h-screen flex">
        {/* Left Sidebar */}
        <div
          className={cn(
            "flex flex-col border-r border-neutral-800 bg-[#0C0C0C] transition-all duration-300 h-full",
            isCollapsed ? "w-16" : "w-[280px]"
          )}
        >
          {/* Logo and Brand */}
          <div className={cn(
            "flex h-14 items-center px-4 border-b border-neutral-800",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <Link href="/" className="flex items-center group">
                <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={isDark ? '/whitelogo.svg' : '/whitelogo.svg'}
                    alt="LearnFlow Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-lg font-medium tracking-tight text-zinc-100">
                  LearnFlow
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Content Actions */}
          {!isCollapsed && (
            <div className="p-3">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-md transition-colors text-sm font-medium">
                <Plus className="h-4 w-4" />
                Add content
              </button>
            </div>
          )}

          {/* Navigation Sections */}
          {!isCollapsed && (
            <div className="flex-1 overflow-y-auto px-3">
              {/* History Section */}
              <div className="py-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-neutral-400">History</h3>
                </div>
                <div className="space-y-1">
                  {recentStudySessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/study/${session.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors group"
                    >
                      {session.type === 'pdf' ? (
                        <FileText className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-neutral-400" />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate group-hover:text-white">{session.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Spaces Section */}
              <div className="py-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-neutral-400">Spaces</h3>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors text-sm">
                  <Plus className="h-4 w-4" />
                  Add space
                </button>
              </div>
            </div>
          )}

          {/* User Profile Section */}
          <div className="mt-auto border-t border-neutral-800">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 hover:bg-neutral-800/50 transition-colors",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User2 className="w-4 h-4 text-neutral-300" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user?.displayName || user?.email}</p>
                    <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                  </div>
                )}
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && !isCollapsed && (
                <div className="absolute bottom-full left-0 w-full bg-[#0C0C0C] border border-neutral-800 rounded-t-lg overflow-hidden">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-800 transition-colors text-sm"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-800 transition-colors text-sm text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden">
          <DashboardContent />
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
