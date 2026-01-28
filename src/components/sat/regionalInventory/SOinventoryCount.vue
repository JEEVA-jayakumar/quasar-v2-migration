<template>
  <div class="row">
    <!-- Left Column: Regional & SO Inventory -->
    <div class="col-md-4" style="border-right: 1px solid #ccc;">
      <div class="q-ma-md">
        <!-- Region -->
        <div class="q-mb-md q-subheading">Region: {{ computedUserRegion }}</div>

        <!-- Inventory with Region -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="q-pa-none">
            <div class="q-body-1">
              <strong><h6>Inventory with Region</h6></strong>
            </div>
          </q-card-section>

          <!-- Total Devices -->
          <q-card-section
            class="cursor-pointer bg-grey-5 text-center"
            :class="activeItemId === REGIONAL_INVENTORY.ALL_DEVICES ? 'shadow-5' : 'shadow-0'"
            @click="loadDevicesTableData(REGIONAL_INVENTORY.ALL_DEVICES, { name: 'Total Devices' })"
          >
            <div>Count</div>
            <div><big>{{ getAllRegionalInventoryCount }}</big></div>
          </q-card-section>
        </q-card>

        <!-- Inventory Categories -->
        <div class="row q-gutter-md">
          <q-card
            v-for="(item, index) in regionalInventoryCategories"
            :key="index"
            flat
            class="col cursor-pointer text-center bg-grey-5"
            :class="activeItemId === item.id ? 'shadow-5' : 'shadow-0'"
            @click="loadDevicesTableData(item.id, { name: item.name })"
          >
            <q-card-section>{{ item.name }}</q-card-section>
            <q-card-section>
              <div>Count</div>
              <div><big>{{ item.count }}</big></div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Inventory with SO -->
      <div class="q-ma-md">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="q-pa-none">
            <div class="q-body-1">
              <strong><h6>Inventory with SO</h6></strong>
            </div>
          </q-card-section>

          <!-- Total Devices SO -->
          <q-card-section
            class="cursor-pointer bg-grey-5 text-center"
            :class="activeItemId === REGIONAL_INVENTORY.ALL_DEVICES ? 'shadow-5' : 'shadow-0'"
            @click="loadDevicesTableData(REGIONAL_INVENTORY.ALL_DEVICES, { name: 'Total Devices' })"
          >
            <div>Count</div>
            <div><big>{{ getAllSoInventoryCount }}</big></div>
          </q-card-section>
        </q-card>

        <!-- SO Inventory Categories -->
        <div class="row q-gutter-md">
          <q-card
            v-for="(item, index) in soInventoryCategories"
            :key="index"
            flat
            class="col cursor-pointer text-center bg-grey-5"
            :class="activeItemId === item.id ? 'shadow-5' : 'shadow-0'"
            @click="loadDevicesTableData(item.id, { name: item.name })"
          >
            <q-card-section>{{ item.name }}</q-card-section>
            <q-card-section>
              <div>Count</div>
              <div><big>{{ item.count }}</big></div>
            </q-card-section>
          </q-card>

          <!-- Dynamic Devices by Color -->
          <q-card
            v-for="(item, index) in getAllRegionalInventoryDeviceDetailsWithCount.inventryCount"
            :key="'device-'+index"
            flat
            class="col cursor-pointer text-center"
            :style="{ background: item.device.colorCode }"
            :class="activeItemId === index ? 'shadow-5' : 'shadow-0'"
            @click="loadDevicesTableData(index, item)"
          >
            <q-card-section>{{ item.device.deviceName }}</q-card-section>
            <q-card-section>
              <div>Count</div>
              <div><big>{{ item.count }}</big></div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Right Column: Table -->
    <div class="col-md-2">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="text-weight-regular q-subheading q-py-sm text-grey-9">
          {{ inventoryCountTableTitle }}
        </div>
      </div>

      <q-table
        title="Lead Validation"
        flat
        bordered
        table-class="customTableClass"
        class="q-py-none"
        :rows="getAllRegionalInventorySerialNumbersByDevice"
        :columns="columnData"
        row-key="name"
        :filter="filter"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
      >
        <template v-slot:top>
          <div class="col-md-8">
            <q-input
              outlined
              dense
              clearable
              v-model="filter"
              placeholder="Search by device name, serial no"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { QCard, QCardSection, QTable, QInput, QIcon } from "quasar";

// Constants for Inventory IDs (to avoid magic numbers)
const REGIONAL_INVENTORY = {
  ALL_DEVICES: 1,
  PENDING_ALLOCATION: 2,
  ALLOCATED: 3,
  DAMAGED: 4,
  INBOUND: 5,
  INVENTORY_SO: 6,
};

// Vuex store
const store = useStore();

// Reactive state
const toggleAjaxLoadFilter = ref(false);
const paginationControl = ref({ rowsPerPage: 10 });
const inventoryCountTableTitle = ref("Total Devices");
const activeItemId = ref(false);
const filter = ref("");

// Computed getters
const getAllRegionalInventoryDeviceDetailsWithCount = computed(
  () => store.getters["SAT_RegionalInventoryAllocation/getAllRegionalInventoryDeviceDetailsWithCount"]
);
const getAllRegionalInventorySerialNumbersByDevice = computed(
  () => store.getters["SAT_RegionalInventoryAllocation/getAllRegionalInventorySerialNumbersByDevice"]
);
const getAllInventorywithsoDeviceDetailsWithCount = computed(
  () => store.getters["SAT_RegionalInventoryAllocation/getAllInventorywithsoDeviceDetailsWithCount"]
);

// Computed User Region
const computedUserRegion = computed(() => {
  return JSON.parse(localStorage.getItem("u_i")).region.regionAreaName;
});

// Column definitions
const columnData = [
  { name: "device_type", label: "Device Type", align: "left", field: row => row.device.deviceName, sortable: true },
  { name: "serialNumber", label: "Serial Number", align: "left", field: row => row.serialNumber, sortable: true }
];

// Derived Counts
const getAllRegionalInventoryCount = computed(() => {
  return getAllRegionalInventoryDeviceDetailsWithCount.value.inventryCount.reduce((sum, item) => sum + item.count, 0);
});
const getAllSoInventoryCount = computed(() => {
  return getAllInventorywithsoDeviceDetailsWithCount.value.inventryCountBillPartner.reduce(
    (sum, item) => sum + item.count,
    0
  );
});

// Categories for cards
const regionalInventoryCategories = computed(() => [
  {
    id: REGIONAL_INVENTORY.PENDING_ALLOCATION,
    name: "Pending Allocation",
    count: getAllRegionalInventoryDeviceDetailsWithCount.value.pendingDeviceCount.count
  },
  {
    id: REGIONAL_INVENTORY.ALLOCATED,
    name: "Allocated Devices",
    count: getAllRegionalInventoryDeviceDetailsWithCount.value.allocatedCount.count
  },
  {
    id: REGIONAL_INVENTORY.DAMAGED,
    name: "Damaged Devices",
    count: getAllRegionalInventoryDeviceDetailsWithCount.value.damageDeviceCount.count
  },
  {
    id: REGIONAL_INVENTORY.INBOUND,
    name: "Inbound Devices",
    count: getAllRegionalInventoryDeviceDetailsWithCount.value.inbountDeviceCount.count
  }
]);

const soInventoryCategories = computed(() => [
  {
    id: REGIONAL_INVENTORY.PENDING_ALLOCATION,
    name: "Pending Allocation",
    count: getAllInventorywithsoDeviceDetailsWithCount.value.pendingDeviceCountBillPartner.count
  },
  {
    id: REGIONAL_INVENTORY.ALLOCATED,
    name: "Allocated Devices",
    count: getAllInventorywithsoDeviceDetailsWithCount.value.allocatedCountBillPartner.count
  },
  {
    id: REGIONAL_INVENTORY.DAMAGED,
    name: "Damaged Devices",
    count: getAllInventorywithsoDeviceDetailsWithCount.value.damageDeviceCountBillPartner.count
  },
  {
    id: REGIONAL_INVENTORY.INBOUND,
    name: "Inbound Devices",
    count: getAllInventorywithsoDeviceDetailsWithCount.value.inbountDeviceCountBillPartner.count
  }
]);

// Lifecycle
onMounted(() => {
  store.dispatch("SAT_RegionalInventoryAllocation/getAllInventorywithsoDeviceDetailsWithCount");
});

// Methods
function loadDevicesTableData(itemIndex, item) {
  toggleAjaxLoadFilter.value = true;
  activeItemId.value = itemIndex;

  inventoryCountTableTitle.value = item.name || item.device?.deviceName || "Devices";

  let regionId = JSON.parse(localStorage.getItem("u_i")).region.id;
  let requestParams = { region: regionId };

  switch (itemIndex) {
    case REGIONAL_INVENTORY.ALL_DEVICES:
      // emit event for all devices
      break;
    case REGIONAL_INVENTORY.DAMAGED:
      requestParams.action = Math.abs(REGIONAL_INVENTORY.DAMAGED);
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams);
      break;
    case REGIONAL_INVENTORY.PENDING_ALLOCATION:
      requestParams.action = Math.abs(REGIONAL_INVENTORY.PENDING_ALLOCATION);
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams);
      break;
    case REGIONAL_INVENTORY.INBOUND:
      requestParams.action = Math.abs(REGIONAL_INVENTORY.INBOUND);
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams);
      break;
    case REGIONAL_INVENTORY.ALLOCATED:
      requestParams.action = Math.abs(REGIONAL_INVENTORY.ALLOCATED);
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams);
      break;
    default:
      // Device-specific
      requestParams.action = REGIONAL_INVENTORY.FILTER_DEVICE;
      requestParams.device = item.device?.id;
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams);
      break;
  }

  toggleAjaxLoadFilter.value = false;
}
</script>
