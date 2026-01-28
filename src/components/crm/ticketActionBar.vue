<template>
  <q-dialog v-model="opened" persistent :maximized="false">
    <q-card style="min-width: 50vw; padding: 10px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6"><b>Ticket</b></div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="closeModal" />
      </q-card-section>

      <!-- Ticket Info & Radio Options -->
      <q-card-section>
        <div class="q-pa-sm flex justify-between">
          <div><b>Ticket ID: {{ serviceReqTicketId }}</b></div>
          <div><b>Attempts: {{ callAttempts }}</b></div>
        </div>

        <q-option-group
          v-model="selectedOption"
          :options="optionsData"
          type="radio"
          inline
          color="purple-9"
          @input="onOptionChange"
        />

        <div class="q-mt-md flex justify-end gap-md">
          <q-btn icon="call_received" color="purple-9" label="Add Call Log" @click="toggleCallLogs" />
          <q-btn icon="phone" color="purple-9" label="View Call Logs" @click="toggleViewCallLogs" />
        </div>
      </q-card-section>

      <!-- Issue Resolved Section -->
      <q-card-section v-if="selectedOption === 1">
        <q-select
          v-model="issueResolved.resolvedStatus"
          :options="resolutionOptionList"
          label="Resolved Status"
          stack-label
          separator
          @input="fetchResolvedIssues"
        />
        <q-select
          v-model="issueResolved.actualIssue"
          :options="issueOptionList"
          label="Actual Issue"
          stack-label
          separator
        />
        <q-select
          v-model="issueResolved.actionTaken"
          :options="issueActionList"
          :disable="!issueResolved.actualIssue"
          label="Action Taken"
          stack-label
          separator
        />
        <div class="row justify-end q-mt-md gap-md">
          <q-btn color="purple-9" icon="save" label="Save" @click="saveIssueResolved" />
          <q-btn color="purple-9" icon="send" label="Submit" :disable="disableFlag" @click="submitIssueResolved" />
        </div>
      </q-card-section>

      <!-- Issue Not Resolved Section -->
      <q-card-section v-if="selectedOption === 2">
        <q-select
          v-model="IssueNotResolved.resolvedStatus"
          :options="resolutionOptionList"
          label="Resolved Status"
          stack-label
          separator
          @input="fetchNotResolvedIssues"
        />
        <q-select
          v-model="IssueNotResolved.actualIssue"
          :options="issueOptionList"
          label="Actual Issue"
          stack-label
          separator
        />
        <q-select
          v-model="IssueNotResolved.actionTaken"
          :options="issueActionList"
          :disable="!IssueNotResolved.actualIssue"
          label="Action Taken"
          stack-label
          separator
        />
        <div class="row justify-end q-mt-md gap-md">
          <q-btn color="purple-9" icon="save" label="Save" @click="saveIssueNotResolved" />
          <q-btn color="purple-9" icon="send" label="Submit" :disable="disableFlag" @click="submitIssueNotResolved" />
        </div>
      </q-card-section>

      <!-- Move to SAT Section -->
      <q-card-section v-if="selectedOption === 3">
        <div class="q-pa-sm flex justify-between">
          <div><b>Region: {{ region }}</b></div>
        </div>
        <div class="row justify-end q-mt-md gap-md">
          <q-btn color="purple-9" icon="save" label="Save" @click="saveMoveToSat" />
          <q-btn color="purple-9" icon="send" label="Move to SAT" :disable="disableFlag" @click="submitMoveToSat" />
        </div>
      </q-card-section>

      <!-- Child Components -->
      <phonepeCallLogs
        v-if="propToggleCallLogs"
        :callInfo="addActionBarInformation"
        :propToggleCallLogsPop="propToggleCallLogs"
        @closeCallLogs="toggleCallLogs"
      />
      <phonepeViewCallLogs
        v-if="propToggleViewCallLogs"
        :callInfo="addActionBarInformation"
        :propToggleViewCallLogsPop="propToggleViewCallLogs"
        @closeViewCallLogs="toggleViewCallLogs"
      />
      <issueResolvingRemarks
        v-if="propToggleResolveRemarks"
        :resolveRemarksInfo="addResolveRemarksInformation"
        :propToggleResolveRemarksPop="propToggleResolveRemarks"
        @closeResolveRemarks="submitIssueResolved"
      />
      <phonepeCrmToSatRemarks
        v-if="propToggleCrmToSatRemarks"
        :resolveCrmToSatInfo="addcrmToSatRemarksInformation"
        :propToggleCrmToSatRemarksPop="propToggleCrmToSatRemarks"
        @closeCrmToSatRemarks="submitMoveToSat"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Loading, Notify } from 'quasar'
import phonepeCallLogs from './phonepeCallLogs.vue'
import phonepeViewCallLogs from './phonepeViewCallLogs.vue'
import issueResolvingRemarks from './issueResolvingRemarks.vue'
import phonepeCrmToSatRemarks from './phonepeCrmToSatRemarks.vue'

// Props
const props = defineProps({
  ActionBarInfo: { type: Object, required: true },
  propToggleActionBarPop: { type: Boolean, required: true }
})
const emit = defineEmits(['closeActionBarInfo'])

// Store
const store = useStore()

// Reactive State
const opened = ref(props.propToggleActionBarPop)
const selectedOption = ref(1)
const disableFlag = ref(true)
const serviceReqTicketId = ref('')
const region = ref('')
const callAttempts = ref('')
const propToggleCallLogs = ref(false)
const propToggleViewCallLogs = ref(false)
const propToggleResolveRemarks = ref(false)
const propToggleCrmToSatRemarks = ref(false)

const addActionBarInformation = ref(props.ActionBarInfo.data)
const addResolveRemarksInformation = reactive({ data: null, ticketId: null })
const addcrmToSatRemarksInformation = reactive({ data: null })

// const options = [
//   { label: 'Issue Resolved', value: 1 },
//   { label: 'Issue Not Resolved', value: 2 },
//   { label: 'Move to SAT', value: 3 }
// ]
const optionsData = ref([])
const resolutionOptionList = ref([])
const issueOptionList = ref([])
const issueActionList = ref([])

const issueResolved = reactive({ resolvedStatus: '', actualIssue: '', actionTaken: '' })
const IssueNotResolved = reactive({ resolvedStatus: '', actualIssue: '', actionTaken: '' })

// Watch prop for opening modal
watch(() => props.propToggleActionBarPop, val => { opened.value = val })

// Lifecycle
onMounted(() => {
  serviceReqTicketId.value = props.ActionBarInfo.data.serviceReqTicketId
  region.value = props.ActionBarInfo.data.bpRegion.regionAreaName
  fetchCallAttempts(props.ActionBarInfo.data.subTicketsList[0].id)
  fetchOptionList()
  fetchResolutionList(selectedOption.value)
})

// ==================== Methods ====================
function closeModal() {
  emit('closeActionBarInfo')
}

function toggleCallLogs() {
  propToggleCallLogs.value = !propToggleCallLogs.value
  fetchCallAttempts(addActionBarInformation.value.subTicketsList[0].id)
}

function toggleViewCallLogs() {
  propToggleViewCallLogs.value = !propToggleViewCallLogs.value
}

function onOptionChange(option) {
  if (option !== 3) fetchResolutionList(option)
}

// Fetching API data
async function fetchCallAttempts(ticketId) {
  Loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data...' })
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_CALL_LOG_ATTEMPTS', ticketId)
    callAttempts.value = store.getters['phonePeCrm/getattemptLog']
    disableFlag.value = callAttempts.value <= 0
  } finally { Loading.hide() }
}

async function fetchOptionList() {
  Loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data...' })
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_OPTION_LIST_DETAILS')
    const optionsList = store.getters['phonePeCrm/getoptionsList'].map(opt => ({
      label: opt.issueOptions === 'ISSUE RESOLVED' ? 'Issue Resolved' : opt.issueOptions === 'ISSUE NOT RESOLVED' ? 'Issue Not Resolved' : opt.issueOptions,
      value: opt.id
    }))
    optionsList.push({ label: 'Move to SAT', value: 3 })
    optionsData.value = optionsList
  } finally { Loading.hide() }
}

async function fetchResolutionList(option) {
  Loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data...' })
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_RESOLUTION_STATUS', option)
    const cookedArr = store.getters['phonePeCrm/getResolutionStatus'].map(item => ({ label: item.resolution, value: item.id }))
    resolutionOptionList.value = option === 1 ? cookedArr.filter(r => r.value !== 2) : cookedArr
    // Default selection
    if (resolutionOptionList.value.length) issueResolved.resolvedStatus = resolutionOptionList.value[0].value
  } finally { Loading.hide() }
}

// Fetch issues and actions
async function fetchResolvedIssues(event) {
  Loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data...' })
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_FETCH_ISSUE_STATUS', event)
    const issues = store.getters['phonePeCrm/getFetchIssueList'].map(i => ({ label: i.issue, value: i.id }))
    issueOptionList.value = issues
    issueResolved.actualIssue = issues[0]?.value || ''
    await fetchIssueActions(event)
  } finally { Loading.hide() }
}

async function fetchNotResolvedIssues(event) {
  Loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data...' })
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_FETCH_ISSUE_STATUS', event)
    const issues = store.getters['phonePeCrm/getFetchIssueList'].map(i => ({ label: i.issue, value: i.id }))
    issueOptionList.value = issues
    IssueNotResolved.actualIssue = issues[0]?.value || ''
    await fetchNotResolvedActions(event)
  } finally { Loading.hide() }
}

async function fetchIssueActions(event) {
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_ISSUE_ACTION_STATUS', event)
    const actions = store.getters['phonePeCrm/getIssueAction'].map(a => ({ label: a.action, value: a.id }))
    issueActionList.value = actions
    issueResolved.actionTaken = actions[0]?.value || ''
  } catch { issueActionList.value = [] }
}

async function fetchNotResolvedActions(event) {
  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_ISSUE_ACTION_STATUS', event)
    const actions = store.getters['phonePeCrm/getIssueAction'].map(a => ({ label: a.action, value: a.id }))
    issueActionList.value = actions
    IssueNotResolved.actionTaken = actions[0]?.value || ''
  } catch { issueActionList.value = [] }
}

// Save / Submit Handlers
function saveIssueResolved() { emit('closeActionBarInfo') }
function submitIssueResolved() {
  propToggleResolveRemarks.value = !propToggleResolveRemarks.value
  addResolveRemarksInformation.data = { ...issueResolved }
  addResolveRemarksInformation.ticketId = props.ActionBarInfo.data
}

function saveIssueNotResolved() { emit('closeActionBarInfo') }
function submitIssueNotResolved() {
  const data = {
    issueOptionsId: 2,
    resolutionId: IssueNotResolved.resolvedStatus,
    servicingId: IssueNotResolved.actualIssue,
    actionsId: IssueNotResolved.actionTaken,
    ticketId: props.ActionBarInfo.data.serviceReqTicketId
  }
  Loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Data submitting...' })
  store.dispatch('phonePeCrm/ISSUE_NOT_RESOLVED_BY_CRM', data)
    .then(() => {
      emit('closeActionBarInfo')
      Notify.create({ color: 'positive', position: 'bottom', message: 'Successfully Updated', icon: 'thumb_up' })
    })
    .catch(err => {
      Notify.create({ color: 'negative', position: 'bottom', message: err?.body?.message || 'Please Try Again Later!', icon: 'thumb_down' })
    })
    .finally(() => Loading.hide())
}

function saveMoveToSat() { emit('closeActionBarInfo') }
function submitMoveToSat() {
  propToggleCrmToSatRemarks.value = !propToggleCrmToSatRemarks.value
  addcrmToSatRemarksInformation.data = props.ActionBarInfo.data
}
</script>
