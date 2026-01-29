const SET_BANK_LIST = (
  state, payload) => {
  state.getBankList = payload
}

const SET_REGION_LIST = (state, payload) => {
  // console.log('REGION LIST', JSON.stringify(payload))
  state.getRegionList = payload
}

const SET_BATCH_DETAILS = (state, payload) => {
  state.getBatchList = payload
}

const SET_REGION_BASED_QR_ALLOCATED_LIST = (state, payload) => {
  state.regionBasedQrAllocatedList = payload
}
const FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST = (state, payload) => {
  state.regionBasedQrAllocatedApproveList = payload
}
const BATCH_DETAIL_FORM = (
  state, payload) => {
  state.getBatchForm = payload
}
const SET_ACTIVE_BATCH_LIST = (state, payload) => {
  // console.log('REGION LIST', JSON.stringify(payload))
  state.getActiveBatchList = payload
}


export default {
  SET_BANK_LIST,
  SET_REGION_LIST,
  SET_BATCH_DETAILS,
  SET_REGION_BASED_QR_ALLOCATED_LIST,
  FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST,
  BATCH_DETAIL_FORM,
  SET_ACTIVE_BATCH_LIST
};
