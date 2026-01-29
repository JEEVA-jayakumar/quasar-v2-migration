import api from '../api.js'

const DELETE_PLAN_DETAILS_DATAS = async (_, request) => {
  try {
    const response = await api.delete(
      `delete-m-atm-plan/${request.Id}`
    )

    console.log(response)
    return response
  } catch (error) {
    console.error('DELETE_PLAN_DETAILS_DATAS error:', error)
    throw error
  }
}

export default {
  DELETE_PLAN_DETAILS_DATAS
};
