import api from "../api.js";
const ALLOCATED_DEVICE = ({
  commit
}, request) => {
  if (request.filter == '') {
    const sorting = request.pagination.descending ? "desc" : "asc"; // Fixed sorting logic and now using it

    return api
      .get(
        "getAllocatedDevicesMenu?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&sort=" + sorting // Added sorting parameter to URL
      )
      .then(response => {
        // START=> COMMIT with data received'
        commit("SET_ALLOCATED_DEVICE", response.data.data);
        // END=> COMMIT with data received'
      });
  } else {
    const sorting = request.pagination.descending ? "desc" : "asc"; // Fixed sorting logic and now using it

    return api
      .get(
        "getAllocatedDevices-RegionMenu?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&search=" +
        request.filter +
        "&sort=" + sorting // Added sorting parameter to URL
      )
      .then(response => {
        // START=> COMMIT with data received'
        commit("SET_ALLOCATED_DEVICE", response.data.data);
        // END=> COMMIT with data received'
      });
  }
}

export default {
  ALLOCATED_DEVICE
};
