import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "slow-pulse": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, #000000 1px, transparent 1px)',
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'bg-dot': (value: any) => ({
            backgroundImage: `radial-gradient(${value} 0.5px, transparent 0.5px)`,
            backgroundSize: '16px 16px',
          }),
        },
        { values: theme('colors') }
      );
    },
  ],
} satisfies Config;
