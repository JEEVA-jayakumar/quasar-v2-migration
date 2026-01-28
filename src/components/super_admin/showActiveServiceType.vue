<template>
  <div>
    <!-- MODAL -->
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw" class="q-pa-md">

        <!-- TITLE -->
        <div class="text-h6 q-mb-md">
          Modify Service Request Info
        </div>

        <!-- FORM -->
        <q-form @submit.prevent="submitForm">

          <!-- SERVICE REQ NAME -->
          <q-input
            v-model="formData.serviceReqType.name"
            label="Service Req Data"
            color="grey-9"
            class="q-mb-md"
            dense
          />

          <div class="row q-col-gutter-lg">

            <!-- ISSUE TYPES -->
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">
                Service Req Issue Type *
              </div>

              <q-checkbox
                v-for="menu in serviceReqIssueTypeSetsPro"
                :key="menu.id"
                v-model="selectedIssueTypes"
                :val="menu"
                :label="menu.serviceReqIssueType?.name"
                class="q-mb-xs"
              />
            </div>

            <!-- STATUS TYPES -->
            <div class="col-6">
              <div class="text-subtitle2 q-mb-sm">
                Service Status *
              </div>

              <q-checkbox
                v-for="menu in serviceRequestStatus"
                :key="menu.id"
                v-model="selectedStatuses"
                :val="menu"
                :label="menu.name"
                class="q-mb-xs"
              />
            </div>

          </div>

          <!-- ACTIONS -->
          <div class="row justify-end q-mt-lg">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8"
              @click="emitClose"
            />
            <q-btn
              color="purple-9"
              label="Save"
              type="submit"
              class="q-ml-sm"
            />
          </div>

        </q-form>
      </q-card>
    </q-dialog>

    <!-- SUB TASK DETAILS -->
    <showServiceSubTaskDetails
      v-if="propShowServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="propShowServiceSubTaskDetails"
      :propRowDetails="propRowDetails"
      @emitfnshowServiceSubTaskDetails="fnShowSubTaskDetails"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import showServiceSubTaskDetails from '../../components/super_admin/showServiceSubTaskDetails.vue'

/* PROPS */
const props = defineProps({
  propShowActiveServiceType: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnshowActiveSubTaskType'])

/* STORE */
const store = useStore()

/* STATE */
const toggleModel = ref(props.propShowActiveServiceType)
const propShowServiceSubTaskDetails = ref(false)

const serviceReqIssueTypeSetsPro = ref([])
const serviceRequestStatus = ref([])

const selectedIssueTypes = ref([])
const selectedStatuses = ref([])

const formData = ref({
  serviceReqType: {
    name: ''
  },
  serviceReqIssueTypeSets: [],
  serviceRequestStatusSets: []
})

/* WATCH PROP */
watch(
  () => props.propShowActiveServiceType,
  val => (toggleModel.value = val)
)

/* INIT */
onMounted(async () => {
  if (props.propRowDetails?.serviceReqType) {
    formData.value.serviceReqType.name =
      props.propRowDetails.serviceReqType.name
  }

  await loadIssueTypes()
  await loadStatusTypes()
})

/* METHODS */
const emitClose = () => {
  emit('emitfnshowActiveSubTaskType')
}

const submitForm = () => {
  formData.value.serviceReqIssueTypeSets = selectedIssueTypes.value
  formData.value.serviceRequestStatusSets = selectedStatuses.value.map(
    s => ({ serviceRequestStatus: s })
  )

  store.dispatch('serviceRequest/EDIT_SERVICE_REQUEST_TYPES', formData.value)
  emitClose()
}

const loadIssueTypes = async () => {
  await store.dispatch('serviceRequest/GET_SERVICE_ISSUE_TYPES')
  serviceReqIssueTypeSetsPro.value =
    store.getters['serviceRequest/getserviceRequestIssueTypes']
}

const loadStatusTypes = async () => {
  await store.dispatch('ServiceRequestStatus/FETCH_SERVICE_REQUEST_STATUS_DETAILS')
  serviceRequestStatus.value =
    store.getters['ServiceRequestStatus/getserviceRequestStatusDetails']
}

</script>

<style scoped>
.customModalOverlay {
  z-index: 6000;
}
</style>
