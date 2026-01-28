import api from '../api.js'

export const CMS_LIST = ({ commit }, request) => {
  const sorting = request.pagination.descending ? 'asc' : 'desc'

  return api
    .get(
      'get-cms-mars-data-information' +
        '?page=' + request.pagination.page +
        '&size=' + request.pagination.rowsPerPage +
        '&searchTerm=' + request.filter +
        '&sort=' + request.pagination.sortBy +
        '&' + request.pagination.sortBy + '.dir=' + sorting
    )
    .then((response) => {
      commit('SET_CMS_LIST', response.data.data)
    })
}
