<template>
  <q-page padding class="text-grey-9">
    <div class="row bottom-border q-pa-sm items-center">
      <div class="col">
        <q-tabs
          v-model="inventoryOptionSelected"
          no-pane-border
          color="dark"
          inverted
          class="shadow-1"
        >
          <q-tab name="AllocatedDevices" label="Allocated Devices" />
          <q-tab name="UnAllocatedDevices" label="UnAllocated Devices" />
          <q-tab name="FaultyDevices" label="Faulty Devices" />

          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="AllocatedDevices">
              <AllocatedDevices @emittedForTotalSerialNumbers="fnAjaxAllocatedDevice" />
            </q-tab-panel>

            <q-tab-panel name="UnAllocatedDevices">
              <UnAllocatedDevices @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount" />
            </q-tab-panel>

            <q-tab-panel name="FaultyDevices">
              <FaultyDevices @fetchDeviceDetailsWithCount="fnAjaxFetchAllDeviceDetailsWithCount" />
            </q-tab-panel>
          </q-tab-panels>
        </q-tabs>
      </div>

      <!-- Optional download button -->
      <div class="col-auto">
        <q-btn
          @click="downloadInventorySummaryInfoMenu"
          outline
          color="grey-9"
          label="Download as Excel"
          class="q-mr-lg q-py-sm float-right"
          size="md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Components
import AllocatedDevices from "../../pages/inventory/AllocatedDevices.vue";
import UnAllocatedDevices from "../../pages/inventory/UnAllocatedDevices.vue";
import FaultyDevices from "../../pages/inventory/FaultyDevices.vue";

// Setup Vuex and Quasar
const store = useStore();
const $q = useQuasar();

// Tabs state
const inventoryOptionSelected = ref("AllocatedDevices");

// Methods
const fnAjaxAllocatedDevice = () => {
  // Implement or call existing logic
};

const fnAjaxFetchAllDeviceDetailsWithCount = () => {
  // Implement or call existing logic
};

const downloadInventorySummaryInfoMenu = async () => {
  try {
    $q.loading.show({ delay: 100 });
    await store.dispatch("InventoryCentral/REPORT_INVENTORY_SUMMARY");
    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Success, file has been downloaded",
      icon: "check",
    });
  } catch (error) {

    console.error(error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please try again",
      icon: "thumb_down",
    });
  }
};
</script>

<style scoped>
/* Optional styling */
</style>
