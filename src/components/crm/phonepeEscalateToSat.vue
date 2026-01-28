<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="min-width: 48vw; padding: 20px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">Escalate To SAT</div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="emitToggleEscalateToSat" />
      </q-card-section>

      <q-card-section>

        <!-- Issue / Sub-Issue -->
        <div class="row q-gutter-md">

          <div class="col-sm-5 col-xs-12">
            <q-select
              v-model="formData.issue"
              label="Issues"
              filled
              :options="dropDown.issueOptions"
              @update:model-value="issueDocumentType"
              emit-value
              map-options
            />
          </div>

          <div class="col-sm-5 col-xs-12">
            <q-select
              v-model="formData.subIssue"
              label="Sub Issues"
              filled
              :options="dropDown.subIssueOptions"
              :disable="!formData.issue"
              emit-value
              map-options
            />
          </div>

        </div>

        <!-- Submit Button -->
        <div class="row justify-end q-mt-md">
          <q-btn
            color="purple"
            label="Submit"
            :disable="!formData.subIssue"
            @click="fnEscalateToSat(escalateToSatData)"
          />
        </div>

      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import _ from 'lodash'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  escalateToSatData: { type: Object, required: true },
  propToggleEscalatetoSatPop: { type: Boolean, required: true }
})
const emit = defineEmits(['closeEscalateToSat'])

/* ============================
   Quasar & Vuex
============================ */
const $q = useQuasar()
const store = useStore()

/* ============================
   Reactive State
============================ */
const toggleModal = ref(props.propToggleEscalatetoSatPop)
const formData = reactive({
  issue: '',
  subIssue: ''
})

const dropDown = reactive({
  issueOptions: [],
  subIssueOptions: []
})

/* ============================
   Watchers
============================ */
watch(() => props.propToggleEscalatetoSatPop, (val) => {
  toggleModal.value = val
})

/* ============================
   Load Issues on Mount
============================ */
onMounted(async () => {
  await issueLoadData()
})

async function issueLoadData() {
  await store.dispatch('crmAction/FETCH_ISSUE_DATAS')
  dropDown.issueOptions = _.map(store.getters['crmAction/getissueDatasDetails'], item => ({
    value: item,
    label: item.name
  }))
  // Optionally pre-select the first issue
  formData.issue = dropDown.issueOptions.length > 0 ? dropDown.issueOptions[0].value : ''
}

/* ============================
   Sub-Issue Load on Issue Change
============================ */
async function issueDocumentType(selectedValue) {
  if (!selectedValue) return

  await store.dispatch('crmAction/FETCH_SUB_ISSUE_DATAS', selectedValue.id)
  dropDown.subIssueOptions = _.map(store.getters['crmAction/getsubIssueDatasDetails'], item => ({
    value: item,
    label: item.name
  }))
  formData.subIssue = '' // reset sub-issue
}

/* ============================
   Escalate To SAT
============================ */
async function fnEscalateToSat(request) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinnerColor: 'purple-9',
      message: 'Processing...'
    })

    try {
      const payload = {
        ticketId: request.serviceReqTicketId,
        issue: formData.issue,
        subIssue: formData.subIssue
      }
      await store.dispatch('phonePeCrm/ESCALATE_TO_SAT', payload)
      $q.notify({
        color: 'positive',
        message: 'Escalated To SAT!',
        icon: 'thumb_up'
      })
      emitToggleEscalateToSat()
    } catch {
      $q.notify({
        color: 'negative',
        message: 'Error escalating! Please try again.',
        icon: 'thumb_down'
      })
    } finally {
      $q.loading.hide()
    }
  }).onCancel(() => {
    $q.notify({
      color: 'negative',
      message: 'No changes made!',
      icon: 'thumb_down'
    })
  })
}

/* ============================
   Close Modal
============================ */
function emitToggleEscalateToSat() {
  emit('closeEscalateToSat')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-gutter-md {
  gap: 16px;
}
</style>
