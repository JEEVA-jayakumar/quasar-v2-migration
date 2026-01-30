import * as Vue from "vue"

/***********
Common function to convert response as BLOB and create a
link to click and download
*************/
function COMMON_FILE_DOWNLOAD(response) {
  return new Blob([response.data], {
    type: response.headers.get("content-type"),
  });
}

const FileDownload1 = {
  namespaced: true,
  state: {
    fileDownload1: [],
  },
  mutations: {
    SET_ALL_FILE_(state, payload) {
      console.log("SET_ALL_FILE_DOWNLOAD_1 >>", payload);
      state.fileDownload1 = payload;
    },
  },
  actions: {
    // Remove unused 'commit' parameter
    async FETCH_LOST_OR_STOLEN_INVENTORY_ALL_DATAS(_, request) {
      // Remove unused 'date' variable

      if (request.from && request.to) {
        return await api
          .get("download-central-inventory-device-by-status/5" + "?from=" + request.from + "&to=" + request.to, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response)
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-Disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      } else {
        console.log("==========", request)
        return await api
          .get("download-central-inventory-device-by-status/5", {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response.headers["Content-Disposition"])
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-Disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      }
    },

    // Remove unused 'commit' parameter
    async FETCH_AGGREGATORS_LOST_OR_STOLEN_INVENTORY_ALL_DATAS(_, request) {
      // Remove unused 'date' variable

      if (request.from && request.to) {
        return await api
          .get("aggregator-inventory/agg-download-central-inventory-device-by-status/5/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+ "?from=" + request.from + "&to=" + request.to, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response)
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-Disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      } else {
        console.log("==========", request)
        return await api
          .get("aggregator-inventory/agg-download-central-inventory-device-by-status/5/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1]), {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response.headers["Content-Disposition"])
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-Disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      }
    },
  },
  getters: {
    getFileDownload1(state) {
      return state.fileDownload1;
    },
  }
};
export default FileDownload1;