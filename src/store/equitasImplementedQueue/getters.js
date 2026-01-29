const getEquitasReport = (state) => state.equitasImplementedQueue
const getbijdeactivelist = (state) => state.bijdeactivelist
const getaggImplementedverificationqueue = (state) => state.aggImplementedverificationqueue
const getaggdeactivelist = (state) => state.aggdeactivelist
const getserviceticketlist = (state) => state.serviceticketlist
const getserviceapprove = (state) => state.serviceapprove
const getservicereject = (state) => state.servicereject


export default {
  getEquitasReport,
  getbijdeactivelist,
  getaggImplementedverificationqueue,
  getaggdeactivelist,
  getserviceticketlist,
  getserviceapprove,
  getservicereject
};
