<template>
  <q-page>
    <!-- Lead information popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table header -->
    <div class="row bottom-border items-center">
      <div class="col-md-8 q-title q-px-lg q-py-md text-weight-regular text-grey-9">
        Short Lead
      </div>
      <div class="col-md-4 q-px-lg q-py-sm" align="right">
        <q-btn
          no-caps
          push
          outline
          color="purple-9"
          to="/bank/ops/assign/short/lead/new"
        >
          Add New Lead
        </q-btn>
      </div>
    </div>

    <!-- Table -->
    <q-table
      table-class="customTableClass"
      :rows="allShortLeadInfo"
      :columns="columns"
      row-key="id"
      :filter="filter"
      v-model:pagination="paginationControl"
    >
      <!-- Date column -->
      <template #body-cell-date="props">
        <span class="label">{{ formatDate(props.row.createdAt) }}</span>
      </template>

      <!-- Lead ID column clickable -->
      <template #body-cell-lead_id="props">
        <span class="label text-primary cursor-pointer" @click="toggleLeadInformation(props.row)">
          # {{ props.row.leadNumber }}
        </span>
      </template>

      <!-- Top slot: search/filter -->
      <template #top>
        <div class="col-5">
          <q-search
            v-model="filter"
            clearable
            color="grey-9"
            placeholder="Type.."
            float-label="Search by SO name, Merchant Name, Lead ID"
            class="q-mr-lg q-py-sm"
          />
        </div>
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

// Reactive variables
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const filter = ref("");
const paginationControl = ref({ rowsPerPage: 10 });

// Table columns
const columns = [
  { name: "date", required: true, label: "Date", align: "left", field: "createdAt", sortable: true },
  { name: "lead_id", required: true, label: "Lead ID", align: "left", field: "id", sortable: true },
  { name: "me_name", required: true, label: "ME Name", align: "left", field: row => row.leadName, sortable: false },
  { name: "address", required: true, label: "Address", align: "left", field: row => row.leadAddress, sortable: true },
  { name: "state", required: true, label: "State", align: "left", field: "state", sortable: false },
  { name: "device_type", required: true, label: "Device Type", align: "left", field: row => row.device.deviceName, sortable: false },
  { name: "device_count", required: true, label: "Device Count", align: "left", field: "deviceCount", sortable: true },
  { name: "lead_source", required: true, label: "Lead Source", align: "left", field: row => row.leadSource.sourceName, sortable: true },
  { name: "assigned_to", required: true, label: "Assigned To", align: "left", field: row => row.assignedOpsTo.name, sortable: false }
];

// Computed: get data from Vuex
const allShortLeadInfo = computed(() => store.getters["BankOpsShortLead/getAllShortLeadInfo"]);

// Lifecycle: fetch data
onMounted(() => {
  store.dispatch("BankOpsShortLead/FETCH_SHORT_LEAD_DATA");
});

// Methods
function toggleLeadInformation(leadDetails = null) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) {
    addtnLeadInformation.value = leadDetails;
  }
}

// Date formatting helper
function formatDate(dateStr) {
  if (!dateStr) return "";
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-GB", options); // "Do MMM Y" equivalent
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.text-primary {
  color: #6200ea; /* example primary color */
}
.customTableClass .q-table__container {
  /* optional table styling */
}
</style>
