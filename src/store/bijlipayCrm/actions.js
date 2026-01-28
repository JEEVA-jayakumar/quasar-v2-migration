import api from '../api.js';

export const FETCH_BIJLIPAY_PENDING_CRM = async ({ commit }, request) => {
  try {
    const sorting = request.pagination.descending ? 'asc' : 'desc';

    const response = await api.get(
      `crm-request/getClientData/1/1?page=${request.pagination.page}` +
      `&size=${request.pagination.rowsPerPage}` +
      `&searchTerm=${request.filter}` +
      `&sort=${request.pagination.sortBy}` +
      `&${request.pagination.sortBy}.dir=${sorting}`
    );

    commit('SET_BIJLIPAY_PENDING_CRM', response.data.data);
    return response.data;
  } catch (error) {
    console.error('FETCH_BIJLIPAY_PENDING_CRM error:', error);
    throw error;
  }
};

export const FETCH_BIJLIPAY_COMPLETED_DATA = async ({ commit }, request) => {
  try {
    const sorting = request.pagination.descending ? 'asc' : 'desc';

    const response = await api.get(
      `crm-request/getClientData/1/0?page=${request.pagination.page}` +
      `&size=${request.pagination.rowsPerPage}` +
      `&searchTerm=${request.filter}` +
      `&sort=${request.pagination.sortBy}` +
      `&${request.pagination.sortBy}.dir=${sorting}`
    );

    commit('SET_BIJLIPAY_COMPLETED_DATA', response.data.data);
    return response.data;
  } catch (error) {
    console.error('FETCH_BIJLIPAY_COMPLETED_DATA error:', error);
    throw error;
  }
};

export const BIJLIPAY_CRM_DATE = async ({ commit }, request) => {
  try {
    const sorting = request.pagination.descending ? 'asc' : 'desc';

    const response = await api.get(
      `crm-request/agingTracker/1/${request.date}?page=${request.pagination.page}` +
      `&size=${request.pagination.rowsPerPage}` +
      `&searchTerm=${request.filter}` +
      `&sort=${request.pagination.sortBy}` +
      `&${request.pagination.sortBy}.dir=${sorting}`
    );

    commit('SET_BIJLIPAY_CRM_DATE', response.data.data);
    return response.data;
  } catch (error) {
    console.error('BIJLIPAY_CRM_DATE error:', error);
    throw error;
  }
};

export const UPDATE_CRM_REMARKS = async ({ commit }, request) => {
  try {
    const response = await api.put(
      `crm-request/updateCrmRemark/${request.serviceRequest}`,
      request
    );

    commit('SET_CRM_REMARKS', response);
    return response.data;
  } catch (error) {
    console.error('UPDATE_CRM_REMARKS error:', error);
    throw error;
  }
};

export const ASSIGN_TO_COMPLETE = async (_ctx, request) => {
  try {
    return await api.put('crm-request/assignTicket/1', request);
  } catch (error) {
    console.error('ASSIGN_TO_COMPLETE error:', error);
    throw error;
  }
};

export const ESCALATE_TO_SAT = async (_ctx, request) => {
  try {
    return await api.put('crm-request/assignTicket/2', request);
  } catch (error) {
    console.error('ESCALATE_TO_SAT error:', error);
    throw error;
  }
};
