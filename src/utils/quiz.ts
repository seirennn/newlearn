import { ModelType } from '@/contexts/ModelContext';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'concept' | 'application' | 'analysis';
}

interface QuizGenerationOptions {
  model: ModelType;
  temperature: number;
  numQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: ('concept' | 'application' | 'analysis')[];
}

export async function generateQuizQuestions(
  options: QuizGenerationOptions
): Promise<QuizQuestion[]> {
  // Use the options parameter to guide quiz generation
  const { temperature, numQuestions, difficulty, categories } = options;

  // Use temperature to add some variability to quiz generation
  const randomFactor = Math.random() * temperature;

  // TODO: Implement model-specific quiz generation logic
  const mockQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the primary concept discussed in the content?',
      options: [
        'Machine Learning',
        'Data Analysis',
        'Web Development',
        'Cloud Computing'
      ].sort(() => randomFactor - 0.5), // Randomize order
      correctAnswer: 0,
      explanation: 'The content primarily focuses on machine learning concepts.',
      difficulty: difficulty,
      category: categories[0] || 'concept'
    },
    {
      id: '2',
      question: 'How would you apply the discussed concepts in a real-world scenario?',
      options: [
        'Build a recommendation system',
        'Create a social media app',
        'Design a database',
        'Develop a website'
      ].sort(() => randomFactor - 0.5), // Randomize order
      correctAnswer: 0,
      explanation: 'The concepts are best applied in building recommendation systems.',
      difficulty: difficulty,
      category: categories[1] || 'application'
    }
  ];

  // Limit the number of questions based on numQuestions
  return mockQuestions.slice(0, numQuestions);
}
