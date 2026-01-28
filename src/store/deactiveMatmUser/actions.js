import api from '../api.js'

export const DEACTIVATE_MATM_USER_DETAILS = async (_, request) => {
  try {
    const response = await api.delete(
      `delete-m-atm-plan/${request}`
    )

    console.log(response)
    return response
  } catch (error) {
    console.error('DEACTIVATE_MATM_USER_DETAILS error:', error)
    throw error
  }
}