import api from '../api.js'

const getSelectedTabValue = () => {
  const tab = localStorage.getItem('selectedTab')
  return tab ? JSON.parse(tab.split('|')[1]) : null
}

const getBaseUrl = (isAssigned, tabValue) => {
  const suffix = isAssigned ? '/assigned' : ''
  return tabValue === '4'
    ? `aggregator-inventory/agg-device-recovery-tracker-list/${tabValue}${suffix}`
    : `aggregator-inventory/agg-device-recovery-tracker-lst/${tabValue}${suffix}`
}

const AGGREGATOR_DEVICE_RECOVERY_ASSIGNED_LIST = async ({ commit }, request) => {
  const tabValue = getSelectedTabValue()
  if (!tabValue) return

  const sorting = request.pagination.descending ? 'asc' : 'desc'
  const url =
    `${getBaseUrl(true, tabValue)}?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchterm=${request.filter}` +
    `&sort=${request.pagination.sortBy}` +
    `&${request.pagination.sortBy}.dir=${sorting}`

  const response = await api.get(url)
  commit('SET_AGGREGATOR_DEVICE_RECOVERY_ASSIGNED_LIST', response.data.data)
}

const AGGREGATOR_DEVICE_RECOVERY_UNASSIGNED_LIST = async ({ commit }, request) => {
  const tabValue = getSelectedTabValue()
  if (!tabValue) return

  const sorting = request.pagination.descending ? 'asc' : 'desc'
  const sortBy = request.pagination.sortBy || 'createdAt'

  const url =
    `${getBaseUrl(false, tabValue)}?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchterm=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`

  const response = await api.get(url)
  commit('SET_AGGREGATOR_DEVICE_RECOVERY_UNASSIGNED_LIST', response.data.data)
}

const AGGREGATOR_DEVICE_RECOVERY_SUBMIT = async (_, request) => {
  return await api.put(`device-recovery-assigned-to/${request.userId}`, request)
}


export default {
  AGGREGATOR_DEVICE_RECOVERY_ASSIGNED_LIST,
  AGGREGATOR_DEVICE_RECOVERY_UNASSIGNED_LIST,
  AGGREGATOR_DEVICE_RECOVERY_SUBMIT
};
