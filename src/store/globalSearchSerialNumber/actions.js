import * as Vue from "vue";
import api from "../api.js";

const FETCH_GLOBAL_SEARCH_DATAS = ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  console.log(" request", request);
  
  if (request.select == 1) {
    return api
      .get(
        "search-global/" +
        request.flag +
        "/" +
        request.searchTerm +
        "?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting
      )
      .then(response => {
        commit("API_RESPONSE_LOG", response);
        commit("SET_FETCH_GLOBAL_SEARCH_DATAS", response.body.data);
      });
  } else {
    if (request.flag == 6) {
      return api
        .get(
          "search-global/" +
          request.flag +
          "/" +
          request.searchTerm +
          "?vpa=" +
          request.searchTerm +
          "&page=" +
          request.pagination.page +
          "&size=" +
          request.pagination.rowsPerPage +
          '&sort=' +
          request.pagination.sortBy +
          '&' +
          request.pagination.sortBy +
          '.dir=' +
          sorting
        )
        .then(response => {
          commit("API_RESPONSE_LOG", response);
          commit("SET_FETCH_GLOBAL_SEARCH_DATAS", response.body.data);
        });
    } else {
      return api
        .get(
          "search-global/" +
          request.flag +
          "/" +
          request.searchTerm +
          "?page=" +
          request.pagination.page +
          "&size=" +
          request.pagination.rowsPerPage +
          '&sort=' +
          request.pagination.sortBy +
          '&' +
          request.pagination.sortBy +
          '.dir=' +
          sorting
        )
        .then(response => {
          commit("API_RESPONSE_LOG", response);
          commit("SET_FETCH_GLOBAL_SEARCH_DATAS", response.body.data);
        });
    }
  }
};

const FETCH_DOC_VIEW = ({ commit }, request) => {
  return api
    .get(
      "crm-request/getTidDetails/" + request.searchTerm
    )
    .then(response => {
      commit("SET_FETCH_DOC_VIEW", response.body.data);
      return response.body.data;
    });
};

const FETCH_DOC_VIEW_TICKET = ({ commit }, request) => {
  return api
    .get(
      "crm-request/getTicketDetails/" + request.searchTerm
    )
    .then(response => {
      commit("SET_FETCH_DOC_VIEW_TICKET", response.body.data);
    });
};

const DOC_DOWNLOAD = ({ commit, rootState }, request) => {
  return api
    .get(rootState.GlobalVariables.ASSETSURL + '/' + request, {
      responseType: 'blob'
    })
    .then(response => {
      commit("SET_FETCH_DOC_VIEW", response);
      return response;
    })
    .catch(error => {
      throw error;
    });
};

/* AGGREGATORS API */

const FETCH_PHONE_PE_GLOBAL_SEARCH_DATAS = ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  console.log("PAGI : ------ : " + JSON.stringify(request.pagination.sortBy));
  
  return api
    .get(
      "aggregator-inventory/agg-search-global/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) +
      "/" +
      request.flag +
      "/" +
      request.searchTerm +
      "?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      '&sort=' +
      request.pagination.sortBy +
      '&' +
      request.pagination.sortBy +
      '.dir=' +
      sorting
    )
    .then(response => {
      console.log("API Response : ", response.body.data);
      commit("API_RESPONSE_LOG", response);
      commit("SET_FETCH_PHONE_PE_GLOBAL_SEARCH_DATAS", response.body.data);
    });
};

export default {
  FETCH_GLOBAL_SEARCH_DATAS,
  FETCH_DOC_VIEW,
  FETCH_DOC_VIEW_TICKET,
  DOC_DOWNLOAD,
  FETCH_PHONE_PE_GLOBAL_SEARCH_DATAS
};
