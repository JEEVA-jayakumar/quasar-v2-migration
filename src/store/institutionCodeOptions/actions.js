import * as Vue from "vue";

const INSTITUTIONCODE_FROM_FROM_MARS = ({
  commit,
  rootState
}) => {
  return api
    .get(
      rootState.GlobalVariables.STATE_LOCAL_API +
      "getAllInstitutions")
    .then(response => {
      const institutionCode = [];
      response.data.data.forEach((value) => {
        institutionCode.push({
          label: value.institutionName,
          value: value.institutionCode,
        });
      });
      commit("SET_INSTITUTION_CODE", institutionCode);
    });
};

export default {
  INSTITUTIONCODE_FROM_FROM_MARS
};
