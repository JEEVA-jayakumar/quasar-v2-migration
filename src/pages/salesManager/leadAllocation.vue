<template>
  <q-page>
    <div>
      <!--START: table title -->
      <div
        class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Lead Allocation</div>
      <!--END: table title -->
      <div class="q-px-lg text-weight-regular text-grey-8">
        <div class="row">
          <div class="group col-md-6 col-sm-12 col-xs-12">
            <div class="row group">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.formData.leadName.$touch"
                  :error="v$.formData.leadName.$error"
                  color="grey-9"
                  v-model="formData.leadName"
                  label="Merchant Name*"
                  placeholder="Merchant Name"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.formData.contactName.$touch"
                  :error="v$.formData.contactName.$error"
                  v-model="formData.contactName"
                  label="Contact Name*"
                  placeholder="Contact Name"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="formData.email"
                  label="Email"
                  placeholder="Email"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.formData.contactNumber.$touch"
                  :error="v$.formData.contactNumber.$error"
                  v-model="formData.contactNumber"
                  type="number"
                  label="Contact Number*"
                  placeholder="Contact Number"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.formData.alternateContactNumber.$touch"
                  :error="v$.formData.alternateContactNumber.$error"
                  v-model="formData.alternateContactNumber"
                  type="number"
                  label="Alternate Contact Number"
                  placeholder="Alternate Contact Number"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.formData.leadAddress.$touch"
                  :error="v$.formData.leadAddress.$error"
                  v-model="formData.leadAddress"
                  label="Merchant Address"
                  placeholder="Merchant Address"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Select Pincode"
                  clearable
                  color="grey-9"
                  @blur="v$.formData.pincodeObj.$touch"
                  :error="v$.formData.pincodeObj.$error"
                  v-model="formData.pincodeObj"
                  @update:model-value="fnPopulateStateCity"
                  @clear="fnClearStateCity"
                  label="Pincode"
                  :options="getAllStatesData"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  disable
                  color="grey-9"
                  @blur="v$.formData.city.$touch"
                  :error="v$.formData.city.$error"
                  v-model="formData.city"
                  label="City/Town"
                  placeholder="Merchant Address"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  disable
                  color="grey-9"
                  @blur="v$.formData.state.$touch"
                  :error="v$.formData.state.$error"
                  v-model="formData.state"
                  label="State"
                  placeholder="State"
                />
              </div>
            </div>
          </div>
          <div class="group col-md-6 col-sm-12 col-xs-12">
            <div class="row group">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-select
                  @update:model-value="fnAjaxRequestPopulateDeviceListData"
                  color="grey-9"
                  @blur="v$.formData.leadSource.id.$touch"
                  :error="v$.formData.leadSource.id.$error"
                  v-model="formData.leadSource.id"
                  label="Lead Source*"
                  placeholder="Lead Source"
                  :options="leadSourceOptions"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-select
                  color="grey-9"
                  @blur="v$.formData.device.id.$touch"
                  :error="v$.formData.device.id.$error"
                  v-model="formData.device.id"
                  label="Device Type"
                  :disable="isDeviceTypeSelectionDisabled"
                  :options="deviceTypeOptions"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-input
                  type="number"
                  color="grey-9"
                  @blur="v$.formData.deviceCount.$touch"
                  :error="v$.formData.deviceCount.$error"
                  v-model="formData.deviceCount"
                  label="Device Count*"
                  placeholder="Device Count"
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12" v-show="enableRSMdropdown">
                <q-select
                  @update:model-value="fnGetAllUsersByHidUidRSM"
                  color="grey-9"
                  v-model="currentAssingedToRSM"
                  placeholder="--RSM--"
                  label="Select RSM"
                  :disable="assignToOptionsRSM.length > 0 ? false:true"
                  :options="assignToOptionsRSM"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12" v-show="enableASMdropdown">
                <q-select
                  @update:model-value="fnGetAllUsersByHidUidASM"
                  color="grey-9"
                  v-model="currentAssingedToASM"
                  placeholder="--ASM--"
                  label="Select ASM"
                  :disable="assignToOptionsASM.length > 0 ? false:true"
                  :options="assignToOptionsASM"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-select
                  @update:model-value="fnGetAllUsersByHidUidTL"
                  color="grey-9"
                  v-model="assignTo"
                  placeholder="--TL--"
                  label="Select TL"
                  :disable="assignToOptionsTL.length > 0 ? false:true"
                  :options="assignToOptionsTL"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-select
                  clearable
                  color="grey-9"
                  @blur="v$.formData.assignedTo.id.$touch"
                  :error="v$.formData.assignedTo.id.$error"
                  v-model="formData.assignedTo.id"
                  placeholder="--SO--"
                  label="Select SO"
                  :disable="assignToOptionsSO.length > 0 ? false:true"
                  :options="assignToOptionsSO"
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-4 col-xs-12">
            <q-btn color="dark" @click="fnFinalSubmit(formData)" label="Assign"/>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, maxValue, minValue } from '@vuelidate/validators'
import _ from 'lodash'

// Vuex and Router setup
const store = useStore()
const router = useRouter()
const $q = useQuasar()

// Refs for reactive data
const enableRSMdropdown = ref(false)
const enableASMdropdown = ref(false)
const isDeviceTypeSelectionDisabled = ref(true)
const assignTo = ref('')
const assignToOptionsRSM = ref([])
const currentAssingedToRSM = ref(null)
const assignToOptionsASM = ref([])
const currentAssingedToASM = ref(null)
const assignToOptionsTL = ref([])
const assignToOptionsSO = ref([])
const leadSourceOptions = ref([])
const deviceTypeOptions = ref([])

// Form data structure
const formData = reactive({
  leadName: '',
  contactName: '',
  contactNumber: '',
  email: '',
  alternateContactNumber: '',
  leadAddress: '',
  latitude: 13.458,
  longitude: 89.236,
  city: '',
  deviceCount: '',
  state: '',
  device: {
    id: null
  },
  leadSource: {
    id: null
  },
  tempAssignedTo: '1',
  assignedTo: {
    id: null
  },
  pincodeObj: null,
  pincode: null
})

// Validation rules
const rules = {
  formData: {
    leadName: { required },
    leadAddress: { required },
    contactName: { required },
    contactNumber: { 
      required, 
      minLength: minLength(10), 
      maxLength: maxLength(10) 
    },
    alternateContactNumber: {
      minLength: minLength(10),
      maxLength: maxLength(10)
    },
    latitude: { required },
    longitude: { required },
    city: { required },
    deviceCount: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(100)
    },
    state: { required },
    device: {
      id: { required }
    },
    leadSource: {
      id: { required }
    },
    assignedTo: {
      id: { required }
    },
    pincodeObj: { required }
  }
}

// Setup vuelidate
const v$ = useVuelidate(rules, { formData })

// Computed properties from Vuex store
const getAllStatesData = computed(() => store.getters['SuperAdminUsers/getAllStatesData'])
const getDevicesBasedOnLeadSource = computed(() => store.getters['DeviceListBasedOnLeadSource/getDevicesBasedOnLeadSource'])
const getAllUserByIdAndHierarchyIdData = computed(() => store.getters['SalesManager_LeadAllocation/getAllUserByIdAndHierarchyIdData'])
const getSelectOptionsLeadSourceInfo = computed(() => store.getters['BankOpsShortLead/getSelectOptionsLeadSourceInfo'])

// Store actions
const FETCH_ALL_STATES_DATA = () => store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA')
const FETCH_ALL_LEAD_SOURCE_DATA = () => store.dispatch('BankOpsShortLead/FETCH_ALL_LEAD_SOURCE_DATA')
const DEVICE_LIST_BASED_ON_LEAD_SOURCE = (id) => store.dispatch('DeviceListBasedOnLeadSource/DEVICE_LIST_BASED_ON_LEAD_SOURCE', id)
const FETCH_USERS_BY_USER_ID = (data) => store.dispatch('SalesManager_LeadAllocation/FETCH_USERS_BY_USER_ID', data)
const UPDATE_SHORT_LEAD_SALES_INFO = (data) => store.dispatch('SalesManager_LeadAllocation/UPDATE_SHORT_LEAD_SALES_INFO', data)

// Role identification function
const identifySalesHierarchyRole = () => {
  const userInfo = JSON.parse(localStorage.getItem('u_i'))
  const salesHierarchyCode = import.meta.env.VITE_HIERARCHY_SALES || 'SALES'
  return _.find(userInfo.roles, (role) => 
    role.hierarchy.hierarchyCode.includes(salesHierarchyCode)
  )
}

// Initialize component
onMounted(() => {
  fnAjaxRequestPopulateTrackerData()
})

// Main initialization function
const fnAjaxRequestPopulateTrackerData = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data..'
  })

  try {
    await FETCH_ALL_STATES_DATA()
    
    const roleInfo = identifySalesHierarchyRole()
    const userData = JSON.parse(localStorage.getItem('u_i'))
    
    await FETCH_USERS_BY_USER_ID({
      hierarchy: { id: roleInfo.hierarchy.id },
      user: { id: userData.user.id }
    })

    if (getAllUserByIdAndHierarchyIdData.value.length === 0) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      const assumeArr = getAllUserByIdAndHierarchyIdData.value.map(value => ({
        label: value.user.name,
        value: value
      }))

      const hierarchyRoleLevel = roleInfo.hierarchyRoleLevel
      const salesNationalHead = import.meta.env.VITE_ROLE_HIERARCHY_SALES_NATIONAL_HEAD || 'NATIONAL_HEAD'
      const salesRSM = import.meta.env.VITE_ROLE_HIERARCHY_SALES_RSM || 'RSM'
      const salesASM = import.meta.env.VITE_ROLE_HIERARCHY_SALES_ASM || 'ASM'

      if (hierarchyRoleLevel === salesNationalHead) {
        enableRSMdropdown.value = true
        enableASMdropdown.value = true
        assignToOptionsRSM.value = assumeArr
      } else if (hierarchyRoleLevel === salesRSM) {
        enableRSMdropdown.value = false
        enableASMdropdown.value = true
        assignToOptionsASM.value = assumeArr
      } else if (hierarchyRoleLevel === salesASM) {
        enableRSMdropdown.value = false
        enableASMdropdown.value = false
        assignToOptionsTL.value = assumeArr
      }
    }

    await FETCH_ALL_LEAD_SOURCE_DATA()
    leadSourceOptions.value = getSelectOptionsLeadSourceInfo.value.map(value => ({
      label: value.sourceName,
      value: value.id
    }))

    $q.loading.hide()
  } catch (error) {

    $q.loading.hide()
    
    if (error.status === (import.meta.env.VITE_API_SUCCESS || 200)) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      })
    }
  }
}

// Populate device list based on lead source
const fnAjaxRequestPopulateDeviceListData = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data..'
  })

  try {
    await DEVICE_LIST_BASED_ON_LEAD_SOURCE(formData.leadSource.id)
    
    deviceTypeOptions.value = getDevicesBasedOnLeadSource.value.device.map(value => ({
      label: value.deviceName,
      value: value.id
    }))
    
    isDeviceTypeSelectionDisabled.value = false
    $q.loading.hide()
  } catch (error) {

    if (error.status === (import.meta.env.VITE_API_SUCCESS || 200)) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No device type available',
        icon: 'info'
      })
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      })
    }
    $q.loading.hide()
  }
}

// Populate state and city based on pincode
const fnPopulateStateCity = (value) => {
  if (value) {
    formData.pincode = value.pincode
    formData.state = value.stateName
    formData.city = value.cityName
  }
}

// Clear city and state when pincode is cleared
const fnClearStateCity = () => {
  formData.state = ''
  formData.city = ''
}

// Submit form
const fnFinalSubmit = async (formData) => {
  v$.value.$touch()
  
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Submitting data..'
  })

  try {
    await UPDATE_SHORT_LEAD_SALES_INFO(formData)
    $q.loading.hide()
    router.push('/sales/manager/lead/allocation/tracker')
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully lead has been created and allocated!',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  }
}

// Hierarchy population functions
const fnGetAllUsersByHidUidRSM = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data..'
  })

  try {
    assignToOptionsASM.value = []
    assignToOptionsTL.value = []
    assignToOptionsSO.value = []
    
    await FETCH_USERS_BY_USER_ID(request)

    if (getAllUserByIdAndHierarchyIdData.value.length === 0) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      assignToOptionsASM.value = getAllUserByIdAndHierarchyIdData.value.map(value => ({
        label: value.user.name,
        value: value
      }))
    }
    
    $q.loading.hide()
  } catch (error) {

    if (error.status === (import.meta.env.VITE_API_SUCCESS || 200)) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      })
    }
    $q.loading.hide()
  }
}

const fnGetAllUsersByHidUidASM = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data..'
  })

  try {
    assignToOptionsTL.value = []
    assignToOptionsSO.value = []
    
    await FETCH_USERS_BY_USER_ID(request)

    if (getAllUserByIdAndHierarchyIdData.value.length === 0) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      assignToOptionsTL.value = getAllUserByIdAndHierarchyIdData.value.map(value => ({
        label: value.user.name,
        value: value
      }))
    }
    
    $q.loading.hide()
  } catch (error) {

    if (error.status === (import.meta.env.VITE_API_SUCCESS || 200)) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      })
    }
    $q.loading.hide()
  }
}

const fnGetAllUsersByHidUidTL = async (request) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data..'
  })

  try {
    assignToOptionsSO.value = []
    
    await FETCH_USERS_BY_USER_ID(request)

    if (getAllUserByIdAndHierarchyIdData.value.length === 0) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      assignToOptionsSO.value = getAllUserByIdAndHierarchyIdData.value.map(value => ({
        label: value.user.name,
        value: value.user.id
      }))
    }
    
    $q.loading.hide()
  } catch (error) {

    if (error.status === (import.meta.env.VITE_API_SUCCESS || 200)) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: 'No user available',
        icon: 'info'
      })
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      })
    }
    $q.loading.hide()
  }
}
</script>

<style>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>