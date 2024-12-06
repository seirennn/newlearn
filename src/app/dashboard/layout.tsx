'use client';

import { ContentProvider } from '@/contexts/ContentContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ModelProvider } from '@/contexts/ModelContext';
import { ToolsProvider } from '@/contexts/ToolsContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <ModelProvider>
        <ContentProvider>
          <ToolsProvider>
            <div className="h-screen overflow-hidden bg-[#080808] text-white">
              {children}
            </div>
          </ToolsProvider>
        </ContentProvider>
      </ModelProvider>
    </SettingsProvider>
  );
}
