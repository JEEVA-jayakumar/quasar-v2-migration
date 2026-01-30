<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-8 q-title text-weight-regular text-grey-9">
          Bijlipay Faulty Device
        </div>

        <div class="col-md-4 text-right">
          <q-btn
            outline
            color="negative"
            label="Cancel Allocation"
            @click="router.push('/inventory/central')"
          />
        </div>
      </div>

      <!-- Controls -->
      <div class="q-pa-sm">
        <div class="row items-center">
          <div class="col-12 col-lg-6">
            <q-select
              v-model="formData.device_type"
              :options="deviceOptions"
              clearable
              outlined
              color="grey-9"
              label="Select Device Type"
              :disable="false"
              @clear="clearDeviceSelection"
              @update:model-value="setDevicesByDeviceType"
            />
          </div>

          <div class="col-12 col-lg-6 text-right">
            <q-btn
              v-if="scannerToggle"
              color="light-blue"
              label="Start Scan"
              :disable="!formData.device_type"
              @click="startScanner"
              class="q-mr-sm"
            />

            <q-btn
              color="amber-9"
              label="Send to Repair"
              :disable="formData.scannedItems.length === 0"
              @click="toggleRepairModal"
            />
          </div>
        </div>

        <!-- Scanned Devices -->
        <div class="row q-mt-md text-grey-9">
          <div
            class="col-12 col-md-4 q-pa-sm"
            v-for="(item, index) in formData.scannedItems"
            :key="item.device.id"
          >
            <q-card class="shadow-4">
              <q-list bordered separator>
                <q-item-label header>
                  <q-icon name="tablet" class="q-mr-sm" />
                  {{ item.device.deviceName }}
                </q-item-label>

                <q-scroll-area style="height: 400px">
                  <template v-if="item.deviceSerialNumbers.length">
                    <q-item
                      v-for="(serial, sIndex) in item.deviceSerialNumbers"
                      :key="serial"
                    >
                      <q-item-section>
                        {{ serial }}
                      </q-item-section>

                      <q-item-section side>
                        <q-btn
                          round
                          dense
                          size="sm"
                          color="negative"
                          icon="close"
                          @click="removeSerial(index, sIndex)"
                        />
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-else>
                    <q-item>
                      <q-item-section>No data to display</q-item-section>
                      <q-item-section side>
                        <q-btn
                          round
                          dense
                          size="sm"
                          color="negative"
                          icon="close"
                          @click="removeDeviceType(index)"
                        />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-scroll-area>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <showRepairConfirmation
        v-if="showRepairModal"
        :showRepairModal="showRepairModal"
        :propAllScannedItemArr="formData"
        @closeModel="afterSubmit"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import showRepairConfirmation from './showRepairConfirmation.vue'

/* =====================
   Core
===================== */
const router = useRouter()
const $q = useQuasar()
const store = useStore()

/* =====================
   State
===================== */
const scannerToggle = ref(true)
const showRepairModal = ref(false)
const deviceOptions = ref([])

const formData = reactive({
  device_type: null,
  scannedItems: []
})

/* =====================
   Lifecycle
===================== */
onMounted(fetchDeviceTypes)

onBeforeUnmount(() => {
  if ($q.barcodeScanner?.hasListener()) {
    $q.barcodeScanner.destroy()
  }
})

/* =====================
   Methods
===================== */
async function fetchDeviceTypes() {
  try {
    await store.dispatch(
      'InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA'
    )

    const list =
      store.getters['InventoryCentral/getAllInventoryDevicesTypesData']

    deviceOptions.value = list.map(d => ({
      label: d.deviceName,
      value: d
    }))
  } catch {
    deviceOptions.value = []
  }
}

function setDevicesByDeviceType() {
  scannerToggle.value = true

  if (!formData.device_type) return

  const exists = formData.scannedItems.find(
    d => d.device.id === formData.device_type.id
  )

  if (!exists) {
    formData.scannedItems.unshift({
      device: {
        id: formData.device_type.id,
        deviceName: formData.device_type.deviceName
      },
      deviceSerialNumbers: []
    })
  }
}

function startScanner() {
  scannerToggle.value = false

  $q.notify({
    color: 'positive',
    message: `Start scanning for ${formData.device_type.deviceName}`,
    position: 'bottom'
  })

  if (!$q.barcodeScanner.hasListener()) {
    $q.barcodeScanner.init(onBarcodeScanned)
  }
}

function onBarcodeScanned(barcode) {
  const item = formData.scannedItems.find(
    d => d.device.id === formData.device_type.id
  )

  if (!item) return

  if (item.deviceSerialNumbers.includes(barcode)) {
    return $q.notify({
      color: 'info',
      message: `${barcode} already scanned`,
      position: 'bottom'
    })
  }

  store
    .dispatch('VerifyDevice/DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE', {
      device: formData.device_type.id,
      barcode
    })
    .then(() => item.deviceSerialNumbers.push(barcode))
    .catch(() =>
      $q.notify({
        color: 'negative',
        message: `${barcode} is invalid`,
        position: 'bottom'
      })
    )
}

function removeSerial(i, j) {
  formData.scannedItems[i].deviceSerialNumbers.splice(j, 1)
}

function removeDeviceType(index) {
  formData.scannedItems.splice(index, 1)
}

function clearDeviceSelection() {
  formData.device_type = null
  formData.scannedItems.length = 0
}

function toggleRepairModal() {
  showRepairModal.value = !showRepairModal.value
}

function afterSubmit() {
  toggleRepairModal()
  clearDeviceSelection()
}
</script>
