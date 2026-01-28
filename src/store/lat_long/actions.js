import api from "../api.js";

export const Latitude_Longitude = (_, request) => {
    console.log("ACTION REQUEST------------>", JSON.stringify(request));
    return api.put("implementation-assigned-to-updatelatlng/" + request.id + "/1", request);
};

export const Lat_Long = (_, request) => {
    console.log("ACTION REQUEST------------>", JSON.stringify(request));
    return api.put("implementation-assigned-to-updatelatlng/" + request.id, request.request);
};