import api from "../api.js";
// Removed unused Vue import

const FETCH_TID = ({
  commit
  // Removed unused rootState parameter
}, request) => {
  return api.get("getTid/" + request)
    .then(response => {
      console.log("data", response);
      
      let tid = [];
      // Removed unused 'key' parameter in map function
      response.data.data.map(function (value) {
        tid.push({
          label: value.tid,
          value: value.tid,
        });
      });
      
      // START=> COMMIT with data received'
      commit("SET_TID", tid);
    });
};

const FETCH_TID_SERIAL_NUMBER = (_, request) => {
  return api.get("getSno/" + request.url.tid);
  // Note: .then() handler was commented out, so just returning the promise
};

const UPDATE_SERIAL_NUMBER = (_, request) => {
  return api.post(
    "updateDeviceSerialNo/" + 
    request.url.tid + 
    "/" + 
    request.url.newSerialNumber
  );
  // Note: .then() handler was commented out, so just returning the promise
};

export default {
  FETCH_TID,
  FETCH_TID_SERIAL_NUMBER,
  UPDATE_SERIAL_NUMBER
};
