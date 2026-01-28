<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 q-pa-md text-weight-regular bottom-border">
        <div class="text-h5">Add Rental Charge</div>
      </div>
      
      <!-- START >> Setup Rental details -->
      <div class="col-md-5 col-sm-6 col-xs-12 q-pa-sm">
        <q-card class="q-pa-md">
          <q-card-section>
            <!-- Lead Source Selection -->
            <div class="q-pb-md">
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select lead source"
                    placeholder="Lead source"
                    outlined
                    dense
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    size="md"
                    @click="fnManageLeadSource"
                    color="purple-9"
                    icon="add"
                    class="q-ml-sm"
                  />
                </q-item-section>
              </q-item>
            </div>

            <!-- Device Selection -->
            <div class="q-pb-md">
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.device"
                    :options="dropDown.deviceOptions"
                    label="Select device"
                    placeholder="Device"
                    outlined
                    dense
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    size="md"
                    @click="fnManageDevice"
                    color="purple-9"
                    icon="add"
                    class="q-ml-sm"
                  />
                </q-item-section>
              </q-item>
            </div>

            <!-- Mars Device Model Selection -->
            <div class="q-pb-md">
              <q-select
                color="grey-9"
                v-model="formData.marsDevice"
                :options="dropDown.marsDeviceOptions"
                label="Mars Device Model"
                outlined
                dense
              />
            </div>

            <!-- Plan Selection -->
            <div class="q-pb-md">
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.plan"
                    :options="dropDown.planOptions"
                    label="Select plan"
                    placeholder="Plan"
                    @update:model-value="fnCategoryBasedRental"
                    outlined
                    dense
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    size="md"
                    @click="fnManagePlan"
                    color="purple-9"
                    icon="add"
                    class="q-ml-sm"
                  />
                </q-item-section>
              </q-item>
            </div>

            <!-- Setup Fee -->
            <div class="q-pb-md">
              <q-input
                color="grey-9"
                type="number"
                v-model="formData.setupFees"
                placeholder="Setup fee"
                label="Enter Setup fee"
                outlined
                dense
                :rules="[val => val >= 0 || 'Must be positive']"
              />
            </div>

            <!-- Monthly/Recurring Fee -->
            <div class="q-pb-md">
              <q-input
                color="grey-9"
                type="number"
                v-model="formData.monthlyFees"
                placeholder="Recurring fee"
                label="Enter recurring fee"
                outlined
                dense
                :rules="[val => val >= 0 || 'Must be positive']"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn 
              label="Submit" 
              :disable="Submitdata" 
              @click="fnsubmit" 
              color="purple-9" 
              :loading="loading"
            />
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup Rental details -->

      <!-- Modal Components -->
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      />
      
      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      />
      
      <showPlanModalComponent
        v-if="showPlanDetailModal"
        :propToggleModal="showPlanDetailModal"
        @emitToggleModal="fnManagePlan"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

// Import components
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue"
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue"
import showPlanModalComponent from "../../components/super_admin/showPlanModalComponent.vue"

const $q = useQuasar()

// Pinia Stores
const deviceStore = useDeviceStore()
const leadSourceStore = useLeadSourceStore()
const planStore = usePlanStore()
const rentalStore = useRentalStore()

// State from stores
const { getAllDevicesInfo, getMarsDeviceModel } = storeToRefs(deviceStore)
const { getActiveLeadSource } = storeToRefs(leadSourceStore)
const { getActivePlan } = storeToRefs(planStore)
const { categoryBasedRental } = storeToRefs(rentalStore)

// Reactive state
const showLeadSourceModal = ref(false)
const showDeviceDetailModal = ref(false)
const showPlanDetailModal = ref(false)
const Submitdata = ref(false)
const loading = ref(false)

// Form data
const formData = reactive({
  leadSource: '',
  device: '',
  marsDevice: '',
  plan: '',
  setupFees: '',
  monthlyFees: ''
})

// Dropdown options
const dropDown = reactive({
  deviceOptions: [],
  leadSourceOptions: [],
  marsDeviceOptions: [],
  planOptions: []
})

// Load dropdown data on component mount
onMounted(async () => {
  await ajaxLoadDataForDeviceTypeTable()
  await marsDeviceModelDatasLoading()
})

// Load Mars device models
const marsDeviceModelDatasLoading = async () => {
  try {
    await deviceStore.FETCH_MARS_DEVICE_MODEL()
    
    if (getMarsDeviceModel.value && getMarsDeviceModel.value.length > 0) {
      // Assuming getMarsDeviceModel is an array of arrays
      dropDown.marsDeviceOptions = getMarsDeviceModel.value.flatMap(item =>
        item.map(oo => ({
          label: oo.name,
          value: oo.code
        }))
      )
    }
  } catch (error) {

    console.error('Error loading Mars device models:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load Mars device models',
      icon: 'error'
    })
  }
}

// Load all dropdown data
const ajaxLoadDataForDeviceTypeTable = async () => {
  try {
    // Load devices
    await deviceStore.FETCH_DEVICES_DATA()
    if (getAllDevicesInfo.value && getAllDevicesInfo.value.length > 0) {
      dropDown.deviceOptions = getAllDevicesInfo.value.map(item => ({
        value: item.id,
        label: item.deviceName
      }))
    }

    // Load lead sources
    await leadSourceStore.LEAD_SOURCE_ACTIVE_LIST()
    if (getActiveLeadSource.value && getActiveLeadSource.value.length > 0) {
      dropDown.leadSourceOptions = getActiveLeadSource.value.map(item => ({
        value: item.id,
        label: item.sourceName
      }))
    }

    // Load plans
    await planStore.PLAN_ACTIVE_LIST()
    if (getActivePlan.value && getActivePlan.value.length > 0) {
      dropDown.planOptions = getActivePlan.value.map(item => ({
        value: item.id,
        label: item.planName
      }))
    }
  } catch (error) {

    console.error('Error loading dropdown data:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load dropdown data',
      icon: 'error'
    })
  }
}

// Category-based rental calculation
const fnCategoryBasedRental = async () => {
  if (!formData.leadSource || !formData.device || !formData.plan) {
    return
  }

  try {
    const requestData = {
      leadSource: formData.leadSource,
      device: formData.device,
      plan: formData.plan
    }

    const response = await rentalStore.CATEGORY_BASED_RENTAL_PLAN(requestData)
    
    if (response && response.status === 200) {
      formData.setupFees = categoryBasedRental.value?.setupFees || 0
      formData.monthlyFees = categoryBasedRental.value?.monthlyFees || 0
    } else {
      formData.setupFees = 0
      formData.monthlyFees = 0
    }
  } catch (error) {

    console.error('Error loading category-based rental:', error)
    formData.setupFees = ''
    formData.monthlyFees = ''
    $q.notify({
      color: 'negative',
      message: 'Failed to load rental plan data',
      icon: 'error'
    })
  }
}

// Submit form
const fnsubmit = async () => {
  // Validate required fields
  if (!formData.leadSource || !formData.device || !formData.plan) {
    $q.notify({
      color: 'negative',
      message: 'Please fill all required fields',
      icon: 'warning'
    })
    return
  }

  if (!formData.setupFees || !formData.monthlyFees) {
    $q.notify({
      color: 'negative',
      message: 'Please enter setup and monthly fees',
      icon: 'warning'
    })
    return
  }

  // Show loading
  loading.value = true
  Submitdata.value = true

  $q.loading.show({
    message: 'Please wait...',
    spinnerColor: 'purple-9'
  })

  try {
    const requestParams = {
      url: {
        leadSource: formData.leadSource,
        device: formData.device,
        plan: formData.plan
      },
      params: {
        setupFees: parseFloat(formData.setupFees),
        monthlyFees: parseFloat(formData.monthlyFees)
      }
    }

    const response = await rentalStore.RENTAL_PLAN(requestParams)
    
    $q.notify({
      color: 'positive',
      message: response.data?.message || 'Rental plan created successfully',
      icon: 'thumb_up'
    })
    
    // Reset form
    resetForm()
    
  } catch (error) {

    console.error('Error submitting rental plan:', error)
    $q.notify({
      color: 'negative',
      message: error.data?.message || 'Failed to create rental plan',
      icon: 'error'
    })
  } finally {
    $q.loading.hide()
    loading.value = false
    Submitdata.value = false
  }
}

// Reset form function
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
}

// Modal management functions
const fnManageLeadSource = () => {
  showLeadSourceModal.value = !showLeadSourceModal.value
}

const fnManageDevice = () => {
  showDeviceDetailModal.value = !showDeviceDetailModal.value
}

const fnManagePlan = () => {
  showPlanDetailModal.value = !showPlanDetailModal.value
}



</script>

<style scoped>
.bottom-border {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
}

.q-item {
  min-height: 40px;
}

.q-card {
  border-radius: 8px;
}
</style>