<template>
  <q-page class="text-grey-9">
    <div class="row q-pa-sm items-center">
      <div class="col">
        <q-tabs
          v-model="inventoryOptionSelected"
          no-pseudo-focus
          no-caps
          class="shadow-1"
          dense
          active-color="primary"
        >
          <q-tab name="sparePartsInventory" label="Spare Parts Inventory" />
          <q-tab name="sparePodList" label="Spare Pod List" />

          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="sparePartsInventory">
              <sparePartsAddStocks @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount" />
            </q-tab-panel>
            <q-tab-panel name="sparePodList">
              <sparePartsPodList @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount" />
            </q-tab-panel>
          </q-tab-panels>
        </q-tabs>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

import sparePartsAddStocks from "../../pages/inventory/sparePartsAddStocks.vue";
import sparePartsPodList from "../../pages/inventory/sparePartsPodList.vue";

export default {
  name: "InventoryAllocation",
  components: {
    sparePartsAddStocks,
    sparePartsPodList,
  },
  setup() {
    const store = useStore();

    // Reactive state
    const inventoryOptionSelected = ref("sparePartsInventory");
    const toggleAjaxLoadFilter = ref(false);
    const enableUploadInventoryBtn = ref(true);
    const toggleScanButton = ref(true);

    // Fetch all device details with count
    const fnAjaxFetchAllDeviceDetailsWithCount = async () => {
      try {
        toggleAjaxLoadFilter.value = true;
        const regionId = JSON.parse(localStorage.getItem("u_i")).region.id;

        await store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT", regionId);

        const requestParams = {
          region: regionId,
          action: window.$REGIONAL_INVENTORY_FILTER_ACTION_DEVICE,
        };

        await store.dispatch("SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams);

      } catch (error) {

        console.error(error);
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    // Initial load
    onMounted(() => {
      fnAjaxFetchAllDeviceDetailsWithCount();
    });

    return {
      inventoryOptionSelected,
      enableUploadInventoryBtn,
      toggleScanButton,
      toggleAjaxLoadFilter,
      fnAjaxFetchAllDeviceDetailsWithCount,
    };
  },
};
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
