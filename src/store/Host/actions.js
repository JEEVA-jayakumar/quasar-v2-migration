import api from "../api.js";

const GET_HOST_DETAILS = ({commit}) => {
  return api.get("master-hosts").then(response => {
    console.log("response GET_HOST_DETAILS -------->", JSON.stringify(response.data.data));
    commit("SET_ALL_HOST_DETAILS", response.data.data);
  });
};

const ADD_NEW_HOST = (_, request) => {
  return api.post("master-hosts", request);
};

const UPDATE_HOST = (_, request) => {
  console.log("UPDATE_HOST ------>", JSON.stringify(request));
  return api.put("master-hosts/" + request.id, request);
};

const DELETE_HOST = (_, request) => {
  console.log("DELETE_HOST ------>", JSON.stringify(request));
  return api.delete("master-hosts/" + request);
};

export default {
  GET_HOST_DETAILS,
  ADD_NEW_HOST,
  UPDATE_HOST,
  DELETE_HOST
};
