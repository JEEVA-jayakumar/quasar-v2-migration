<template>
  <q-dialog
    v-model="dialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 30vw" class="q-pa-md">

      <!-- TITLE -->
      <div class="row items-center q-pb-md">
        <div class="text-h6 text-weight-regular">
          Add Service Statussss
        </div>
      </div>

      <!-- FORM -->
      <q-form @submit.prevent="submitForm">

        <!-- INPUT -->
        <q-input
          v-model="formData.name"
          label="Enter Service Status"
          outlined
          dense
          class="q-mb-md"
          :error="v$.formData.name.$error"
          error-message="Service status is required"
          @blur="v$.formData.name.$touch"
        />

        <!-- ACTION BUTTONS -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            label="Cancel"
            color="grey-8"
            @click="closeDialog"
          />
          <q-btn
            label="Save"
            color="purple-9"
            type="submit"
          />
        </div>

      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ===================== PROPS & EMITS ===================== */
const props = defineProps({
  propShowAddServiceStatus: Boolean,
  propRowDetails3: Object
})

const emit = defineEmits(['emitfnShowAddNewServiceStatus'])

/* ===================== QUASAR & STORE ===================== */
const $q = useQuasar()
const store = useStore()

/* ===================== DIALOG ===================== */
const dialog = ref(props.propShowAddServiceStatus)

watch(
  () => props.propShowAddServiceStatus,
  (val) => (dialog.value = val)
)

/* ===================== FORM DATA ===================== */
const formData = ref({
  name: ''
})

/* ===================== VALIDATION ===================== */
const rules = {
  formData: {
    name: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ===================== METHODS ===================== */
const closeDialog = () => {
  emit('emitfnShowAddNewServiceStatus')
}

const submitForm = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({
      type: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  try {
    $q.loading.show({
      message: 'Please Wait',
      spinnerColor: 'purple-9'
    })

    await store.dispatch(
      'ServiceRequestStatus/POST_SERVICE_STATUS_TYPES',
      formData.value
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Added Successfully',
      icon: 'thumb_up'
    })

    emit('emitfnShowAddNewServiceStatus', 'refresh')
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

/* ===================== LIFECYCLE ===================== */
onMounted(() => {
  store.dispatch('ServiceRequestStatus/FETCH_SERVICE_REQUEST_STATUS_DETAILS')
})
</script>
