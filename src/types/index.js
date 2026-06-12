/**
 * @typedef {'Doctor'|'Lab Technician'|'Admin'} UserRole
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {UserRole} role
 * @property {string|null} avatar_url
 * @property {boolean} is_active
 * @property {string} created_at
 *
 * @typedef {'Active'|'In ER'|'Pending Lab'|'Discharged'} PatientStatus
 *
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} patient_id
 * @property {string} full_name
 * @property {string} date_of_birth
 * @property {string} gender
 * @property {string} blood_type
 * @property {string} contact_phone
 * @property {string} contact_email
 * @property {PatientStatus} status
 * @property {string} created_at
 *
 * @typedef {Object} MedicalRecord
 * @property {string} id
 * @property {string} patient_id
 * @property {string} doctor_id
 * @property {string} diagnosis
 * @property {string} prescription
 * @property {string} notes
 * @property {string} record_type
 * @property {string} created_at
 *
 * @typedef {Object} LabResult
 * @property {string} id
 * @property {string} patient_id
 * @property {string} uploader_id
 * @property {string} test_type
 * @property {string} file_url
 * @property {string} report_id
 * @property {string} status
 * @property {string} created_at
 *
 * @typedef {Object} AuditEntry
 * @property {string} id
 * @property {string} user_id
 * @property {string} action
 * @property {string} entity_type
 * @property {string|null} entity_id
 * @property {Object} details
 * @property {string} ip_address
 * @property {string} created_at
 */

export {}
