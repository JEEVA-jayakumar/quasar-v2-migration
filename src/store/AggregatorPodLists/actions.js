import api from '../api.js'

export const FETCH_AGGREGATOR_POD_LIST = ({ commit }, request) => {
  const sorting = request.pagination.descending ? 'asc' : 'desc'

  const selectedTab = localStorage.getItem('selectedTab')
  const aggregatorId = selectedTab
    ? JSON.parse(selectedTab.split('|')[1])
    : null

  return api.get(
    `aggregator-inventory/agg-pod-list/${aggregatorId}` +
    `?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&search=${request.filter}` +
    `&sort=${request.pagination.sortBy}` +
    `&${request.pagination.sortBy}.dir=${sorting}`
  ).then(response => {
    commit('SET_ALL_AGGREGATOR_POD_LIST', response.data.data)
  })
}
