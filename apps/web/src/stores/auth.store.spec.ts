// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import * as httpClientModule from '../api/http-client'
import { useAuthStore } from './auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login - should update token, call fetchCurrentUser, and set isAuthenticated to true', async () => {
    const authStore = useAuthStore()

    vi.spyOn(httpClientModule.apiClient, 'post').mockResolvedValue({
      data: { accessToken: 'mock-jwt' },
    })
    vi.spyOn(httpClientModule.apiClient, 'get').mockResolvedValue({
      data: {
        id: '1',
        email: 'user@test.com',
        role: 'USER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    })

    await authStore.login({ email: 'user@test.com', password: 'password123' })

    expect(httpClientModule.apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'user@test.com',
      password: 'password123',
    })
    expect(httpClientModule.apiClient.get).toHaveBeenCalledWith('/auth/me')
    expect(authStore.token).toBe('mock-jwt')
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.user?.email).toBe('user@test.com')
  })

  it('login failure - should capture error message in authStore.error', async () => {
    const authStore = useAuthStore()

    const error = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Invalid email or password',
        },
      },
    }

    vi.spyOn(httpClientModule.apiClient, 'post').mockRejectedValue(error)

    await authStore.login({ email: 'user@test.com', password: 'wrong-password' })

    expect(authStore.error).toBe('Invalid email or password')
  })

  it('logout - should reset store state and remove token from localStorage', () => {
    const authStore = useAuthStore()
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')

    authStore.token = 'stored-token'
    authStore.user = {
      id: '1',
      email: 'user@test.com',
      role: 'USER',
      createdAt: '2024-01-01T00:00:00.000Z',
    }
    localStorage.setItem('token', 'stored-token')

    authStore.logout()

    expect(authStore.user).toBeNull()
    expect(authStore.token).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
    expect(removeItemSpy).toHaveBeenCalledWith('token')
  })
})
