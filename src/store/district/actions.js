import api from "../api.js";

export const FETCH_ALL_DISTRICT = async ({ commit, rootState }, request) => {
  const response = await api.get(
    `${rootState.GlobalVariables.STATE_LOCAL_API}getdistrict/${request}`
  );

  const allDistrict = response.data.district.map(item => ({
    label: item.district,
    value: item.district
  }));

  commit("SET_ALL_DISTRICT", allDistrict);
  return response;
};
