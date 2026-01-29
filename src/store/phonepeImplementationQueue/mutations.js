const SET_PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST = (state, payload) => {
    return state.phonepeimplementationQueueUnassignedList = payload
  }

  const SET_PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST = (state, payload) => {
    return state.phonepeimplementationQueueassignedList = payload
  }

  const SET_PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST = (state, payload) => {
    return state.phonepeimplementationQueueCourierList = payload
  }

  const SET_PHONEPE_CANCELLED_MERCHANTS = (state, payload) => {
    return state.phonepecancelledMerchants = payload
  }

export default {
  SET_PHONEPE_CANCELLED_MERCHANTS,
  SET_PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST,
  SET_PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST,
  SET_PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST
};
