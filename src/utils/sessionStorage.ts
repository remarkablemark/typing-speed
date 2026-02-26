import type { TestResult, TypingTest } from 'src/types';

interface SessionData {
  testHistory: TestResult[];
  currentTest?: TypingTest | null;
}

interface PartialSessionData {
  testHistory?: TestResult[];
  currentTest?: TypingTest | null;
}

const STORAGE_KEY = 'typing-speed.data';

/**
 * Saves a test result to session storage
 * @param result - The test result to save
 */
export const saveTestResult = (result: TestResult): void => {
  try {
    const existingData = getSessionData();
    const updatedData: SessionData = {
      ...existingData,
      testHistory: [...existingData.testHistory, result],
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch {
    // Silently handle storage errors (quota exceeded, etc.)
    // Could implement fallback or user notification in production
  }
};

/**
 * Retrieves test history from session storage
 * @returns Array of test results
 */
export const getTestHistory = (): TestResult[] => {
  try {
    const data = getSessionData();
    return data.testHistory;
  } catch {
    /* v8 ignore next -- @preserve */
    return [];
  }
};

/**
 * Clears test history from session storage
 */
export const clearTestHistory = (): void => {
  try {
    const existingData = getSessionData();
    const updatedData: SessionData = {
      ...existingData,
      testHistory: [],
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch {
    // Silently handle storage errors
  }
};

/**
 * Saves the current active test to session storage
 * @param test - The current typing test
 */
export const saveCurrentTest = (test: TypingTest): void => {
  try {
    const existingData = getSessionData();
    const updatedData: SessionData = {
      ...existingData,
      currentTest: test,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch {
    // Silently handle storage errors
  }
};

/**
 * Retrieves the current active test from session storage
 * @returns The current typing test or null if none exists
 */
export const getCurrentTest = (): TypingTest | null => {
  try {
    const data = getSessionData();
    return data.currentTest ?? null;
  } catch {
    /* v8 ignore next -- @preserve */
    return null;
  }
};

/**
 * Clears the current active test from session storage
 */
export const clearCurrentTest = (): void => {
  try {
    const existingData = getSessionData();
    const updatedData: SessionData = {
      ...existingData,
      currentTest: null,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch {
    // Silently handle storage errors
  }
};

/**
 * Helper function to get and parse session data
 * @returns Parsed session data or default empty data
 */
const getSessionData = (): SessionData => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { testHistory: [] };
    }
    const parsed = JSON.parse(stored) as PartialSessionData;

    // Convert timestamp numbers back to Date objects for compatibility
    const testHistory = (parsed.testHistory ?? []).map((result) => ({
      ...result,
      timestamp: result.timestamp,
    }));

    return {
      testHistory,
      currentTest: parsed.currentTest ?? null,
    };
  } catch {
    return { testHistory: [] };
  }
};
