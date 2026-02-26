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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    handleInput(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent paste shortcuts
    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
  };

  const progress = Math.round(
    (userInput.length / textSample.content.length) * 100,
  );

  // Calculate actual completion based on exact match
  const isActuallyComplete = userInput === textSample.content;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold">Typing Test</h2>

        {/* Stats Display */}
        <div className="mx-auto mb-4 grid w-full max-w-3xl grid-cols-4 gap-4">
          <div className="flex w-40 rounded bg-gray-100 p-3">
            <span className="font-semibold">WPM:</span>
            <div className="flex-1 text-right">
              <span className="inline-block min-w-[3ch]">{currentWPM}</span>
            </div>
          </div>
          <div className="flex w-40 rounded bg-gray-100 p-3">
            <span className="font-semibold">Accuracy:</span>
            <div className="flex-1 text-right">
              <span className="inline-block min-w-[3ch]">
                {currentAccuracy}%
              </span>
            </div>
          </div>
          <div className="flex w-40 rounded bg-gray-100 p-3">
            <span className="font-semibold">Time:</span>
            <div className="flex-1 text-right">
              <span className="inline-block min-w-[3ch]">
                {Math.round(timeElapsed)}s
              </span>
            </div>
          </div>
          <div className="flex w-40 rounded bg-gray-100 p-3">
            <span className="font-semibold">Progress:</span>
            <div className="flex-1 text-right">
              <span
                className={isActuallyComplete ? 'font-bold text-green-600' : ''}
              >
                <span className="inline-block min-w-[3ch]">{progress}%</span>
              </span>
              {isActuallyComplete && <span className="ml-1">✓</span>}
            </div>
          </div>
        </div>

        {/* Text Display */}
        <div className="mb-4 rounded-lg border-2 border-gray-300 bg-white p-4 font-mono text-lg leading-relaxed">
          {textSample.content.split('').map((char, index) => {
            const key = `${textSample.id}-${String(index)}`;
            let className = 'text-gray-600';
            if (index < userInput.length) {
              className =
                /* v8 ignore next */
                userInput[index] === char ? 'text-green-600' : 'text-red-600';
            } else if (index === userInput.length) {
              className = 'bg-blue-200 animate-pulse';
            }
            return (
              <span key={key} className={className}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Input Field */}
        <textarea
          value={userInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          autoFocus
          rows={3}
          className="w-full resize-none rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          placeholder="Start typing here..."
          disabled={isCompleted}
          aria-label="Typing input field"
        />

        {/* Completion Guidance */}
        <div className="mt-4 h-[40px]">
          {!isActuallyComplete && userInput.length > 0 && (
            <div className="rounded bg-blue-50 p-3 text-sm text-blue-800">
              Keep typing! You need{' '}
              {textSample.content.length - userInput.length} more character
              {textSample.content.length - userInput.length === 1 ? '' : 's'} to
              finish.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
