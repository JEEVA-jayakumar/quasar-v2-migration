const SET_ALL_QR_PAYMENT_TRACKER_DATA = (state, payload) => {
    state.staticQrPaymentTrackerData = payload
  }
  
  const SET_ALL_APPROVED_QR_FINANCE_DATA = (state, payload) => {
    state.staticQrApprovedTrackerData = payload
  }

export default {
  SET_ALL_APPROVED_QR_FINANCE_DATA,
  SET_ALL_QR_PAYMENT_TRACKER_DATA
};
