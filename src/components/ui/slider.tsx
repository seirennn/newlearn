"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[];
  min: number;
  max: number;
  step: number;
  className?: string;
  onValueChange: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, min, max, step, className, onValueChange }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange([parseFloat(e.target.value)]);
    };

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
      >
        <div className="relative h-1.5 w-full rounded-full bg-neutral-800">
          <div
            className="absolute h-full bg-white rounded-full"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className="absolute w-full h-1.5 opacity-0 cursor-pointer"
          />
        </div>
        <div
          className="absolute h-4 w-4 rounded-full border border-neutral-800 bg-white"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider }
