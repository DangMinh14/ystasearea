<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="error" class="text-red-500">
      <p>Login failed: {{ error }}</p>
      <button @click="router.push('/')">Go back to home</button>
    </div>
    <div v-else>
      <p>Signing you in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const error = ref<string | null>(null)

onMounted(async () => {
  const token = route.query.token as string | undefined

  if (!token) {
    error.value = 'No token received from server'
    return
  }

  try {
    authService.saveToken(token)
    authStore.token = token

    await authStore.fetchMe()

    router.replace('/')
  } catch {
    error.value = 'Authentication failed, please try again'
    authStore.logout()
  }
})
</script>
