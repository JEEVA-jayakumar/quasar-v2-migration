<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">

          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            active-color="dark"
            indicator-color="dark"
            class="shadow-1"
          >
            <q-tab
              name="internal"
              label="Bijlipay Implementation Queue"
            />
            <q-tab
              name="external"
              label="Aggregator Implementation Queue"
            />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            keep-alive
          >
            <q-tab-panel name="internal">
              <internalimplementationRequest />
            </q-tab-panel>

            <q-tab-panel name="external">
              <externalimplementationRequest />
            </q-tab-panel>
          </q-tab-panels>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/**
 * Vue 3 + Quasar v2.18
 * Node.js 20 compatible
 */

import { ref } from 'vue'

import internalimplementationRequest from '../../components/sat/internalimplementationRequest.vue'
import externalimplementationRequest from '../../components/sat/externalimplementationRequest.vue'

// active tab
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
