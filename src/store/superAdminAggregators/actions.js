import api from "../api.js";

export const CREATE_AGGREGATORS = (request) => {
  return api.post("aggregator/createAggregator", request);
};

export const GET_CREATED_AGGREGATORS_LIST = ({
  commit
}, request) => {
  return api.get("aggregator/aggregatorList/0", request).then(response => {
    commit("SET_GET_CREATED_AGGREGATORS_LIST", response.data.data);
  });
};

// ACTIVE AGGREGATORY LIST 

export const GET_ACTIVE_CREATED_AGGREGATORS_LIST = ({
  commit
}, request) => {
  return api.get("aggregator/aggregatorList/1", request).then(response => {
    console.log("RSEPONSE MENU LIST", JSON.stringify(response));
    commit("SET_GET_ACTIVE_CREATED_AGGREGATORS_LIST", response.data.data);
  });
};

export const EDIT_CREATED_AGGREGATORS = (request) => {
  return api.put("aggregator/updateAggregator/" + request.id, request);
};

export const DELETE_CREATED_AGGREGATORS = (request) => {
  return api.delete("aggregator/deleteAggregator/" + request.id);
}

export const FETCH_AGGREGATOR_INVENTORY_WITH_SO_LIST = ({
  commit
}) => { // Removed unused request parameter
  return api.get("aggregator-inventory/agg-all-so-inventory-details/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1])).then(response => {
    commit("SET_AGGREGATOR_INVENTORY_WITH_SO_LIST", response.data.data);
  });
};