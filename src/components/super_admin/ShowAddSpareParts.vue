<template>
  <q-dialog
    v-model="dialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="q-pa-md" style="min-width: 30vw">

      <!-- TITLE -->
      <div class="text-h6 text-weight-regular q-mb-md">
        Add Spare Types
      </div>

      <q-form @submit.prevent="submitForm">

        <!-- SPARE PART NAME -->
        <q-input
          v-model="formData.spare_parts_types"
          label="Enter Spare Parts Name"
          outlined
          dense
          class="q-mb-md"
          :error="v$.formData.spare_parts_types.$error"
          error-message="Spare part name is required"
          @blur="v$.formData.spare_parts_types.$touch"
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
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ===================== PROPS & EMITS ===================== */
const props = defineProps({
  propShowAddSpareParts: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnShowAddNewSpareParts'])

/* ===================== CORE ===================== */
const $q = useQuasar()
const store = useStore()
const router = useRouter()

/* ===================== DIALOG ===================== */
const dialog = ref(props.propShowAddSpareParts)

watch(
  () => props.propShowAddSpareParts,
  val => (dialog.value = val)
)

/* ===================== FORM DATA ===================== */
const formData = ref({
  spare_parts_types: ''
})

/* ===================== VALIDATION ===================== */
const rules = {
  formData: {
    spare_parts_types: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ===================== METHODS ===================== */
const closeDialog = () => {
  emit('emitfnShowAddNewSpareParts')
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
      'sparePartsGetTypes/UPDATE_SPARE_PARTS_TYPES',
      formData.value
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Spares Added Successfully',
      icon: 'thumb_up'
    })

    emit('emitfnShowAddNewSpareParts')
    router.push('/super/admin/sparePartsTypes')
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
