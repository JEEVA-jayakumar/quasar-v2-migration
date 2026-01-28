import api from "../api.js";
// Removed unused Vue import

const FETCH_QR_LIST = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("qr-information").then(response => {
    commit("SET_ALL_QR_LIST", response.data.data.qrTrackers);
  });
};

const FETCH_QR_LIST1 = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("qr-information").then(response => {
    commit("SET_ALL_QR_LIST1", response.data.data);
  });
};

export default {
  FETCH_QR_LIST,
  FETCH_QR_LIST1
};
