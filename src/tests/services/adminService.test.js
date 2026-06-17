import { describe, it, expect, beforeEach, vi } from 'vitest'
import { adminService } from '../../services/adminService'

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}))

import api from '../../services/api'
import { mockStaffList, mockAuditLogList, mockStaffUser } from '../mockData'

describe('Admin Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsers', () => {
    it('should fetch users list', async () => {
      api.get.mockResolvedValueOnce({ data: mockStaffList })

      const result = await adminService.getUsers()

      expect(api.get).toHaveBeenCalledWith('/admin/users', { params: {} })
      expect(result).toEqual(mockStaffList)
    })

    it('should pass params to API call', async () => {
      const params = { role: 'Doctor', page: 1 }
      api.get.mockResolvedValueOnce({ data: [mockStaffUser] })

      await adminService.getUsers(params)

      expect(api.get).toHaveBeenCalledWith('/admin/users', { params })
    })

    it('should throw error on API failure', async () => {
      const error = new Error('Network error')
      api.get.mockRejectedValueOnce(error)

      await expect(adminService.getUsers()).rejects.toThrow('Network error')
    })
  })

  describe('createUser', () => {
    it('should create new user', async () => {
      const payload = {
        email: 'newstaff@hospital.org',
        full_name: 'New Staff',
        role: 'Doctor',
        password: 'password123',
      }
      api.post.mockResolvedValueOnce({ data: mockStaffUser })

      const result = await adminService.createUser(payload)

      expect(api.post).toHaveBeenCalledWith('/admin/users', payload)
      expect(result).toEqual(mockStaffUser)
    })

    it('should handle validation errors', async () => {
      const payload = { email: 'invalid' }
      const error = new Error('Validation failed')
      api.post.mockRejectedValueOnce(error)

      await expect(adminService.createUser(payload)).rejects.toThrow(
        'Validation failed'
      )
    })
  })

  describe('updateUser', () => {
    it('should update user', async () => {
      const userId = 1
      const payload = { full_name: 'Updated Name', role: 'Admin' }
      const updatedUser = { ...mockStaffUser, ...payload }
      api.put.mockResolvedValueOnce({ data: updatedUser })

      const result = await adminService.updateUser(userId, payload)

      expect(api.put).toHaveBeenCalledWith(`/admin/users/${userId}`, payload)
      expect(result).toEqual(updatedUser)
    })

    it('should throw error if user not found', async () => {
      const error = new Error('User not found')
      api.put.mockRejectedValueOnce(error)

      await expect(adminService.updateUser(999, {})).rejects.toThrow(
        'User not found'
      )
    })
  })

  describe('deactivateUser', () => {
    it('should deactivate user', async () => {
      const userId = 4
      const deactivatedUser = { ...mockStaffUser, active: false }
      api.patch.mockResolvedValueOnce({ data: deactivatedUser })

      const result = await adminService.deactivateUser(userId)

      expect(api.patch).toHaveBeenCalledWith(`/admin/users/${userId}/deactivate`)
      expect(result).toEqual(deactivatedUser)
    })

    it('should throw error on deactivate failure', async () => {
      const error = new Error('Cannot deactivate')
      api.patch.mockRejectedValueOnce(error)

      await expect(adminService.deactivateUser(1)).rejects.toThrow(
        'Cannot deactivate'
      )
    })
  })

  describe('getAuditLog', () => {
    it('should fetch audit log', async () => {
      api.get.mockResolvedValueOnce({ data: mockAuditLogList })

      const result = await adminService.getAuditLog()

      expect(api.get).toHaveBeenCalledWith('/admin/audit-log', { params: {} })
      expect(result).toEqual(mockAuditLogList)
    })

    it('should pass params to audit log query', async () => {
      const params = { action: 'LOGIN', limit: 50 }
      api.get.mockResolvedValueOnce({ data: mockAuditLogList })

      await adminService.getAuditLog(params)

      expect(api.get).toHaveBeenCalledWith('/admin/audit-log', { params })
    })

    it('should handle audit log fetch errors', async () => {
      const error = new Error('Forbidden')
      api.get.mockRejectedValueOnce(error)

      await expect(adminService.getAuditLog()).rejects.toThrow('Forbidden')
    })
  })
})
