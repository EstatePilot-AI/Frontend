import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const authService = {
  login: ({ email, password }) =>
    client.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    }),

  logout: (token) =>
    client.post(
      ENDPOINTS.AUTH.LOGOUT,
      null,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    ),
}
