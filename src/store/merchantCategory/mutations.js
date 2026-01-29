const SET_MERCHANT_CATEGORY_ACTIVE_LIST = (state, payload) => {
  state.activeMerchantCategory = payload;
};
const SET_MERCHANT_CATEGORY_DEACTIVED_LIST = (state, payload) => {
  state.deActivatedMerchantCategory = payload;
};


export default {
  SET_MERCHANT_CATEGORY_ACTIVE_LIST,
  SET_MERCHANT_CATEGORY_DEACTIVED_LIST
};
