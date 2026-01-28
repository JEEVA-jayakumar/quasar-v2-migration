<template>
  <q-page padding>

    <!-- CMS Table -->
    <div>
      <q-table
        title="Change Management"
        :rows="tableData"
        :columns="columns"
        row-key="tid"
        :filter="filter1"
        v-model:pagination="paginationControlChange"
        :rows-per-page-options="[5, 10, 15]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllCMS"
        class="q-py-none customTableClass"
      >
        <!-- Updated Date Column -->
        <template #body-cell-updatedAt="props">
          {{ formatDate(props.row.leadInformation.updatedAt) }}
        </template>

        <!-- Status Column -->
        <template #body-cell-Status="props">
          <q-badge
            :color="statusColor(props.row.leadInformation.cmsLeadStatus)"
            :label="statusLabel(props.row.leadInformation.cmsLeadStatus)"
          />
        </template>

        <!-- Action Column -->
        <template #body-cell-action="props">
          <q-btn
            v-if="[22,15,25].includes(props.row.leadInformation.cmsLeadStatus)"
            color="purple-9"
            outline
            push
            size="sm"
            @click="navigateToEdit(props.row.tid, 'data')"
            label="Data Entry"
          />
          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 21"
            color="purple-9"
            outline
            push
            size="sm"
            @click="navigateToEdit(props.row.tid, 'rejectfinance')"
            label="Data Entry"
          />
          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 17"
            color="purple-9"
            outline
            push
            size="sm"
            @click="navigateToEdit(props.row.tid, 'reject')"
            label="Data Entry"
          />
          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 19"
            color="purple-9"
            outline
            push
            size="sm"
            @click="navigateToEdit(props.row.tid, 'rejectrsm')"
            label="Data Entry"
          />
          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 23"
            color="purple-9"
            push
            disable
            label="Submitted To Mars"
          />
          <q-btn
            v-else
            color="purple-9"
            outline
            push
            disable
            label="Data Entry"
          />
        </template>

        <!-- Table Top Filter -->
        <template #top>
          <div class="row items-center q-pa-sm bottom-border">
            <div class="col-md-5">
              <q-input
                filled
                clearable
                v-model="filter1"
                debounce="600"
                placeholder="Search By MID/TID/Merchant Name"
                color="grey-9"
                dense
                outlined
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Secondary Table -->
    <div class="q-mt-lg">
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Enter TID/MID for changing merchant data name
      </div>

      <q-table
        title="Change Management"
        :rows="tableData1"
        :columns="columns1"
        row-key="tid"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="toggleAjaxLoadFilter1"
        @request="ajaxLoadAllLeadInfo"
        class="q-py-none"
      >
        <template #body-cell-action="props">
          <q-btn
            color="purple-9"
            outline
            push
            size="sm"
            @click="navigateToEdit(props.row.tid, 'data')"
            label="Data Entry"
          />
        </template>

        <!-- Table Top Filter -->
        <template #top>
          <div class="row items-center q-pa-sm bottom-border">
            <div class="col-md-5">
              <q-input
                filled
                clearable
                v-model="filter"
                debounce="600"
                placeholder="Search By MID/TID/Merchant Name"
                color="grey-9"
                dense
                outlined
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import moment from "moment";

const $q = useQuasar();
const store = useStore();

// Reactive state
const tableData = ref([]);
const tableData1 = ref([]);
const filter = ref("");
const filter1 = ref("");
const toggleAjaxLoadFilter = ref(false);
const toggleAjaxLoadFilter1 = ref(false);

const paginationControlChange = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: "mid",
  descending: false,
  rowsPerPage: 5,
});
const paginationControl = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: "mid",
  descending: false,
  rowsPerPage: 5,
});

// Columns
const columns = [
  { name: "leadInformation.leadName", label: "Merchant Name", align: "left", field: row => row.leadInformation.leadName, sortable: true },
  { name: "Address", label: "Address", align: "left", field: row => row.leadInformation.leadAddress },
  { name: "leadInformation.device.deviceName", label: "Device", align: "left", field: row => row.leadInformation.device.deviceName, sortable: true },
  { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
  { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
  { name: "updatedAt", label: "Updated Date", align: "left", field: row => row.leadInformation.updatedAt, sortable: true },
  { name: "Status", label: "Status", align: "left", field: row => row.leadInformation.leadStatus, sortable: true },
  { name: "action", label: "", align: "left", field: "action" },
];

const columns1 = [
  { name: "leadInformation.leadName", label: "Merchant Name", align: "left", field: row => row.leadInformation.leadName },
  { name: "Address", label: "Address", align: "left", field: row => row.leadInformation.leadAddress, sortable: true },
  { name: "leadInformation.device.deviceName", label: "Device", align: "left", field: row => row.leadInformation.device.deviceName },
  { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
  { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
  { name: "action", label: "Select", align: "center", field: "action" },
];

// Utility functions
const formatDate = (date) => moment(date).format("Do MMM Y");

const statusLabel = (status) => {
  switch (status) {
    case 23: return "Submitted to Mars";
    case 11: return "Mars Approved";
    case 15: return "NH Approved";
    case 16: return "CMS RSM Pending";
    case 17: return "CMS RSM Reject";
    case 25: return "MARS Reject";
    case 18: return "CMS NH Pending";
    case 19: return "CMS NH Reject";
    case 20: return "CMS Finance Pending";
    case 21: return "CMS Finance Rejected";
    case 22: return "CMS Finance Approved";
    default: return "Pending";
  }
};

const statusColor = (status) => {
  switch (status) {
    case 15: case 22: case 23: return "positive";
    case 11: case 18: return "amber";
    case 16: return "purple";
    case 17: case 19: case 21: case 25: return "negative";
    default: return "grey";
  }
};

const navigateToEdit = (tid, path = "data") => {
  $q.router.push(`/sat/change/management/${tid}/edit/${path}`);
};

// Fetch functions
const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({ spinnerColor: "purple-9", message: "Fetching data ..." });
  try {
    await store.dispatch("ChangeManagementList/CHANGE_MANAGEMENT_LIST", { pagination, filter });
    const list = store.getters["ChangeManagementList/getChangeManagementList"];
    paginationControl.value.rowsNumber = list.totalElements;
    paginationControl.value.page = list.number + 1;
    tableData1.value = list.content;
  } finally {
    $q.loading.hide();
  }
};

const ajaxLoadAllCMS = async ({ pagination, filter }) => {
  $q.loading.show({ spinnerColor: "purple-9", message: "Fetching data ..." });
  try {
    await store.dispatch("CMSList/CMS_LIST", { pagination, filter });
    const list = store.getters["CMSList/getCMSList"];
    paginationControlChange.value.rowsNumber = list.totalElements;
    paginationControlChange.value.page = list.number + 1;
    tableData.value = list.content;
  } finally {
    $q.loading.hide();
  }
};

// Lifecycle
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
  ajaxLoadAllCMS({ pagination: paginationControlChange.value, filter: filter1.value });
});
</script>

<style scoped>
.customTableClass .q-table__top {
  border-bottom: 1px solid #e0e0e0;
}
</style>
