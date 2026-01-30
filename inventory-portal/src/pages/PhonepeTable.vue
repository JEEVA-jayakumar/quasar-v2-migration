<template>
  <q-page>
    <div>
      <!-- Title -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-12 q-title text-weight-regular text-grey-9">
          Phonepe Inventory Table
        </div>
      </div>

      <!-- Central Inventory -->
      <div class="row bottom-border q-ma-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9">Central Inventory</div>

        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.centralItems.length" class="row">
            <div
              v-for="(device, index) in inventoryData.centralItems"
              :key="index"
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md"
              :style="{ border: `1px solid ${device.aggregatorDevice.colorCode}` }"
              align="center"
            >
              <div>
                <big :style="{ color: device.aggregatorDevice.colorCode }">
                  {{ device.count }}
                </big>
              </div>
              <div>{{ device.aggregatorDevice.deviceName }}</div>
            </div>
          </div>

          <q-alert v-else color="primary" icon="info">
            No data available to display
          </q-alert>
        </div>
      </div>

      <!-- Regional Inventory -->
      <InventoryBlock
        title="Inventory with regions"
        :items="inventoryData.regionalItems"
        @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
      />

      <!-- Merchant Inventory -->
      <InventoryBlock
        title="Inventory with Merchant"
        :items="inventoryData.merchantItems"
        @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
      />

      <!-- SO Inventory -->
      <InventoryBlock
        title="Inventory with SO"
        :items="inventoryData.billPartnerInventory"
        @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
      />

      <!-- Faulty Inventory -->
      <InventoryBlock
        title="Faulty Inventory"
        :items="inventoryData.faultyInventory"
        @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
      />

      <!-- Repair Inventory -->
      <InventoryBlock
        title="Send to Repair"
        :items="inventoryData.sendtoRepair"
        @item-click="ajaxLoadDataForCentralInventoryByDeviceIdFilter"
      />
    </div>
  </q-page>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ------------------------------------------------------------------
   Composables
------------------------------------------------------------------ */
const $q = useQuasar()
const store = useStore()

/* ------------------------------------------------------------------
   State
------------------------------------------------------------------ */
const inventoryData = reactive({
  region: '',
  so: '',
  centralItems: [],
  regionalItems: [],
  merchantItems: [],
  billPartnerInventory: [],
  faultyInventory: [],
  sendtoRepair: [],
  SOFilterOptions: []
})

/* ------------------------------------------------------------------
   Methods
------------------------------------------------------------------ */
const ajaxLoadDataForCentralInventoryByDeviceIdFilter = (index, deviceInfo) => {
  fnAjaxPopulateAllDevicesList(deviceInfo)
}

const fnAjaxPopulateAllDevicesList = deviceInfo => {
  const payload = {
    region: inventoryData.region,
    action: store.state.REGIONAL_INVENTORY_FILTER_ACTION_DEVICE,
    device: deviceInfo.device.id
  }
  store.dispatch(
    'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE',
    payload
  )
}

const getAllInventoryData = async () => {
  try {
    $q.loading.show({
      spinnerColor: 'purple-9',
      message: 'Fetching data...'
    })

    await store.dispatch(
      'InventoryCentral/FETCH_AGGREGATORS_CENTRAL_INVENTORY_DASHBOARD_COUNT'
    )

    const data =
      store.getters[
        'InventoryCentral/getAggregatorsCentralInventoryDashboardCount'
      ]

    inventoryData.centralItems = data.centralInventory || []
    inventoryData.merchantItems = data.merchantInventory || []
    inventoryData.regionalItems = data.regionalInventory || []
    inventoryData.billPartnerInventory = data.billPartnerInventory || []
    inventoryData.faultyInventory = data.faultyInventory || []
    inventoryData.sendtoRepair = data.faultySentToRepair || []
  } finally {
    $q.loading.hide()
  }
}

const getAllSOData = async () => {
  await store.dispatch('SuperAdminUsers/FETCH_ALL_SO_DATA')
  inventoryData.SOFilterOptions =
    store.getters['SuperAdminUsers/getAllSOsData']
}

/* ------------------------------------------------------------------
   Lifecycle
------------------------------------------------------------------ */
onMounted(() => {
  getAllInventoryData()
  getAllSOData()
})
</script>

<style scoped>
.big {
  font-size: 22px;
  font-weight: bold;
}
</style>
