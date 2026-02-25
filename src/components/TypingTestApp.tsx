import { useState } from 'react';
import { TypingTest } from 'src/components/TypingTest';
import type { DifficultyLevel, TestResult } from 'src/types/typing.types';
import { getRandomTextSample } from 'src/utils/textSamples';

export function TypingTestApp(): React.ReactNode {
  const [currentDifficulty, setCurrentDifficulty] =
    useState<DifficultyLevel>('easy');
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentResult, setCurrentResult] = useState<TestResult | undefined>();

  const handleStartTest = () => {
    setIsTestActive(true);
    setCurrentResult(undefined);
  };

  const handleTestComplete = (result: TestResult) => {
    setCurrentResult(result);
    setIsTestActive(false);
  };

  const handleRestart = () => {
    setCurrentResult(undefined);
    setIsTestActive(false);
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setCurrentDifficulty(difficulty);
    setCurrentResult(undefined);
    setIsTestActive(false);
  };

  const textSample = getRandomTextSample(currentDifficulty);

  if (currentResult) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Test Complete!
          </h2>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {currentResult.wpm}
              </div>
              <div className="text-gray-600">Words Per Minute</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {currentResult.accuracy}%
              </div>
              <div className="text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {Math.round(currentResult.timeElapsed)}s
              </div>
              <div className="text-gray-600">Time</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                handleDifficultyChange(currentDifficulty);
              }}
              className="rounded-md bg-gray-200 px-6 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300"
            >
              New Test
            </button>
          </div>
        </div>
      </div>
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
