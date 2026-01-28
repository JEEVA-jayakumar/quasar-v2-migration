import api from "../api.js";
// Remove unused Vue import - it's not needed in Vue 3/Vuex 4 for these actions

// All these actions don't use commit, so remove it from destructuring
const LEAD_INFORMATION_VAS_MAPPING_DERTAILS = (_, request) => {
  return api.post("lead-info-vas-map", request);
};

const GET_LEAD_INFORMATION_VAS_MAPPING_DERTAILS = (_, request) => {
  return api.get("lead-info-vas-map/" + request.id);
};

const CREATE_BASE_TID = (_, request) => {
  console.log("CREATE_BASE_TID -------------->", JSON.stringify(request));
  return api.post("mars-device-details/create-base-tid/" + request.leadId + "/" + request.salesInformation.institutionCode);
};

const GET_BASE_TID_LIST = (_, request) => {
  console.log("GET_BASE_TID_LIST -------->", JSON.stringify(request));
  return api.get("mars-device-details/base-tid-conf-list/" + request.leadId + "/" + request.salesInformation.institutionCode);
};

//new
const GET_SUB_TID_LIST = (_, request) => {
  return api.get("mars-device-details/sub-tid-list/" + request.leadId);
};
//end

const LOAD_GET_SUB_TID_LIST = (_, request) => {
  return api.get("mars-device-details/sub-tid-list/" + request.leadId);
};

const CREATE_SUB_TIDS_LIST = (_, request) => {
  return api.post("mars-device-details/create-sub-tid-list/" + request.leadId + "/" + request.salesInformation.institutionCode);
};

const SAVEING_THE_LEAD_STATUS_DETAILS = (_, request) => {
  // console.log("SAVEING_THE_LEAD_STATUS_DETAILS -------->",JSON.stringify(request))
  return api.post("mars-device-details/update-lead-status/" + request.leadId + "/" + request.status);
};

export default {
  LEAD_INFORMATION_VAS_MAPPING_DERTAILS,
  GET_LEAD_INFORMATION_VAS_MAPPING_DERTAILS,
  CREATE_BASE_TID,
  GET_BASE_TID_LIST,
  GET_SUB_TID_LIST,
  LOAD_GET_SUB_TID_LIST,
  CREATE_SUB_TIDS_LIST,
  SAVEING_THE_LEAD_STATUS_DETAILS
};
