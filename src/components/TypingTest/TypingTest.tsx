import { useEffect } from 'react';
import { useTypingTest } from 'src/hooks/useTypingTest';

import type { TypingTestProps } from './TypingTest.types';

export function TypingTest({
  textSample,
  onComplete,
  difficulty,
}: TypingTestProps) {
  const typingTest = useTypingTest(textSample, difficulty);

  const {
    userInput,
    isCompleted,
    currentWPM,
    currentAccuracy,
    timeElapsed,
    handleInput,
    completeTest,
  } = typingTest;

  // Call onComplete when test is completed
  useEffect(() => {
    if (isCompleted) {
      const result = completeTest();
      /* v8 ignore next -- @preserve */
      if (result) {
        onComplete(result);
      }
    }
  }, [isCompleted, completeTest, onComplete]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent paste shortcuts
    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      return;
    }

    // Handle backspace
    if (event.key === 'Backspace') {
      event.preventDefault();
      handleInput(userInput.slice(0, -1));
      return;
    }

    // Handle regular character input
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      handleInput(userInput + event.key);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const progress = Math.min(
    Math.round((userInput.length / textSample.content.length) * 100),
    100,
  );

  // Calculate actual completion based on reaching target length
  const isActuallyComplete = userInput.length >= textSample.content.length;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Typing Test
        </h2>

        {/* Stats Display */}
        <div className="mx-auto mb-4 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="flex rounded bg-gray-100 p-3 dark:bg-gray-700">
            <span className="font-semibold text-gray-900 dark:text-white">
              WPM:
            </span>
            <div className="flex-1 text-right">
              <span className="inline-block min-w-[3ch] text-gray-900 dark:text-white">
                {currentWPM}
              </span>
            </div>
          </div>
          <div className="flex rounded bg-gray-100 p-3 dark:bg-gray-700">
            <span className="font-semibold text-gray-900 dark:text-white">
              Accuracy:
            </span>
            <div className="flex-1 text-right">
              <span className="inline-block min-w-[3ch] text-gray-900 dark:text-white">
                {currentAccuracy}%
              </span>
            </div>
          </div>
          <div className="flex rounded bg-gray-100 p-3 dark:bg-gray-700">
            <span className="font-semibold text-gray-900 dark:text-white">
              Time:
            </span>
            <div className="flex-1 text-right">
              <span className="inline-block min-w-[3ch] text-gray-900 dark:text-white">
                {Math.round(timeElapsed)}s
              </span>
            </div>
          </div>
          <div className="flex rounded bg-gray-100 p-3 dark:bg-gray-700">
            <span className="font-semibold text-gray-900 dark:text-white">
              Progress:
            </span>
            <div className="flex-1 text-right">
              <span
                className={
                  isActuallyComplete
                    ? 'font-bold text-green-600 dark:text-green-400'
                    : 'text-gray-900 dark:text-white'
                }
              >
                <span className="inline-block min-w-[3ch]">{progress}%</span>
              </span>
              {isActuallyComplete && <span className="ml-1">✓</span>}
            </div>
          </div>
        </div>

        {/* Interactive Text Display */}
        <div
          className="mb-4 rounded-lg border-2 border-gray-300 bg-white p-4 font-mono text-lg leading-relaxed focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400"
          role="textbox"
          tabIndex={0}
          aria-label="Typing input field"
          ref={(element) => {
            if (element && !isCompleted && element !== document.activeElement) {
              element.focus();
            }
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{ minHeight: '120px' }}
        >
          {textSample.content.split('').map((char, index) => {
            const key = `${textSample.id}-${String(index)}`;
            let className = 'text-gray-600 dark:text-gray-300';
            if (index < userInput.length) {
              className =
                /* v8 ignore next */
                userInput[index] === char
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400';
            } else if (index === userInput.length) {
              className =
                'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 animate-pulse';
            }
            return (
              <span key={key} className={className}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Completion Guidance */}
        <div className="mt-4 h-[40px]">
          {!isActuallyComplete && userInput.length > 0 && (
            <div className="rounded bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Keep typing! You need{' '}
              {String(textSample.content.length - userInput.length)} more
              character
              {textSample.content.length - userInput.length === 1 ? '' : 's'} to
              finish.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
