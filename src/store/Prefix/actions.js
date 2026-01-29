import api from "../api.js";
// Removed unused Vue import

const ADD_NEW_PREFIX = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("lead-source-prefix-conf", request);
};

const GET_PREFIX_DETAILS = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("lead-source-prefix-conf").then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_PREFIX_DETAILS", response.data.data);
  });
};

export default {
  ADD_NEW_PREFIX,
  GET_PREFIX_DETAILS
};
