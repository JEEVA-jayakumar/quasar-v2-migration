<template>
  <q-dialog
    v-model="toggleModel"
    class="customModalOverlay"
    @hide="emitfnshowservice"
  >
    <q-card style="min-width: 40vw; padding: 50px">
      <q-card-section>
        <div class="text-weight-regular text-h6">
          Approve the Lead
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model.trim="formData.tid"
          disable
          class="no-margin"
          label="TID"
        />

        <q-input
          v-model.trim="formData.ticketid"
          disable
          class="no-margin q-mt-sm"
          label="TICKET ID"
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
          @click="submitShortLead"
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
  propShowTicketApprove: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnshowservice'])

/* ---------- quasar & store ---------- */
const $q = useQuasar()
const store = useStore()

/* ---------- state ---------- */
const toggleModel = ref(props.propShowTicketApprove)

const formData = ref({
  tid: props.propRowDetails?.serviceRequestData?.tid,
  ticketid: props.propRowDetails?.serviceRequestData?.serviceReqTicketId
})

/* ---------- sync dialog ---------- */
watch(
  () => props.propShowTicketApprove,
  (val) => {
    toggleModel.value = val
  }
)

/* ---------- methods ---------- */
const emitfnshowservice = () => {
  emit('emitfnshowservice')
}

const submitShortLead = () => {
  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  })

  store.dispatch(
    'equitasImplementedQueue/SERVICE_TICKET_APPROVE',
    props.propRowDetails
  )
    .then(() => {
      $q.loading.hide()
      emitfnshowservice()

      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Approved successfully',
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
</script>
