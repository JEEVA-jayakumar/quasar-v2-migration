import api from '../api.js';

export const FETCH_SPARE_PARTS_GET_TYPES = ({
  commit
}, request) => {
  console.log(request)
  return api
    .get("spare-parts/getTypes")
    .then(response => {
      console.log("-------------------/////", response)
      console.log("----1234---------------/////", JSON.stringify(response.data.data))
      commit('SET_SPARE_PARTS_GET_TYPES', response.data.data);
      return response;
    });
}

export const UPDATE_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT request", JSON.stringify(request))
  return api.post("spare-parts/createType", request)
}

export const EDIT_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT EDIT_SPARE_PARTS_TYPES request", JSON.stringify(request))
  return api
    .put("spare-parts/updateType/" + request.id, request)
}

export const ACTIVE_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT Active_SPARE_PARTS_TYPES request", JSON.stringify(request))
  return api
    .put("spare-parts/updateType/" + request.id, request)
}

export const DELETE_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT DELETE_SPARE_PARTS_TYPES request", JSON.stringify(request))
  return api.delete("spare-parts/deleteType/" + request.id, request);
}

export const FETCH_ALL_SPARE_PARTS_INVENTORY_DATAS = ({
  commit
}, request) => {
  console.log(request)
  return api
    .get("spare-inventory/inventory")
    .then(response => {
      console.log("-------------------/////", response)
      console.log("----1234---------------/////", JSON.stringify(response.data.data))
      commit('SET_ALL_SPARE_PARTS_INVENTORY_DATAS', response.data.data);
      return response;
    });
}

/* PHONEPE API START */

export const FETCH_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS = ({
  commit
}, request) => {
  console.log(request)
  return api
    .get("aggregator-spare-parts/agg-inventory/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]))
    .then(response => {
      console.log("-------------------/////", response)
      console.log("----1234---------------/////", JSON.stringify(response.data.data))
      commit('SET_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS', response.data.data);
      return response;
    });
}

/* PHONEPE API END */

export const SPARE_PARTS_ADD_STOCKS = (request) => {
  console.log("SUBMIT request", JSON.stringify(request))
  return api.post("spare-inventory/createInventory", request)
}

/* PHONEPE API START */

export const PHONEPE_SPARE_PARTS_ADD_STOCKS = (request) => {
  console.log("SUBMIT request", JSON.stringify(request))
  return api.post("aggregator-spare-parts/agg-createInventory/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]), request)
}

/* PHONEPE API END */