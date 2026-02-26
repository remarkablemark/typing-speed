import { Component } from 'react';

interface AppProps {
  children?: React.ReactNode;
}

interface AppState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
                Something went wrong
              </h1>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                We apologize for the inconvenience. The application encountered
                an unexpected error.
              </p>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Reload Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined });
                  }}
                  className="w-full cursor-pointer rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Try Again
                </button>
              </div>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-700">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App({ children }: AppProps): React.ReactNode {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white shadow-sm dark:bg-gray-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="flex-1 text-center text-xl font-semibold text-gray-900 sm:text-left dark:text-white">
                <button
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="cursor-pointer transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Typing Speed Test
                </button>
              </h1>
              <div className="hidden items-center space-x-4 sm:flex">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Test your typing speed and accuracy
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {children ?? (
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome to Typing Speed Test
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Select a difficulty level to begin your typing test.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
