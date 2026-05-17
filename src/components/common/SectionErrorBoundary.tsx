'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  sectionId: string;
};

type State = {
  hasError: boolean;
};

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Section ${this.props.sectionId} error:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          className="border border-destructive/50 bg-destructive/10 px-6 py-6"
          data-section-id={this.props.sectionId}
        >
          <p className="text-sm text-destructive">
            Something went wrong rendering this section.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
