import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
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
              <CardTitle className="text-3xl font-black tracking-tighter">System Interruption</CardTitle>
              <CardDescription className="font-bold text-xs uppercase tracking-widest mt-2">Critical Process Termination Error</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted/50 rounded-xl border font-mono text-[10px] leading-relaxed overflow-auto max-h-[300px]">
                <p className="text-destructive font-black mb-2 uppercase tracking-widest">Error Log:</p>
                <div className="opacity-70">
                  {this.state.error && this.state.error.toString()}
                  <br /><br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="font-black bg-figma-blue hover:bg-figma-blue/90 h-12 px-8 rounded-full shadow-lg shadow-figma-blue/20"
                >
                  REBOOT TERMINAL
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="font-black border-2 h-12 px-8 rounded-full"
                >
                  RETRY SEQUENCE
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
