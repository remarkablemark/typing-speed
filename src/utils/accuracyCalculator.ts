/**
 * Accuracy calculation utilities for typing speed test
 */

/**
 * Calculate typing accuracy percentage
 * @param correct - Number of correct characters typed
 * @param total - Total characters that should have been typed
 * @returns Accuracy percentage rounded to nearest whole number (0-100)
 */
export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) {
    return 100; // Perfect accuracy when no characters expected
  }

  const accuracy = (correct / total) * 100;
  return Math.round(Math.min(100, Math.max(0, accuracy)));
};

/**
 * Compare user input with expected text and count correct characters
 * @param userInput - Text typed by user
 * @param expectedText - Text that should have been typed
 * @returns Object with correct count and total count
 */
export const compareText = (
  userInput: string,
  expectedText: string,
): { correct: number; total: number } => {
  const total = expectedText.length;
  let correct = 0;

  for (let i = 0; i < Math.min(userInput.length, expectedText.length); i++) {
    if (userInput[i] === expectedText[i]) {
      correct++;
    }
  }

  return { correct, total };
};

/**
 * Calculate accuracy from user input and expected text
 * @param userInput - Text typed by user
 * @param expectedText - Text that should have been typed
 * @returns Accuracy percentage (0-100)
 */
export const calculateAccuracyFromText = (
  userInput: string,
  expectedText: string,
): number => {
  const { correct, total } = compareText(userInput, expectedText);
  return calculateAccuracy(correct, total);
};

/**
 * Get detailed accuracy analysis including error positions
 * @param userInput - Text typed by user
 * @param expectedText - Text that should have been typed
 * @returns Array of character comparison results
 */
export const getAccuracyDetails = (
  userInput: string,
  expectedText: string,
): {
  char: string;
  expected: string;
  isCorrect: boolean;
  isTyped: boolean;
}[] => {
  const maxLength = Math.max(userInput.length, expectedText.length);
  const details = [];

  for (let i = 0; i < maxLength; i++) {
    const userChar = userInput[i];
    const expectedChar = expectedText[i];

    details.push({
      char: userChar || '',
      expected: expectedChar || '',
      isCorrect: userChar === expectedChar,
      isTyped: i < userInput.length,
    });
  }

  return details;
};

/**
 * Calculate error rate (inverse of accuracy)
 * @param userInput - Text typed by user
 * @param expectedText - Text that should have been typed
 * @returns Error rate percentage (0-100)
 */
export const calculateErrorRate = (
  userInput: string,
  expectedText: string,
): number => {
  const accuracy = calculateAccuracyFromText(userInput, expectedText);
  return 100 - accuracy;
};
