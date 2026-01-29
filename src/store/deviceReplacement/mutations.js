const SET_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST = (state, payload) => {
  state.deviceReplacementQueueAssignedList = payload;
};

const SET_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST = (state, payload) => {
  state.deviceReplacementQueueUnassignedList = payload;
};

const SET_EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST = (state, payload) => {
  state.equitasOnboardingQueueAssignedList = payload;
};

const SET_EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST = (state, payload) => {
  state.equitasOnboardingQueueUnAssignedList = payload;
};

const SET_EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST = (state, payload) => {
  state.equitasOnboardingQueueCompletedList = payload;
};


export default {
  SET_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST,
  SET_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST,
  SET_EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST,
  SET_EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST,
  SET_EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST
};
