<template>
  <q-page>

    <!-- Table title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      POS Inventory
    </div>

    <!-- Common lead information popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table -->
    <q-table
      table-class="customTableClass"
      :data="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="name"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5,10,15,20]"
      @request="ajaxLoadAllLeadInfo"
    >

      <!-- Table top row (headers) -->
      <template v-slot:top-row="props">
        <q-tr :props="props">
          <q-th v-for="col in props.columns" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>

      <!-- Device Type column -->
      <template v-slot:body-cell-deviceType="props">
        <q-td :props="props">
          <span class="label text-primary">{{ props.row.device?.deviceName || 'NA' }}</span>
        </q-td>
      </template>

      <!-- Device Count column -->
      <template v-slot:body-cell-deviceCount="props">
        <q-td :props="props">{{ props.row?.deviceCount ?? 'NA' }}</q-td>
      </template>

      <!-- Date of Submission column -->
      <template v-slot:body-cell-dateofSubmission="props">
        <q-td :props="props">
          <span class="label">{{ formatDate(props.row.financeSubmissionDate) }}</span>
        </q-td>
      </template>

      <!-- Action column -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="props.row.status === 0"
            push
            class="q-mx-sm fixed-width-btn"
            color="positive"
            size="sm"
            @click="fnApproveFinance(props.row)"
          >
            Approve
          </q-btn>

          <q-btn
            v-if="props.row.status === 0"
            disable
            push
            class="q-mx-sm fixed-width-btn"
            color="purple-9"
            size="sm"
          >
            View Invoice Copy
          </q-btn>

          <q-btn
            v-if="props.row.status === 1"
            disable
            push
            class="q-mx-sm fixed-width-btn"
            color="negative"
            size="sm"
          >
            Already Approved
          </q-btn>

          <q-btn
            v-if="props.row.status === 1"
            highlight
            push
            class="q-mx-sm fixed-width-btn"
            color="purple-9"
            size="sm"
            @click="fnPDFViewModal(props.row)"
          >
            View Invoice Copy
          </q-btn>
        </q-td>
      </template>

      <!-- Top slot: Search & Download -->
      <template v-slot:top>
        <div class="col">
          <q-search
            clearable
            color="grey-9"
            v-model="filter"
            placeholder="Type.."
            float-label="Search by Request Number"
            class="q-mr-lg q-py-sm"
          />
        </div>
        <div class="col-md-6">
          <q-btn
            square
            outline
            color="purple-9"
            label="Download Report"
            class="q-mr-lg q-py-sm float-right"
            size="md"
            @click="downloadPOSReport"
          />
        </div>
      </template>

    </q-table>

    <!-- Download Report Modal -->
    <DownloadPOSInventoryReport
      v-if="propDeviceHistoryReport"
      :propDeviceHistoryReport="propDeviceHistoryReport"
      @emitfnshowDeviceHistory="downloadPOSReport"
    />

    <!-- Update POS Inventory Modal -->
    <UpdatePOSInventory
      v-if="propShowPosInventory"
      :propShowPosInventory="propShowPosInventory"
      :propRowDetails="propRowDetails"
      @emitfnshowPosInventory="fnApproveFinance"
    />

    <!-- PDF Viewer Modal -->
    <showPdfFinanceModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />

    <!-- Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="#61116a" :size="35" />
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import UpdatePOSInventory from '../../components/sat/UpdatePOSInventory.vue';
import showPdfFinanceModalComponent from '../../components/sat/showPdfFinanceModalComponent.vue';
import generalLeadInformation from '../../components/generalLeadInformation.vue';
import DownloadPOSInventoryReport from '../../components/inventory/DownloadPOSInventoryReport.vue';
import { date } from 'quasar';

// Vuex store
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const toggleshowPDFModal = ref(false);
const propDeviceHistoryReport = ref(false);
const propShowPosInventory = ref(false);
const propRowDetails = ref(null);
const PDFDetails = ref(null);
const toggleAjaxLoadFilter = ref(false);
const filter = ref('');

const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: 'createdAt',
  descending: false,
  rowsPerPage: 10
});

const tableData = ref([]);

// Table columns
const columns = [
  { name: 'deviceType', label: 'Device Type', align: 'left', field: row => row.device?.deviceName, sortable: true },
  { name: 'deviceCount', label: 'Device Count', align: 'left', field: row => row.deviceCount, sortable: false },
  { name: 'dateofSubmission', label: 'Date of Submission to Finance', align: 'left', field: 'dateofSubmission', sortable: true },
  { name: 'action', label: '', align: 'center', field: 'action', sortable: false }
];

// Getters
const getPosInventoryDatas = computed(() => store.getters['LostFinance/getPosInventoryDatas']);

// Format date
function formatDate(dateVal) {
  return dateVal ? date.formatDate(dateVal, 'DD MMM YYYY') : 'NA';
}

// Fetch data
async function ajaxLoadAllLeadInfo({ pagination, filter: filterVal } = {}) {
  toggleAjaxLoadFilter.value = true;
  store._vm.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ..' });

  try {
    await store.dispatch('LostFinance/FETCH_POS_INVENTORY_FINANCE', { pagination: pagination || paginationControl.value, filter: filterVal || filter.value });

    paginationControl.value = pagination || paginationControl.value;
    paginationControl.value.rowsNumber = getPosInventoryDatas.value.totalElements;
    paginationControl.value.page = getPosInventoryDatas.value.number + 1;
    tableData.value = getPosInventoryDatas.value.content;

    if (getPosInventoryDatas.value.sort) {
      paginationControl.value.sortBy = getPosInventoryDatas.value.sort[0].property;
      paginationControl.value.descending = getPosInventoryDatas.value.sort[0].ascending;
    }
  } finally {
    toggleAjaxLoadFilter.value = false;
    store._vm.$q.loading.hide();
  }
}

// Approve POS Finance
function fnApproveFinance(rowDetails) {
  propShowPosInventory.value = true;
  propRowDetails.value = rowDetails;
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
}

// PDF Modal
function fnPDFViewModal(documentUrl) {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
}

// Download Report
function downloadPOSReport() {
  propDeviceHistoryReport.value = !propDeviceHistoryReport.value;
}

// Toggle lead information popup
function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
}

// Load data on mount
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
});
</script>

<style scoped>
.fixed-width-btn {
  width: 121px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.fullscreen.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
