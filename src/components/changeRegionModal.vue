<template>
  <q-dialog v-model="opened" persistent>
    <q-card style="min-width: 30vw; padding: 20px" class="capitalize">

      <!-- Header -->
      <div class="row items-center bottom-border q-py-sm">
        <div class="col">Change Region</div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            outline
            color="dark"
            icon="close"
            @click="emitToggleRemarks"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Current Region -->
      <div class="row q-mb-md">
        <div class="col-4"><strong>Current Region</strong></div>
        <div class="col-6">
          <div class="current">{{ currentRegion }}</div>
        </div>
      </div>

      <!-- Select Region -->
      <div class="row q-mb-md">
        <div class="col-4 region"><strong>Select Region</strong></div>
        <div class="col-6">
          <q-select
            v-model="formData.region"
            :options="regionOptions"
            option-label="label"
            option-value="value"
            label="Select Region"
            emit-value
            map-options
            color="grey-9"
            dense
          />
        </div>
      </div>

      <!-- Remarks -->
      <div class="row q-mb-lg">
        <div class="col-4 text"><strong>Add Remarks</strong></div>
        <div class="col-6">
          <q-input
            v-model="remarks"
            filled
            clearable
            type="textarea"
            color="purple-9"
            label="Remarks"
          />
        </div>
      </div>

      <!-- Submit -->
      <div class="row justify-center">
        <q-btn
          rounded
          class="glossy"
          label="Submit"
          color="purple-9"
          :disable="!formData.region"
          @click="changeRegion"
        />
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ----------------------------------
 * Props & Emits
 * ---------------------------------- */
const props = defineProps({
  regionInformation: { type: Object, required: true },
  propToggleRegionInfoPop: { type: Boolean, required: true }
})

const emit = defineEmits(['closeRegionInformation'])

/* ----------------------------------
 * Quasar & Store
 * ---------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ----------------------------------
 * State
 * ---------------------------------- */
const opened = computed({
  get: () => props.propToggleRegionInfoPop,
  set: () => emit('closeRegionInformation')
})

const currentRegion = ref(null)
const remarks = ref('')
const regionOptions = ref([])

const formData = ref({
  region: ''
})

/* ----------------------------------
 * Getters
 * ---------------------------------- */
const getAllRegionsData = computed(
  () => store.getters['InventoryCentral/getAllRegionsData']
)

/* ----------------------------------
 * Lifecycle
 * ---------------------------------- */
onMounted(() => {
  currentRegion.value = JSON.parse(localStorage.getItem('u_i'))?.region?.regionAreaName || 'NA'
  fnAjaxGetAllRegionsData()
})

/* ----------------------------------
 * Methods
 * ---------------------------------- */
function fnAjaxGetAllRegionsData () {
  store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA')
    .then(() => {
      regionOptions.value = getAllRegionsData.value.map(r => ({
        label: r.regionAreaName,
        value: r
      }))
    })
    .catch(() => {
      regionOptions.value = []
    })
}

function changeRegion () {
  const payload = {
    marsDetails: props.regionInformation,
    region: formData.value.region,
    remarks: remarks.value
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  store.dispatch('phonepeImplementationQueue/CHANGE_REGION', payload)
    .then(() => {
      $q.loading.hide()
      $q.notify({
        color: 'positive',
        message: 'Region Changed successfully',
        icon: 'thumb_up'
      })
      emitToggleRemarks()
    })
    .catch(error => {
      $q.loading.hide()
      $q.notify({
        color: 'negative',
        message: error?.body?.message || 'Please Try Again Later !',
        icon: 'thumb_down'
      })
    })
}

function emitToggleRemarks () {
  emit('closeRegionInformation')
}
</script>

<style scoped>
.region {
  margin-top: 15px;
}
.current {
  background-color: darksalmon;
  padding: 4px 8px;
}
.text {
  margin-top: 32px;
}
.glossy {
  background-color: rgb(151, 47, 151);
}
</style>
