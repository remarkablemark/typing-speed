import type { TestResult } from 'src/types';

export interface ResultsDisplayProps {
  result: TestResult;
  onRestart: () => void;
  onViewHistory: () => void;
}

export interface ResultsDisplayMetrics {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  difficulty: string;
  timestamp: number;
}

export interface PerformanceIndicator {
  type: 'excellent' | 'good' | 'average' | 'poor';
  color: string;
  message: string;
}
