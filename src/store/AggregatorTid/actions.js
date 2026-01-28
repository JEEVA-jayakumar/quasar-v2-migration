import api from '../api.js'

const FETCH_AGGREGATOR_TID = ({ commit }, request) => {
  return api.get(`getTid/${request}`)
    .then(response => {
      const tid = response.data.data.map(item => ({
        label: item.tid,
        value: item.tid
      }))

      commit('SET_AGGREGATOR_TID', tid)
    })
}

// Remove unused 'commit' parameter
const FETCH_AGGREGATOR_TID_SERIAL_NUMBER = (_, request) => {
  return api.get(
    `aggregator-inventory/get-aggregator-serialNo/${request.url.tid}`
  )
}

// Remove unused 'commit' parameter
const UPDATE_AGGREGATOR_SERIAL_NUMBER = (_, request) => {
  const selectedTab = localStorage.getItem('selectedTab')
  const aggregatorId = selectedTab
    ? JSON.parse(selectedTab.split('|')[1])
    : null

  return api.post(
    `aggregator-inventory/agg-update-device-serialNo/${aggregatorId}/${request.url.tid}/${request.url.newSerialNumber}`
  )
}

export default {
  FETCH_AGGREGATOR_TID,
  FETCH_AGGREGATOR_TID_SERIAL_NUMBER,
  UPDATE_AGGREGATOR_SERIAL_NUMBER
};
