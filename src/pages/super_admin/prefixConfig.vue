<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">

          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            dense
            class="shadow-1"
            active-color="primary"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="prefix" label="Prefix Config" />
            <q-tab
              name="vasDevLs"
              label="LeadSource And Vas Device Config"
            />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            class="q-mt-sm"
          >
            <q-tab-panel name="prefix">
              <prefix />
            </q-tab-panel>

            <q-tab-panel name="vasDevLs">
              <vasDevLs />
            </q-tab-panel>
          </q-tab-panels>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/**
 * Vue 3 + Quasar 2.18
 * Node.js 20 compatible
 */

import { ref } from 'vue'

import prefix from '../../components/super_admin/prefixConfig.vue'
import vasDevLs from '../../components/super_admin/leadSourceVasDeviceConfig.vue'

/* ------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------ */
const inventoryOptionSelected = ref('prefix')


</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
