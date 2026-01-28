import api from '../api.js'

export const FETCH_ALL_ZONE = ({ commit, rootState }) => {
  return api
    .get(
      rootState.GlobalVariables.STATE_LOCAL_API + 'getallzone'
    )
    .then(response => {
      console.log(response)

      const zone = response.data.data.map(value => ({
        label: value.zone,
        value: value.zone
      }))

      commit('SET_ALL_ZONE', zone)
    })
}
