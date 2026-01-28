import api from '../api.js'

export const UPDATE_ROLE_DATA = async (context, request) => {
  const response = await api.post('role', request)
  console.log(response)
  return response
}