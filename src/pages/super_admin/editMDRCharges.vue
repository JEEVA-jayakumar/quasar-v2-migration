<template>
  <q-page>
    <q-dialog
      maximized
      persistent
      v-model="toggleModel"
    >
      <q-card style="width: 60vw; max-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Existing MDR Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- START >> Setup MDR details -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <q-list separator>
                    <div class="col-md-12 q-pb-md">
                      <q-select
                        color="grey-9"
                        v-model="formData.leadSource"
                        :options="dropDown.leadSourceOptions"
                        label="Select lead source"
                        @update:model-value="fnleadSource"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-md-12 q-pb-md">
                      <q-select
                        color="grey-9"
                        v-model="formData.device"
                        :options="dropDown.deviceOptions"
                        label="Select device"
                        @update:model-value="fnDevice"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-md-12 q-pb-md">
                      <q-select
                        color="grey-9"
                        v-model="formData.marsDeviceModel"
                        :options="dropDown.marsDeviceOptions"
                        label="Mars Device Model"
                        @update:model-value="fnMarsDeviceModel"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-md-12 q-pb-md">
                      <q-select
                        color="grey-9"
                        v-model="formData.merchantCategory"
                        :options="dropDown.merchantTypesOptions"
                        label="Select merchant category type"
                        @update:model-value="fnMerchantCategory"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-md-12 q-pb-md">
                      <q-input
                        color="grey-9"
                        type="text"
                        v-model="formData.mdrPlanName"
                        placeholder="Mdr Plan Name"
                        label="Mdr Plan Name"
                        outlined
                        dense
                      />
                    </div>

                    <!-- Device Type 1 Fields -->
                    <template v-if="propRowDetails.device.isDevice == 1">
                      <div v-for="field in deviceType1Fields" :key="field.key" class="col-md-12 q-pb-md">
                        <q-input
                          color="grey-9"
                          type="number"
                          v-model="formData[field.key]"
                          :label="field.label"
                          :placeholder="field.label"
                          :error="v$.formData[field.key].$error"
                          @blur="v$.formData[field.key].$touch"
                          outlined
                          dense
                        >
                          <template v-if="v$.formData[field.key].$error" #error>
                            {{ field.label }} must be between 0 and 100.
                          </template>
                        </q-input>
                      </div>
                    </template>

                    <!-- Device Type 2 Fields -->
                    <template v-else-if="propRowDetails.device.isDevice == 2">
                      <div v-for="field in deviceType2Fields" :key="field.key" class="col-md-12 q-pb-md">
                        <q-input
                          color="grey-9"
                          type="number"
                          v-model="formData[field.key]"
                          :label="field.label"
                          :placeholder="field.label"
                          :error="v$.formData[field.key].$error"
                          @blur="v$.formData[field.key].$touch"
                          outlined
                          dense
                        >
                          <template v-if="v$.formData[field.key].$error" #error>
                            {{ field.label }} must be between 0 and 100.
                          </template>
                        </q-input>
                      </div>
                    </template>
                  </q-list>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-md">
                  <q-btn
                    flat
                    label="Cancel"
                    color="grey-8"
                    @click="emitfnshowEditMDR"
                  />
                  <q-btn
                    label="Submit"
                    color="purple-9"
                    @click="fnEditMdrPlan(formData)"
                  />
                </q-card-actions>
              </q-card>
            </div>
            <!-- END >> Setup MDR details -->

            <!-- START >> Table >> MDR details -->
            <div class="col-12 col-md-6">
              <!-- Additional content can go here -->
            </div>
            <!-- END >> Table >> MDR details -->
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
    
    <showMerchantModalComponent
      v-if="showMerchantModal"
      :propToggleModal="showMerchantModal"
      @emitToggleModal="fnManageMerchantType"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, defineProps, defineEmits } from 'vue'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { minValue, maxValue } from '@vuelidate/validators'
// Remove unused imports
// import { mapGetters, mapActions } from 'vuex'
// import { storeToRefs } from 'pinia'
// import _ from 'lodash'

// Import components
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue"
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue"
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue"

const $q = useQuasar()

// Props and Emits
const props = defineProps({
  propShoweditMerchantDetails: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnshowEditMDR'])

// Reactive state
const toggleModel = ref(props.propShoweditMerchantDetails)
const showLeadSourceModal = ref(false)
const showDeviceDetailModal = ref(false)
const showMerchantModal = ref(false)
const isDevice = ref(null)

// Form data
const formData = reactive({
  leadSource: JSON.stringify(props.propRowDetails.leadSource),
  device: JSON.stringify(props.propRowDetails.device),
  marsDeviceModel: JSON.stringify(props.propRowDetails.marsDeviceModel),
  merchantCategory: JSON.stringify(props.propRowDetails.merchantCategory),
  mdrPlanName: props.propRowDetails.mdrPlanName,
  debitLessthanAmount: props.propRowDetails.debitLessthanAmount,
  debitGreaterthanAmount: props.propRowDetails.debitGreaterthanAmount,
  stdCC: props.propRowDetails.stdCC,
  premiumCC: props.propRowDetails.premiumCC,
  corpCC: props.propRowDetails.corpCC,
  intlCC: props.propRowDetails.intlCC,
  superPremiumlCC: props.propRowDetails.superPremiumlCC,
  amexDomestic: props.propRowDetails.amexDomestic,
  amexInternational: props.propRowDetails.amexInternational,
  upiDebitCardUpTo2000: props.propRowDetails.upiDebitCardUpTo2000,
  upiDebitCardAbove2000: props.propRowDetails.upiDebitCardAbove2000,
  upiPrepaidCreditCardsUpTo2000: props.propRowDetails.upiPrepaidCreditCardsUpTo2000,
  upiPrepaidCreditCardsAbove2000: props.propRowDetails.upiPrepaidCreditCardsAbove2000,
  leadSource1: props.propRowDetails.leadSource.id,
  deviceId: props.propRowDetails.device.id,
  smallMerchantLessThanTwoDebit: props.propRowDetails.smallMerchantLessThanTwoDebit,
  smallMerchantGreaterThanTwoDebit: props.propRowDetails.smallMerchantGreaterThanTwoDebit,
  smallMerchantLessThanTwoCreditAndPrepaid: props.propRowDetails.smallMerchantLessThanTwoCreditAndPrepaid,
  smallMerchantGreaterThanTwoCreditAndPrepaid: props.propRowDetails.smallMerchantGreaterThanTwoCreditAndPrepaid,
  largeMerchantLessThanTwoDebit: props.propRowDetails.largeMerchantLessThanTwoDebit,
  largeMerchantGreaterThanTwoDebit: props.propRowDetails.largeMerchantGreaterThanTwoDebit,
  largeMerchantLessThanTwoCreditandPrepaid: props.propRowDetails.largeMerchantLessThanTwoCreditandPrepaid,
  largeMerchantGreaterThanTwoCreditandPrepaid: props.propRowDetails.largeMerchantGreaterThanTwoCreditandPrepaid,
  marsId: "",
  merchantCategory1: ""
})

// Dropdown options
const dropDown = reactive({
  deviceOptions: [],
  leadSourceOptions: [],
  marsDeviceOptions: [],
  merchantTypesOptions: []
})

// Field configurations for validation
const deviceType1Fields = [
  { key: 'debitLessthanAmount', label: 'Debit <= 2000 %' },
  { key: 'debitGreaterthanAmount', label: 'Debit > 2000 %' },
  { key: 'stdCC', label: 'Std CC %' },
  { key: 'premiumCC', label: 'Premium CC %' },
  { key: 'corpCC', label: 'Corp Pre CC %' },
  { key: 'intlCC', label: 'Intl Pre CC %' },
  { key: 'superPremiumlCC', label: 'Super Pre CC %' },
  { key: 'amexDomestic', label: 'Amex Domestic %' },
  { key: 'amexInternational', label: 'Amex International %' },
  { key: 'upiDebitCardUpTo2000', label: 'UPI Debit Card UpTo 2000 %' },
  { key: 'upiDebitCardAbove2000', label: 'UPI Debit Card Above 2000 %' },
  { key: 'upiPrepaidCreditCardsUpTo2000', label: 'UPI Prepaid Credit Cards UpTo 2000 %' },
  { key: 'upiPrepaidCreditCardsAbove2000', label: 'UPI Prepaid Credit Cards Above 2000 %' }
]

const deviceType2Fields = [
  { key: 'smallMerchantLessThanTwoDebit', label: 'Small Merchant < 2000 % debit Card' },
  { key: 'smallMerchantGreaterThanTwoDebit', label: 'Small Merchant > 2000 % debit Card' },
  { key: 'smallMerchantLessThanTwoCreditAndPrepaid', label: 'Small Merchant < 2000 % credit and prepaid card' },
  { key: 'smallMerchantGreaterThanTwoCreditAndPrepaid', label: 'Small Merchant > 2000 % credit and prepaid card' },
  { key: 'largeMerchantLessThanTwoDebit', label: 'Large Merchant < 2000 % debit Card' },
  { key: 'largeMerchantGreaterThanTwoDebit', label: 'Large Merchant > 2000 % debit Card' },
  { key: 'largeMerchantLessThanTwoCreditandPrepaid', label: 'Large Merchant < 2000 % credit and prepaid card' },
  { key: 'largeMerchantGreaterThanTwoCreditandPrepaid', label: 'Large Merchant > 2000 % credit and prepaid card' }
]

// Validation rules
const rules = computed(() => {
  const validations = {}
  
  deviceType1Fields.forEach(field => {
    validations[field.key] = {
      minValue: minValue(0),
      maxValue: maxValue(100)
    }
  })
  
  deviceType2Fields.forEach(field => {
    validations[field.key] = {
      minValue: minValue(0),
      maxValue: maxValue(100)
    }
  })
  
  return { formData: validations }
})

const v$ = useVuelidate(rules, { formData })

// Methods
const emitfnshowEditMDR = () => {
  emit('emitfnshowEditMDR')
}

// IMPORTANT: You need to import and use your stores/APIs correctly
// Since I don't know your store structure, I'll show you the pattern
// You should either use Vuex or Pinia stores

// Example with Vuex (if you're using Vuex):
// import { useStore } from 'vuex'

// Then in setup():
// const store = useStore()

// Example with Pinia (if you're using Pinia):
// import { useSomeStore } from 'stores/some-store'

// Then in setup():
// const someStore = useSomeStore()

// For now, I'll comment out the direct function calls and show you the pattern:

const ajaxMarsDeviceModelDatasLoading = async () => {
  try {
    // Using Vuex pattern:
    // await store.dispatch('SA_Devices/FETCH_MARS_DEVICE_MODEL')
    // const marsDeviceModel = store.getters['SA_Devices/getMarsDeviceModel']
    
    // Or using Pinia pattern:
    // const devicesStore = useDevicesStore()
    // await devicesStore.FETCH_MARS_DEVICE_MODEL()
    // const marsDeviceModel = devicesStore.getMarsDeviceModel
    
    // For now, replacing with placeholder - you need to implement based on your store
    const marsDeviceModel = [] // Replace with actual data fetch
    
    if (marsDeviceModel && Array.isArray(marsDeviceModel)) {
      dropDown.marsDeviceOptions = marsDeviceModel.map(item => ({
        label: item.name,
        value: JSON.stringify(item)
      }))
    }
  } catch (error) {
    console.error('Error loading Mars device models:', error)
    $q.notify({
      color: 'negative',
      position: 'bottom-left',
      message: 'Failed to load device models',
      icon: 'error'
    })
  }
}

const ajaxLoadDataForDeviceTypeTable = async () => {
  try {
    // Load devices
    // Replace with your actual store/API call
    const devices = [] // await store.dispatch('SA_Devices/FETCH_DEVICES_DATA')
    if (devices && Array.isArray(devices)) {
      dropDown.deviceOptions = devices.map(item => ({
        label: item.deviceName,
        value: JSON.stringify(item)
      }))
    }

    // Load lead sources
    // Replace with your actual store/API call
    const leadSources = [] // await store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST')
    if (leadSources && Array.isArray(leadSources)) {
      dropDown.leadSourceOptions = leadSources.map(item => ({
        label: item.sourceName,
        value: JSON.stringify(item)
      }))
    }

    // Load merchant categories
    // Replace with your actual store/API call
    const merchantCategories = [] // await store.dispatch('merchantCategory/MERCHANT_CATEGORY_ACTIVE_LIST')
    if (merchantCategories && Array.isArray(merchantCategories)) {
      dropDown.merchantTypesOptions = merchantCategories.map(item => ({
        label: item.merchantCategoryName,
        value: JSON.stringify(item)
      }))
    }
  } catch (error) {
    console.error('Error loading dropdown data:', error)
  }
}

const fnMerchantCategory = async (item) => {
  try {
    const value = item.value || item
    const data = JSON.parse(value)
    formData.merchantCategory1 = data.id
    formData.merchantCategory = value


    // Replace with your actual store/API call
    // const response = await store.dispatch('CategoryBasedMdr/CATEGORY_BASED_MDR_PLAN', requestData)
    const response = { status: 200, data: {} } // Placeholder
    
    if (response.status === 200) {
      const mdrData = response.data
      updateMdrFormData(mdrData)
    } else {
      handleErrorResponse('Invalid merchant category')
    }
  } catch (error) {
    console.error('Error in fnMerchantCategory:', error)
    handleErrorResponse('Failed to load merchant category data')
  }
}

const fnleadSource = async (item) => {
  try {
    const value = item.value || item
    const data = JSON.parse(value)
    formData.leadSource1 = data.id
    formData.leadSource = value

    // Replace with your actual store/API call
    // await store.dispatch('leadSource/LEAD_BASED_RENTAL', formData.leadSource1)
    
    // Replace with your actual store/API call
    // const response = await store.dispatch('CategoryBasedMdr/CATEGORY_BASED_MDR_PLAN', requestData)
    const response = { status: 200, data: {} } // Placeholder
    
    if (response.status === 200) {
      const mdrData = response.data
      updateMdrFormData(mdrData)
    } else {
      handleErrorResponse('Invalid lead source')
    }
  } catch (error) {
    console.error('Error in fnleadSource:', error)
    handleErrorResponse('Failed to load lead source data')
  }
}

const fnMarsDeviceModel = async (item) => {
  try {
    const value = item.value || item
    const data = JSON.parse(value)
    formData.marsId = data.id
    formData.marsDeviceModel = value


    // Replace with your actual store/API call
    // const response = await store.dispatch('CategoryBasedMdr/CATEGORY_BASED_MDR_PLAN', requestData)
    const response = { status: 200, data: {} } // Placeholder
    
    if (response.status === 200) {
      const mdrData = response.data
      updateMdrFormData(mdrData)
    } else {
      handleErrorResponse('Invalid Mars device model')
    }
  } catch (error) {
    console.error('Error in fnMarsDeviceModel:', error)
    handleErrorResponse('Failed to load Mars device data')
  }
}

const fnDevice = async (item) => {
  try {
    const value = item.value || item
    const data = JSON.parse(value)
    formData.deviceId = data.id
    formData.device = value
    isDevice.value = data.isDevice

    // Replace with your actual store/API call
    // const response = await store.dispatch('CategoryBasedMdr/CATEGORY_BASED_MDR_PLAN', requestData)
    const response = { status: 200, data: {} } // Placeholder
    
    if (response.status === 200) {
      const mdrData = response.data
      updateMdrFormData(mdrData)
    } else {
      handleErrorResponse('Invalid device selection')
    }
  } catch (error) {
    console.error('Error in fnDevice:', error)
    handleErrorResponse('Failed to load device data')
  }
}

// Helper functions
const updateMdrFormData = (mdrData) => {
  if (!mdrData) return
  
  // Update only fields that exist in mdrData
  deviceType1Fields.forEach(field => {
    if (mdrData[field.key] !== undefined) {
      formData[field.key] = mdrData[field.key]
    }
  })
  
  deviceType2Fields.forEach(field => {
    if (mdrData[field.key] !== undefined) {
      formData[field.key] = mdrData[field.key]
    }
  })
}

const handleErrorResponse = (message) => {
  $q.notify({
    color: 'negative',
    position: 'bottom-left',
    message: message,
    icon: 'error'
  })
  
  // Reset MDR fields
  const fieldsToReset = [
    'debitLessthanAmount', 'debitGreaterthanAmount', 'stdCC', 'premiumCC',
    'corpCC', 'intlCC', 'superPremiumlCC', 'amexDomestic', 'amexInternational',
    'upiDebitCardUpTo2000', 'upiDebitCardAbove2000', 'upiPrepaidCreditCardsUpTo2000',
    'upiPrepaidCreditCardsAbove2000'
  ]
  
  fieldsToReset.forEach(field => {
    formData[field] = ''
  })
}

// Modal management functions
const fnManageLeadSource = () => {
  showLeadSourceModal.value = !showLeadSourceModal.value
}

const fnManageDevice = () => {
  showDeviceDetailModal.value = !showDeviceDetailModal.value
}

const fnManageMerchantType = () => {
  showMerchantModal.value = !showMerchantModal.value
}

// Lifecycle hooks
onMounted(async () => {
  await ajaxLoadDataForDeviceTypeTable()
  await ajaxMarsDeviceModelDatasLoading()
  // Replace with your actual store/API call
  // await store.dispatch('leadSource/LEAD_BASED_RENTAL', formData.leadSource1)
})

// Watch for prop changes
watch(() => props.propShoweditMerchantDetails, (newVal) => {
  toggleModel.value = newVal
})
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customModalOverlay {
  background: rgba(0, 0, 0, 0.5);
}
</style>