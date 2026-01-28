<template>
  <div>

    <!-- Expected Date -->
    <q-input
      v-model="formData.leadVerificationStatus.expectedSubmitDate"
      label="Expected date of Doc Submission"
      readonly
      color="red-6"
      class="q-mt-lg"
      :error="v$.formData.leadVerificationStatus.expectedSubmitDate.$error"
      @blur="v$.formData.leadVerificationStatus.expectedSubmitDate.$touch()"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="formData.leadVerificationStatus.expectedSubmitDate"
              mask="YYYY-MM-DD"
              color="red-6"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- SO Remarks -->
    <q-input
      v-model="formData.leadVerificationStatus.soReason"
      type="textarea"
      readonly
      disabled
      label="SO's Remarks"
      class="q-mt-lg"
      rows="1"
      color="red-6"
    />

    <!-- SAT Remarks -->
    <q-input
      v-model="formData.leadVerificationStatus.reason"
      type="textarea"
      label="SAT Remarks"
      class="q-mt-lg"
      rows="1"
      color="red-6"
      :error="v$.formData.leadVerificationStatus.reason.$error"
      @blur="v$.formData.leadVerificationStatus.reason.$touch()"
    />

    <!-- Actions -->
    <div class="row justify-end q-mt-md">
      <q-btn
        size="sm"
        rounded
        outline
        color="red-9"
        class="q-mx-sm"
        @click="sendRemarks"
      >
        Send
      </q-btn>

      <q-btn
        size="sm"
        rounded
        outline
        color="grey-9"
        class="q-mx-sm"
        @click="emitToggleRemarks"
      >
        Cancel
      </q-btn>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------------------------
 * Props & Emits
 * --------------------------------- */
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggleRemarks'])

/* ---------------------------------
 * Quasar & Store
 * --------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------------------------
 * State
 * --------------------------------- */
const formData = ref({
  leadInformation: {
    verifiedKycStatus: 3
  },
  leadVerificationStatus: {
    fieldName: 'KYC',
    expectedSubmitDate: '',
    soReason: props.item.SORemarks,
    reason: '',
    leadInformation: {
      id: props.item.leadId
    }
  }
})

/* ---------------------------------
 * Validation
 * --------------------------------- */
const rules = {
  formData: {
    leadVerificationStatus: {
      reason: { required },
      expectedSubmitDate: { required }
    }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ---------------------------------
 * Methods
 * --------------------------------- */
const emitToggleRemarks = () => {
  emit('toggleRemarks', props.item)
}

const sendRemarks = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({
      color: 'warning',
      message: 'Please review fields again.'
    })
    return
  }

  store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', true)

  try {
    await store.dispatch(
      'ExceptionQueue/FEED_SAT_EQ_KYC_FEEDBACK',
      formData.value
    )

    store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', false)

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message:
        'Rejected Lead: #' +
        formData.value.leadVerificationStatus.leadInformation.id,
      icon: 'clear'
    })

    store.dispatch('ExceptionQueue/FETCH_ALL_EXCEPTIONS_DATA')
    emitToggleRemarks()

  } catch (error) {

    store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', false)

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  }
}
</script>
