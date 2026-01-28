<template>
  <q-dialog
    v-model="showCreateRegionsToggle"
    persistent
    @hide="emitfnshowAddRegions"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">

      <!-- Header -->
      <q-card-section class="row items-center q-pa-md bottom-border">
        <div class="text-h6 text-weight-regular">Add Region Info</div>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pa-md column">
        <q-input
          v-model="formData.regionAreaName"
          label="Region"
          placeholder="Region"
          color="grey-9"
          class="text-grey-8 q-my-sm"
          :error="v$.value.formData.regionAreaName.$error"
          error-message="Region name is required"
          @blur="v$.value.formData.regionAreaName.$touch()"
        />
      </q-card-section>

      <!-- Actions -->
      <q-card-section class="row justify-end q-pa-md">
        <q-btn
          flat
          size="md"
          label="Cancel"
          color="grey-8"
          class="bg-white q-mr-sm"
          @click="emitfnshowAddRegions"
        />
        <q-btn
          size="md"
          label="Save"
          color="purple-9"
          @click="fnfinalsubmitRegion"
        />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propShowCreateRegions: { type: Boolean, required: true }
})
const emit = defineEmits(['emitfnshowRegions'])

/* ---------------- State ---------------- */
const $q = useQuasar()
const store = useStore()

// Dialog toggle
const showCreateRegionsToggle = ref(props.propShowCreateRegions)
watch(() => props.propShowCreateRegions, val => (showCreateRegionsToggle.value = val))

// Form data
const formData = reactive({
  regionAreaName: ''
})

/* ---------------- Validation ---------------- */
const rules = {
  formData: {
    regionAreaName: { required }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Vuex Actions ---------------- */
const FEED_REGION_DATA = payload => store.dispatch('SuperAdminUsers/FEED_REGION_DATA', payload)
const FETCH_ALL_REGIONS_DATA = () => store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')

/* ---------------- Methods ---------------- */
const emitfnshowAddRegions = () => {
  emit('emitfnshowRegions', 'emitfnForRegionTable')
}

const fnfinalsubmitRegion = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({ message: 'Please Wait', spinnerColor: 'purple-9' })

  try {
    await FEED_REGION_DATA(formData)
    await FETCH_ALL_REGIONS_DATA()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully created!',
      icon: 'thumb_up'
    })
    emitfnshowAddRegions()
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later!',
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
