'use client';

import { ContentProvider } from '@/contexts/ContentContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ModelProvider } from '@/contexts/ModelContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <ModelProvider>
        <ContentProvider>
          <div className="flex min-h-screen bg-[#080808] text-white">
            {children}
          </div>
        </ContentProvider>
      </ModelProvider>
    </SettingsProvider>
  );
}
