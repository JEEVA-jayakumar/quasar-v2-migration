// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const REGION_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}regions?institutionCode=${request}`)
    .then(response => {
      commit("SET_REGION_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching regions from MARS:", error);
      throw error;
    });
};