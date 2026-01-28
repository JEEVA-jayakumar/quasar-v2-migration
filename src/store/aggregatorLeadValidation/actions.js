import api from '../api.js'

const getSelectedTabValue = () => {
  const tab = localStorage.getItem('selectedTab')
  return tab ? JSON.parse(tab.split('|')[1]) : null
}

export default {
  async FETCH_AGGREGATOR_LEAD_VALIDATION_DATAS({ commit }, request) {
    const selectedTab = getSelectedTabValue()
    if (!selectedTab) return

    const sorting = request.pagination.descending ? 'asc' : 'desc'

    const response = await api.get(
      `tpt-lead-validation-tracker-pagination-list-paged/${selectedTab}?page=${request.pagination.page}` +
      `&size=${request.pagination.rowsPerPage}` +
      `&search=${request.filter}` +
      `&sort=${request.pagination.sortBy}` +
      `&${request.pagination.sortBy}.dir=${sorting}`
    )

    commit('SET_AGGREGATOR_LEAD_VALIDATION_DATAS', response.data.data)
  }
}