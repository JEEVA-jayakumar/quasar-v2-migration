<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">

          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            indicator-color="primary"
            align="left"
            class="shadow-1"
          >
            <q-tab
              name="internal"
              label="Bijlipay Global Serial"
            />
            <!-- <q-tab name="spareSo" label="Spare Parts SO" /> -->
            <q-tab
              name="external"
              label="Phonepe Global Serial"
            />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            keep-alive
          >
            <q-tab-panel name="internal">
              <InternalGlobalSearchFilter />
            </q-tab-panel>

            <q-tab-panel name="external">
              <AggregatorGlobalSearchFilter />
            </q-tab-panel>
          </q-tab-panels>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

import InternalGlobalSearchFilter from "../../pages/sat/InternalGlobalSearchFilter.vue";
import AggregatorGlobalSearchFilter from "../../pages/sat/AggregatorGlobalSearchFilter.vue";

/**
 * Default selected tab
 * MUST match one of the q-tab names
 */
const inventoryOptionSelected = ref("internal");


</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
