<template>
  <q-page class="q-pa-md">
    <!-- Table 1: Change Management CMS List -->
    <div>
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Changing Management
      </div>

      <q-table
        title="Change Management"
        :rows="tableData"
        :columns="columns"
        row-key="name"
        :filter="filter1"
        v-model:pagination="paginationControlchange"
        :rows-per-page-options="[5,10,15]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllCMS"
        table-class="customTableClass"
        class="q-py-none"
      >
        <template v-slot:top>
          <div class="col-md-5">
            <q-search
              clearable
              v-model="filter1"
              placeholder="Type.."
              debounce="600"
              color="grey-9"
              float-label="Search By MID/TID/Merchant Name"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>

        <!-- Updated Date Column -->
        <template v-slot:body-cell-updatedAt="props">
          {{ formatDate(props.row.leadInformation.updatedAt) }}
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-Status="props">
          <span v-if="props.row.leadInformation.cmsLeadStatus === 23" class="label text-positive">submitted to Mars</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 11" class="label text-amber">Mars Approved</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 15" class="label text-positive">NH Approved</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 16" class="label text-purple">CMS RSM Pending</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 17" class="label text-negative">CMS RSM Reject</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 25" class="label text-negative">MARS Reject</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 18" class="label text-amber">CMS NH Pending</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 19" class="label text-negative">CMS NH Reject</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 20" class="label text-purple">CMS Finance Pending</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 21" class="label text-negative">CMS Finance Rejected</span>
          <span v-else-if="props.row.leadInformation.cmsLeadStatus === 22" class="label text-positive">CMS Finance Approved</span>
          <span v-else class="label text-negative">Pending</span>
        </template>

        <!-- Action Column -->
        <template v-slot:body-cell-action="props">
          <q-btn
            v-if="[22, 15, 25].includes(props.row.leadInformation.cmsLeadStatus)"
            highlight
            push
            outline
            color="purple-9"
            size="sm"
            @click="$router.push(`/sat/change/management/${props.row.tid}/edit/data`)"
          >
            Data Entry
          </q-btn>

          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 21"
            highlight
            push
            outline
            color="purple-9"
            size="sm"
            @click="$router.push(`/sat/change/management/${props.row.tid}/edit/data/rejectfinance`)"
          >
            Data Entry
          </q-btn>

          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 17"
            highlight
            push
            outline
            color="purple-9"
            size="sm"
            @click="$router.push(`/sat/change/management/${props.row.tid}/edit/data/reject`)"
          >
            Data Entry
          </q-btn>

          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 19"
            highlight
            push
            outline
            color="purple-9"
            size="sm"
            @click="$router.push(`/sat/change/management/${props.row.tid}/edit/data/rejectrsm`)"
          >
            Data Entry
          </q-btn>

          <q-btn
            v-else-if="props.row.leadInformation.cmsLeadStatus === 23"
            disabled
            highlight
            push
            color="purple-9"
            size="sm"
          >
            Submitted To Mars
          </q-btn>

          <q-btn
            v-else
            disabled
            highlight
            push
            outline
            color="purple-9"
            size="sm"
          >
            Data Entry
          </q-btn>
        </template>
      </q-table>
    </div>

    <!-- Table 2: Enter TID/MID -->
    <div class="q-mt-lg">
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Enter TID/MID for changing merchant data name
      </div>

      <q-table
        title="Change Management"
        :rows="tableData1"
        :columns="columns1"
        row-key="name"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5,10,15,20]"
        :loading="toggleAjaxLoadFilter1"
        @request="ajaxLoadAllLeadInfo"
        class="q-py-none"
      >
        <template v-slot:top>
          <div class="col-md-5">
            <q-search
              clearable
              v-model="filter"
              placeholder="Type.."
              debounce="600"
              color="grey-9"
              float-label="Search By MID/TID/Merchant Name"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>

        <template v-slot:body-cell-tid="props">
          {{ props.row.deviceStatus !== 6 ? "NA" : props.row.tid }}
        </template>

        <template v-slot:body-cell-action="props">
          <q-btn
            highlight
            push
            outline
            color="purple-9"
            size="sm"
            @click="$router.push(`/sat/change/management/${props.row.tid}/edit/data`)"
          >
            Data Entry
          </q-btn>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

// Store
const store = useStore();
const $q = useQuasar();

// Reactive State
const filter = ref("");
const filter1 = ref("");
const toggleAjaxLoadFilter = ref(false);
const toggleAjaxLoadFilter1 = ref(false);

const paginationControl = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: "mid",
  descending: false,
  rowsPerPage: 5,
});

const paginationControlchange = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: "mid",
  descending: false,
  rowsPerPage: 5,
});

const tableData = ref([]);
const tableData1 = ref([]);

// Date formatting function
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  };
  
  return `${getOrdinalSuffix(day)} ${month} ${year}`;
};

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

// Vuex Getters
const getChangeManagementList = computed(() => store.getters["ChangeManagementList/getChangeManagementList"]);
const getCMSList = computed(() => store.getters["CMSList/getCMSList"]);

// Methods
function ajaxLoadAllLeadInfo({ pagination, filter }) {
  $q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
  store.dispatch("ChangeManagementList/CHANGE_MANAGEMENT_LIST", { pagination, filter })
    .then(() => {
      paginationControl.value = pagination;
      paginationControl.value.rowsNumber = getChangeManagementList.value.totalElements;
      paginationControl.value.page = getChangeManagementList.value.number + 1;
      tableData1.value = getChangeManagementList.value.content;
      $q.loading.hide();
    })
    .catch(() => $q.loading.hide());
}

function ajaxLoadAllCMS({ pagination, filter }) {
  $q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
  store.dispatch("CMSList/CMS_LIST", { pagination, filter })
    .then(() => {
      paginationControlchange.value = pagination;
      paginationControlchange.value.rowsNumber = getCMSList.value.totalElements;
      paginationControlchange.value.page = getCMSList.value.number + 1;
      tableData.value = getCMSList.value.content;
      $q.loading.hide();
    })
    .catch(() => $q.loading.hide());
}

// Lifecycle
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
  ajaxLoadAllCMS({ pagination: paginationControlchange.value, filter: filter1.value });
});
</script>

<style scoped>
.label {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>