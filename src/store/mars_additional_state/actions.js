// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const STATE_FROM_ADDITIONAL_TID = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}state/${request}`)
    .then(response => {
      // console.log(response)
      commit("SET_STATE_FROM_ADDITIONAL_TID", response.data);
    })
    .catch(error => {
      console.error("Error fetching state from additional TID:", error);
      throw error;
    });
}