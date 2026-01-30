<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 text-weight-regular text-grey-9 text-h6">
          Aggregator Inventory With Region
        </div>
      </div>

      <!-- Filters -->
      <div class="row bottom-border q-px-md q-py-md items-center text-grey-9">
        <div class="col-md-2">
          <q-select
            v-model="formData.region"
            label="Select Region"
            :options="regionOptions"
            emit-value
            map-options
            @update:model-value="onRegionChange"
          />
        </div>

        <div class="col-md-2">
          <q-select
            v-model="formData.device_type"
            label="Filter By Device"
            :disable="!formData.region"
            :options="deviceOptions"
            emit-value
            map-options
            @update:model-value="filterByDevice"
          />
        </div>

        <div class="col-auto q-px-xs">
          <downloadExcel
            :data="regionalItems"
            :fields="jsonFields"
            name="InventoryWithRegion.xls"
          >
            <q-btn outline color="grey-9" label="Download as Excel" />
          </downloadExcel>
        </div>
      </div>

      <!-- Table -->
      <q-table
        row-key="serialNumber"
        :rows="regionalItems"
        :columns="columns"
        :filter="filter"
        v-model:pagination="pagination"
        class="q-py-none"
      >
        <!-- Search -->
        <template v-slot:top>
          <q-input
            v-model="filter"
            debounce="300"
            placeholder="Search SerialNumber & PodNumber..."
            dense
            outlined
            clearable
          />
        </template>

        <!-- Region -->
        <template v-slot:body-cell-region="props">
          {{ props.row.region?.regionAreaName || 'NA' }}
        </template>

        <!-- Device -->
        <template v-slot:body-cell-device="props">
          {{ props.row.aggregatorDevice?.deviceName || 'NA' }}
        </template>

        <!-- Aggregator -->
        <template v-slot:body-cell-aggregator="props">
          {{ props.row.aggregator?.name || 'NA' }}
        </template>

        <!-- Action -->
        <template v-slot:body-cell-action="props">
          <q-btn
            flat
            dense
            color="primary"
            icon="edit"
            label="Modify"
            @click="toggleEditRegion(props.row)"
          />
        </template>
      </q-table>

      <!-- Modals -->
      <ShowPDOmodal
        v-if="showPDOmodalVisible"
        :propshowPDOmodal="showPDOmodalVisible"
        :propAllScannedItemArr="formData"
        @closeModel="showPDOmodalVisible = false"
      />

      <AggregatorsinventoryWithRegion
        v-if="showEditRegion"
        :propShowEditRegion="showEditRegion"
        :propRowDetails="selectedRow"
        @emitfnshowAggregatorsEditRegion="toggleEditRegion"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import downloadExcel from 'vue-json-excel'

import ShowPDOmodal from '../components/showFaultymodal.vue'
import AggregatorsinventoryWithRegion from '../components/AggregatorsinventoryWithRegion.vue'

const $q = useQuasar()
const store = useStore()

/* ---------------- state ---------------- */
const filter = ref('')
const showPDOmodalVisible = ref(false) // Renamed variable
const showEditRegion = ref(false)
const selectedRow = ref(null)

const regionalItems = ref([])
const regionOptions = ref([])
const deviceOptions = ref([])

const pagination = ref({
  rowsPerPage: 10
})

const formData = reactive({
  region: null,
  device_type: null,
  scannedItems: []
})

/* ---------------- table ---------------- */
const columns = [
  { name: 'serialNumber', label: 'Serial Number', field: 'serialNumber' },
  { name: 'podNumber', label: 'Pod Number', field: 'podNumber' },
  { name: 'region', label: 'Region', field: 'region' },
  { name: 'device', label: 'Device Type', field: 'aggregatorDevice' },
  { name: 'aggregator', label: 'Aggregator', field: 'aggregator' },
  { name: 'action', label: '', field: 'action' }
]

const jsonFields = {
  SerialNumber: 'serialNumber',
  PodNumber: 'podNumber',
  DeviceType: 'aggregatorDevice.deviceName',
  Aggregator: 'aggregator.name',
  Region: 'region.regionAreaName'
}

/* ---------------- methods ---------------- */
const onRegionChange = async (region) => {
  if (!region) return

  $q.loading.show({ message: 'Fetching data...' })

  await store.dispatch(
    'inventoryWithRegion/FETCH_AGGREGATORS_INVENTORY_WITH_REGION_DATAS',
    { regionId: region.id }
  )

  regionalItems.value =
    store.getters['inventoryWithRegion/getAggregatorsInventoryWithRegion']

  await store.dispatch('superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST')

  deviceOptions.value =
    store.getters['superAdminAggregatorsDevice/getCreatedActiveDeviceList']
      .map(d => ({ label: d.deviceName, value: d.id }))

  $q.loading.hide()
}

const filterByDevice = (deviceId) => {
  regionalItems.value =
    store.getters['inventoryWithRegion/getAggregatorsInventoryWithRegion']
      .filter(i => i.aggregatorDevice?.id === deviceId)
}

const toggleEditRegion = (row) => {
  selectedRow.value = row || null
  showEditRegion.value = !showEditRegion.value
}

/* ---------------- lifecycle ---------------- */
onMounted(async () => {
  await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA')

  regionOptions.value =
    store.getters['InventoryCentral/getAllRegionsData']
      .map(r => ({ label: r.regionAreaName, value: r }))
})
</script>