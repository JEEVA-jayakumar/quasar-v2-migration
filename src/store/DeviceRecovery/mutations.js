const SET_DEVICE_RECOVERY_ASSIGNED_LIST = (state, payload) => {
  state.deviceRecoveryAssignedList = payload;
};

const SET_DEVICE_RECOVERY_UNASSIGNED_LIST = (state, payload) => {
  state.deviceRecoveryUnassignedList = payload;
};


export default {
  SET_DEVICE_RECOVERY_ASSIGNED_LIST,
  SET_DEVICE_RECOVERY_UNASSIGNED_LIST
};
