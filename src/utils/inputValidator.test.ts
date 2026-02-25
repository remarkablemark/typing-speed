/**
 * Tests for input validation utilities
 */

import { expect } from 'vitest';

import {
  isValidKeyboardEvent,
  isValidTypingChar,
  validateAccuracyResult,
  validateDifficultyLevel,
  validateTextSample,
  validateTimingData,
  validateUserInput,
  validateWPMResult,
} from './inputValidator';

describe('inputValidator', () => {
  describe('isValidTypingChar', () => {
    it('should return true for valid printable ASCII characters', () => {
      expect(isValidTypingChar('a')).toBe(true);
      expect(isValidTypingChar('Z')).toBe(true);
      expect(isValidTypingChar('1')).toBe(true);
      expect(isValidTypingChar('!')).toBe(true);
      expect(isValidTypingChar('?')).toBe(true);
      expect(isValidTypingChar(' ')).toBe(true);
    });

    it('should return true for tab and newline characters', () => {
      expect(isValidTypingChar('\t')).toBe(true);
      expect(isValidTypingChar('\n')).toBe(true);
      expect(isValidTypingChar('\r')).toBe(true);
    });

    it('should return true for extended Unicode characters', () => {
      expect(isValidTypingChar('é')).toBe(true);
      expect(isValidTypingChar('ñ')).toBe(true);
      expect(isValidTypingChar('€')).toBe(true);
      expect(isValidTypingChar('🙂')).toBe(true);
    });

    it('should return false for control characters', () => {
      expect(isValidTypingChar('\x00')).toBe(false);
      expect(isValidTypingChar('\x01')).toBe(false);
      expect(isValidTypingChar('\x08')).toBe(false);
    });

    it('should return false for delete character', () => {
      expect(isValidTypingChar('\x7F')).toBe(false);
    });
  });

  describe('isValidKeyboardEvent', () => {
    const createMockEvent = (key: string): KeyboardEvent => {
      return new KeyboardEvent('keydown', { key });
    };

    it('should return false for modifier keys alone', () => {
      expect(isValidKeyboardEvent(createMockEvent('Control'))).toBe(false);
      expect(isValidKeyboardEvent(createMockEvent('Alt'))).toBe(false);
      expect(isValidKeyboardEvent(createMockEvent('Meta'))).toBe(false);
      expect(isValidKeyboardEvent(createMockEvent('Shift'))).toBe(false);
      expect(isValidKeyboardEvent(createMockEvent('CapsLock'))).toBe(false);
      expect(isValidKeyboardEvent(createMockEvent('NumLock'))).toBe(false);
      expect(isValidKeyboardEvent(createMockEvent('ScrollLock'))).toBe(false);
    });

    it('should return true for navigation keys', () => {
      expect(isValidKeyboardEvent(createMockEvent('Tab'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('Enter'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('Backspace'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('Delete'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('Home'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('End'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('ArrowLeft'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('ArrowRight'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('ArrowUp'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('ArrowDown'))).toBe(true);
    });

    it('should return true for printable characters', () => {
      expect(isValidKeyboardEvent(createMockEvent('a'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('Z'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('1'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent('!'))).toBe(true);
      expect(isValidKeyboardEvent(createMockEvent(' '))).toBe(true);
    });

    it('should return false for invalid characters', () => {
      expect(isValidKeyboardEvent(createMockEvent('\x00'))).toBe(false);
    });

    it('should handle edge case characters', () => {
      // Test the return path from isValidTypingChar
      expect(isValidKeyboardEvent(createMockEvent('é'))).toBe(true);
    });
  });

  describe('validateUserInput', () => {
    it('should return valid for empty input', () => {
      const result = validateUserInput('', 'test text');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for valid input', () => {
      const result = validateUserInput('hello', 'hello world');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid when expected text is empty', () => {
      const result = validateUserInput('hello', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Expected text is empty');
    });

    it('should return invalid when input exceeds expected text length', () => {
      const result = validateUserInput('hello world', 'hello');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input exceeds expected text length');
    });

    it('should return invalid for invalid characters', () => {
      const result = validateUserInput('hello\x00', 'hello world');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid character at position 6: "\x00"');
    });

    it('should handle multiple invalid characters', () => {
      const result = validateUserInput('hel\x00lo', 'hello world');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid character at position 4: "\x00"');
    });
  });

  describe('validateTextSample', () => {
    it('should return valid for valid text content', () => {
      const result = validateTextSample('This is a valid text sample.');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for non-string content', () => {
      const result = validateTextSample(null as unknown as string);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content must be a non-empty string');
    });

    it('should return invalid for empty string', () => {
      const result = validateTextSample('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content must be a non-empty string');
    });

    it('should return invalid for whitespace only', () => {
      const result = validateTextSample('   \t\n   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Content cannot be empty or whitespace only');
    });

    it('should return invalid for content exceeding maximum length', () => {
      const longText = 'a'.repeat(1001);
      const result = validateTextSample(longText);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Content exceeds maximum length of 1000 characters',
      );
    });

    it('should return invalid for content with invalid characters', () => {
      const result = validateTextSample('Valid text\x00 with invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid character at position 11: "\x00"');
    });
  });

  describe('validateDifficultyLevel', () => {
    it('should return valid for valid difficulty levels', () => {
      expect(validateDifficultyLevel('easy').isValid).toBe(true);
      expect(validateDifficultyLevel('medium').isValid).toBe(true);
      expect(validateDifficultyLevel('hard').isValid).toBe(true);
    });

    it('should return invalid for invalid difficulty levels', () => {
      const result = validateDifficultyLevel('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid difficulty level: "invalid". Must be one of: easy, medium, hard',
      );
    });

    it('should return invalid for empty difficulty', () => {
      const result = validateDifficultyLevel('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid difficulty level: "". Must be one of: easy, medium, hard',
      );
    });

    it('should be case sensitive', () => {
      const result = validateDifficultyLevel('Easy');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid difficulty level: "Easy". Must be one of: easy, medium, hard',
      );
    });
  });

  describe('validateTimingData', () => {
    it('should return valid for valid timing data', () => {
      expect(validateTimingData(1000, 2000).isValid).toBe(true);
      expect(validateTimingData(null, null).isValid).toBe(true);
      expect(validateTimingData(1000, null).isValid).toBe(true);
      expect(validateTimingData(null, 2000).isValid).toBe(true);
    });

    it('should return invalid for negative start time', () => {
      const result = validateTimingData(-1, 2000);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid start time');
    });

    it('should return invalid for invalid start time', () => {
      expect(validateTimingData(Infinity, 2000).isValid).toBe(false);
      expect(validateTimingData(-Infinity, 2000).isValid).toBe(false);
      expect(validateTimingData(NaN, 2000).isValid).toBe(false);
    });

    it('should return invalid for negative end time', () => {
      const result = validateTimingData(1000, -1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid end time');
    });

    it('should return invalid for invalid end time', () => {
      expect(validateTimingData(1000, Infinity).isValid).toBe(false);
      expect(validateTimingData(1000, -Infinity).isValid).toBe(false);
      expect(validateTimingData(1000, NaN).isValid).toBe(false);
    });

    it('should return invalid when start time is after end time', () => {
      const result = validateTimingData(2000, 1000);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start time must be before end time');
    });

    it('should return invalid when start time equals end time', () => {
      const result = validateTimingData(1000, 1000);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start time must be before end time');
    });
  });

  describe('validateWPMResult', () => {
    it('should return valid for valid WPM values', () => {
      expect(validateWPMResult(0).isValid).toBe(true);
      expect(validateWPMResult(50).isValid).toBe(true);
      expect(validateWPMResult(100).isValid).toBe(true);
      expect(validateWPMResult(500).isValid).toBe(true);
    });

    it('should return invalid for infinite WPM', () => {
      expect(validateWPMResult(Infinity).isValid).toBe(false);
      expect(validateWPMResult(-Infinity).isValid).toBe(false);
      expect(validateWPMResult(NaN).isValid).toBe(false);
    });

    it('should return invalid for negative WPM', () => {
      const result = validateWPMResult(-1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('WPM cannot be negative');
    });

    it('should return invalid for WPM exceeding maximum', () => {
      const result = validateWPMResult(501);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('WPM exceeds realistic maximum of 500');
    });
  });

  describe('validateAccuracyResult', () => {
    it('should return valid for valid accuracy values', () => {
      expect(validateAccuracyResult(0).isValid).toBe(true);
      expect(validateAccuracyResult(50).isValid).toBe(true);
      expect(validateAccuracyResult(100).isValid).toBe(true);
    });

    it('should return invalid for infinite accuracy', () => {
      expect(validateAccuracyResult(Infinity).isValid).toBe(false);
      expect(validateAccuracyResult(-Infinity).isValid).toBe(false);
      expect(validateAccuracyResult(NaN).isValid).toBe(false);
    });

    it('should return invalid for negative accuracy', () => {
      const result = validateAccuracyResult(-1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Accuracy must be between 0 and 100');
    });

    it('should return invalid for accuracy exceeding 100', () => {
      const result = validateAccuracyResult(101);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Accuracy must be between 0 and 100');
    });

    it('should handle decimal accuracy values', () => {
      expect(validateAccuracyResult(75.5).isValid).toBe(true);
      expect(validateAccuracyResult(99.99).isValid).toBe(true);
    });
  });
});
