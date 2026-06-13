import api from './api'

export const adminService = {
  async getUsers(params = {}) {
    const { data } = await api.get('/admin/users', { params })
    return data
  },

  async createUser(payload) {
    const { data } = await api.post('/admin/users', payload)
    return data
  },

  async updateUser(id, payload) {
    const { data } = await api.put(`/admin/users/${id}`, payload)
    return data
  },

  async deactivateUser(id) {
    const { data } = await api.patch(`/admin/users/${id}/deactivate`)
    return data
  },

  async getAuditLog(params = {}) {
    const { data } = await api.get('/admin/audit-log', { params })
    return data
  },
}
