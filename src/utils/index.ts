// WPM calculation utilities
export {
  calculateRealTimeWPM,
  calculateWPM,
  calculateWPMFromMs,
  validateWPMInputs,
} from './wpmCalculator';

// Accuracy calculation utilities
export {
  calculateAccuracy,
  calculateAccuracyFromText,
  calculateErrorRate,
  compareText,
  getAccuracyDetails,
} from './accuracyCalculator';

// Text samples utilities
export {
  getRandomTextSample,
  getTextSampleById,
  getTextSamplesByDifficulty,
  textSamples,
} from './textSamples';

// Input validation utilities
export {
  isValidKeyboardEvent,
  isValidTypingChar,
  validateAccuracyResult,
  validateDifficultyLevel,
  validateTextSample,
  validateTimingData,
  validateUserInput,
  validateWPMResult,
} from './inputValidator';

// Session storage utilities
export {
  clearCurrentTest,
  clearTestHistory,
  getCurrentTest,
  getTestHistory,
  saveCurrentTest,
  saveTestResult,
} from './sessionStorage';
