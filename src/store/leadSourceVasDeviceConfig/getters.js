const getLsVasDeviceDetails = state => {
    console.log("GETTER getLsVasDeviceDetails ----->",JSON.stringify(state.LsVasDeviceDetails))
    return state.LsVasDeviceDetails;
};
const getLsDeviceBasedVasDetails = state => {
    console.log("GETTER LsDeviceBasedVasDetails ----->",JSON.stringify(state.LsDeviceBasedVasDetails))
    return state.LsDeviceBasedVasDetails;
};


export default {
  getLsVasDeviceDetails,
  getLsDeviceBasedVasDetails
};
