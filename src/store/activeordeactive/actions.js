import api from '../api.js'

const LEAD_SOURCE_ACTIVE_DEACTIVE_LIST = async ({ commit }, request) => {
  const response = await api.get('getAllInstance', request)
  commit('SET_LEAD_SOURCE_ACTIVE_DEACTIVE_LIST', response.data.data)
  return response
}

const LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1 = async ({ commit }, request) => {
  const response = await api.get(
    'lead-source-basedon-active-or-not/1',
    request
  )
  commit('SET_LEAD_SOURCE_ACTIVE_DEACTIVE_LIST', response.data.data)
  return response
}

const LEAD_SOURCE_DEACTIVE_LIST = async ({ commit }, request) => {
  const response = await api.get(
    'lead-source-basedon-active-or-not/0',
    request
  )
  commit('DEACTIVE_LIST', response.data.data)
  return response
}

const EDIT_LEAD_SOURCE = async (context, request) => {
  return api.put(`lead-source-update/${request.lead.leadId}/1`)
}

const DELETE_LEAD_SOURCE = async (context, request) => {
  return api.put(`lead-source-update/${request}/0`)
}

export default {
  LEAD_SOURCE_ACTIVE_DEACTIVE_LIST,
  LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1,
  LEAD_SOURCE_DEACTIVE_LIST,
  EDIT_LEAD_SOURCE,
  DELETE_LEAD_SOURCE
};
