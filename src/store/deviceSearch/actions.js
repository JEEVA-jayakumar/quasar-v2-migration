import api from "../api.js";

export const FETCH_ALL_SERIAL_NUMBER = async ({ commit }, request) => {
  const response = await api.get(
    `search-device-by-mid-tid-mobile?serialNumber=${request}`
  );

  const merchant = response.data.data.map(item => ({
    label: item.data,
    value: item.data
  }));

  commit("SET_SERIAL_NUMBER", merchant);
  return response;
};
