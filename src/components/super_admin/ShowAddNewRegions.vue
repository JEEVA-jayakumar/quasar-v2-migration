<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    @hide="emitfnShowAddNewRegions"
  >
    <q-card class="q-pa-lg" style="min-width: 30vw">
      <form @submit.prevent="fnfinalsubmitAddNewRegion">
        <!-- Title -->
        <div class="row q-py-sm">
          <div class="col-12 text-h6 text-weight-regular">
            Add New Regions
          </div>
        </div>

        <!-- Region Group -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-select
              v-model="formData.regionGroup"
              :options="regionGroupOptions"
              label="Region Group"
              color="grey-9"
              emit-value
              map-options
              :error="v$.formData.regionGroup.$error"
              error-message="Region Group is required"
            />
          </div>
        </div>

        <!-- Region Name -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.regionAreaName"
              label="Region"
              color="grey-9"
              :error="v$.formData.regionAreaName.$error"
              error-message="Region is required"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="row q-py-sm justify-end">
          <q-btn
            flat
            label="Cancel"
            class="text-grey-8"
            @click="emitfnShowAddNewRegions"
          />
          <q-btn
            color="purple-9"
            label="Save"
            type="submit"
            class="q-ml-sm"
          />
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* =========================
   Props & Emits
========================= */
const props = defineProps({
  propShowAddNewRegions: {
    type: Boolean,
    required: true
  },
  propRowDetails: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['emitfnShowAddNewRegions'])

/* =========================
   Quasar & Store
========================= */
const $q = useQuasar()
const store = useStore()

/* =========================
   State
========================= */
const toggleModel = ref(props.propShowAddNewRegions)

const regionGroupOptions = ref([])

const formData = ref({
  regionGroup: '',
  regionAreaName: ''
})

/* =========================
   Validation
========================= */
const rules = {
  formData: {
    regionGroup: { required },
    regionAreaName: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =========================
   Watch dialog prop
========================= */
watch(
  () => props.propShowAddNewRegions,
  val => {
    toggleModel.value = val
  }
)

/* =========================
   Methods
========================= */
const emitfnShowAddNewRegions = () => {
  emit('emitfnShowAddNewRegions')
}

const fetchAllRegionGroupData = async () => {
  await store.dispatch('regionGroupDatas/FETCH_REGION_GROUP_DATAS')

  const data = store.getters['regionGroupDatas/getAllRegionGroupData'] || []

  regionGroupOptions.value = data.map(item => ({
    label: item.regionName,
    value: item
  }))
}

const fnfinalsubmitAddNewRegion = async () => {
  v$.value.$touch()

  if (v$.value.$invalid) {
    $q.notify({
      type: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  try {
    $q.loading.show()

    await store.dispatch(
      'SuperAdminUsers/FEED_REGION_DATA',
      formData.value
    )

    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully updated!',
      icon: 'thumb_up'
    })

    emitfnShowAddNewRegions()
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message:
        error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

/* =========================
   Lifecycle
========================= */
onMounted(fetchAllRegionGroupData)
</script>

<style scoped>
/* keep existing styles if any */
</style>
