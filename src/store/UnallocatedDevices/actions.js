import api from "../api.js";
const UNALLOCATED_DEVICE_LIST =({
    commit
  }) => {
    return api.get("getUnAllocatedDevicesRegion").then(response => {
      console.log(response)
      // START=> COMMIT with data received'
      commit("SET_UNALLOCATED_DEVICE_LIST", response.data.data);
      // END=> COMMIT with data received'
    });
    
  };

export default {
  UNALLOCATED_DEVICE_LIST
};
