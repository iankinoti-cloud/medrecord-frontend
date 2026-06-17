/**
 * Comprehensive mock data for testing
 */

export const mockUser = {
  id: 1,
  email: 'doctor@hospital.org',
  full_name: 'Dr. John Smith',
  role: 'Doctor',
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockAdminUser = {
  id: 2,
  email: 'admin@hospital.org',
  full_name: 'Admin User',
  role: 'Admin',
  avatar_url: 'https://example.com/admin.jpg',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockLabTechUser = {
  id: 3,
  email: 'lab@hospital.org',
  full_name: 'Lab Technician',
  role: 'LabTechnician',
  avatar_url: 'https://example.com/lab.jpg',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockPatient = {
  id: 'P001',
  full_name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  dob: '1990-01-15',
  gender: 'Male',
  blood_type: 'O+',
  status: 'Active',
  residential_address: '123 Main St, City, State 12345',
  emergency_contact_name: 'Jane Doe',
  emergency_contact_phone: '0987654321',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockPatient2 = {
  id: 'P002',
  full_name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '1122334455',
  dob: '1985-05-20',
  gender: 'Female',
  blood_type: 'A-',
  status: 'In ER',
  residential_address: '456 Oak Ave, City, State 67890',
  emergency_contact_name: 'John Smith',
  emergency_contact_phone: '5566778899',
  created_at: '2024-01-02T00:00:00Z',
}

export const mockPatientsList = [mockPatient, mockPatient2]

export const mockStaffUser = {
  id: 4,
  email: 'newstaff@hospital.org',
  full_name: 'New Staff Member',
  role: 'Doctor',
  created_at: '2024-01-03T00:00:00Z',
}

export const mockStaffList = [
  mockUser,
  mockAdminUser,
  mockLabTechUser,
  mockStaffUser,
]

export const mockAuditLog = {
  id: 1,
  user_id: 1,
  action: 'LOGIN',
  details: { ip: '192.168.1.1', user_agent: 'Mozilla/5.0' },
  timestamp: '2024-01-15T10:30:00Z',
  user_email: 'doctor@hospital.org',
}

export const mockAuditLog2 = {
  id: 2,
  user_id: 1,
  action: 'VIEW_PATIENT',
  details: { patient_id: 'P001' },
  timestamp: '2024-01-15T10:35:00Z',
  user_email: 'doctor@hospital.org',
}

export const mockAuditLogList = [mockAuditLog, mockAuditLog2]

export const mockMedicalRecord = {
  id: 1,
  patient_id: 'P001',
  diagnosis: 'Hypertension',
  treatment: 'Medication A',
  created_at: '2024-01-10T00:00:00Z',
}

export const mockLabReport = {
  id: 1,
  patient_id: 'P001',
  test_name: 'Blood Test',
  result: 'Normal',
  uploaded_at: '2024-01-12T00:00:00Z',
}

export const mockApiError = {
  response: {
    status: 400,
    data: {
      detail: 'Invalid email or password',
    },
  },
}

export const mockApiErrorUnauthorized = {
  response: {
    status: 401,
    data: {
      detail: 'Unauthorized',
    },
  },
}

export const mockApiErrorNotFound = {
  response: {
    status: 404,
    data: {
      detail: 'Resource not found',
    },
  },
}
