import api from "../api.js";

const FETCH_REGION_GROUP_DATAS = ({commit}) => {
  // Removed unused 'request' parameter
  return api
    .get("region-group")
    .then(response => {
      commit("SET_REGION_GROUP_DATAS", response.data.data);
      return response;
    });
};

const CREATE_NEW_REGION_GROUP = (context, request) => {
  // Using 'context' instead of destructuring unused 'commit'
  console.log("ACTIVE request DATAS------------->", JSON.stringify(request));
  return api.post("region-group", request);
};

const UPDATE_REGION_GROUP_DATAS = (context, request) => {
  // Using 'context' instead of destructuring unused 'commit'
  console.log("UPDATE_REGION_GROUP_DATAS ACTIVE request DATAS------------->", JSON.stringify(request));
  return api.put("region-group/" + request.request.id, request.request);
};

const ACTIVE_REGION_GROUP_DATAS = (context, request) => {
  // Using 'context' instead of destructuring unused 'commit'
  console.log("ACTIVE request DATAS------------->", JSON.stringify(request));
  return api.put("region-group/" + request.id, request);
};

const DELETE_REGION_GROUP_DATAS = (context, request) => {
  // Using 'context' instead of destructuring unused 'commit'
  console.log("Delete request DATAS------------->", JSON.stringify(request));
  return api.delete("region-group/" + request.id);
};

export default {
  FETCH_REGION_GROUP_DATAS,
  CREATE_NEW_REGION_GROUP,
  UPDATE_REGION_GROUP_DATAS,
  ACTIVE_REGION_GROUP_DATAS,
  DELETE_REGION_GROUP_DATAS
};
