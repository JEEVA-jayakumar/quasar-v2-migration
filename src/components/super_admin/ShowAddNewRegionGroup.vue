<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    @hide="emitfnShowAddNewRegionsGroups"
  >
    <q-card class="q-pa-lg" style="min-width: 30vw">
      <form @submit.prevent="fnfinalsubmitAddNewRegionGroup">
        <!-- Title -->
        <div class="row q-py-sm">
          <div class="col-12 text-h6 text-weight-regular">
            Add New Region Group
          </div>
        </div>

        <!-- Input -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.regionName"
              label="Region"
              color="grey-9"
              :error="v$.formData.regionName.$error"
              :error-message="'Region is required'"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="row q-py-sm justify-end">
          <q-btn
            flat
            label="Cancel"
            class="text-grey-8"
            @click="emitfnShowAddNewRegionsGroups"
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
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ========================
   Props & Emits
======================== */
const props = defineProps({
  propShowAddNewRegionsGroup: {
    type: Boolean,
    required: true
  },
  propRowDetails: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['emitfnShowAddNewRegionsGroups'])

/* ========================
   Quasar & Store
======================== */
const $q = useQuasar()
const store = useStore()

/* ========================
   State
======================== */
const toggleModel = ref(props.propShowAddNewRegionsGroup)

const formData = ref({
  regionName: ''
})

/* ========================
   Validation
======================== */
const rules = {
  formData: {
    regionName: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ========================
   Watch prop → dialog sync
======================== */
watch(
  () => props.propShowAddNewRegionsGroup,
  (val) => {
    toggleModel.value = val
  }
)

/* ========================
   Methods
======================== */
const emitfnShowAddNewRegionsGroups = () => {
  emit('emitfnShowAddNewRegionsGroups')
}

const fnfinalsubmitAddNewRegionGroup = async () => {
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
      'regionGroupDatas/CREATE_NEW_REGION_GROUP',
      formData.value
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully updated!',
      icon: 'thumb_up'
    })

    emitfnShowAddNewRegionsGroups()
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
</script>

<style scoped>
/* keep your custom styles if needed */
</style>
