import { useEffect, useRef, useState } from 'react';
import type {
  DifficultyLevel,
  TestResult,
  TextSample,
} from 'src/types/typing.types';

interface TypingTestProps {
  textSample: TextSample;
  onComplete: (result: TestResult) => void;
  difficulty: DifficultyLevel;
}

export function TypingTest({
  textSample,
  onComplete,
  difficulty,
}: TypingTestProps) {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startTime) {
      interval = setInterval(() => {
        setCurrentTime((Date.now() - startTime.getTime()) / 1000);
      }, 100);
    }
    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  const calculateWPM = (): number => {
    if (!startTime || userInput.length === 0) return 0;
    const timeInMinutes = currentTime / 60;
    const wordsTyped = userInput.trim().split(/\s+/).length;
    /* v8 ignore next - @preserve */
    return Math.round(wordsTyped / timeInMinutes || 0);
  };

  const calculateAccuracy = (): number => {
    if (userInput.length === 0) return 100;
    let errorCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== textSample.content[i]) {
        errorCount++;
      }
    }
    return Math.round(
      ((userInput.length - errorCount) / userInput.length) * 100,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!startTime && e.key.length === 1) {
      setStartTime(new Date());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUserInput(newValue);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] !== textSample.content[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Check if test is complete
    if (newValue === textSample.content && startTime) {
      const endTime = new Date();
      const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000;

      const result: TestResult = {
        id: `result-${String(Date.now())}`,
        wpm: calculateWPM(),
        accuracy: calculateAccuracy(),
        timeElapsed,
        timestamp: endTime,
        difficulty,
        textSampleId: textSample.id,
      };

      onComplete(result);
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
            <span className="font-semibold">WPM:</span> {calculateWPM()}
          </div>
          <div className="rounded bg-gray-100 p-3">
            <span className="font-semibold">Accuracy:</span>{' '}
            {calculateAccuracy()}%
          </div>
          <div className="rounded bg-gray-100 p-3">
            <span className="font-semibold">Time:</span>{' '}
            {Math.round(currentTime)}s
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
          aria-label="Typing input field"
        />
      </div>
    </div>
  );
}
