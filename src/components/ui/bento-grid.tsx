import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[15rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title: string;
  description: string | React.ReactNode;
  header: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-2xl transition-all duration-200",
        "bg-white/[0.02] dark:bg-zinc-900",
        "border border-zinc-200/10 dark:border-zinc-800",
        "overflow-hidden",
        className
      )}
    >
      <div className="relative h-full w-full">
        {header}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 dark:from-transparent dark:via-black/60 dark:to-black/90" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="flex items-center gap-2">
            {icon}
            <div className="font-semibold text-zinc-100">
              {title}
            </div>
          </div>
          <div className="mt-2 text-sm text-zinc-300">{description}</div>
        </div>
      </div>
    </div>
  );
};
