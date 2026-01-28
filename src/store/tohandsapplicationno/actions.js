import api from "../api.js";


export const FETCH_APPLICATION_NUMBER = ({
  commit
  // Removed unused rootState parameter
}, request) => {
  return api.get(`application/${request}`)
    .then(response => {
      commit('SET_APPLICATION_NUMBER', response.data.data);
    });
}