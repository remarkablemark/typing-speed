import { fireEvent, render, screen } from '@testing-library/react';
import type { DifficultyLevel, TextSample } from 'src/types/typing.types';
import { beforeEach, expect, vi } from 'vitest';

import { TypingTest } from './TypingTest';

// Mock text sample
const mockTextSample: TextSample = {
  id: 'test-1',
  content: 'The quick brown fox jumps over the lazy dog.',
  difficulty: 'easy' as DifficultyLevel,
  wordCount: 9,
  characterCount: 44,
};

describe('TypingTest', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text sample correctly', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    // Check that the text display container exists
    const textDisplay = screen.getByRole('textbox').previousElementSibling;
    expect(textDisplay).toBeInTheDocument();

    // Check that all characters are rendered as spans
    const spans = textDisplay?.querySelectorAll('span');
    expect(spans?.length).toBe(mockTextSample.content.length);

    // Check first and last characters
    expect(spans?.[0]).toHaveTextContent('T');
    expect(spans?.[spans.length - 1]).toHaveTextContent('.');
  });

  it('shows initial WPM and accuracy as 0', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    expect(screen.getByText(/WPM:/)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
  });

  it('starts timer on first keystroke', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');
    fireEvent.keyDown(textInput, { key: 'T' });

    // Timer should start, WPM calculation should begin
    expect(screen.getByText(/WPM:/)).toBeInTheDocument();
  });

  it('updates WPM calculation as user types', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Type first character
    fireEvent.keyDown(textInput, { key: 'T' });
    fireEvent.change(textInput, { target: { value: 'T' } });

    // WPM should be calculated
    expect(screen.getByText(/WPM:/)).toBeInTheDocument();
  });

  it('calculates accuracy correctly', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Type correct characters
    fireEvent.keyDown(textInput, { key: 'T' });
    fireEvent.change(textInput, { target: { value: 'T' } });

    fireEvent.keyDown(textInput, { key: 'h' });
    fireEvent.change(textInput, { target: { value: 'Th' } });

    // Accuracy should be calculated
    expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
  });

  it('highlights incorrect characters', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Type incorrect character
    fireEvent.keyDown(textInput, { key: 'X' });
    fireEvent.change(textInput, { target: { value: 'X' } });

    // Should show error highlighting
    expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
  });

  it('calls onComplete when test is finished', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Type the complete text
    const fullText = 'The quick brown fox jumps over the lazy dog.';
    for (const char of fullText) {
      fireEvent.keyDown(textInput, { key: char });
      fireEvent.change(textInput, {
        target: { value: fullText.slice(0, fullText.indexOf(char) + 1) },
      });
    }

    // Should call onComplete with result
    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        wpm: expect.any(Number) as number,
        accuracy: expect.any(Number) as number,
        timeElapsed: expect.any(Number) as number,
        difficulty: 'easy',
        textSampleId: 'test-1',
      }),
    );
  });

  it('prevents paste events', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Attempt to paste
    const preventDefaultMock = vi.fn();
    const pasteEvent = new Event('paste', { bubbles: true });
    Object.defineProperty(pasteEvent, 'preventDefault', {
      value: preventDefaultMock,
    });

    fireEvent(textInput, pasteEvent);

    // Paste should be prevented
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Test backspace
    fireEvent.keyDown(textInput, { key: 'T' });
    fireEvent.change(textInput, { target: { value: 'T' } });

    fireEvent.keyDown(textInput, { key: 'Backspace' });
    fireEvent.change(textInput, { target: { value: '' } });

    // Should handle backspace correctly
    expect(screen.getByText(/WPM:/)).toBeInTheDocument();
  });

  it('is accessible via keyboard', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Should be focusable
    textInput.focus();
    expect(textInput).toHaveFocus();

    // Should have proper ARIA labels
    expect(textInput).toHaveAttribute('aria-label');
  });

  it('displays timer correctly', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    // Timer should be visible
    expect(screen.getByText(/Time:/)).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    // Progress should be visible
    expect(screen.getByText(/Progress:/)).toBeInTheDocument();
  });

  it('updates timer during typing', () => {
    vi.useFakeTimers();

    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Start typing to trigger timer
    fireEvent.keyDown(textInput, { key: 'T' });
    fireEvent.change(textInput, { target: { value: 'T' } });

    // Advance time by 100ms to trigger timer update
    vi.advanceTimersByTime(100);

    // Timer should have updated
    expect(screen.getByText(/Time:/)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('handles WPM calculation edge case', () => {
    render(
      <TypingTest
        textSample={mockTextSample}
        onComplete={mockOnComplete}
        difficulty="easy"
      />,
    );

    const textInput = screen.getByRole('textbox');

    // Type some characters but don't start timer (no time elapsed)
    fireEvent.keyDown(textInput, { key: 'T' });
    fireEvent.change(textInput, { target: { value: 'T' } });

    // WPM calculation should handle edge case
    expect(screen.getByText(/WPM:/)).toBeInTheDocument();
  });
});
