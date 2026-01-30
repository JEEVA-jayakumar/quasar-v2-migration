const getregionalInventoryPodDetails = (state) => {
    return state.regionalInventoryPodDetails
  }

  const getsinglePodDetails = (state) => {
    console.log("GETTER====>>>",JSON.stringify(state))
    return state.singlePodData
  }
  const getsparePartsSetsAndCounts = (state) => {
    return state.sparePartsSetsAndCounts
  }


  const getregionalInventoryStocksPodDetails = (state) => {
    return state.regionalInventoryStocksPodDetails
  }

  const getregionalInventoryAllocatedSoPodDetails = (state) => {
    return state.regionalInventoryAllocatedSoPodDetails
  }
  // PhonepeRegionalInventoryAllocatedSoPodDetails

  const getphonepeRegionalInventoryAllocatedSoPodDetails = (state) => {
    return state.PhonepeRegionalInventoryAllocatedSoPodDetails
  }


  // PhonepeRegionalInventoryStocksPodDetails

  const getPhonepeRegionalInventoryStocksPodDetails = (state) => {
    return state.PhonepeRegionalInventoryStocksPodDetails
  }

  // regionalInventoryPhonepeAllocatedSoPodDetails

  const getPhonePeRegionalInventoryAllocatedSoPodDetails = (state) => {
    return state.regionalInventoryPhonepeAllocatedSoPodDetails
  }

  /*PHONEPE GETTER */

  const getPhonepeSparePartsSetsAndCounts = (state) => {
    return state.PhonepeSparePartsSetsAndCounts
  }


export default {
  getPhonePeRegionalInventoryAllocatedSoPodDetails,
  getPhonepeRegionalInventoryStocksPodDetails,
  getPhonepeSparePartsSetsAndCounts,
  getphonepeRegionalInventoryAllocatedSoPodDetails,
  getregionalInventoryAllocatedSoPodDetails,
  getregionalInventoryPodDetails,
  getregionalInventoryStocksPodDetails,
  getsinglePodDetails,
  getsparePartsSetsAndCounts
};
