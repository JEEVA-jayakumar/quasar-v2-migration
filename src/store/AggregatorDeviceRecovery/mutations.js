const SET_AGGREGATOR_DEVICE_RECOVERY_ASSIGNED_LIST = (state, payload) => {
  state.AggregatorDeviceRecoveryAssignedList = payload
}

const SET_AGGREGATOR_DEVICE_RECOVERY_UNASSIGNED_LIST = (state, payload) => {
  state.AggregatorDeviceRecoveryUnassignedList = payload
}


export default {
  SET_AGGREGATOR_DEVICE_RECOVERY_ASSIGNED_LIST,
  SET_AGGREGATOR_DEVICE_RECOVERY_UNASSIGNED_LIST
};
