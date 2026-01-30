<template>
  <q-page>
    <div>
      <q-tabs
        v-model="activeTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToCompleteTab"
      >
        <q-tab name="tab-1" label="Pending Tickets" />
        <q-tab name="tab-2" label="Completed Tickets" />
        <q-tab name="tab-3" label="RTO Tickets" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <div class="row items-center q-mb-md">
              <div class="col-auto q-mr-md">
                <strong>Open For</strong>
              </div>
              <q-select
                class="col-3"
                v-model="formData.date"
                :options="dateType"
                color="grey"
                @update:model-value="dateClick"
                emit-value
                map-options
              />
              <div class="col"></div>
              <q-input
                class="col-5"
                v-model="filter"
                placeholder="Type.."
                label="Search By Ticket No, Merchant No..."
                color="grey-9"
                clearable
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
              :rows-per-page-options="[5, 10, 15]"
              v-model:pagination="paginationControl"
              :loading="toggleAjaxLoadFilter"
              @request="ajaxLoadAllLeadInfo"
            >
              <template #body-cell-action1="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Scan"
                    icon="mdi-scanner"
                    size="md"
                    @click="toggleScanner(props.row)"
                    flat
                    class="text-green"
                  />
                </q-td>
              </template>
              
              <template #body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="print"
                    icon="print"
                    size="md"
                    @click="generatePdf(props.row)"
                    flat
                    class="text-blue"
                  />
                </q-td>
              </template>
              
              <template #body-cell-action2="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Submit"
                    size="md"
                    @click="submit(props.row)"
                    flat
                    style="background-color: #61116a; color: white;"
                  />
                </q-td>
              </template>
              
              <template #body-cell-createdDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.createdDate) }}
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-2">
            <div class="row q-mb-md">
              <q-input
                class="col-4"
                v-model="filter1"
                placeholder="Type.."
                label="Search By Ticket No, Merchant No..."
                color="grey-9"
                clearable
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
              :rows="tableData1"
              :columns="columns2"
              :filter="filter1"
              :rows-per-page-options="[5, 10, 15]"
              v-model:pagination="paginationControl1"
              :loading="toggleAjaxLoadFilter1"
              @request="ajaxLoadAllLeadInfo1"
            >
              <template #body-cell-createdDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.createdDate) }}
                </q-td>
              </template>
              
              <template #body-cell-updatedDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.updatedDate) }}
                </q-td>
              </template>
              
              <template #body-cell-action3="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Mark RTO"
                    size="md"
                    @click="markRto(props.row)"
                    flat
                    style="background-color: #61116a; color: white;"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-3">
            <div class="row q-mb-md">
              <q-input
                class="col-4"
                v-model="filter2"
                placeholder="Type.."
                label="Search By Ticket No, Merchant No..."
                color="grey-9"
                clearable
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
              :rows="tableData2"
              :columns="columns3"
              :filter="filter2"
              :rows-per-page-options="[5, 10, 15]"
              v-model:pagination="paginationControl2"
              :loading="toggleAjaxLoadFilter2"
              @request="ajaxLoadAllLeadInfo2"
            >
              <template #body-cell-createdDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.createdDate) }}
                </q-td>
              </template>
              
              <template #body-cell-updatedDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.updatedDate) }}
                </q-td>
              </template>
              
              <template #body-cell-rtoCreatedDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.rtoCreatedDate) }}
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>
    </div>
    
    <phonepePaperRollScan
      v-if="propToggleScan"
      :scanInfo="addBasicInformation"
      :propToggleScannerPop="propToggleScan"
      @reloadPhonepePendingDetails="reloadPendingDetails"
      @closeScannerInfo="toggleScanner"
    />
    
    <div
      v-if="
        toggleAjaxLoadFilter || toggleAjaxLoadFilter1 || toggleAjaxLoadFilter2
      "
      class="fullscreen spinner-overlay"
    >
      <q-spinner-bars
        class="absolute-center"
        style="color:#61116a"
        :size="35"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { format } from 'date-fns';
import phonepePaperRollScan from "../components/phonepePaperRollScan.vue";

const $q = useQuasar();
const store = useStore();

// Reactive state
const propToggleScan = ref(false);
const toggleAjaxLoadFilter = ref(false);
const toggleAjaxLoadFilter1 = ref(false);
const toggleAjaxLoadFilter2 = ref(false);
const activeTab = ref('tab-1');
const filter = ref('');
const filter1 = ref('');
const filter2 = ref('');

const paginationControl = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5
});

const paginationControl1 = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5
});

const paginationControl2 = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: 'rtoCreatedDate',
  descending: false,
  rowsPerPage: 5
});

const formData = reactive({
  date: 0
});

const dateType = [
  { label: "Today", value: 0 },
  { label: "T+1", value: 1 },
  { label: "T+2", value: 2 },
  { label: "All", value: 3 }
];

const tableData = ref([]);
const tableData1 = ref([]);
const tableData2 = ref([]);

const addBasicInformation = reactive({
  data: null,
  action: 0
});

// Computed properties
const getphonepePaperRoll = computed(() => 
  store.getters["phonePeCrm/getphonepePaperRoll"] || { totalElements: 0, content: [] }
);

const getphonepeCompletedPaperRoll = computed(() => 
  store.getters["phonePeCrm/getphonepeCompletedPaperRoll"] || { totalElements: 0, content: [] }
);

const getphonepeRtoTicket = computed(() => 
  store.getters["phonePeCrm/getphonepeRtoTicket"] || { totalElements: 0, content: [] }
);

// Columns configuration
const columns = [
  {
    name: "serviceReqTicketId",
    required: true,
    label: "Ticket No",
    align: "left",
    field: row => row.serviceReqTicketId || 'N/A'
  },
  {
    name: "merchantName",
    required: true,
    label: "Merchant Name",
    align: "left",
    field: row => row.meName || 'N/A',
    sortable: false
  },
  {
    name: "emailId",
    required: true,
    label: "Merchant Email",
    align: "left",
    field: row => row.emailId || 'N/A',
    sortable: false
  },
  {
    name: "address",
    required: true,
    label: "Merchant Address",
    align: "left",
    field: row => row.address || 'N/A',
    sortable: false
  },
  {
    name: "contactNumber",
    required: true,
    label: "Merchant No",
    align: "left",
    field: row => row.contactNumber || 'N/A',
    sortable: false
  },
  {
    name: "createdDate",
    required: true,
    label: "Created Date",
    align: "left",
    field: "createdDate",
    sortable: true
  },
  {
    name: "count",
    required: true,
    label: "Count",
    align: "left",
    field: row => row.subTicketsList?.[0]?.paperRollCount || 0
  },
  {
    name: "podNumber",
    required: true,
    label: "POD Number",
    align: "left",
    field: row => row.podNumber || 'N/A'
  },
  {
    name: "action",
    required: true,
    label: "Print",
    align: "left",
    field: "action",
    sortable: false
  },
  {
    name: "action1",
    required: true,
    label: "Scan",
    align: "left",
    field: "action1",
    sortable: false
  },
  {
    name: "action2",
    required: true,
    label: "Submit",
    align: "left",
    field: "action2",
    sortable: false
  }
];

const columns2 = [
  {
    name: "serviceReqTicketId",
    required: true,
    label: "Ticket No",
    align: "left",
    field: row => row.serviceReqTicketId || 'N/A',
    sortable: false
  },
  {
    name: "merchantName",
    required: true,
    label: "Merchant Name",
    align: "left",
    field: row => row.meName || 'N/A',
    sortable: false
  },
  {
    name: "emailId",
    required: true,
    label: "Merchant Email",
    align: "left",
    field: row => row.emailId || 'N/A',
    sortable: false
  },
  {
    name: "contactNumber",
    required: true,
    label: "Merchant Number",
    align: "left",
    field: row => row.contactNumber || 'N/A',
    sortable: false
  },
  {
    name: "address",
    required: true,
    label: "Merchant Address",
    align: "left",
    field: row => row.address || 'N/A',
    sortable: false
  },
  {
    name: "count",
    required: true,
    label: "Count",
    align: "left",
    field: row => row.subTicketsList?.[0]?.paperRollCount || 0,
    sortable: false
  },
  {
    name: "podNumber",
    required: true,
    label: "POD Number",
    align: "left",
    field: row => row.podNumber || 'N/A',
    sortable: false
  },
  {
    name: "createdDate",
    required: true,
    label: "Open Date",
    align: "left",
    field: "createdDate",
    sortable: true
  },
  {
    name: "updatedDate",
    required: true,
    label: "Closed Date",
    align: "left",
    field: "updatedDate",
    sortable: false
  },
  {
    name: "action3",
    required: true,
    label: "Mark RTO",
    align: "left",
    field: "action3",
    sortable: false
  }
];

const columns3 = [
  {
    name: "serviceReqTicketId",
    required: true,
    label: "Ticket No",
    align: "left",
    field: row => row.serviceReqTicketId || 'N/A',
    sortable: false
  },
  {
    name: "merchantName",
    required: true,
    label: "Merchant Name",
    align: "left",
    field: row => row.meName || 'N/A',
    sortable: false
  },
  {
    name: "emailId",
    required: true,
    label: "Merchant Email",
    align: "left",
    field: row => row.emailId || 'N/A',
    sortable: false
  },
  {
    name: "contactNumber",
    required: true,
    label: "Merchant Number",
    align: "left",
    field: row => row.contactNumber || 'N/A',
    sortable: false
  },
  {
    name: "address",
    required: true,
    label: "Merchant Address",
    align: "left",
    field: row => row.address || 'N/A',
    sortable: false
  },
  {
    name: "count",
    required: true,
    label: "Count",
    align: "left",
    field: row => row.subTicketsList?.[0]?.paperRollCount || 0,
    sortable: false
  },
  {
    name: "podNumber",
    required: true,
    label: "POD Number",
    align: "left",
    field: row => row.podNumber || 'N/A',
    sortable: false
  },
  {
    name: "createdDate",
    required: true,
    label: "Open Date",
    align: "left",
    field: "createdDate",
    sortable: false
  },
  {
    name: "updatedDate",
    required: true,
    label: "Closed Date",
    align: "left",
    field: "updatedDate",
    sortable: false
  },
  {
    name: "rtoCreatedDate",
    required: true,
    label: "Date marked as RTO",
    align: "left",
    field: "rtoCreatedDate",
    sortable: true
  }
];

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'NA';
  try {
    const date = new Date(dateString);
    return format(date, 'do MMM yyyy');
  } catch (error) {

    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

const reloadPendingDetails = () => {
  loadingData({
    pagination: paginationControl,
    filter: filter.value,
    date: formData.date
  });
};

// Methods
const ajaxLoadAllLeadInfo = async (request) => {
  console.log('Loading Data with request:', request);
  const req = {
    pagination: request.pagination,
    filter: request.filter,
    date: formData.date
  };
  await loadingData(req);
};

const loadingData = async (request) => {
  console.log('CRM DATE:', request);
  
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  });

  try {
    await store.dispatch("phonePeCrm/PHONEPE_PAPER_ROLL_PENDING", request);
    
    // Update pagination
    const response = getphonepePaperRoll.value;
    paginationControl.rowsNumber = response.totalElements || 0;
    paginationControl.page = (response.number || 0) + 1;
    
    // Update table data
    tableData.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl.sortBy = response.sort[0].property;
      paginationControl.descending = !response.sort[0].ascending;
    }
    
    $q.loading.hide();
  } catch (error) {

    console.error('Error loading data:', error);
    $q.loading.hide();
    $q.notify({
      color: 'negative',
      message: 'Failed to load data. Please try again.'
    });
  }
};

const dateClick = (value) => {
  addBasicInformation.action = value;
  loadingData({
    pagination: paginationControl,
    filter: filter.value,
    date: value
  });
};

const goToCompleteTab = (tab) => {
  if (tab === 'tab-2') {
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1,
      filter: filter1.value
    });
  } else if (tab === 'tab-3') {
    ajaxLoadAllLeadInfo2({
      pagination: paginationControl2,
      filter: filter2.value
    });
  } else {
    loadingData({
      pagination: paginationControl,
      filter: filter.value,
      date: formData.date
    });
  }
};

const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching completed tickets .."
  });

  try {
    await store.dispatch("phonePeCrm/FETCH_PHONEPE_PAPER_ROLL_COMPLETED_DATA", { pagination, filter });
    
    const response = getphonepeCompletedPaperRoll.value;
    paginationControl1.rowsNumber = response.totalElements || 0;
    paginationControl1.page = (response.number || 0) + 1;
    tableData1.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl1.sortBy = response.sort[0].property;
      paginationControl1.descending = !response.sort[0].ascending;
    }
    
    $q.loading.hide();
  } catch (error) {

    console.error('Error loading completed tickets:', error);
    $q.loading.hide();
    $q.notify({
      color: 'negative',
      message: 'Failed to load completed tickets.'
    });
  }
};

const ajaxLoadAllLeadInfo2 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching RTO tickets .."
  });

  try {
    await store.dispatch("phonePeCrm/FETCH_PHONEPE_RTO_TICKET", { pagination, filter });
    
    const response = getphonepeRtoTicket.value;
    paginationControl2.rowsNumber = response.totalElements || 0;
    paginationControl2.page = (response.number || 0) + 1;
    tableData2.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl2.sortBy = response.sort[0].property;
      paginationControl2.descending = !response.sort[0].ascending;
    }
    
    $q.loading.hide();
  } catch (error) {

    console.error('Error loading RTO tickets:', error);
    $q.loading.hide();
    $q.notify({
      color: 'negative',
      message: 'Failed to load RTO tickets.'
    });
  }
};

const toggleScanner = (info) => {
  propToggleScan.value = !propToggleScan.value;
  if (info !== undefined) {
    addBasicInformation.data = info;
    addBasicInformation.action = formData.date;
  }
};

const generatePdf = async (request) => {
  console.log('Generating PDF for:', request);
  
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Generating PDF .."
  });

  try {
    await store.dispatch("InventoryCentral/PHONEPE_PAPER_ROLL_PDF", request.serviceReqTicketId);
    $q.loading.hide();
    $q.notify({
      color: 'positive',
      message: 'PDF generated successfully!'
    });
  } catch (error) {

    console.error('Error generating PDF:', error);
    $q.loading.hide();
    $q.notify({
      color: 'negative',
      message: 'Failed to generate PDF.'
    });
  }
};

const submit = async (request) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to submit this ticket?",
    ok: {
      label: "Yes",
      color: "positive"
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
      message: "Submitting ticket .."
    });

    try {
      const response = await store.dispatch("phonePeCrm/PHONEPE_PAPER_ROLL_SUBMIT", request.serviceReqTicketId);
      
      if (response?.body?.data) {
        $q.notify({
          color: "positive",
          message: response.body.message || "Ticket submitted successfully!"
        });
      } else {
        $q.notify({
          color: "negative",
          message: response?.body?.message || "Failed to submit ticket."
        });
      }
      
      // Reload data
      await loadingData({
        pagination: paginationControl,
        filter: filter.value,
        date: formData.date
      });
      
      $q.loading.hide();
    } catch (error) {

      console.error('Error submitting ticket:', error);
      $q.loading.hide();
      $q.notify({
        color: 'negative',
        message: error?.body?.message || 'Failed to submit ticket.'
      });
    }
  }).onCancel(() => {
    $q.notify({
      color: "info",
      message: "Submission cancelled."
    });
  });
};

const markRto = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Marking as RTO .."
  });

  try {
    await store.dispatch("phonePeCrm/MARK_RTO", request.serviceReqTicketId);
    
    $q.notify({
      color: "positive",
      message: "Ticket marked as RTO successfully!"
    });
    
    // Reload completed tickets
    await ajaxLoadAllLeadInfo1({
      pagination: paginationControl1,
      filter: filter1.value
    });
    
    $q.loading.hide();
  } catch (error) {

    console.error('Error marking as RTO:', error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: error?.body?.message || "Failed to mark as RTO."
    });
  }
};

// Lifecycle hooks
onMounted(() => {
  // Load initial data
  loadingData({
    pagination: paginationControl,
    filter: filter.value,
    date: formData.date
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
  .row.items-center {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .row.items-center > * {
    margin-bottom: 8px;
    width: 100%;
  }
  
  .q-select.col-3,
  .q-input.col-5 {
    width: 100% !important;
  }
}
</style>