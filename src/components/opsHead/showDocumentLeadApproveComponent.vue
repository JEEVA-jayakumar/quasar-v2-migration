<template>
  <q-dialog
    v-model="internalDialog"
    persistent
    @hide="emitToggleRemarks"
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ propDocumentDetails.documentType }}
        </div>

        <q-input
          v-model="formData.leadDetails.reason"
          label="Reason"
          placeholder="Type.."
          color="grey-9"
          outlined
          dense
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          icon="done"
          color="positive"
          label="Approve"
          @click="fnApproveLeadFinal"
        />

        <q-btn
          icon="block"
          color="grey-5"
          text-color="dark"
          label="Cancel"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Notify, Loading } from 'quasar'

/* ---------------- PROPS & EMITS ---------------- */

const props = defineProps({
  propDocumentDetails: {
    type: Object,
    required: true
  },
  propToggleDocumentApproveModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'toggleDocumentModal',
  'toggleDocumentModalHotReload'
])

/* ---------------- STORE ---------------- */

const store = useStore()

/* ---------------- LOCAL STATE ---------------- */

const internalDialog = ref(props.propToggleDocumentApproveModal)

watch(
  () => props.propToggleDocumentApproveModal,
  val => {
    internalDialog.value = val
  }
)

const formData = ref({
  lead: {
    id: props.propDocumentDetails.leadId,
    documentId: props.propDocumentDetails.id
  },
  leadDetails: {
    fieldName: 'Document',
    reason: '',
    status: 1
  }
})

/* ---------------- METHODS ---------------- */

const emitToggleRemarks = () => {
  emit('toggleDocumentModal')
}

const fnApproveLeadFinal = async () => {
  try {
    Loading.show({
      message: 'Processing ..',
      spinnerColor: 'purple-9'
    })

    await store.dispatch(
      'OPSHead/VERIFY_DOCUMENT_FULL_LEAD',
      formData.value
    )

    Notify.create({
      type: 'positive',
      position: 'bottom',
      message: 'Successfully approved',
      icon: 'thumb_up'
    })

    emit('toggleDocumentModalHotReload')
    emitToggleRemarks()
  } catch {

    Notify.create({
      type: 'negative',
      position: 'bottom',
      message: 'Error in approving document!',
      icon: 'thumb_down'
    })
  } finally {
    Loading.hide()
  }
}
</script>

<style scoped>
/* no changes needed */
</style>
