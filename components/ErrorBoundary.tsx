import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 p-4 font-sans">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border-4 border-red-300">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 tracking-tight">
                        Oops! Something went wrong.
                    </h1>
                    <p className="mt-4 text-slate-600">
                        The application has encountered an unexpected error. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                         <details className="mt-6 text-left bg-slate-50 p-4 rounded-lg">
                            <summary className="font-semibold text-slate-700 cursor-pointer">Error Details</summary>
                            <pre className="mt-2 text-sm text-slate-500 whitespace-pre-wrap break-words">
                                <strong>{this.state.error.toString()}</strong>
                                {this.state.errorInfo?.componentStack}
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

export default ErrorBoundary;
