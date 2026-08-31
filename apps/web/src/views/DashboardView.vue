<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router'

const router = useRouter();
const authStore = useAuthStore();

function handleLogout(): void {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div>
    <h1>Email: {{ authStore.user?.email }}</h1>
    <h2>Role: {{ authStore.user?.role }}</h2>
    <button type="button" @click="handleLogout">Logout</button>
  </div>
</template>
