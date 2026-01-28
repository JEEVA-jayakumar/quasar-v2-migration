import api from "../api.js"; 

export const UNALLOCATED_DEVICE = ({
  commit
}, request) => {
  if (request.filter === '') {
    const sorting = request.pagination.descending ? "desc" : "asc";
    
    return api
      .get(
        `getUnallocatedDevicesMenu?page=${request.pagination.page}` +
        `&size=${request.pagination.rowsPerPage}` +
        `&sort=${sorting}`
      )
      .then(response => {
        commit("SET_UNALLOCATED_DEVICE", response.data.data);
      });
  } else {
    const sorting = request.pagination.descending ? "desc" : "asc";
    
    return api
      .get(
        `getUnAllocatedDevices-RegionMenu?page=${request.pagination.page}` +
        `&size=${request.pagination.rowsPerPage}` +
        `&search=${encodeURIComponent(request.filter)}` +
        `&sort=${sorting}`
      )
      .then(response => {
        commit("SET_UNALLOCATED_DEVICE", response.data.data);
      });
  }
};