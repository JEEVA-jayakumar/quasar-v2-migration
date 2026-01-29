const SET_GET_CREATED_AGGREGATORS_LIST = (state, payload) => {
    state.getAggregatorList = payload;
};

// SET_GET_ACTIVE_CREATED_AGGREGATORS_LIST

const SET_GET_ACTIVE_CREATED_AGGREGATORS_LIST = (state, payload) => {
    state.getActiveAggregatorList = payload;
};
const SET_AGGREGATOR_INVENTORY_WITH_SO_LIST = (state, payload) => {
    state.getInventoryWithSoList = payload;
};


export default {
  SET_GET_CREATED_AGGREGATORS_LIST,
  SET_GET_ACTIVE_CREATED_AGGREGATORS_LIST,
  SET_AGGREGATOR_INVENTORY_WITH_SO_LIST
};
