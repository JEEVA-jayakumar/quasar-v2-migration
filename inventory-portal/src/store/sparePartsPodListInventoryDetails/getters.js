const getsparePartsPodListDetails = (state) => {
  console.log(
    "getsparePartsPodListDetails---------------->" + JSON.stringify(state.sparePartsPodListDetails)
  );
    return state.sparePartsPodListDetails
  }

  const getPhonepesparePartsPodListDetails = (state) => {
    console.log(
      "Check API LISTS getPhonepesparePartsPodListDetails---------------->" + JSON.stringify(state.phonepeSparePartsPodListDetails)
    );
    return state.phonepeSparePartsPodListDetails
  }


export default {
  getPhonepesparePartsPodListDetails,
  getsparePartsPodListDetails
};
