import type { TestResult } from 'src/types';

export interface TestHistoryProps {
  results: TestResult[];
  onSelectResult: (result: TestResult) => void;
  onClearHistory: () => void;
}

export interface TestHistoryStats {
  totalTests: number;
  averageWPM: number;
  bestWPM: number;
  averageAccuracy: number;
  bestAccuracy: number;
  averageTime: number;
}

export interface TestHistoryItem extends TestResult {
  isExpanded?: boolean;
}

export interface TestHistorySummary {
  totalTests: number;
  averageWPM: number;
  bestWPM: number;
  averageAccuracy: number;
  bestAccuracy: number;
  averageTime: number;
}
