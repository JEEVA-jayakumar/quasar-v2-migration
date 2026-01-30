<template>
  <q-page>
    <div>
      <q-tabs
        v-model="activeTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToCompleteTab"
      >
        <q-tab name="tab-1" label="New Requests" />
        <q-tab name="tab-2" label="Courier" />
        <q-tab name="tab-3" label="Failure Onboarding" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <div class="row items-center q-mb-md">
              <q-input
                class="col-5"
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Type.."
                label="Search LeadNo, ContactName, LegalName, MerchantNumber..."
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            
            <q-table
              table-class="customTableClass"
              class="q-py-none"
              :rows="tableData"
              :columns="columns"
              :filter="filter"
              :rows-per-page-options="[50, 100, 150, 200]"
              v-model:pagination="paginationControl"
              :loading="toggleAjaxLoadFilter"
              @request="ajaxLoadAllLeadInfo"
            >
              <template #body-cell-actionScanQR="props">
                <q-td :props="props">
                  <q-btn
                    :disable="props.row.isScanQrEnabled"
                    dense
                    no-caps
                    no-wrap
                    icon="fa fa-qrcode"
                    label="Scan QR"
                    size="md"
                    @click="toggleScanner(props.row)"
                    flat
                    class="text-green"
                  />
                </q-td>
              </template>
              
              <template #body-cell-actionScanSoundbox="props">
                <q-td :props="props">
                  <div v-if="props.row.soundBox == true">
                    <q-btn
                      :disable="props.row.isScanSoundboxEnabled"
                      dense
                      no-caps
                      no-wrap
                      label="Scan Soundbox"
                      size="md"
                      @click="toggleScannerBox(props.row)"
                      flat
                      icon="mdi-scanner"
                      class="text-orange"
                    />
                  </div>
                </q-td>
              </template>
              
              <template #body-cell-actionPrint="props">
                <q-td :props="props">
                  <q-btn
                    :disabled="
                      props.row.leadAction == 0 ||
                      props.row.leadAction == 1 ||
                      props.row.leadAction == 2 ||
                      props.row.leadAction == 4
                    "
                    dense
                    no-caps
                    no-wrap
                    label="Print"
                    size="md"
                    icon="print"
                    @click="generatePdf(props.row)"
                    flat
                    class="text-blue"
                  />
                </q-td>
              </template>
              
              <template #body-cell-actionSubmit="props">
                <q-td :props="props">
                  <q-btn
                    :disabled="
                      props.row.leadAction == 0 ||
                      props.row.leadAction == 1 ||
                      props.row.leadAction == 2 ||
                      props.row.leadAction == 4
                    "
                    highlight
                    push
                    color="purple"
                    size="sm"
                    @click="newRequestSumbit(props.row)"
                  >
                    Submit
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-2">
            <q-table
              table-class="customTableClass"
              class="q-py-none"
              :rows="tableData1"
              :columns="columns2"
              :filter="filter1"
              :rows-per-page-options="[5, 10, 15, 20]"
              v-model:pagination="paginationControl1"
              :loading="toggleAjaxLoadFilter1"
              @request="ajaxLoadAllLeadInfo1"
            >
              <template #body-cell-merchantName="props">
                <q-td :props="props">
                  <template v-if="props.row.pod == true">
                    {{ props.row.podNumber }}
                  </template>
                  <template v-else>
                    <q-input
                      label="Enter POD Number"
                      placeholder="Enter POD Number"
                      v-model="props.row.podNumber"
                      dense
                      outlined
                    />
                  </template>
                </q-td>
              </template>
              
              <template #body-cell-actionPodNumber="props">
                <q-td :props="props">
                  <div v-if="props.row.pod == false">
                    <q-btn
                      highlight
                      :disable="props.row.podNumber == '' || props.row.podNumber == null"
                      push
                      color="purple"
                      size="sm"
                      @click="courierSumbit(props.row)"
                    >
                      Submit
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-3">
            <q-table
              table-class="customTableClass"
              class="q-py-none"
              :rows="tableData2"
              :columns="columns3"
              :filter="filter2"
              :rows-per-page-options="[5, 10, 15, 20]"
              v-model:pagination="paginationControl2"
              :loading="toggleAjaxLoadFilter2"
              @request="ajaxLoadAllLeadInfo2"
            >
              <template #body-cell-actionReSubmit="props">
                <q-td :props="props">
                  <q-btn
                    highlight
                    push
                    color="purple"
                    size="sm"
                    @click="ReferBackSumbit(props.row)"
                  >
                    RE-Submit
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>
    </div>
    
    <ScanStaticInventory
      v-if="propToggleScan"
      :scanInfo="addBasicInformation"
      :propToggleScannerPop="propToggleScan"
      @reloadPhonepePendingDetails="reloadNewRequests"
      @closeScannerInfo="toggleScanner"
    />
    
    <soundBoxStaticInventory
      v-if="propToggleSoundbox"
      :scanInfo="addBasicInformation"
      :propToggleScannerSoundPop="propToggleSoundbox"
      @reloadPhonepePendingDetails1="reloadNewRequests"
      @closeScannerSoundInfo="toggleScannerBox"
    />
    
    <div
      v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1 || toggleAjaxLoadFilter2"
      class="fullscreen spinner-overlay"
    >
      <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import ScanStaticInventory from "../components/ScanStaticInventory.vue";
import soundBoxStaticInventory from "../components/soundBoxStaticInventory.vue";

const $q = useQuasar();
const store = useStore();

// Reactive state
const propToggleScan = ref(false);
const propToggleSoundbox = ref(false);
const addBasicInformation = reactive({
  data: null,
  action: 0,
});
const toggleAjaxLoadFilter = ref(false);
const toggleAjaxLoadFilter1 = ref(false);
const toggleAjaxLoadFilter2 = ref(false);
const activeTab = ref("tab-1");
const filter = ref("");
const filter1 = ref("");
const filter2 = ref("");
const currentRowId = ref(null);

const paginationControl = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: "createdAt",
  descending: false,
  rowsPerPage: 50,
});

const paginationControl1 = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: "createdAt",
  descending: false,
  rowsPerPage: 5,
});

const paginationControl2 = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: "createdAt",
  descending: false,
  rowsPerPage: 5,
});

// Computed properties
const getstaticNewRequestsLead = computed(() => 
  store.getters["phonePeCrm/getstaticNewRequestsLead"] || 
  { totalElements: 0, content: [] }
);

const getstaticCourierLead = computed(() => 
  store.getters["phonePeCrm/getstaticCourierLead"] || 
  { totalElements: 0, content: [] }
);

const getstaticReferBackLead = computed(() => 
  store.getters["phonePeCrm/getstaticReferBackLead"] || 
  { totalElements: 0, content: [] }
);

// Data
const tableData = ref([]);
const tableData1 = ref([]);
const tableData2 = ref([]);

// Columns configuration
const columns = [
  {
    name: "qrLeadNumber",
    required: true,
    label: "Lead No",
    align: "left",
    field: (row) => row.qrLeadNumber || "NA",
  },
  {
    name: "merchantName",
    required: true,
    label: "Merchant Contact Name",
    align: "left",
    field: (row) => row.merchantName || "NA",
    sortable: false,
  },
  {
    name: "legalName",
    required: true,
    label: "Merchant Legal Name",
    align: "left",
    field: (row) => row.legalName || "NA",
    sortable: false,
  },
  {
    name: "contactAddress",
    required: true,
    label: "Merchant Address",
    align: "left",
    field: (row) => row.contactAddress || "NA",
    sortable: false,
  },
  {
    name: "city",
    required: true,
    label: "City",
    align: "left",
    field: (row) => row.city || "NA",
  },
  {
    name: "pincode",
    required: true,
    label: "Pincode",
    align: "left",
    field: (row) => row.pincode || "NA",
  },
  {
    name: "contactNumber",
    required: true,
    label: "Merchant Phone Number",
    align: "left",
    field: (row) => row.contactNumber || "NA",
    sortable: false,
  },
  {
    name: "status",
    required: true,
    label: "Merchant Request",
    align: "left",
    field: (row) => {
      if (row.soundBox == false) {
        return "SQR";
      } else if (row.soundBox == true) {
        return "SQR + SOUNDBOX";
      }
      return "NA";
    },
    sortable: false,
  },
  {
    name: "actionScanQR",
    required: true,
    label: "",
    align: "left",
    field: "actionScanQR",
    sortable: false,
  },
  {
    name: "actionScanSoundbox",
    required: true,
    label: "",
    align: "left",
    field: "actionScanSoundbox",
    sortable: false,
  },
  {
    name: "actionPrint",
    required: true,
    label: "",
    align: "left",
    field: "actionPrint",
    sortable: false,
  },
  {
    name: "actionSubmit",
    required: true,
    label: "",
    align: "left",
    field: "actionSubmit",
    sortable: false,
  },
];

const columns2 = [
  {
    name: "legalName",
    required: true,
    label: "Merchant Legal Name",
    align: "left",
    field: (row) => row.legalName || "NA",
    sortable: false,
  },
  {
    name: "merchantName",
    required: true,
    label: "POD Number",
    align: "left",
    field: (row) => row.podNumber || "",
    sortable: false,
  },
  {
    name: "actionPodNumber",
    required: true,
    label: "",
    align: "left",
    field: "actionPodNumber",
    sortable: false,
  },
];

const columns3 = [
  {
    name: "qrLeadNumber",
    required: true,
    label: "Lead No",
    align: "left",
    field: (row) => row.qrLeadNumber || "NA",
  },
  {
    name: "merchantName",
    required: true,
    label: "Merchant Contact Name",
    align: "left",
    field: (row) => row.merchantName || "NA",
    sortable: false,
  },
  {
    name: "legalName",
    required: true,
    label: "Merchant Legal Name",
    align: "left",
    field: (row) => row.legalName || "NA",
    sortable: false,
  },
  {
    name: "contactAddress",
    required: true,
    label: "Merchant Address",
    align: "left",
    field: (row) => row.contactAddress || "NA",
    sortable: false,
  },
  {
    name: "city",
    required: true,
    label: "City",
    align: "left",
    field: (row) => row.city || "NA",
  },
  {
    name: "pincode",
    required: true,
    label: "Pincode",
    align: "left",
    field: (row) => row.pincode || "NA",
  },
  {
    name: "contactNumber",
    required: true,
    label: "Merchant Phone Number",
    align: "left",
    field: (row) => row.contactNumber || "NA",
    sortable: false,
  },
  {
    name: "actionReSubmit",
    required: true,
    label: "",
    align: "left",
    field: "actionReSubmit",
    sortable: false,
  },
];

// Helper functions
const reloadNewRequests = () => {
  loadingData({
    pagination: paginationControl,
    filter: filter.value,
  });
};

// Methods
const ajaxLoadAllLeadInfo = async (request) => {
  const req = {
    pagination: request.pagination,
    filter: request.filter,
  };
  await loadingData(req);
};

const goToCompleteTab = (tab) => {
  if (tab === "tab-2") {
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1,
      filter: filter1.value,
    });
  } else if (tab === "tab-3") {
    ajaxLoadAllLeadInfo2({
      pagination: paginationControl2,
      filter: filter2.value,
    });
  } else {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl,
      filter: filter.value,
    });
  }
};

const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    await store.dispatch(
      "phonePeCrm/FETCH_STATIC_QR_COURIER_REQUESTS", 
      { pagination, filter }
    );

    const response = getstaticCourierLead.value;
    paginationControl1.rowsNumber = response.totalElements || 0;
    paginationControl1.page = (response.number || 0) + 1;
    tableData1.value = response.content || [];

    if (response.sort && response.sort.length > 0) {
      paginationControl1.sortBy = response.sort[0].property;
      paginationControl1.descending = !response.sort[0].ascending;
    }

    $q.loading.hide();
  } catch (error) {

    console.error("Error loading courier requests:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "Failed to load courier data",
    });
  }
};

const ajaxLoadAllLeadInfo2 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    await store.dispatch(
      "phonePeCrm/FETCH_STATIC_QR_REFER_BACK_REQUESTS", 
      { pagination, filter }
    );

    const response = getstaticReferBackLead.value;
    paginationControl2.rowsNumber = response.totalElements || 0;
    paginationControl2.page = (response.number || 0) + 1;
    tableData2.value = response.content || [];

    if (response.sort && response.sort.length > 0) {
      paginationControl2.sortBy = response.sort[0].property;
      paginationControl2.descending = !response.sort[0].ascending;
    }

    $q.loading.hide();
  } catch (error) {

    console.error("Error loading refer back requests:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "Failed to load refer back data",
    });
  }
};

const toggleScanner = (row) => {
  propToggleScan.value = !propToggleScan.value;
  if (row !== undefined && propToggleScan.value === true) {
    addBasicInformation.data = row;
    currentRowId.value = row.id;
    
    // Update lead action status
    updateLeadAction(row);
    
    // Update button states
    updateButtonStates();
  } else if (row !== undefined && propToggleScan.value === false) {
    if (addBasicInformation.data?.id === row.id) {
      currentRowId.value = null;
      updateButtonStates();
    }
  }
};

const updateLeadAction = (row) => {
  // Update lead action based on current state
  if (row.leadAction === 0) {
    row.leadAction = 1;
  } else if (row.leadAction === 1) {
    row.leadAction = 2;
  } else if (row.leadAction === 2) {
    row.leadAction = 5;
  } else {
    row.leadAction = 0;
  }
  
  // Update the table data
  tableData.value = [...tableData.value];
};

const updateButtonStates = () => {
  soundboxenable({
    pagination: paginationControl,
    filter: filter.value,
  });
};

const soundboxenable = async (request) => {
  const req = {
    pagination: request.pagination,
    filter: request.filter,
  };
  
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    await store.dispatch("phonePeCrm/FETCH_STATIC_QR_NEW_REQUESTS", req);
    
    const response = getstaticNewRequestsLead.value;
    paginationControl.rowsNumber = response.totalElements || 0;
    paginationControl.page = (response.number || 0) + 1;
    tableData.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl.sortBy = response.sort[0].property;
      paginationControl.descending = !response.sort[0].ascending;
    }

    // Update button states based on current scanning row
    tableData.value.forEach((row) => {
      if (row.leadAction == 1 && row.id == currentRowId.value) {
        row.isScanQrEnabled = true;
        row.isScanSoundboxEnabled = false;
      } else if (
        (row.leadAction == 0 ||
          row.leadAction == 2 ||
          row.leadAction == 5 ||
          row.leadAction == 4) &&
        row.id != currentRowId.value
      ) {
        row.isScanQrEnabled = true;
        row.isScanSoundboxEnabled = true;
      } else {
        row.isScanQrEnabled = true;
        row.isScanSoundboxEnabled = true;
      }
    });

    $q.loading.hide();
  } catch (error) {

    console.error("Error enabling soundbox:", error);
    $q.loading.hide();
  }
};

const loadingData = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    await store.dispatch("phonePeCrm/FETCH_STATIC_QR_NEW_REQUESTS", request);
    
    const response = getstaticNewRequestsLead.value;
    paginationControl.rowsNumber = response.totalElements || 0;
    paginationControl.page = (response.number || 0) + 1;
    tableData.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl.sortBy = response.sort[0].property;
      paginationControl.descending = !response.sort[0].ascending;
    }

    // Initialize button states
    tableData.value.forEach((row) => {
      if (row.leadAction == 1 || row.leadAction == 2 || row.leadAction == 3) {
        row.isScanQrEnabled = true;
        row.isScanSoundboxEnabled = false;
      } else {
        row.isScanQrEnabled = false;
        row.isScanSoundboxEnabled = true;
      }
    });

    $q.loading.hide();
  } catch (error) {

    console.error("Error loading new requests:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "Failed to load new requests data",
    });
  }
};

const toggleScannerBox = (row) => {
  propToggleSoundbox.value = !propToggleSoundbox.value;
  if (row !== undefined) {
    addBasicInformation.data = row;
  }
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filter.value,
  });
};

const generatePdf = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Generating PDF ..",
  });

  try {
    await store.dispatch("InventoryCentral/PRINT_MERCHANT_DETAILS", request.id);
    $q.loading.hide();
    $q.notify({
      color: "positive",
      message: "PDF generated successfully",
    });
  } catch (error) {

    console.error("Error generating PDF:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "Failed to generate PDF",
    });
  }
};

const newRequestSumbit = async (request) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to submit this request?",
    ok: {
      label: "Yes",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    }
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Submitting request ..",
    });

    try {
      const param = {
        id: request.id,
      };

      await store.dispatch("phonePeCrm/SUBMIT_STATIC_QR_NEW_REQUESTS", param);
      
      // Refresh data
      await ajaxLoadAllLeadInfo({
        pagination: paginationControl,
        filter: filter.value,
      });
      
      $q.notify({
        color: "positive",
        message: "Submitted successfully!",
        icon: "thumb_up",
      });
      
      $q.loading.hide();
    } catch (error) {

      console.error("Error submitting request:", error);
      $q.loading.hide();
      $q.notify({
        color: "negative",
        message: "Error in submitting request!",
        icon: "thumb_down",
      });
    }
  }).onCancel(() => {
    $q.notify({
      color: "info",
      message: "Submission cancelled",
      icon: "info"
    });
  });
};

const courierSumbit = async (request) => {
  if (!request.podNumber || request.podNumber.trim() === "") {
    $q.notify({
      color: "warning",
      message: "Please enter a POD number",
      icon: "warning"
    });
    return;
  }

  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Updating courier ..",
  });

  try {
    const param = {
      data1: {
        id: request.id,
      },
      formsList: {
        id: request.id,
        podNumber: request.podNumber,
      },
    };

    await store.dispatch("phonePeCrm/COURIER_POD_NUMBER_LEAD", param);
    
    // Refresh courier data
    await ajaxLoadAllLeadInfo1({
      pagination: paginationControl1,
      filter: filter1.value,
    });
    
    $q.notify({
      color: "positive",
      message: "Courier updated successfully!",
      icon: "thumb_up",
    });
    
    $q.loading.hide();
  } catch (error) {

    console.error("Error updating courier:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: error?.body?.message || "Error in updating courier!",
      icon: "thumb_down",
    });
  }
};

const ReferBackSumbit = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Re-submitting request ..",
  });

  try {
    const param = {
      id: request.id,
    };

    await store.dispatch("phonePeCrm/REFERBACK_RESUMBIT_LEAD", param);
    
    // Refresh refer back data
    await ajaxLoadAllLeadInfo2({
      pagination: paginationControl2,
      filter: filter2.value,
    });
    
    $q.notify({
      color: "positive",
      message: "Successfully re-submitted!",
      icon: "thumb_up",
    });
    
    $q.loading.hide();
  } catch (error) {

    console.error("Error re-submitting request:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "Error in re-submitting request!",
      icon: "thumb_down",
    });
  }
};

// Lifecycle hooks
onMounted(() => {
  loadingData({
    pagination: paginationControl,
    filter: filter.value,
  });
});
</script>

<style scoped>
.customTabActive {
  background: purple;
  color: #fff;
}

.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.customTableClass {
  border-collapse: separate;
  border-spacing: 0;
}

.customTableClass th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.q-tabs {
  background-color: white;
}

.q-tab {
  min-height: 48px;
}

.q-tab--active {
  color: #61116a;
  border-bottom: 2px solid #61116a;
}

.q-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .col-5 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .q-table {
    overflow-x: auto;
  }
}
</style>