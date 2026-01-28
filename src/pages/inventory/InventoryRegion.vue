<template>
  <q-page>
    <div>
      <!-- HEADER -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 q-title text-weight-regular text-grey-9">
          Bijlipay Inventory With Region
        </div>
      </div>

      <!-- FILTERS -->
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-4">
          <q-select
            v-model="formData.region"
            :options="regionOptions"
            label="Select Region"
            outlined
            dense
            color="grey-9"
            @update:model-value="filterInventoryByRegion"
          />
        </div>

        <div class="col-md-4">
          <q-select
            v-model="formData.device_type"
            :options="deviceOptions"
            label="Filter By Device"
            outlined
            dense
            color="grey-9"
            :disable="!formData.region"
            @update:model-value="filterByDevice"
          />
        </div>

        <div class="col-auto q-px-xs">
          <downloadExcel :data="regionalItems" :fields="json_fields" name="InventoryWithRegion.xls">
            <q-btn outline color="grey-9" label="Download as excel" />
          </downloadExcel>
        </div>
      </div>

      <!-- TABLE -->
      <q-table
        row-key="serialNumber"
        :rows="regionalItems"
        :columns="columns"
        :filter="filter"
        class="q-py-none"
        table-class="customTableClass"
        v-model:pagination="pagination"
      >
        <!-- BODY CELL REGION -->
        <template #body-cell-region="props">
          <q-td :props="props">
            {{ props.row.region?.regionAreaName ?? 'NA' }}
          </q-td>
        </template>

        <!-- BODY CELL DEVICE -->
        <template #body-cell-device="props">
          <q-td :props="props">
            {{ props.row.device?.deviceName ?? 'NA' }}
          </q-td>
        </template>

        <!-- BODY CELL ACTION -->
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn
              dense
              no-caps
              no-wrap
              label="Modify"
              icon="far fa-plus-square"
              size="md"
              flat
              class="text-light-blue"
              @click="fnShowEditRegion(props.row)"
            />
          </q-td>
        </template>

        <!-- TOP BAR SEARCH -->
        <template #top>
          <div class="col-md-5">
            <q-input
              outlined
              dense
              debounce="400"
              clearable
              v-model="filter"
              placeholder="Type.."
              label="Search SerialNumber & podNumber..."
              color="grey-9"
            />
          </div>
        </template>
      </q-table>

      <!-- SHOW PDO MODAL -->
      <ShowPDOmodalComponent
        v-if="showPDOmodal"
        :propshowPDOmodal="showPDOmodal"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"
      />

      <!-- SHOW EDIT REGION -->
      <InventoryWithRegionComponent
        v-if="propShowEditRegion"
        :propShowEditRegion="propShowEditRegion"
        :propRowDetails="propRowDetails"
        @emitfnshowEditRegion="fnShowEditRegion"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import downloadExcel from 'vue-json-excel'
import ShowPDOmodalComponent from '../../components/inventory/showFaultymodal.vue'
import InventoryWithRegionComponent from '../../components/inventory/inventoryWithRegion.vue'

/* STORE */
const store = useStore()

/* STATE */
const formData = ref({
  region: null,
  device_type: null,
  scannedItems: []
})
const filter = ref('')
const regionalItems = ref([])
const regionOptions = ref([])
const deviceOptions = ref([])
const showPDOmodal = ref(false)
const propShowEditRegion = ref(false)
const propRowDetails = ref(null)
const pagination = ref({ rowsPerPage: 10 })

/* JSON FIELDS FOR EXCEL */
const json_fields = {
  SerialNumber: 'serialNumber',
  PodNumber: 'podNumber',
  DeviceType: 'device.deviceName',
  Region: 'region.regionAreaName'
}

/* TABLE COLUMNS */
const columns = [
  { name: 'serialNumber', label: 'Serial number', align: 'left', field: 'serialNumber', sortable: false },
  { name: 'podNumber', label: 'Pod Number', align: 'left', field: 'podNumber', sortable: false },
  {
    name: 'region',
    label: 'Region',
    align: 'center',
    field: row => row.region?.regionAreaName,
    sortable: false
  },
  {
    name: 'device',
    label: 'Device Type',
    align: 'center',
    field: row => row.device?.deviceName,
    sortable: false
  },
  { name: 'action', label: '', align: 'left', field: 'action', sortable: false }
]

/* METHODS */
const fnShowEditRegion = rowDetails => {
  propShowEditRegion.value = !propShowEditRegion.value
  if (rowDetails) propRowDetails.value = rowDetails
}

const filterByDevice = deviceId => {
  regionalItems.value = store.getters['inventoryWithRegion/getinventoryWithRegion'].filter(
    item => item.device?.id === deviceId
  )
}

const filterInventoryByRegion = region => {
  regionalItems.value = []
  if (!region) return
  const params = { regionId: region.id }

  store.dispatch('inventoryWithRegion/FETCH_INVENTORY_WITH_REGION_DATAS', params)
    .then(() => {
      regionalItems.value = store.getters['inventoryWithRegion/getinventoryWithRegion']
    })
    .catch(() => {
      regionalItems.value = []
    })
}

/* FETCH REGION OPTIONS */
const fnAjaxGetAllRegionsData = () => {
  store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA')
    .then(() => {
      regionOptions.value = store.getters['InventoryCentral/getAllRegionsData'].map(r => ({
        label: r.regionAreaName,
        value: r
      }))
    })
    .catch(() => {
      regionOptions.value = []
    })
}

/* FETCH DEVICE OPTIONS */
const fnAjaxGetAllDevicesTypesData = () => {
  store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA')
    .then(() => {
      deviceOptions.value = store.getters['InventoryCentral/getAllInventoryDevicesTypesData'].map(d => ({
        label: d.deviceName,
        value: d.id
      }))
    })
    .catch(() => {
      deviceOptions.value = []
    })
}

// Note: fnAllocateDeviceToRegion method is referenced in the template but not defined
// Adding a placeholder implementation
const fnAllocateDeviceToRegion = () => {
  // This method is referenced in the template but not defined in the original code
  // Adding a basic implementation
  console.log('fnAllocateDeviceToRegion called')
}

/* LIFECYCLE HOOKS */
onMounted(() => {
  fnAjaxGetAllRegionsData()
  fnAjaxGetAllDevicesTypesData()
})

onBeforeUnmount(() => {
  // Barcode scanner cleanup if needed (global registration should be in main.js)
  if (window.$barcodeScanner) window.$barcodeScanner.destroy()
})
</script>