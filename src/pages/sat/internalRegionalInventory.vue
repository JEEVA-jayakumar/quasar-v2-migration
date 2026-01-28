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
            <q-tab name="spare" label="Spare Parts" />
            <q-tab name="count" label="Inventory Count" />
            <q-tab name="dispatch" label="Dispatched Inventory" />
            <q-tab name="damage" label="Add Damaged Devices" />
            <q-tab name="allocatetoso" label="Allocate to SO" />
            <q-tab name="AllocateSotoSo" label="Allocate SO to SO" />
            <q-tab name="inventorywithResellar" label="Allocate to Reseller" />
            <q-tab name="inventorywithSo" label="Inventory with SO" />
            <q-tab name="inventorywithResellarDetails" label="Inventory with Reseller" />
            <q-tab name="simStatus" label="Sim Status" />
            <q-tab name="deviceAllocationRequest" label="REQUEST" />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            keep-alive
          >
            <q-tab-panel name="spare">
              <spareParts
                @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount"
              />
            </q-tab-panel>

            <q-tab-panel name="count">
              <inventoryCount
                @emittedForTotalSerialNumbers="fnAjaxFetchAllDeviceDetailsWithCount"
              />
            </q-tab-panel>

            <q-tab-panel name="dispatch">
              <dispatchedInventory
                @fetchDeviceDetailsWithCount="fnAjaxFetchAllDeviceDetailsWithCount"
              />
            </q-tab-panel>

            <q-tab-panel name="damage">
              <showAddDamagedDevices
                :propDeviceTypes="getAllRegionalInventoryDeviceDetailsWithCount"
              />
            </q-tab-panel>

            <q-tab-panel name="allocatetoso">
              <inventoryallocatetoso />
            </q-tab-panel>

            <q-tab-panel name="inventorywithSo">
              <inventorywithso />
            </q-tab-panel>

            <q-tab-panel name="inventorywithResellar">
              <inventorywithResellar />
            </q-tab-panel>

            <q-tab-panel name="inventorywithResellarDetails">
              <inventorywithResellarDetails />
            </q-tab-panel>

            <q-tab-panel name="AllocateSotoSo">
              <allocateSOtoSO />
            </q-tab-panel>

            <q-tab-panel name="simStatus">
              <simStatus />
            </q-tab-panel>

            <q-tab-panel name="deviceAllocationRequest">
              <deviceAllocationRequest />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import spareParts from '../../components/sat/spareParts.vue'
import inventoryCount from '../../components/sat/regionalInventory/inventoryCount.vue'
import dispatchedInventory from '../../components/sat/regionalInventory/dispatchedInventory.vue'
import showAddDamagedDevices from '../../components/sat/showAddDamagedDevices.vue'
import allocateSOtoSO from '../../pages/sat/allocateSOtoSO.vue'
import inventorywithso from '../../components/inventory/inventorywithSo.vue'
import inventoryallocatetoso from '../../pages/sat/allocateSo.vue'
import inventorywithResellar from '../../pages/inventory/inventorywithsellar.vue'
import inventorywithResellarDetails from '../../pages/inventory/inventorywithResellar.vue'
import deviceAllocationRequest from '../../pages/sat/deviceAllocationRequest.vue'
import simStatus from '../../pages/sat/simStatus.vue'

const store = useStore()

/* State */
const inventoryOptionSelected = ref('count')

/* Vuex Getters */
const getAllRegionalInventoryDeviceDetailsWithCount = computed(
  () => store.getters['SAT_RegionalInventoryAllocation/getAllRegionalInventoryDeviceDetailsWithCount']
)

/* Actions */
const fnAjaxFetchAllDeviceDetailsWithCount = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('u_i') || '{}')
    const regionId = userInfo?.region?.id

    if (!regionId) return

    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT',
      regionId
    )

    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE',
      {
        region: regionId,
        action: store.state.REGIONAL_INVENTORY_FILTER_ACTION_DEVICE
      }
    )
  } catch (err) {
    console.error(err)
  }
}

/* Lifecycle */
onMounted(() => {
  fnAjaxFetchAllDeviceDetailsWithCount()
})
</script>

<style>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
