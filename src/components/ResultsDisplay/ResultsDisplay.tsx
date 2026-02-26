import { useState } from 'react';

import type { ResultsDisplayProps } from './ResultsDisplay.types';

export const ResultsDisplay = ({
  result,
  onRestart,
  onViewHistory,
}: ResultsDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes)}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number): string => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWPMPerformance = (wpm: number): { color: string; label: string } => {
    if (wpm >= 80) return { color: 'text-green-600', label: 'Excellent' };
    if (wpm >= 60) return { color: 'text-blue-600', label: 'Good' };
    if (wpm >= 40) return { color: 'text-yellow-600', label: 'Average' };
    return { color: 'text-red-600', label: 'Needs Practice' };
  };

  const getAccuracyPerformance = (
    accuracy: number,
  ): { color: string; label: string } => {
    if (accuracy >= 95) return { color: 'text-green-600', label: 'Excellent' };
    if (accuracy >= 85) return { color: 'text-blue-600', label: 'Good' };
    if (accuracy >= 70) return { color: 'text-yellow-600', label: 'Average' };
    return { color: 'text-red-600', label: 'Needs Practice' };
  };

  const wpmPerformance = getWPMPerformance(result.wpm);
  const accuracyPerformance = getAccuracyPerformance(result.accuracy);

  return (
    <div
      className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      role="region"
      aria-label="Test results"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
          Test Complete!
        </h2>

        {/* WPM Display */}
        <div className="mb-6">
          <div
            className={`text-6xl font-bold md:text-7xl ${wpmPerformance.color}`}
          >
            {result.wpm}
          </div>
          <div className="text-xl text-gray-600 dark:text-gray-400">WPM</div>
          <div className={`text-sm ${wpmPerformance.color} font-medium`}>
            {wpmPerformance.label}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Accuracy */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${accuracyPerformance.color}`}>
              {result.accuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accuracy
            </div>
            <div className={`text-xs ${accuracyPerformance.color} font-medium`}>
              {accuracyPerformance.label}
            </div>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(result.timeElapsed)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
          </div>

          {/* Difficulty */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 capitalize dark:text-gray-200">
              {result.difficulty}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Difficulty
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          Completed at {formatTimestamp(result.timestamp)}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={onRestart}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            aria-label="Start a new typing test"
          >
            Try Again
          </button>
          <button
            onClick={onViewHistory}
            className="cursor-pointer rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="View your test history"
          >
            View History
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className="w-full cursor-pointer rounded text-left text-sm text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
          aria-expanded={isExpanded}
          aria-controls="test-details"
        >
          {isExpanded ? 'Hide' : 'Show'} Test Details
        </button>

        {isExpanded && (
          <div
            id="test-details"
            className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Detailed Results
            </h3>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Test ID:</dt>
                <dd className="font-mono text-gray-800 dark:text-gray-200">
                  {result.id}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">
                  Text Sample ID:
                </dt>
                <dd className="font-mono text-gray-800 dark:text-gray-200">
                  {result.textSampleId}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">
                  Words Typed:
                </dt>
                <dd className="text-gray-800 dark:text-gray-200">
                  {Math.round((result.wpm * result.timeElapsed) / 60)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">
                  Characters Typed:
                </dt>
                <dd className="text-gray-800 dark:text-gray-200">
                  {result.wpm * 5 * Math.round(result.timeElapsed / 60)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Errors:</dt>
                <dd className="text-gray-800 dark:text-gray-200">
                  {Math.round(
                    ((100 - result.accuracy) / 100) *
                      result.wpm *
                      5 *
                      Math.round(result.timeElapsed / 60),
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">
                  Completion Date:
                </dt>
                <dd className="text-gray-800 dark:text-gray-200">
                  {new Date(result.timestamp).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};
