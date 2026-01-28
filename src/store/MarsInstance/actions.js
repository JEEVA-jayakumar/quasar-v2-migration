import api from "../api.js";
// Removed unused Vue import

export const GET_MARS_INSTITUTION_DETAILS = ({
  commit
}) => {
  // Removed unused request parameter
  return api.get("mars-institution").then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_MARS_INSTITUTION_DETAILS", response.data.data);
  });
};

export const ADD_NEW_INSTANCE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("mars-institution", request);
};

export const UPDATE_INSTANCE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("mars-institution/" + request.id, request);
};

export const DELETE_INSTANCE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.delete("mars-institution/" + request);
};