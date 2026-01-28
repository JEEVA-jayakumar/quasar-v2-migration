import api from "../api.js";

const MERCHANT_CATEGORY_LIST = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("manage/data/merchant-category").then(response => {
    commit("SET_MERCHANT_CATEGORY_LIST", response.data.data);
  });
};

const MERCHANT_CATEGORY_ACTIVE_LIST = ({ commit }, request) => {
  return api.get("manage/data/merchant-category/", request).then(response => {
    commit("SET_MERCHANT_CATEGORY_ACTIVE_LIST", response.data.data);
  });
};

const MERCHANT_CATEGORY_DEACTIVED_LIST = ({ commit }, request) => {
  return api.get("manage/data/merchant-category/0", request).then(response => {
    commit("SET_MERCHANT_CATEGORY_DEACTIVED_LIST", response.data.data);
  });
};

const ADD_NEW_MERCHANT_CATEGORY = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("manage/data/merchant-category/", request);
};

const UPDATE_MERCHANT_CATEGORY = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("manage/data/merchant-category/" + request.id, request);
};

const UPDATE_MERCHANT_CATEGORY_AND_SET_ACTIVE = (
  _,
  request
) => {
  // Changed from _ to _ since commit is not used
  return api.put("manage/data/merchant-category/" + request.id + "/1", request);
};

const DELETE_MERCHANT_CATEGORY_AND_SET_ACTIVE = (
  _,
  request
) => {
  // Changed from _ to _ since commit is not used
  return api.delete("manage/data/merchant-category/" + request);
};

export default {
  MERCHANT_CATEGORY_LIST,
  MERCHANT_CATEGORY_ACTIVE_LIST,
  MERCHANT_CATEGORY_DEACTIVED_LIST,
  ADD_NEW_MERCHANT_CATEGORY,
  UPDATE_MERCHANT_CATEGORY,
  UPDATE_MERCHANT_CATEGORY_AND_SET_ACTIVE,
  DELETE_MERCHANT_CATEGORY_AND_SET_ACTIVE
};
