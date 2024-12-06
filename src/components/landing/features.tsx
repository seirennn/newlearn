'use client';

import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { useTheme } from './theme-context';
import Image from "next/image";
import {
  FileText,
  MessageSquareText,
  Youtube,
  Sparkles,
  Brain,
  Share2,
  Lightbulb
} from 'lucide-react';

const ImageBox = ({ src }: { src: string }) => (
  <div className="relative flex flex-1 w-full h-full overflow-hidden">
    <Image
      src={src}
      alt="Feature illustration"
      fill
      className="object-cover hover:scale-105 transition-transform duration-500"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);

const items = [
  {
    title: "Smart PDF Analysis",
    description: "Extract insights and summaries from your documents instantly.",
    header: <ImageBox src="https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=80" />,
    icon: <FileText className="h-4 w-4 text-white dark:text-white" />,
  },
  {
    title: "Interactive Learning",
    description: "Engage with your content through AI-powered conversations.",
    header: <ImageBox src="https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800&auto=format&fit=crop&q=80" />,
    icon: <MessageSquareText className="h-4 w-4 text-white dark:text-white" />,
  },
  {
    title: "Video Intelligence",
    description: "Transform video content into structured knowledge.",
    header: <ImageBox src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80" />,
    icon: <Youtube className="h-4 w-4 text-white dark:text-white" />,
  },
  {
    title: "Advanced Content Processing",
    description: "Leverage AI to understand and analyze complex materials with unprecedented depth and accuracy.",
    header: <ImageBox src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80" />,
    icon: <Brain className="h-4 w-4 text-white dark:text-white" />,
  },
  {
    title: "Quick Insights",
    description: "Get instant summaries and key takeaways.",
    header: <ImageBox src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80" />,
    icon: <Lightbulb className="h-4 w-4 text-white dark:text-white" />,
  },
  {
    title: "Collaborative Learning",
    description: "Share and learn together with integrated features.",
    header: <ImageBox src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" />,
    icon: <Share2 className="h-4 w-4 text-white dark:text-white" />,
  },
  {
    title: "Personalized Experience",
    description: "Adaptive learning paths tailored to your unique style and pace of learning.",
    header: <ImageBox src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80" />,
    icon: <Sparkles className="h-4 w-4 text-white dark:text-white" />,
  },
];

export default function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="features" className={cn(
      "relative py-24 sm:py-32 overflow-hidden scroll-mt-32",
      isDark ? "bg-black" : "bg-white"
    )}>
      <div className={cn(
        "absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:32px_32px]",
        isDark ? "opacity-[0.07]" : "opacity-[0.15]"
      )} />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className={cn(
            "text-base font-semibold leading-7",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}>
            Platform Features
          </h2>
          <p className={cn(
            "mt-2 text-3xl font-bold tracking-tight sm:text-4xl",
            isDark ? "text-white" : "text-zinc-900"
          )}>
            Everything you need to learn effectively
          </p>
          <p className={cn(
            "mt-6 text-lg leading-8",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}>
            Our platform combines advanced AI with intuitive design to create a seamless learning experience.
          </p>
        </div>

        <BentoGrid className="max-w-4xl mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
