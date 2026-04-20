import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth'

interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  provider: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(authService.getUser())
  const token = ref<string | null>(authService.getToken())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setTokenAndUser(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    authService.saveToken(newToken)
    authService.saveUser(newUser)
  }

  async function fetchMe() {
    if (!token.value) return
    loading.value = true
    error.value = null
    try {
      const data = await authService.getMe()
      user.value = data
      authService.saveUser(data)
    } catch {
      logout()
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  function loginWithGoogle() {
    authService.loginWithGoogle()
  }

  function loginWithGitHub() {
    authService.loginWithGitHub()
  }

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    setTokenAndUser,
    fetchMe,
    logout,
    loginWithGoogle,
    loginWithGitHub,
  }
})
