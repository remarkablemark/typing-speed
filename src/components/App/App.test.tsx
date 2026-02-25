import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

// Mock console.error to avoid noise in test output
// eslint-disable-next-line no-console
const originalConsoleError = console.error;

beforeEach(() => {
  // eslint-disable-next-line no-console
  console.error = vi.fn();
});

afterEach(() => {
  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

describe('App', () => {
  it('renders header with correct title', () => {
    render(<App />);

    expect(screen.getByText('Typing Speed Test')).toBeInTheDocument();
  });

  it('renders header with subtitle', () => {
    render(<App />);

    expect(
      screen.getByText('Test your typing speed and accuracy'),
    ).toBeInTheDocument();
  });

  it('renders welcome message when no children provided', () => {
    render(<App />);

    expect(
      screen.getByText('Welcome to Typing Speed Test'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Select a difficulty level to begin your typing test.'),
    ).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <App>
        <div>Test Content</div>
      </App>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(
      screen.queryByText('Welcome to Typing Speed Test'),
    ).not.toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<App />);

    // Check for semantic elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    // Note: footer was removed, so we don't check for contentinfo role
  });

  it('has responsive design classes', () => {
    render(<App />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-800', 'shadow-sm');
  });

  it('handles error boundary correctly', () => {
    // This test would verify error boundary functionality
    // For now, we just check that the component renders without throwing
    expect(() => render(<App />)).not.toThrow();
  });

  it('has proper accessibility attributes', () => {
    render(<App />);

    // Check that the main content is properly structured
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('uses dark mode support', () => {
    render(<App />);

    // Check for dark mode classes on the main container
    const mainContainer = document.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('dark:bg-gray-900');
  });

  it('has proper layout structure', () => {
    render(<App />);

    // Check that layout uses proper max-width and centering
    const header = screen.getByRole('banner');
    const headerContainer = header.querySelector('.max-w-7xl');
    expect(headerContainer).toBeInTheDocument();
  });

  it('renders with proper spacing', () => {
    render(<App />);

    // Check for proper Tailwind spacing classes
    const main = screen.getByRole('main');
    expect(main).toHaveClass('py-6');
  });

  describe('ErrorBoundary', () => {
    const ThrowErrorComponent = () => {
      throw new Error('Test error');
    };

    it('catches errors and displays error UI', () => {
      render(
        <App>
          <ThrowErrorComponent />
        </App>,
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          'We apologize for the inconvenience. The application encountered an unexpected error.',
        ),
      ).toBeInTheDocument();
    });

    it('displays reload and try again buttons', () => {
      render(
        <App>
          <ThrowErrorComponent />
        </App>,
      );

      expect(
        screen.getByRole('button', { name: 'Reload Page' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try Again' }),
      ).toBeInTheDocument();
    });

    it('reloads page when reload button is clicked', async () => {
      const mockReload = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      render(
        <App>
          <ThrowErrorComponent />
        </App>,
      );

      const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
      await userEvent.click(reloadButton);

      expect(mockReload).toHaveBeenCalled();
    });

    it('resets error state when try again button is clicked', async () => {
      render(
        <App>
          <ThrowErrorComponent />
        </App>,
      );

      // Initially shows error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
      await userEvent.click(tryAgainButton);

      // Should show the error again since the component still throws
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('shows error details when available', () => {
      const testError = new Error('Test error with stack');
      testError.stack =
        'Error: Test error with stack\n    at ThrowErrorComponent';

      const ThrowComponentWithStack = () => {
        throw testError;
      };

      // Mock import.meta.env.DEV to be true for this test
      vi.stubEnv('DEV', true);

      render(
        <App>
          <ThrowComponentWithStack />
        </App>,
      );

      // Check if error details are shown when DEV is true
      const errorDetails = screen.getByText(/Error Details/);
      expect(errorDetails).toBeInTheDocument();

      // Restore original value
      vi.unstubAllEnvs();
    });

    it('logs error to console', () => {
      render(
        <App>
          <ThrowErrorComponent />
        </App>,
      );

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith(
        'Error caught by boundary:',
        expect.any(Error),
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          componentStack: expect.any(String),
        }),
      );
    });

    it('handles errors without stack trace', () => {
      const errorWithoutStack = new Error('Error without stack') as Error & {
        stack?: string;
      };
      delete errorWithoutStack.stack;

      const ThrowComponentWithoutStack = () => {
        throw errorWithoutStack;
      };

      render(
        <App>
          <ThrowComponentWithoutStack />
        </App>,
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
