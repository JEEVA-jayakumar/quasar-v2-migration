import api from '../api.js'

const FETCH_AXIS_BANK_CITY_LOCATION = ({ commit, rootState }, request) => {
  return api
    .get(
      `${rootState.GlobalVariables.STATE_AXIS_API}axisCityName/${request}`
    )
    .then(response => {
      const axisBank = response.data.data.map(value => ({
        label: value.locationName,
        value: value.locationName
      }))

      commit('SET_ALL_AXIS_BANK_CITY_BASED_DISTRICT', axisBank)
      return response
    })
}


export default {
  FETCH_AXIS_BANK_CITY_LOCATION
};
