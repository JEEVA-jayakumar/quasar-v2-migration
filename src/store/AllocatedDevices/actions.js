import api from '../api.js'

export const ALLOCATED_MENU = ({commit}) => {
  return api.get('getAllocatedDevicesRegion')
    .then(response => {
      console.log(response)
      commit('SET_ALLOCATED_MENU', response.data.data)
    })
}
