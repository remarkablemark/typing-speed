import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerState {
  isRunning: boolean;
  time: number;
}

interface UseTimerReturn extends UseTimerState {
  start: () => void;
  stop: () => void;
  reset: () => void;
  toggle: () => void;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<UseTimerState>({
    isRunning: false,
    time: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (!state.isRunning) {
      startTimeRef.current = Date.now() - state.time * 1000;
      setState((prev) => ({ ...prev, isRunning: true }));
    }
  }, [state.isRunning, state.time]);

  const stop = useCallback(() => {
    if (state.isRunning) {
      setState((prev) => ({ ...prev, isRunning: false }));
    }
  }, [state.isRunning]);

  const reset = useCallback(() => {
    setState({ isRunning: false, time: 0 });
    startTimeRef.current = 0;
  }, []);

  const toggle = useCallback(() => {
    if (state.isRunning) {
      stop();
    } else {
      start();
    }
  }, [state.isRunning, start, stop]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          time: (Date.now() - startTimeRef.current) / 1000,
        }));
      }, 100); // Update every 100ms for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  return {
    ...state,
    start,
    stop,
    reset,
    toggle,
  };
}
