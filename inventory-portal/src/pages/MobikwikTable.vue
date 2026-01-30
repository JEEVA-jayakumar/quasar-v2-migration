<template>
  <q-page class="q-pa-md">
    <!-- Table Title -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-12 q-title text-weight-regular text-grey-9">
        Mobikwik Inventory Table
      </div>
    </div>

    <!-- Central Inventory -->
    <InventorySection
      title="Central Inventory"
      :items="inventoryData.centralItems"
      @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
    />

    <!-- Regional Inventory -->
    <InventorySection
      title="Inventory with regions"
      :items="inventoryData.regionalItems"
      @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
    />

    <!-- Merchant Inventory -->
    <InventorySection
      title="Inventory with Merchant"
      :items="inventoryData.merchantItems"
      @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
    />

    <!-- SO Inventory -->
    <InventorySection
      title="Inventory with SO"
      :items="inventoryData.billPartnerInventory"
      @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
    />

    <!-- Faulty Inventory -->
    <InventorySection
      title="Faulty Inventory"
      :items="inventoryData.faultyInventory"
      @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
    />

    <!-- Send to Repair -->
    <InventorySection
      title="Send to Repair"
      :items="inventoryData.sendtoRepair"
      @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
    />

    <!-- Bulk Upload Modal -->
    <openAddBulkDeviceModelComp
      v-if="openBulkUploadModal"
      :propOpenBulkUploadModal="openBulkUploadModal"
      @closeModel="fnOpenBulkUploadModal"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import InventorySection from "../components/InventorySection.vue"; // reusable inventory section
import openAddBulkDeviceModelComp from "../components/openAddBulkDeviceModelComp.vue";

const $q = useQuasar();
const store = useStore();

// Reactive state
const openBulkUploadModal = ref(false);
const inventoryData = ref({
  centralItems: [],
  regionalItems: [],
  merchantItems: [],
  billPartnerInventory: [],
  faultyInventory: [],
  sendtoRepair: []
});

// Active clicked item index
const activeItemId = ref(null);

// Vuex getters
const getAggregatorsCentralInventoryDashboardCount = store.getters[
  "InventoryCentral/getAggregatorsCentralInventoryDashboardCount"
];

// Vuex actions
const FETCH_AGGREGATORS_CENTRAL_INVENTORY_DASHBOARD_COUNT = store.dispatch.bind(
  store,
  "InventoryCentral/FETCH_AGGREGATORS_CENTRAL_INVENTORY_DASHBOARD_COUNT"
);
const FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE = store.dispatch.bind(
  store,
  "SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE"
);
const FETCH_ALL_SO_DATA = store.dispatch.bind(store, "SuperAdminUsers/FETCH_ALL_SO_DATA");

// Fetch inventory
async function getAllInventoryData() {
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
  try {
    await FETCH_AGGREGATORS_CENTRAL_INVENTORY_DASHBOARD_COUNT();
    const data = getAggregatorsCentralInventoryDashboardCount;

    inventoryData.value.centralItems = data.centralInventory || [];
    inventoryData.value.merchantItems = data.merchantInventory || [];
    inventoryData.value.regionalItems = data.regionalInventory || [];
    inventoryData.value.billPartnerInventory = data.billPartnerInventory || [];
    inventoryData.value.faultyInventory = data.faultyInventory || [];
    inventoryData.value.sendtoRepair = data.faultySentToRepair || [];
  } catch (err) {
    console.error(err);
  } finally {
    $q.loading.hide();
  }
}

// Fetch SO data
async function getAllSOData() {
  try {
    await FETCH_ALL_SO_DATA();
    // could store SO options if needed
  } catch (err) {
    console.error(err);
  }
}

// Handle click on inventory device
function ajaxLoadDataForCentralInventoryByDeviceIdFilter(index, deviceInfo) {
  activeItemId.value = index;
  fnAjaxPopulateAllDevicesList(deviceInfo);
}

// Fetch serial numbers by device
function fnAjaxPopulateAllDevicesList(deviceInfo) {
  const requestParams = {
    region: inventoryData.value.region,
    action: "FILTER_BY_DEVICE", // replace with actual constant
    device: deviceInfo.device.id
  };
  FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE(requestParams);
}

// On mounted
onMounted(() => {
  getAllInventoryData();
  getAllSOData();
});
</script>

<style scoped>
</style>
