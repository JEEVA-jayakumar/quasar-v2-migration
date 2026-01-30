<template>
  <q-page>
    <div>
      <!-- Page Header -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator POD List
      </div>

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        :data="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        row-key="name"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Action Column -->
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              dense
              no-caps
              label="Modify"
              icon="far fa-edit"
              size="md"
              flat
              class="text-light-blue"
              @click="fnShowEditRegion(props.row)"
            />
          </q-td>
        </template>

        <!-- Created At Column -->
        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ props.row.createdAt ? moment(props.row.createdAt).format("Do MMM Y") : "NA" }}
          </q-td>
        </template>

        <!-- Received At Column -->
        <template v-slot:body-cell-receivedAt="props">
          <q-td :props="props">
            {{ props.row.receivedAt ? moment(props.row.receivedAt).format("Do MMM Y") : "NA" }}
          </q-td>
        </template>

        <!-- Top slot: search & download -->
        <template v-slot:top>
          <div class="row q-mb-sm items-center">
            <div class="col-md-5">
              <q-search
                clearable
                v-model="filter"
                separator
                color="grey-9"
                placeholder="Type.."
                float-label="Search By Pod Number, BP Region"
                class="q-mr-lg q-py-sm"
              />
            </div>
            <div class="col-md-6">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm float-right"
                size="md"
                @click="downloadPodList"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Download POD Modal -->
      <AggregatorDownloadPod
        v-if="propPodListDatas"
        :propPodListDatas="propAggregator"
        :propData="propAggregator"
        @emitfnshowPodList="downloadPodList"
      />

      <!-- Edit POD Modal -->
      <AggregatorEditRegion
        v-if="propShowEditRegion"
        :propShowEditRegion="propShowEditRegion"
        :propRowDetails="propRowDetails"
        @emitfnshowEditRegion="fnShowEditRegion"
      />

      <!-- Loading Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="#61116a" :size="35" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import moment from "moment";
import AggregatorEditRegion from "../components/AggregatorEditRegion.vue";
import AggregatorDownloadPod from "../components/AggregatorDownloadPod.vue";

const $q = useQuasar();
const store = useStore();

// Reactive State
const tableData = ref([]);
const filter = ref("");
const toggleAjaxLoadFilter = ref(false);
const propShowEditRegion = ref(false);
const propPodListDatas = ref(false);
const propRowDetails = ref(null);
const propAggregator = ref(null);

const paginationControl = reactive({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: "createdAt",
  descending: false
});

// Computed getters
const getAllAggregatorPodList = computed(() => store.getters["AggregatorPodLists/getAllAggregatorPodList"]);

// Columns
const columns = [
  {
    name: "podNumber",
    label: "Pod Number",
    field: "podNumber",
    align: "center",
    sortable: true
  },
  {
    name: "device",
    label: "Device Type",
    align: "center",
    field: row => row.AggregatorDevice?.deviceName ?? "NA",
    sortable: true
  },
  {
    name: "receivedAt",
    label: "Received Date",
    align: "center",
    field: row => row.receivedAt ? moment(row.receivedAt).format("DD/MM/YYYY") : "NA",
    sortable: true
  },
  {
    name: "DeviceList",
    label: "Create Date",
    align: "center",
    field: row => row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "NA",
    sortable: true
  },
  {
    name: "region",
    label: "BPRegion",
    align: "center",
    field: row => row.region?.regionAreaName ?? "NA",
    sortable: true
  },
  {
    name: "action",
    label: "Modify POD",
    align: "left",
    field: "action",
    sortable: false
  }
];

// Fetch data
const ajaxLoadAllLeadInfo = async ({ pagination, filter } = {}) => {
  toggleAjaxLoadFilter.value = true;
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });

  try {
    await store.dispatch("AggregatorPodLists/FETCH_AGGREGATOR_POD_LIST", { pagination, filter });

    // Update table & pagination
    tableData.value = getAllAggregatorPodList.value.content;
    paginationControl.rowsNumber = getAllAggregatorPodList.value.totalElements;
    paginationControl.page = getAllAggregatorPodList.value.number + 1;

    if (getAllAggregatorPodList.value.sort?.length) {
      paginationControl.sortBy = getAllAggregatorPodList.value.sort[0].property;
      paginationControl.descending = !getAllAggregatorPodList.value.sort[0].ascending;
    }

    $q.loading.hide();
    toggleAjaxLoadFilter.value = false;
  } catch {
    $q.loading.hide();
    toggleAjaxLoadFilter.value = false;
  }
};

// Download POD List
const downloadPodList = (val) => {
  propPodListDatas.value = !propPodListDatas.value;
  propAggregator.value = val ?? getAllAggregatorPodList.value;
};

// Edit POD row
const fnShowEditRegion = (rowDetails) => {
  propShowEditRegion.value = !propShowEditRegion.value;
  if (rowDetails) propRowDetails.value = rowDetails;
};

// On mounted
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
});
</script>

<style scoped>
.customTableClass {
  border-radius: 4px;
}

.q-mr-lg {
  margin-right: 1rem;
}

.q-py-sm {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
}
</style>
