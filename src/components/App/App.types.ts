import type {
  DifficultyLevel,
  TestResult,
  TextSample,
} from 'src/types/typing.types';

export interface AppProps {
  children?: React.ReactNode;
}

export interface AppState {
  currentDifficulty: DifficultyLevel;
  testResults: TestResult[];
  isTestActive: boolean;
  currentResult?: TestResult;
}

export interface TypingTestContainerProps {
  textSample: TextSample;
  difficulty: DifficultyLevel;
  onComplete: (result: TestResult) => void;
}
