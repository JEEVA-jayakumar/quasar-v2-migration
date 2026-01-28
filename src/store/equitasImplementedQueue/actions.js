import api from '../api.js'

const buildSort = (pagination) =>
  pagination.descending ? 'asc' : 'desc'

/* -------------------------------- EQUITAS -------------------------------- */

export const EQUITAS_TRACKER_LIST = ({ commit }, request) => {
  const { pagination, filter, formData } = request
  const params = new URLSearchParams({
    page: pagination.page,
    size: pagination.rowsPerPage,
    search: filter
  })

  if (pagination.sortBy) {
    params.append('sort', pagination.sortBy)
    params.append(`${pagination.sortBy}.dir`, buildSort(pagination))
  }

  if (formData?.fromDate && formData?.toDate) {
    params.append('fromDate', formData.fromDate)
    params.append('toDate', formData.toDate)
  }

  return api
    .get(`merchant-tracker-implemented-list/sat?${params}`)
    .then(res => commit('SET_EQUITAS_REPORT', res.data.data))
}

/* ---------------------------- BIJLIPAY DEACTIVE ---------------------------- */

export const BIJLIPAY_DEACTIVE_LIST = ({ commit }, request) => {
  const { pagination, filter, formData } = request
  const params = new URLSearchParams({
    page: pagination.page,
    size: pagination.rowsPerPage,
    search: filter
  })

  if (pagination.sortBy) {
    params.append('sort', pagination.sortBy)
    params.append(`${pagination.sortBy}.dir`, buildSort(pagination))
  }

  if (formData?.fromDate && formData?.toDate) {
    params.append('FromDate', formData.fromDate)
    params.append('ToDate', formData.toDate)
  }

  return api
    .get(`merchant-De-ActivationList/sat?${params}`)
    .then(res => commit('SET_BIJLIPAY_DEACTIVE_LIST', res.data.data))
}

/* ---------------------- AGGREGATOR IMPLEMENTED QUEUE ---------------------- */

export const AGGREGATOR_IMPLEMENTED_VERIFICATION_QUEUE = ({ commit }, request) => {
  const { pagination, filter, formData } = request
  const aggId = JSON.parse(localStorage.getItem('selectedTab'))?.split('|')[1]

  const params = new URLSearchParams({
    page: pagination.page,
    size: pagination.rowsPerPage,
    search: filter
  })

  if (pagination.sortBy) {
    params.append('sort', pagination.sortBy)
    params.append(`${pagination.sortBy}.dir`, buildSort(pagination))
  }

  if (formData?.fromDate && formData?.toDate) {
    params.append('FromDate', formData.fromDate)
    params.append('ToDate', formData.toDate)
  }

  return api
    .get(`aggregator-inventory/agg-merchant-tracker-implemented-list/sat/${aggId}?${params}`)
    .then(res =>
      commit('SET_AGGREGATOR_IMPLEMENTED_VERIFICATION_QUEUE', res.data.data)
    )
}

/* -------------------------- AGGREGATOR DEACTIVE -------------------------- */

export const AGGREGATOR_DEACTIVE_LIST = ({ commit }, request) => {
  const { pagination, filter, formData } = request
  const aggId = JSON.parse(localStorage.getItem('selectedTab'))?.split('|')[1]

  const params = new URLSearchParams({
    page: pagination.page,
    size: pagination.rowsPerPage,
    search: filter
  })

  if (pagination.sortBy) {
    params.append('sort', pagination.sortBy)
    params.append(`${pagination.sortBy}.dir`, buildSort(pagination))
  }

  if (formData?.fromDate && formData?.toDate) {
    params.append('FromDate', formData.fromDate)
    params.append('ToDate', formData.toDate)
  }

  return api
    .get(`aggregator-inventory/agg-merchant-tracker-DE-Activation-list/sat/${aggId}?${params}`)
    .then(res => commit('SET_AGGREGATOR_DEACTIVE_LIST', res.data.data))
}

/* ---------------------------- SERVICE TICKETS ---------------------------- */

export const SERVICE_TICKET_LIST = ({ commit }, request) => {
  const { pagination, filter } = request
  const params = new URLSearchParams({
    page: pagination.page,
    size: pagination.rowsPerPage,
    searchTerm: filter,
    sort: pagination.sortBy,
    [`${pagination.sortBy}.dir`]: buildSort(pagination)
  })

  return api
    .get(`service-request/sat-verification-pending-list?${params}`)
    .then(res => commit('SET_SERVICE_TICKET_LIST', res.data.data))
}

export const SERVICE_TICKET_APPROVE = ({ commit }, request) => {
  return api
    .put(`service-request/approve-service-ticket/${request.id}/1`)
    .then(res => commit('SET_SERVICE_TICKET_APPROVE', res))
}

export const SERVICE_TICKET_REJECT = ({ commit }, request) => {
  return api
    .put(
      `service-request/approve-service-ticket/${request.id}/2`,
      request.reason
    )
    .then(res => commit('SET_SERVICE_TICKET_REJECT', res))
}
