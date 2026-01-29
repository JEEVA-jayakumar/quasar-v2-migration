const SET_LS_VAS_DEVICE_CONFIG_DETAILS = (state, payload) => {
    console.log("SET_LS_VAS_DEVICE_CONFIG_DETAILS ----->",JSON.stringify(payload))
    state.LsVasDeviceDetails = payload;
};

const SET_LS_AND_DEVICE_BASED_VAS_DETAILS = (state, payload) => {
    console.log("SET_LS_AND_DEVICE_BASED_VAS_DETAILS ----->",JSON.stringify(payload))
    state.LsDeviceBasedVasDetails = payload;
};


export default {
  SET_LS_VAS_DEVICE_CONFIG_DETAILS,
  SET_LS_AND_DEVICE_BASED_VAS_DETAILS
};
