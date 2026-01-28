import api from "../api.js";
// Removed unused Vue import

export const FETCH_QR_LIST = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("qr-information").then(response => {
    commit("SET_ALL_QR_LIST", response.data.data.qrTrackers);
  });
};

export const FETCH_QR_LIST1 = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("qr-information").then(response => {
    commit("SET_ALL_QR_LIST1", response.data.data);
  });
};