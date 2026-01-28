import api from '../api.js'

// Fetch VAS device mapping data
export const FETCH_VAS_DATAS = ({ commit }, request) => {
  return api
    .get(`vas-mapping/get-vas-device-mapping/${request}`)
    .then(response => {
      console.log('VAS Response:', response)
      commit('SET_VAS_DATAS', response.data)
      return response.data
    })
    .catch(error => {
      console.error('VAS API Failure:', error)
      throw error
    })
}
