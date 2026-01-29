import api from "../api.js";
// Removed unused Vue import

const CREATE_LS_VAS_DEVICE_CONFIG = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("ls-vas-mapping", request);
};

const GET_LS_VAS_DEVICE_CONFIG_DETAILS = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("ls-vas-mapping").then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_LS_VAS_DEVICE_CONFIG_DETAILS", response.data.data);
    return response;
  });
};

const GET_LS_AND_DEVICE_BASED_VAS_DETAILS = ({
  commit
}, request) => {
  return api.get("ls-vas-mapping/" + request.leadSource + "/" + request.device).then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_LS_AND_DEVICE_BASED_VAS_DETAILS", response.data.data);
    return response;
  });
};

const UPDATE_LS_VAS_DEVICE_CONFIG_DETAILS = (_, request) => {
  // Changed from _ to _ since commit is not used
  console.log("UPDATE_LS_VAS_DEVICE_CONFIG_DETAILS ------>", JSON.stringify(request));
  return api.put("ls-vas-mapping", request);
};

export default {
  CREATE_LS_VAS_DEVICE_CONFIG,
  GET_LS_VAS_DEVICE_CONFIG_DETAILS,
  GET_LS_AND_DEVICE_BASED_VAS_DETAILS,
  UPDATE_LS_VAS_DEVICE_CONFIG_DETAILS
};
