import api from "../api.js";

const PLAN_LIST = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("manage/data/plan").then(response => {
    commit("SET_PLAN_LIST", response.data.data);
  });
};

const PLAN_ACTIVE_LIST = ({ commit }, request) => {
  // Note: The request parameter is passed to the API call
  return api.get("manage/data/plan/", request).then(response => {
    commit("SET_PLAN_ACTIVE_LIST", response.data.data);
  });
};

const PLAN_DEACTIVED_LIST = ({ commit }, request) => {
  // Note: The request parameter is passed to the API call
  return api.get("manage/data/plan/0", request).then(response => {
    commit("SET_PLAN_DEACTIVED_LIST", response.data.data);
  });
};

const ADD_NEW_PLAN = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("manage/data/plan", request);
};

const UPDATE_PLAN = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("manage/data/plan/" + request.id, request);
};

const UPDATE_PLAN_AND_SET_ACTIVE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("manage/data/plan/" + request.id + "/1", request);
};

const DELETE_PLAN_AND_SET_ACTIVE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.delete("manage/data/plan/" + request);
};

export default {
  PLAN_LIST,
  PLAN_ACTIVE_LIST,
  PLAN_DEACTIVED_LIST,
  ADD_NEW_PLAN,
  UPDATE_PLAN,
  UPDATE_PLAN_AND_SET_ACTIVE,
  DELETE_PLAN_AND_SET_ACTIVE
};
