<template>
  <q-dialog
    v-model="dialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 50vw" class="q-pa-md">

      <!-- TITLE -->
      <div class="text-h6 text-weight-regular q-mb-md">
        Add Service Types
      </div>

      <q-form @submit.prevent="submitForm">

        <!-- SERVICE TYPE NAME -->
        <q-input
          v-model="formData.serviceReqType.name"
          label="Enter Service Type Name"
          outlined
          dense
          class="q-mb-md"
          :error="v$.formData.serviceReqType.name.$error"
          error-message="Service Type Name is required"
          @blur="v$.formData.serviceReqType.name.$touch"
        />

        <!-- ISSUE TYPES -->
        <div class="row q-mb-md">
          <div class="col">
            <p class="text-weight-medium">Service Req Issue Type *</p>
            <q-checkbox
              v-for="item in serviceReqIssueTypeSetsPro"
              :key="item.id"
              v-model="selectedIssueTypes"
              :val="item"
              :label="item.name"
              class="q-mb-sm"
            />
          </div>

          <!-- STATUS TYPES -->
          <div class="col">
            <p class="text-weight-medium">Service Status *</p>
            <q-checkbox
              v-for="item in serviceRequestStatus"
              :key="item.id"
              v-model="selectedStatusTypes"
              :val="item"
              :label="item.name"
              class="q-mb-sm"
            />
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            label="Cancel"
            color="grey-8"
            @click="closeDialog"
          />
          <q-btn
            label="Save"
            color="purple-9"
            type="submit"
          />
        </div>

      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ===================== PROPS & EMITS ===================== */
const props = defineProps({
  propShowAddServiceType: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnShowAddNewServiceType'])

/* ===================== CORE ===================== */
const $q = useQuasar()
const store = useStore()

/* ===================== DIALOG ===================== */
const dialog = ref(props.propShowAddServiceType)

watch(
  () => props.propShowAddServiceType,
  val => (dialog.value = val)
)

/* ===================== STATE ===================== */
const serviceReqIssueTypeSetsPro = ref([])
const serviceRequestStatus = ref([])

const selectedIssueTypes = ref([])
const selectedStatusTypes = ref([])

/* ===================== FORM DATA ===================== */
const formData = ref({
  serviceReqType: {
    name: ''
  },
  serviceReqIssueTypeSets: [],
  serviceRequestStatusSets: []
})

/* ===================== VALIDATION ===================== */
const rules = {
  formData: {
    serviceReqType: {
      name: { required }
    }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ===================== METHODS ===================== */
const closeDialog = () => {
  emit('emitfnShowAddNewServiceType')
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

const submitForm = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
    return
  }

  formData.value.serviceReqIssueTypeSets =
    selectedIssueTypes.value.map(i => ({ serviceReqIssueType: i }))

  formData.value.serviceRequestStatusSets =
    selectedStatusTypes.value.map(i => ({ serviceRequestStatus: i }))

  try {
    $q.loading.show({
      message: 'Please Wait',
      spinnerColor: 'purple-9'
    })

    await store.dispatch(
      'serviceRequest/UPDATE_SERVICE_REQUEST_TYPES',
      formData.value
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Added Successfully',
      icon: 'thumb_up'
    })

    emit('emitfnShowAddNewServiceType', 'refresh')
  } catch (error) {

    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: error?.data?.message || 'Something went wrong'
    })
  } finally {
    $q.loading.hide()
  }
}

/* ===================== LIFECYCLE ===================== */
onMounted(() => {
  loadIssueTypes()
  loadStatusTypes()
})
</script>
