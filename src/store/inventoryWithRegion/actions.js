import api from '../api.js';

const FETCH_INVENTORY_WITH_REGION_DATAS = ({
  commit
}, request) => {
  return api
    .get("device-list-based-on-regional-device" + "/" + request.regionId + "/4")
    .then(response => {
      // START=> COMMIT with data received'
      commit('SET_INVENTORY_WITH_REGION_DATAS', response.data.data);
      // END=> COMMIT with data received'
    });
};

/* AGGREGATOR API */

const FETCH_AGGREGATORS_INVENTORY_WITH_REGION_DATAS = ({
  commit
}, request) => {
  console.log("FETCH_AGGREGATORS_INVENTORY_WITH_REGION_DATAS ---->", JSON.stringify(request));
  return api
    .get("aggregator-inventory/agg-device-list-based-on-regional-device" + "/" + request.regionId + "/4" + "/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]))
    .then(response => {
      // START=> COMMIT with data received'
      commit('SET_AGGREGATORS_INVENTORY_WITH_REGION_DATAS', response.data.data);
      // END=> COMMIT with data received'
    });
};

/* AGGREGATOR API */

const EDIT_INVENTORY_WITH_REGION_DETAILS = (_, request) => {
  return api.put("update-regional-inventory/4", request.request);
};

/*AGGREGATORS API */
const EDIT_AGGREGATORS_INVENTORY_WITH_REGION_DETAILS = (_, request) => {
  return api.put("aggregator-inventory/agg-update-regional-inventory/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) + "/4", request.request);
};
/*AGGREGATORS API */

export default {
  FETCH_INVENTORY_WITH_REGION_DATAS,
  FETCH_AGGREGATORS_INVENTORY_WITH_REGION_DATAS,
  EDIT_INVENTORY_WITH_REGION_DETAILS,
  EDIT_AGGREGATORS_INVENTORY_WITH_REGION_DETAILS
};
