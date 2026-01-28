<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">

          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            class="shadow-1"
            color="dark"
            align="left"
            narrow-indicator
          >
            <q-tab name="Replacement" label="Replacement / Recovery" />
            <q-tab name="DeviceHistory" label="Device History" />
            <q-tab name="DeviceFSE" label="Device With FSE / SO" />
            <q-tab name="DeviceBP" label="Device With BP Regions" />
            <q-tab name="InventorySummary" label="Inventory Summary" />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            keep-alive
          >
            <q-tab-panel name="Replacement">
              <Replacement />
            </q-tab-panel>

            <q-tab-panel name="DeviceHistory">
              <DeviceHistory />
            </q-tab-panel>

            <q-tab-panel name="DeviceFSE">
              <DeviceFSE />
            </q-tab-panel>

            <q-tab-panel name="DeviceBP">
              <DeviceBP />
            </q-tab-panel>

            <q-tab-panel name="InventorySummary">
              <InventorySummary />
            </q-tab-panel>
          </q-tab-panels>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'

import Replacement from '../../pages/inventory/Replacement.vue'
import DeviceHistory from '../../pages/inventory/DeviceHistory.vue'
import DeviceFSE from '../../pages/inventory/DeviceFSE.vue'
import DeviceBP from '../../pages/inventory/DeviceBP.vue'
import InventorySummary from '../../pages/inventory/InventorySummary.vue'

export default defineComponent({
  name: 'InventoryAllocation',

  components: {
    Replacement,
    DeviceHistory,
    DeviceFSE,
    DeviceBP,
    InventorySummary
  },

  setup () {
    // default tab (must match one of the q-tab names)
    const inventoryOptionSelected = ref('Replacement')

    return {
      inventoryOptionSelected
    }
  }
})
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
