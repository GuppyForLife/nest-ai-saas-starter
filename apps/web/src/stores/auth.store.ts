import axios from 'axios'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { apiClient } from '../api/http-client'

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message

    if (typeof responseMessage === 'string') {
      return responseMessage
    }
  }

  return 'An unexpected error occurred.'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)

      token.value = response.data.accessToken
      localStorage.setItem('token', response.data.accessToken)
      await fetchCurrentUser()
    } catch (caughtError: unknown) {
      error.value = getErrorMessage(caughtError)
    } finally {
      isLoading.value = false
    }
  }

  async function register(credentials: RegisterCredentials): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await apiClient.post('/auth/register', credentials)
    } catch (caughtError: unknown) {
      error.value = getErrorMessage(caughtError)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!token.value) {
      user.value = null
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.get<User>('/auth/me')

      user.value = response.data
    } catch (caughtError: unknown) {
      error.value = getErrorMessage(caughtError)
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    fetchCurrentUser,
    logout,
  }
})
