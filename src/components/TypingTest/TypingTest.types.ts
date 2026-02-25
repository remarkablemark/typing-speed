import type {
  DifficultyLevel,
  TestResult,
  TextSample,
} from 'src/types/typing.types';

export interface TypingTestProps {
  textSample: TextSample;
  onComplete: (result: TestResult) => void;
  difficulty: DifficultyLevel;
}

export interface TypingTestCharacterProps {
  char: string;
  index: number;
  userInput: string;
  isActive: boolean;
}

export interface TypingTestStatsProps {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  progress: number;
}
