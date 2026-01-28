import api from '../api.js'

const ALLOCATED_MENU = ({commit}) => {
  return api.get('getAllocatedDevicesRegion')
    .then(response => {
      console.log(response)
      commit('SET_ALLOCATED_MENU', response.data.data)
    })
}


export default {
  ALLOCATED_MENU
};
