export const theme = {
  colors: {
    primary: '#080808',
    secondary: '#1a1a1a',
    accent: '#3b82f6',
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
    },
    background: {
      primary: '#080808',
      secondary: '#121212',
      tertiary: '#1a1a1a',
    },
    border: {
      primary: '#262626',
      secondary: '#404040',
    },
  },
};

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  openaiApiKey: process.env.OPENAI_API_KEY,
};

export const OPENAI_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 1000,
};
