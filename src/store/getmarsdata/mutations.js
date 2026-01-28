const SET_ALL_MARS_DATA = (
    state, payload) => {
    state.getMars = payload
}
const SET_IMPLEMENTED_QUEUE = (
    state, payload) => {
    state.getImplementedQueue = payload
}
const SET_MID_QUEUE = (
    state, payload) => {
    state.getMidBasedList = payload
}




export default {
  SET_ALL_MARS_DATA,
  SET_IMPLEMENTED_QUEUE,
  SET_MID_QUEUE
};
