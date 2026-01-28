<template>
  <q-dialog
    v-model="toggleModel"
    class="customModalOverlay"
    @hide="emitfnshowConvertToSat"
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
          @keyup.enter="submitShortLead(formData)"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="bg-white text-weight-regular text-grey-8"
          label="Cancel"
          @click="emitfnshowConvertToSat"
        />
        <q-btn
          color="purple-9"
          label="Submit"
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
  propShowViewReject: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnshowConvertToSat'])

/* ---------- quasar & store ---------- */
const $q = useQuasar()
const store = useStore()

/* ---------- state ---------- */
const toggleModel = ref(props.propShowViewReject)

const formData = ref({
  reason: '',
  data: props.propRowDetails?.id
})

/* ---------- sync dialog ---------- */
watch(
  () => props.propShowViewReject,
  (val) => {
    toggleModel.value = val
  }
)

/* ---------- methods ---------- */
const emitfnshowConvertToSat = () => {
  emit('emitfnshowConvertToSat')
}

const submitShortLead = (request) => {
  const requestParams = {
    data: {
      data: request.data
    },
    url: {
      reason: request.reason
    }
  }

  $q.loading.show()

  store.dispatch('DocumentApprove/DOCUMENT_REJECT', requestParams)
    .then(() => {
      $q.loading.hide()
      emitfnshowConvertToSat()

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

</script>
