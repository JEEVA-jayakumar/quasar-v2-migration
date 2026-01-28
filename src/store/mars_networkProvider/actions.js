// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const NETWORK_PROVIDER = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}networkProviders?institutionCode=${request}`)
    .then(response => {
      // console.log(response)
      commit("SET_NETWORK_PROVIDER", response.data);
    })
    .catch(error => {
      console.error("Error fetching network providers from MARS:", error);
      throw error;
    });
};

export default {
  NETWORK_PROVIDER
};
