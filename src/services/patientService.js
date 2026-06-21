// services/patientService.js
import api from './api'

export const patientService = {
    // ... existing methods ...

    searchPatients: async (query) => {
        const response = await api.get('/patients/search', { params: { query } })
        return response.data
    },

    registerPatient: async (data) => {
        const response = await api.post('/patients/register', data)
        return response.data
    },

    getPatientById: async (id) => {
        const response = await api.get(`/patients/${id}`)
        return response.data
    },
}