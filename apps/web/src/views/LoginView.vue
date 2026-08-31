<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleSubmit(): Promise<void> {
  await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (!authStore.error) {
    await router.push('/dashboard')
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Welcome back</h1>
      <p class="subtitle">Sign in to continue</p>

      <div v-if="authStore.error" class="error-alert" role="alert">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="field-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="you@example.com" required />
        </div>

        <div class="field-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>

      <p class="switch-link">
        Need an account?
        <router-link to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  padding: 32px;
}

h1 {
  margin: 0;
  font-size: 2rem;
  text-align: center;
  color: #111827;
}

.subtitle {
  margin: 8px 0 24px;
  text-align: center;
  color: #6b7280;
}

.error-alert {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  font-size: 0.95rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

label {
  font-weight: 600;
  color: #374151;
}

input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

button {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.switch-link {
  margin-top: 20px;
  text-align: center;
  color: #4b5563;
}

.switch-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>
