import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5201'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear token and redirect to home
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  loginWithGoogle() {
    window.location.href = `${API_URL}/api/auth/login/google`
  },

  loginWithGitHub() {
    window.location.href = `${API_URL}/api/auth/login/github`
  },

  async getMe() {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  async logout() {
    try {
      await api.post('/api/auth/logout')
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  },

  saveToken(token: string) {
    localStorage.setItem('auth_token', token)
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  saveUser(user: object) {
    localStorage.setItem('auth_user', JSON.stringify(user))
  },

  getUser() {
    const raw = localStorage.getItem('auth_user')
    return raw ? JSON.parse(raw) : null
  },

  isLoggedIn(): boolean {
    return !!this.getToken()
  },
}
