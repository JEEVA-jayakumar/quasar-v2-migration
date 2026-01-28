import api from '../api.js'

export const LEAD_SOURCE_ACTIVE_DEACTIVE_LIST = async ({ commit }, request) => {
  const response = await api.get('getAllInstance', request)
  commit('SET_LEAD_SOURCE_ACTIVE_DEACTIVE_LIST', response.data.data)
  return response
}

export const LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1 = async ({ commit }, request) => {
  const response = await api.get(
    'lead-source-basedon-active-or-not/1',
    request
  )
  commit('SET_LEAD_SOURCE_ACTIVE_DEACTIVE_LIST', response.data.data)
  return response
}

export const LEAD_SOURCE_DEACTIVE_LIST = async ({ commit }, request) => {
  const response = await api.get(
    'lead-source-basedon-active-or-not/0',
    request
  )
  commit('DEACTIVE_LIST', response.data.data)
  return response
}

export const EDIT_LEAD_SOURCE = async (context, request) => {
  return api.put(`lead-source-update/${request.lead.leadId}/1`)
}

export const DELETE_LEAD_SOURCE = async (context, request) => {
  return api.put(`lead-source-update/${request}/0`)
}