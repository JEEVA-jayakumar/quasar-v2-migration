import api from "../api.js";

const Submit_Latitude_Longitude = (context, request) => {
    console.log("ACTION REQUEST------------>", JSON.stringify(request))
    return api.put("service-request/updateLocation/" + request.id + "/1", request);
};

const Address_Lat_Long = (context, request) => {
    console.log("ACTION REQUEST------------>", JSON.stringify(request))
    return api.put("service-request/updateLocation/" + request.id, request.request);
};

export default {
  Submit_Latitude_Longitude,
  Address_Lat_Long
};
