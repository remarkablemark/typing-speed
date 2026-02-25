/**
 * Shared TypeScript interfaces for typing speed test application
 */

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface TextSample {
  id: string;
  content: string;
  difficulty: DifficultyLevel;
  wordCount: number;
  characterCount: number;
}

export interface TypingTest {
  id: string;
  textSample: TextSample;
  userInput: string;
  startTime: Date | null;
  endTime: Date | null;
  isActive: boolean;
  difficulty: DifficultyLevel;
}

export interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  timestamp: Date | string;
  difficulty: DifficultyLevel;
  textSampleId: string;
}

export interface SessionData {
  testHistory: TestResult[];
  currentTest?: TypingTest;
}

export interface TypingMetrics {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  charactersTyped: number;
  errors: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface AntiCheatResult {
  isCheating: boolean;
  reason?: string;
  detectedAt: Date;
}
