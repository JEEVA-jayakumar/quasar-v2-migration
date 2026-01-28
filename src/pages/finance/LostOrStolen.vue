<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="inventoryOptionSelected"
            no-caps
            dense
            class="shadow-1"
            color="dark"
            indicator-color="primary"
            align="left"
          >
            <!-- Tabs -->
            <q-tab name="internal" label="Bijlipay Lost Or Stolen" />
            <q-tab name="external" label="Phonepe Lost Or Stolen" />

            <!-- Tab Panes -->
            <q-tab-panels v-model="inventoryOptionSelected" animated>
              <q-tab-panel name="internal">
                <LostFinance />
              </q-tab-panel>

              <q-tab-panel name="external">
                <PhonePeFinanceLostOrStolen />
              </q-tab-panel>
            </q-tab-panels>
          </q-tabs>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import LostFinance from '../../pages/finance/LostFinance.vue';
import PhonePeFinanceLostOrStolen from '../../pages/finance/PhonePeFinanceLostOrStolen.vue';

// Reactive state
const inventoryOptionSelected = ref('internal'); // default selected tab
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
