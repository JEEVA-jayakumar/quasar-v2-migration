<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <!-- Quasar 2 Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            dense
            align="left"
            indicator-color="purple-9"
            class="shadow-1"
          >
            <q-tab name="internal" label="Bijlipay Lost Or Stolen" />
            <!-- <q-tab name="spareSo" label="Spare Parts So" /> -->
            <q-tab name="external" label="Phonepe Lost Or Stolen" />
          </q-tabs>

          <q-separator dark spaced />

          <!-- Tab content -->
          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="internal">
              <internalLostOrStolen />
            </q-tab-panel>

            <q-tab-panel name="external">
              <AggregatorsLostOrStolen />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";

// Components
import internalLostOrStolen from "../../pages/sat/internalLostOrStolen.vue";
import AggregatorsLostOrStolen from "../../pages/sat/AggregatorsLostOrStolen.vue";

export default {
  name: "InventoryAllocation",
  components: {
    internalLostOrStolen,
    AggregatorsLostOrStolen
  },
  setup() {
    // Composition API reactive data
    const inventoryOptionSelected = ref("internal");

    // Other reactive states
    const enableUploadInventoryBtn = ref(true);
    const toggleScanButton = ref(true);

    return {
      inventoryOptionSelected,
      enableUploadInventoryBtn,
      toggleScanButton
    };
  }
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
