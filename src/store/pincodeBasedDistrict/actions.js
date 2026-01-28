import api from "../api.js";
// Removed Vue import since we're using api instead

const FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT = ({
    commit
    // Removed unused rootState parameter
}, request) => {
    // Using api instead of api (which doesn't exist in Vue 3)
    return api
        .get('axisPincode/' + request)
        .then(response => {
            console.log("hellow" + response);
            let axisBank = [];
            // Using forEach instead of map since we're not returning a new array
            response.data.data.forEach(function (value) {
                // Removed unused 'key' parameter
                axisBank.push({
                    label: value,
                    value: value,
                });
            });
            commit("SET_ALL_AXIS_BANK_PINCODE_BASED_DISTRICT", axisBank);
        });
};

export default {
  FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT
};
