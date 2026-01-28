import api from "../api.js";

const IMPLEMENTATION_EXECUTIVE_LIST = ({commit}) => {
  return api
    .get("implementation-executive-list/" + JSON.parse(localStorage.getItem("u_i")).region.id)
    .then(response => {
      // START=> COMMIT with data received'
      commit("SET_IMPLEMENTATION_EXECUTIVE_LIST", response.data.data);
      // END=> COMMIT with data received'
    });
};

const REGION_LIST = ({commit}) => {
  return api
    .get("region")
    .then(response => {
      // START=> COMMIT with data received'
      commit("SET_REGION_LIST", response.data.data);
      // END=> COMMIT with data received'
    });
};

export default {
  IMPLEMENTATION_EXECUTIVE_LIST,
  REGION_LIST
};
