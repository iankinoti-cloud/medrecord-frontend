import { useAuth } from './useAuth'
import { ROLES } from '../utils/constants'

export function useRole() {
  const { user } = useAuth()
  return {
    role:       user?.role ?? null,
    isDoctor:   user?.role === ROLES.DOCTOR,
    isLabTech:  user?.role === ROLES.LAB_TECH,
    isAdmin:    user?.role === ROLES.ADMIN,
  }
}
