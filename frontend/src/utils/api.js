import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.PROD ? '' : 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
})

console.log('API Configuration:', {
  baseURL: import.meta.env.PROD ? 'Production' : 'http://localhost:3000',
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, {
      headers: config.headers,
      data: config.data
    })
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    })
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api