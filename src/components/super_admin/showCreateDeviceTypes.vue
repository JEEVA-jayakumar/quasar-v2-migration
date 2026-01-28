<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitfnshowAddDeviceType"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">
      <q-card-section class="row items-center q-py-md bottom-border">
        <q-icon name="add_box" size="25px" color="purple-9" class="q-mr-sm"/>
        <div class="text-h6 text-weight-regular">Add Device</div>
      </q-card-section>

      <q-card-section class="column q-py-md gutter-sm">
        <!-- Device Name -->
        <q-input
          v-model="formData.deviceName"
          label="Device Type"
          placeholder="Device Type"
          color="grey-9"
          class="text-grey-8"
          :error="v$.formData.deviceName.$error"
          error-message="Device Name is required"
          @blur="v$.formData.deviceName.$touch()"
        />

        <!-- Color Picker -->
        <div class="row items-center q-mt-md">
          <div class="col">
            <q-color
              v-model="formData.colorCode"
              label="Choose a role color"
              popover
              color="grey-9"
              :error="v$.formData.colorCode.$error"
              error-message="Color is required"
              @blur="v$.formData.colorCode.$touch()"
            />
          </div>
          <div class="col-auto">
            <q-btn round :style="'background:' + formData.colorCode" disable />
          </div>
        </div>

        <!-- Serial Number Length -->
        <q-input
          v-model="formData.serialNumberLength"
          type="number"
          label="Serial Number Length"
          placeholder="Serial Number Length"
          color="grey-9"
          class="text-grey-8 q-mt-md"
          :error="v$.formData.serialNumberLength.$error"
          error-message="Serial Number Length required (max 50)"
          @blur="v$.formData.serialNumberLength.$touch()"
        />

        <!-- Device Type Selection -->
        <div class="q-mt-md">
          <q-radio
            v-for="(item, index) in device.flagOptions"
            :key="index"
            v-model="formData.isDevice"
            :val="item.value"
            :label="item.label"
            color="grey-9"
            :error="v$.formData.isDevice.$error"
            @blur="v$.formData.isDevice.$touch()"
          />
        </div>

        <!-- Action Buttons -->
        <div class="row justify-end q-mt-lg">
          <q-btn
            outline
            icon="block"
            label="Cancel"
            color="grey-6"
            class="text-grey-8 q-mr-sm"
            @click="emitfnshowAddDeviceType"
          />
          <q-btn
            icon="check"
            label="Save"
            color="purple-9"
            @click="fnfinalsubmitDeviceType"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, maxValue } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propShowCreateDeviceTypes: { type: Boolean, required: true }
})
const emit = defineEmits(['emitfnshowDeviceTypes', 'emitfnForDeviceTypeTable'])

/* ---------------- State ---------------- */
const $q = useQuasar()
const store = useStore()

const toggleModal = ref(props.propShowCreateDeviceTypes)
watch(() => props.propShowCreateDeviceTypes, val => (toggleModal.value = val))

const formData = reactive({
  deviceName: '',
  colorCode: '',
  serialNumberLength: null,
  isDevice: null
})

const device = reactive({
  flagOptions: [
    { label: 'POS', value: 1 },
    { label: 'QR', value: 2 }
  ]
})

/* ---------------- Validation ---------------- */
const rules = {
  formData: {
    deviceName: { required },
    colorCode: { required },
    serialNumberLength: { required, maxValue: maxValue(50) },
    isDevice: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ---------------- Vuex Actions ---------------- */
const FEED_DEVICE_TYPE_DATA = payload => store.dispatch('SA_Devices/FEED_DEVICE_TYPE_DATA', payload)
const FETCH_DEVICES_DATA = () => store.dispatch('SA_Devices/FETCH_DEVICES_DATA')

/* ---------------- Methods ---------------- */
const emitfnshowAddDeviceType = () => {
  emit('emitfnshowDeviceTypes')
  emit('emitfnForDeviceTypeTable')
}

const fnfinalsubmitDeviceType = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({ message: 'Please wait', spinnerColor: 'purple-9' })

  try {
    await FEED_DEVICE_TYPE_DATA(formData)
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Device successfully added',
      icon: 'thumb_up'
    })
    await FETCH_DEVICES_DATA()
    emitfnshowAddDeviceType()
    location.reload()
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.data?.message || 'Something went wrong',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.customModalOverlay {
  border-radius: 8px;
}
</style>
