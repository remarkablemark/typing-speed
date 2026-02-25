import {
  calculateRealTimeWPM,
  calculateWPM,
  calculateWPMFromMs,
  validateWPMInputs,
} from './wpmCalculator';

describe('wpmCalculator', () => {
  describe('calculateWPM', () => {
    it('calculates WPM correctly for standard input', () => {
      // 250 characters in 1 minute = 50 words per minute
      expect(calculateWPM(250, 1)).toBe(50);

      // 500 characters in 2 minutes = 50 words per minute
      expect(calculateWPM(500, 2)).toBe(50);

      // 100 characters in 0.5 minutes = 40 words per minute
      expect(calculateWPM(100, 0.5)).toBe(40);
    });

    it('handles edge cases correctly', () => {
      // Zero time should return 0
      expect(calculateWPM(100, 0)).toBe(0);

      // Negative time should return 0
      expect(calculateWPM(100, -1)).toBe(0);

      // Zero characters should return 0
      expect(calculateWPM(0, 1)).toBe(0);

      // Small values should work correctly
      expect(calculateWPM(5, 1)).toBe(1); // 5 chars = 1 word
    });

    it('rounds results correctly', () => {
      // Should round to nearest whole number
      expect(calculateWPM(253, 1)).toBe(51); // 50.6 -> 51
      expect(calculateWPM(247, 1)).toBe(49); // 49.4 -> 49
      expect(calculateWPM(250, 1.1)).toBe(45); // 45.45 -> 45
    });

    it('handles large numbers correctly', () => {
      expect(calculateWPM(1000, 2)).toBe(100);
      expect(calculateWPM(5000, 5)).toBe(200);
    });
  });

  describe('calculateWPMFromMs', () => {
    it('converts milliseconds to WPM correctly', () => {
      // 250 characters in 60000ms (1 minute) = 50 WPM
      expect(calculateWPMFromMs(250, 60000)).toBe(50);

      // 250 characters in 30000ms (0.5 minutes) = 100 WPM
      expect(calculateWPMFromMs(250, 30000)).toBe(100);
    });

    it('handles zero and negative milliseconds', () => {
      expect(calculateWPMFromMs(100, 0)).toBe(0);
      expect(calculateWPMFromMs(100, -1000)).toBe(0);
    });

    it('handles realistic typing speeds', () => {
      // 40 WPM = 200 chars per minute = 200 chars per 60000ms
      expect(calculateWPMFromMs(200, 60000)).toBe(40);

      // 80 WPM = 400 chars per minute = 400 chars per 60000ms
      expect(calculateWPMFromMs(400, 60000)).toBe(80);
    });
  });

  describe('calculateRealTimeWPM', () => {
    const currentTime = 1000000; // 1,000,000ms timestamp

    it('calculates real-time WPM correctly', () => {
      const startTime = 940000; // Started 60 seconds ago
      expect(calculateRealTimeWPM(250, startTime, currentTime)).toBe(50);
    });

    it('handles invalid time inputs', () => {
      // No start time
      expect(calculateRealTimeWPM(100, 0, currentTime)).toBe(0);
      expect(
        calculateRealTimeWPM(100, null as unknown as number, currentTime),
      ).toBe(0);

      // Current time before or equal to start time
      expect(calculateRealTimeWPM(100, currentTime, currentTime)).toBe(0);
      expect(calculateRealTimeWPM(100, currentTime, 900000)).toBe(0);
    });

    it('handles very recent typing', () => {
      const startTime = 999000; // Started 1 second ago
      expect(calculateRealTimeWPM(25, startTime, currentTime)).toBe(300); // ~300 WPM for 25 chars in 1 second
    });
  });

  describe('validateWPMInputs', () => {
    it('validates correct inputs', () => {
      expect(validateWPMInputs(100, 60000)).toBe(true);
      expect(validateWPMInputs(0, 0)).toBe(true);
      expect(validateWPMInputs(500, 120000)).toBe(true);
    });

    it('rejects invalid inputs', () => {
      // Negative characters
      expect(validateWPMInputs(-1, 60000)).toBe(false);

      // Negative time
      expect(validateWPMInputs(100, -1000)).toBe(false);

      // Both negative
      expect(validateWPMInputs(-1, -1)).toBe(false);
    });

    it('handles edge cases', () => {
      expect(validateWPMInputs(0, 60000)).toBe(true);
      expect(validateWPMInputs(100, 0)).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('calculates realistic typing scenarios', () => {
      // Average typist: 40 WPM
      const charsTyped = 200; // 40 words
      const timeMinutes = 1;
      expect(calculateWPM(charsTyped, timeMinutes)).toBe(40);

      // Fast typist: 80 WPM
      const fastChars = 400; // 80 words
      expect(calculateWPM(fastChars, timeMinutes)).toBe(80);

      // Slow typist: 20 WPM
      const slowChars = 100; // 20 words
      expect(calculateWPM(slowChars, timeMinutes)).toBe(20);
    });

    it('maintains consistency across functions', () => {
      const characters = 250;
      const milliseconds = 60000;

      const wpm1 = calculateWPM(characters, 1);
      const wpm2 = calculateWPMFromMs(characters, milliseconds);

      expect(wpm1).toBe(wpm2);
    });
  });
});
