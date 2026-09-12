import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <Card className="w-full max-w-2xl border-2 border-destructive/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Something went wrong</CardTitle>
              <CardDescription className="text-xs text-foreground-muted mt-1">An unexpected error occurred in this workspace view.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-surface-subtle rounded-lg border border-border-default font-mono text-[11px] leading-relaxed overflow-auto max-h-[220px]">
                <p className="text-status-danger font-semibold mb-1 uppercase tracking-wider text-[10px]">Diagnostics:</p>
                <div className="opacity-80 text-foreground-secondary">
                  {this.state.error && this.state.error.toString()}
                  <br /><br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/'}
                  size="default"
                  className="font-medium px-6"
                >
                  Return to Workspace
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  size="default"
                  className="font-medium px-6"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
