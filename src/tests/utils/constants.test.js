import { describe, it, expect } from 'vitest'
import { ROLES, PATIENT_STATUS, AUDIT_ACTIONS, ROUTES, TOKEN_KEY, USER_KEY, SESSION_TIMEOUT_MS } from '../../utils/constants'

describe('Constants', () => {
  describe('ROLES', () => {
    it('should have Doctor role', () => {
      expect(ROLES.DOCTOR).toBe('Doctor')
    })

    it('should have LabTechnician role', () => {
      expect(ROLES.LAB_TECH).toBe('LabTechnician')
    })

    it('should have Admin role', () => {
      expect(ROLES.ADMIN).toBe('Admin')
    })
  })

  describe('PATIENT_STATUS', () => {
    it('should have Active status', () => {
      expect(PATIENT_STATUS.ACTIVE).toBe('Active')
    })

    it('should have In ER status', () => {
      expect(PATIENT_STATUS.IN_ER).toBe('In ER')
    })

    it('should have Pending Lab status', () => {
      expect(PATIENT_STATUS.PENDING_LAB).toBe('Pending Lab')
    })

    it('should have Discharged status', () => {
      expect(PATIENT_STATUS.DISCHARGED).toBe('Discharged')
    })
  })

  describe('AUDIT_ACTIONS', () => {
    it('should have LOGIN action', () => {
      expect(AUDIT_ACTIONS.LOGIN).toBe('LOGIN')
    })

    it('should have LOGOUT action', () => {
      expect(AUDIT_ACTIONS.LOGOUT).toBe('LOGOUT')
    })

    it('should have VIEW_PATIENT action', () => {
      expect(AUDIT_ACTIONS.VIEW_PATIENT).toBe('VIEW_PATIENT')
    })

    it('should have ADD_DIAGNOSIS action', () => {
      expect(AUDIT_ACTIONS.ADD_DIAGNOSIS).toBe('ADD_DIAGNOSIS')
    })

    it('should have UPLOAD_LAB action', () => {
      expect(AUDIT_ACTIONS.UPLOAD_LAB).toBe('UPLOAD_LAB')
    })

    it('should have CREATE_USER action', () => {
      expect(AUDIT_ACTIONS.CREATE_USER).toBe('CREATE_USER')
    })

    it('should have DEACTIVATE_USER action', () => {
      expect(AUDIT_ACTIONS.DEACTIVATE_USER).toBe('DEACTIVATE_USER')
    })

    it('should have REGISTER_PATIENT action', () => {
      expect(AUDIT_ACTIONS.REGISTER_PATIENT).toBe('REGISTER_PATIENT')
    })
  })

  describe('ROUTES', () => {
    it('should have LOGIN route', () => {
      expect(ROUTES.LOGIN).toBe('/login')
    })

    it('should have DASHBOARD route', () => {
      expect(ROUTES.DASHBOARD).toBe('/dashboard')
    })

    it('should have PATIENT_DETAIL route', () => {
      expect(ROUTES.PATIENT_DETAIL).toBe('/patients/:id')
    })

    it('should have LAB_PORTAL route', () => {
      expect(ROUTES.LAB_PORTAL).toBe('/lab')
    })

    it('should have ADMIN route', () => {
      expect(ROUTES.ADMIN).toBe('/admin')
    })
  })

  describe('Storage Keys', () => {
    it('should have TOKEN_KEY', () => {
      expect(TOKEN_KEY).toBe('hrms_token')
    })

    it('should have USER_KEY', () => {
      expect(USER_KEY).toBe('hrms_user')
    })
  })

  describe('Session Configuration', () => {
    it('should have SESSION_TIMEOUT_MS', () => {
      expect(SESSION_TIMEOUT_MS).toBe(30 * 60 * 1000)
    })

    it('should be 30 minutes in milliseconds', () => {
      expect(SESSION_TIMEOUT_MS).toBe(1800000)
    })
  })
})
