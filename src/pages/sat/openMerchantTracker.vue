<template>
  <q-page class="capitalize">
    <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
      <!-- Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :lead-information="addtnLeadInformation"
        :prop-toggle-lead-information-pop="propToggleLeadInformation"
        @close-lead-information="toggleLeadInformation"
      />

      <!-- Table title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Open Merchant Tracker/Lead Tracker
      </div>

      <!-- Open Merchant Tracker Table -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
      >
        <!-- Custom Table Body -->
        <template v-slot:body-cell-createdAt="props">
          <span class="label">{{ formatDate(props.row.createdAt) }}</span>
        </template>

        <template v-slot:body-cell-submitteSATDate="props">
          <span class="label">{{ formatDate(props.row.submitteSATDate) }}</span>
        </template>

        <template v-slot:body-cell-applicationNumber="props">
          <span class="label capitalize">
            {{ props.row.applicationNumber ?? "NA" }}
          </span>
        </template>

        <template v-slot:body-cell-leadName="props">
          <span class="label capitalize">{{ props.row.leadName }}</span>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <span class="label text-primary cursor-pointer" @click="toggleLeadInformation(props.row)">
            # {{ props.row.leadNumber }}
          </span>
        </template>

        <template v-slot:body-cell-createdBy="props">
          <span class="label">
            {{ props.row.createdBy.name }} | {{ props.row.createdBy.employeeID }}
          </span>
        </template>

        <template v-slot:body-cell-leadAddress="props">
          <span class="label">{{ props.row.leadAddress }}</span>
        </template>

        <template v-slot:body-cell-verifiedStatus="props">
          {{ props.row.verifiedStatus }}
        </template>

        <!-- Table Top: Search & Filters -->
        <template v-slot:top>
          <div class="col-5">
            <q-search
              v-model="filter"
              clearable
              separator
              color="grey-9"
              placeholder="Type.."
              float-label="Search by Merchant Name, Lead ID"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="#61116a" size="35" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import dayjs from "dayjs";

export default {
  name: "OpenMerchantTracker",
  components: { generalLeadInformation },

  setup() {
    // Reactive data
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const toggleAjaxLoadFilter = ref(false);
    const paginationControl = ref({ rowsPerPage: 10 });
    const filter = ref("");
    const tableData = ref([]);
    const excelTableData = ref([]);
    const model = ref("");

    // Vuex Actions & Getters
    const { FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA } = mapActions("OpenMerchantTracker", [
      "FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA",
    ]);
    const { TOGGLE_COMMON_LOADER } = mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]);

    const { getAggOpenMerchantTracker } = mapGetters("OpenMerchantTracker", [
      "getAggOpenMerchantTracker",
    ]);

    // Table columns
    const columns = [
      { name: "createdAt", label: "Created Date", align: "left", field: "createdAt", sortable: true },
      { name: "submitteSATDate", label: "Submitted Date", align: "center", field: "submitteSATDate", sortable: true },
      { name: "applicationNumber", label: "MRL app no", align: "left", field: "applicationNumber", sortable: true },
      { name: "leadNumber", label: "Lead ID", align: "left", field: "leadNumber", sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: "leadName", sortable: false },
      { name: "leadAddress", label: "Location", align: "left", field: "leadAddress", sortable: false },
      { name: "createdBy", label: "SO Name", align: "left", field: "createdBy", sortable: false },
      { name: "verifiedStatus", label: "Status", align: "left", field: "verifiedStatus", sortable: false },
    ];

    // Format Date with Dayjs
    const formatDate = (date) => {
      return date ? dayjs(date).format("Do MMM YYYY") : "NA";
    };

    // Load Table Data
    const ajaLoadDataAllopenAggMerchantTrackerData = async () => {
      TOGGLE_COMMON_LOADER(true);
      try {
        await FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA();
        tableData.value = getAggOpenMerchantTracker.value;

        excelTableData.value = getAggOpenMerchantTracker.value.map((value) => ({
          "Created Date": value.createdAt,
          "Submitted Date": value.submitteSATDate,
          "Lead ID": value.id,
          State: value.state,
          "SO Name": value.createdBy.name,
          Status: value.verifiedStatus,
        }));
      } catch (e) {
        console.error(e);
      } finally {
        TOGGLE_COMMON_LOADER(false);
      }
    };

    // Pull to refresh
    const PullToRefresh = async (done) => {
      try {
        await FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA();
        tableData.value = getAggOpenMerchantTracker.value;

        excelTableData.value = getAggOpenMerchantTracker.value.map((value) => ({
          "Created Date": value.createdAt,
          "Submitted Date": value.submitteSATDate,
          "Lead ID": value.id,
          State: value.state,
          "SO Name": value.createdBy.name,
          Status: value.verifiedStatus,
        }));
      } catch (e) {
        console.error(e);
      } finally {
        done();
      }
    };

    // Toggle Lead Info Popup
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) addtnLeadInformation.value = leadDetails;
    };

    onMounted(() => {
      ajaLoadDataAllopenAggMerchantTrackerData();
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      toggleAjaxLoadFilter,
      paginationControl,
      filter,
      tableData,
      excelTableData,
      model,
      columns,
      formatDate,
      toggleLeadInformation,
      PullToRefresh,
    };
  },
};
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
