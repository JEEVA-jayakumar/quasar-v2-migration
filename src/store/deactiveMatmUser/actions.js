import api from '../api.js'

const DEACTIVATE_MATM_USER_DETAILS = async (_, request) => {
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

export default {
  DEACTIVATE_MATM_USER_DETAILS
};
