import api from "../api.js";

const MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST = ({ commit }, request) => {
  return api
    .get(
      "manage/data/merchant-document-types/?merchantTypeId=" +
        request.merchantTypeId +
        "&parentId=" +
        request.parentId,
      request
    )
    .then(response => {
      commit("SET_MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST", response.data.data);
    });
};

const MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST = ({ commit }, request) => {
  return api
    .get(
      "manage/data/merchant-document-types/0?merchantTypeId=" +
        request.merchantTypeId +
        "&parentId=" +
        request.parentId,
      request
    )
    .then(response => {
      commit("SET_MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST", response.data.data);
    });
};

const ADD_NEW_MERCHANT_DOCUMENT_TYPE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post(
    "manage/data/merchant-document-types/?merchantTypeId=" +
      request.url.merchantType +
      "&hasSubDoc=" +
      request.url.hasSubDoc,
    request.params
  );
};

const UPDATE_MERCHANT_DOCUMENT_TYPE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put(
    "manage/data/merchant-document-types/" +
      request.url.id +
      "?merchantTypeId=" +
      request.url.merchantType +
      "&parentId=" +
      request.params.parentId +
      "&hasSubDoc=" +
      request.url.hasSubDoc,
    request.params
  );
};

//1 => value to enable
const UPDATE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE = (
  _,
  request
) => {
  // Changed from _ to _ since commit is not used
  return api.put(
    "manage/data/merchant-document-types/" +
      request.id +
      "/1?merchantTypeId=" +
      request.merchantType +
      "&parentId=" +
      request.parentId +
      "&hasSubDoc=" +
      request.hasSubDoc,
    request.params
  );
};

const DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE = (
  _,
  request
) => {
  // Changed from _ to _ since commit is not used
  return api.delete("manage/data/merchant-document-types/" + request);
};

export default {
  MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST,
  MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST,
  ADD_NEW_MERCHANT_DOCUMENT_TYPE,
  UPDATE_MERCHANT_DOCUMENT_TYPE,
  UPDATE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE,
  DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE
};
