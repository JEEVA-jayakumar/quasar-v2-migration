const getGlobalSearchSerialNumber = (state) => {
    return state.globalSearchSerialNumber
};
const getdocview = (state) => {
    return state.getdocview
};
const getdocticket = (state) => {
    return state.getdocticket
};
const getdocdownload = (state) => {
    return state.getdocdownload
};
const getAggregatorsGlobalSearchSerialNumber = (state) => {
    return state.AggregatorsglobalSearchSerialNumber
};


export default {
  getGlobalSearchSerialNumber,
  getdocview,
  getdocticket,
  getdocdownload,
  getAggregatorsGlobalSearchSerialNumber
};
