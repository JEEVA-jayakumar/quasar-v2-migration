<template>
  <q-page class="q-pa-md">
    <!-- Title -->
    <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Device History
    </div>

    <!-- Table -->
    <q-table
      class="customTableClass q-py-none"
      :rows="tableData"
      :columns="columns"
      row-key="SerialNumber"
      :filter="filter"
      :rows-per-page-options="[100, 200, 300, 400, 500]"
      v-model:pagination="pagination"
      :loading="loading"
      @request="ajaxLoadAllLeadInfo"
    >
      <!-- Top slot -->
      <template v-slot:top>
        <div class="row full-width items-center bottom-border">
          <div class="col-md-3">
            <q-input
              v-model="filter"
              dense
              clearable
              type="search"
              color="grey-9"
              placeholder="Search by MID, TID"
              class="q-mr-lg q-py-sm"
            />
          </div>

          <div class="col-md-6 text-right">
            <q-btn
              square
              outline
              color="purple-9"
              label="Download as Excel"
              class="q-mr-lg q-py-sm"
              size="md"
              @click="downloaddeviceHist"
            />
          </div>
        </div>
      </template>

      <!-- Installed Date -->
      <template v-slot:body-cell-installationDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.installationDate) }}
        </q-td>
      </template>

      <!-- De-installed Date -->
      <template v-slot:body-cell-deInstallationDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.deInstallationDate) }}
        </q-td>
      </template>
    </q-table>

    <!-- Download Modal -->
    <DownloadAggregatorsDeviceHistoryReport
      v-if="showDeviceHistoryReport"
      :propDeviceHistoryReport="showDeviceHistoryReport"
      @emitfnshowDeviceHistory="downloaddeviceHist"
    />

    <!-- Fullscreen Loader -->
    <div v-if="loading" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" size="35" />
    </div>
  </q-page>
</template>

<script setup>
/* ------------------------------------
   Imports
------------------------------------ */
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import moment from "moment";
import DownloadAggregatorsDeviceHistoryReport from
  "../../components/inventory/DownloadAggregatorsDeviceHistoryReport.vue";

/* ------------------------------------
   Setup
------------------------------------ */
const $q = useQuasar();
const store = useStore();

/* ------------------------------------
   State
------------------------------------ */
const filter = ref("");
const loading = ref(false);
const showDeviceHistoryReport = ref(false);

const tableData = ref([]);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  sortBy: "deInstallationDate",
  descending: false
});

/* ------------------------------------
   Table Columns
------------------------------------ */
const columns = [
  {
    name: "SerialNumber",
    label: "Device Serial Number",
    field: "SerialNumber",
    align: "left",
    sortable: true
  },
  {
    name: "mId",
    label: "MID",
    field: "mId",
    align: "left",
    sortable: true
  },
  {
    name: "tId",
    label: "TID",
    field: "tId",
    align: "left",
    sortable: true
  },
  {
    name: "BpRegion",
    label: "BpRegion",
    field: "BpRegion",
    align: "left",
    sortable: true
  },
  {
    name: "installationDate",
    label: "Installed Date",
    field: "installationDate",
    align: "center",
    sortable: true
  },
  {
    name: "deInstallationDate",
    label: "De-Installed Date",
    field: "deInstallationDate",
    align: "center",
    sortable: true
  }
];

/* ------------------------------------
   Methods
------------------------------------ */
function formatDate(value) {
  if (!value) return "NA";
  return moment(value).format("Do MMM YYYY");
}

async function ajaxLoadAllLeadInfo({ pagination, filter }) {
  loading.value = true;

  try {
    await store.dispatch("devicehistory/AGGREGATORS_DEVICE_WITH_HISTORY", {
      pagination,
      filter
    });

    const response =
      store.getters["devicehistory/getAggregatorsDeviceWithHistory"];

    tableData.value = response.content || [];

    pagination.rowsNumber = response.totalElements;
    pagination.page = response.number + 1;

    if (response.sort?.length) {
      pagination.sortBy = response.sort[0].property;
      pagination.descending = !response.sort[0].ascending;
    }
  } catch {

    $q.notify({
      type: "negative",
      message: "Failed to load device history"
    });
  } finally {
    loading.value = false;
  }
}

function downloaddeviceHist() {
  showDeviceHistoryReport.value = !showDeviceHistoryReport.value;
}

/* ------------------------------------
   Lifecycle
------------------------------------ */
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: pagination.value,
    filter: filter.value
  });
});
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
}
</style>
