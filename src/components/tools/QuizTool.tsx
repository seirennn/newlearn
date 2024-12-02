'use client';

import { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateQuiz } from '@/utils/api';
import { Loader2, Brain, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Redo, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type QuizSettings = {
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
};

export function QuizTool() {
  const { content } = useContent();
  const { settings } = useSettings();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanations, setShowExplanations] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: 'medium',
    numQuestions: 5,
  });
  const [showResults, setShowResults] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const handleStartQuiz = async () => {
    if (!content?.trim()) {
      setError('Please provide some content first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setShowExplanations([]);
    setShowResults(false);

    try {
      const response = await generateQuiz(content, settings, quizSettings);
      let newQuestions;

      try {
        // Try to parse the response, handling both string and object responses
        newQuestions = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (parseError) {
        console.error('Failed to parse quiz response:', parseError);
        throw new Error('Invalid response format from AI. Please try again.');
      }

      // Validate the response format
      if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }

      // Ensure each question has the required properties and sanitize the data
      const validatedQuestions = newQuestions.map((q, index) => {
        if (!q || typeof q !== 'object') {
          throw new Error(`Invalid question format at index ${index}`);
        }

        const question = q.question?.toString().trim();
        const explanation = q.explanation?.toString().trim();
        const correctAnswer = Number(q.correctAnswer);

        if (!question || !explanation) {
          throw new Error(`Missing content in question at index ${index}`);
        }

        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Invalid options format at index ${index}`);
        }

        const options = q.options.map(opt => opt?.toString().trim()).filter(Boolean);
        if (options.length !== 4) {
          throw new Error(`Missing option content at index ${index}`);
        }

        if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
          throw new Error(`Invalid correct answer at index ${index}`);
        }

        return {
          question,
          options,
          correctAnswer,
          explanation
        };
      });

      setQuestions(validatedQuestions);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate quiz. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);

    const newExplanations = [...showExplanations];
    newExplanations[currentIndex] = false;
    setShowExplanations(newExplanations);

    setCanProceed(true);
  };

  const toggleExplanation = (idx: number) => {
    const newExplanations = [...showExplanations];
    newExplanations[idx] = !newExplanations[idx];
    setShowExplanations(newExplanations);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCanProceed(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCanProceed(true);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-4 mx-auto" />
            <p className="text-neutral-400">Generating quiz questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleStartQuiz}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Start Quiz</h3>
            <p className="text-neutral-400 text-center max-w-sm mb-6">
              Test your knowledge with AI-generated questions
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-200">Difficulty</label>
                <select
                  value={quizSettings.difficulty}
                  onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value as any })}
                  className="w-full px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800 text-white focus:ring-2 focus:ring-neutral-700 focus:border-transparent transition-colors"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-200">Number of Questions</label>
                <select
                  value={quizSettings.numQuestions}
                  onChange={(e) => setQuizSettings({ ...quizSettings, numQuestions: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800 text-white focus:ring-2 focus:ring-neutral-700 focus:border-transparent transition-colors"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleStartQuiz}
              className="mt-6 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = questions.reduce((score, q, idx) => {
      return score + (q.options[selectedAnswers[idx]] === q.options[q.correctAnswer] ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium text-white mb-2">Quiz Complete!</h3>
                <p className="text-neutral-400">
                  You scored {score} out of {questions.length} ({percentage}%)
                </p>
              </div>

              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <div key={idx} className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                      <div className="flex items-start gap-4">
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="space-y-4 flex-grow">
                          <p className="text-lg text-white">{q.question}</p>
                          <div className="grid gap-2">
                            {q.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className={cn(
                                  "px-4 py-3 rounded-lg text-base transition-colors border",
                                  optIdx === q.correctAnswer
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : optIdx === selectedAnswers[idx]
                                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                      : "text-neutral-400 border-neutral-800"
                                )}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                          {!isCorrect && (
                            <div className="text-sm text-neutral-400">
                              <span className="font-medium">Explanation: </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 mt-auto">
          <button
            onClick={() => {
              setQuestions([]);
              setSelectedAnswers([]);
              setCurrentIndex(0);
              setShowResults(false);
            }}
            className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <Redo className="w-4 h-4" />
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentIndex === 0
                  ? "text-neutral-600 cursor-not-allowed"
                  : "text-white hover:bg-neutral-800"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-neutral-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <button
              onClick={handleNextQuestion}
              disabled={!canProceed}
              className={cn(
                "p-2 rounded-lg transition-colors",
                !canProceed
                  ? "text-neutral-600 cursor-not-allowed"
                  : "text-white hover:bg-neutral-800"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="bg-neutral-900 rounded-xl p-8 flex flex-col h-full">
            <h3 className="text-xl text-white mb-6">{questions[currentIndex].question}</h3>

            <div className="space-y-3">
              {questions[currentIndex].options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                const isCorrect = selectedAnswers[currentIndex] !== undefined && idx === questions[currentIndex].correctAnswer;
                const isWrong = selectedAnswers[currentIndex] !== undefined && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={selectedAnswers[currentIndex] !== undefined}
                    className={cn(
                      "w-full px-6 py-4 text-left rounded-xl transition-all",
                      "bg-neutral-800 hover:bg-neutral-700",
                      "disabled:cursor-default",
                      isSelected && selectedAnswers[currentIndex] === undefined && "ring-2 ring-neutral-600",
                      isCorrect && "bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/20",
                      isWrong && "bg-rose-500/10 text-rose-400 ring-2 ring-rose-500/20"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedAnswers[currentIndex] !== undefined && (
              <div className="mt-6">
                {!showExplanations[currentIndex] ? (
                  <button
                    onClick={() => toggleExplanation(currentIndex)}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Show Explanation
                  </button>
                ) : (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="relative bg-neutral-900 rounded-xl p-8 max-w-2xl w-full shadow-lg border border-neutral-800">
                      <button
                        onClick={() => toggleExplanation(currentIndex)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Explanation</h4>
                        <p className="text-base text-neutral-300">
                          {questions[currentIndex].explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
