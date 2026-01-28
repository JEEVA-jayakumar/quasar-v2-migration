const getDeviceReplacementQueueAssignedList = (state) =>
  state.deviceReplacementQueueAssignedList;

const getDeviceReplacementQueueUnassignedList = (state) =>
  state.deviceReplacementQueueUnassignedList;

const getEquitasQueueAssignedList = (state) =>
  state.equitasOnboardingQueueAssignedList;

const getEquitasQueueUnAssignedList = (state) =>
  state.equitasOnboardingQueueUnAssignedList;

const getEquitasQueueCompletedList = (state) =>
  state.equitasOnboardingQueueCompletedList;


export default {
  getDeviceReplacementQueueAssignedList,
  getDeviceReplacementQueueUnassignedList,
  getEquitasQueueAssignedList,
  getEquitasQueueUnAssignedList,
  getEquitasQueueCompletedList
};
