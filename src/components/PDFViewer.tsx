'use client';

import { useState, useEffect } from 'react';

interface PDFViewerProps {
  file: File;
  scale?: number;
}

export function PDFViewer({ file, scale = 1.0 }: PDFViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create object URL when file changes
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    // Cleanup function to revoke object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        Loading PDF...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-[#1A1B1E] rounded-lg p-4 h-full">
      <div className="w-full h-full relative">
        <iframe
          src={objectUrl}
          className="w-full h-full border-0 rounded-lg"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            minHeight: '600px'
          }}
        />
      </div>
    </div>
  );
}
