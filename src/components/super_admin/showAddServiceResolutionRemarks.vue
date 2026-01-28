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
          Add Service Resolution Remarks
        </div>
      </div>

      <!-- FORM -->
      <q-form @submit.prevent="submitForm">

        <!-- INPUT -->
        <q-input
          v-model="formData.name"
          label="Enter Service Resolution Remarks"
          dense
          outlined
          :error="v$.formData.name.$error"
          error-message="Remarks is required"
          class="q-mb-md"
          @blur="v$.formData.name.$touch"
        />

        <!-- RADIO -->
        <div class="q-mb-md">
          <q-radio
            v-for="(item, index) in option.flagOptions"
            :key="index"
            v-model="formData.category"
            :val="item.value"
            :label="item.label"
            color="grey-9"
            class="q-mr-md"
            @blur="v$.formData.category.$touch"
          />
          <div v-if="v$.formData.category.$error" class="text-negative text-caption">
            Category is required
          </div>
        </div>

        <!-- ACTIONS -->
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
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ===================== PROPS & EMITS ===================== */
const props = defineProps({
  propShowAddServiceResolutionRemarks: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnShowAddServiceResolutionRemarks'])

/* ===================== QUASAR ===================== */
const $q = useQuasar()
const store = useStore()

/* ===================== DIALOG STATE ===================== */
const dialog = ref(props.propShowAddServiceResolutionRemarks)

watch(
  () => props.propShowAddServiceResolutionRemarks,
  (val) => (dialog.value = val)
)

/* ===================== FORM DATA ===================== */
const formData = ref({
  name: '',
  category: null
})

const option = {
  flagOptions: [
    { label: 'APP', value: 1 },
    { label: 'PORTAL', value: 2 }
  ]
}

/* ===================== VALIDATION ===================== */
const rules = {
  formData: {
    name: { required },
    category: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ===================== METHODS ===================== */
const closeDialog = () => {
  emit('emitfnShowAddServiceResolutionRemarks')
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
      'serviceRequest/POST_SERVICE_RESOLUTION_REMARKS',
      formData.value
    )

    $q.notify({
      color: 'positive',
      message: 'Remarks Added Successfully',
      icon: 'thumb_up'
    })

    emit('emitfnShowAddServiceResolutionRemarks', 'refresh')
  } catch (err) {
    $q.notify({
      color: 'amber-9',
      message: err?.data?.message || 'Something went wrong'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.q-radio {
  margin-right: 12px;
}
</style>
