import { ROUTES } from '../utils/constants'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud">
      <div className="text-center p-8 bg-surface rounded-2xl shadow-card max-w-sm">
        <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-midnight mb-2">Access Restricted</h2>
        <p className="text-sm text-muted mb-4">You don't have permission to view this page.</p>
        <a href={ROUTES.LOGIN} className="text-sm text-aegean-700 font-medium hover:underline">
          Return to login
        </a>
      </div>
    </div>
  )
}
