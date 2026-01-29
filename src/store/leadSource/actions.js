import api from "../api.js";

const LEAD_SOURCE_ACTIVE_LIST = ({ commit }, request) => {
  return api.get("manage/data/leadsource/", request).then(response => {
    commit("SET_LEAD_SOURCE_ACTIVE_LIST", response.data.data);
  });
};

const LEAD_SOURCE_DEACTIVED_LIST = ({ commit }, request) => {
  return api.get("manage/data/leadsource/0", request).then(response => {
    commit("SET_LEAD_SOURCE_DEACTIVED_LIST", response.data.data);
  });
};

// These actions don't use commit, so remove the destructuring
const ADD_NEW_LEAD_SOURCE = (_, request) => {
  return api.post("manage/data/leadsource", request);
};

const UPDATE_LEAD_SOURCE = (_, request) => {
  return api.put("manage/data/leadsource/" + request.id, request);
};

const UPDATE_LEAD_SOURCE_AND_SET_ACTIVE = (_, request) => {
  return api.put("manage/data/leadsource/" + request.id + "/1", request);
};

const DELETE_LEAD_SOURCE_AND_SET_ACTIVE = (_, request) => {
  return api.delete("manage/data/leadsource/" + request);
};

export default {
  LEAD_SOURCE_ACTIVE_LIST,
  LEAD_SOURCE_DEACTIVED_LIST,
  ADD_NEW_LEAD_SOURCE,
  UPDATE_LEAD_SOURCE,
  UPDATE_LEAD_SOURCE_AND_SET_ACTIVE,
  DELETE_LEAD_SOURCE_AND_SET_ACTIVE
};
