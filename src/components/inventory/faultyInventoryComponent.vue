<template>
  <q-dialog v-model="toggleAddDeviceModal" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <form class="column">
        <!-- Title -->
        <q-card-section class="text-center">
          <div class="text-weight-medium text-h6">Add New Damaged Device</div>
        </q-card-section>

        <!-- Device Select -->
        <q-card-section class="q-pt-md">
          <q-select
            v-model="formData.device"
            :options="deviceOptions"
            label="Select a device"
            placeholder="Available devices"
            outlined
            :error="v$.formData.device.$invalid && v$.formData.device.$dirty"
            @blur="v$.formData.device.$touch()"
          />
        </q-card-section>

        <!-- Scan Device Button -->
        <q-card-section class="row q-py-md items-center">
          <div class="col">Scan a damaged device</div>
          <div class="col">
            <q-btn
              v-if="toggleScanButton"
              outline
              size="sm"
              label="Scan"
              @click="fnScanDamagedDevice"
            />
          </div>
        </q-card-section>

        <div class="q-mb-md text-center">OR</div>

        <!-- Serial Number Input -->
        <q-card-section>
          <q-input
            v-model.trim="formData.serialNumber"
            label="Enter Serial Number Manually"
            placeholder="Serial Number"
            outlined
            color="grey-9"
            :error="v$.formData.serialNumber.$invalid && v$.formData.serialNumber.$dirty"
            @blur="v$.formData.serialNumber.$touch()"
          />
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            flat
            color="grey-8"
            label="Cancel"
            class="q-px-lg"
            @click="emitfaultyInventoryComponent"
          />
          <q-btn
            label="Add"
            class="q-px-lg"
            color="purple-9"
            style="color: #e3e4e5; background: #1f2c3f !important;"
            @click.prevent="fnSubmitDamagedDevice"
          />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, minLength, maxLength } from '@vuelidate/validators'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propfaultyInventoryComponent: { type: Boolean, required: true },
  propDeviceTypes: { type: Array, required: true }
})
const emit = defineEmits(['emitfaultyInventoryComponent'])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- State ---------------- */
const toggleAddDeviceModal = ref(props.propfaultyInventoryComponent)
const toggleScanButton = ref(true)
const formData = ref({
  device: '',
  serialNumber: ''
})

/* ---------------- Watch Prop ---------------- */
watch(() => props.propfaultyInventoryComponent, val => toggleAddDeviceModal.value = val)

/* ---------------- Device Options ---------------- */
const deviceOptions = computed(() => {
  return props.propDeviceTypes.map(d => ({ label: d.deviceName, value: d.id }))
})

/* ---------------- Vuelidate ---------------- */
const rules = {
  formData: {
    device: { required },
    serialNumber: { required, alphaNum, minLength: minLength(2), maxLength: maxLength(20) }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Methods ---------------- */
function emitfaultyInventoryComponent() {
  emit('emitfaultyInventoryComponent')
}

function fnScanDamagedDevice() {
  // Reset serial number if needed
  formData.value.serialNumber = ''
  toggleScanButton.value = false

  // Initialize barcode scanner if available
  if (window.$barcodeScanner?.init) {
    window.$barcodeScanner.init(onBarcodeScanned)
  }
}

function onBarcodeScanned(barcode) {
  formData.value.serialNumber = barcode
  toggleScanButton.value = true
  if (window.$barcodeScanner?.destroy) window.$barcodeScanner.destroy()
}

async function fnSubmitDamagedDevice() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    $q.notify({ color: 'negative', position: 'bottom', message: 'Please review fields again.', icon: 'warning' })
    return
  }

  try {
    const response = await store.dispatch('InventoryCentral/FEED_FAULTY_DEVICES_INVENTORY', formData.value)
    if (response.status === 204) {
      $q.notify({ color: 'amber-9', position: 'bottom', message: "Device ID, Serial number doesn't match", icon: 'warning' })
    } else {
      $q.notify({ color: 'positive', position: 'bottom', message: 'Successfully marked as damaged', icon: 'thumb_up' })
    }
    emit('emitfaultyInventoryComponent')
  } catch (error) {

    $q.notify({ color: 'negative', position: 'bottom', message: error?.body?.message || 'Please Try Again Later!', icon: 'thumb_down' })
  }
}
</script>

<style scoped>
/* Optional: same styling adjustments as before */
</style>
