<template>
  <q-page class="text-grey-9">
    <div class="row bottom-border q-pa-sm items-center">
      <div class="col">
        <!-- Tabs -->
        <q-tabs
          v-model="inventoryOptionSelected"
          dense
          class="shadow-1"
          color="dark"
          active-color="white"
          indicator-color="white"
          align="justify"
        >
          <q-tab name="internal" label="Bijlipay Service Request" />
          <q-tab name="external" label="Aggregator Service Request" />
        </q-tabs>

        <!-- Tab Panels -->
        <q-tab-panels v-model="inventoryOptionSelected" animated>
          <q-tab-panel name="internal">
            <internalserviceRequest />
          </q-tab-panel>

          <q-tab-panel name="external">
            <externalserviceRequest />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import internalserviceRequest from "../../components/sat/internalserviceRequest.vue";
import externalserviceRequest from "../../components/sat/externalserviceRequest.vue";

export default {
  name: "InventoryAllocation",
  components: {
    internalserviceRequest,
    externalserviceRequest
  },
  setup() {
    // Reactive state for selected tab
    const inventoryOptionSelected = ref("internal"); // default tab

    return {
      inventoryOptionSelected
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
