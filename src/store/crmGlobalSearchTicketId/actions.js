import api from '../api.js'

export const FETCH_CRM_GLOBAL_SEARCH_DATAS = async ({ commit }, request) => {
  try {
    const response = await api.get(
      `crm-request/searchTicket/${request.searchTerm}`
    )

    // Normalize response safely (to support old & new formats)
    const responseData = response?.data?.data ?? response?.body?.data ?? []

    console.log('API Response : ', responseData)

    commit('API_RESPONSE_LOG', {
      apiStatusCode: response.status,
      apiPending: false,
      apiSuccess: response.status === 200,
      apiFailure: response.status !== 200,
      apiData: responseData
    })

    commit('SET_FETCH_CRM_GLOBAL_SEARCH_DATAS', responseData)

    return response
  } catch (error) {
    console.error('FETCH_CRM_GLOBAL_SEARCH_DATAS error:', error)

    commit('API_RESPONSE_LOG', {
      apiStatusCode: error?.response?.status ?? 500,
      apiPending: false,
      apiSuccess: false,
      apiFailure: true,
      apiData: []
    })

    throw error
  }
}

export const someAction = () => {
  // intentionally empty (kept for compatibility)
}
