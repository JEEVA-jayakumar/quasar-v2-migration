<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    no-backdrop-dismiss
    @hide="toggleModal"
  >
    <q-card class="customModalOverlay" style="min-width: 30vw">
      <q-card-section class="q-pa-lg">

        <div class="text-h6 text-weight-regular q-pb-md">
          Edit Merchant Document Type
        </div>

        <q-form @submit.prevent="submitMerchantDocumentTypeData">

          <!-- Merchant Type -->
          <q-select
            v-model="formData.url.merchantType"
            :options="activeMerchantType"
            label="Select merchant type"
            placeholder="Merchant type"
            color="grey-9"
            class="q-mb-md"
            :error="v$.url.merchantType.$error"
            @blur="v$.url.merchantType.$touch"
          />

          <!-- Document Type -->
          <q-input
            v-model="formData.params.documentType"
            label="Merchant Document Type"
            placeholder="Merchant Document Type"
            color="grey-9"
            class="q-mb-md"
            :error="v$.params.documentType.$error"
            @blur="v$.params.documentType.$touch"
          />

          <!-- Mars Agreement ID -->
          <q-input
            v-model.number="formData.params.marsDocumentId"
            type="number"
            label="Mars Agreement Id"
            placeholder="Mars Agreement Id"
            color="grey-9"
            class="q-mb-md"
            :error="v$.params.marsDocumentId.$error"
            @blur="v$.params.marsDocumentId.$touch"
          />

          <!-- Sub Documents -->
          <div class="q-mb-md">
            <p>Does it contain sub documents?</p>
            <q-radio
              v-model="formData.params.viewType"
              :val="false"
              label="Yes"
              color="grey-9"
              @update:model-value="getViewTypeValue"
            />
            <q-radio
              v-model="formData.params.viewType"
              :val="true"
              label="No"
              color="grey-9"
              @update:model-value="getViewTypeValue"
            />
          </div>

          <!-- Mandatory -->
          <div class="q-mb-lg">
            <p>Whether document mandatory during lead generation?</p>
            <q-radio
              v-model="formData.params.required"
              :val="true"
              label="Yes"
              color="grey-9"
            />
            <q-radio
              v-model="formData.params.required"
              :val="false"
              label="No"
              color="grey-9"
            />
          </div>

          <!-- Actions -->
          <div class="row justify-end">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8 q-mr-sm"
              @click="toggleModal"
            />
            <q-btn
              color="purple-9"
              label="Save"
              type="submit"
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
/* =========================
   Imports
========================= */
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, integer, minValue, maxValue } from '@vuelidate/validators'

/* =========================
   Props & Emits
========================= */
const props = defineProps({
  propShowEditMerchantDocumentTypes: Boolean,
  propActiveMerchantTypes: Array,
  propRowDetails: Object,
  propCurrentMerchantType: [String, Number]
})

const emit = defineEmits(['emitfnshowMerchantDocumentTypes'])

/* =========================
   Quasar & Store
========================= */
const $q = useQuasar()
const store = useStore()

/* =========================
   Dialog State
========================= */
const dialogModel = ref(props.propShowEditMerchantDocumentTypes)

watch(
  () => props.propShowEditMerchantDocumentTypes,
  val => (dialogModel.value = val)
)

/* =========================
   Data
========================= */
const activeMerchantType = props.propActiveMerchantTypes

const formData = reactive({
  url: {
    merchantType: props.propCurrentMerchantType,
    hasSubDoc: props.propRowDetails.viewType ? 0 : 1,
    id: props.propRowDetails.id
  },
  params: {
    documentType: props.propRowDetails.documentType,
    parentId: props.propRowDetails.parentID,
    viewType: props.propRowDetails.viewType,
    marsDocumentId: props.propRowDetails.marsDocumentId,
    required: props.propRowDetails.required
  }
})

/* =========================
   Validation
========================= */
const rules = {
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

const v$ = useVuelidate(rules, formData)

/* =========================
   Methods
========================= */
const toggleModal = () => {
  emit('emitfnshowMerchantDocumentTypes')
}

const getViewTypeValue = (val) => {
  formData.url.hasSubDoc = val ? 0 : 1
}

const submitMerchantDocumentTypeData = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch(
      'merchantDocumentTypes/UPDATE_MERCHANT_DOCUMENT_TYPE',
      formData
    )

    $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Merchant document type successfully updated!',
      icon: 'thumb_up'
    })

    emit('emitfnshowMerchantDocumentTypes', 'refresh')
  } catch (error) {

    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
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
