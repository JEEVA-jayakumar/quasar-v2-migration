// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const STATE_FROM_MARS = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  // Using api instead of api for Vue 3 compatibility
  
  // Create a custom axios instance with the specific base URL
  const marsApi = api.create({
    baseURL: rootState.GlobalVariables?.STATE_MARS_API || ''
  });
  
  return marsApi
    .get('state')
    .then(response => {
      // console.log(response)
      commit("SET_STATE_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching states from MARS:", error);
      throw error;
    });
};

export default {
  STATE_FROM_MARS
};
