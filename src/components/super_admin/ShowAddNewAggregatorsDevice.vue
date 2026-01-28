<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card class="q-pa-md" style="min-width: 30vw">

        <!-- HEADER -->
        <div class="text-h6 q-pb-md bottom-border">
          <q-icon name="add_box" size="25px" color="purple-9" class="q-mr-sm" />
          Add Aggregator Device
        </div>

        <!-- FORM -->
        <q-form @submit.prevent="fnfinalsubmitDeviceType" class="q-gutter-md q-pt-md">

          <!-- DEVICE TYPE -->
          <q-input
            v-model="formData.deviceName"
            label="Device Type"
            placeholder="Device Type"
            color="grey-9"
            dense
            :error="errors.deviceName"
            error-message="Device Type is required"
          />

          <!-- AGGREGATOR -->
          <q-select
            v-model="formData.aggregator"
            :options="dropDown.aggregatorOptions"
            label="Select Aggregator List"
            color="grey-9"
            dense
            emit-value
            map-options
            :error="errors.aggregator"
            error-message="Aggregator is required"
          />

          <!-- COLOR -->
          <div class="row items-center">
            <div class="col">
              <q-color
                v-model="formData.colorCode"
                label="Choose a role color"
                format-model="hex"
                :error="errors.colorCode"
              />
            </div>
            <div class="col-auto">
              <q-btn round :style="{ background: formData.colorCode }" />
            </div>
          </div>

          <!-- SERIAL LENGTH -->
          <q-input
            v-model.number="formData.serialNumberLength"
            type="number"
            label="Serial Number Length"
            placeholder="Serial Number Length"
            color="grey-9"
            dense
            :error="errors.serialNumberLength"
            error-message="Max allowed length is 50"
          />

          <!-- ACTIONS -->
          <div class="row justify-end q-pt-md">
            <q-btn
              outline
              icon="block"
              color="grey-6"
              label="Cancel"
              class="q-mr-sm"
              @click="emitfnShowAddNewAggregatorsDevice"
            />
            <q-btn
              color="purple-9"
              icon="check"
              label="Save"
              type="submit"
            />
          </div>

        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* PROPS / EMITS */
const props = defineProps({
  propShowAddNewAggregatorsDevice: Boolean
})
const emit = defineEmits(['emitfnShowAddNewAggregatorsDevice'])

/* QUASAR */
const $q = useQuasar()

/* STORE */
const store = useStore()

/* STATE */
const toggleModal = ref(props.propShowAddNewAggregatorsDevice)

const formData = reactive({
  deviceName: '',
  colorCode: '',
  aggregator: null,
  serialNumberLength: null
})

const touched = ref(false)

const dropDown = reactive({
  aggregatorOptions: []
})

/* WATCH */
watch(
  () => props.propShowAddNewAggregatorsDevice,
  val => (toggleModal.value = val)
)

/* VALIDATION */
const errors = computed(() => ({
  deviceName: touched.value && !formData.deviceName,
  colorCode: touched.value && !formData.colorCode,
  aggregator: touched.value && !formData.aggregator,
  serialNumberLength:
    touched.value &&
    (!formData.serialNumberLength || formData.serialNumberLength > 50)
}))

/* METHODS */
const emitfnShowAddNewAggregatorsDevice = () => {
  emit('emitfnShowAddNewAggregatorsDevice')
}

const ajaxAggregatordeviceList = async () => {
  await store.dispatch('superAdminAggregators/GET_ACTIVE_CREATED_AGGREGATORS_LIST')

  store.getters['superAdminAggregators/getActiveCreatedAggregatorList']
    .forEach(item => {
      dropDown.aggregatorOptions.push({
        label: item.name,
        value: item
      })
    })
}

const fnfinalsubmitDeviceType = async () => {
  touched.value = true

  if (Object.values(errors.value).some(Boolean)) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show()

  try {
    await store.dispatch(
      'superAdminAggregatorsDevice/CREATE_AGGREGATORS_DEVICE',
      formData
    )

    $q.loading.hide()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Device successfully added',
      icon: 'thumb_up'
    })

    emitfnShowAddNewAggregatorsDevice()
    location.reload()
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.data?.message ?? 'Something went wrong',
      icon: 'thumb_down'
    })
  }
}

/* LIFECYCLE */
onMounted(ajaxAggregatordeviceList)
</script>

<style scoped>
.customModalOverlay {
  z-index: 6000;
}
</style>
