const SET_IMPLEMENTATION_QUEUE_ASSIGNED_LIST = (state, payload) => {
  return state.implementationQueueAssignedList = payload
}
const SET_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST = (state, payload) => {
  return state.implementationQueueUnassignedList = payload
}
const SET_IMPLEMENTATION_QUEUE_COURIER_LIST = (state, payload) => {
  return state.implementationQueueCourierList = payload
}
const SET_IMPLEMENTATION_CANCELLED_MERCHANTS = (state, payload) => {
  return state.implementationcancelledMerchants = payload
}



export default {
  SET_IMPLEMENTATION_QUEUE_ASSIGNED_LIST,
  SET_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST,
  SET_IMPLEMENTATION_QUEUE_COURIER_LIST,
  SET_IMPLEMENTATION_CANCELLED_MERCHANTS
};
