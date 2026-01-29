import api from "../api.js";
// Removed unused Vue import

const GET_MARS_INSTITUTION_DETAILS = ({
  commit
}) => {
  // Removed unused request parameter
  return api.get("mars-institution").then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_MARS_INSTITUTION_DETAILS", response.data.data);
  });
};

const ADD_NEW_INSTANCE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("mars-institution", request);
};

const UPDATE_INSTANCE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("mars-institution/" + request.id, request);
};

const DELETE_INSTANCE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.delete("mars-institution/" + request);
};

export default {
  GET_MARS_INSTITUTION_DETAILS,
  ADD_NEW_INSTANCE,
  UPDATE_INSTANCE,
  DELETE_INSTANCE
};
