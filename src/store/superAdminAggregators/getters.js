const getCreatedAggregatorList = state => {
    return state.getAggregatorList;
};

const getActiveCreatedAggregatorList = state => {
    return state.getActiveAggregatorList;
};
const getInventoryWithSOAggregatorList = state => {
    return state.getInventoryWithSoList;
};


export default {
  getCreatedAggregatorList,
  getActiveCreatedAggregatorList,
  getInventoryWithSOAggregatorList
};
