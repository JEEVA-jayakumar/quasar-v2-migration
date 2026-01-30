const getinventoryWithRegion = (state) => {
    console.log("getinventoryWithRegion : ------------ : " +  JSON.stringify(state.inventoryWithRegionData))
    return state.inventoryWithRegionData
  }
const getAggregatorsInventoryWithRegion = (state) => {
    console.log("getinventoryWithRegion : ------------ : " +  JSON.stringify(state.inventoryWithRegionData))
    return state.aggregatorInventoryWithRegionData
  }


export default {
  getinventoryWithRegion,
  getAggregatorsInventoryWithRegion
};
