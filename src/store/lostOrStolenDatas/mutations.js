const SET_ALL_LOST_DEVICES_DATAS = (state, payload) => {
  console.log("GET DATAS AFTER LOST----------------->" + JSON.stringify(payload))
  state.allLostDeviceDatas = payload;
};

/*Aggregators APi */
const SET_ALL_AGGREGATORS_LOST_DEVICES_DATAS= (state, payload) => {
  console.log("GET DATAS AFTER LOST----------------->" + JSON.stringify(payload))
  state.allAggregatorsLostDeviceDatas = payload;
};


export default {
  SET_ALL_LOST_DEVICES_DATAS,
  SET_ALL_AGGREGATORS_LOST_DEVICES_DATAS
};
