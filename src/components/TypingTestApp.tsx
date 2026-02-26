import { useState } from 'react';
import { ResultsDisplay } from 'src/components/ResultsDisplay';
import { TestHistory } from 'src/components/TestHistory';
import { TypingTest } from 'src/components/TypingTest';
import type {
  DifficultyLevel,
  TestResult,
  TextSample,
} from 'src/types/typing.types';
import {
  clearTestHistory,
  getTestHistory,
  saveTestResult,
} from 'src/utils/sessionStorage';
import { getRandomTextSample } from 'src/utils/textSamples';

export function TypingTestApp(): React.ReactNode {
  const [currentDifficulty, setCurrentDifficulty] =
    useState<DifficultyLevel>('easy');
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentResult, setCurrentResult] = useState<TestResult | undefined>();
  const [showHistory, setShowHistory] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>(() =>
    getTestHistory(),
  );
  const [currentTextSample, setCurrentTextSample] = useState<TextSample>(() =>
    getRandomTextSample('easy'),
  );

  const handleStartTest = () => {
    setIsTestActive(true);
    setCurrentResult(undefined);
  };

  const handleTestComplete = (result: TestResult) => {
    setCurrentResult(result);
    setIsTestActive(false);
    // Save result to session storage
    saveTestResult(result);
    setTestHistory(getTestHistory());
  };

  const handleRestart = () => {
    const newTextSample = getRandomTextSample(currentDifficulty);
    setCurrentTextSample(newTextSample);
    setCurrentResult(undefined);
    setIsTestActive(false);
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  const handleClearHistory = () => {
    clearTestHistory();
    setTestHistory([]);
  };

  const handleSelectHistoryResult = (result: TestResult) => {
    setCurrentResult(result);
    setShowHistory(false);
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setCurrentDifficulty(difficulty);
    const newTextSample = getRandomTextSample(difficulty);
    setCurrentTextSample(newTextSample);
    setCurrentResult(undefined);
    setIsTestActive(false);
  };

  // Show history view
  if (showHistory) {
    return (
      <TestHistory
        results={testHistory}
        onSelectResult={handleSelectHistoryResult}
        onClearHistory={handleClearHistory}
      />
    );
  }

  // Show results view
  if (currentResult) {
    return (
      <ResultsDisplay
        result={currentResult}
        onRestart={handleRestart}
        onViewHistory={handleViewHistory}
      />
    );
  }

  if (isTestActive) {
    return (
      <TypingTest
        textSample={currentTextSample}
        onComplete={handleTestComplete}
        difficulty={currentDifficulty}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 dark:shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Typing Speed Test
        </h2>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Select Difficulty
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(
              (difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => {
                    handleDifficultyChange(difficulty);
                  }}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                    currentDifficulty === difficulty
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                      : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold text-gray-900 capitalize dark:text-white">
                    {difficulty}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {difficulty === 'easy' && 'Simple words and phrases'}
                    {difficulty === 'medium' && 'Common sentences'}
                    {difficulty === 'hard' && 'Complex text and punctuation'}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Preview Text
          </h3>
          <div
            className="truncate rounded-lg border-2 border-gray-300 bg-gray-50 p-4 font-mono text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            data-testid="text-preview"
          >
            {currentTextSample.content}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleStartTest}
            className="cursor-pointer rounded-md bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
