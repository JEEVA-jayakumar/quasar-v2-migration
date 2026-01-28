import api from "../api.js";

const CREATE_AGGREGATORS_DEVICE = (request) => {
  return api.post("aggregator/createAggregatorDevice", request);
};

const GET_CREATED_AGGREGATORS_DEVICE_LIST = ({
  commit
}, request) => {
  return api.get("aggregator/aggregatorDeviceList", request).then(response => {
    commit("SET_CREATED_AGGREGATORS_DEVICE_LIST", response.data.data);
  });
};

// Active Device List GET_ACTIVE_CREATED_DEVICE_LIST

/* START Aggregators Dynamic Code */
// const GET_ACTIVE_CREATED_DEVICE_LIST = ({
//     commit
// }, request) => {
//     return api.get("aggregator/deviceList/"+ request).then(response => {
//         commit("SET_GET_ACTIVE_CREATED_DEVICE_LIST", response.data.data);
//     });
// };
/* END Aggregators Dynamic Code */

/* START Aggregators STATIC Code */
const GET_ACTIVE_CREATED_DEVICE_LIST = ({
  commit
}) => { // Fixed: Added arrow function syntax
  return api.get("aggregator/deviceList/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1])).then(response => {
    commit("SET_GET_ACTIVE_CREATED_DEVICE_LIST", response.data.data);
  });
};
/* END Aggregators STATIC Code */

const EDIT_CREATED_AGGREGATORS_DEVICE_LIST = (request) => {
  return api.put("aggregator/updateAggregatorDevice/" + request.id, request);
};

const DELETE_CREATED_AGGREGATORS_DEVICE_LIST = (request) => {
  return api.delete("aggregator/deleteAggregatorDevice/" + request.id);
};

export default {
  CREATE_AGGREGATORS_DEVICE,
  GET_CREATED_AGGREGATORS_DEVICE_LIST,
  GET_ACTIVE_CREATED_DEVICE_LIST,
  EDIT_CREATED_AGGREGATORS_DEVICE_LIST,
  DELETE_CREATED_AGGREGATORS_DEVICE_LIST
};
