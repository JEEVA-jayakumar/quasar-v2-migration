<template>
  <q-dialog
    v-model="toggleModel"
    class="customModalOverlay"
    @hide="emitfnshowservice"
  >
    <q-card style="min-width: 30vw; padding: 25px">
      <q-card-section>
        <div class="text-weight-regular text-h6">
          Reject Reason
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.reason"
          class="text-weight-regular text-grey-8"
          color="grey-9"
          label="Enter the Reason"
          placeholder="reason"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="bg-white text-weight-regular text-grey-8"
          label="Cancel"
          @click="emitfnshowservice"
        />
        <q-btn
          color="purple-9"
          label="Submit"
          :disabled="submitDisabled()"
          @click="submitShortLead(formData)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ---------- props & emits ---------- */
const props = defineProps({
  propShowTicketReject: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnshowservice'])

/* ---------- quasar & store ---------- */
const $q = useQuasar()
const store = useStore()

/* ---------- state ---------- */
const toggleModel = ref(props.propShowTicketReject)

const formData = ref({
  reason: ''
})

/* ---------- sync dialog ---------- */
watch(
  () => props.propShowTicketReject,
  (val) => {
    toggleModel.value = val
  }
)

/* ---------- methods ---------- */
const emitfnshowservice = () => {
  emit('emitfnshowservice')
}

const submitShortLead = (request) => {
  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  })

  const requestParams = {
    id: props.propRowDetails.id,
    reason: {
      satRejectedRemarks: request.reason
    }
  }

  store.dispatch(
    'equitasImplementedQueue/SERVICE_TICKET_REJECT',
    requestParams
  )
    .then(() => {
      $q.loading.hide()
      emitfnshowservice()

      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'This lead is Rejected!',
        icon: 'thumb_up'
      })

      location.reload()
    })
    .catch((error) => {
      $q.loading.hide()

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error?.body?.message ?? 'Please Try Again Later !',
        icon: 'thumb_down'
      })
    })
}

const submitDisabled = () => {
  if (formData.value.reason.length > 0) {
    const firstCharCode = formData.value.reason.charCodeAt(0)

    if (firstCharCode === 32 || firstCharCode === 10) {
      formData.value.reason = formData.value.reason.trim()
      return true
    }
    return false
  }

  formData.value.reason = formData.value.reason.trim()
  return true
}
</script>
