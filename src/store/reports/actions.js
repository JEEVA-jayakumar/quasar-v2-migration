import * as Vue from "vue";
import { date } from "quasar";

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

/* API call to fetch lead approval data */
const REPORT_LEAD_APPROVAL_TRACKER = async (context, request) => {  // Removed unused commit parameter
  if (request == undefined) {
    return await api
      .get("download/lead-approval-tracker", {
        responseType: "arraybuffer",
      })
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  } else {
    return await api
      .get(
        "download/lead-approval-tracker/" +
        date.formatDate(request.from, "x") +
        "/" +
        date.formatDate(request.to, "x"),
        {
          responseType: "arraybuffer",
        }
      )
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  }
};
/* API call to fetch lead approval data */

/* API call to fetch sorucewise lead data */
const REPORT_SOURCEWISE_LEAD_TRACKER = async (context, request) => {  // Removed unused commit parameter
  if (request == undefined) {
    return await api
      .get("download/sourcewise-lead-tracker", {
        responseType: "arraybuffer",
      })
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  } else {
    return await api
      .get(
        "download/sourcewise-lead-tracker?from=" +
        date.formatDate(request.from, "x") +
        "&to=" +
        date.formatDate(request.to, "x"),
        {
          responseType: "arraybuffer",
        }
      )
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  }
};
/* API call to fetch sorucewise lead data */

/* API call to fetch source/region/device lead data */
const REPORT_SOURCE_REGION_DEVICE = async (context, request) => {  // Removed unused commit parameter
  if (request == undefined) {
    return await api
      .get("download/source-region-device", {
        responseType: "arraybuffer",
      })
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  } else {
    return await api
      .get(
        "download/source-region-device?/" +
        date.formatDate(request.from, "x") +
        "/" +
        date.formatDate(request.to, "x"),
        {
          responseType: "arraybuffer",
        }
      )
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  }
};
/* API call to fetch source/region/device lead data */

/* API call to fetch in active lead data */
const REPORT_INACTIVE_MERCHANT = async (context, request) => {  // Removed unused commit parameter
  if (request == undefined) {
    return await api
      .get("download/inactive-merchant", {
        responseType: "arraybuffer",
      })
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  } else {
    return await api
      .get(
        "download/inactive-merchant/" +
        date.formatDate(request.from, "x") +
        "/" +
        date.formatDate(request.to, "x"),
        {
          responseType: "arraybuffer",
        }
      )
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  }
};
/* API call to fetch in active lead data */

/* API call to fetch proxy lead misselling data */
const REPORT_PROXY_LEAD_MISSELLING = async (context, request) => {  // Removed unused commit parameter
  if (request == undefined) {
    return await api
      .get("download/proxy-lead-misselling", {
        responseType: "arraybuffer",
      })
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  } else {
    return await api
      .get(
        "download/proxy-lead-misselling/" +
        date.formatDate(request.from, "x") +
        "/" +
        date.formatDate(request.to, "x"),
        {
          responseType: "arraybuffer",
        }
      )
      .then(response => {
        let blob = COMMON_FILE_DOWNLOAD(response);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = (response.headers["Content-Disposition"] || "").split(
          "filename="
        )[0];
        link.click();
      });
  }
};
/* API call to fetch proxy lead misselling data */

/* API call to fetch fianance verified tracker data */
const REPORT_FINANCE_APPROVED = async () => {  // Removed unused commit and request parameters
  return await api
    .get("finance-tracker-list-download", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = (response.headers["Content-Disposition"] || "").split(
        "filename="
      )[0];
      link.click();
    });
};

const REPORT_QR_FINANCE_APPROVED = async () => {  // Removed unused commit and request parameters
  return await api
    .get("finance-qr-tracker-list-download", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = (response.headers["Content-Disposition"] || "").split(
        "filename="
      )[0];
      link.click();
    });
};

const POD_LIST_DOWNLOAD = async () => {  // Removed unused commit and request parameters
  return await api
    .get("download/pod-list", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "podlist.xls"
      link.click();
    });
};

const AGGREGATOR_POD_LIST_DOWNLOAD = async () => {  // Removed unused commit and request parameters
  return await api
    .get("download/pod-list", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "podlist.xls"
      link.click();
    });
};

const INVENTORY_WITH_SO_LIST_DOWNLOAD = async () => {  // Removed unused commit and request parameters
  return await api
    .get("download/so-list", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "inventorywithsolist.xls"
      link.click();
    });
};

const AGGREGATOR_INVENTORY_WITH_SO_LIST_DOWNLOAD = async () => {  // Removed unused commit and request parameters
  return await api
    .get("download/so-list", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "aggregatorinventorywithsolist.xls"
      link.click();
    });
};

const QR_LIST_DOWNLOAD = async (context, request) => {  // Removed unused commit parameter
  return await api
    .post("download/qr-implementation-report", request.params, {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "QRLIST.xlsx"
      link.click();
    });
};

const INVENTORY_WITH_RESELLER_LIST_ = async () => {  // Removed unused commit and request parameters
  return await api
    .get("download/reseller-list", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "inventorywithresellerlist.xls"
      link.click();
    });
};

const INVENTORY_WITH_CENTRAL = async () => {  // Removed unused commit and request parameters
  return await api
    .get("download/inventory-central", {
      responseType: "arraybuffer",
    })
    .then(response => {
      let blob = COMMON_FILE_DOWNLOAD(response);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "inventorycentral.xls"
      link.click();
    });
};
/* API call to fetch fianance verified tracker data */

export default {
  REPORT_LEAD_APPROVAL_TRACKER,
  REPORT_SOURCEWISE_LEAD_TRACKER,
  REPORT_SOURCE_REGION_DEVICE,
  REPORT_INACTIVE_MERCHANT,
  REPORT_PROXY_LEAD_MISSELLING,
  REPORT_FINANCE_APPROVED,
  REPORT_QR_FINANCE_APPROVED,
  POD_LIST_DOWNLOAD,
  AGGREGATOR_POD_LIST_DOWNLOAD,
  INVENTORY_WITH_SO_LIST_DOWNLOAD,
  AGGREGATOR_INVENTORY_WITH_SO_LIST_DOWNLOAD,
  QR_LIST_DOWNLOAD,
  INVENTORY_WITH_RESELLER_LIST_,
  INVENTORY_WITH_CENTRAL
};
