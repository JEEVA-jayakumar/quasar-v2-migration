<template>
  <q-dialog
    v-model="showDialog"
    maximized
    persistent
    class="customModalOverlay"
  >
    <q-card style="margin-top:100px; min-width:40vw">

      <!-- HEADER -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-8 text-h6 text-grey-9">
          Regional Inventory Dispatched Devices Verification
        </div>
        <div class="col-md-4 text-right">
          <q-btn
            outline
            label="Cancel"
            color="negative"
            @click="emitClose"
          />
        </div>
      </div>

      <!-- DEVICE SELECT -->
      <div class="row bottom-border q-px-md q-py-md text-grey-9">
        <div class="col-md-3">
          <q-select
            v-model="formData.device_type"
            label="Select Device Type"
            color="grey-9"
            :options="deviceOptions"
            @update:model-value="fnSetDevicesByDeviceId"
          />
        </div>
      </div>

      <!-- SCANNED ITEMS -->
      <div class="row q-pa-md text-grey-9">
        <div
          class="col-md-4 q-pa-sm"
          v-for="(item, index) in formData.scannedItems"
          :key="index"
        >
          <q-card class="shadow-4">

            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label header>
                    <q-icon name="tablet_android" class="q-mr-sm" />
                    {{ item.device.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <template v-if="item.deviceSerialNumbers.length">
                <q-item
                  v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                  :key="subIndex"
                >
                  <q-item-section>
                    {{ subItem.barcode }}
                  </q-item-section>
                  <q-item-section side>
                    <q-icon
                      :name="subItem.checksum ? 'check' : 'close'"
                      :color="subItem.checksum ? 'positive' : 'negative'"
                    />
                  </q-item-section>
                </q-item>
              </template>

              <q-item v-else>
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

          </q-card>
        </div>
      </div>

      <!-- PDO MODAL -->
      <showPDOmodal
        v-if="showPDOmodal"
        :propshowPDOmodal="showPDOmodal"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* props & emits */
const props = defineProps({
  propShowDeviceVerificationComponent: Boolean
})
const emit = defineEmits(['update:propShowDeviceVerificationComponent'])

/* state */
const $q = useQuasar()
const store = useStore()

const showDialog = computed({
  get: () => props.propShowDeviceVerificationComponent,
  set: v => emit('update:propShowDeviceVerificationComponent', v)
})

const showPDOmodal = ref(false)
const deviceOptions = ref([])
const regionOptions = ref([])

const formData = ref({
  region: '',
  device_type: null,
  scannedItems: []
})

/* getters */
const inventoryDevices = computed(
  () => store.getters['InventoryCentral/getAllInventoryDevicesTypesData']
)

const regions = computed(
  () => store.getters['InventoryCentral/getAllRegionsData']
)

/* lifecycle */
onMounted(() => {
  fnAjaxGetAllDevicesTypesData()
  fnAjaxGetAllRegionsData()
})

onBeforeUnmount(() => {
  if ($q.config.globalProperties?.$barcodeScanner) {
    $q.config.globalProperties.$barcodeScanner.destroy()
  }
})

/* methods */
const emitClose = () => {
  showDialog.value = false
}

const fnSetDevicesByDeviceId = () => {
  openScannerComp()

  const exists = formData.value.scannedItems.find(
    d => d.device.id === formData.value.device_type.id
  )

  if (!exists) {
    formData.value.scannedItems.unshift({
      device: {
        name: formData.value.device_type.deviceName,
        id: formData.value.device_type.id
      },
      deviceSerialNumbers: []
    })
  }
}

const onBarcodeScanned = barcode => {
  const target = formData.value.scannedItems.find(
    d => d.device.id === formData.value.device_type.id
  )

  if (!target) return

  target.deviceSerialNumbers.push({
    barcode,
    checksum: true // same logic placeholder as original
  })
}

const openScannerComp = () => {
  $q.notify({
    color: 'positive',
    message: `You have selected ${formData.value.device_type.deviceName}`,
    icon: 'list'
  })

  const scanner = $q.config.globalProperties.$barcodeScanner
  if (scanner && !scanner.hasListener()) {
    scanner.init(onBarcodeScanned)
  }
}

const fnAllocateDeviceToRegion = () => {
  showPDOmodal.value = !showPDOmodal.value
}

const fnRemoveDeviceTypeFromList = index => {
  formData.value.scannedItems.splice(index, 1)
}

/* API calls */
const fnAjaxGetAllDevicesTypesData = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA')
    deviceOptions.value = inventoryDevices.value.map(d => ({
      label: d.deviceName,
      value: d
    }))
  } catch {
    deviceOptions.value = []
  }
}

const fnAjaxGetAllRegionsData = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA')
    regionOptions.value = regions.value.map(r => ({
      label: r.regionAreaName,
      value: r.id
    }))
  } catch {
    regionOptions.value = []
  }
}
</script>
