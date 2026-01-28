<template>
  <q-page padding>
    <div>
      <!-- Header -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Inventory with SO/Bill Partner/Sub Region
      </div>

      <!-- Inventory Table -->
      <q-table
        table-class="customTableClass"
        :data="allInventoryWithSo"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="name"
      >
        <!-- Custom formatted dates -->
        <template v-slot:body-cell-created_at="props">
          {{ props.row.created_at ? formatDate(props.row.created_at) : "NA" }}
        </template>

        <template v-slot:body-cell-updated_at="props">
          {{ props.row.updated_at ? formatDate(props.row.updated_at) : "NA" }}
        </template>

        <!-- Top slot: search & download -->
        <template>
          <div class="col-md-5">
            <q-search
              v-model="filter"
              clearable
              color="grey-9"
              placeholder="Type.."
              float-label="Pod Number, Device Type, Serial Number"
              class="q-mr-lg q-py-sm"
            />
          </div>

          <div class="col-md-5">
            <q-btn
              square
              outline
              color="purple-9"
              label="Download as Excel"
              class="q-mr-lg q-py-sm float-right"
              size="md"
              @click="toggleDownloadModal"
            />
          </div>
        </template>
      </q-table>

      <!-- Download Inventory Modal -->
      <DownloadInventorySoList
        v-if="showDownloadModal"
        :propInventoryWithSo="showDownloadModal"
        @emitfnshowInventoryWithSo="toggleDownloadModal"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import DownloadInventorySoList from "../../components/inventory/DownloadInventorySoList.vue";

// Vuex store
const store = useStore();

// Reactive state
const filter = ref("");
const paginationControl = ref({
  rowsPerPage: 10
});
const showDownloadModal = ref(false);

// Computed getter for inventory
const allInventoryWithSo = computed(() => store.getters["InventoryWithSo/getAllInventoryWithSo"]);

// Table columns
const columns = [
  {
    name: "soname",
    required: true,
    label: "SO Name",
    align: "center",
    field: row => `${row.name} | ${row.soEmpId}`,
    sortable: true
  },
  {
    name: "pod_number",
    label: "Pod Number",
    field: "pod_number",
    align: "center",
    sortable: true
  },
  {
    name: "serial_number",
    label: "Serial Number",
    field: "serial_number",
    align: "center",
    sortable: true
  },
  {
    name: "device_name",
    required: true,
    label: "Device Type",
    align: "center",
    field: "device_name",
    sortable: true
  },
  {
    name: "created_at",
    required: true,
    label: "Create Date",
    align: "center",
    field: row => row.created_at
  },
  {
    name: "updated_at",
    required: true,
    label: "Receive Date",
    align: "center",
    field: row => row.updated_at
  },
  {
    name: "region_name",
    required: true,
    label: "BP Region",
    align: "center",
    field: "region_name",
    sortable: true
  }
];

// Lifecycle hook
onMounted(() => {
  store.dispatch("InventoryWithSo/FETCH_INVENTORY_WITH_SO");
  console.log("All Inventory with SO:", allInventoryWithSo.value);
});

// Methods
function toggleDownloadModal() {
  showDownloadModal.value = !showDownloadModal.value;
}

// Date formatting function
function formatDate(date) {
  return moment(date).format("DD/MM/YYYY");
}
</script>

<style scoped>
/* Optional custom styles */
</style>
