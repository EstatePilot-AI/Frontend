import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const userService = {
  getUserProfile: () => client.get(ENDPOINTS.USER.GET_MY_PROFILE),

  changePassword: ({ currentPassword, newPassword }) =>
    client.put(ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    }),

  forgetPassword: ({ email }) =>
    client.post(ENDPOINTS.USER.FORGET_PASSWORD, {
      email,
    }),

  resetPassword: ({ email, token, newPassword }) =>
    client.post(ENDPOINTS.USER.RESET_PASSWORD, {
      email,
      token,
      newPassword,
    }),

  createNewUser: ({ personName, email, phoneNumber, role, password }) =>
    client.post(ENDPOINTS.USER.CREATE_NEW_USER, {
      personName,
      email,
      phoneNumber,
      role,
      password,
    }),
}
