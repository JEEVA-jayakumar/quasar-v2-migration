// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const SHARING_PARTNER_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  // Create a custom axios instance with the specific base URL
  const marsApi = api.create({
    baseURL: rootState.GlobalVariables?.STATE_MARS_API || ''
  });
  
  return marsApi
    .get('sharing-partner?institutionCode=' + request)
    .then(response => {
      // console.log(response)
      commit("SET_SHARING_PARTNER_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching sharing partner from MARS:", error);
      throw error;
    });
};