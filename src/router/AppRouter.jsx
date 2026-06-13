import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { ErrorBoundary } from '../components/shared'
import { ROLES, ROUTES } from '../utils/constants'

import { LoginPage }         from '../pages/LoginPage'
import { AdminPage }         from '../pages/AdminPage'
import { DashboardPage }     from '../pages/DashboardPage'
import { PatientDetailPage } from '../pages/PatientDetailPage'
import { LabPortalPage }     from '../pages/LabPortalPage'
import { UnauthorizedPage }  from '../pages/UnauthorizedPage'
import { StatusPage }        from '../pages/StatusPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            <Route path={ROUTES.DASHBOARD} element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]}>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path={ROUTES.PATIENT_DETAIL} element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]}>
                <PatientDetailPage />
              </ProtectedRoute>
            } />

            <Route path={ROUTES.LAB_PORTAL} element={
              <ProtectedRoute allowedRoles={[ROLES.LAB_TECH]}>
                <LabPortalPage />
              </ProtectedRoute>
            } />

            <Route path={ROUTES.ADMIN} element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminPage />
              </ProtectedRoute>
            } />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/status"       element={<StatusPage />} />

            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
