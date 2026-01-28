<template>
  <q-page class="capitalize">
    <q-pull-to-refresh :distance="30" @refresh="PullToRefresh" inline>
      <!-- Common lead information popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :lead-information="addtnLeadInformation"
        :prop-toggle-lead-information-pop="propToggleLeadInformation"
        @close-lead-information="toggleLeadInformation"
      />

      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Open Merchant Tracker/Lead Tracker
      </div>

      <!-- Table -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        row-key="id"
        v-model:pagination="paginationControl"
      >
        <!-- Body cell custom templates -->
        <template v-slot:body-cell-createdAt="props">
          <span class="label">{{ formatDate(props.row.createdAt) }}</span>
        </template>

        <template v-slot:body-cell-submitteSATDate="props">
          <span class="label">{{ formatDate(props.row.updatedAt) }}</span>
        </template>

        <template v-slot:body-cell-applicationNumber="props">
          <span class="label capitalize">{{ props.row.applicationNumber }}</span>
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
          <span class="label">{{ props.row.assignedTo?.name ?? "NA" }}</span>
        </template>

        <template v-slot:body-cell-leadAddress="props">
          <span class="label">{{ props.row.leadAddress ?? "NA" }}</span>
        </template>

        <template v-slot:body-cell-verifiedStatus="props">
          {{ props.row.verifiedStatus }}
        </template>

        <!-- Table Top Slot -->
        <template v-slot:top>
          <div class="col-5">
            <q-input
              v-model="filter"
              outlined
              clearable
              placeholder="Type.."
              label="Search by Merchant Name, Lead ID"
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
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "aggOpenMerchantTracker",
  components: { generalLeadInformation },

  setup(_, { root }) {
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const toggleAjaxLoadFilter = ref(false);
    const paginationControl = ref({ rowsPerPage: 10 });
    const filter = ref("");
    const tableData = ref([]);
    const excelTableData = ref([]);

    const columns = [
      { name: "createdAt", label: "Created Date", align: "left", field: row => row.createdAt ?? "NA", sortable: true },
      { name: "updatedAt", label: "Submitted Date", align: "center", field: row => row.updatedAt ?? "NA", sortable: true },
      { name: "applicationNumber", label: "MRL app no", align: "left", field: row => row.applicationNumber ?? "NA", sortable: true },
      { name: "leadNumber", label: "Lead ID", align: "left", field: row => row.leadNumber ?? "NA", sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: row => row.leadName ?? "NA", sortable: false },
      { name: "leadAddress", label: "Location", align: "left", field: row => row.leadAddress ?? "NA", sortable: false },
      { name: "createdBy", label: "SO Name", align: "left", field: row => row.assignedTo?.name ?? "NA", sortable: false },
      { name: "verifiedStatus", label: "Status", align: "left", field: row => row.verifiedStatus ?? "NA", sortable: false },
    ];

    const { getOpenMerchantTracker } = root.$store.getters["OpenMerchantTracker"];
    const { FETCH_ALL_OPEN_MERCHANT_TRACKER_DATA } = root.$store.dispatch;

    // Methods
    const formatDate = date => {
      if (!date) return "NA";
      return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const loadOpenMerchantData = async () => {
      toggleAjaxLoadFilter.value = true;
      try {
        await FETCH_ALL_OPEN_MERCHANT_TRACKER_DATA();
        tableData.value = getOpenMerchantTracker();
        excelTableData.value = getOpenMerchantTracker().map(v => ({
          "Created Date": v.createdAt,
          "Submitted Date": v.submitteSATDate,
          "Lead ID": v.id,
          State: v.state,
          "SO Name": v.createdBy?.name,
          Status: v.verifiedStatus
        }));
      } catch (e) {
        console.error(e);
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    const toggleLeadInformation = leadDetails => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const PullToRefresh = async done => {
      try {
        await FETCH_ALL_OPEN_MERCHANT_TRACKER_DATA();
        tableData.value = getOpenMerchantTracker();
        excelTableData.value = getOpenMerchantTracker().map(v => ({
          "Created Date": v.createdAt,
          "Submitted Date": v.submitteSATDate,
          "Lead ID": v.id,
          State: v.state,
          "SO Name": v.createdBy?.name,
          Status: v.verifiedStatus
        }));
      } catch (e) {
        console.error(e);
      } finally {
        done();
      }
    };

    onMounted(() => {
      loadOpenMerchantData();
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      toggleAjaxLoadFilter,
      paginationControl,
      filter,
      tableData,
      excelTableData,
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
  background: rgba(255, 255, 255, 0.7);
}
</style>
