const SET_ALL_INVENTORY_WITH_SO_LIST = (
    state, payload) => {
    state.inventoryWithSo = payload
}
const SET_AGGREGATORS_INVENTORY_WITH_SO= (
    state, payload) => {
    state.AggregatorsInventoryWithSo = payload
}
const SET_ALL_INVENTORY_WITH_SO_LIST_BASED_REGION = (
    state, payload) => {
    state.inventoryWithSobasedonRegion = payload
}


export default {
  SET_ALL_INVENTORY_WITH_SO_LIST,
  SET_AGGREGATORS_INVENTORY_WITH_SO,
  SET_ALL_INVENTORY_WITH_SO_LIST_BASED_REGION
};
