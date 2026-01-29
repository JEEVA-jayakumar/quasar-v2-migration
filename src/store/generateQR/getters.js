function getAllBankList (state) {
  return state.getBankList
}
function getAllRegionList (state) {
  // console.log('LISTED', JSON.stringify(state.getRegionList))
  return state.getRegionList
}
const getAllBatchList = state => {
  return state.getBatchList
}
function getAllBatchForm (state) {
  return state.getBatchForm
}
function getAllActiveBatchList (state) {
  return state.getActiveBatchList
}
function getAllRegionBasedQrAllocatedList (state) {
  console.log('CHECK getter', JSON.stringify(state.regionBasedQrAllocatedList))
  return state.regionBasedQrAllocatedList
}
function getAllRegionBasedQrAllocatedApproveList (state) {
  console.log('CHECK getter', JSON.stringify(state.regionBasedQrAllocatedApproveList))
  return state.regionBasedQrAllocatedApproveList
}


export default {
  getAllBankList,
  getAllRegionList,
  getAllBatchList,
  getAllBatchForm,
  getAllActiveBatchList,
  getAllRegionBasedQrAllocatedList,
  getAllRegionBasedQrAllocatedApproveList
};
