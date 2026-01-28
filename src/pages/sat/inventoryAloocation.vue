<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            class="shadow-1"
            inline-label
          >
            <q-tab name="internal" label="Bijlipay Regional Inventory" />
            <q-tab name="external" label="Phonepe Regional Inventory" />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            keep-alive
          >
            <q-tab-panel name="internal">
              <internalRegionalInventory />
            </q-tab-panel>

            <q-tab-panel name="external">
              <AggregatorInventory />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

import internalRegionalInventory from '../../pages/sat/internalRegionalInventory.vue'
import AggregatorInventory from '../../pages/sat/AggregatorInventory.vue'

/**
 * Reactive State
 * Default tab MUST match one of the q-tab names
 */
const inventoryOptionSelected = ref('internal')
</script>

<style>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
