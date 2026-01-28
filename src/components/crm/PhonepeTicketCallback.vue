<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="min-width: 48vw; padding: 20px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">PPE</div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="emitToggleResolve" />
      </q-card-section>

      <!-- Dropdowns -->
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Issue -->
          <div class="col-sm-5">
            <q-select
              v-model="formData.issue"
              :options="dropDown.issueOptions"
              stack-label="Issues"
              color="light"
              @input="issueDocumentType"
              use-chips
              emit-value
              map-options
            />
          </div>

          <!-- Sub Issue -->
          <div class="col-sm-5" style="margin-left: 20px;">
            <q-select
              v-model="formData.subIssue"
              :options="dropDown.subIssueOptions"
              stack-label="Sub Issues"
              color="light"
              :disable="!formData.issue"
              use-chips
              emit-value
              map-options
            />
          </div>
        </div>

        <!-- Remarks -->
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-sm-5">
            <q-select
              v-model="formData.remarks"
              :options="dropDown.remarksOptions"
              stack-label="Default Remarks"
              color="light"
              :disable="!formData.subIssue"
              use-chips
              emit-value
              map-options
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row justify-end q-mt-lg">
          <q-btn
            color="purple"
            label="Submit"
            :disable="!formData.remarks || !formData.subIssue"
            @click="fnPPE(resolveDataCallback)"
          />
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
// import _ from 'lodash'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  resolveDataCallback: { type: Object, required: true },
  propToggleResolveCallback: { type: Boolean, required: true }
})

const emit = defineEmits(['closeResolveCallback'])

/* ============================
   Quasar & Vuex
============================ */
const $q = useQuasar()
const store = useStore()

/* ============================
   Reactive State
============================ */
const toggleModal = ref(props.propToggleResolveCallback)

const formData = reactive({
  issue: '',
  subIssue: '',
  remarks: ''
})

const dropDown = reactive({
  issueOptions: [],
  subIssueOptions: [],
  remarksOptions: []
})

/* ============================
   Watchers
============================ */
watch(() => props.propToggleResolveCallback, val => toggleModal.value = val)

/* ============================
   Lifecycle
============================ */
onMounted(() => {
  loadIssueOptions()
  loadRemarksOptions()
})

/* ============================
   Vuex Actions
============================ */
const { FETCH_ISSUE_DATAS, FETCH_SUB_ISSUE_DATAS, FETCH_REMARKS_ISSUE_DATAS } = store._modulesNamespaceMap['crmAction/'].context.actions
const { PPE_CALLBACK_RESOLVED } = store._modulesNamespaceMap['phonePeCrm/'].context.actions

/* ============================
   Methods
============================ */
const loadIssueOptions = async () => {
  await FETCH_ISSUE_DATAS()
  dropDown.issueOptions = store.getters['crmAction/getissueDatasDetails'].map(item => ({ value: item, label: item.name }))
}

const issueDocumentType = async (selectedValue) => {
  if (!selectedValue) return
  await FETCH_SUB_ISSUE_DATAS(selectedValue.id)
  dropDown.subIssueOptions = store.getters['crmAction/getsubIssueDatasDetails'].map(item => ({ value: item, label: item.name }))
  formData.subIssue = '' // reset subIssue when issue changes
}

const loadRemarksOptions = async () => {
  await FETCH_REMARKS_ISSUE_DATAS()
  dropDown.remarksOptions = store.getters['crmAction/getremarksDatasDetails'].map(item => ({ value: item, label: item.name }))
}

const fnPPE = async (request) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure?',
    cancel: true,
    ok: true
  }).onOk(async () => {
    $q.loading.show({ spinnerColor: 'purple-9', message: 'Processing...' })

    const payload = {
      ticketId: request.serviceReqTicketId,
      issue: formData.issue,
      subIssue: formData.subIssue,
      resolutionRemarksPPE: formData.remarks.name
    }

    try {
      await PPE_CALLBACK_RESOLVED(payload)
      $q.notify({ color: 'positive', message: 'Successfully Resolved!', icon: 'thumb_up' })
      emitToggleResolve()
    } catch (err) {
      $q.notify({ color: 'negative', message: err?.body?.message || 'Error Occurred!', icon: 'thumb_down' })
    } finally {
      $q.loading.hide()
    }
  })
}

const emitToggleResolve = () => {
  emit('closeResolveCallback')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
