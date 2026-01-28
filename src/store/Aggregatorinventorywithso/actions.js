import api from '../api.js'

const getSelectedTabValue = () => {
  const tab = localStorage.getItem('selectedTab')
  return tab ? JSON.parse(tab.split('|')[1]) : null
}

export const FETCH_AGGREGATOR_INVENTORY_WITH_SO = async ({ commit }, request) => {
  const selectedTab = getSelectedTabValue()
  if (!selectedTab) return

  const response = await api.get(
    `aggregator-inventory/agg-all-so-inventory-details/${request.aggregator.id}/${selectedTab}`
  )

  commit('SET_AGGREGATOR_ALL_INVENTORY_WITH_SO_LIST', response.data.data)
}

export const FETCH_INVENTORY_WITH_SO_BASED_ON_REGION = async ({ commit }, request) => {
  const response = await api.get(`allsoinventorydetails/${request}`)
  commit('SET_ALL_INVENTORY_WITH_SO_LIST_BASED_REGION', response.data.data)
}
