<template>
  <q-dialog
    v-model="localDialog"
    persistent
    class="customModalOverlay"
    @hide="closeModal"
  >
    <q-card style="min-width: 30vw; padding: 30px">
      <q-form @submit.prevent="submitMerchantDocumentTypeData">

        <!-- Title -->
        <div class="text-h6 text-weight-regular q-py-md">
          Add Merchant Document Type
        </div>

        <!-- Merchant Type -->
        <div class="q-mb-md">
          <q-select
            v-model="formData.url.merchantType"
            :options="activeMerchantType"
            label="Select merchant type"
            color="grey-9"
            :error="v$.formData.url.merchantType.$error"
            @blur="v$.formData.url.merchantType.$touch"
          />
        </div>

        <!-- Document Type -->
        <div class="q-mb-md">
          <q-input
            v-model="formData.params.documentType"
            label="Merchant Document Type"
            placeholder="Merchant Document Type"
            color="grey-9"
            :error="v$.formData.params.documentType.$error"
            @blur="v$.formData.params.documentType.$touch"
          />
        </div>

        <!-- Mars Document ID -->
        <div class="q-mb-md">
          <q-input
            v-model.number="formData.params.marsDocumentId"
            type="number"
            label="Mars Agreement Id"
            placeholder="Mars Agreement Id"
            color="grey-9"
            :error="v$.formData.params.marsDocumentId.$error"
            @blur="v$.formData.params.marsDocumentId.$touch"
          />
        </div>

        <!-- Sub Documents -->
        <div class="q-mb-md">
          <p>Does it contain sub documents?</p>
          <q-option-group
            v-model="formData.params.viewType"
            :options="subDocOptions"
            type="radio"
            color="grey-9"
            inline
          />
        </div>

        <!-- Mandatory -->
        <div class="q-mb-md">
          <p>Whether document mandatory during lead generation?</p>
          <q-option-group
            v-model="formData.params.required"
            :options="requiredOptions"
            type="radio"
            color="grey-9"
            inline
          />
        </div>

        <!-- Actions -->
        <div class="row q-pt-md">
          <div class="col-12 text-right">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8"
              @click="closeModal"
            />
            <q-btn
              color="purple-9"
              label="Save"
              class="q-ml-sm"
              type="submit"
            />
          </div>
        </div>

      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, integer, minValue, maxValue } from '@vuelidate/validators'

/* =====================
   Props & Emits
===================== */
const props = defineProps({
  propShowCreateMerchantDocumentTypes: Boolean,
  propActiveMerchantTypes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['emitfnshowMerchantDocumentTypes'])

/* =====================
   Quasar & Store
===================== */
const $q = useQuasar()
const store = useStore()

/* =====================
   Dialog Sync
===================== */
const localDialog = ref(props.propShowCreateMerchantDocumentTypes)

watch(
  () => props.propShowCreateMerchantDocumentTypes,
  val => (localDialog.value = val)
)

/* =====================
   Options
===================== */
const activeMerchantType = ref(props.propActiveMerchantTypes)

const subDocOptions = [
  { label: 'Yes', value: 0 },
  { label: 'No', value: 1 }
]

const requiredOptions = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 }
]

/* =====================
   Form Data
===================== */
const formData = reactive({
  url: {
    merchantType: null,
    hasSubDoc: 0
  },
  params: {
    documentType: '',
    parentID: 0,
    viewType: 0,
    marsDocumentId: null,
    required: 1
  }
})

/* =====================
   Watchers
===================== */
watch(
  () => formData.params.viewType,
  val => {
    formData.url.hasSubDoc = val === 0 ? 0 : 1
  }
)

/* =====================
   Validation
===================== */
const rules = {
  formData: {
    url: {
      merchantType: { required }
    },
    params: {
      documentType: { required },
      marsDocumentId: {
        required,
        integer,
        minValue: minValue(0),
        maxValue: maxValue(999)
      }
    }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =====================
   Methods
===================== */
function closeModal () {
  emit('emitfnshowMerchantDocumentTypes')
}

async function submitMerchantDocumentTypeData () {
  v$.value.$touch()
  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch(
      'merchantDocumentTypes/ADD_NEW_MERCHANT_DOCUMENT_TYPE',
      formData
    )

    $q.loading.hide()
    emit('emitfnshowMerchantDocumentTypes', 'refresh')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Merchant type successfully created!',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  }
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 2000;
}
</style>
