const SET_AGGREGATOR_ALL_INVENTORY_WITH_SO_LIST = (state, payload) => {
  state.AggregatorinventoryWithSo = payload
}

const SET_ALL_INVENTORY_WITH_SO_LIST_BASED_REGION = (state, payload) => {
  state.inventoryWithSobasedonRegion = payload
}


export default {
  SET_AGGREGATOR_ALL_INVENTORY_WITH_SO_LIST,
  SET_ALL_INVENTORY_WITH_SO_LIST_BASED_REGION
};
