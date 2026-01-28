import api from '../api.js'

export const SAVE_HIERARCHY = async ({ commit }, request) => {
  const response = await api.post('hierarchy/', request)

  const data = {
    apiStatusCode: response.status,
    apiPending: false,
    apiSuccess: true,
    apiData: response.data.data
  }

  commit('API_RESPONSE_LOG', data)
  return response.data.data
}

export const DELETE_HIERARCHY = async (context, request) => {
  console.log(
    'DISABLE request DATAS------------->',
    JSON.stringify(request)
  )

  return api.delete(`hierarchy/${request.value}`)
}

export const ACTIVE_HIERARCHY = async (context, request) => {
  console.log(
    'ACTIVE request DATAS------------->',
    JSON.stringify(request)
  )

  return api.put(`hierarchy/${request.id}`, request)
}