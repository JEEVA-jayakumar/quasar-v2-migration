import api from "../api.js";
// Remove unused Vue import - it's not needed in Vue 3/Vuex 4 for these actions

// All these actions don't use commit, so remove it from destructuring
export const LEAD_INFORMATION_VAS_MAPPING_DERTAILS = (_, request) => {
  return api.post("lead-info-vas-map", request);
};

export const GET_LEAD_INFORMATION_VAS_MAPPING_DERTAILS = (_, request) => {
  return api.get("lead-info-vas-map/" + request.id);
};

export const CREATE_BASE_TID = (_, request) => {
  console.log("CREATE_BASE_TID -------------->", JSON.stringify(request));
  return api.post("mars-device-details/create-base-tid/" + request.leadId + "/" + request.salesInformation.institutionCode);
};

export const GET_BASE_TID_LIST = (_, request) => {
  console.log("GET_BASE_TID_LIST -------->", JSON.stringify(request));
  return api.get("mars-device-details/base-tid-conf-list/" + request.leadId + "/" + request.salesInformation.institutionCode);
};

//new
export const GET_SUB_TID_LIST = (_, request) => {
  return api.get("mars-device-details/sub-tid-list/" + request.leadId);
};
//end

export const LOAD_GET_SUB_TID_LIST = (_, request) => {
  return api.get("mars-device-details/sub-tid-list/" + request.leadId);
};

export const CREATE_SUB_TIDS_LIST = (_, request) => {
  return api.post("mars-device-details/create-sub-tid-list/" + request.leadId + "/" + request.salesInformation.institutionCode);
};

export const SAVEING_THE_LEAD_STATUS_DETAILS = (_, request) => {
  // console.log("SAVEING_THE_LEAD_STATUS_DETAILS -------->",JSON.stringify(request))
  return api.post("mars-device-details/update-lead-status/" + request.leadId + "/" + request.status);
};