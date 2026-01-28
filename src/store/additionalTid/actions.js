import api from '../api.js'

export const FETCH_ADDITIONAL_TID_DATAS = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? 'asc' : 'desc'

  const response = await api.get(
    `get-all-mars-data-information?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchTerm=${request.filter}` +
    `&sort=${request.pagination.sortBy}` +
    `&${request.pagination.sortBy}.dir=${sorting}`
  )

  commit('SET_ADDITIONAL_TID_DATAS', response.data.data)
}

export const ADDITIONAL_TID_VERIFY_DATA = async ({ commit }, request) => {
  console.log(
    'REQUEST------------------->',
    JSON.stringify(request.leadInformation.id)
  )

  const response = await api.get(
    `get-add-on-tid-info-by-lead-id/${request.leadInformation.id}`
  )

  commit('SET_ADDITIONAL_TID_VERIFY_DATA', response.data.data)
}
