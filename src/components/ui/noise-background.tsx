'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/landing/theme-context';

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createNoise = () => {
      const idata = ctx.createImageData(canvas.width, canvas.height);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const baseColor = 0xFF0A0A0A; // Very dark background

      for (let i = 0; i < buffer32.length;) {
        // Reduce noise intensity significantly
        const noise = Math.random() * 10 > 9.7 ? 0xFF0C0C0C : 0xFF090909;
        buffer32[i++] = noise;
      }

      ctx.putImageData(idata, 0, 0);
    };

    const animate = () => {
      frame++;
      if (frame % 2 === 0) { // Slow down the animation
        createNoise();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-30"
      style={{ filter: 'url(#noise)' }}
    />
  );
}
