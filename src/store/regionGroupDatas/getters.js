const getAllRegionGroupData = (state) => {
    console.log("getAllRegionGroupData--->",JSON.stringify(state.regionsGroupData))
    return state.regionsGroupData
  }


export default {
  getAllRegionGroupData
};
