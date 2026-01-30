const getpendingQrList = state => {
  return state.pendingQrList
}
const getApprovedQrList = state => {
  return state.approvedQrList
}
const getpendingQrListOfSo = state => {
  return state.pendingQrListOfSo
}
const getApprovedQrListOfSo = state => {
  return state.approvedQrListOfSo
}
const getRejectedQrListOfSo = state => {
  return state.rejectedQrListOfSo
}
const getStaticQrReginolInventory = state => {
  return state.staticQrReginolInventory
}

export default {
  getpendingQrList,
  getApprovedQrList,
  getpendingQrListOfSo,
  getApprovedQrListOfSo,
  getRejectedQrListOfSo,
  getStaticQrReginolInventory
};
