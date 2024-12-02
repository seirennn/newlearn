'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
}

export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.pageX;
    setIsDragging(true);

    let lastX = startX;
    let animationFrame: number;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const currentX = moveEvent.pageX;
        const delta = lastX - currentX;
        lastX = currentX;
        onResize(delta);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  return (
    <div
      className={cn(
        "w-[6px] group relative select-none transition-colors duration-150",
        "hover:bg-neutral-700/50 active:bg-neutral-600/70",
        "cursor-col-resize",
        isDragging && "bg-neutral-600/70"
      )}
      onMouseDown={handleDrag}
    >
      <div 
        className={cn(
          "absolute inset-y-0 left-[-2px] right-[-2px]",
          "transition-all duration-150",
          isDragging 
            ? "bg-neutral-500/50 opacity-100 blur-[0.5px]" 
            : "group-hover:bg-neutral-600/50 opacity-0 group-hover:opacity-100"
        )}
      />
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-neutral-800/90" />
    </div>
  );
}
