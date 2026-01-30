<template>
  <q-page class="q-pa-md">
    <q-pull-to-refresh :handler="PullToRefresh" inline>
      <!-- Table Title -->
      <div class="col-12 capitalize q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Moved To Scrap
      </div>

      <!-- Table -->
      <q-table
        table-class="customTableClass"
        :columns="columns"
        :data="tableData"
        color="grey-9"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top slot: search and download button -->
        <template #top>
          <div class="row items-center q-px-md q-py-sm">
            <div class="col-md-5">
              <q-search
                v-model="filterSearch"
                placeholder="Type..."
                float-label="Search Using Device Serial Number"
                clearable
                color="grey-9"
                class="q-mr-lg q-py-sm"
              />
            </div>

            <div class="col-md-5 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                size="md"
                @click="downloadMovedToScrapList"
              />
            </div>
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Download Report Modal -->
    <DownloadMovedToScrap
      v-if="propMovedToScrapList"
      :propMovedToScrapList="propMovedToScrapList"
      @emitfnshowMovedToScrapList="downloadMovedToScrapList"
    />

    <!-- Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import DownloadMovedToScrap from "../components/DownloadMovedToScrap.vue";
import generalLeadInformation from "../components/generalLeadInformation.vue";

const $q = useQuasar();
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const propMovedToScrapList = ref(false);
const toggleAjaxLoadFilter = ref(false);
const filterSearch = ref("");
const addtnLeadInformation = ref(null);

const paginationControl = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10,
  sortBy: "updatedAt",
  descending: true,
});

const tableData = ref([]);

// Table columns
const columns = [
  {
    name: "serialNumber",
    required: true,
    label: "Device Serial Number",
    align: "left",
    field: "serialNumber",
    sortable: true,
  },
  {
    name: "deviceName",
    required: true,
    label: "Device Type",
    align: "left",
    field: row => (row.device ? row.device.deviceName : "NA"),
    sortable: false,
  },
  {
    name: "updatedAt",
    required: true,
    label: "Updated Date",
    align: "center",
    field: row => new Date(row.updatedAt).toLocaleDateString("en-GB"),
    sortable: false,
  },
  {
    name: "lostOrStolenRemarks",
    required: true,
    label: "Remarks",
    align: "left",
    field: "lostOrStolenRemarks",
    sortable: false,
  },
];

// Vuex getters
const getMovedToScrapDetails = computed(() => store.getters["SendToRepair/getMovedToScrapDetails"]);

// Vuex actions
const FETCH_ALL_MOVED_TO_SCRAP_DATA = (payload) =>
  store.dispatch("SendToRepair/FETCH_ALL_MOVED_TO_SCRAP_DATA", payload);

// Methods

function downloadMovedToScrapList() {
  propMovedToScrapList.value = !propMovedToScrapList.value;
}

function PullToRefresh(done) {
  done();
}

// Load table data
async function ajaxLoadAllLeadInfo({ pagination, filter }) {
  toggleAjaxLoadFilter.value = true;
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data..." });

  try {
    await FETCH_ALL_MOVED_TO_SCRAP_DATA({ pagination, filter });

    paginationControl.value = {
      ...paginationControl.value,
      page: getMovedToScrapDetails.value.number + 1,
      rowsNumber: getMovedToScrapDetails.value.totalElements,
      sortBy: getMovedToScrapDetails.value.sort?.[0]?.property || "updatedAt",
      descending: getMovedToScrapDetails.value.sort?.[0]?.ascending ?? true,
    };

    tableData.value = getMovedToScrapDetails.value.content || [];
  } catch (err) {
    console.error(err);
  } finally {
    toggleAjaxLoadFilter.value = false;
    $q.loading.hide();
  }
}

// Toggle Lead Info Modal
function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) {
    addtnLeadInformation.value = leadDetails;
  }
}

// On mounted
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value });
});
</script>

<style scoped>
</style>
