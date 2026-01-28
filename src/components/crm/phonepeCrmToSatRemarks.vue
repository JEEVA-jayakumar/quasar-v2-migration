<template>
  <q-dialog
    v-model="toggleModal"
    persistent
  >
    <q-card style="min-width: 30vw; padding: 10px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">CRM to SAT Remarks</div>
        <q-space />
        <q-btn
          round
          dense
          flat
          icon="close"
          color="dark"
          @click="emitToggleRemarks"
        />
      </q-card-section>

      <!-- Body -->
      <q-card-section>
        <div class="row justify-center">
          <div class="col-sm-8 col-xs-12">
            <q-input
              filled
              v-model="formData.crmRemark"
              label="Enter your text"
              type="textarea"
              rows="5"
              maxlength="500"
              counter
              class="textarea-box"
            />
          </div>
        </div>

        <div class="row items-center bottom-border q-py-sm"></div>

        <!-- Confirm Button -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            color="purple-9"
            icon="check"
            label="Confirm"
            @click="fnSubmit"
          />
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  resolveCrmToSatInfo: { type: Object, required: true },
  propToggleCrmToSatRemarksPop: { type: Boolean, required: true }
})

const emit = defineEmits(['closeCrmToSatRemarks'])

/* ============================
   Quasar & Vuex
============================ */
const $q = useQuasar()
const store = useStore()

/* ============================
   Reactive State
============================ */
const toggleModal = ref(props.propToggleCrmToSatRemarksPop)
const crmToSatClosingToggle = ref(null)

const formData = reactive({
  crmRemark: '',
  issueOptionsId: 3,
  resolutionId: null,
  servicingId: null,
  actionsId: null,
  issue: null,
  subIssue: null,
  resolutionRemarks: null,
  ticketId: props.resolveCrmToSatInfo.data.serviceReqTicketId
})

/* ============================
   Vuelidate
============================ */
const rules = {
  crmRemark: { required }
}
const v$ = useVuelidate(rules, formData)

/* ============================
   Watchers
============================ */
watch(() => props.propToggleCrmToSatRemarksPop, (val) => {
  toggleModal.value = val
})

/* ============================
   Methods
============================ */
const fnSubmit = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({
      type: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Data submitting..'
  })

  try {
    await store.dispatch('phonePeCrm/MOVE_TO_SAT', formData)
    crmToSatClosingToggle.value = 1

    $q.notify({
      type: 'positive',
      message: 'Remarks updated successfully',
      icon: 'thumb_up'
    })

    emitToggleRemarks()
  } catch (error) {

    $q.notify({
      type: 'negative',
      message: error?.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

const emitToggleRemarks = () => {
  if (crmToSatClosingToggle.value === 1) {
    emit('closeCrmToSatRemarks', crmToSatClosingToggle.value)
  } else {
    crmToSatClosingToggle.value = 2
    emit('closeCrmToSatRemarks', crmToSatClosingToggle.value)
  }
}
</script>

<style scoped>
.textarea-box {
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  padding: 8px;
  background-color: #f9f9f9;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
