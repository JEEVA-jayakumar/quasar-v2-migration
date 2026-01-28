<template>
  <q-page>
    <!-- Lead information popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Merchant Tracker
    </div>

    <!-- Table -->
    <q-table
      table-class="customTableClass"
      :rows="allMerchantTrackerInfo"
      :columns="columns"
      row-key="id"
      :filter="filter"
      v-model:pagination="paginationControl"
    >
      <!-- Date columns -->
      <template #body-cell-createdAt="props">
        <span>{{ formatDate(props.row.createdAt) }}</span>
      </template>
      <template #body-cell-shortleadDate="props">
        <span>{{ formatDate(props.row.shortleadDate) }}</span>
      </template>

      <!-- Lead Source column -->
      <template #body-cell-leadSource="props">
        <span>{{ props.row.leadSource.sourceName }}</span>
      </template>

      <!-- Lead ID clickable -->
      <template #body-cell-lead_id="props">
        <span class="label text-primary cursor-pointer" @click="toggleLeadInformation(props.row)">
          # {{ props.row.leadNumber }}
        </span>
      </template>

      <!-- Lead Status chips -->
      <template #body-cell-leadStatus="props">
        <q-chip
          v-if="props.row.leadStatus === $LEAD_STATUS_SHORT_LEAD"
          class="text-positive text-weight-bold"
        >
          Short Lead
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_WIP_LEAD"
          class="text-positive text-weight-bold"
        >
          WIP Lead
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_RSM_PENDING"
          class="text-amber-9 text-weight-bold"
        >
          RSM Pending
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_RSM_REJECT"
          class="text-negative text-weight-bold"
        >
          RSM Rejected
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_NH_PENDING"
          class="text-amber-9 text-weight-bold"
        >
          NH Pending
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_NH_REJECT"
          class="text-negative text-weight-bold"
        >
          NH Rejected
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMIT_TO_SAT_LEAD"
          class="text-positive text-weight-bold"
        >
          Submitted to SAT
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING"
          class="text-amber-9 text-weight-bold"
        >
          Data Entry Pending
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMITED_TO_MARS"
          class="text-positive text-weight-bold"
        >
          Submitted to MARS
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_MARS_REJECTED"
          class="text-negative text-weight-bold"
        >
          MARS Rejected
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_MARS_APPROVED"
          class="text-positive text-weight-bold"
        >
          MARS Approved
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_IMPLEMENT_PENDING"
          class="text-amber-9 text-weight-bold"
        >
          Implementation Pending
        </q-chip>
        <q-chip
          v-else-if="props.row.leadStatus === $LEAD_STATUS_IMPLEMENT_APPROVED"
          class="text-positive text-weight-bold"
        >
          Implementation Approved
        </q-chip>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

// Vuex store
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const filter = ref("");
const paginationControl = ref({ rowsPerPage: 10 });

// Columns for table
const columns = [
  { name: "createdAt", required: true, label: "Date (C)", align: "left", field: "createdAt", sortable: true },
  { name: "shortleadDate", required: true, label: "Submitted On", align: "center", field: "shortleadDate", sortable: true },
  { name: "leadSource", required: true, label: "Lead source", align: "left", field: row => row.leadSource.sourceName, sortable: false },
  { name: "lead_id", required: true, label: "Lead ID", align: "left", field: row => "# " + row.leadNumber, sortable: true },
  { name: "merchant_name", required: true, label: "Merchant Name", align: "left", field: "leadName", sortable: false },
  { name: "location", required: true, label: "Location", align: "left", field: "leadAddress", sortable: false },
  { name: "assignedTo", required: true, label: "SO Name", align: "left", field: row => (row.assignedTo ? row.assignedTo.name : "NA"), sortable: false },
  { name: "leadStatus", required: true, label: "Status", align: "left", field: "leadStatus", sortable: false }
];

// Computed: get Vuex data
const allMerchantTrackerInfo = computed(() => store.getters["BankOpsShortLead/getAllMerchantTrackerInfo"]);

// Fetch data on mount
onMounted(() => {
  store.dispatch("BankOpsShortLead/FETCH_ALL_OPEN_MERCHANT_TRACKER_DATA");
});

// Toggle lead info popup
function toggleLeadInformation(leadDetails = null) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
}

// Date formatting helper
function formatDate(dateStr) {
  if (!dateStr) return "";
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-GB", options);
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.text-primary {
  color: #6200ea; /* primary color for lead ID */
}
.customTableClass .q-table__container {
  /* optional table styling */
}
</style>
