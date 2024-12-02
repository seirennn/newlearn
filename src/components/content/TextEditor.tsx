import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TextEditor({ content, onChange }: TextEditorProps) {
  return (
    <div className="h-full">
      <textarea
        className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-white placeholder:text-neutral-500"
        placeholder="Insert your notes here..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
