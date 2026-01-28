<template>
  <q-dialog
    v-model="toggleModal"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <div class="column">

        <!-- Title -->
        <div class="bottom-border q-pb-sm">
          <div class="text-h6 text-weight-regular">
            POD Number
          </div>
        </div>

        <!-- Device List -->
        <div class="q-pt-md">
          <q-list dense separator>
            <q-item
              v-for="(item, index) in formData.scannedDevices"
              :key="index"
            >
              <q-item-section>
                {{ item.device.deviceName }}
              </q-item-section>

              <q-item-section side>
                {{ item.deviceSerialNumbers.length }} nos
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- POD Input -->
        <div class="q-pt-md">
          <q-input
            v-model="formData.podNumber"
            label="Enter POD Number"
            placeholder="POD Number"
            color="grey-9"
            dense
            outlined
          />
        </div>

        <!-- Actions -->
        <div class="q-pt-md row justify-end q-gutter-sm">
          <q-btn
            icon="block"
            outline
            label="Cancel"
            @click="emitToggleCheque"
          />

          <q-btn
            icon="check"
            class="common-btn"
            label="Submit"
            @click="submitDamagedDevices"
          />
        </div>

      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ---------------------------------
 * Props
 * --------------------------------- */
const props = defineProps({
  propShowPDOmodal: {
    type: Boolean,
    required: true
  },
  propAllScannedItemArr: {
    type: Object,
    required: true
  }
})

/* ---------------------------------
 * Emits
 * --------------------------------- */
const emit = defineEmits([
  'closeModel',
  'emittedAfterPODsubmission'
])

/* ---------------------------------
 * Quasar & Store
 * --------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------------------------
 * State
 * --------------------------------- */
const toggleModal = ref(props.propShowPDOmodal)

const formData = ref({
  region: props.propAllScannedItemArr.region,
  podNumber: '',
  scannedDevices: props.propAllScannedItemArr.scannedItems
})

/* ---------------------------------
 * Sync props (Vue 3 safe)
 * --------------------------------- */
watch(
  () => props.propShowPDOmodal,
  val => (toggleModal.value = val)
)

/* ---------------------------------
 * Methods
 * --------------------------------- */
const emitToggleCheque = () => {
  emit('closeModel')
}

const submitDamagedDevices = async () => {
  if (!formData.value.region) {
    return notifyWarn('Region cannot be empty!')
  }

  if (!formData.value.podNumber) {
    return notifyWarn('POD number cannot be empty!')
  }

  if (!formData.value.scannedDevices.length) {
    return notifyWarn('Scanned devices cannot be empty!')
  }

  try {
    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FEED_REGIONAL_INVENTORY_DAMAGED_DEVICE_SERIAL_NUMBER',
      formData.value
    )

    store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', false)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Devices successfully added to damaged inventory',
      icon: 'thumb_up'
    })

    emit('emittedAfterPODsubmission', 'closeModal')
    emit('closeModel')

  } catch (error) {

    store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', false)

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  }
}

/* ---------------------------------
 * Helpers
 * --------------------------------- */
const notifyWarn = (message) => {
  $q.notify({
    color: 'amber-9',
    position: 'bottom',
    message,
    icon: 'warning'
  })
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
