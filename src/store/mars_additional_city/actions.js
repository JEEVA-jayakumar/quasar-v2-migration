// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const CITY_FORM_ADDITIONAL_TID = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}city/${request}`)
    .then(response => {
      // console.log(response)
      commit("SET_CITY_FORM_ADDITIONAL_TID", response.data);
    })
    .catch(error => {
      console.error("Error fetching city from additional TID:", error);
      throw error;
    });
}

export default {
  CITY_FORM_ADDITIONAL_TID
};
