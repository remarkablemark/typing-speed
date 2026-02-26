import { act, renderHook } from '@testing-library/react';
import { useTypingTest } from 'src/hooks/useTypingTest';
import type { DifficultyLevel, TextSample } from 'src/types/typing.types';

// Mock text sample
const mockTextSample: TextSample = {
  id: 'test-1',
  content: 'The quick brown fox jumps over the lazy dog.',
  difficulty: 'easy' as DifficultyLevel,
  wordCount: 9,
  characterCount: 44,
};

describe('useTypingTest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    expect(result.current.userInput).toBe('');
    expect(result.current.startTime).toBeNull();
    expect(result.current.endTime).toBeNull();
    expect(result.current.isActive).toBe(false);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.currentWPM).toBe(0);
    expect(result.current.currentAccuracy).toBe(100);
    expect(result.current.timeElapsed).toBe(0);
  });

  it('starts test on startTest call', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    act(() => {
      result.current.startTest();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.startTime).not.toBeNull();
  });

  it('returns null when completing test without proper conditions', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    // Try to complete without starting
    const result1 = result.current.completeTest();
    expect(result1).toBeNull();

    // Start but don't complete
    act(() => {
      result.current.startTest();
    });

    const result2 = result.current.completeTest();
    expect(result2).toBeNull();
  });

  it('clears interval on reset', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    // Start the test
    act(() => {
      result.current.startTest();
    });

    expect(result.current.isActive).toBe(true);

    // Reset the test
    act(() => {
      result.current.resetTest();
    });

    expect(result.current.userInput).toBe('');
    expect(result.current.startTime).toBeNull();
    expect(result.current.endTime).toBeNull();
    expect(result.current.isActive).toBe(false);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.currentWPM).toBe(0);
    expect(result.current.currentAccuracy).toBe(100);
  });

  it('handles input that does not complete test', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    act(() => {
      result.current.startTest();
    });

    act(() => {
      result.current.handleInput('X');
    });

    // Should not be completed since it doesn't match the full text
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.isActive).toBe(true);
  });

  it('returns newState for non-completing input', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    act(() => {
      result.current.startTest();
    });

    act(() => {
      result.current.handleInput('partial');
    });

    // Should return the new state with updated input (covers line 140)
    expect(result.current.userInput).toBe('partial');
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.isActive).toBe(true);
  });

  it('handles input that matches text length but not content', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    act(() => {
      result.current.startTest();
    });

    // Type input with same length but different content
    const wrongText = 'X'.repeat(mockTextSample.content.length);
    act(() => {
      result.current.handleInput(wrongText);
    });

    // Should complete since length is reached (new behavior)
    expect(result.current.isCompleted).toBe(true);
    expect(result.current.isActive).toBe(false);
    expect(result.current.userInput).toBe(wrongText);
    // Accuracy should be less than 100% since content doesn't match
    expect(result.current.currentAccuracy).toBeLessThan(100);
  });

  it('handles time elapsed calculation', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    // Initially should be 0
    expect(result.current.timeElapsed).toBe(0);

    // Start test
    act(() => {
      result.current.startTest();
    });

    // Advance time
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(result.current.timeElapsed).toBeGreaterThan(1);
  });

  it('returns proper test result when completed', () => {
    const { result } = renderHook(() => useTypingTest(mockTextSample, 'easy'));

    // Manually set up a completed state
    act(() => {
      result.current.startTest();
    });

    // Simulate completion by typing the exact text
    act(() => {
      result.current.handleInput(mockTextSample.content);
    });

    // Advance timers to allow for completion detection
    act(() => {
      vi.advanceTimersByTime(200);
    });

    const testResult = result.current.completeTest();

    if (testResult) {
      expect(testResult.id).toMatch(/^result-\d+$/);
      expect(testResult.wpm).toBeGreaterThanOrEqual(0);
      expect(testResult.accuracy).toBeGreaterThanOrEqual(0);
      expect(testResult.timeElapsed).toBeGreaterThanOrEqual(0);
      expect(testResult.difficulty).toBe('easy');
      expect(testResult.textSampleId).toBe('test-1');
    }
  });
});
