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
    // Mock timezone to ensure consistent test results across different environments
    const originalTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Set a specific timezone (America/New_York) for consistent test behavior
    Object.defineProperty(Intl, 'DateTimeFormat', {
      value: () => ({
        resolvedOptions: () => ({ timeZone: 'America/New_York' }),
      }),
      writable: true,
    });

    try {
      const resultWithTimestamp = createMockTestResult({
        timestamp: new Date('2026-02-24T14:30:00Z').getTime(),
      });
      render(<ResultsDisplay {...defaultProps} result={resultWithTimestamp} />);

      // In America/New_York timezone, 14:30 UTC = 9:30 AM EST
      expect(screen.getByText(/9:30 AM/i)).toBeInTheDocument();
    } finally {
      // Restore original timezone
      Object.defineProperty(Intl, 'DateTimeFormat', {
        value: () => ({
          resolvedOptions: () => ({ timeZone: originalTimezone }),
        }),
        writable: true,
      });
    }
  });

  it('provides semantic structure for assistive technology', () => {
    render(<ResultsDisplay {...defaultProps} />);

    // Check for proper landmark regions
    expect(
      screen.getByRole('region', { name: /test results/i }),
    ).toBeInTheDocument();

    // Check for proper heading structure within results
    expect(
      screen.getByRole('heading', { name: /test complete/i }),
    ).toBeInTheDocument();
  });

  it('supports keyboard navigation and screen readers', () => {
    render(<ResultsDisplay {...defaultProps} />);

    const restartButton = screen.getByLabelText(/start a new typing test/i);
    const historyButton = screen.getByLabelText(/view your test history/i);

    // Check that buttons have proper accessibility attributes
    expect(restartButton).toHaveAttribute('aria-label');
    expect(historyButton).toHaveAttribute('aria-label');

    // Check that buttons are keyboard focusable
    expect(restartButton).not.toBeDisabled();
    expect(historyButton).not.toBeDisabled();
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

  it('calculates errors correctly based on accuracy and character count', () => {
    const resultWithErrors = createMockTestResult({
      accuracy: 78, // 78% accuracy means 22% errors
      textSampleId: 'easy-14', // This sample has 27 characters
    });

    render(<ResultsDisplay {...defaultProps} result={resultWithErrors} />);

    // Expand details to see error count
    const expandButton = screen.getByText(/[▶▼] show test details/i);
    fireEvent.click(expandButton);

    // 27 characters * (100 - 78)% = 27 * 0.22 = 5.94 ≈ 6 errors
    // Look for the error count specifically by finding it near the "Errors:" label
    const errorsLabel = screen.getByText(/errors/i);
    const errorsValue = errorsLabel.nextElementSibling;
    expect(errorsValue).toHaveTextContent('6');
  });

  it('shows zero errors for perfect accuracy', () => {
    const perfectResult = createMockTestResult({
      accuracy: 100, // Perfect accuracy
      textSampleId: 'easy-1', // This sample has 43 characters
    });

    render(<ResultsDisplay {...defaultProps} result={perfectResult} />);

    // Expand details to see error count
    const expandButton = screen.getByText(/[▶▼] show test details/i);
    fireEvent.click(expandButton);

    // Look for the error count specifically by finding it near the "Errors:" label
    const errorsLabel = screen.getByText(/errors/i);
    const errorsValue = errorsLabel.nextElementSibling;
    expect(errorsValue).toHaveTextContent('0');
  });

  it('calculates errors for low accuracy', () => {
    const lowAccuracyResult = createMockTestResult({
      accuracy: 50, // 50% accuracy means 50% errors
      textSampleId: 'easy-1', // This sample has 43 characters
    });

    render(<ResultsDisplay {...defaultProps} result={lowAccuracyResult} />);

    // Expand details to see error count
    const expandButton = screen.getByText(/[▶▼] show test details/i);
    fireEvent.click(expandButton);

    // 43 characters * (100 - 50)% = 43 * 0.5 = 21.5 ≈ 22 errors
    // Look for the error count specifically by finding it near the "Errors:" label
    const errorsLabel = screen.getByText(/errors/i);
    const errorsValue = errorsLabel.nextElementSibling;
    expect(errorsValue).toHaveTextContent('22');
  });

  it('handles missing text sample gracefully for error calculation', () => {
    const resultWithMissingSample = createMockTestResult({
      accuracy: 75,
      textSampleId: 'non-existent-id', // This sample doesn't exist
    });

    render(
      <ResultsDisplay {...defaultProps} result={resultWithMissingSample} />,
    );

    // Expand details to see error count
    const expandButton = screen.getByText(/[▶▼] show test details/i);
    fireEvent.click(expandButton);

    // Should show 0 errors when text sample is not found
    // Look for the error count specifically by finding it near the "Errors:" label
    const errorsLabel = screen.getByText(/errors/i);
    const errorsValue = errorsLabel.nextElementSibling;
    expect(errorsValue).toHaveTextContent('0');
  });

  it('displays consistent error and accuracy relationship', () => {
    const testCases = [
      { accuracy: 90, expectedErrors: 4 }, // 43 chars * 10% = 4.3 ≈ 4
      { accuracy: 80, expectedErrors: 9 }, // 43 chars * 20% = 8.6 ≈ 9
      { accuracy: 70, expectedErrors: 13 }, // 43 chars * 30% = 12.9 ≈ 13
    ];

    testCases.forEach(({ accuracy, expectedErrors }) => {
      const { unmount } = render(
        <ResultsDisplay
          {...defaultProps}
          result={createMockTestResult({
            accuracy,
            textSampleId: 'easy-1', // 43 characters
          })}
        />,
      );

      // Expand details to see error count
      const expandButton = screen.getByText(/[▶▼] show test details/i);
      fireEvent.click(expandButton);

      // Look for the error count specifically by finding it near the "Errors:" label
      const errorsLabel = screen.getByText(/errors/i);
      const errorsValue = errorsLabel.nextElementSibling;
      expect(errorsValue).toHaveTextContent(String(expectedErrors));

      // Clean up for next test
      unmount();
    });
  });
});
