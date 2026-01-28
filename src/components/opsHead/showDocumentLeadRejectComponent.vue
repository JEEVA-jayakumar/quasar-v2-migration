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
          :error="v$.formData.leadDetails.reason.$error"
          @blur="v$.formData.leadDetails.reason.$touch"
          :error-message="'Reason is required'"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          icon="clear"
          color="negative"
          label="Reject"
          @click="fnRejectLeadFinal"
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
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { Notify, Loading } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- PROPS & EMITS ---------------- */

const props = defineProps({
  propDocumentDetails: {
    type: Object,
    required: true
  },
  propToggleDocumentRejectModal: {
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

const internalDialog = ref(props.propToggleDocumentRejectModal)

watch(
  () => props.propToggleDocumentRejectModal,
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
    status: 0
  }
})

/* ---------------- VALIDATION ---------------- */

const rules = computed(() => ({
  formData: {
    leadDetails: {
      reason: { required }
    }
  }
}))

const v$ = useVuelidate(rules, { formData })

/* ---------------- METHODS ---------------- */

const emitToggleRemarks = () => {
  emit('toggleDocumentModal')
}

const fnRejectLeadFinal = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    Notify.create({
      type: 'warning',
      message: 'Please review fields again.'
    })
    return
  }

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
      type: 'negative',
      position: 'bottom',
      message: 'Document rejected',
      icon: 'clear'
    })

    await store.dispatch('OPSHead/FETCH_ALL_EXCEPTION_KYC_DATA')

    emit('toggleDocumentModalHotReload')
    emitToggleRemarks()
  } catch {

    Notify.create({
      type: 'negative',
      position: 'bottom',
      message: 'Error in rejecting document!',
      icon: 'thumb_down'
    })
  } finally {
    Loading.hide()
  }
}
</script>

<style scoped>
/* No visual changes needed */
</style>
