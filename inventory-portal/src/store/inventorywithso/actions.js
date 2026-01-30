import api from "../api.js";

const FETCH_INVENTORY_WITH_SO = ({commit}) => {
    return api.get("allsoinventorydetails").then(response => {
        commit("SET_ALL_INVENTORY_WITH_SO_LIST", response.data.data);
    });
};

/*Aggregators API */

const FETCH_AGGREGATORS_INVENTORY_WITH_SO = ({commit}) => {
    return api.get("aggregator-inventory/agg-all-so-inventory-details/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1])).then(response => {
        commit("SET_AGGREGATORS_INVENTORY_WITH_SO", response.data.data);
    });
};

/*Aggregators API */
const FETCH_INVENTORY_WITH_SO_BASED_ON_REGION = ({ commit }, request) => {
    console.log("RESPONSE DATAS--------------->" + request);
    return api.get("allsoinventorydetails/" + request).then(response => {
        commit("SET_ALL_INVENTORY_WITH_SO_LIST_BASED_REGION", response.data.data);
    });
};

export default {
  FETCH_INVENTORY_WITH_SO,
  FETCH_AGGREGATORS_INVENTORY_WITH_SO,
  FETCH_INVENTORY_WITH_SO_BASED_ON_REGION
};
