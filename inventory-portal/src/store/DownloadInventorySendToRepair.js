import * as Vue from "vue";

/***********
Common function to convert response as BLOB and create a
link to click and download
*************/
function COMMON_FILE_DOWNLOAD(response) {
  return new Blob([response.data], {
    type: response.headers.get("content-type"),
  });
}
/***********
Common function to convert response as BLOB and create a
link to click and download
*************/

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
    async FETCH_SEND_TO_REPAIR_INVENTORY_ALL_DATAS(_, request) {
      // Removed unused 'today' variable
      if (request.from && request.to) {
        // console.log("==========", request)
        return await api
          .get("download-central-inventory-device-by-status/3?from=" + request.from + "&to=" + request.to, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response);
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-Disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      } else {
        console.log("==========", request);
        return await api
          .get("download-central-inventory-device-by-status/3", {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response.headers["Content-Disposition"]);
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

    /*START AGGREGATORS STATIC CODE */

    async FETCH_AGGREGATORS_SEND_TO_REPAIR_INVENTORY_ALL_DATAS(_, request) {
      // Removed unused 'today' variable
      if (request.from && request.to) {
        // console.log("==========", request)
        return await api
          .get("aggregator-inventory/agg-download-central-inventory-device-by-status/3/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) + "?from=" + request.from + "&to=" + request.to, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response);
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-Disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      } else {
        console.log("==========", request);
        const selectedTab = localStorage.getItem("selectedTab");
        if (!selectedTab) {
          throw new Error("No selectedTab found in localStorage");
        }

        const tabParts = selectedTab.split('|');
        if (tabParts.length < 2) {
          throw new Error("Invalid selectedTab format");
        }

        const aggregatorId = JSON.parse(tabParts[1]);
        return await api
          .get("aggregator-inventory/agg-download-central-inventory-device-by-status/3/" + aggregatorId, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response.headers["Content-Disposition"]);
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

    /*END AGGREGATORS STATIC CODE */
  },

  getters: {
    getFileDownload1(state) {
      return state.fileDownload1;
    },
  }
};
export default FileDownload1;