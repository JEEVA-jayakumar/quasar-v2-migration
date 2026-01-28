// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const SERVICE_PROVIDER = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  // Create a custom axios instance with the specific base URL
  const marsApi = api.create({
    baseURL: rootState.GlobalVariables?.STATE_MARS_API || ''
  });
  
  return marsApi
    .get("serviceProviders?institutionCode=" + request)
    .then(response => {
      commit("SET_SERVICE_PROVIDER", response.data);
    })
    .catch(error => {
      console.error("Error fetching service providers from MARS:", error);
      throw error;
    });
};

export default {
  SERVICE_PROVIDER
};
