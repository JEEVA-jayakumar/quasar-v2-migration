<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitToggleRemarks"
  >
    <q-card style="min-width: 30vw; padding: 10px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">Closing Remarks</div>
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
              :error="v$.formData.crmRemark.$error"
              @blur="v$.formData.crmRemark.$touch"
            />
          </div>
        </div>
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right">
        <q-btn
          color="purple-9"
          icon="check"
          label="Confirm"
          @click="fnSubmit"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
/* ============================
   Imports
============================ */
import { ref, reactive, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  resolveRemarksInfo: {
    type: Object,
    required: true
  },
  propToggleResolveRemarksPop: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['closeResolveRemarks'])

/* ============================
   State
============================ */
const $q = useQuasar()
const store = useStore()

const toggleModal = ref(props.propToggleResolveRemarksPop)
const closingtoggleValue = ref(null)

const formData = reactive({
  crmRemark: '',
  issueOptionsId: 1,
  resolutionId: props.resolveRemarksInfo.data.resolvedStatus,
  servicingId: props.resolveRemarksInfo.data.actualIssue,
  actionsId: props.resolveRemarksInfo.data.actionTaken,
  issue: null,
  subIssue: null,
  resolutionRemarks: null,
  ticketId: props.resolveRemarksInfo.ticketId.serviceReqTicketId
})

/* ============================
   Watchers
============================ */
watch(
  () => props.propToggleResolveRemarksPop,
  val => {
    toggleModal.value = val
  }
)

/* ============================
   Validation
============================ */
const rules = {
  formData: {
    crmRemark: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ============================
   Lifecycle
============================ */
onBeforeMount(() => {
  console.log('DATA PP CHECK', JSON.stringify(props.resolveRemarksInfo))
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
    await store.dispatch('phonePeCrm/ISSUE_RESOLVED_BY_CRM', formData)

    closingtoggleValue.value = 1
    emitToggleRemarks()

    $q.notify({
      type: 'positive',
      message: 'Remarks updated successfully',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.notify({
      type: 'negative',
      message: error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

const emitToggleRemarks = () => {
  if (closingtoggleValue.value === 1) {
    emit('closeResolveRemarks', 1)
  } else {
    emit('closeResolveRemarks', 2)
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
