<template>
  <q-dialog
    v-model="internalDialog"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <q-card-section class="column group">
        <div class="q-title q-py-md">Are you sure you want to reject?</div>

        <q-input
          v-model="formData.leadInformation.reason"
          @blur="v$.formData.leadInformation.reason.$touch()"
          :error="v$.formData.leadInformation.reason.$error"
          float-label="Remarks"
          color="primary"
        />

        <div class="group q-mt-md">
          <q-btn
            icon="clear"
            color="negative"
            class="q-ma-sm float-right"
            @click="sendRemarks()"
            label="Reject"
          />
          <q-btn
            icon="block"
            color="grey-5"
            class="q-ma-sm float-right text-dark"
            @click="emitToggleRemarks"
            v-close-overlay
            label="Cancel"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ---------------- PROPS & EMITS ---------------- */
const props = defineProps({
  propToggleLeadModal: { type: Boolean, required: true },
  propLeadDetails: { type: Object, required: true }
})
const emit = defineEmits(['toggleLeadModal'])

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- LOCAL STATE ---------------- */
const internalDialog = ref(props.propToggleLeadModal)
const formData = ref({
  leadInformation: {
    fieldName: 'SAT exception queue KYC reject by OPS',
    reason: ''
  },
  leadId: props.propLeadDetails.id,
  defaultUrlValue: $q?.EXCEPTION_QUEUE_KYC_OPS_HEAD_REJECT_URL_PARAM
})

/* ---------------- SYNC PROP CHANGES ---------------- */
watch(() => props.propToggleLeadModal, val => internalDialog.value = val)

/* ---------------- VUELIDATE ---------------- */
const rules = {
  formData: {
    leadInformation: {
      reason: { required }
    }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- METHODS ---------------- */
const emitToggleRemarks = () => {
  emit('toggleLeadModal')
}

const sendRemarks = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
    return
  }

  try {
    $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Processing ..' })
    await store.dispatch('OPSHead/FEED_EQ_KYC_FEEDBACK', formData.value)
    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: `Rejected Lead : #${formData.value.leadId}`,
      icon: 'clear'
    })
    await store.dispatch('OPSHead/FETCH_ALL_EXCEPTION_KYC_DATA')
    emit('toggleLeadModal')
    $q.loading.hide()
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  }
}
</script>

<style scoped>
.group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
