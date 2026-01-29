const getLostOrStolenDatas = (state) => {
  return state.allLostDeviceDatas
}

/* AGGregators API */

const getAggregatorsLostOrStolenDatas = (state) => {
  return state.allAggregatorsLostDeviceDatas
}

/* AGGregators API */


export default {
  getLostOrStolenDatas,
  getAggregatorsLostOrStolenDatas
};
