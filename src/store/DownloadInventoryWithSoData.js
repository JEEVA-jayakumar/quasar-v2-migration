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
    async INVENTORY_WITH_SO_ALL_DATAS(_, request) {
      console.log("API POD LIST DATA------------>" + JSON.stringify(request));
      // Removed unused 'today' variable
      if (request.fromDate && request.toDate) {
        // console.log("==========", request)
        return await api
          .get("download-all-so-inventory-details/" + request.fromDate + "/" + request.toDate, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response.headers);
            console.log("FIle name : -- : ", response["Access-Control-Expose-Headers"]);
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);

            link.download = (
              response.headers["Content-disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      } else {
        console.log("==========", request);
        return await api
          .get("download-all-so-inventory-details", {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response);
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-disposition"] || ""
            ).split("filename=")[0];
            link.click();
          });
      }
    },

    /*START AGGREGATORS STATIC CODE */
     
    async AGGREGATOR_INVENTORY_WITH_SO_ALL_DATAS(_, request) {
      console.log("API POD LIST DATA------------>" + JSON.stringify(request));
      // Removed unused 'today' variable
      if (request.fromDate && request.toDate) {
        // console.log("==========", request)
        return await api
          .get("aggregator-inventory/agg-download-all-so-inventory-details/" + request.fromDate + "/" + request.toDate + "/" + JSON.parse(localStorage.getItem("selectedTab").split('|')[1]), {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response.headers);
            console.log("FIle name : -- : ", response["Access-Control-Expose-Headers"]);
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);

            link.download = (
              response.headers["Content-disposition"] || ""
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
          .get("aggregator-inventory/agg-download-all-so-inventory-details/" + aggregatorId, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            console.log("FIle name : -- : ", response);
            const blob = COMMON_FILE_DOWNLOAD(response);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = (
              response.headers["Content-disposition"] || ""
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