import api from '../api.js'

export const QR_APPROVE_FINANCE_EXCEPTION = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("verify-qr-lead-finance-exception/" + request.leadId, request);
};

export const FETCH_ALL_QR_PAYMENT_TRACKER_DATA = ({ commit }, request) => {
  if (request.pagination.sortBy == null) {
    return api
      .get('qr-finance-verification-tracker-list-paged?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&search=' +
        request.filter)
      .then(response => {
        console.log("QR FINANCE", JSON.stringify(response));
        commit('SET_ALL_QR_PAYMENT_TRACKER_DATA', response.data.data);
      });
  } else {
    let sorting = request.pagination.descending ? 'asc' : 'desc';
    return api
      .get('qr-finance-verification-tracker-list-paged?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&search=' +
        request.filter +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting)
      .then(response => {
        console.log("QR FINANCE", JSON.stringify(response));
        commit('SET_ALL_QR_PAYMENT_TRACKER_DATA', response.data.data);
      });
  }
};

export const FETCH_ALL_APPROVED_QR_FINANCE_DATA = ({ commit }, request) => {
  if (request.pagination.sortBy == null) {
    return api
      .get('qr-finance-approved-tracker-list-paged?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&search=' +
        request.filter)
      .then(response => {
        commit('SET_ALL_APPROVED_QR_FINANCE_DATA', response.data.data);
        console.log("QRss FINANCE", JSON.stringify(response));
      });
  } else {
    let sorting = request.pagination.descending ? "asc" : "desc";
    return api
      .get('qr-finance-approved-tracker-list-paged?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&search=' +
        request.filter +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting)
      .then(response => {
        commit('SET_ALL_APPROVED_QR_FINANCE_DATA', response.data.data);
        console.log("QRss FINANCE", JSON.stringify(response));
      });
  }
};

export const QR_REJECT_FINANCE_EXCEPTION = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("verify-qr-lead-finance-exception/" + request.leadId, request);
};