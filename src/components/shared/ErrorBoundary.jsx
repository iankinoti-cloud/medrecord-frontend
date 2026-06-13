import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cloud">
          <div className="text-center p-8 bg-surface rounded-2xl shadow-card max-w-sm">
            <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-midnight mb-2">Something went wrong</h2>
            <p className="text-sm text-muted mb-4">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="text-sm text-aegean-700 font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
