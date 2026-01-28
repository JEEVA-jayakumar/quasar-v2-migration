const SET_BIJLIPAY_PENDING_CRM = (state, payload) => {
  state.bijlipayMerchantDetails = payload;
};

const SET_BIJLIPAY_COMPLETED_DATA = (state, payload) => {
  state.bijlipayCompletedDetails = payload;
};

const SET_BIJLIPAY_CRM_DATE = (state, payload) => {
  state.bijlipayDate = payload;
};

const SET_CRM_REMARKS = (state, payload) => {
  state.updateRemarks = payload;
};


export default {
  SET_BIJLIPAY_PENDING_CRM,
  SET_BIJLIPAY_COMPLETED_DATA,
  SET_BIJLIPAY_CRM_DATE,
  SET_CRM_REMARKS
};
