'use client';

import { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateQuiz } from '@/utils/api';
import { Loader2, Brain, CheckCircle2, XCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: 'medium',
    numQuestions: 5,
  });
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(false);

    try {
      const newQuestions = await generateQuiz(content, settings, quizSettings);
      if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
        throw new Error('Invalid quiz response');
      }
      setQuestions(newQuestions);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 500);
    } else {
      setShowResults(true);
    }
  };

  const getScore = () => {
    return questions.reduce((score, q, idx) => {
      return score + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-4 mx-auto" />
            <p className="text-neutral-400">Generating quiz...</p>
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
            <h3 className="text-lg font-medium mb-2 text-white">Generate Quiz</h3>
            <p className="text-neutral-400 text-center max-w-sm mb-6">
              Test your knowledge with AI-generated questions
            </p>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Difficulty</label>
                <div className="flex gap-2 justify-center">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setQuizSettings(prev => ({ ...prev, difficulty: diff }))}
                      className={cn(
                        "px-4 py-2 rounded-lg capitalize transition-colors",
                        quizSettings.difficulty === diff
                          ? "bg-neutral-100 text-neutral-900"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Number of Questions</label>
                <div className="flex gap-2 justify-center">
                  {[5, 10, 15].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuizSettings(prev => ({ ...prev, numQuestions: num }))}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-colors",
                        quizSettings.numQuestions === num
                          ? "bg-neutral-100 text-neutral-900"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = getScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className={cn(
                "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
                percentage >= 70 ? "bg-green-500/10" : "bg-yellow-500/10"
              )}>
                <span className="text-3xl font-bold">{percentage}%</span>
              </div>
              
              <h3 className="text-xl font-medium mb-2 text-white">
                Quiz Complete!
              </h3>
              <p className="text-neutral-400 mb-6">
                You got {score} out of {questions.length} questions correct
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-neutral-900/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {selectedAnswers[idx] === q.correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white mb-2">{q.question}</p>
                      <div className="space-y-1 mb-3">
                        {q.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={cn(
                              "px-3 py-2 rounded text-sm",
                              optIdx === q.correctAnswer
                                ? "bg-green-500/10 text-green-500"
                                : optIdx === selectedAnswers[idx]
                                ? "bg-red-500/10 text-red-500"
                                : "text-neutral-400"
                            )}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      {selectedAnswers[idx] !== q.correctAnswer && (
                        <p className="text-sm text-neutral-400">
                          <span className="text-neutral-500">Explanation: </span>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Difficulty</label>
                  <div className="flex gap-2 justify-center">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setQuizSettings(prev => ({ ...prev, difficulty: diff }))}
                        className={cn(
                          "px-4 py-2 rounded-lg capitalize transition-colors",
                          quizSettings.difficulty === diff
                            ? "bg-neutral-100 text-neutral-900"
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        )}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Number of Questions</label>
                  <div className="flex gap-2 justify-center">
                    {[5, 10, 15].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQuizSettings(prev => ({ ...prev, numQuestions: num }))}
                        className={cn(
                          "px-4 py-2 rounded-lg transition-colors",
                          quizSettings.numQuestions === num
                            ? "bg-neutral-100 text-neutral-900"
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors"
              >
                Start New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-sm text-neutral-500">
              {quizSettings.difficulty} difficulty
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1">
            <div
              className="bg-neutral-100 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg text-white mb-6">
            {questions[currentIndex].question}
          </h3>

          <div className="grid gap-3">
            {questions[currentIndex].options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const isAnswered = selectedAnswers[currentIndex] !== undefined;
              const isCorrect = isAnswered && idx === questions[currentIndex].correctAnswer;
              const isIncorrect = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && handleAnswer(idx)}
                  disabled={isAnswered}
                  className={cn(
                    "p-4 rounded-lg text-left transition-colors",
                    isCorrect
                      ? "bg-green-500/10 text-green-500"
                      : isIncorrect
                      ? "bg-red-500/10 text-red-500"
                      : isSelected
                      ? "bg-neutral-100 text-neutral-900"
                      : isAnswered
                      ? "bg-neutral-800 text-neutral-500"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswers[currentIndex] !== undefined && (
            <div className="mt-6">
              <p className="text-sm text-neutral-400">
                <span className="text-neutral-500">Explanation: </span>
                {questions[currentIndex].explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
