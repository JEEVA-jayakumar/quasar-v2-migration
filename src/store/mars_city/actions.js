// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const CITY_FROM_MARS = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}city`)
    .then(response => {
      // console.log(response)
      commit("SET_CITY_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching cities from MARS:", error);
      throw error;
    });
}

export default {
  CITY_FROM_MARS
};
