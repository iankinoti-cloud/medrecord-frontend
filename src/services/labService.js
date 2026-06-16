// services/labService.js
import api from './api'

export const labService = {
    // Lab Tests
    getLabTests: async (params = {}) => {
        const response = await api.get('/lab/tests', { params })
        return response.data
    },

    orderLabTest: async (data) => {
        const response = await api.post('/lab/tests/order', data)
        return response.data
    },

    updateLabTestStatus: async (testId, status) => {
        const response = await api.patch(`/lab/tests/${testId}/status`, { status })
        return response.data
    },

    getTestResults: async (params = {}) => {
        const response = await api.get('/lab/results', { params })
        return response.data
    },

    // File Upload (New)
    uploadLabReport: async (formData) => {
        const response = await api.post('/lab/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    getUploadHistory: async (params = {}) => {
        const response = await api.get('/lab/uploads', { params })
        return response.data
    },

    downloadReport: async (reportId) => {
        const response = await api.get(`/lab/reports/${reportId}/download`, {
            responseType: 'blob',
        })
        return response.data
    },

    // Inventory
    getInventory: async (params = {}) => {
        const response = await api.get('/lab/inventory', { params })
        return response.data
    },

    addInventoryItem: async (data) => {
        const response = await api.post('/lab/inventory', data)
        return response.data
    },

    updateInventoryItem: async (id, data) => {
        const response = await api.put(`/lab/inventory/${id}`, data)
        return response.data
    },

    deleteInventoryItem: async (id) => {
        const response = await api.delete(`/lab/inventory/${id}`)
        return response.data
    },
}