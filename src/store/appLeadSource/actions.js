import api from '../api.js'

export const FETCH_APP_LEADSOURCE_DATA = ({commit}) => {
  // Axios GET cannot send a body (second argument), removed `request`
  return api.get('manage/data/leadsource/')
    .then(response => {
      commit('SET_APP_LEAD_SOURCE', response.data.data)
      return response.data.data
    })
    .catch(error => {
      console.error('FETCH_APP_LEADSOURCE_DATA error:', error)
      throw error
    })
}
