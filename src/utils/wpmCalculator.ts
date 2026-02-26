/**
 * WPM (Words Per Minute) calculation utilities
 * Standard: 5 characters = 1 word
 */

/**
 * Calculate words per minute based on characters typed and time elapsed
 * @param characters - Number of characters typed
 * @param minutes - Time elapsed in minutes
 * @returns WPM rounded to nearest whole number
 */
export const calculateWPM = (characters: number, minutes: number): number => {
  if (minutes <= 0) {
    return 0;
  }

  const words = characters / 5;
  const wpm = words / minutes;

  return Math.round(wpm);
};

/**
 * Calculate WPM based on milliseconds elapsed
 * @param characters - Number of characters typed
 * @param milliseconds - Time elapsed in milliseconds
 * @returns WPM rounded to nearest whole number
 */
export const calculateWPMFromMs = (
  characters: number,
  milliseconds: number,
): number => {
  if (milliseconds <= 0) {
    return 0;
  }

  const minutes = milliseconds / 60000; // Convert ms to minutes
  return calculateWPM(characters, minutes);
};

/**
 * Calculate real-time WPM during active typing
 * @param characters - Number of characters typed so far
 * @param startTime - Start time in milliseconds
 * @param currentTime - Current time in milliseconds
 * @returns Current WPM rounded to nearest whole number
 */
export const calculateRealTimeWPM = (
  characters: number,
  startTime: number,
  currentTime: number,
): number => {
  if (!startTime || currentTime <= startTime) {
    return 0;
  }

  const elapsedMs = currentTime - startTime;
  return calculateWPMFromMs(characters, elapsedMs);
};

/**
 * Validate WPM calculation inputs
 * @param characters - Number of characters typed
 * @param timeMs - Time elapsed in milliseconds
 * @returns Validation result
 */
export const validateWPMInputs = (
  characters: number,
  timeMs: number,
): boolean => {
  return characters >= 0 && timeMs >= 0;
};
