import api from "../api.js";

const REASSIGN_REASON_LIST = ({commit}) => {
  // Removed unused 'request' parameter
  return api
    .get("service-request/reAssignReasonList")
    .then(response => {
      commit("SET_REASSIGN_REASON_LIST", response.data.data);
    });
};

const REASSIGNED_REASON_TYPE_DETAILS = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log('PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE-->', JSON.stringify(request))
  return api
    .post(
      'service-request/assignTicket/' + request.userId + "/2", 
      request.request
    );
};

export default {
  REASSIGN_REASON_LIST,
  REASSIGNED_REASON_TYPE_DETAILS
};
