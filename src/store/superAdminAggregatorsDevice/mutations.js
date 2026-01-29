const SET_CREATED_AGGREGATORS_DEVICE_LIST = (state, payload) => {
    state.getAggregatorDeviceList = payload;
};

// SET_GET_ACTIVE_CREATED_DEVICE_LIST

const SET_GET_ACTIVE_CREATED_DEVICE_LIST = (state, payload) => {
    state.getActiveAggregatorDeviceList = payload;
};

export default {
  SET_CREATED_AGGREGATORS_DEVICE_LIST,
  SET_GET_ACTIVE_CREATED_DEVICE_LIST
};
