const API_RESPONSE_LOG = (state, payload) => {
  let statusMessage;
  if (payload.apiStatusCode == 200) {
    statusMessage = "Success";
  } else if (payload.apiStatusCode == 409) {
    statusMessage = "Data confict!";
  } else if (payload.apiStatusCode == 400) {
    statusMessage = "Bad Request! Please try again";
  } else {
    statusMessage = "Oops! Something went wrong, please again";
  }
  state.apiStatusLog = {
    apiStatusCode: payload.apiStatusCode,
    apiStatusMessage: statusMessage,
    apiPending: payload.apiPending,
    apiSuccess: payload.apiSuccess,
    apiFailure: payload.apiFailure,
    apiData: payload.apiData,
  };
};
const SET_LEAD_STATUS_USER_DETAILS = (state, payload) => {
  state.leadStatusUserDetails = payload;
};
const SET_LEAD_STATUS_USER_DETAILS_SO = (state, payload) => {
  state.leadStatusUserDetails_ShortLeads = payload;
};
const SET_LEAD_STATUS_USER_DETAILS_WIP = (state, payload) => {
  state.leadStatusUserDetails_WIP = payload;
};
const SET_LEAD_STATUS_USER_DETAILS_REJECTED = (state, payload) => {
  state.leadStatusUserDetails_Rejected = payload;
};
const SET_LEAD_STATUS_USER_DETAILS_IMPLEMENTATION = (state, payload) => {
  state.leadStatusUserDetails_Implementation = payload;
};
const SET_SALES_MANAGER_LEAD_STATUS_USER_DETAILS = (state, payload) => {
  state.userBasedLeadsData = payload;
};


export default {
  API_RESPONSE_LOG,
  SET_LEAD_STATUS_USER_DETAILS,
  SET_LEAD_STATUS_USER_DETAILS_SO,
  SET_LEAD_STATUS_USER_DETAILS_WIP,
  SET_LEAD_STATUS_USER_DETAILS_REJECTED,
  SET_LEAD_STATUS_USER_DETAILS_IMPLEMENTATION,
  SET_SALES_MANAGER_LEAD_STATUS_USER_DETAILS
};
