import api from "../api.js";
// Remove unused Vue import
// import * as Vue from "vue";

const SEND_TO_RSM_CMS = (context, request) => {
    return api.put
        // .put("http://182.156.237.85:8080/api/manage/data/mdr-details/" + request.id, request)
        ("pricing-exception-submit-to-cms-rsm/" + request.url.id + "/" + request.params.plan1, request.params)
}

export default {
  SEND_TO_RSM_CMS
};
