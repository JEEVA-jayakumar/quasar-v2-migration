<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <!-- Title -->
      <q-card-section class="q-pb-md">
        <div class="text-h6 text-weight-regular">Edit POD</div>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="column q-pt-none">
        <q-input
          v-model="formData.pod"
          outlined
          label="Pod Number"
          placeholder="Pod Number"
          :error="v$.formData.pod.$invalid && v$.formData.pod.$dirty"
          class="text-weight-regular text-grey-8"
        />

        <q-select
          v-model="formData.region"
          outlined
          label="Region"
          placeholder="Region"
          :options="inventoryData.regionFilterOptions"
          class="q-mt-md"
        />
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right">
        <q-btn flat outline color="purple-9" label="Cancel" @click="emitfnshowEditRegion" />
        <q-btn color="purple-9" label="Save" @click="submitRegion(formData)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propShowEditRegion: { type: Boolean, required: true },
  propRowDetails: { type: Object, required: true }
})
const emit = defineEmits(['emitfnshowEditRegion'])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- State ---------------- */
const toggleModel = ref(props.propShowEditRegion)
const formData = ref({
  pod: props.propRowDetails.podNumber,
  region: props.propRowDetails.region.regionAreaName
})
const inventoryData = ref({
  regionFilterOptions: []
})

/* ---------------- Watch Props ---------------- */
watch(() => props.propShowEditRegion, val => toggleModel.value = val)
watch(() => props.propRowDetails, val => {
  formData.value.pod = val.podNumber
  formData.value.region = val.region.regionAreaName
})

/* ---------------- Vuelidate ---------------- */
const rules = {
  formData: {
    pod: { required },
    region: { required }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Methods ---------------- */
function emitfnshowEditRegion() {
  emit('emitfnshowEditRegion')
}

async function getAllRegion() {
  $q.loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Please Wait...' })
  try {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')
    inventoryData.value.regionFilterOptions = store.getters['SuperAdminUsers/getAllRegionsData']
  } catch (error) {

    console.error(error)
  } finally {
    $q.loading.hide()
  }
}

async function submitRegion(request) {
  v$.value.$touch()
  if (v$.value.$invalid) {
    $q.notify({ message: 'Please review fields again.', color: 'negative' })
    return
  }

  const params = {
    pod: request.pod,
    region: request.region
  }

  $q.loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Please Wait...' })

  try {
    const response = await store.dispatch('SuperAdminUsers/EDIT_POD_REGION', params)
    await store.dispatch('PodList/FETCH_POD_LIST')
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: response.data.message || 'Updated Successfully!',
      icon: 'thumb_up'
    })
    emit('emitfnshowEditRegion')
  } catch (error) {

    $q.notify({
      color: 'amber',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

/* ---------------- Lifecycle ---------------- */
onMounted(() => {
  getAllRegion()
})
</script>

<style scoped>
/* Optional: bottom-border styling if needed */
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
