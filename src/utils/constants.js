export const ROLES = {
  DOCTOR:      'Doctor',
  LAB_TECH:    'LabTechnician',
  ADMIN:       'Admin',
}

export const PATIENT_STATUS = {
  ACTIVE:      'Active',
  IN_ER:       'In ER',
  PENDING_LAB: 'Pending Lab',
  DISCHARGED:  'Discharged',
}

export const AUDIT_ACTIONS = {
  LOGIN:           'LOGIN',
  LOGOUT:          'LOGOUT',
  VIEW_PATIENT:    'VIEW_PATIENT',
  ADD_DIAGNOSIS:   'ADD_DIAGNOSIS',
  UPLOAD_LAB:      'UPLOAD_LAB',
  CREATE_USER:     'CREATE_USER',
  DEACTIVATE_USER: 'DEACTIVATE_USER',
  REGISTER_PATIENT:'REGISTER_PATIENT',
}

export const ROUTES = {
  LOGIN:          '/login',
  DASHBOARD:      '/dashboard',
  PATIENT_DETAIL: '/patients/:id',
  LAB_PORTAL:     '/lab',
  ADMIN:          '/admin',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const TOKEN_KEY  = 'hrms_token'
export const USER_KEY   = 'hrms_user'

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000
