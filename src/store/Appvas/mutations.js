const SET_VAS_DATAS = (state, payload) => {
  console.log('VAS payload:', JSON.stringify(payload))
  state.VasDeviceMapping = payload.data || payload // fallback if payload has no data field
}


export default {
  SET_VAS_DATAS
};
