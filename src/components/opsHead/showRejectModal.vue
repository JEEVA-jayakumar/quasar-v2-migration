<template>
  <q-dialog
    v-model="internalDialog"
    persistent
    :maximized="false"
  >
    <q-card style="max-width: 50vw; padding: 10px;">
      <q-card-section class="q-pa-md">
        <div class="row text-center">
          <div class="col">
            <div class="q-title text-weight-regular">Reject Exception</div>
          </div>
          <div class="col q-pt-md" align="left">
            <q-input
              type="textarea"
              color="grey-9"
              v-model="formData.leadVerificationStatus.reason"
              float-label="Enter reason for reject"
              placeholder="type.."
            />
          </div>
          <div class="col q-pt-md group" align="right">
            <q-btn
              outline
              label="Cancel"
              @click="emitModalToggle"
            />
            <q-btn
              class="common-btn"
              label="Submit"
              color="negative"
              @click="fnFinalRejectSubmit"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ---------------- PROPS & EMITS ---------------- */
const props = defineProps({
  propToggleRejectModal: { type: Boolean, required: true },
  propExceptionDetails: { type: Object, required: true }
})
const emit = defineEmits(['emitfnToRejectLeadException'])

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()
const { TOGGLE_COMMON_LOADER } = store.dispatch

/* ---------------- LOCAL STATE ---------------- */
const internalDialog = ref(props.propToggleRejectModal)
const formData = ref({
  leadInformation: { verifiedKycStatus: 5 },
  leadVerificationStatus: {
    fieldName: 'KYC',
    reason: '',
    leadInformation: { id: props.propExceptionDetails.id }
  }
})

/* ---------------- SYNC PROP CHANGES ---------------- */
watch(() => props.propToggleRejectModal, val => internalDialog.value = val)

/* ---------------- METHODS ---------------- */
const emitModalToggle = () => {
  emit('emitfnToRejectLeadException')
}

const fnFinalRejectSubmit = async () => {
  const confirm = await $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to reject exception?',
    cancel: true,
    persistent: true
  }).onOk(() => true).onCancel(() => false)

  if (!confirm) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'No changes made!',
      icon: 'thumb_down'
    })
    return
  }

  try {
    TOGGLE_COMMON_LOADER(true)
    await store.dispatch('OPSHead/FEED_EQ_KYC_FEEDBACK', formData.value)
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: `Rejected lead #${formData.value.leadVerificationStatus.leadInformation.id}`,
      icon: 'clear'
    })
    await store.dispatch('OPSHead/FETCH_ALL_EXCEPTION_KYC_DATA')
    emitModalToggle()
  } catch{

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Error in rejecting exception!',
      icon: 'thumb_down'
    })
  } finally {
    TOGGLE_COMMON_LOADER(false)
  }
}
</script>

<style scoped>
.group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.common-btn {
  color: white;
  background-color: #e53935;
}
</style>
