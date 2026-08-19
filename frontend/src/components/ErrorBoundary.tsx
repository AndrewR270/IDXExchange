"use client";

import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("React Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-foreground">
          <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
          <p>Try refreshing the page or adjusting your filters.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
