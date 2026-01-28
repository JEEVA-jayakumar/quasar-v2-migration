<template>
  <q-page padding>
    <!-- CRM Logs Modal -->
    <q-dialog
      :model-value="toggleModel"
      persistent
      @update:model-value="handleDialogUpdate"
      :maximized="false"
      :max-width="'75vw'"
    >
      <q-card style="min-width: 50vw; padding: 25px">
        <!-- Modal Header -->
        <div
          class="row items-center justify-between q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >
          <div class="col-auto q-title">CRM LOGS_Merchant Name</div>
          <q-btn
            flat
            color="red"
            round
            size="md"
            icon="close"
            @click="closeModal"
          />
        </div>

        <!-- CRM Logs Table -->
        <q-table
          flat
          :rows="crmLogs"
          :columns="columns"
          row-key="orderId"
          table-class="customTableClass"
          class="q-py-none"
          v-model:pagination="paginationControl"
          :rows-per-page-options="[5, 10, 20]"
        >
          <!-- Attempt No -->
          <template v-slot:body-cell-attemptno="props">
            {{ props.row.orderId ?? "NA" }}
          </template>

          <!-- Date & Time -->
          <template v-slot:body-cell-dateandtime="props">
            {{ formatDateTime(props.row.inputDate) }}
          </template>

          <!-- CRM Logs Remarks -->
          <template v-slot:body-cell-crmlogs="props">
            {{ props.row.remarks ?? "NA" }}
          </template>
        </q-table>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import moment from "moment";
import { useStore } from "vuex";

// Props - store in a variable
const props = defineProps({
  propShowUpdateCrmLogsView: Boolean,
  propRowDetails: Object
});

// Emits - store in a variable
const emit = defineEmits(["emitfnshowUpdateOpenedExternal"]);

// Quasar
const $q = useQuasar();

// Vuex Store
const store = useStore();
const getcrmLogsLists = computed(() => store.getters["serviceRequestPhonepeSat/getcrmLogsLists"]);

// Local State
const toggleModel = ref(false);
const crmLogs = ref([]);
const paginationControl = ref({
  rowsNumber: 5,
  page: 1,
  descending: false,
  rowsPerPage: 5
});
const formData = ref({
  subTicketsId: null
});

// Table Columns
const columns = [
  {
    name: "attemptno",
    required: true,
    label: "Attempt No",
    align: "left",
    sortable: false
  },
  {
    name: "dateandtime",
    required: true,
    label: "Date & Time",
    align: "left",
    sortable: false
  },
  {
    name: "crmlogs",
    required: true,
    label: "CRM Logs",
    align: "left",
    sortable: false
  }
];

// Watch for prop changes
watch(() => props.propShowUpdateCrmLogsView, (val) => {
  toggleModel.value = val;
});

// Handle dialog update
const handleDialogUpdate = (value) => {
  if (!value) {
    emit("emitfnshowUpdateOpenedExternal");
  }
};

// Lifecycle
onMounted(() => {
  toggleModel.value = props.propShowUpdateCrmLogsView;
  formData.value.subTicketsId = props.propRowDetails?.subTicketsList?.[0]?.id ?? null;
  fetchCrmLogs();
});

// Methods
function formatDateTime(inputDate) {
  if (!inputDate) return "NA";
  return moment.utc(inputDate).local().format("Do MMM YYYY, h:mm A");
}

async function fetchCrmLogs() {
  try {
    $q.loading.show({ message: "Loading CRM Logs..." });
    await store.dispatch("serviceRequestPhonepeSat/CRM_LOGS_LISTS", formData.value);

    // Assign orderId starting from 1
    crmLogs.value = getcrmLogsLists.value.map((item, index) => ({
      ...item,
      orderId: index + 1
    }));

    console.log("CRM Logs:", crmLogs.value);
    $q.loading.hide();
  } catch (error) {
    console.error("Error fetching CRM logs:", error);
    $q.loading.hide();
  }
}

function closeModal() {
  toggleModel.value = false;
  emit("emitfnshowUpdateOpenedExternal");
}
</script>

<style scoped>
.customTableClass {
  font-size: 0.95rem;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>