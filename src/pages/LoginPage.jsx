import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useRole } from '../hooks/useRole'
import { LoginForm } from '../components/auth/LoginForm'
import { ROLES } from '../utils/constants'

export function LoginPage() {
  const { user } = useAuth()
  const { role } = useRole()

  if (user) {
    if (role === ROLES.ADMIN)    return <Navigate to="/admin" replace />
    if (role === ROLES.LAB_TECH) return <Navigate to="/lab" replace />
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand & ethos */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-aegean-900 via-aegean-800 to-teal-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width:  `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                top:    `${20 + i * 30}px`,
                right:  `${-40 + i * 10}px`,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">MedRecord</h1>
              <p className="text-teal-300 text-xs">Hospital Management System</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Precision in<br />every record.
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-xs">
              Secure patient records, streamlined lab workflows, and role-based access — all in one place.
            </p>
          </div>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: '🔐', label: 'Role-based access control' },
            { icon: '📋', label: 'Complete patient history' },
            { icon: '🧪', label: 'Integrated lab result tracking' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-blue-100">
              <span className="text-lg">{icon}</span>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-cloud">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-aegean-800 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-midnight">MedRecord</span>
          </div>

          <div className="bg-surface rounded-2xl shadow-card p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-midnight">Sign in</h2>
              <p className="text-sm text-muted mt-1">Access your hospital dashboard</p>
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-2 p-3 bg-amber-100 border border-amber-200 rounded-lg mb-6">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-600">
                Authorized personnel only. Unauthorized access is a violation of hospital policy and may be subject to legal action.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
