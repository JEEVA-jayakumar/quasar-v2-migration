import api from "../api.js";

export const MERCHANT_TYPE_ACTIVE_LIST = ({
  commit
}, request) => {
  // return api.get("manage/data/merchant-category/", request).then(response => {
  return api.get("manage/data/merchant-types/", request).then(response => {
    commit("SET_MERCHANT_TYPE_ACTIVE_LIST", response.data.data);
  });
};

export const MERCHANT_TYPE_DEACTIVED_LIST = ({
  commit
}, request) => {
  return api.get("manage/data/merchant-types/0", request).then(response => {
    commit("SET_MERCHANT_TYPE_DEACTIVED_LIST", response.data.data);
  });
};

export const ADD_NEW_MERCHANT_TYPE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("manage/data/merchant-types/", request);
};

export const UPDATE_MERCHANT_TYPE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("manage/data/merchant-types/" + request.id, request);
};

export const UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("manage/data/merchant-types/" + request.id + "/1", request);
};

export const DELETE_MERCHANT_TYPE_AND_SET_ACTIVE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.delete("manage/data/merchant-types/" + request);
};