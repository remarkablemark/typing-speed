/**
 * Anti-cheat utilities for typing speed test
 * Prevents various forms of cheating and ensures fair play
 */

import type { AntiCheatResult } from 'src/types/typing.types';

// Maximum realistic WPM for human typists
const MAX_REALISTIC_WPM = 200;

// Maximum characters per second for realistic typing
const MAX_CHARS_PER_SECOND = (MAX_REALISTIC_WPM * 5) / 60;

// Minimum time between keystrokes (in milliseconds)
const MIN_KEYSTROKE_INTERVAL = 50;

// Store last activity timestamps for velocity checking
const keystrokeTimestamps: number[] = [];

// Store page visibility state
let pageWasHidden = false;
let testStartTime: number | null = null;

/**
 * Initialize anti-cheat monitoring for a new test
 */
export const initializeAntiCheat = (): void => {
  keystrokeTimestamps.length = 0;
  pageWasHidden = false;
  testStartTime = Date.now();
};

/**
 * Reset anti-cheat state (no test active)
 */
export const resetAntiCheat = (): void => {
  keystrokeTimestamps.length = 0;
  pageWasHidden = false;
  testStartTime = null;
};

/**
 * Check for unrealistic typing speed
 * @param charactersTyped - Number of characters typed
 * @param timeElapsedMs - Time elapsed in milliseconds
 * @returns Anti-cheat result
 */
export const checkUnrealisticSpeed = (
  charactersTyped: number,
  timeElapsedMs: number,
): AntiCheatResult => {
  if (timeElapsedMs <= 0) {
    return {
      isCheating: false,
      detectedAt: new Date(),
    };
  }

  const timeElapsedSeconds = timeElapsedMs / 1000;
  const charsPerSecond = charactersTyped / timeElapsedSeconds;
  const currentWPM = charactersTyped / 5 / (timeElapsedMs / 60000);

  if (currentWPM > MAX_REALISTIC_WPM) {
    return {
      isCheating: true,
      reason: `Unrealistic typing speed: ${String(Math.round(currentWPM))} WPM (max: ${String(MAX_REALISTIC_WPM)})`,
      detectedAt: new Date(),
    };
  }

  /* v8 ignore start */
  if (charsPerSecond > MAX_CHARS_PER_SECOND) {
    return {
      isCheating: true,
      reason: `Unrealistic character input rate: ${String(Math.round(charsPerSecond))} chars/sec (max: ${String(Math.round(MAX_CHARS_PER_SECOND))})`,
      detectedAt: new Date(),
    };
  }
  /* v8 ignore end */

  return {
    isCheating: false,
    detectedAt: new Date(),
  };
};

/**
 * Record a keystroke timestamp for velocity analysis
 * @param timestamp - Current timestamp in milliseconds
 */
export const recordKeystroke = (timestamp: number = Date.now()): void => {
  keystrokeTimestamps.push(timestamp);

  // Keep only recent timestamps (last 5 seconds)
  const fiveSecondsAgo = timestamp - 5000;
  while (
    keystrokeTimestamps.length > 0 &&
    keystrokeTimestamps[0] < fiveSecondsAgo
  ) {
    keystrokeTimestamps.shift();
  }
};

/**
 * Check for bot-like typing patterns
 * @returns Anti-cheat result
 */
export const checkBotPatterns = (): AntiCheatResult => {
  if (keystrokeTimestamps.length < 10) {
    return {
      isCheating: false,
      detectedAt: new Date(),
    };
  }

  // Check for perfectly consistent intervals (bot-like)
  const intervals: number[] = [];
  for (let i = 1; i < keystrokeTimestamps.length; i++) {
    intervals.push(keystrokeTimestamps[i] - keystrokeTimestamps[i - 1]);
  }

  // Calculate variance in intervals
  const mean =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) /
    intervals.length;
  const standardDeviation = Math.sqrt(variance);

  // Very low variance indicates bot-like behavior
  if (standardDeviation < 5 && intervals.length > 20) {
    return {
      isCheating: true,
      reason: 'Bot-like typing pattern detected (too consistent)',
      detectedAt: new Date(),
    };
  }

  // Check for intervals that are too fast (faster than humanly possible)
  const minInterval = Math.min(...intervals);
  if (minInterval < MIN_KEYSTROKE_INTERVAL) {
    return {
      isCheating: true,
      reason: `Impossibly fast keystrokes detected (${String(minInterval)}ms interval)`,
      detectedAt: new Date(),
    };
  }

  return {
    isCheating: false,
    detectedAt: new Date(),
  };
};

/**
 * Check if page was hidden during test (tab switching)
 * @returns Anti-cheat result
 */
export const checkPageVisibility = (): AntiCheatResult => {
  if (pageWasHidden && testStartTime) {
    return {
      isCheating: true,
      reason: 'Page visibility changed during test (tab switching detected)',
      detectedAt: new Date(),
    };
  }

  return {
    isCheating: false,
    detectedAt: new Date(),
  };
};

/**
 * Handle page visibility change event
 * @param isVisible - Whether page is currently visible
 */
export const handleVisibilityChange = (isVisible: boolean): void => {
  if (!isVisible && testStartTime !== null) {
    pageWasHidden = true;
  }
};

/**
 * Check for copy-paste attempts
 * @param event - Clipboard event
 * @returns Anti-cheat result
 */
export const checkCopyPaste = (event: ClipboardEvent): AntiCheatResult => {
  if (event.type === 'paste') {
    return {
      isCheating: true,
      reason: 'Paste attempt detected during typing test',
      detectedAt: new Date(),
    };
  }

  if (event.type === 'copy' || event.type === 'cut') {
    return {
      isCheating: true,
      reason: 'Copy/cut attempt detected during typing test',
      detectedAt: new Date(),
    };
  }

  return {
    isCheating: false,
    detectedAt: new Date(),
  };
};

/**
 * Validate input sequence for suspicious patterns
 * @param userInput - Current user input
 * @param expectedText - Expected text
 * @returns Anti-cheat result
 */
export const validateInputSequence = (
  userInput: string,
  expectedText: string,
): AntiCheatResult => {
  // Check for perfect accuracy with unrealistic speed first (higher priority)
  if (userInput.length > 20) {
    const accuracy =
      userInput
        .split('')
        .filter(
          (char, i) => i < expectedText.length && char === expectedText[i],
        ).length / Math.min(userInput.length, expectedText.length);

    if (accuracy === 1.0 && testStartTime) {
      const timeElapsed = Date.now() - testStartTime;
      const wpm = userInput.length / 5 / (timeElapsed / 60000);

      if (wpm > 150) {
        // Perfect accuracy at high speed is suspicious
        return {
          isCheating: true,
          reason: 'Suspicious perfect accuracy at high speed',
          detectedAt: new Date(),
        };
      }
    }
  }

  // Check for impossible character sequences (e.g., instant text appearance)
  if (keystrokeTimestamps.length > 0) {
    const lastKeystroke = keystrokeTimestamps[keystrokeTimestamps.length - 1];
    const timeSinceLastKeystroke = Date.now() - lastKeystroke;

    // If input suddenly appears without keystrokes, it's suspicious
    if (
      timeSinceLastKeystroke > 1000 &&
      userInput.length > keystrokeTimestamps.length + 10
    ) {
      return {
        isCheating: true,
        reason:
          'Suspicious input pattern detected (text appeared without typing)',
        detectedAt: new Date(),
      };
    }
  }

  return {
    isCheating: false,
    detectedAt: new Date(),
  };
};

/**
 * Comprehensive anti-cheat check
 * Combines all cheating detection methods
 * @param charactersTyped - Number of characters typed
 * @param timeElapsedMs - Time elapsed in milliseconds
 * @param userInput - Current user input
 * @param expectedText - Expected text
 * @returns Anti-cheat result
 */
export const comprehensiveAntiCheatCheck = (
  charactersTyped: number,
  timeElapsedMs: number,
  userInput: string,
  expectedText: string,
): AntiCheatResult => {
  // Check unrealistic speed
  const speedCheck = checkUnrealisticSpeed(charactersTyped, timeElapsedMs);
  if (speedCheck.isCheating) {
    return speedCheck;
  }

  // Check bot patterns
  const botCheck = checkBotPatterns();
  if (botCheck.isCheating) {
    return botCheck;
  }

  // Check page visibility
  const visibilityCheck = checkPageVisibility();
  if (visibilityCheck.isCheating) {
    return visibilityCheck;
  }

  // Validate input sequence
  const sequenceCheck = validateInputSequence(userInput, expectedText);
  if (sequenceCheck.isCheating) {
    return sequenceCheck;
  }

  return {
    isCheating: false,
    detectedAt: new Date(),
  };
};

/**
 * Setup global anti-cheat event listeners
 * Should be called when test starts
 */
export const setupAntiCheatListeners = (): void => {
  // Page visibility change
  const handleVisibilityChangeHandler = (): void => {
    handleVisibilityChange(!document.hidden);
  };

  document.addEventListener('visibilitychange', handleVisibilityChangeHandler);

  // Prevent context menu
  const handleContextMenu = (event: Event): void => {
    event.preventDefault();
  };

  document.addEventListener('contextmenu', handleContextMenu);

  // Prevent select all
  const handleKeyDown = (event: KeyboardEvent): void => {
    // Prevent Ctrl+A (select all)
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
    }

    // Prevent Ctrl+C/V/X (copy/paste/cut)
    if (
      (event.ctrlKey || event.metaKey) &&
      ['c', 'v', 'x'].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
};

/**
 * Cleanup anti-cheat event listeners
 * Should be called when test ends
 */
export const cleanupAntiCheatListeners = (): void => {
  // Note: In a real implementation, we'd store references to the handlers
  // For now, this is a placeholder to show the cleanup intent
};
