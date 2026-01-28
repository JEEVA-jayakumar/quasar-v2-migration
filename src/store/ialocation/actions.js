import * as Vue from "vue";

export const FETCH_IA_LOCATION = ({
  commit,
  rootState
}) => {
  return api
    .get(rootState.GlobalVariables.STATE_LOCAL_API + 'location-master/')
    .then(response => {
      const iaLocation = [];
      response.data.data.forEach((value) => {
        iaLocation.push({
          label: value.location,
          value: value.location,
        });
      });
      commit("SET_ALL_IA_LOCATION", iaLocation);
    });
};