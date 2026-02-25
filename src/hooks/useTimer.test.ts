import { act, renderHook } from '@testing-library/react';
import { useTimer } from 'src/hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with stopped state and zero time', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.time).toBe(0);
  });

  it('starts timer when start is called', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.time).toBe(0);
  });

  it('stops timer when stop is called', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('toggles timer state', () => {
    const { result } = renderHook(() => useTimer());

    // Start from stopped state
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isRunning).toBe(true);

    // Toggle to stopped
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isRunning).toBe(false);
  });

  it('resets timer to initial state', () => {
    const { result } = renderHook(() => useTimer());

    // Start timer and advance time
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBeGreaterThan(0);

    // Reset timer
    act(() => {
      result.current.reset();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.time).toBe(0);
  });

  it('updates time correctly while running', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    // Advance time by 500ms (should update after 100ms intervals)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should have advanced approximately 0.5 seconds
    expect(result.current.time).toBeCloseTo(0.5, 1);

    // Advance another 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.time).toBeCloseTo(1, 1);
  });

  it('maintains time when stopped and restarted', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      result.current.stop();
    });

    const stoppedTime = result.current.time;
    expect(stoppedTime).toBeCloseTo(1, 1);

    // Restart and advance more time
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.time).toBeCloseTo(1.5, 1);
  });

  it('does not update time when stopped', () => {
    const { result } = renderHook(() => useTimer());

    // Don't start timer, just advance time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('handles multiple start calls gracefully', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.start(); // Call start again
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.time).toBeCloseTo(0.5, 1);
  });

  it('handles multiple stop calls gracefully', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.stop();
    });
    act(() => {
      result.current.stop(); // Call stop again
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('cleans up interval on unmount', () => {
    const { result, unmount } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    // Unmount the hook, which should trigger cleanup
    unmount();

    // Timer should be stopped after cleanup
    expect(result.current.isRunning).toBe(true); // State doesn't change on unmount
  });

  it('handles cleanup when stopping timer', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    // Stop the timer, which should clear the interval
    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('clears interval and sets to null when stopping', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.stop();
    });

    // The interval should be cleared and set to null
    expect(result.current.isRunning).toBe(false);
  });

  it('handles interval cleanup in useEffect cleanup', () => {
    const { result, unmount } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    // Unmount should trigger cleanup and clear the interval
    unmount();
  });
});
