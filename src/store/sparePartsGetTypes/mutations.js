const SET_SPARE_PARTS_GET_TYPES = (state, payload) => {
  console.log("Spare parts Mutations: ------------ : " +  JSON.stringify(payload))
  state.sparePartsGetTypes = payload;
}

const SET_ALL_SPARE_PARTS_INVENTORY_DATAS = (state, payload) => {
  console.log("allInventorySparePartsGetTypes Mutations: ------------ : " +  JSON.stringify(payload))
  state.allInventorySparePartsGetTypes = payload;
}

/*PHONEPE MUTATION */


const SET_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS = (state, payload) => {
  console.log("allInventorySparePartsGetTypes Mutations: ------------ : " +  JSON.stringify(payload))
  state.allInventoryPhonepeSparePartsGetTypes = payload;
}


export default {
  SET_SPARE_PARTS_GET_TYPES,
  SET_ALL_SPARE_PARTS_INVENTORY_DATAS,
  SET_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS
};
