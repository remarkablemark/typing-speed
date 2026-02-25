import { useEffect, useRef } from 'react';
import { useTypingTest } from 'src/hooks/useTypingTest';

import type { TypingTestProps } from './TypingTest.types';

export function TypingTest({
  textSample,
  onComplete,
  difficulty,
}: TypingTestProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleInput(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent paste shortcuts
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const progress = Math.round(
    (userInput.length / textSample.content.length) * 100,
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold">Typing Test</h2>

        {/* Stats Display */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded bg-gray-100 p-3">
            <span className="font-semibold">WPM:</span> {currentWPM}
          </div>
          <div className="rounded bg-gray-100 p-3">
            <span className="font-semibold">Accuracy:</span> {currentAccuracy}%
          </div>
          <div className="rounded bg-gray-100 p-3">
            <span className="font-semibold">Time:</span>{' '}
            {Math.round(timeElapsed)}s
          </div>
          <div className="rounded bg-gray-100 p-3">
            <span className="font-semibold">Progress:</span> {progress}%
          </div>
        </div>

        {/* Text Display */}
        <div className="mb-4 rounded-lg border-2 border-gray-300 bg-white p-4 font-mono text-lg">
          {textSample.content.split('').map((char, index) => {
            const key = `${textSample.id}-${String(index)}`;
            let className = 'text-gray-600';
            if (index < userInput.length) {
              className =
                /* v8 ignore next */
                userInput[index] === char
                  ? 'text-green-600'
                  : 'text-red-600 bg-red-100';
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
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="w-full rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          placeholder="Start typing here..."
          disabled={isCompleted}
          aria-label="Typing input field"
        />
      </div>
    </div>
  );
}
