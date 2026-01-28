// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const IFSC_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API_URL || '';
  
  return api
    .get(`${baseURL}ifsc?ifsc=${request}`)
    .then(response => {
      commit("SET_IFSC_FROM_MARS", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error fetching IFSC from MARS:", error);
      throw error;
    });
}