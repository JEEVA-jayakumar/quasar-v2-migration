import api from '../api.js';

const FETCH_SPARE_PARTS_GET_TYPES = ({
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

const UPDATE_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT request", JSON.stringify(request))
  return api.post("spare-parts/createType", request)
}

const EDIT_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT EDIT_SPARE_PARTS_TYPES request", JSON.stringify(request))
  return api
    .put("spare-parts/updateType/" + request.id, request)
}

const ACTIVE_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT Active_SPARE_PARTS_TYPES request", JSON.stringify(request))
  return api
    .put("spare-parts/updateType/" + request.id, request)
}

const DELETE_SPARE_PARTS_TYPES = (request) => {
  console.log("SUBMIT DELETE_SPARE_PARTS_TYPES request", JSON.stringify(request))
  return api.delete("spare-parts/deleteType/" + request.id, request);
}

const FETCH_ALL_SPARE_PARTS_INVENTORY_DATAS = ({
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

const FETCH_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS = ({
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

const SPARE_PARTS_ADD_STOCKS = (request) => {
  console.log("SUBMIT request", JSON.stringify(request))
  return api.post("spare-inventory/createInventory", request)
}

/* PHONEPE API START */

const PHONEPE_SPARE_PARTS_ADD_STOCKS = (request) => {
  console.log("SUBMIT request", JSON.stringify(request))
  return api.post("aggregator-spare-parts/agg-createInventory/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]), request)
}

/* PHONEPE API END */

export default {
  FETCH_SPARE_PARTS_GET_TYPES,
  UPDATE_SPARE_PARTS_TYPES,
  EDIT_SPARE_PARTS_TYPES,
  ACTIVE_SPARE_PARTS_TYPES,
  DELETE_SPARE_PARTS_TYPES,
  FETCH_ALL_SPARE_PARTS_INVENTORY_DATAS,
  FETCH_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS,
  SPARE_PARTS_ADD_STOCKS,
  PHONEPE_SPARE_PARTS_ADD_STOCKS
};
