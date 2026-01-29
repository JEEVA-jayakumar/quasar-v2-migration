const SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST = (state, payload) => {
    return state.AggregatorDeviceReplacementQueueAssignedList = payload
}
const SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST = (state, payload) => {
    return state.AggregatorDeviceReplacementQueueUnassignedList = payload
}


export default {
  SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST,
  SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST
};
