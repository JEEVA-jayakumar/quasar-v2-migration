import api from '../api.js'

const FETCH_PHONEPE_SEND_TO_REPAIR_DETAILS = ({ commit }, request) => {
  const { pagination, filter } = request

  if (!pagination.sortBy) {
    return api.get(
      `central-devices-sent-for-repair?page=${pagination.page}` +
      `&size=${pagination.rowsPerPage}` +
      `&search=${filter}`
    ).then(response => {
      commit('SET_PHONEPE_SEND_TO_REPAIR_DATA', response.data.data)
    })
  }

  const sorting = pagination.descending ? 'asc' : 'desc'

  return api.get(
    `central-devices-sent-for-repair?page=${pagination.page}` +
    `&size=${pagination.rowsPerPage}` +
    `&search=${filter}` +
    `&sort=${pagination.sortBy}` +
    `&${pagination.sortBy}.dir=${sorting}`
  ).then(response => {
    commit('SET_PHONEPE_SEND_TO_REPAIR_DATA', response.data.data)
  })
}

const APPROVE_PHONEPE_SEND_TO_REPAIR = ({ commit }, request) => {
  const selectedTab = localStorage.getItem('selectedTab')
  const aggregatorId = selectedTab
    ? JSON.parse(selectedTab.split('|')[1])
    : null

  return api.post(
    `aggregator-inventory/agg-central-faulty-device-accept-or-move-to-scrap/${aggregatorId}/1`,
    request
  ).then(response => {
    const data = {
      apiStatusCode: response.status,
      apiPending: false,
      apiSuccess: true,
      apiFailure: false,
      apiData: response.data.data
    }

    commit('API_PHONEPE_RESPONSE_LOG', data)
  })
}

const PHONEPE_MOVED_TO_SCRAP_DATAS = ({ commit }, request) => {
  const selectedTab = localStorage.getItem('selectedTab')
  const aggregatorId = selectedTab
    ? JSON.parse(selectedTab.split('|')[1])
    : null

  return api.post(
    `aggregator-inventory/agg-central-faulty-device-accept-or-move-to-scrap/${aggregatorId}/2`,
    request
  ).then(response => {
    const data = {
      apiStatusCode: response.status,
      apiPending: false,
      apiSuccess: true,
      apiFailure: false,
      apiData: response.data.data
    }

    commit('API_PHONEPE_RESPONSE_LOG', data)
  })
}

const FETCH_ALL_MOVED_TO_SCRAP_DATA = ({ commit }, request) => {
  const { pagination, filter } = request
  const sorting = pagination.descending ? 'desc' : 'asc'

  return api.get(
    `central-inventory-get-device-by-status/4?page=${pagination.page}` +
    `&size=${pagination.rowsPerPage}` +
    `&search=${filter}` +
    `&sort=${pagination.sortBy}` +
    `&${pagination.sortBy}.dir=${sorting}`
  ).then(response => {
    commit('SET_PHONEPE_ALL_MOVED_TO_SCRAP_DATA', response.data.data)
  })
}


export default {
  FETCH_PHONEPE_SEND_TO_REPAIR_DETAILS,
  APPROVE_PHONEPE_SEND_TO_REPAIR,
  PHONEPE_MOVED_TO_SCRAP_DATAS,
  FETCH_ALL_MOVED_TO_SCRAP_DATA
};
