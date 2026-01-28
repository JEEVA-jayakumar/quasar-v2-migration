// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const FETCH_ALL_MPOS_CITY = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  // Get base URL from rootState or use api's default base URL
  const baseURL = rootState.GlobalVariables?.STATE_LOCAL_API || '';
  
  return api
    .get(baseURL + "getmarstates/" + request)
    .then(response => {
      // Using map() properly - it returns a new array
      const mposCity = response.data.map(value => ({
        label: value,
        value: value,
      }));
      commit("SET_ALL_MPOS_CITY", mposCity);
    })
    .catch(error => {
      console.error("Error fetching MPOS cities:", error);
      throw error;
    });
};

export default {
  FETCH_ALL_MPOS_CITY
};
