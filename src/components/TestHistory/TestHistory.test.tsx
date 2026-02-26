import { fireEvent, render, screen } from '@testing-library/react';
import type { DifficultyLevel, TestResult } from 'src/types';

import { TestHistory } from './TestHistory';
import type { TestHistoryProps } from './TestHistory.types';

// Mock test result data
const createMockTestResult = (
  overrides: Partial<TestResult> = {},
): TestResult => ({
  id: 'test-1',
  wpm: 60,
  accuracy: 95,
  timeElapsed: 120,
  timestamp: new Date('2026-02-24T12:00:00Z').getTime(),
  difficulty: 'medium' as DifficultyLevel,
  textSampleId: 'sample-1',
  ...overrides,
});

describe('TestHistory', () => {
  const mockOnSelectResult = vi.fn();
  const mockOnClearHistory = vi.fn();

  const defaultProps: TestHistoryProps = {
    results: [],
    onSelectResult: mockOnSelectResult,
    onClearHistory: mockOnClearHistory,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no results', () => {
    render(<TestHistory {...defaultProps} />);

    expect(screen.getByText(/no test history/i)).toBeInTheDocument();
    expect(
      screen.getByText(/complete a test to see your results/i),
    ).toBeInTheDocument();
  });

  it('displays list of test results when provided', () => {
    const results = [
      createMockTestResult({
        id: 'test-1',
        wpm: 60,
        timestamp: new Date('2026-02-24T12:00:00Z').getTime(),
      }),
      createMockTestResult({
        id: 'test-2',
        wpm: 75,
        timestamp: new Date('2026-02-24T13:00:00Z').getTime(),
      }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('60');
    expect(screen.getByTestId('result-test-2')).toHaveTextContent('75');
    expect(screen.getByText(/2 tests completed/i)).toBeInTheDocument();
  });

  it('shows summary statistics for multiple results', () => {
    const results = [
      createMockTestResult({ id: 'test-1', wpm: 60 }),
      createMockTestResult({ id: 'test-2', wpm: 80 }),
      createMockTestResult({ id: 'test-3', wpm: 70 }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('average-wpm')).toHaveTextContent('70');
    expect(screen.getByTestId('best-wpm')).toHaveTextContent('80');
  });

  it('calls onSelectResult when result is clicked', () => {
    const results = [createMockTestResult({ id: 'test-1' })];

    render(<TestHistory {...defaultProps} results={results} />);

    const resultItem = screen.getByRole('button', { name: /test result/i });
    fireEvent.click(resultItem);

    expect(mockOnSelectResult).toHaveBeenCalledWith(results[0]);
  });

  it('calls onClearHistory when clear button is clicked', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    const clearButton = screen.getByLabelText('Clear all test history');
    fireEvent.click(clearButton);

    expect(mockOnClearHistory).toHaveBeenCalledTimes(1);
  });

  it('displays results in chronological order (newest first)', () => {
    const results = [
      createMockTestResult({
        id: 'test-1',
        timestamp: new Date('2026-02-24T12:00:00Z').getTime(),
      }),
      createMockTestResult({
        id: 'test-2',
        timestamp: new Date('2026-02-24T13:00:00Z').getTime(),
      }),
      createMockTestResult({
        id: 'test-3',
        timestamp: new Date('2026-02-24T11:00:00Z').getTime(),
      }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    const resultItems = screen.getAllByRole('button', { name: /test result/i });
    expect(resultItems[0]).toHaveAttribute('data-testid', 'result-test-2'); // Newest
    expect(resultItems[1]).toHaveAttribute('data-testid', 'result-test-1'); // Middle
    expect(resultItems[2]).toHaveAttribute('data-testid', 'result-test-3'); // Oldest
  });

  it('shows difficulty level for each result', () => {
    const results = [
      createMockTestResult({
        id: 'test-1',
        difficulty: 'easy' as DifficultyLevel,
      }),
      createMockTestResult({
        id: 'test-2',
        difficulty: 'hard' as DifficultyLevel,
      }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByText(/easy/i)).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
  });

  it('displays accuracy for each result', () => {
    const results = [
      createMockTestResult({ id: 'test-1', accuracy: 95 }),
      createMockTestResult({ id: 'test-2', accuracy: 85 }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('95%');
    expect(screen.getByTestId('result-test-2')).toHaveTextContent('85%');
  });

  it('shows time elapsed for each result', () => {
    const results = [
      createMockTestResult({ id: 'test-1', timeElapsed: 120 }),
      createMockTestResult({ id: 'test-2', timeElapsed: 90 }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('2:00');
    expect(screen.getByTestId('result-test-2')).toHaveTextContent('1:30');
  });

  it('displays timestamp for each result', () => {
    const results = [
      createMockTestResult({
        id: 'test-1',
        timestamp: new Date('2026-02-24T12:00:00Z').getTime(),
      }),
      createMockTestResult({
        id: 'test-2',
        timestamp: new Date('2026-02-24T14:30:00Z').getTime(),
      }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent(
      'Feb 24, 2026 at 7:00 AM',
    );
    expect(screen.getByTestId('result-test-2')).toHaveTextContent(
      'Feb 24, 2026 at 9:30 AM',
    );
  });

  it('shows expandable details for each result', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    const expandButton = screen.getByRole('button', {
      name: /expand details/i,
    });
    fireEvent.click(expandButton);

    expect(screen.getByText(/text sample id/i)).toBeInTheDocument();
    expect(screen.getByText('sample-1')).toBeInTheDocument();
  });

  it('collapses expanded details when clicked again', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    const expandButton = screen.getByRole('button', {
      name: /expand details/i,
    });

    // Expand first
    fireEvent.click(expandButton);
    expect(screen.getByText(/text sample id/i)).toBeInTheDocument();
    expect(screen.getByText('sample-1')).toBeInTheDocument();

    // Collapse again
    fireEvent.click(expandButton);
    expect(screen.queryByText(/text sample id/i)).not.toBeInTheDocument();
    expect(screen.queryByText('sample-1')).not.toBeInTheDocument();
  });

  it('handles single result correctly', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByText(/1 test completed/i)).toBeInTheDocument();
    expect(screen.getByTestId('average-wpm')).toHaveTextContent('60');
  });

  it('disables clear button when no results', () => {
    render(<TestHistory {...defaultProps} results={[]} />);

    expect(
      screen.queryByLabelText('Clear all test history'),
    ).not.toBeInTheDocument();
  });

  it('enables clear button when results exist', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    const clearButton = screen.getByLabelText('Clear all test history');
    expect(clearButton).not.toBeDisabled();
  });

  it('has proper semantic structure', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(
      screen.getByRole('region', { name: /test history/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: /test results/i }),
    ).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    const resultItems = screen.getAllByRole('button', { name: /test result/i });
    resultItems.forEach((item) => {
      expect(item).toHaveAttribute('aria-label');
    });
  });

  it('uses responsive design classes', () => {
    const results = [createMockTestResult()];

    render(<TestHistory {...defaultProps} results={results} />);

    const container = screen.getByRole('region', { name: /test history/i });
    expect(container).toHaveClass('max-w-4xl');
  });

  it('handles edge case of zero WPM results', () => {
    const results = [createMockTestResult({ wpm: 0 })];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('0');
    expect(screen.getByTestId('average-wpm')).toHaveTextContent('0');
  });

  it('handles edge case of zero accuracy results', () => {
    const results = [createMockTestResult({ accuracy: 0 })];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('0%');
  });

  it('calculates correct statistics for mixed difficulty levels', () => {
    const results = [
      createMockTestResult({
        id: 'test-1',
        difficulty: 'easy' as DifficultyLevel,
        wpm: 40,
      }),
      createMockTestResult({
        id: 'test-2',
        difficulty: 'medium' as DifficultyLevel,
        wpm: 60,
      }),
      createMockTestResult({
        id: 'test-3',
        difficulty: 'hard' as DifficultyLevel,
        wpm: 80,
      }),
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('average-wpm')).toHaveTextContent('60');
    expect(screen.getByTestId('best-wpm')).toHaveTextContent('80');
  });

  it('shows performance indicators for high-performing results', () => {
    const results = [createMockTestResult({ wpm: 100, accuracy: 98 })];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('100');
    expect(screen.getByTestId('result-test-1')).toHaveTextContent('98%');
  });

  it('shows performance indicators for low-performing results', () => {
    const results = [createMockTestResult({ wpm: 20, accuracy: 60 })];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('20');
    expect(screen.getByTestId('result-test-1')).toHaveTextContent('60%');
  });

  it('shows Average performance for accuracy between 70-84', () => {
    const results = [createMockTestResult({ accuracy: 75 })];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('75%');
  });

  it('shows Average performance for WPM in middle range', () => {
    const results = [createMockTestResult({ wpm: 50 })];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toHaveTextContent('50');
  });

  it('displays performance labels in expanded details', () => {
    const results = [createMockTestResult({ wpm: 80, accuracy: 90 })];

    render(<TestHistory {...defaultProps} results={results} />);

    // Expand details
    const expandButton = screen.getByRole('button', {
      name: /expand details/i,
    });
    fireEvent.click(expandButton);

    // Should show performance labels
    expect(screen.getByText(/Excellent/i)).toBeInTheDocument();
    expect(screen.getByText(/Good/i)).toBeInTheDocument();
  });

  it('shows all WPM performance labels in expanded details', () => {
    const testCases = [
      { wpm: 100, expectedLabel: 'Excellent' },
      { wpm: 70, expectedLabel: 'Good' },
      { wpm: 45, expectedLabel: 'Average' },
      { wpm: 20, expectedLabel: 'Needs Practice' },
    ];

    testCases.forEach(({ wpm, expectedLabel }) => {
      const results = [createMockTestResult({ wpm })];

      const { unmount } = render(
        <TestHistory {...defaultProps} results={results} />,
      );

      // Expand details
      const expandButton = screen.getByRole('button', {
        name: /expand details/i,
      });
      fireEvent.click(expandButton);

      // Look for the performance label in the format "WPM: [Label]"
      expect(
        screen.getByText(new RegExp(`WPM:\\s*${expectedLabel}`)),
      ).toBeInTheDocument();

      unmount();
    });
  });

  it('shows all accuracy performance labels in expanded details', () => {
    const testCases = [
      { accuracy: 98, expectedLabel: 'Excellent' },
      { accuracy: 88, expectedLabel: 'Good' },
      { accuracy: 75, expectedLabel: 'Average' },
      { accuracy: 60, expectedLabel: 'Needs Practice' },
    ];

    testCases.forEach(({ accuracy, expectedLabel }) => {
      const results = [createMockTestResult({ accuracy })];

      const { unmount } = render(
        <TestHistory {...defaultProps} results={results} />,
      );

      // Expand details
      const expandButton = screen.getByRole('button', {
        name: /expand details/i,
      });
      fireEvent.click(expandButton);

      // Look for the performance label in the format "Accuracy: [Label]"
      expect(
        screen.getByText(new RegExp(`Accuracy:\\s*${expectedLabel}`)),
      ).toBeInTheDocument();

      unmount();
    });
  });

  it('handles large number of results efficiently', () => {
    const results = Array.from({ length: 50 }, (_, i) =>
      createMockTestResult({
        id: `test-${String(i)}`,
        wpm: 40 + i,
        timestamp: new Date(Date.now() - i * 60000).getTime(), // 1 minute apart
      }),
    );

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByText(/50 tests completed/i)).toBeInTheDocument();
    expect(screen.getByTestId('average-wpm')).toHaveTextContent('65');
    expect(screen.getByTestId('best-wpm')).toHaveTextContent('89');
  });

  it('handles results with string timestamps for backward compatibility', () => {
    const results = [
      {
        ...createMockTestResult(),
        timestamp: new Date('2026-02-24T12:00:00.000Z').getTime(), // Convert to number
      },
    ];

    render(<TestHistory {...defaultProps} results={results} />);

    expect(screen.getByTestId('result-test-1')).toBeInTheDocument();
    expect(
      screen.getByText(/Feb 24, 2026 at \d{1,2}:\d{2} [AP]M/),
    ).toBeInTheDocument();
  });
});
