import api from "../api.js";

export const FETCH_ALL_PINCODES = ({ commit }, request) => {
  if (request == undefined) {
    return api
      .get("user/state-pincode")
      .then(response => {
        commit("SET_PINCODES_DATA", response.data.data);
      });
  } else {
    return api
      .get("user/state-pincode/" + request)
      .then(response => {
        commit("SET_PINCODES_DATA", response.data.data);
      });
  }
};

export const ADD_NEW_PINCODE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("user/state-pincode", request);
};

export const EDIT_NEW_PINCODE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("user/state-pincode/" + request.id, request);
};