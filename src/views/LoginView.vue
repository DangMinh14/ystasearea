<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-6">
    <h1 class="text-2xl font-bold">Sign In</h1>

    <div v-if="authStore.isLoggedIn">
      <p>Signed in as: {{ authStore.user?.email }}</p>
      <button @click="authStore.logout(); router.push('/')">
        Sign Out
      </button>
    </div>

    <div v-else class="flex flex-col gap-4">
      <button
        @click="authStore.loginWithGoogle()"
        class="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50"
      >
        Sign in with Google
      </button>

      <button
        @click="authStore.loginWithGitHub()"
        class="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50"
      >
        Sign in with GitHub
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
</script>
