// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const FETCH_ALL_MPOS_CATEGORY = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  // Using api instead of api for Vue 3 compatibility
  
  // Get base URL from rootState or use api's default base URL
  const baseURL = rootState.GlobalVariables?.STATE_LOCAL_API || '';
  
  return api
    .get(baseURL + "getcategory")
    .then(response => {
      // Using map() properly - it returns a new array
      const mposCategory = response.data.map(value => ({
        label: value.category,
        value: value.category_code
      }));
      commit("SET_ALL_MPOS_CATEGORY", mposCategory);
    })
    .catch(error => {
      console.error("Error fetching MPOS categories:", error);
      throw error;
    });
};

export default {
  FETCH_ALL_MPOS_CATEGORY
};
