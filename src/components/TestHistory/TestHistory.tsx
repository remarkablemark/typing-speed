import { useState } from 'react';

import type { TestHistoryProps } from './TestHistory.types';

export const TestHistory = ({
  results,
  onSelectResult,
  onClearHistory,
}: TestHistoryProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(),
  );

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

  const formatDate = (timestamp: number): string => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateStats = () => {
    if (results.length === 0) {
      return {
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        averageTime: 0,
      };
    }

    const totalTests = results.length;
    const averageWPM = Math.round(
      results.reduce((sum, result) => sum + result.wpm, 0) / totalTests,
    );
    const bestWPM = Math.max(...results.map((result) => result.wpm));
    const averageAccuracy = Math.round(
      results.reduce((sum, result) => sum + result.accuracy, 0) / totalTests,
    );
    const bestAccuracy = Math.max(...results.map((result) => result.accuracy));
    const averageTime = Math.round(
      results.reduce((sum, result) => sum + result.timeElapsed, 0) / totalTests,
    );

    return {
      totalTests,
      averageWPM,
      bestWPM,
      averageAccuracy,
      bestAccuracy,
      averageTime,
    };
  };

  const toggleExpanded = (resultId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resultId)) {
        newSet.delete(resultId);
      } else {
        newSet.add(resultId);
      }
      return newSet;
    });
  };

  const getWPMPerformance = (wpm: number): string => {
    if (wpm >= 80) return 'text-green-600';
    if (wpm >= 60) return 'text-blue-600';
    if (wpm >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyPerformance = (accuracy: number): string => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-blue-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sortedResults = [...results].sort((a, b) => b.timestamp - a.timestamp);

  const stats = calculateStats();

  return (
    <div
      className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      role="region"
      aria-label="Test history"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">
        Test History
      </h2>

      {results.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No test history
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Complete a test to see your results here
          </p>
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Summary Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {stats.totalTests}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Tests
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getWPMPerformance(stats.averageWPM)}`}
                  data-testid="average-wpm"
                >
                  {stats.averageWPM}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Avg WPM
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getWPMPerformance(stats.bestWPM)}`}
                  data-testid="best-wpm"
                >
                  {stats.bestWPM}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Best WPM
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getAccuracyPerformance(stats.averageAccuracy)}`}
                >
                  {stats.averageAccuracy}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Acc
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getAccuracyPerformance(stats.bestAccuracy)}`}
                >
                  {stats.bestAccuracy}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Best Acc
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {formatTime(stats.averageTime)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Time
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {results.length} {results.length === 1 ? 'Test' : 'Tests'}{' '}
                Completed
              </h3>
              <button
                onClick={onClearHistory}
                disabled={results.length === 0}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
                aria-label="Clear all test history"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-4" role="list" aria-label="Test results">
              {sortedResults.map((result) => (
                <div
                  key={result.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                  role="listitem"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <button
                        onClick={() => {
                          onSelectResult(result);
                        }}
                        className="group w-full cursor-pointer text-left"
                        data-testid={`result-${result.id}`}
                        aria-label={`View test result from ${formatDate(result.timestamp)}`}
                      >
                        <div className="mb-2 flex items-center space-x-4">
                          <div
                            className={`text-xl font-bold ${getWPMPerformance(result.wpm)}`}
                          >
                            {result.wpm}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            WPM • {result.accuracy}% •{' '}
                            {formatTime(result.timeElapsed)} •{' '}
                            <span className="capitalize">
                              {result.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(result.timestamp)} at{' '}
                          {formatTimestamp(result.timestamp)}
                        </div>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                      <button
                        onClick={() => {
                          toggleExpanded(result.id);
                        }}
                        className="cursor-pointer rounded p-2 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
                        aria-expanded={expandedItems.has(result.id)}
                        aria-label={`Expand details for test from ${formatDate(result.timestamp)}`}
                      >
                        <svg
                          className={`h-4 w-4 transition-transform ${
                            expandedItems.has(result.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedItems.has(result.id) && (
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Test Details
                      </h4>
                      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-gray-600 dark:text-gray-400">
                            Test ID:
                          </dt>
                          <dd className="font-mono text-xs text-gray-800 dark:text-gray-200">
                            {result.id}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-600 dark:text-gray-400">
                            Text Sample ID:
                          </dt>
                          <dd className="font-mono text-xs text-gray-800 dark:text-gray-200">
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
                            {result.wpm *
                              5 *
                              Math.round(result.timeElapsed / 60)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-600 dark:text-gray-400">
                            Errors:
                          </dt>
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
                            Performance:
                          </dt>
                          <dd className="text-gray-800 dark:text-gray-200">
                            <span className={getWPMPerformance(result.wpm)}>
                              WPM:{' '}
                              {getWPMPerformance(result.wpm).includes('green')
                                ? 'Excellent'
                                : getWPMPerformance(result.wpm).includes('blue')
                                  ? 'Good'
                                  : getWPMPerformance(result.wpm).includes(
                                        'yellow',
                                      )
                                    ? 'Average'
                                    : 'Needs Practice'}
                            </span>
                            {' • '}
                            <span
                              className={getAccuracyPerformance(
                                result.accuracy,
                              )}
                            >
                              Accuracy:{' '}
                              {getAccuracyPerformance(result.accuracy).includes(
                                'green',
                              )
                                ? 'Excellent'
                                : getAccuracyPerformance(
                                      result.accuracy,
                                    ).includes('blue')
                                  ? 'Good'
                                  : getAccuracyPerformance(
                                        result.accuracy,
                                      ).includes('yellow')
                                    ? 'Average'
                                    : 'Needs Practice'}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
