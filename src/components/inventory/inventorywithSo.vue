<template>
  <q-page class="q-pa-md">

    <!-- Title -->
    <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Inventory with SO/Bill Partner/Sub Region
    </div>

    <!-- Table -->
    <q-table
      v-model:pagination="paginationControl"
      :rows="inventoryRows"
      :columns="columns"
      :filter="filter"
      row-key="name"
      table-class="customTableClass"
    >
      <!-- Top slot: Filter and download -->
      <template v-slot:top>
        <div class="row items-center q-my-sm">

          <!-- Filter Search -->
          <div class="col-md-5">
            <q-input
              v-model="filter"
              debounce="300"
              clearable
              color="grey-9"
              placeholder="Pod Number, Device Type"
              label="Search"
              class="q-mr-lg"
            />
          </div>

          <!-- Download Button -->
          <div class="col-md-5 text-right">
            <q-btn
              square
              outline
              color="purple-9"
              label="Download as Excel"
              @click="downloadInventoryWithSoList"
            />
          </div>

        </div>
      </template>

      <!-- Body cells with formatting -->
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ props.row.created_at ? formatDate(props.row.created_at) : "NA" }}
        </q-td>
      </template>

      <template v-slot:body-cell-updated_at="props">
        <q-td :props="props">
          {{ props.row.updated_at ? formatDate(props.row.updated_at) : "NA" }}
        </q-td>
      </template>
    </q-table>

    <!-- Download Inventory Component -->
    <DownloadInventorySoList
      v-if="showDownloadModal"
      :propInventoryWithSo="showDownloadModal"
      @emitfnshowInventoryWithSo="toggleDownloadModal"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
// import { useQuasar } from "quasar";
import { useStore } from "vuex";
import moment from "moment";
import DownloadInventorySoList from "../../components/inventory/DownloadInventorySoList.vue";

/* ---------------- Quasar & Vuex ---------------- */
// const $q = useQuasar();
const store = useStore();

/* ---------------- Reactive State ---------------- */
const filter = ref("");
const showDownloadModal = ref(false);
const paginationControl = ref({ rowsPerPage: 10 });

/* ---------------- Table Data ---------------- */
const inventoryRows = computed(() => store.getters["InventoryWithSo/getAllInventoryWithSo"] || []);

/* ---------------- Table Columns ---------------- */
const columns = [
  {
    name: "soname",
    label: "SO Name",
    field: row => `${row.name} | ${row.soEmpId}`,
    align: "center",
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
    label: "Device Type",
    field: "device_name",
    align: "center",
    sortable: true
  },
  {
    name: "created_at",
    label: "Create Date",
    field: "created_at",
    align: "center",
    sortable: true
  },
  {
    name: "updated_at",
    label: "Receive Date",
    field: "updated_at",
    align: "center",
    sortable: true
  },
  {
    name: "region_name",
    label: "BP Region",
    field: "region_name",
    align: "center",
    sortable: true
  }
];

/* ---------------- Lifecycle ---------------- */
onMounted(() => {
  store.dispatch("InventoryWithSo/FETCH_INVENTORY_WITH_SO");
});

/* ---------------- Methods ---------------- */
const formatDate = (value) => {
  return moment(value).format("DD/MM/YYYY");
};

const toggleDownloadModal = () => {
  showDownloadModal.value = !showDownloadModal.value;
};

const downloadInventoryWithSoList = () => {
  toggleDownloadModal();
};
</script>

<style scoped>
/* Optional: existing custom styles */
</style>
