import api from '../api.js';

const FETCH_BANK_LIST = ({commit}) => {
  return api.get('static-qr/bankList').then(response => {
    //  console.log('BANKLISTGETTER', JSON.stringify(response))
    commit('SET_BANK_LIST', response.data.data);
    return response;
  });
};

const FETCH_REGION_LIST = ({commit}) => {
  return api.get('region').then(response => {
    commit('SET_REGION_LIST', response.data.data);
    return response;
  });
};

const FETCH_BATCH_DETAILS = ({ commit }, request) => {
  // console.log("DAGA2 : ==== : ", JSON.stringify(request))
  const sorting = request.pagination.descending ? 'asc' : 'desc';
  if (request.filter == undefined) {
    return api
      .get('qr-gen/listOfBatch?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting).then(response => {
          commit('SET_BATCH_DETAILS', response.data.data);
        });
  } else {
    return api
      .get('qr-gen/listOfBatch?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting +
        '&searchTerm=' +
        request.filter)
      .then(response => {
        commit('SET_BATCH_DETAILS', response.data.data);
      });
  }
};

const FETCH_REGION_BASED_QR_ALLOCATED_LIST = ({ commit }, request) => {
  const sorting = request.pagination.descending ? 'asc' : 'desc';
  if (request.filter == undefined) {
    return api
      .get('qr-gen/podList/0?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting).then(response => {
          commit('SET_REGION_BASED_QR_ALLOCATED_LIST', response.data.data);
          return response.data.data;
        });
  } else {
    return api
      .get('qr-gen/podList/0?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting +
        '&searchTerm=' +
        request.filter)
      .then(response => {
        commit('SET_REGION_BASED_QR_ALLOCATED_LIST', response);
        return response.data.data;
      });
  }
};

const FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST = ({ commit }, request) => {
  // console.log("DAGA2 : ==== : ", JSON.stringify(request))
  const sorting = request.pagination.descending ? 'asc' : 'desc';
  if (request.filter == undefined) {
    return api
      .get('qr-gen/podList/1?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting).then(response => {
          commit('SET_REGION_BASED_QR_ALLOCATED_APPROVED_LIST', response.data.data);
          return response.data.data;
        });
  } else {
    return api
      .get('qr-gen/podList/1?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting +
        '&searchTerm=' +
        request.filter)
      .then(response => {
        commit('SET_REGION_BASED_QR_ALLOCATED_APPROVED_LIST', response);
        return response.data.data;
      });
  }
};

const GENERATE_QR = (_, request) => {
  return api.post('qr-gen/generateQr', request);
};

const APPROVE_RECIEVED_STICKER = (_, request) => {
  return api.post('qr-gen/addQrCentralInventory/' + request.batchId, request);
};

const UPDATE_QR_COUNT = (_, request) => {
  console.log('TEST CHECK', JSON.stringify(request));
  return api.put('qr-gen/podUpdate/' + request.id + '/' + request.action, request.request);
};

const SUBMIT_QR_COUNT = (_, request) => {
  console.log('TEST CHECK', JSON.stringify(request));
  return api.post('qr-gen/allocationApproval', request);
};

const ASSIGN_REGION = (_, request) => {
  return api.post('qr-gen/regionAllocation', request);
};

const ASSIGN_SO = (_, request) => {
  return api.post('qr-gen/allocateToSo', request);
};

const FETCH_ACTIVE_BATCH_LIST = ({commit}) => {
  return api.get('qr-gen/batchList').then(response => {
    commit('SET_ACTIVE_BATCH_LIST', response.data.data);
    return response;
  });
};
// export const ASSIGN_QR_TO_REGION = ({
//   commit
// }, request) => {
//   return api.post('qr-gen/regionAllocation', request)
// }
// export const FETCH_BATCH_DETAIL_FORM = ({
//   commit
// }, request) => {
//   return api.get('get-batch-details').then(response => {
//     commit('BATCH_DETAIL_FORM', response.data.data)
//   })
// }

export default {
  FETCH_BANK_LIST,
  FETCH_REGION_LIST,
  FETCH_BATCH_DETAILS,
  FETCH_REGION_BASED_QR_ALLOCATED_LIST,
  FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST,
  GENERATE_QR,
  APPROVE_RECIEVED_STICKER,
  UPDATE_QR_COUNT,
  SUBMIT_QR_COUNT,
  ASSIGN_REGION,
  ASSIGN_SO,
  FETCH_ACTIVE_BATCH_LIST
};
