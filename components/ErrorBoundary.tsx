import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level React error boundary.
 *
 * Catches render-time crashes in any descendant and shows a recoverable
 * error screen instead of a white page of doom.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production you'd ship this to Sentry / your error tracker.
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, info);
  }

  handleReset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Something went wrong.
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The app crashed unexpectedly. Reload to start over, or copy the error below if
              you want to file a bug.
            </p>
            <pre className="text-left text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
