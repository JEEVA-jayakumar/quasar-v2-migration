import api from '../api.js'

export const DEMAPPING_STATUS_LIST = async ({ commit }, request) => {
  try {
    const selectedTab = localStorage.getItem("selectedTab")
    const aggregatorId = selectedTab ? JSON.parse(selectedTab.split('|')[1]) : ''

    const response = await api.get(
      `get-aggrator-mapped-device/${aggregatorId}?page=${request.pagination.page}&size=${request.pagination.rowsPerPage}&search=${request.filter}`
    )

    // Commit data to state
    commit('SET_DEMAPPING_STATUS_LIST', response.data.data)
    return response
  } catch (error) {
    console.error('DEMAPPING_STATUS_LIST error:', error)
    throw error
  }
}

// Remove unused 'commit' parameter
export const REMARKS_REASON_DETAILS = async (_, request) => {
  try {
    console.log("REMARKS_REASON_DETAILS Request:", JSON.stringify(request))

    const response = await api.post('demap-lead-device', request)
    return response
  } catch (error) {
    console.error('REMARKS_REASON_DETAILS error:', error)
    throw error
  }
}