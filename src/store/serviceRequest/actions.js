import api from '../api.js';

const FETCH_ALL_SERVICE_REQUEST_GET_TYPES = ({ commit }, request) => {
  console.log(request);
  return api
    .get("service-req-type/getServiceRequestTypes")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_SERVICE_REQUEST_GET_TYPES', response.data.data);
      console.log("----1234---------------/////", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_ACTIVE_ISSUE_MAPPING = ({ commit }, request) => {
  console.log(request);
  return api
    .get("internal/getIssue/1")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_ACTIVE_ISSUE_MAPPING', response.data.data);
      console.log("SET_ACTIVE_ISSUE_MAPPING", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_DEACTIVE_ISSUE_MAPPING = ({ commit }, request) => {
  console.log(request);
  return api
    .get("internal/getIssue/0")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_DEACTIVE_ISSUE_MAPPING', response.data.data);
      console.log("SET_DEACTIVE_ISSUE_MAPPING", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_ALL_CS_SUB_ISSUE = ({ commit }, request) => {
  console.log(request);
  return api
    .get("service-req-type/getServiceRequestTypes")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_CS_SUB_ISSUE', response.data.data);
      console.log("----1234---------------/////", JSON.stringify(response.data.data));
      return response;
    });
};

const UPDATE_SERVICE_REQUEST_TYPES = (context, request) => {
  console.log("SUBMIT request", JSON.stringify(request));
  return api.post("service-req-type/createServiceRequestType", request);
};

const UPDATE_ISSUE_MAPPING = (context, request) => {
  console.log("SUBMIT request", JSON.stringify(request));
  return api.post("internal/createIssue", request);
};

const EDIT_SERVICE_REQUEST_TYPES = (context, request) => {
  console.log("SUBMIT EDIT_SERVICE_REQUEST_TYPES", JSON.stringify(request));
  return api.put("service-req-type/updateServiceRequestType/" + request.id, request.request);
};

const EDIT_ISSUE_MAPPING = (context, request) => {
  console.log("SUBMIT EDIT_ISSUE_MAPPING", JSON.stringify(request));
  return api.put("internal/updateIssue/" + request.id, request.request);
};

const ACTIVE_SERVICE_ISSUE_TYPES = (context, request) => {
  console.log("SUBMIT ACTIVE_SERVICE_ISSUE_TYPES", JSON.stringify(request));
  return api.put("service-req-type/updateServiceRequestIssueType/" + request.id, request.request);
};

const ACTIVE_SERVICE_RESOLUTION_REMARKS = (context, request) => {
  console.log("SUBMIT ACTIVE_SERVICE_RESOLUTION_REMARKS", JSON.stringify(request));
  return api.put("internal/updateServiceResolution/" + request.id, request.request);
};

const ACTIVE_CS_SUB_ISSUE = (context, request) => {
  console.log("SUBMIT ACTIVE_CS_SUB_ISSUE", JSON.stringify(request));
  return api.put("internal/updateSubIssue/" + request.id, request.request);
};

const ACTIVE_ISSUE_MAPPING = (context, request) => {
  console.log("SUBMIT ACTIVE_CS_SUB_ISSUE", JSON.stringify(request));
  return api.put("internal/updateIssue/" + request.id, request.request);
};

const DELETE_SERVICE_REQUEST_TYPES = (context, request) => {
  console.log("SUBMIT DELETE_SERVICE_REQUEST_TYPES", JSON.stringify(request));
  return api.delete("service-req-type/deleteServiceRequestType/" + request.serviceReqType.id);
};

const DELETE_ISSUE_MAPPING = (context, request) => {
  console.log("SUBMIT DELETE_ISSUE_MAPPING", JSON.stringify(request));
  return api.delete("internal/deleteIssue/" + request.id);
};

const FETCH_SUB_TASK_DATAS = ({ commit }, request) => {
  console.log(request);
  return api
    .get("service-req-type/getServiceRequestIssueTypes")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_SUB_TASK_DATAS', response.data.data);
      console.log("----1234---------------/////", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_ACTIVE_SERVICE_RESOLUTION_DATAS = ({ commit }, request) => {
  console.log(request);
  return api
    .get("internal/getServiceResolution/1")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_ACTIVE_SERVICE_RESOLUTION_DATAS', response.data.data);
      console.log("SET_ACTIVE_SERVICE_RESOLUTION_DATAS", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_DEACTIVE_SERVICE_RESOLUTION_DATAS = ({ commit }, request) => {
  console.log(request);
  return api
    .get("internal/getServiceResolution/0")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_DEACTIVE_SERVICE_RESOLUTION_DATAS', response.data.data);
      console.log("SET_DEACTIVE_SERVICE_RESOLUTION_DATAS", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_ACTIVE_CS_SUB_ISSUE_DATAS = ({ commit }, request) => {
  console.log(request);
  return api
    .get("internal/getSubIssue/1")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_ACTIVE_CS_SUB_ISSUE_DATAS', response.data.data);
      console.log("SET_ACTIVE_CS_SUB_ISSUE_DATAS", JSON.stringify(response.data.data));
      return response;
    });
};

const FETCH_DEACTIVE_CS_SUB_ISSUE_DATAS = ({ commit }, request) => {
  console.log(request);
  return api
    .get("internal/getSubIssue/0")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_DEACTIVE_CS_SUB_ISSUE_DATAS', response.data.data);
      console.log("SET_DEACTIVE_CS_SUB_ISSUE_DATAS", JSON.stringify(response.data.data));
      return response;
    });
};

const GET_SERVICE_ISSUE_TYPES = ({ commit }, request) => {
  console.log(request);
  return api
    .get("service-req-type/getServiceRequestIssueTypes")
    .then(response => {
      console.log("-------------------/////", response);
      commit('SET_GET_SERVICE_ISSUE_TYPES', response.data.data);
      console.log("----1234---------------/////", JSON.stringify(response.data.data));
      return response;
    });
};

const POST_SUB_TASK_TYPES = (context, request) => {
  return api.post("service-req-type/createServiceRequestIssueType", request);
};

const POST_SERVICE_RESOLUTION_REMARKS = (context, request) => {
  return api.post("internal/createServiceResolution", request);
};

const POST_CS_SUB_ISSUE = (context, request) => {
  return api.post("internal/createSubIssue", request);
};

const EDIT_SUB_TASK_TYPES = (context, request) => {
  console.log("SUBMIT EDIT_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.put("service-req-type/updateServiceRequestIssueType/" + request.id, request.request);
};

const EDIT_SERVICE_RESOLUTION_REMARKS = (context, request) => {
  console.log("SUBMIT EDIT_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.put("internal/updateServiceResolution/" + request.id, request.request);
};

const EDIT_CS_SUB_ISSUE = (context, request) => {
  console.log("SUBMIT EDIT_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.put("internal/updateSubIssue/" + request.id, request.request);
};

const DELETE_SUB_TASK_TYPES = (context, request) => {
  console.log("SUBMIT DELETE_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.delete("service-req-type/deleteServiceRequestIssueType/" + request.id);
};

const DELETE_SERVICE_RESOLUTION_REMARKS = (context, request) => {
  console.log("SUBMIT DELETE_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.delete("internal/deleteServiceResolution/" + request.id);
};

const DELETE_CS_SUB_ISSUE = (context, request) => {
  console.log("SUBMIT DELETE_SPARE_PARTS_TYPES request", JSON.stringify(request));
  return api.delete("internal/deleteSubIssue/" + request.id);
};

export default {
  FETCH_ALL_SERVICE_REQUEST_GET_TYPES,
  FETCH_ACTIVE_ISSUE_MAPPING,
  FETCH_DEACTIVE_ISSUE_MAPPING,
  FETCH_ALL_CS_SUB_ISSUE,
  UPDATE_SERVICE_REQUEST_TYPES,
  UPDATE_ISSUE_MAPPING,
  EDIT_SERVICE_REQUEST_TYPES,
  EDIT_ISSUE_MAPPING,
  ACTIVE_SERVICE_ISSUE_TYPES,
  ACTIVE_SERVICE_RESOLUTION_REMARKS,
  ACTIVE_CS_SUB_ISSUE,
  ACTIVE_ISSUE_MAPPING,
  DELETE_SERVICE_REQUEST_TYPES,
  DELETE_ISSUE_MAPPING,
  FETCH_SUB_TASK_DATAS,
  FETCH_ACTIVE_SERVICE_RESOLUTION_DATAS,
  FETCH_DEACTIVE_SERVICE_RESOLUTION_DATAS,
  FETCH_ACTIVE_CS_SUB_ISSUE_DATAS,
  FETCH_DEACTIVE_CS_SUB_ISSUE_DATAS,
  GET_SERVICE_ISSUE_TYPES,
  POST_SUB_TASK_TYPES,
  POST_SERVICE_RESOLUTION_REMARKS,
  POST_CS_SUB_ISSUE,
  EDIT_SUB_TASK_TYPES,
  EDIT_SERVICE_RESOLUTION_REMARKS,
  EDIT_CS_SUB_ISSUE,
  DELETE_SUB_TASK_TYPES,
  DELETE_SERVICE_RESOLUTION_REMARKS,
  DELETE_CS_SUB_ISSUE
};
