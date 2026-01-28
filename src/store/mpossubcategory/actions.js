import api from "../api.js";

export const FETCH_ALL_MPOS_SUBCATEGORY = ({
  commit
  // Removed unused rootState parameter
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  return api
    .get("getcategory/" + request)
    .then(response => {
      let mposSubCategory = [];
      // Using forEach instead of map since we're not returning a new array
      response.data.forEach(function (value) {
        // Removed unused 'key' parameter
        mposSubCategory.push({
          label: value.sub_category,
          value: value.subcategory_code
        });
      });
      commit("SET_ALL_MPOS_SUB_CATEGORY", mposSubCategory);
    });
};