const SET_INVENTORY_STOLEN_DATA= (state, payload) => {
    console.log("Inventory Lost or Stolen Data Payload : ------------ : " +  JSON.stringify(payload))
    state.stolenInventory = payload;
  }
  /*Aggregators API */
  const SET_AGGREGATORS_INVENTORY_STOLEN_DATA= (state, payload) => {
    console.log("Inventory Lost or Stolen Data Payload : ------------ : " +  JSON.stringify(payload))
    state.AggregatorsstolenInventory = payload;
  }


export default {
  SET_AGGREGATORS_INVENTORY_STOLEN_DATA,
  SET_INVENTORY_STOLEN_DATA
};
