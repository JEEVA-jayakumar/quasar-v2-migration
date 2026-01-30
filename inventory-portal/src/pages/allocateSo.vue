<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-8 q-title text-weight-regular text-grey-9">
          Bijlipay Allocate SO / Bill Partner / Sub Region
        </div>
        <div class="col-4 text-right">
          <q-btn
            outline
            color="negative"
            label="Cancel Allocation"
            @click="$router.push('/inventory/central')"
          />
        </div>
      </div>

      <!-- Filters -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-4">
          <q-select
            v-model="formData.region"
            label="Select Region"
            :options="regionOptions"
            :disable="!!formData.device_type"
            emit-value
            map-options
            @update:model-value="regionBasedSoLoad"
          />
        </div>

        <div class="col-md-3">
          <q-select
            v-model="formData.so"
            label="Select SO"
            clearable
            :options="regionBasedSo"
            emit-value
            map-options
          />
        </div>

        <div class="col-md-3">
          <q-select
            v-model="formData.device_type"
            label="Select Device Type"
            clearable
            :disable="!formData.region"
            :options="deviceOptions"
            emit-value
            map-options
            @update:model-value="fnSetDevicesByDeviceId"
          />
        </div>

        <div class="col-md-2 text-right">
          <q-btn
            color="light-blue"
            label="Start Scan"
            :disable="!formData.device_type || !formData.region"
            v-if="scannerToggleOption"
            @click="openScannerComp"
          />
          <q-btn
            outline
            icon="shopping_cart"
            label="Add to cart"
            :disable="!scannerToggleOption"
            @click="fnAllocateDeviceToRegion"
          />
        </div>
      </div>

      <!-- Scanned Devices -->
      <div class="row q-pa-md">
        <div
          class="col-md-4 q-pa-sm"
          v-for="(item, index) in formData.scannedItems"
          :key="index"
        >
          <q-card class="shadow-4">
            <q-card-section class="bg-purple-9 text-white">
              {{ item.device.deviceName }}
            </q-card-section>

            <q-scroll-area style="height: 400px">
              <q-list separator>
                <q-item
                  v-for="(serial, sIndex) in item.deviceSerialNumbers"
                  :key="sIndex"
                >
                  <q-item-section>{{ serial }}</q-item-section>
                  <q-item-section side>
                    <q-btn
                      round
                      size="sm"
                      color="negative"
                      icon="close"
                      @click="fnRemoveScannedItems(index, sIndex)"
                    />
                  </q-item-section>
                </q-item>

                <q-item v-if="item.deviceSerialNumbers.length === 0">
                  <q-item-section>No data to display</q-item-section>
                  <q-item-section side>
                    <q-btn
                      round
                      size="sm"
                      color="negative"
                      icon="close"
                      @click="fnRemoveDeviceTypeFromList(index)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-card>
        </div>
      </div>

      <!-- Allocation Modal -->
      <ShowPDORegionBasedSoComponent
        v-if="showPDORegionBasedSo"
        :propshowRegionBasedSo="showPDORegionBasedSo"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import ShowPDORegionBasedSoComponent from '../components/showPDORegionBasedSo.vue'

// ------------------------------------------------------------------
const store = useStore()
const $q = useQuasar()

// ------------------------------------------------------------------
const scannerToggleOption = ref(true)
const showPDORegionBasedSo = ref(false)

const regionOptions = ref([])
const deviceOptions = ref([])
const regionBasedSo = ref([])

const formData = ref({
  region: '',
  so: '',
  device_type: null,
  scannedItems: []
})

// ------------------------------------------------------------------
const fnAjaxGetAllDevicesTypesData = async () => {
  await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA')
  deviceOptions.value = store.getters['InventoryCentral/getAllInventoryDevicesTypesData']
    .map(d => ({ label: d.deviceName, value: d }))
}

const fnAjaxGetAllRegionsData = async () => {
  await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA')
  regionOptions.value = store.getters['InventoryCentral/getAllRegionsData']
    .map(r => ({ label: r.regionAreaName, value: r.id }))
}

const regionBasedSoLoad = async () => {
  await store.dispatch('InventoryCentral/FETCH_REGION_BASED_SO', formData.value.region)
  regionBasedSo.value = store.getters['InventoryCentral/getRegionBasedSO']
    .map(s => ({ label: `${s.name} | ${s.employeeID} | ${s.email}`, value: s.id }))
}

// ------------------------------------------------------------------
const fnSetDevicesByDeviceId = () => {
  scannerToggleOption.value = true
  if (!formData.value.device_type) return

  const exists = formData.value.scannedItems.find(
    i => i.device.id === formData.value.device_type.id
  )

  if (!exists) {
    formData.value.scannedItems.unshift({
      device: formData.value.device_type,
      deviceSerialNumbers: []
    })
  }
}

// ------------------------------------------------------------------
let keyBuffer = ''

const handleKeyScan = async e => {
  if (scannerToggleOption.value) return

  if (e.key === 'Enter') {
    const barcode = keyBuffer
    keyBuffer = ''

    try {
      await store.dispatch(
        'VerifyDevice/DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION',
        { device: formData.value.device_type.id, barcode }
      )

      const target = formData.value.scannedItems.find(
        i => i.device.id === formData.value.device_type.id
      )

      if (target && !target.deviceSerialNumbers.includes(barcode)) {
        target.deviceSerialNumbers.push(barcode)
      }
    } catch {
      $q.notify({
        color: 'primary',
        message: `${barcode} is invalid`,
        position: 'bottom'
      })
    }
  } else {
    keyBuffer += e.key
  }
}

const openScannerComp = () => {
  scannerToggleOption.value = false
  $q.notify({
    color: 'positive',
    message: `Start scanning for ${formData.value.device_type.deviceName}`,
    position: 'bottom'
  })
}

// ------------------------------------------------------------------
const fnRemoveScannedItems = (i, j) => {
  formData.value.scannedItems[i].deviceSerialNumbers.splice(j, 1)
}

const fnRemoveDeviceTypeFromList = i => {
  formData.value.scannedItems.splice(i, 1)
}

const fnAllocateDeviceToRegion = () => {
  showPDORegionBasedSo.value = !showPDORegionBasedSo.value
}

// ------------------------------------------------------------------
onMounted(() => {
  fnAjaxGetAllDevicesTypesData()
  fnAjaxGetAllRegionsData()
  window.addEventListener('keydown', handleKeyScan)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyScan)
})
</script>

<style scoped>
.activeDeviceTab {
  background: #61116a;
  color: #fff;
}
</style>