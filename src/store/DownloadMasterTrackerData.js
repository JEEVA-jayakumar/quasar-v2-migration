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
    async MASTER_TRACKER_LIST_ALL_DATAS(_, request) {
      // Removed unused 'today' variable
      if (request.fromDate && request.toDate) {
        // console.log("==========", request)
        return await api
          .get("download-master-tracker-list/" + request.fromDate + "/" + request.toDate, {
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
          .get("download-master-tracker-list", {
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
    
    async AGGREGATOR_MASTER_TRACKER_LIST_ALL_DATAS(_, request) {
      // Removed unused 'today' variable
      if (request.fromDate && request.toDate) {
        return await api
          .get("aggregator-inventory/agg-download-master-tracker-list/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) + "/" + request.fromDate + "/" + request.toDate, {
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
          .get("aggregator-inventory/agg-download-master-tracker-list/" + aggregatorId, {
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

    async FINANCE_APPROVAL_TRACKER(_, request) {
      // Removed unused 'today' variable
      if (request.fromDate && request.toDate) {
        // console.log("==========", request)
        return await api
          .get("finance-tracker-list-download-date-based?from=" + request.fromDate + "&to=" + request.toDate, {
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
          .get("finance-tracker-list-download", {
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
  },
  getters: {
    getFileDownload1(state) {
      return state.fileDownload1;
    },
  },
};
export default FileDownload1;