<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    @hide="emitfnShowCancelStatus"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">
      <q-card-section>
        <div class="text-h6 text-weight-regular">
          Add Service
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.name"
          label="Enter Status"
          placeholder="Enter Status"
          color="grey-9"
          class="text-grey-8"
          :error="v$.formData.name.$error"
          error-message="Status is required"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          class="text-grey-8"
          @click="emitfnShowCancelStatus"
        />
        <q-btn
          color="purple-9"
          label="Save"
          @click="fnfinalsubmitAddCancelStatus"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- props & emits ---------------- */
const props = defineProps({
  propShowCancelStatus: { type: Boolean, required: true },
  propRowDetails3: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['emitfnShowCancelStatus'])

/* ---------------- state ---------------- */
const $q = useQuasar()
const store = useStore()

const toggleModel = ref(props.propShowCancelStatus)

watch(
  () => props.propShowCancelStatus,
  val => (toggleModel.value = val)
)

const formData = reactive({
  name: ''
})

/* ---------------- validation ---------------- */
const rules = {
  formData: {
    name: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ---------------- vuex action ---------------- */
const POST_CANCEL_STATUS_TYPES = payload =>
  store.dispatch('serviceRequestCancelled/POST_CANCEL_STATUS_TYPES', payload)

/* ---------------- methods ---------------- */
const emitfnShowCancelStatus = (refresh = null) => {
  emit('emitfnShowCancelStatus', refresh)
}

const fnfinalsubmitAddCancelStatus = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await POST_CANCEL_STATUS_TYPES(formData)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Added Successfully',
      icon: 'thumb_up'
    })

    emitfnShowCancelStatus('refresh')
  } catch (error) {

    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: error?.data?.message || 'Something went wrong'
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
