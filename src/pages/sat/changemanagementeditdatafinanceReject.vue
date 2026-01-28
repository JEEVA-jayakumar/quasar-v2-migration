<template>
  <q-page padding>
    <q-stepper
      flat
      ref="stepper"
      v-model="step"
      color="primary"
    >
      <q-step :name="1" :title="'Edit Rental Details'" :done="step > 1">
        {{ info.datainfo1 }}
        
        <b>Device Count : {{ formdata1.deviceCount }}</b><br/><br/>
        <b>Reason : </b>
        <span class="label text-negative">{{ getRsmReason?.reason }}</span>
        
        <div>
          <div class="row q-col-gutter-sm q-my-xs" v-if="!check">
            <div class="col-xs-12 col-sm-6">
              <q-select 
                disable
                v-model="formdata.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select 
                clearable
                :disable="((formdata.plan != getImplementedQueue.leadInformation.plan.id) || (getImplementedQueue.leadInformation.cmsLeadStatus == 15) || (getImplementedQueue.leadInformation.cmsLeadStatus == 21)) ? false : true"
                @update:model-value="handlePaymentOptionUpdate"
                @blur="v$.formdata.paymentOption.$touch"
                :error="v$.formdata.paymentOption.$error"
                v-model="formdata.paymentOption"
                class="no-margin"
                label="select Payment"
                :options="payment"
                emit-value
                map-options
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input 
                disable
                v-model="formdata.setupFees"
                class="no-margin"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input 
                disable
                v-model="formdata.recurringFees"
                class="no-margin"
                label="Recurring fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-checkbox 
                v-model="check" 
                :disable="getImplementedQueue.leadInformation.cmsLeadStatus == 15 ? true : false" 
                color="positive" 
                label="Pricing Exception" 
                left-label 
              />
            </div>
          </div>
          
          <div class="row q-col-gutter-sm q-my-xs" v-else>
            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata1.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                @update:model-value="planSelected"
                emit-value
                map-options
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.setupFees"
                class="no-margin"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.recurringFees"
                class="no-margin"
                label="Recurring fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-checkbox 
                v-model="check" 
                :disable="getImplementedQueue.leadInformation.cmsLeadStatus == 15 ? false : true" 
                color="positive" 
                label="Pricing Exception" 
                left-label 
              />
            </div>
          </div>
        </div>
        
        <div v-if="formdata.paymentOption == 2" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-item>
              <q-item-section>
                <q-item-label>Upload the Cheque File :</q-item-label>
              </q-item-section>
              <q-item-section side>
                <label class="cursor-pointer text-white" style="background-color: #202c3f;">
                  <span>Attach</span>
                  <input
                    type="file"
                    name="file"
                    @change="fnUploadApplicationForm($event, document)"
                    accept=".png, .jpg, .pdf"
                  />
                </label>
                &nbsp;{{ formdata.paymentDocumentFile }}
              </q-item-section>
            </q-item>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input 
              @blur="v$.formdata.paymentMadeon.$touch"
              :error="v$.formdata.paymentMadeon.$error"
              v-model="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              placeholder="Transaction Made ON"
              type="date"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input 
              @blur="v$.formdata.referenceNumber.$touch"
              :error="v$.formdata.referenceNumber.$error"
              v-model="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Cheque Reference Number"
            />
          </div>
        </div>
        
        <div v-else-if="formdata.paymentOption == 1" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-input 
              @blur="v$.formdata.referenceNumber.$touch"
              :error="v$.formdata.referenceNumber.$error"
              v-model="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*NEFT Reference Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input 
              @blur="v$.formdata.paymentMadeon.$touch"
              :error="v$.formdata.paymentMadeon.$error"
              v-model="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              type="date"
            />
          </div>
        </div>
        
        <div v-else-if="formdata.paymentOption == 3" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-input 
              @blur="v$.formdata.referenceNumber.$touch"
              :error="v$.formdata.referenceNumber.$error"
              v-model="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Swipe Reference Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input 
              @blur="v$.formdata.paymentMadeon.$touch"
              :error="v$.formdata.paymentMadeon.$error"
              v-model="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              type="date"
            />
          </div>
        </div>
        
        <br />
        
        <q-stepper-navigation>
          <div v-if="((formdata.plan == getImplementedQueue.leadInformation.plan.id) && !check && (getImplementedQueue.leadInformation.cmsLeadStatus == 15))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="((formdata.plan == getImplementedQueue.leadInformation.plan.id) && !check && (getImplementedQueue.leadInformation.cmsLeadStatus == 21))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="((formdata.plan == getImplementedQueue.leadInformation.plan.id) && !check && (getImplementedQueue.leadInformation.cmsLeadStatus == 19) || (getImplementedQueue.leadInformation.cmsLeadStatus == 17))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)">Send to RSM</q-btn>
          </div>
          <div v-else-if="((formdata.plan != getImplementedQueue.leadInformation.plan.id) && !check)">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="((formdata.plan != getImplementedQueue.leadInformation.plan.id || formdata.plan == getImplementedQueue.leadInformation.plan.id) && check)">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)">Send to RSM</q-btn>
          </div>
          <div v-else>
            <q-btn class="q-ml-sm" color="primary" @click="stepper.next()">Continue</q-btn>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" :title="'Edit KYC Fields'" :done="step > 2">
        <p class="caption"><strong>Edit KYC Details</strong></p>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.legalName" class="no-margin" label="Legal Name" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactName" class="no-margin" label="Contact Name" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactPhone" class="no-margin" label="Contact Number" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input 
              :model-value="merchant.companyinformation.pan"
              @update:model-value="merchant.companyinformation.pan = $event.toUpperCase()"
              @blur="v$.merchant.companyinformation.pan.$touch"
              :error="v$.merchant.companyinformation.pan.$error"
              class="no-margin"
              label="Pan Number"
            />
            <MarsErrorResponse 
              v-if="error.field.merchant.companyinformation.pan.alert"
              :error="error.field.merchant.companyinformation.pan"
            />
            <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.companyinformation.pan.$error">
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required - Provide valid PAN Number
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input 
              :model-value="merchant.businessInformation.gstId"
              @update:model-value="merchant.businessInformation.gstId = $event.toUpperCase()"
              @blur="v$.merchant.businessInformation.gstId.$touch"
              :error="v$.merchant.businessInformation.gstId.$error"
              class="no-margin"
              label="Gst Number"
              @change="marsRequiredFormattingofGST"
            />
            <MarsErrorResponse 
              v-if="error.field.merchant.businessInformation.gstId.alert"
              :error="error.field.merchant.businessInformation.gstId"
            />
            <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.businessInformation.gstId.$error">
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required - Provide valid GST Number
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              :model-value="merchant.bankInformation.bankDetails.ifsc"
              @update:model-value="merchant.bankInformation.bankDetails.ifsc = $event.toUpperCase()"
              @blur="populateBankDetails"
              label="IFSC Code*"
              placeholder="Enter IFSC*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              :model-value="merchant.bankInformation.bankDetails.bankName"
              @update:model-value="merchant.bankInformation.bankDetails.bankName = $event.toUpperCase()"
              label="Bank Name*"
              placeholder="Enter Bank Name*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              placeholder="Choose from the below"
              v-model="merchant.bankInformation.bankDetails.paymentMode"
              label="Payment mode"
              :options="paymnentModeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              placeholder="Choose from the below"
              v-model="merchant.bankInformation.bankDetails.accountType"
              label="Account Type"
              :options="accountTypeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.bankInformation.bankDetails.accountNumber" class="no-margin" label="Account Numbers" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.dbaName" class="no-margin" label="DBA Name" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.registeredAddress" class="no-margin" label="Address" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.registeredCityName"
              label="City (type min 3 characters)*"
              placeholder="Start typing ..*"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.registeredStateName"
              label="state (type min 3 characters)*"
              placeholder="Start typing ..*"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.registeredPin" class="no-margin" label="Pincode" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactMobile" class="no-margin" label="Mobile Number" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactEmail" class="no-margin" label="Email Id" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.statementEmail" class="no-margin" label="Statement Email ID" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.businessNature" class="no-margin" label="Nature of Business Change" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <p><b>Auto or Manual Settlement?</b></p>
            <q-option-group
              :options="autoormanualOptions"
              color="grey-9"
              v-model="merchant.paymentDetails.settlementType"
              type="radio"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <p><b>Pre Auth Enable?</b></p>
            <q-option-group
              :options="preauthOptions"
              color="grey-9"
              v-model="merchant.paymentDetails.preAuth"
              type="radio"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <p><b>Cash/POS Activation?</b></p>
            <q-option-group
              :options="cashandposOptions"
              color="grey-9"
              v-model="merchant.paymentDetails.cashAtPosEnabled"
              type="radio"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <p><b>Internation Card Acceptance?</b></p>
            <q-option-group
              :options="internationalcardOptions"
              color="grey-9"
              v-model="merchant.paymentDetails.intlCardAcceptance"
              type="radio"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <p><b>Tip Enable?</b></p>
            <q-option-group
              :options="tipOptions"
              color="grey-9"
              v-model="merchant.paymentDetails.tipEnabled"
              type="radio"
            />
          </div>
        </div>
        
        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="nextStep">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" :title="'MDR Changes'" :done="step > 3">
        <!-- MDR form content remains similar but with updated validation -->
        <!-- ... (MDR form content) ... -->
        
        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="stepper.next()">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step :name="4" :title="'Attach Documents'" :done="step > 4">
        <!-- Document attachment content -->
        <!-- ... (Document attachment content) ... -->
        
        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="secondary" @click="finalFormSubmitKyc(merchant)">Submit to Mars</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, } from 'vue'
import { useQuasar, QStepper } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'
import _ from 'lodash'
import MarsErrorResponse from "../../components/MarsErrorResponseHandler.vue"
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue"

// Define reactive state
const step = ref(1)
const check = ref(false)
const stepper = ref(null)
const $q = useQuasar()

// Form data
const formdata = reactive({
  paymentOption: '',
  referenceNumber: '',
  paymentMadeon: '',
  setupFees: '',
  recurringFees: '',
  verifiedCmsPricingStatus: 1,
  plan: '',
  planCode: '',
  contactName: '',
  contactNumber: '',
  alternateContactNumber: '',
  city: '',
  device: '',
  deviceCount: '',
  leadAddress: '',
  latitude: '',
  longitude: '',
  state: '',
  leadCategory: 2,
  kyc: false,
  verifiedBanksubventionStatus: '',
  reason: '',
  merchantCategory: '',
  pricing: 1,
  leadStatus: '',
  submittoRSMDate: '',
  posIncentive: '',
  posEnable: '',
  leadName: '',
  paymentDocumentFile: '',
  paymentDocumentMimeType: '',
})

const formdata1 = reactive({ ...formdata })

const merchant = reactive({
  salesInformation: {
    institutionCode: '',
  },
  companyinformation: {
    pan: '',
    contactPhone: '',
    legalName: '',
    dbaName: '',
    registeredAddress: '',
    registeredPin: '',
    registeredCityRefCode: '',
    registeredStateRefCode: '',
    registeredCityName: '',
    registeredStateName: '',
    businessNature: '',
    contactMobile: '',
    contactName: '',
    statementEmail: '',
    applicationNumber: '',
  },
  bankInformation: {
    bankDetails: {
      accountNumber: '',
      ifsc: '',
      bankName: '',
      paymentMode: '',
      accountType: '',
    }
  },
  businessInformation: {
    gstId: '',
  },
  kyc: {
    documents: []
  },
  paymentDetails: {
    cashAtPosEnabled: '',
    intlCardAcceptance: '',
    preAuth: '',
    rentalPlanCode: '',
  },
  mdrPlan: {
    code: 1,
    domesticDebitUpTo2000: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    domesticDebitAbove2000: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    standardOrClassic: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    premiumOrPlatinum: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    superPremiumOrSignature: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    commercialOrCorporate: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    internationalDebitCard: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    internationalCreditCard: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    onus: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    mVisa: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    masterPass: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    cashAtPos: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
    convenientFee: { fixed: 0.0, percentage: 0.0, minimum: 0.0 }
  },
})

const error = reactive({
  field: {
    merchant: {
      businessInformation: {
        gstId: { alert: false, issue: "", value: "" }
      },
      companyinformation: {
        pan: { alert: false, issue: "", value: "" }
      }
    }
  }
})

const info = reactive({ datainfo1: "" })

// Dropdown options
const dropDown = reactive({
  deviceOptions: [],
  planOptions: [],
  leadSourceOptions: [],
  merchantTypesOptions: []
})

const payment = [
  { label: "Cheque", value: 2 },
  { label: "Swipe", value: 3 },
  { label: "Neft", value: 1 }
]

const autoormanualOptions = [
  { label: "Auto Settlement", value: "A" },
  { label: "Manual Settlement", value: "M" }
]

const preauthOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" }
]

const cashandposOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" }
]

const internationalcardOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" }
]

const tipOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" }
]

const paymnentModeOptions = [
  { label: "Direct credit", value: "D" },
  { label: "NEFT", value: "N" }
]

const accountTypeOptions = [
  { label: "Saving account", value: "S" },
  { label: "Current account", value: "C" },
  { label: "Overdraft account", value: "O" },
  { label: "Cash credit account", value: "R" }
]

// Validation rules
const panCard = helpers.regex(/^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/)
const gstn = helpers.regex(/^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/)

const rules = {
  formdata: {
    referenceNumber: { required },
    paymentOption: { required },
    paymentMadeon: { required },
  },
  merchant: {
    companyinformation: {
      pan: { 
        required, 
        panCard, 
        maxLength: maxLength(10),
        minLength: minLength(10)
      }
    },
    businessInformation: {
      gstId: { 
        required, 
        gstn, 
        maxLength: maxLength(15),
        minLength: minLength(15)
      }
    }
  }
}

const v$ = useVuelidate(rules, { formdata, merchant })

// Store getters would be replaced with Pinia
// For now, using placeholder functions
const getImplementedQueue = computed(() => ({ 
  leadInformation: { 
    plan: { id: '' },
    cmsLeadStatus: 0,
    merchantType: { merchantTypeName: '' }
  },
  mid: '',
  tid: ''
}))





const getRsmReason = computed(() => {
  return _.find(getImplementedQueue.value.leadInformation.leadVerificationStatus, function(oo) {
    return oo.verificationType == 6 && oo.status == false;
  })
})

// Methods
const planSelected = (item) => {
  console.log("Plan selected:", item)
  // Add your plan selection logic here
}

const handlePaymentOptionUpdate = (value) => {
  formdata.paymentOption = value
}

const sendtoFinance = (request) => {
  v$.value.formdata.$touch()
  if (v$.value.formdata.$error) {
    $q.notify("Please review fields again.")
    return
  }
  
  if (formdata.paymentOption == 2 && !formdata.paymentDocumentFile) {
    $q.notify({
      color: "amber",
      position: "bottom",
      message: "Please attach the Cheque File",
      icon: "attachment"
    })
    return
  }
  
  // Implement API call
  console.log("Sending to finance:", request)
}

const sendtoNH = (request) => {
  // Implement API call
  console.log("Sending to NH:", request)
}

const fnUploadApplicationForm = (event) => {
  // Implement file upload logic
  console.log("Uploading application form:", event.target.files[0])
}

const marsRequiredFormattingofGST = (val) => {
  if (!val) {
    merchant.businessInformation.gstId = null
  } else {
    merchant.businessInformation.gstId = val
  }
}

const populateBankDetails = () => {
  // Implement IFSC lookup logic
  console.log("Populating bank details for IFSC:", merchant.bankInformation.bankDetails.ifsc)
}

const nextStep = () => {
  v$.value.merchant.$touch()
  if (v$.value.merchant.$error) {
    $q.notify("Please review the KYC information fields again.")
  } else {
    stepper.value.next()
  }
}

const finalFormSubmitKyc = (request) => {
  // Implement final form submission
  console.log("Submitting KYC:", request)
}

const fnPDFViewModal = (documentUrl) => {
  // Implement PDF modal logic
  console.log("Viewing PDF:", documentUrl)
}

// Lifecycle
onMounted(() => {
  ajaxLoadDataForDeviceTypeTable1()
  ajaxLoadMarsData()
  ajaxLoadShortLeadInfoForDocumentTypes()
  fetchAllDropdownValuesFromMARSapi()
})

// Functions that need implementation
const ajaxLoadDataForDeviceTypeTable1 = async () => {
  // Implement device data loading
}

const ajaxLoadMarsData = async () => {
  // Implement Mars data loading
}

const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
  // Implement document types loading
}

const fetchAllDropdownValuesFromMARSapi = async () => {
  // Implement dropdown data loading
}
</script>

<style scoped>
.customQuasarSelect {
  padding: 5px;
}

label {
  padding: 5px 10px;
  display: table;
}

input[type="file"] {
  display: none;
}

.bg-dark-custom {
  background: rgba(0, 0, 0, 0.5);
}
</style>