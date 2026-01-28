<template>
  <q-dialog
    v-model="localToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="padding: 30px; min-width: 30vw">
      <form @submit.prevent="submitLeadSourceData">
        <!-- Header -->
        <div class="row q-py-sm items-center">
          <div class="col-12">
            <div class="text-h6 text-weight-regular">
              Edit Lead Source
            </div>
          </div>
        </div>

        <!-- Lead Source Name -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.sourceName"
              label="Lead Source"
              placeholder="Lead Source"
              color="grey-9"
              :error="v$.formData.sourceName.$error"
              @blur="v$.formData.sourceName.$touch"
              @keyup.enter="submitLeadSourceData"
            />
          </div>
        </div>

        <!-- Source Code -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.sourceCode"
              label="Enter Source Code"
              placeholder="Enter Source Code"
              color="grey-9"
              :error="v$.formData.sourceCode.$error"
              @blur="v$.formData.sourceCode.$touch"
              @keyup.enter="submitLeadSourceData"
            />
          </div>
        </div>

        <!-- Multi TID -->
        <div class="row q-py-sm">
          <div class="col-12">
            <p class="q-caption">Multi-TID</p>
            <q-option-group
              type="radio"
              :options="multiTidFlagOptions"
              v-model="formData.multiTidEnabled"
              color="grey-9"
              :error="v$.formData.multiTidEnabled.$error"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="row q-py-sm">
          <div class="col-12 text-right">
            <q-btn
              flat
              class="text-grey-8"
              label="Cancel"
              @click="toggleModal"
            />
            <q-btn
              class="q-ml-sm"
              color="purple-9"
              label="Save"
              type="submit"
            />
          </div>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
/* ------------------------------------------------
   Imports
-------------------------------------------------*/
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ------------------------------------------------
   Props & Emits
-------------------------------------------------*/
const props = defineProps({
  propShowEditLeadSources: Boolean,
  propRowDetails: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'emitfnshowLeadSources',
  'emitfnForLeadSourceTableRefresh'
])

/* ------------------------------------------------
   Core
-------------------------------------------------*/
const $q = useQuasar()
const store = useStore()

/* ------------------------------------------------
   Dialog State Sync
-------------------------------------------------*/
const localToggle = ref(props.propShowEditLeadSources)

watch(
  () => props.propShowEditLeadSources,
  val => (localToggle.value = val)
)

/* ------------------------------------------------
   Static Options
-------------------------------------------------*/
const multiTidFlagOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
]

/* ------------------------------------------------
   Form Data
-------------------------------------------------*/
const formData = reactive({
  id: props.propRowDetails.id,
  sourceName: props.propRowDetails.sourceName,
  sourceCode: props.propRowDetails.sourceCode,
  multiTidEnabled: props.propRowDetails.multiTidEnabled === true
})

/* ------------------------------------------------
   Validation
-------------------------------------------------*/
const rules = {
  formData: {
    sourceName: { required },
    sourceCode: { required },
    multiTidEnabled: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ------------------------------------------------
   Methods
-------------------------------------------------*/
const toggleModal = () => {
  emit('emitfnshowLeadSources')
}

const submitLeadSourceData = async () => {
  await v$.value.$validate()

  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('leadSource/UPDATE_LEAD_SOURCE', formData)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Lead Source successfully updated!',
      icon: 'thumb_up'
    })

    emit('emitfnshowLeadSources', 'refresh')
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
/* No UI changes required */
</style>
