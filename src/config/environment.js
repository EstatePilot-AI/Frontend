const FALLBACK_BASE_URL = 'https://estatepilot.runasp.net/api'

export const environment = {
  apiBaseUrl: import.meta.env.VITE_BASE_URL || FALLBACK_BASE_URL,
}

export default environment
