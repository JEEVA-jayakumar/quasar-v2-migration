<template>
  <q-dialog
    v-model="toggleModal"
    persistent
  >
    <q-card class="q-pa-lg" style="min-width:40vw">
      <q-card-section>
        <div class="text-h6 q-pb-md">
          Approval confirmation
        </div>

        <q-input
          v-model="formData.leadInformation.reason"
          label="Remarks"
          color="primary"
          outlined
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          color="grey-5"
          text-color="dark"
          icon="block"
          flat
          v-close-popup
          @click="emitToggleRemarks"
        />

        <q-btn
          label="Approve"
          color="positive"
          icon="done"
          @click="sendRemarks"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

/* ------------------ PROPS & EMITS ------------------ */

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

const emit = defineEmits(['toggleLeadModal'])

/* ------------------ PLUGINS ------------------ */

const $q = useQuasar()
const router = useRouter()
const store = useStore()

/* ------------------ STATE ------------------ */

const toggleModal = ref(props.propToggleLeadModal)

watch(
  () => props.propToggleLeadModal,
  val => (toggleModal.value = val)
)

const formData = ref({
  leadInformation: {
    fieldName: 'SAT exception queue KYC approve by OPS',
    reason: ''
  },
  leadId: props.propLeadDetails.id,
  defaultUrlValue: $q.config.globalProperties?.$EXCEPTION_QUEUE_KYC_OPS_HEAD_APPROVE_URL_PARAM
})

/* ------------------ METHODS ------------------ */

function emitToggleRemarks () {
  emit('toggleLeadModal')
}

async function sendRemarks () {
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Processing ..'
  })

  try {
    await store.dispatch(
      'OPSHead/FEED_EQ_KYC_FEEDBACK',
      formData.value
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: `Approved Lead : #${formData.value.leadId}`,
      icon: 'thumb_up'
    })

    router.push('/ops/head/exceptions')
  } catch {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Error in approving exception!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
