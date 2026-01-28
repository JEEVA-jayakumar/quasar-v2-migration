const getCreatedAggregatorDeviceList = state => {
    return state.getAggregatorDeviceList;
};

const getCreatedActiveDeviceList = state => {
    return state.getActiveAggregatorDeviceList;
};


export default {
  getCreatedAggregatorDeviceList,
  getCreatedActiveDeviceList
};
