import axios from 'axios'
import { environment } from '../config/environment'

const client = axios.create({
  baseURL: environment.apiBaseUrl,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
