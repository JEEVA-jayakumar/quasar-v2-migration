<template>
  <q-page padding>
    <div>
      <!-- Header -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Inventory with Reseller
      </div>

      <!-- Inventory Table -->
      <q-table
        table-class="customTableClass"
        :data="allInventoryWithResellar"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="name"
      >
        <!-- Custom formatted dates -->
        <template v-slot:body-cell-createDate="props">
          {{ props.row.createDate ? formatDate(props.row.createDate) : "NA" }}
        </template>

        <template v-slot:body-cell-modifyDate="props">
          {{ props.row.modifyDate ? formatDate(props.row.modifyDate) : "NA" }}
        </template>

        <!-- Top slot: search & download -->
        <template v-slot:top>
          <div class="col-md-5">
            <q-search
              v-model="filter"
              clearable
              color="grey-9"
              placeholder="Type.."
              float-label="Pod Number, Device Type"
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
      <DownloadInventoryReseller
        v-if="showDownloadModal"
        :propInventoryResellerList="showDownloadModal"
        @emitfnshowInventoryResellerList="toggleDownloadModal"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import DownloadInventoryReseller from "../components/DownloadInventoryReseller.vue";

// Vuex Store
const store = useStore();

// Reactive state
const filter = ref("");
const paginationControl = ref({
  rowsPerPage: 10
});
const showDownloadModal = ref(false);

// Computed getters from Vuex
const allInventoryWithResellar = computed(() => store.getters["InventoryWithResellar/getAllInventoryWithResellar"]);

// Table columns
const columns = [
  {
    name: "soname",
    required: true,
    label: "Reseller Name",
    align: "center",
    field: row => row.user.name,
    sortable: true
  },
  {
    name: "podNumber",
    label: "Pod Number",
    field: "podnumber",
    align: "center",
    sortable: true
  },
  {
    name: "serialnumber",
    label: "Serial Number",
    field: "serialnumber",
    align: "center",
    sortable: true
  },
  {
    name: "createDate",
    required: true,
    label: "Create Date",
    align: "center",
    field: row => row.createDate
  },
  {
    name: "modifyDate",
    required: true,
    label: "Received Date",
    align: "center",
    field: row => row.modifyDate
  },
  {
    name: "device",
    required: true,
    label: "Device Type",
    align: "center",
    field: row => row.device.deviceName,
    sortable: true
  },
  {
    name: "region",
    required: true,
    label: "BP Region",
    align: "center",
    field: row => row.region.regionGroup.regionName,
    sortable: true
  }
];

// Lifecycle hook
onMounted(() => {
  store.dispatch("InventoryWithResellar/FETCH_INVENTORY_WITH_RESELLAR");
});

// Methods
function toggleDownloadModal() {
  showDownloadModal.value = !showDownloadModal.value;
}

// Date formatting
function formatDate(date) {
  return moment(date).format("DD/MM/YYYY");
}
</script>

<style scoped>
/* Optional custom styles */
</style>