export const SET_BIJLIPAY_PENDING_CRM = (state, payload) => {
  state.bijlipayMerchantDetails = payload;
};

export const SET_BIJLIPAY_COMPLETED_DATA = (state, payload) => {
  state.bijlipayCompletedDetails = payload;
};

export const SET_BIJLIPAY_CRM_DATE = (state, payload) => {
  state.bijlipayDate = payload;
};

export const SET_CRM_REMARKS = (state, payload) => {
  state.updateRemarks = payload;
};
