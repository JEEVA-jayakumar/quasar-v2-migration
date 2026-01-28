const getinventoryStolenData = (state) => {
    console.log("Getter--------------->"+JSON.stringify(state))
    return state.stolenInventory
  } 
  /*Aggregators API */

  const getAggregatorsinventoryStolenData = (state) => {
    console.log("Getter--------------->"+JSON.stringify(state))
    return state.AggregatorsstolenInventory
  }
  /*Aggregators API */


export default {
  getAggregatorsinventoryStolenData,
  getinventoryStolenData
};
