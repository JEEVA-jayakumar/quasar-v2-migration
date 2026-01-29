const getDeviceRecoveryAssignedList = (state) => {
  return state.deviceRecoveryAssignedList;
};

const getDeviceRecoveryUnassignedList = (state) => {
  return state.deviceRecoveryUnassignedList;
};


export default {
  getDeviceRecoveryAssignedList,
  getDeviceRecoveryUnassignedList
};
