import api from "../api.js";
// Removed unused Vue import

const GET_LS_VAS_HOST_INSTANCE_DETAILS = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("ls-host-instance-mapping").then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_LS_VAS_HOST_INSTANCE_DETAILS", response.data.data);
  });
};

const CREATE_LS_VAS_HOST_INSTANCE_DETAILS = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("ls-host-instance-mapping", request);
};

export default {
  GET_LS_VAS_HOST_INSTANCE_DETAILS,
  CREATE_LS_VAS_HOST_INSTANCE_DETAILS
};
