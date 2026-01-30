<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <form @submit.prevent="submitPodAndRegions">
        <div class="column group">
          <!-- Title -->
          <div class="col-md-12">
            <div class="q-title text-weight-regular">Edit Pod And Region</div>
          </div>

          <!-- Pod Number Input (Disabled) -->
          <div class="col-md-12 q-mt-md">
            <q-input
              v-model="formData.podNumber"
              disable
              label="Enter Pod Number"
              placeholder="Enter Pod Number"
              color="grey-9"
              class="text-weight-regular text-grey-8"
            />
          </div>

          <!-- Device Select -->
          <div class="col-md-12 q-mt-md">
            <q-select
              v-model="formData.device"
              :options="deviceOptions"
              label="Select Device Name"
              placeholder="Select Device Name"
              color="grey-9"
              class="text-weight-regular text-grey-8"
              emit-value
              map-options
            />
          </div>

          <!-- Region Select -->
          <div class="col-md-12 q-mt-md">
            <q-select
              v-model="formData.region"
              :options="regionOptions"
              label="Select Region"
              placeholder="Select Region"
              color="grey-9"
              class="text-weight-regular text-grey-8"
              emit-value
              map-options
            />
          </div>

          <!-- Action Buttons -->
          <div class="col-md-12 group q-mt-lg text-right">
            <q-btn
              flat
              label="Cancel"
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnshowEditRegion"
            />
            <q-btn
              label="Save"
              color="purple-9"
              @click="submitPodAndRegions"
            />
          </div>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propShowEditRegion: { type: Boolean, required: true },
  propRowDetails: { type: Object, required: true }
})
const emit = defineEmits(['emitfnshowEditRegion'])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- Reactive State ---------------- */
const toggleModel = ref(props.propShowEditRegion)
const deviceOptions = ref([])
const regionOptions = ref([])

const formData = reactive({
  podNumber: props.propRowDetails.podNumber || '',
  device: props.propRowDetails.device || '',
  region: props.propRowDetails.region || ''
})

/* ---------------- Watchers ---------------- */
watch(() => props.propShowEditRegion, (val) => {
  toggleModel.value = val
})

/* ---------------- Methods ---------------- */
const emitfnshowEditRegion = () => {
  emit('emitfnshowEditRegion')
}

const fetchDeviceOptions = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA')
    deviceOptions.value = store.getters['InventoryCentral/getAllInventoryDevicesTypesData'].map(d => ({
      label: d.deviceName,
      value: d
    }))
  } catch {
    deviceOptions.value = []
  }
}

const fetchRegionOptions = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA')
    regionOptions.value = store.getters['InventoryCentral/getAllRegionsData'].map(r => ({
      label: r.regionAreaName,
      value: r
    }))
  } catch {
    regionOptions.value = []
  }
}

const submitPodAndRegions = async () => {
  if (!formData.podNumber || !formData.device || !formData.region) {
    $q.notify({
      color: 'negative',
      message: 'Please fill all required fields',
      position: 'bottom',
      icon: 'warning'
    })
    return
  }

  $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Updating data...' })

  try {
    const finalRequest = {
      ...props.propRowDetails,
      podNumber: formData.podNumber,
      device: formData.device,
      region: formData.region
    }

    await store.dispatch('inventoryWithRegion/EDIT_INVENTORY_WITH_REGION_DETAILS', { request: finalRequest })
    
    $q.notify({
      color: 'positive',
      message: 'Data updated successfully!',
      position: 'bottom',
      icon: 'thumb_up'
    })

    await store.dispatch('inventoryWithRegion/FETCH_INVENTORY_WITH_REGION_DATAS')
    emitfnshowEditRegion()
  } catch (err) {
    $q.notify({
      color: 'negative',
      message: err?.data?.message || 'Failed to update data',
      position: 'bottom',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

/* ---------------- On Mounted ---------------- */
onMounted(() => {
  fetchDeviceOptions()
  fetchRegionOptions()
})
</script>

<style scoped>
/* Optional: Add your existing styles if needed */
</style>
