'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, FileText, MessageSquare, Plus, User2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentProvider } from '@/contexts/ContentContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SettingsProvider>
      <ContentProvider>
        <div className="flex min-h-screen bg-[#080808] text-white">
          {/* Left Sidebar */}
          <div
            className={cn(
              "flex flex-col border-r border-neutral-800 bg-[#0C0C0C] transition-all duration-300",
              isCollapsed ? "w-16" : "w-[280px]"
            )}
          >
            {/* Logo and Brand */}
            <div className={cn(
              "flex h-14 items-center px-4 border-b border-neutral-800",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                    <span className="text-black font-bold text-sm">Y</span>
                  </div>
                  <span className="text-lg font-semibold tracking-tight">NewLearn</span>
                </div>
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

            {/* User Section */}
            {!isCollapsed && (
              <div className="mt-auto p-3 border-t border-neutral-800">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">Free plan</div>
                    <div className="text-xs text-neutral-400 truncate">user@example.com</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>
        </div>
      </ContentProvider>
    </SettingsProvider>
  );
}
