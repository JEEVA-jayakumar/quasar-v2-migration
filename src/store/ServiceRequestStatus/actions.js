import api from "../api.js";

// Remove unused 'request' parameter
const FETCH_SERVICE_REQUEST_STATUS_DETAILS = ({commit}) => {
  return api.get("status/getServiceRequestStatus").then(response => {
    console.log(
      "SERVICE REQUEST TYPE===================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      JSON.stringify(response)
    );
    // Actually use the commit function
    commit("SET_SERVICE_REQUEST_STATUS_DETAILS", response.data.data);
    return response;
  });
};

// Remove unused 'commit' parameter
const POST_SERVICE_STATUS_TYPES = (context, request) => {
  console.log("POST_SERVICE_STATUS_TYPES --->", JSON.stringify(request));
  return api.post("status/createServiceRequestStatus", request);
};

// Remove unused 'commit' parameter
const ACTIVE_SERVICE_STATUS_TYPES = (context, request) => {
  console.log("SUBMIT EDIT_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.put("status/updateServiceRequestStatus/" + request.id, request.request);
};

// Remove unused 'commit' parameter
const EDIT_SERVICE_STATUS_TYPES = (context, request) => {
  console.log("SUBMIT SERVICE_STATUS_TYPES request", JSON.stringify(request));
  return api.put("status/updateServiceRequestStatus/" + request.id, request.request);
};

// Remove unused 'commit' parameter
const DELETE_SERVICE_STATUS_TYPES = (context, request) => {
  console.log("SUBMIT SERVICE_STATUS_TYPES request", JSON.stringify(request));
  return api.delete("status/deleteServiceRequestStatus/" + request.id);
};

export default {
  FETCH_SERVICE_REQUEST_STATUS_DETAILS,
  POST_SERVICE_STATUS_TYPES,
  ACTIVE_SERVICE_STATUS_TYPES,
  EDIT_SERVICE_STATUS_TYPES,
  DELETE_SERVICE_STATUS_TYPES
};
