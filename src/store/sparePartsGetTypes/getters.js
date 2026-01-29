const getsparePartsGetTypes= (state) => {
    console.log("GETTER SPARE PARTS: ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.sparePartsGetTypes
  }

  const getallInventorySparePartsGetTypes= (state) => {
    console.log("GETTER allInventorySparePartsGetTypes: ------------ : " +  JSON.stringify(state.allInventorySparePartsGetTypes))
    return state.allInventorySparePartsGetTypes
  }

  /*PHONEPE GETTER */

  const getallPhonepeInventorySparePartsGetTypes= (state) => {
    console.log("GETTER allInventorySparePartsGetTypes: ------------ : " +  JSON.stringify(state.allInventoryPhonepeSparePartsGetTypes))
    return state.allInventoryPhonepeSparePartsGetTypes
  }


export default {
  getallInventorySparePartsGetTypes,
  getallPhonepeInventorySparePartsGetTypes,
  getsparePartsGetTypes
};
