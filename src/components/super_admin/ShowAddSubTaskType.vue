<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    @hide="emitfnShowAddNewSubTaskType"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">
      <q-card-section>
        <div class="text-h6 text-weight-regular">
          Add Sub Task Types
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.name"
          label="Enter Sub Task Name"
          placeholder="Enter Sub Task Name"
          color="grey-9"
          class="text-grey-8"
          :error="v$.formData.name.$error"
          :error-message="'Sub Task Name is required'"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          class="text-grey-8"
          @click="emitfnShowAddNewSubTaskType"
        />
        <q-btn
          color="purple-9"
          label="Save"
          @click="fnfinalsubmitAddSubTaskType"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- props & emits ---------------- */
const props = defineProps({
  propShowAddSubTaskType: { type: Boolean, required: true },
  propRowDetails: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['emitfnShowAddNewSubTaskType'])

/* ---------------- state ---------------- */
const $q = useQuasar()
const store = useStore()
const toggleModel = ref(props.propShowAddSubTaskType)

watch(
  () => props.propShowAddSubTaskType,
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



/* ---------------- actions ---------------- */
const FETCH_SUB_TASK_DATAS = () =>
  store.dispatch('serviceRequest/FETCH_SUB_TASK_DATAS')

const POST_SUB_TASK_TYPES = payload =>
  store.dispatch('serviceRequest/POST_SUB_TASK_TYPES', payload)

/* ---------------- methods ---------------- */
const emitfnShowAddNewSubTaskType = (refresh = null) => {
  emit('emitfnShowAddNewSubTaskType', refresh)
}

const fnAddSubTaskDetails = async () => {
  try {
    await FETCH_SUB_TASK_DATAS()
  } catch {
    /* silent fail – same as existing behavior */
  }
}

const fnfinalsubmitAddSubTaskType = async () => {
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
    await POST_SUB_TASK_TYPES(formData)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Sub Task Added Successfully',
      icon: 'thumb_up'
    })

    emitfnShowAddNewSubTaskType('refresh')
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

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  fnAddSubTaskDetails()
})
</script>

<style scoped>
.customModalOverlay {
  border-radius: 8px;
}
</style>
