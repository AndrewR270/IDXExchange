"use client";

import React from "react";
import PropTypes from "prop-types";

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
};

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any
  ) {
    console.error("React Error Boundary caught:", error, info);
  }

  resetBoundary = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="p-6 text-foreground">
          <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
          <p>Try refreshing the page or adjusting your filters.</p>

          <button
            onClick={this.resetBoundary}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.node,
};
