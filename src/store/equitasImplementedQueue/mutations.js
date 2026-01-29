const SET_EQUITAS_REPORT = (state, payload) => {
  state.equitasImplementedQueue = payload
}

const SET_BIJLIPAY_DEACTIVE_LIST = (state, payload) => {
  state.bijdeactivelist = payload
}

const SET_AGGREGATOR_IMPLEMENTED_VERIFICATION_QUEUE = (state, payload) => {
  state.aggImplementedverificationqueue = payload
}

const SET_AGGREGATOR_DEACTIVE_LIST = (state, payload) => {
  state.aggdeactivelist = payload
}

const SET_SERVICE_TICKET_LIST = (state, payload) => {
  state.serviceticketlist = payload
}

const SET_SERVICE_TICKET_APPROVE = (state, payload) => {
  state.serviceapprove = payload
}

const SET_SERVICE_TICKET_REJECT = (state, payload) => {
  state.servicereject = payload
}


export default {
  SET_EQUITAS_REPORT,
  SET_BIJLIPAY_DEACTIVE_LIST,
  SET_AGGREGATOR_IMPLEMENTED_VERIFICATION_QUEUE,
  SET_AGGREGATOR_DEACTIVE_LIST,
  SET_SERVICE_TICKET_LIST,
  SET_SERVICE_TICKET_APPROVE,
  SET_SERVICE_TICKET_REJECT
};
