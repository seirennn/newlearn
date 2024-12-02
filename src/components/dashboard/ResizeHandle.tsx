'use client';

import { useState } from 'react';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
}

export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.pageX;
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.pageX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  return (
    <div
      className={`
        w-[6px] hover:bg-neutral-700 cursor-col-resize 
        transition-colors group relative select-none
        ${isDragging ? 'bg-neutral-600' : ''}
      `}
      onMouseDown={handleDrag}
    >
      <div 
        className={`
          absolute inset-y-0 left-[-2px] right-[-2px] 
          transition-opacity duration-150
          ${isDragging ? 'bg-neutral-500 opacity-100' : 'group-hover:bg-neutral-600 opacity-0 group-hover:opacity-100'}
        `} 
      />
      <div className="absolute inset-y-0 left-1/2 w-[2px] bg-neutral-800" />
    </div>
  );
}
