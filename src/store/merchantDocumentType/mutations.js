const SET_MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST = (state, payload) => {
  state.activeMerchantDocumentTypes = payload;
};
const SET_MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST = (state, payload) => {
  state.deActivatedMerchantDocumentTypes = payload;
};


export default {
  SET_MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST,
  SET_MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST
};
