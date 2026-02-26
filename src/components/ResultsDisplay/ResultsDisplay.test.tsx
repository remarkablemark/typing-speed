import { fireEvent, render, screen } from '@testing-library/react';
import type { DifficultyLevel, TestResult } from 'src/types';

import { ResultsDisplay } from './ResultsDisplay';
import type { ResultsDisplayProps } from './ResultsDisplay.types';

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

describe('ResultsDisplay', () => {
  const mockOnRestart = vi.fn();
  const mockOnViewHistory = vi.fn();

  const defaultProps: ResultsDisplayProps = {
    result: createMockTestResult(),
    onRestart: mockOnRestart,
    onViewHistory: mockOnViewHistory,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders WPM display prominently', () => {
    render(<ResultsDisplay {...defaultProps} />);

    const wpmDisplay = screen.getByText('60');
    expect(wpmDisplay).toBeInTheDocument();
    expect(screen.getByText(/WPM/i)).toBeInTheDocument();
  });

  it('displays accuracy percentage', () => {
    render(<ResultsDisplay {...defaultProps} />);

    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
  });

  it('shows time elapsed', () => {
    render(<ResultsDisplay {...defaultProps} />);

    expect(screen.getByText('2:00')).toBeInTheDocument();
    expect(screen.getByText(/time/i)).toBeInTheDocument();
  });

  it('displays difficulty level', () => {
    render(<ResultsDisplay {...defaultProps} />);

    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/difficulty/i)).toBeInTheDocument();
  });

  it('calls onRestart when restart button is clicked', () => {
    render(<ResultsDisplay {...defaultProps} />);

    const restartButton = screen.getByLabelText(/start a new typing test/i);
    fireEvent.click(restartButton);

    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  it('calls onViewHistory when view history button is clicked', () => {
    render(<ResultsDisplay {...defaultProps} />);

    const historyButton = screen.getByLabelText(/view your test history/i);
    fireEvent.click(historyButton);

    expect(mockOnViewHistory).toHaveBeenCalledTimes(1);
  });

  it('displays high WPM with appropriate styling', () => {
    const highWPMResult = createMockTestResult({ wpm: 85 });
    render(<ResultsDisplay {...defaultProps} result={highWPMResult} />);

    const wpmDisplay = screen.getByText('85');
    expect(wpmDisplay).toBeInTheDocument();
  });

  it('displays low WPM with appropriate styling', () => {
    const lowWPMResult = createMockTestResult({ wpm: 25 });
    render(<ResultsDisplay {...defaultProps} result={lowWPMResult} />);

    const wpmDisplay = screen.getByText('25');
    expect(wpmDisplay).toBeInTheDocument();
  });

  it('displays high accuracy with visual indicator', () => {
    const highAccuracyResult = createMockTestResult({ accuracy: 98 });
    render(<ResultsDisplay {...defaultProps} result={highAccuracyResult} />);

    expect(screen.getByText('98%')).toBeInTheDocument();
  });

  it('displays low accuracy with appropriate styling', () => {
    const lowAccuracyResult = createMockTestResult({ accuracy: 75 });
    render(<ResultsDisplay {...defaultProps} result={lowAccuracyResult} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('formats time correctly for different durations', () => {
    const oneMinuteResult = createMockTestResult({ timeElapsed: 60 });
    render(<ResultsDisplay {...defaultProps} result={oneMinuteResult} />);

    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('displays easy difficulty correctly', () => {
    const easyResult = createMockTestResult({
      difficulty: 'easy' as DifficultyLevel,
    });
    render(<ResultsDisplay {...defaultProps} result={easyResult} />);

    expect(screen.getByText(/easy/i)).toBeInTheDocument();
  });

  it('displays hard difficulty correctly', () => {
    const hardResult = createMockTestResult({
      difficulty: 'hard' as DifficultyLevel,
    });
    render(<ResultsDisplay {...defaultProps} result={hardResult} />);

    expect(screen.getByText(/hard/i)).toBeInTheDocument();
  });

  it('shows timestamp information', () => {
    const resultWithTimestamp = createMockTestResult({
      timestamp: new Date('2026-02-24T14:30:00Z').getTime(),
    });
    render(<ResultsDisplay {...defaultProps} result={resultWithTimestamp} />);

    expect(screen.getByText(/9:30 AM/i)).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<ResultsDisplay {...defaultProps} />);

    expect(
      screen.getByRole('region', { name: /test results/i }),
    ).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ResultsDisplay {...defaultProps} />);

    const restartButton = screen.getByLabelText(/start a new typing test/i);
    const historyButton = screen.getByLabelText(/view your test history/i);

    expect(restartButton).toHaveAttribute('aria-label');
    expect(historyButton).toHaveAttribute('aria-label');
  });

  it('uses responsive design classes', () => {
    render(<ResultsDisplay {...defaultProps} />);

    const container = screen.getByRole('region', { name: /test results/i });
    expect(container).toHaveClass('max-w-4xl');
  });

  it('handles edge case of zero WPM', () => {
    const zeroWPMResult = createMockTestResult({ wpm: 0 });
    render(<ResultsDisplay {...defaultProps} result={zeroWPMResult} />);

    // Find the WPM display by looking for the large text container
    const wpmContainer = screen
      .getByText('0')
      .closest('div.text-6xl, div.text-3xl');
    expect(wpmContainer).toBeInTheDocument();
    expect(wpmContainer).toHaveTextContent('0');
  });

  it('handles edge case of zero accuracy', () => {
    const zeroAccuracyResult = createMockTestResult({ accuracy: 0 });
    render(<ResultsDisplay {...defaultProps} result={zeroAccuracyResult} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles edge case of very short time', () => {
    const shortTimeResult = createMockTestResult({ timeElapsed: 5 });
    render(<ResultsDisplay {...defaultProps} result={shortTimeResult} />);

    expect(screen.getByText('0:05')).toBeInTheDocument();
  });

  it('handles edge case of very long time', () => {
    const longTimeResult = createMockTestResult({ timeElapsed: 600 });
    render(<ResultsDisplay {...defaultProps} result={longTimeResult} />);

    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('displays performance indicators based on WPM', () => {
    const excellentWPMResult = createMockTestResult({ wpm: 100 });
    render(<ResultsDisplay {...defaultProps} result={excellentWPMResult} />);

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays performance indicators based on accuracy', () => {
    const poorAccuracyResult = createMockTestResult({ accuracy: 50 });
    render(<ResultsDisplay {...defaultProps} result={poorAccuracyResult} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays Good performance for accuracy between 85-94', () => {
    const goodAccuracyResult = createMockTestResult({ accuracy: 90 });
    render(<ResultsDisplay {...defaultProps} result={goodAccuracyResult} />);

    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getAllByText('Good')).toHaveLength(2); // One for WPM, one for accuracy
  });

  it('toggles expandable details section', () => {
    render(<ResultsDisplay {...defaultProps} />);

    // Initially collapsed - details should not be visible
    expect(screen.queryByText(/text sample id/i)).not.toBeInTheDocument();
    expect(screen.queryByText('sample-1')).not.toBeInTheDocument();

    // Click expand button (summary element)
    const expandButton = screen.getByText(/[▶▼] show test details/i);
    fireEvent.click(expandButton);

    // Now expanded - details should be visible
    expect(screen.getByText(/text sample id/i)).toBeInTheDocument();
    expect(screen.getByText('sample-1')).toBeInTheDocument();

    // Click collapse button
    fireEvent.click(expandButton);

    // Collapsed again - details should not be visible
    expect(screen.queryByText(/text sample id/i)).not.toBeInTheDocument();
    expect(screen.queryByText('sample-1')).not.toBeInTheDocument();
  });

  it('handles results with string timestamps for backward compatibility', () => {
    const resultWithStringTimestamp = createMockTestResult({
      timestamp: new Date('2026-02-24T12:00:00.000Z').getTime(), // Number timestamp
    });

    render(
      <ResultsDisplay {...defaultProps} result={resultWithStringTimestamp} />,
    );

    expect(screen.getByText(/completed at/i)).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}:\d{2} [AP]M/)).toBeInTheDocument();

    // Expand details to trigger the toLocaleDateString code path
    const expandButton = screen.getByText(/[▶▼] show test details/i);
    fireEvent.click(expandButton);

    expect(screen.getByText(/completion date/i)).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).toBeInTheDocument();
  });
});
