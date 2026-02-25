/**
 * Input validation utilities for typing speed test
 */

import type { ValidationResult } from 'src/types/typing.types';

/**
 * Validate if a character is a valid typing input
 * @param char - Character to validate
 * @returns True if character is valid for typing input
 */
export const isValidTypingChar = (char: string): boolean => {
  // Allow printable characters including letters, numbers, punctuation, and spaces
  // Exclude control characters and non-printable characters
  const code = char.charCodeAt(0);

  // Tab (9), Newline (10-13), Space (32) are allowed
  if (code === 9 || (code >= 10 && code <= 13) || code === 32) {
    return true;
  }

  // Printable ASCII characters (33-126)
  if (code >= 33 && code <= 126) {
    return true;
  }

  // Extended Unicode printable characters (128 and above)
  if (code >= 128) {
    return true;
  }

  return false;
};

/**
 * Validate keyboard event for typing input
 * @param event - Keyboard event to validate
 * @returns True if event should be processed for typing
 */
export const isValidKeyboardEvent = (event: KeyboardEvent): boolean => {
  // Allow character keys, space, backspace, tab, enter
  // Allow modifier combinations (Shift+key, Ctrl+key for special cases)

  // Ignore modifier keys alone
  if (
    [
      'Control',
      'Alt',
      'Meta',
      'Shift',
      'CapsLock',
      'NumLock',
      'ScrollLock',
    ].includes(event.key)
  ) {
    return false;
  }

  // Allow navigation keys for accessibility
  const navigationKeys = [
    'Tab',
    'Enter',
    'Backspace',
    'Delete',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  if (navigationKeys.includes(event.key)) {
    return true;
  }

  // Allow printable characters
  return isValidTypingChar(event.key);
};

/**
 * Validate user input against expected text
 * @param userInput - Text typed by user
 * @param expectedText - Expected text
 * @returns Validation result with error details
 */
export const validateUserInput = (
  userInput: string,
  expectedText: string,
): ValidationResult => {
  if (!userInput || userInput.length === 0) {
    return { isValid: true }; // Empty input is valid
  }

  if (!expectedText || expectedText.length === 0) {
    return { isValid: false, error: 'Expected text is empty' };
  }

  // Check if user input exceeds expected text length
  if (userInput.length > expectedText.length) {
    return { isValid: false, error: 'Input exceeds expected text length' };
  }

  // Validate each character
  for (let i = 0; i < userInput.length; i++) {
    const userChar = userInput[i];

    if (!isValidTypingChar(userChar)) {
      return {
        isValid: false,
        error: `Invalid character at position ${String(i + 1)}: "${userChar}"`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Validate text sample content
 * @param content - Text sample content to validate
 * @returns Validation result with error details
 */
export const validateTextSample = (content: string): ValidationResult => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Content must be a non-empty string' };
  }

  if (content.trim().length === 0) {
    return {
      isValid: false,
      error: 'Content cannot be empty or whitespace only',
    };
  }

  if (content.length > 1000) {
    return {
      isValid: false,
      error: 'Content exceeds maximum length of 1000 characters',
    };
  }

  // Check for invalid characters
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (!isValidTypingChar(char)) {
      return {
        isValid: false,
        error: `Invalid character at position ${String(i + 1)}: "${char}"`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Validate difficulty level
 * @param difficulty - Difficulty level to validate
 * @returns Validation result with error details
 */
export const validateDifficultyLevel = (
  difficulty: string,
): ValidationResult => {
  const validLevels = ['easy', 'medium', 'hard'];

  if (!validLevels.includes(difficulty)) {
    return {
      isValid: false,
      error: `Invalid difficulty level: "${difficulty}". Must be one of: ${validLevels.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate typing test timing data
 * @param startTime - Start time in milliseconds
 * @param endTime - End time in milliseconds
 * @returns Validation result with error details
 */
export const validateTimingData = (
  startTime: number | null,
  endTime: number | null,
): ValidationResult => {
  if (startTime !== null && (startTime < 0 || !Number.isFinite(startTime))) {
    return { isValid: false, error: 'Invalid start time' };
  }

  if (endTime !== null && (endTime < 0 || !Number.isFinite(endTime))) {
    return { isValid: false, error: 'Invalid end time' };
  }

  if (startTime !== null && endTime !== null && startTime >= endTime) {
    return { isValid: false, error: 'Start time must be before end time' };
  }

  return { isValid: true };
};

/**
 * Validate WPM calculation result
 * @param wpm - Calculated WPM value
 * @returns Validation result with error details
 */
export const validateWPMResult = (wpm: number): ValidationResult => {
  if (!Number.isFinite(wpm)) {
    return { isValid: false, error: 'WPM must be a finite number' };
  }

  if (wpm < 0) {
    return { isValid: false, error: 'WPM cannot be negative' };
  }

  if (wpm > 500) {
    return { isValid: false, error: 'WPM exceeds realistic maximum of 500' };
  }

  return { isValid: true };
};

/**
 * Validate accuracy calculation result
 * @param accuracy - Calculated accuracy percentage
 * @returns Validation result with error details
 */
export const validateAccuracyResult = (accuracy: number): ValidationResult => {
  if (!Number.isFinite(accuracy)) {
    return { isValid: false, error: 'Accuracy must be a finite number' };
  }

  if (accuracy < 0 || accuracy > 100) {
    return { isValid: false, error: 'Accuracy must be between 0 and 100' };
  }

  return { isValid: true };
};
