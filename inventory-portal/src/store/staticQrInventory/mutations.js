const SET_UNAPPROVED_QR_LIST = (state, payload) => {
  state.pendingQrList = payload
}

const SET_APPROVED_QR_LIST = (state, payload) => {
  state.approvedQrList = payload
}
const SET_UNAPPROVED_QR_LIST_OF_SO = (state, payload) => {
  state.pendingQrListOfSo = payload
}
const SET_APPROVED_QR_LIST_OF_SO = (state, payload) => {
  state.approvedQrListOfSo = payload
}
const SET_REJECTED_QR_LIST_OF_SO = (state, payload) => {
  state.rejectedQrListOfSo = payload
}
const SET_STATIC_QR_REGIONAL_INVENTORY_COUNT = (state, payload) => {
  state.staticQrReginolInventory = payload
}

export default {
  SET_UNAPPROVED_QR_LIST,
  SET_APPROVED_QR_LIST,
  SET_UNAPPROVED_QR_LIST_OF_SO,
  SET_APPROVED_QR_LIST_OF_SO,
  SET_REJECTED_QR_LIST_OF_SO,
  SET_STATIC_QR_REGIONAL_INVENTORY_COUNT
};
