<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="min-width: 50vw; padding: 10px;">
      <!-- Title -->
      <q-card-section class="q-pb-md bottom-border">
        <div class="text-h6 text-weight-regular">Update QR Count</div>
      </q-card-section>

      <!-- Input -->
      <q-card-section class="q-pt-md">
        <q-input
          v-model.number="formData.recievedCount"
          type="number"
          outlined
          label="Update Count"
          placeholder="Update Count"
          :error="v$.formData.recievedCount.$invalid && v$.formData.recievedCount.$dirty"
          @input="formData.recievedCount = Math.abs(formData.recievedCount)"
        />
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right">
        <q-btn flat outline color="purple-9" label="Cancel" icon="block" @click="emitToggleCheque" />
        <q-btn
          color="purple-9"
          label="Update"
          :disable="!formData.recievedCount"
          @click="fnSubmitUpdateCount"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propseditCountModal: { type: Boolean, required: true },
  propsAllPendingQrItem: { type: Object, required: true }
})
const emit = defineEmits(['closeModel'])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- State ---------------- */
const toggleModal = ref(props.propseditCountModal)
const updateCount = ref(props.propsAllPendingQrItem)
const formData = ref({
  recievedCount: ''
})

/* ---------------- Watch Props ---------------- */
watch(() => props.propseditCountModal, val => toggleModal.value = val)
watch(() => props.propsAllPendingQrItem, val => updateCount.value = val)

/* ---------------- Vuelidate ---------------- */
const rules = {
  formData: {
    recievedCount: { required, minValue: minValue(1) }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Methods ---------------- */
function emitToggleCheque() {
  emit('closeModel')
}

async function fnSubmitUpdateCount() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    $q.notify({ message: 'Please review fields again.', color: 'negative' })
    return
  }

  const action =
    formData.value.recievedCount > updateCount.value.requestCount
      ? 1
      : formData.value.recievedCount < updateCount.value.requestCount
      ? 2
      : ''

  const updatecount = {
    id: updateCount.value.id,
    action,
    request: {
      podNumber: updateCount.value.podNumber,
      requestCount: updateCount.value.requestCount,
      receivedCount:
        action === 1
          ? formData.value.recievedCount - updateCount.value.requestCount
          : action === 2
          ? updateCount.value.requestCount - formData.value.recievedCount
          : '',
      region: { id: updateCount.value.region.id },
      staticQrBank: { id: updateCount.value.qrBank.id }
    }
  }

  $q.loading.show()
  try {
    await store.dispatch('generateQR/UPDATE_QR_COUNT', updatecount)
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Updated!',
      icon: 'thumb_up'
    })
    emit('closeModel')
    formData.value.recievedCount = ''
  } catch {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'No changes made!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
