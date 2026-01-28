import api from '../api.js'

const CHANGE_MANAGEMENT_LIST = ({ commit }, request) => {
  const sorting = request.pagination.descending ? 'asc' : 'desc'

  return api
    .get(
      `get-all-mars-data-information?page=${request.pagination.page}` +
      `&size=${request.pagination.rowsPerPage}` +
      `&searchTerm=${request.filter}` +
      `&sort=${request.pagination.sortBy}` +
      `&${request.pagination.sortBy}.dir=${sorting}`
    )
    .then(response => {
      commit('SET_CHANGE_MANAGEMENT_LIST', response.data.data)
      return response
    })
}


export default {
  CHANGE_MANAGEMENT_LIST
};
