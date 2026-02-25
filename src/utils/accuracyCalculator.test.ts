import {
  calculateAccuracy,
  calculateAccuracyFromText,
  calculateErrorRate,
  compareText,
  getAccuracyDetails,
} from './accuracyCalculator';

describe('accuracyCalculator', () => {
  describe('calculateAccuracy', () => {
    it('calculates perfect accuracy', () => {
      expect(calculateAccuracy(10, 10)).toBe(100);
      expect(calculateAccuracy(50, 50)).toBe(100);
    });

    it('calculates partial accuracy correctly', () => {
      expect(calculateAccuracy(5, 10)).toBe(50);
      expect(calculateAccuracy(3, 4)).toBe(75); // 3/4 = 0.75 -> 75
      expect(calculateAccuracy(7, 10)).toBe(70);
    });

    it('handles zero total correctly', () => {
      expect(calculateAccuracy(0, 0)).toBe(100); // Perfect accuracy when no characters expected
      expect(calculateAccuracy(5, 0)).toBe(100); // Still perfect when no characters expected

      // Test the specific branch for total === 0
      const result = calculateAccuracy(10, 0);
      expect(result).toBe(100);
    });

    it('rounds correctly', () => {
      expect(calculateAccuracy(1, 3)).toBe(33); // 33.33% -> 33
      expect(calculateAccuracy(2, 3)).toBe(67); // 66.67% -> 67
      expect(calculateAccuracy(1, 6)).toBe(17); // 16.67% -> 17
    });

    it('handles edge cases', () => {
      expect(calculateAccuracy(0, 10)).toBe(0); // No correct characters
      expect(calculateAccuracy(10, 0)).toBe(100); // Zero total
      expect(calculateAccuracy(1, 1)).toBe(100); // Single correct
      expect(calculateAccuracy(0, 1)).toBe(0); // Single incorrect
    });

    it('clamps values between 0 and 100', () => {
      expect(calculateAccuracy(150, 100)).toBe(100); // More correct than total
      expect(calculateAccuracy(-10, 10)).toBe(0); // Negative correct (shouldn't happen but handled)
    });

    it('covers all Math.min and Math.max branches', () => {
      // Test the Math.max(0, accuracy) branch - when accuracy < 0
      expect(calculateAccuracy(-5, 10)).toBe(0); // accuracy = -50%, clamped to 0

      // Test the Math.min(100, accuracy) branch - when accuracy > 100
      expect(calculateAccuracy(150, 100)).toBe(100); // accuracy = 150%, clamped to 100

      // Test the normal case where 0 <= accuracy <= 100
      expect(calculateAccuracy(75, 100)).toBe(75); // accuracy = 75%, no clamping needed

      // Test exact boundary values
      expect(calculateAccuracy(0, 100)).toBe(0); // exactly 0%
      expect(calculateAccuracy(100, 100)).toBe(100); // exactly 100%

      // Test edge case where accuracy calculation results in exactly 0
      expect(calculateAccuracy(0, 1)).toBe(0); // 0/1 = 0%, should trigger Math.max branch

      // Test edge case where accuracy calculation results in exactly 100
      expect(calculateAccuracy(1, 1)).toBe(100); // 1/1 = 100%, should not trigger clamping

      // Test case that would result in accuracy > 100 to ensure Math.min branch is hit
      expect(calculateAccuracy(101, 100)).toBe(100); // 101/100 = 101%, clamped to 100
    });
  });

  describe('compareText', () => {
    it('compares identical text correctly', () => {
      const result = compareText('hello world', 'hello world');
      expect(result.correct).toBe(11);
      expect(result.total).toBe(11);
    });

    it('compares different text correctly', () => {
      const result = compareText('hello', 'world');
      expect(result.correct).toBe(1); // 'o' matches at position 4
      expect(result.total).toBe(5);
    });

    it('handles partial matches', () => {
      const result = compareText('hello', 'help');
      expect(result.correct).toBe(3); // 'h', 'e', 'l' match
      expect(result.total).toBe(4);
    });

    it('handles user input shorter than expected', () => {
      const result = compareText('hel', 'hello');
      expect(result.correct).toBe(3);
      expect(result.total).toBe(5);
    });

    it('handles user input longer than expected', () => {
      const result = compareText('hello world', 'hello');
      expect(result.correct).toBe(5); // Only compares up to expected length
      expect(result.total).toBe(5);
    });

    it('handles empty strings', () => {
      const result1 = compareText('', 'hello');
      expect(result1.correct).toBe(0);
      expect(result1.total).toBe(5);

      const result2 = compareText('hello', '');
      expect(result2.correct).toBe(0);
      expect(result2.total).toBe(0);

      const result3 = compareText('', '');
      expect(result3.correct).toBe(0);
      expect(result3.total).toBe(0);
    });

    it('handles spaces and punctuation', () => {
      const result = compareText('hello, world!', 'hello, world!');
      expect(result.correct).toBe(13);
      expect(result.total).toBe(13);

      const result2 = compareText('hello world', 'hello, world!');
      expect(result2.correct).toBe(5); // 'hello' matches, space doesn't match comma
      expect(result2.total).toBe(13);
    });
  });

  describe('calculateAccuracyFromText', () => {
    it('calculates accuracy from text comparison', () => {
      expect(calculateAccuracyFromText('hello', 'hello')).toBe(100);
      expect(calculateAccuracyFromText('hello', 'world')).toBe(20); // 1/5 = 20%
      expect(calculateAccuracyFromText('hel', 'hello')).toBe(60); // 3/5 = 60%
      expect(calculateAccuracyFromText('hello', 'help')).toBe(75); // 3/4 = 75%
    });

    it('handles empty inputs', () => {
      expect(calculateAccuracyFromText('', 'hello')).toBe(0);
      expect(calculateAccuracyFromText('hello', '')).toBe(100); // No characters to compare
      expect(calculateAccuracyFromText('', '')).toBe(100);
    });

    it('rounds correctly', () => {
      expect(calculateAccuracyFromText('h', 'hello')).toBe(20); // 1/5 = 20%
      expect(calculateAccuracyFromText('he', 'hello')).toBe(40); // 2/5 = 40%
      expect(calculateAccuracyFromText('hel', 'hello')).toBe(60); // 3/5 = 60%
    });
  });

  describe('getAccuracyDetails', () => {
    it('provides detailed character comparison', () => {
      const details = getAccuracyDetails('hello', 'hello');
      expect(details).toHaveLength(5);
      expect(details[0]).toEqual({
        char: 'h',
        expected: 'h',
        isCorrect: true,
        isTyped: true,
      });
    });

    it('shows incorrect characters', () => {
      const details = getAccuracyDetails('hello', 'world');
      expect(details).toHaveLength(5);
      expect(details[0]).toEqual({
        char: 'h',
        expected: 'w',
        isCorrect: false,
        isTyped: true,
      });
    });

    it('handles different lengths', () => {
      const details = getAccuracyDetails('hel', 'hello');
      expect(details).toHaveLength(5);

      // Typed characters
      expect(details[0]).toEqual({
        char: 'h',
        expected: 'h',
        isCorrect: true,
        isTyped: true,
      });

      // Untyped characters
      expect(details[3]).toEqual({
        char: '',
        expected: 'l',
        isCorrect: false,
        isTyped: false,
      });
    });

    it('handles user input longer than expected', () => {
      const details = getAccuracyDetails('hello world', 'hello');
      expect(details).toHaveLength(11);

      // Extra characters
      expect(details[5]).toEqual({
        char: ' ',
        expected: '',
        isCorrect: false,
        isTyped: true,
      });
    });

    it('handles empty strings and covers all logical operator branches', () => {
      const details1 = getAccuracyDetails('', 'hello');
      expect(details1).toHaveLength(5);
      expect(details1[0]).toEqual({
        char: '', // This covers the userChar || '' branch when userChar is undefined
        expected: 'h',
        isCorrect: false, // This covers the userChar === expectedChar false branch
        isTyped: false, // This covers the i < userInput.length false branch
      });

      const details2 = getAccuracyDetails('hello', '');
      expect(details2).toHaveLength(5);
      expect(details2[0]).toEqual({
        char: 'h',
        expected: '', // This covers the expectedChar || '' branch when expectedChar is undefined
        isCorrect: false, // This covers the userChar === expectedChar false branch
        isTyped: true, // This covers the i < userInput.length true branch
      });

      // Test case where both are empty strings
      const details3 = getAccuracyDetails('', '');
      expect(details3).toHaveLength(0);

      // Test case where characters match to cover the true branch of isCorrect
      const details4 = getAccuracyDetails('a', 'a');
      expect(details4[0]).toEqual({
        char: 'a',
        expected: 'a',
        isCorrect: true, // This covers the userChar === expectedChar true branch
        isTyped: true,
      });

      // Test case where characters don't match to cover the false branch of isCorrect
      const details5 = getAccuracyDetails('a', 'b');
      expect(details5[0]).toEqual({
        char: 'a',
        expected: 'b',
        isCorrect: false, // This covers the userChar === expectedChar false branch
        isTyped: true,
      });
    });
  });

  describe('calculateErrorRate', () => {
    it('calculates error rate as inverse of accuracy', () => {
      expect(calculateErrorRate('hello', 'hello')).toBe(0); // 100% accuracy -> 0% error
      expect(calculateErrorRate('hello', 'world')).toBe(80); // 20% accuracy -> 80% error
      expect(calculateErrorRate('hel', 'hello')).toBe(40); // 60% accuracy -> 40% error
      expect(calculateErrorRate('hello', 'help')).toBe(25); // 75% accuracy -> 25% error
    });

    it('handles empty inputs', () => {
      expect(calculateErrorRate('', 'hello')).toBe(100); // 0% accuracy -> 100% error
      expect(calculateErrorRate('hello', '')).toBe(0); // 100% accuracy -> 0% error
      expect(calculateErrorRate('', '')).toBe(0); // 100% accuracy -> 0% error
    });

    it('returns integer values', () => {
      const errorRate = calculateErrorRate('h', 'hello'); // 20% accuracy -> 80% error
      expect(errorRate).toBe(80);
      expect(Number.isInteger(errorRate)).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('handles complex text with punctuation', () => {
      const userInput = 'The quick brown fox jumps.';
      const expectedText = 'The quick brown fox jumps over the lazy dog.';

      const accuracy = calculateAccuracyFromText(userInput, expectedText);
      const errorRate = calculateErrorRate(userInput, expectedText);
      const details = getAccuracyDetails(userInput, expectedText);

      expect(accuracy).toBeLessThan(100);
      expect(errorRate).toBeGreaterThan(0);
      expect(errorRate).toBe(100 - accuracy);
      expect(details).toHaveLength(expectedText.length);
    });

    it('maintains consistency across functions', () => {
      const userInput = 'hello';
      const expectedText = 'help';

      const comparison = compareText(userInput, expectedText);
      const accuracy = calculateAccuracy(comparison.correct, comparison.total);
      const accuracyFromText = calculateAccuracyFromText(
        userInput,
        expectedText,
      );

      expect(accuracy).toBe(accuracyFromText);
    });

    it('handles realistic typing scenarios', () => {
      // Perfect typing
      expect(calculateAccuracyFromText('hello world', 'hello world')).toBe(100);

      // Common errors
      expect(calculateAccuracyFromText('hello wrold', 'hello world')).toBe(82); // 9/11 = 81.82% -> 82%

      // Partial typing
      expect(calculateAccuracyFromText('hello', 'hello world')).toBe(45); // 5/11 correct

      // No typing yet
      expect(calculateAccuracyFromText('', 'hello world')).toBe(0);
    });
  });
});
