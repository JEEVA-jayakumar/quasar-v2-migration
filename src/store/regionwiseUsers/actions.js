import api from "../api.js";
// Removed unused Vue import
// Removed rootState from destructuring since it's not used

const FETCH_REGION_WISE_LIST = ({
  commit
  // rootState removed since it's not used
}, request) => {
  return api
    .get("user/regionwise-user-list", {
      params: request, // Changed 'items' to 'params' for consistency with typical API calls
    })
    .then(response => {
      commit("SET_REGION_WISE_LIST", response.data.data);
    });
};

export default {
  FETCH_REGION_WISE_LIST
};
