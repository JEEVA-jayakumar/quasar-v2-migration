export const SET_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST = (state, payload) => {
  state.deviceReplacementQueueAssignedList = payload;
};

export const SET_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST = (state, payload) => {
  state.deviceReplacementQueueUnassignedList = payload;
};

export const SET_EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST = (state, payload) => {
  state.equitasOnboardingQueueAssignedList = payload;
};

export const SET_EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST = (state, payload) => {
  state.equitasOnboardingQueueUnAssignedList = payload;
};

export const SET_EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST = (state, payload) => {
  state.equitasOnboardingQueueCompletedList = payload;
};
