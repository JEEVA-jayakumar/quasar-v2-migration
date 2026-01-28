<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <!-- START >> Lead reject -->
      <form @submit.prevent="sendRemarks">

        <div class="column">

          <div class="text-h6 q-py-md">
            Are you sure want to reject?
          </div>

          <!-- SO Remarks (readonly) -->
          <q-input
            v-model="formData.soReason"
            label="SO Remarks"
            color="light-blue"
            readonly
          />

          <!-- SAT Remarks -->
          <q-input
            v-model="formData.leadInformation.kycSatRemark"
            label="SAT Remarks"
            color="light-blue"
            :error="v$.formData.leadInformation.kycSatRemark.$error"
            @blur="v$.formData.leadInformation.kycSatRemark.$touch()"
            class="q-mt-md"
          />

          <!-- Buttons -->
          <div class="row justify-end q-mt-md q-gutter-sm">
            <q-btn
              icon="clear"
              color="negative"
              label="Reject"
              @click="sendRemarks"
            />

            <q-btn
              icon="block"
              color="grey-5"
              label="Cancel"
              text-color="dark"
              @click="emitToggleRemarks"
            />
          </div>

        </div>
      </form>
      <!-- END >> Lead reject -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------------------------
 * Props
 * --------------------------------- */
const props = defineProps({
  propToggleLeadModal: {
    type: Boolean,
    required: true
  },
  propLeadDetails: {
    type: Object,
    required: true
  }
})

/* ---------------------------------
 * Emits
 * --------------------------------- */
const emit = defineEmits(['toggleLeadModal'])

/* ---------------------------------
 * Quasar / Router / Store
 * --------------------------------- */
const $q = useQuasar()
const router = useRouter()
const store = useStore()

/* ---------------------------------
 * State
 * --------------------------------- */
const toggleModel = ref(props.propToggleLeadModal)

const formData = ref({
  soReason: props.propLeadDetails.reason,
  leadInformation: {
    fieldName: 'SAT exception queue KYC reject',
    kycSatRemark: ''
  },
  leadId: props.propLeadDetails.id,
  defaultUrlValue: store.state.EXCEPTION_QUEUE_KYC_SAT_REJECT_URL_PARAM
})

/* ---------------------------------
 * Validation
 * --------------------------------- */
const rules = {
  formData: {
    leadInformation: {
      kycSatRemark: { required }
    }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ---------------------------------
 * Sync prop
 * --------------------------------- */
watch(
  () => props.propToggleLeadModal,
  val => (toggleModel.value = val)
)

/* ---------------------------------
 * Methods
 * --------------------------------- */
const emitToggleRemarks = () => {
  emit('toggleLeadModal')
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

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Processing ..'
  })

  try {
    await store.dispatch(
      'ExceptionQueue/FEED_SAT_EQ_KYC_FEEDBACK',
      formData.value
    )

    $q.loading.hide()

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: `Rejected Lead : #${formData.value.leadId}`,
      icon: 'clear'
    })

    router.push('/sat/exception/queue')

  } catch (error) {

    $q.loading.hide()

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  }
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 7000;
}
</style>
