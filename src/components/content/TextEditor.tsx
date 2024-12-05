import React from 'react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TextEditor({ content, onChange }: TextEditorProps) {
  return (
    <div className="h-full">
      <textarea
        className="w-full h-full p-4 bg-transparent border border-zinc-800 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700 text-white placeholder:text-zinc-500"
        placeholder="Insert your notes here..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
