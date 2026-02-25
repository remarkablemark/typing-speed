import { useState } from 'react';
import { ResultsDisplay } from 'src/components/ResultsDisplay';
import { TestHistory } from 'src/components/TestHistory';
import { TypingTest } from 'src/components/TypingTest';
import type { DifficultyLevel, TestResult } from 'src/types/typing.types';
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
    setCurrentResult(undefined);
    setIsTestActive(false);
  };

  const textSample = getRandomTextSample(currentDifficulty);

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
        textSample={textSample}
        onComplete={handleTestComplete}
        difficulty={currentDifficulty}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Typing Speed Test
        </h2>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Select Difficulty</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(
              (difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => {
                    handleDifficultyChange(difficulty);
                  }}
                  className={`rounded-lg border-2 p-4 transition-colors ${
                    currentDifficulty === difficulty
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold capitalize">{difficulty}</div>
                  <div className="text-sm text-gray-600">
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
          <h3 className="mb-4 text-lg font-semibold">Preview Text</h3>
          <div
            className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4 font-mono"
            data-testid="text-preview"
          >
            {textSample.content.slice(0, 100)}...
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleStartTest}
            className="rounded-md bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
