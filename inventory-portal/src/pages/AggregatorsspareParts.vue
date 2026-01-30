<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row q-pa-sm items-center">
        <div class="col">
          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            class="shadow-1"
            dense
          >
            <q-tab
              name="PhonepespareParts"
              label="Aggregator Spare Parts"
            />
            <q-tab
              name="PhonepesparePodList"
              label="Aggregator Spare Pod List"
            />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            class="q-mt-md"
          >
            <q-tab-panel name="PhonepespareParts">
              <PhonepesparePartsAddStocks
                @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount"
              />
            </q-tab-panel>

            <q-tab-panel name="PhonepesparePodList">
              <PhonepesparePartsPodList
                @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

import PhonepesparePartsAddStocks from '../../pages/inventory/PhonepesparePartsAddStocks.vue'
import PhonepesparePartsPodList from '../../pages/inventory/PhonepesparePartsPodList.vue'

// ------------------------------------------------------------------
// Store
// ------------------------------------------------------------------
const store = useStore()

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
const inventoryOptionSelected = ref('PhonepespareParts')
const toggleAjaxLoadFilter = ref(false)

// ------------------------------------------------------------------
// Constants (keep same behavior as existing app)
// ------------------------------------------------------------------
const REGIONAL_INVENTORY_FILTER_ACTION_DEVICE =
  store.state?.REGIONAL_INVENTORY_FILTER_ACTION_DEVICE ??
  'DEVICE'

// ------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------
const fnAjaxFetchAllDeviceDetailsWithCount = async () => {
  toggleAjaxLoadFilter.value = true

  try {
    const userInfo = JSON.parse(localStorage.getItem('u_i'))
    const regionId = userInfo?.region?.id

    if (!regionId) return

    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT',
      regionId
    )

    const requestParams = {
      region: regionId,
      action: REGIONAL_INVENTORY_FILTER_ACTION_DEVICE
    }

    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE',
      requestParams
    )
  } catch (error) {

    console.error('Inventory fetch failed:', error)
  } finally {
    toggleAjaxLoadFilter.value = false
  }
}

// ------------------------------------------------------------------
// Lifecycle
// ------------------------------------------------------------------
onMounted(() => {
  fnAjaxFetchAllDeviceDetailsWithCount()
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
