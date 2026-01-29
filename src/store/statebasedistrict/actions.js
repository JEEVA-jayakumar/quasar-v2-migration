import * as Vue from "vue";
// Removed unused api import

const FETCH_AXIS_BANK_PINCODE_DISTRICT = ({
  commit,
  rootState
}, request) => {
  return api
    .get(rootState.GlobalVariables.STATE_AXIS_API + 'axisPincodeWithStateName/' + request)
    .then(response => {
      console.log("hellow" + response)
      let axisBank = [];
      response.data.data.map(function (value) {
        // Removed unused key parameter
        axisBank.push({
          label: value.cityName,
          value: value.cityName,
        });
      });
      commit("SET_ALL_AXIS_BANK_PINCODE_DISTRICT", axisBank)
    })
}

export default {
  FETCH_AXIS_BANK_PINCODE_DISTRICT
};
