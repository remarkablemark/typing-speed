import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DifficultyLevel,
  TestResult,
  TextSample,
} from 'src/types/typing.types';
import { calculateAccuracyFromText } from 'src/utils/accuracyCalculator';
import { calculateWPMFromMs } from 'src/utils/wpmCalculator';

interface UseTypingTestState {
  userInput: string;
  startTime: Date | null;
  endTime: Date | null;
  isActive: boolean;
  isCompleted: boolean;
  currentWPM: number;
  currentAccuracy: number;
}

interface UseTypingTestReturn extends UseTypingTestState {
  startTest: () => void;
  handleInput: (input: string) => void;
  completeTest: () => TestResult | null;
  resetTest: () => void;
  timeElapsed: number;
}

export function useTypingTest(
  textSample: TextSample,
  difficulty: DifficultyLevel,
): UseTypingTestReturn {
  const [state, setState] = useState<UseTypingTestState>({
    userInput: '',
    startTime: null,
    endTime: null,
    isActive: false,
    isCompleted: false,
    currentWPM: 0,
    currentAccuracy: 100,
  });

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update current time every 100ms for accurate time calculations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const startTest = useCallback(() => {
    const now = new Date();
    setState((prev) => ({
      ...prev,
      startTime: now,
      isActive: true,
      endTime: null,
      isCompleted: false,
    }));

    // Start interval for real-time updates
    intervalRef.current = setInterval(() => {
      /* v8 ignore start */
      setState((prev) => {
        if (!prev.startTime || !prev.isActive) return prev;

        const timeElapsedMs = Date.now() - prev.startTime.getTime();

        const wpm = calculateWPMFromMs(prev.userInput.length, timeElapsedMs);
        const accuracy = calculateAccuracyFromText(
          prev.userInput,
          textSample.content,
        );

        return {
          ...prev,
          currentWPM: wpm,
          currentAccuracy: accuracy,
        };
      });
      /* v8 ignore end */
    }, 100); // Update every 100ms for smooth real-time feedback
  }, [textSample.content]);

  const handleInput = useCallback(
    (input: string) => {
      // Auto-start test on first character
      if (!state.isActive && input.length > 0 && !state.startTime) {
        startTest();
      }

      setState((prev) => {
        const newState = { ...prev, userInput: input };

        // Check if test is complete
        if (input === textSample.content && prev.startTime) {
          const endTime = new Date();
          const timeElapsedMs = endTime.getTime() - prev.startTime.getTime();

          const finalWPM = calculateWPMFromMs(input.length, timeElapsedMs);
          const finalAccuracy = calculateAccuracyFromText(
            input,
            textSample.content,
          );

          // Clear interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          return {
            ...newState,
            endTime,
            isActive: false,
            isCompleted: true,
            currentWPM: finalWPM,
            currentAccuracy: finalAccuracy,
          };
        }

        // Update real-time metrics
        if (prev.isActive && prev.startTime) {
          const currentTime = Date.now();
          const timeElapsedMs = currentTime - prev.startTime.getTime();

          const wpm = calculateWPMFromMs(input.length, timeElapsedMs);
          const accuracy = calculateAccuracyFromText(input, textSample.content);

          return {
            ...newState,
            currentWPM: wpm,
            currentAccuracy: accuracy,
          };
        }

        return newState;
      });
    },
    [textSample.content, state.isActive, state.startTime, startTest],
  );

  const completeTest = useCallback((): TestResult | null => {
    if (!state.startTime || !state.isCompleted) {
      return null;
    }

    const timeElapsed = state.endTime
      ? (state.endTime.getTime() - state.startTime.getTime()) / 1000
      : (Date.now() - state.startTime.getTime()) / 1000;

    const result: TestResult = {
      id: `result-${String(Date.now())}`,
      wpm: state.currentWPM,
      accuracy: state.currentAccuracy,
      timeElapsed,
      timestamp: state.endTime ? state.endTime.getTime() : Date.now(),
      difficulty,
      textSampleId: textSample.id,
    };

    return result;
  }, [state, difficulty, textSample.id]);

  const resetTest = useCallback(() => {
    // Clear interval if running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState({
      userInput: '',
      startTime: null,
      endTime: null,
      isActive: false,
      isCompleted: false,
      currentWPM: 0,
      currentAccuracy: 100,
    });
  }, []);

  // Calculate time elapsed
  const timeElapsed = state.startTime
    ? (currentTime - state.startTime.getTime()) / 1000
    : 0;

  return {
    ...state,
    startTest,
    handleInput,
    completeTest,
    resetTest,
    timeElapsed,
  };
}
