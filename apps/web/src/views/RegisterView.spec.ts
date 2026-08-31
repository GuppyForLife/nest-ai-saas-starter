// @vitest-environment jsdom

import { mount, RouterLinkStub } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../stores/auth.store'
import RegisterView from './RegisterView.vue'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('RegisterView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate that passwords match before calling authStore.register', async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const authStore = useAuthStore()
    const registerSpy = vi.spyOn(authStore, 'register').mockResolvedValue()

    await wrapper.find('#email').setValue('user@test.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper.find('#confirmPassword').setValue('differentPassword')

    await wrapper.find('form').trigger('submit.prevent')

    expect(registerSpy).not.toHaveBeenCalled()

    const errorElement = wrapper.find('.error-alert')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toContain('Passwords do not match')
  })

  it('should call authStore.register with valid credentials when passwords match', async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const authStore = useAuthStore()
    const registerSpy = vi.spyOn(authStore, 'register').mockResolvedValue()

    await wrapper.find('#email').setValue('user@test.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper.find('#confirmPassword').setValue('password123')

    await wrapper.find('form').trigger('submit.prevent')

    expect(registerSpy).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'password123',
    })
  })

  it('should display backend error when authStore.error is present', async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const authStore = useAuthStore()
    authStore.error = 'Email already in use'

    await wrapper.vm.$nextTick()

    const errorElement = wrapper.find('.error-alert')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toContain('Email already in use')
  })
})
