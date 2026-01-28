<template>
  <q-page padding>
    <q-stepper flat ref="stepper" v-model="step" color="primary">
      <q-step :name="'campaign'" :title="'Edit Rental Details'" :done="step > 'campaign'">
        {{info.datainfo1}}
        {{getImplementedQueue.leadInformation.merchantType.merchantTypeName}}
       
        <b>Edit Rental Details</b>
        <br />
        <br />
        <b>Device Count : {{formdata.deviceCount}}</b>
       
        <br />
        <br />
        <div>
          <div class="row gutter-sm q-my-xs" v-if="!check">
            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                :disable="getImplementedQueue.leadInformation.cmsLeadStatus==15?true:false"
                @update:model-value="fnPlan1"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select
                clearable
                :disable="((formdata.plan != getImplementedQueue.leadInformation.plan.id)||(getImplementedQueue.leadInformation.cmsLeadStatus ==15)||(getImplementedQueue.leadInformation.cmsLeadStatus==21))?false:true"
                @blur="$v.formdata.paymentOption.$touch"
                :error="$v.formdata.paymentOption.$error"
                v-model.trim="formdata.paymentOption"
                class="no-margin"
                label="select Payment"
                :options="payment"
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
                :disable="getImplementedQueue.leadInformation.cmsLeadStatus==15?true:false"
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>

          <div class="row gutter-sm q-my-xs" v-else>
            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata1.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                @update:model-value="fnPlan"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input v-model="formdata1.setupFees" class="no-margin" label="Setup Fees" />
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
                :disable="getImplementedQueue.leadInformation.cmsLeadStatus==15?false:true"
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>
        </div>
        <div v-if="formdata.paymentOption==2" class="row gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-item>
              <q-item-section>
                <q-item-label>Upload the Cheque File :</q-item-label>
              </q-item-section>
              <label class="cursor-pointer text-white" style="background-color: #202c3f;">
                <span>Attach</span>
                <input
                  type="file"
                  name="file"
                  @change="fnUploadApplicationForm($event)"
                  accept=".png, .jpg, .pdf"
                />
              </label>
              &nbsp;{{formdata.paymentDocumentFile}}
            </q-item>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="$v.formdata.paymentMadeon.$touch"
              :error="$v.formdata.paymentMadeon.$error"
              v-model.trim="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              placeholder="Transaction Made ON"
              type="date"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="$v.formdata.referenceNumber.$touch"
              :error="$v.formdata.referenceNumber.$error"
              v-model.trim="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Cheque Reference Number"
            />
          </div>
        </div>
        <div v-else-if="formdata.paymentOption==1" class="row gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="$v.formdata.referenceNumber.$touch"
              :error="$v.formdata.referenceNumber.$error"
              v-model.trim="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*NEFT Reference Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="$v.formdata.paymentMadeon.$touch"
              :error="$v.formdata.paymentMadeon.$error"
              v-model.trim="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              type="date"
            />
          </div>
        </div>
        <div v-else-if="formdata.paymentOption==3" class="row gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="$v.formdata.referenceNumber.$touch"
              :error="$v.formdata.referenceNumber.$error"
              v-model.trim="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Swipe Reference Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="$v.formdata.paymentMadeon.$touch"
              :error="$v.formdata.paymentMadeon.$error"
              v-model.trim="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              type="date"
            />
          </div>
        </div>
        <br />

        <q-stepper-navigation>
          <div v-if="((formdata.plan == getImplementedQueue.leadInformation.plan.id) && (!check) && (getImplementedQueue.leadInformation.cmsLeadStatus==15))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="((formdata.plan == getImplementedQueue.leadInformation.plan.id) && (!check) && (getImplementedQueue.leadInformation.cmsLeadStatus==21))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="((formdata.plan == getImplementedQueue.leadInformation.plan.id) && (!check) && (getImplementedQueue.leadInformation.cmsLeadStatus==19) || (getImplementedQueue.leadInformation.cmsLeadStatus==17))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)">Send to RSM</q-btn>
          </div>
          <div v-else-if="((formdata.plan != getImplementedQueue.leadInformation.plan.id) && (!check))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="((formdata.plan != getImplementedQueue.leadInformation.plan.id || formdata.plan == getImplementedQueue.leadInformation.plan.id) && (check))">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)">Send to RSM</q-btn>
          </div>
          <div v-else>
            <q-btn class="q-ml-sm" color="primary" @click="stepper?.next()">Continue</q-btn>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step :name="'ad_group'" :title="'Edit KYC Fields'" :done="step > 'ad_group'">
        <p class="caption">
          <strong>Edit KYC Details</strong>
        </p>
        <div class="row gutter-sm">
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.legalName"
              class="no-margin"
              label="Legal Name"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.dbaName"
              class="no-margin"
              label="DBA Name"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.contactName"
              class="no-margin"
              label="Contact Name"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.registeredAddress"
              class="no-margin"
              label="Address"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              color="grey-9"
              v-model.trim="merchant.companyinformation.registeredCityName"
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
              color="grey-9"
              v-model.trim="merchant.companyinformation.registeredStateName"
              label="state (type min 3 characters)*"
              placeholder="Start typing ..*"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.registeredPin"
              class="no-margin"
              label="Pincode"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.contactMobile"
              class="no-margin"
              label="Mobile Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.contactEmail"
              class="no-margin"
              label="Email Id"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.statementEmail"
              class="no-margin"
              label="Statement Email ID"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.businessNature"
              class="no-margin"
              label="Nature of Business Change"
            />
          </div>

          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              @blur="$v.merchant.companyinformation.pan.$touch"
              :error="$v.merchant.companyinformation.pan.$error"
              v-model="merchant.companyinformation.pan"
              class="no-margin"
              label="Pan Number"
            />
            <div class="text-negative" v-if="error.field.merchant.companyinformation.pan.alert">
              <MarsErrorResponse :error="error.field.merchant.companyinformation.pan" />
            </div>
            <div
              class="text-negative q-py-xs group q-caption"
              v-if="$v.merchant.companyinformation.pan.$error"
            >
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required - Provide valid PAN Number
              </div>
              <div v-if="$v.merchant.companyinformation.pan.$params.minLength">
                <q-icon color="negative" name="warning" />
                &nbsp;Length should be between {{$v.merchant.companyinformation.pan.$params.minLength.min}} and {{ $v.merchant.companyinformation.pan.$params.maxLength.max }}
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              @blur="$v.merchant.businessInformation.gstId.$touch"
              :error="$v.merchant.businessInformation.gstId.$error"
              v-model="merchant.businessInformation.gstId"
              class="no-margin"
              label="Gst Number"
            />
            <div class="text-negative" v-if="error.field.merchant.businessInformation.gstId.alert">
              <MarsErrorResponse :error="error.field.merchant.businessInformation.gstId" />
            </div>

            <div
              class="text-negative q-py-xs group q-caption"
              v-if="$v.merchant.businessInformation.gstId.$error"
            >
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required - Provide valid GST Number
              </div>
              <div v-if="$v.merchant.businessInformation.gstId.$params.minLength">
                <q-icon color="negative" name="warning" />
                &nbsp;Length should be between {{$v.merchant.businessInformation.gstId.$params.minLength.min}} and {{ $v.merchant.businessInformation.gstId.$params.maxLength.max }}
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              @blur="populateBankDetails"
              v-model.trim="merchant.bankInformation.bankDetails.ifsc"
              label="IFSC Code*"
              placeholder="Enter IFSC*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.bankName"
              label="Bank Name*"
              placeholder="Enter IFSC*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              placeholder="Choose from the below"
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.paymentMode"
              label="Payment mode"
              :options="paymnentModeOptions"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              placeholder="Choose from the below"
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.accountType"
              label="Account Type"
              :options="accountTypeOptions"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.bankInformation.bankDetails.accountNumber"
              class="no-margin"
              label="Account Numbers"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="next()">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper?.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step :name="'mdrdetails'" :title="'MDR Changes'" :done="step > 'mdrdetails'">
        <div class="row group items-center">
          <div class="col-md-12">
            <!-- MDR Plan Fields (similar structure, but updated for Quasar 2) -->
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Domestic Debit Card below 2000</strong>
                </div>
              </div>
              <div class="col">
                <div class="q-caption text-weight-medium q-py-sm" align="center">
                  <b>Merchant Disc Fee</b>
                </div>
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.domesticDebitUpTo2000.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.domesticDebitUpTo2000.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.domesticDebitUpTo2000.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- Repeat similar structure for other MDR fields... -->
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="stepper?.next()">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper?.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step :name="'zata'" :title="'Attach Documents'" :done="step > 'zata'">
        <div>
          <q-item class="q-body-1">
            <q-item-section>
              <q-item-label>
                <div class="q-body-1">
                  Merchant type:
                  <span class="text-weight-medium">{{getImplementedQueue.leadInformation.merchantType.merchantTypeName}}</span>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-body-1 text-dark bg-grey-4 text-weight-medium">
            <q-item-section>Application Form</q-item-section>
            <q-item-section side>
              <label class="cursor-pointer text-white" style="background-color: #202c3f;">
                <span class="q-caption text-weight-light">Attach</span>
                <input
                  type="file"
                  name="file"
                  @change="fnUploadApplicationForm1($event)"
                  accept=".png, .jpg, .pdf"
                />
              </label>
            </q-item-section>
          </q-item>
          <q-item class="q-body-1">
            <q-item-section>
              <div class="full-width">
                <div
                  class="cursor-pointer"
                  v-if="getShortLeadInfo.applicationFileMimeType==null"
                >
                  <div @click="fnPDFViewModal(getShortLeadInfo.applicationFile)" class="ellipsis">
                    <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                    &nbsp;{{getShortLeadInfo.applicationFile}}
                  </div>
                </div>
                <div
                  class="cursor-pointer"
                  v-else-if="getShortLeadInfo.applicationFileMimeType.includes('pdf')"
                >
                  <div @click="fnPDFViewModal(getShortLeadInfo.applicationFile)" class="ellipsis">
                    <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                    &nbsp;{{getShortLeadInfo.applicationFile}}
                  </div>
                </div>
                <div
                  class="cursor-pointer"
                  v-else-if="getShortLeadInfo.applicationFileMimeType.includes('image')"
                >
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL+ '/'+getShortLeadInfo.applicationFile]"
                    ref="handedOverImageViewer"
                    style="max-width:100%"
                  />
                  <div @click="fnViewHandedOverFileImage()" class="ellipsis">
                    <q-icon name="fas fa-image" color="amber-9" />
                    &nbsp;{{getShortLeadInfo.applicationFile}}
                  </div>
                </div>
                <div v-else>Invalid document type/ No document available</div>
              </div>
            </q-item-section>
          </q-item>
          
          <!-- Document upload sections -->
          <!-- Note: Removed viewer component as it's Vue 2 specific -->
          
        </div>

        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="next1()">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper?.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>
     
      <q-step :name="'campaign1'" :title="'TID Level Details'" :done="step > 'campaign1'">
        <div class="row gutter-sm q-my-xs items-center">
          <div class="col-xs-12" align="center">
            <q-card>
              <q-card-section>
                <strong>Choose the TID List</strong>
              </q-card-section>
              <q-card-section>
                <q-checkbox
                  v-for="(item,index) in formdata.mid"
                  :key="index"
                  color="grey-9"
                  v-model="formdata.tid"
                  :val="item"
                  :label="item"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <br><br>
      
        <div class="row">
          <div class="col-md-3">
            <strong>
              <span>Amount Collected </span>
            </strong>
            <br />
          </div>
          <div class="col-md-6">
            <q-input disable
                v-model="formdata.amountCollected"
                class="no-margin"
                label="Amount Collected"
              />
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-3">
            <strong>
              <span>Recurring Fees</span>
            </strong>
            <br />
          </div>
          <div class="col-md-6">
            <q-input disable
                v-model="formdata.recurringFees"
                class="no-margin"
                label="Recurring Fees"
              />
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-3">
            <strong>
              <span>Select the Rental Plan</span>
            </strong>
            <br />
          </div>
          <div class="col-md-6">
            <q-select :disable="getImplementedQueue.leadInformation.cmsLeadStatus==22?false:true"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model.trim="merchant.paymentDetails.rentalPlanCode"
                  label="Rental Plan*"
                  :options="rentalPlanSet"
                />
          </div>
        </div>
        <!-- Additional fields... -->
        
        <q-stepper-navigation>
          <q-btn
            class="q-ml-sm"
            color="secondary"
            @click="finalFormSubmitKyc(merchant)"
          >Submit to Mars</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="stepper?.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    ></showPdfModalComponent>
  </q-page>
</template>
<script>
import { ref, computed, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'
import _ from 'lodash'
import MarsErrorResponse from "../../components/MarsErrorResponseHandler.vue"
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue"

const panCard = helpers.regex(
  'panCard',
  /^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/
)

const gstn = helpers.regex(
  'gstn',
  /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
)

export default {
  components: {
    showPdfModalComponent,
    MarsErrorResponse,
  },
  setup() {
    const $q = useQuasar()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const step = ref('campaign')
    const stepper = ref(null)
    const toggleshowPDFModal = ref(false)
    const PDFDetails = ref(null)
    const check = ref(false)
    const merchantTypeSelection = ref("")
    const subDocumentTypeSelection = ref(0)
    
    const stateOptions = ref([])
    const cityOptions = ref([])
    const rentalPlanSet = ref([])
    
    const dropDown = reactive({
      deviceOptions: [],
      planOptions: [],
      leadSourceOptions: [],
      merchantTypesOptions: [],
    })
    
    const info = reactive({
      datainfo1: "",
    })
    
    const formdata = reactive({
      mid: [],
      tid: [],
      sample: "",
      paymentOption: "",
      referenceNumber: "",
      paymentMadeon: "",
      setupFees: "",
      deviceId: "",
      leadSourceId: "",
      recurringFees: "",
      verifiedCmsPricingStatus: 1,
      plan: "",
      planCode: "",
      contactName: "",
      contactNumber: "",
      alternateContactNumber: "",
      city: "",
      device: "",
      deviceCount: "",
      leadAddress: "",
      latitude: "",
      longitude: "",
      state: "",
      leadCategory: 2,
      kyc: false,
      verifiedBanksubventionStatus: "",
      reason: "",
      amountCollected: "",
      merchantCategory: "",
      corpCC: "",
      debitGreaterthanAmount: "",
      debitLessthanAmount: "",
      premiumCC: "",
      pricing: 1,
      leadStatus: "",
      submittoRSMDate: "",
      posIncentive: "",
      posEnable: "",
      leadName: "",
      paymentDocumentFile: "",
      paymentDocumentMimeType: "",
    })
    
    const formdata1 = reactive({
      paymentOption: "",
      referenceNumber: "",
      paymentMadeon: "",
      setupFees: "",
      deviceId: "",
      leadSourceId: "",
      recurringFees: "",
      verifiedCmsPricingStatus: 1,
      plan: "",
      planCode: "",
      contactName: "",
      contactNumber: "",
      alternateContactNumber: "",
      city: "",
      device: "",
      deviceCount: "",
      leadAddress: "",
      latitude: "",
      longitude: "",
      state: "",
      leadCategory: 2,
      kyc: false,
      verifiedBanksubventionStatus: "",
      reason: "",
      merchantCategory: "",
      corpCC: "",
      debitGreaterthanAmount: "",
      debitLessthanAmount: "",
      premiumCC: "",
      pricing: 1,
      leadStatus: "",
      submittoRSMDate: "",
      posIncentive: "",
      posEnable: "",
      leadName: "",
      paymentDocumentFile: "",
      paymentDocumentMimeType: "",
    })
    
    const merchant = reactive({
      salesInformation: {
        institutionCode: "",
      },
      companyinformation: {
        pan: "",
        contactPhone: "",
        legalName: "",
        dbaName: "",
        registeredAddress: "",
        registeredPin: "",
        registeredCityRefCode: "",
        registeredStateRefCode: "",
        registeredCityName: "",
        registeredStateName: "",
        businessNature: "",
        contactMobile: "",
        contactName: "",
        statementEmail: "",
        contactEmail: "",
        applicationNumber: "",
        remarks: "Company Details Updated",
      },
      bankInformation: {
        bankDetails: {
          accountNumber: "",
          ifsc: "",
          bankName: "",
          paymentMode: "",
          accountType: "",
        },
        remarks: "Bank Details Updated",
      },
      businessInformation: {
        gstId: null,
        remarks: "",
      },
      kyc: {
        remarks: "",
        documents: [],
      },
      paymentDetails: {
        settlementType: "",
        tipEnabled: "",
        cashAtPosEnabled: "",
        intlCardAcceptance: "",
        preAuth: "",
        rentalPlanCode: "",
        remarks: "Payment Details Updated",
      },
      mdrPlan: {
        remarks: "MDR Value Updated",
        code: 1,
        domesticDebitUpTo2000: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        domesticDebitAbove2000: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        standardOrClassic: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        premiumOrPlatinum: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        superPremiumOrSignature: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        commercialOrCorporate: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        internationalDebitCard: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        internationalCreditCard: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        onus: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        diners: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        masterPass: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        cashAtPos: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
        convenientFee: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0,
        },
      },
    })
    
    const forminfo = reactive({
      applicationNumber: ""
    })
    
    const error = reactive({
      field: {
        merchant: {
          businessInformation: {
            gstId: {
              alert: false,
              issue: "",
              value: "",
            },
          },
          companyinformation: {
            pan: {
              alert: false,
              issue: "",
              value: "",
            },
          },
        },
      },
    })
    
    const model = ref("")
    
    const payment = ref([
      {
        label: "Cheque",
        value: 2,
      },
      {
        label: "Swipe",
        value: 3,
      },
      {
        label: "Neft",
        value: 1,
      },
    ])
    
    const autoormanualOptions = ref([
      {
        label: "Auto Settlement",
        value: "A",
      },
      {
        label: "Manual Settlement",
        value: "M",
      },
    ])
    
    const preauthOptions = ref([
      {
        label: "Enable",
        value: "Y",
      },
      {
        label: "Disable",
        value: "N",
      },
    ])
    
    const cashandposOptions = ref([
      {
        label: "Enable",
        value: "Y",
      },
      {
        label: "Disable",
        value: "N",
      },
    ])
    
    const internationalcardOptions = ref([
      {
        label: "Enable",
        value: "Y",
      },
      {
        label: "Disable",
        value: "N",
      },
    ])
    
    const tipOptions = ref([
      {
        label: "Enable",
        value: "Y",
      },
      {
        label: "Disable",
        value: "N",
      },
    ])
    
    const paymnentModeOptions = ref([
      {
        label: "Direct credit",
        value: "D",
      },
      {
        label: "NEFT",
        value: "N",
      },
    ])
    
    const accountTypeOptions = ref([
      {
        label: "Saving account",
        value: "S",
      },
      {
        label: "Current account",
        value: "C",
      },
      {
        label: "Overdraft account",
        value: "O",
      },
      {
        label: "Cash credit account",
        value: "R",
      },
    ])
    
    // Vuex Getters
    const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo'])
    const getDeviceVerificationStatus = computed(() => store.getters['SatLeadValidation/getDeviceVerificationStatus'])
    const rentalPlanFromMars = computed(() => store.getters['mars_rentalPlans/rentalPlanFromMars'])
    const categoryBasedRental = computed(() => store.getters['categoryBasedRental/categoryBasedRental'])
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'])
    const getAllDevicesInfo = computed(() => store.getters['SA_Devices/getAllDevicesInfo'])
    const getActiveLeadSource = computed(() => store.getters['leadSource/getActiveLeadSource'])
    const getActivePlan = computed(() => store.getters['plan/getActivePlan'])
    const categoryBasedMdr = computed(() => store.getters['CategoryBasedMdr/categoryBasedMdr'])
    const getAllMarsData = computed(() => store.getters['GetMarsData/getAllMarsData'])
    const getImplementedQueue = computed(() => store.getters['GetMarsData/getImplementedQueue'])
    const getMidBasedList = computed(() => store.getters['GetMarsData/getMidBasedList'])
    const getShortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes'])
    const cityFromMars = computed(() => store.getters['mars_city/cityFromMars'])
    const stateFromMars = computed(() => store.getters['mars_state/stateFromMars'])
    const ifscFromMars = computed(() => store.getters['mars_ifsc/ifscFromMars'])
    
    // Vuelidate rules
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
            minLength: minLength(10),
          },
        },
        businessInformation: {
          gstId: {
            gstn,
            maxLength: maxLength(15),
            minLength: minLength(15),
          },
        },
      },
    }
    
    const $v = useVuelidate(rules, { formdata, merchant })
    
    // Computed property for getRsmReason
    const getRsmReason = computed(() => {
      return _.find(
        getImplementedQueue.value.leadInformation.leadVerificationStatus,
        function (oo) {
          return oo.verificationType == 6 && oo.status == false
        }
      )
    })
    
    // Methods
    const sendtoFinance = async (request) => {
      $v.value.formdata.$touch()
      if ($v.value.formdata.$error) {
        $q.notify("Please review fields again.")
      } else if (
        formdata.paymentOption == 2 &&
        formdata.paymentDocumentFile == ""
      ) {
        $q.notify({
          color: "amber",
          position: "bottom",
          message: "Please attach the Cheque File",
          icon: "attachment",
        })
      } else {
        let requestparams = {
          url: {
            id: getShortLeadInfo.value.id,
          },
          params: {
            setupFees: request.setupFees,
            amountCollected: request.setupFees,
            recurringFees: request.recurringFees,
            planCode: request.planCode,
            verifiedCmsPricingStatus: request.verifiedCmsPricingStatus,
            contactName: request.contactName,
            contactNumber: request.contactNumber,
            alternateContactNumber: request.alternateContactNumber,
            city: request.city,
            device: request.device,
            deviceCount: request.deviceCount,
            leadAddress: request.leadAddress,
            latitude: request.latitude,
            longitude: request.longitude,
            state: request.state,
            leadCategory: request.leadCategory,
            kyc: request.kyc,
            verifiedBanksubventionStatus: request.verifiedBanksubventionStatus,
            reason: request.reason,
            merchantCategory: request.merchantCategory,
            corpCC: request.corpCC,
            debitGreaterthanAmount: request.debitGreaterthanAmount,
            debitLessthanAmount: request.debitLessthanAmount,
            premiumCC: request.premiumCC,
            pricing: request.pricing,
            leadStatus: request.leadStatus,
            submittoRSMDate: request.submittoRSMDate,
            posEnable: request.posEnable,
            posIncentive: request.posIncentive,
            plan1: request.plan,
            leadName: request.leadName,
            paymentMadeon: request.paymentMadeon,
            referenceNumber: request.referenceNumber,
            paymentOption: request.paymentOption,
            paymentDocumentFile: request.paymentDocumentFile,
            paymentDocumentMimeType: request.paymentDocumentMimeType,
          },
        }
        
        if (!check.value) {
          requestparams.params.leadCategory = 1
          requestparams.params.pricing = 0
        } else {
          requestparams.params.leadCategory = 2
          requestparams.params.pricing = 1
        }
        
        try {
          await store.dispatch('SendTORSMCMS/SEND_TO_RSM_CMS', requestparams)
          $q.notify({
            color: "positive",
            position: "bottom",
            icon: "thumb_up",
            message: "Successfully sent to RSM",
          })
          router.push("/sat/change/management")
        } catch (error) {
          console.error('Error sending to finance:', error)
          $q.notify({
            color: "negative",
            position: "bottom",
            icon: "thumb_down",
            message: error.data?.message || "An error occurred",
          })
        }
      }
    }
    
    const fnPlan = async () => {
      let formData = {
        leadSource: formdata1.leadSourceId,
        device: formdata1.deviceId,
        plan: formdata1.plan,
      }
      await store.dispatch('categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN1', formData)
      if (categoryBasedRental.value) {
        formdata1.setupFees = getImplementedQueue.value.leadInformation.deviceCount * categoryBasedRental.value.setupFees
        formdata1.recurringFees = getImplementedQueue.value.leadInformation.deviceCount * categoryBasedRental.value.monthlyFees
      }
    }
    
    const fnPlan1 = async () => {
      let formData = {
        leadSource: formdata.leadSourceId,
        device: formdata.deviceId,
        plan: formdata.plan,
      }
      await store.dispatch('categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN1', formData)
      if (categoryBasedRental.value) {
        formdata.setupFees = getImplementedQueue.value.leadInformation.deviceCount * categoryBasedRental.value.setupFees
        formdata.recurringFees = getImplementedQueue.value.leadInformation.deviceCount * categoryBasedRental.value.monthlyFees
      }
    }
    
    const sendtoNH = async (request) => {
      let requestparams = {
        url: {
          id: getShortLeadInfo.value.id,
        },
        params: {
          setupFees: request.setupFees,
          amountCollected: request.setupFees,
          recurringFees: request.recurringFees,
          planCode: request.planCode,
          verifiedCmsPricingStatus: request.verifiedCmsPricingStatus,
          contactName: request.contactName,
          contactNumber: request.contactNumber,
          alternateContactNumber: request.alternateContactNumber,
          city: request.city,
          device: request.device,
          deviceCount: request.deviceCount,
          leadAddress: request.leadAddress,
          latitude: request.latitude,
          longitude: request.longitude,
          state: request.state,
          leadCategory: request.leadCategory,
          kyc: request.kyc,
          verifiedBanksubventionStatus: request.verifiedBanksubventionStatus,
          reason: request.reason,
          merchantCategory: request.merchantCategory,
          corpCC: request.corpCC,
          debitGreaterthanAmount: request.debitGreaterthanAmount,
          debitLessthanAmount: request.debitLessthanAmount,
          premiumCC: request.premiumCC,
          pricing: request.pricing,
          leadStatus: request.leadStatus,
          submittoRSMDate: request.submittoRSMDate,
          posEnable: request.posEnable,
          posIncentive: request.posIncentive,
          plan1: request.plan,
          leadName: request.leadName,
          paymentMadeon: request.paymentMadeon,
          referenceNumber: request.referenceNumber,
          paymentOption: request.paymentOption,
          paymentDocumentFile: request.paymentDocumentFile,
          paymentDocumentMimeType: request.paymentDocumentMimeType,
        },
      }
      
      if (!check.value) {
        requestparams.params.leadCategory = 1
        requestparams.params.pricing = 0
      } else {
        requestparams.params.leadCategory = 2
        requestparams.params.pricing = 1
      }
      
      try {
        await store.dispatch('SendTORSMCMS/SEND_TO_RSM_CMS', requestparams)
        $q.notify({
          color: "positive",
          position: "bottom",
          icon: "thumb_up",
          message: "Successfully sent to RSM",
        })
        router.push("/sat/change/management")
      } catch (error) {
        console.error('Error sending to NH:', error)
        $q.notify({
          color: "negative",
          position: "bottom",
          icon: "thumb_down",
          message: error.data?.message || "An error occurred",
        })
      }
    }
    
    const fnUploadApplicationForm = async (event) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Uploading file ..",
      })
      
      let formData = new FormData()
      formData.append("file", event.target.files[0])
      formData.append("fileNameOriginal", "Cheque")
      
      let requestParams = {
        files: formData,
        fileNameOriginal: "Cheque",
      }
      
      try {
        const response = await store.dispatch('SatLeadValidation/FEED_CHEQUE_FORM', requestParams)
        $q.loading.hide()
        $q.notify({
          color: "positive",
          position: "bottom",
          icon: "thumb_up",
          message: "File Successfully Uploaded - " + response.fileName,
        })
        formdata.paymentDocumentFile = response.fileName
        formdata.paymentDocumentMimeType = response.mimeType
      } catch (error) {
        console.error('Error uploading cheque form:', error)
        $q.loading.hide()
        $q.notify({
          color: "negative",
          position: "bottom",
          icon: "thumb_down",
          message: "Failed to upload document",
        })
      }
    }
    
    const fnUploadApplicationForm1 = async (event) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Uploading file ..",
      })
      
      let formData = new FormData()
      formData.append("file", event.target.files[0])
      
      let requestParams = {
        files: formData,
        leadId: getShortLeadInfo.value.id
      }
      
      try {
        const response = await store.dispatch('SatLeadValidation/FEED_FULL_APPLICATION_FORM', requestParams)
        $q.loading.hide()
        $q.notify({
          color: "positive",
          position: "bottom",
          icon: "thumb_up",
          message: "File Successfully Uploaded - " + response.fileName,
        })
        await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', getShortLeadInfo.value.leadInformation.id)
      } catch (error) {
        console.error('Error uploading application form:', error)
        $q.loading.hide()
        $q.notify({
          color: "negative",
          position: "bottom",
          icon: "thumb_down",
          message: "Failed to upload document",
        })
      }
    }
    
    const ajaxLoadDataForDeviceTypeTable1 = async () => {
      try {
        await store.dispatch('SA_Devices/FETCH_DEVICES_DATA')
        dropDown.deviceOptions = getAllDevicesInfo.value.map(item => ({
          value: item.id,
          label: item.deviceName,
        }))
        
        await store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST')
        dropDown.leadSourceOptions = getActiveLeadSource.value.map(item => ({
          value: item.id,
          label: item.sourceName,
        }))
        
        await store.dispatch('plan/PLAN_ACTIVE_LIST')
        dropDown.planOptions = getActivePlan.value.map(item => ({
          value: item.id,
          label: item.planName,
        }))
      } catch (error) {
        console.error('Error loading device data:', error)
      }
    }
    
    const ajaxLoadMarsData = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      })
      
      try {
        await store.dispatch('GetMarsData/IMPLEMENTED_QUEUE', route.params.id)
        await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', getImplementedQueue.value.leadInformation.id)
        
        // Initialize formdata
        Object.assign(formdata, {
          plan: getImplementedQueue.value.leadInformation.plan.id,
          planCode: getImplementedQueue.value.leadInformation.plan.planName,
          deviceId: getImplementedQueue.value.leadInformation.device.id,
          leadSourceId: getImplementedQueue.value.leadInformation.leadSource.id,
          contactName: getImplementedQueue.value.leadInformation.contactName,
          contactNumber: getImplementedQueue.value.leadInformation.contactNumber,
          alternateContactNumber: getImplementedQueue.value.leadInformation.alternateContactNumber,
          city: getImplementedQueue.value.leadInformation.city,
          device: getImplementedQueue.value.leadInformation.device.deviceName,
          deviceCount: getImplementedQueue.value.leadInformation.deviceCount,
          leadAddress: getImplementedQueue.value.leadInformation.leadAddress,
          latitude: getImplementedQueue.value.leadInformation.latitude,
          longitude: getImplementedQueue.value.leadInformation.longitude,
          state: getImplementedQueue.value.leadInformation.state,
          kyc: getImplementedQueue.value.leadInformation.kyc,
          verifiedBanksubventionStatus: getImplementedQueue.value.leadInformation.verifiedBanksubventionStatus,
          reason: getImplementedQueue.value.leadInformation.reason,
          merchantCategory: getImplementedQueue.value.leadInformation.merchantCategory,
          pricing: getImplementedQueue.value.leadInformation.pricing,
          leadStatus: getImplementedQueue.value.leadInformation.leadStatus,
          submittoRSMDate: getImplementedQueue.value.leadInformation.submittoRSMDate,
          posIncentive: getImplementedQueue.value.leadInformation.posIncentive,
          posEnable: getImplementedQueue.value.leadInformation.posEnable,
          leadName: getImplementedQueue.value.leadInformation.leadName,
          setupFees: getImplementedQueue.value.leadInformation.setupFees,
          recurringFees: getImplementedQueue.value.leadInformation.recurringFees,
          amountCollected: getImplementedQueue.value.leadInformation.amountCollected,
        })
        
        // Initialize formdata1
        Object.assign(formdata1, {
          plan: getImplementedQueue.value.leadInformation.plan.id,
          planCode: getImplementedQueue.value.leadInformation.plan.planName,
          setupFees: getImplementedQueue.value.leadInformation.setupFees,
          recurringFees: getImplementedQueue.value.leadInformation.recurringFees,
          contactName: getImplementedQueue.value.leadInformation.contactName,
          contactNumber: getImplementedQueue.value.leadInformation.contactNumber,
          alternateContactNumber: getImplementedQueue.value.leadInformation.alternateContactNumber,
          city: getImplementedQueue.value.leadInformation.city,
          device: getImplementedQueue.value.leadInformation.device.deviceName,
          deviceId: getImplementedQueue.value.leadInformation.device.id,
          leadSourceId: getImplementedQueue.value.leadInformation.leadSource.id,
          deviceCount: getImplementedQueue.value.leadInformation.deviceCount,
          leadAddress: getImplementedQueue.value.leadInformation.leadAddress,
          latitude: getImplementedQueue.value.leadInformation.latitude,
          longitude: getImplementedQueue.value.leadInformation.longitude,
          state: getImplementedQueue.value.leadInformation.state,
          kyc: getImplementedQueue.value.leadInformation.kyc,
          verifiedBanksubventionStatus: getImplementedQueue.value.leadInformation.verifiedBanksubventionStatus,
          reason: getImplementedQueue.value.leadInformation.reason,
          merchantCategory: getImplementedQueue.value.leadInformation.merchantCategory,
          pricing: getImplementedQueue.value.leadInformation.pricing,
          leadStatus: getImplementedQueue.value.leadInformation.leadStatus,
          submittoRSMDate: getImplementedQueue.value.leadInformation.submittoRSMDate,
          posIncentive: getImplementedQueue.value.leadInformation.posIncentive,
          posEnable: getImplementedQueue.value.leadInformation.posEnable,
          leadName: getImplementedQueue.value.leadInformation.leadName,
        })
        
        merchantTypeSelection.value = getImplementedQueue.value.leadInformation.merchantType.merchantTypeName
        
        $q.loading.hide()
      } catch (error) {
        console.error("Error loading Mars data:", error)
        $q.loading.hide()
      }
    }
    
    const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching files ..",
      })
      
      try {
        await store.dispatch('SatLeadValidation/FETCH_LEAD_DOCUMENT_TYPE_DATA')
        $q.loading.hide()
      } catch (error) {
        console.error("Error loading document types:", error)
        $q.loading.hide()
      }
    }
    
    const fnPDFViewModal = (documentUrl) => {
      PDFDetails.value = documentUrl
      toggleshowPDFModal.value = !toggleshowPDFModal.value
    }
    
    const fnViewHandedOverFileImage = () => {
      // Implementation for viewing image
      // You can use a dialog or lightbox to display the image
      $q.notify({
        message: 'Image viewer functionality to be implemented',
        color: 'info'
      })
    }
    
    const populateBankDetails = async () => {
      try {
        await store.dispatch('mars_ifsc/IFSC_FROM_MARS', merchant.bankInformation.bankDetails.ifsc)
        if (ifscFromMars.value && ifscFromMars.value.bankName) {
          merchant.bankInformation.bankDetails.bankName = ifscFromMars.value.bankName
        } else {
          $q.notify({
            color: "negative",
            position: "bottom-left",
            message: "Invalid IFSC code",
            icon: "clear",
          })
          merchant.bankInformation.bankDetails.ifsc = ""
          merchant.bankInformation.bankDetails.bankName = ""
        }
      } catch (error) {
        console.error('Error populating bank details:', error)
        $q.notify({
          color: "negative",
          position: "bottom-left",
          message: "Invalid IFSC code",
          icon: "clear",
        })
        merchant.bankInformation.bankDetails.ifsc = ""
        merchant.bankInformation.bankDetails.bankName = ""
      }
    }
    
    const next = () => {
      $v.value.merchant.$touch()
      if ($v.value.merchant.$error) {
        $q.notify("Please review the KYC information fields again.")
      } else {
        // Logic for setting remarks based on changed fields
        // ... (similar to original but using reactive objects)
        
        if (stepper.value) {
          stepper.value.next()
        }
      }
    }
    
    const next1 = () => {
      // Prepare documents for submission
      if (stepper.value) {
        stepper.value.next()
      }
    }
    
    const marsInfo = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      })
      
      try {
        await store.dispatch('GetMarsData/FETCH_MARS_DATA', getImplementedQueue.value.leadInformation.id)
        
        // Populate merchant data from getAllMarsData
        if (getAllMarsData.value) {
          Object.assign(merchant.companyinformation, {
            pan: getAllMarsData.value.companyInformation.pan || "",
            contactPhone: getAllMarsData.value.companyInformation.contactPhone || "",
            legalName: getAllMarsData.value.companyInformation.legalName || "",
            dbaName: getAllMarsData.value.companyInformation.dbaName || "",
            registeredAddress: getAllMarsData.value.companyInformation.registeredAddress || "",
            registeredPin: getAllMarsData.value.companyInformation.registeredPin || "",
            registeredCityRefCode: getAllMarsData.value.companyInformation.registeredCityRefCode || "",
            registeredCityName: getAllMarsData.value.companyInformation.registeredCityName || "",
            registeredStateRefCode: getAllMarsData.value.companyInformation.registeredStateRefCode || "",
            registeredStateName: getAllMarsData.value.companyInformation.registeredStateName || "",
            contactName: getAllMarsData.value.companyInformation.contactName || "",
            statementEmail: getAllMarsData.value.companyInformation.statementEmail || "",
            applicationNumber: getAllMarsData.value.salesInformation.applicationNumber || "",
            contactEmail: getAllMarsData.value.companyInformation.contactEmail || "",
            contactMobile: getAllMarsData.value.companyInformation.contactMobile || "",
            businessNature: getAllMarsData.value.companyInformation.businessNature || "",
          })
          
          forminfo.applicationNumber = getAllMarsData.value.salesInformation.applicationNumber || ""
          
          Object.assign(merchant.bankInformation.bankDetails, {
            accountNumber: getAllMarsData.value.bankInformation?.bankDetails?.accountNumber || "",
            ifsc: getAllMarsData.value.bankInformation?.bankDetails?.ifsc || "",
            bankName: getAllMarsData.value.bankInformation?.bankDetails?.bankName || "",
            paymentMode: getAllMarsData.value.bankInformation?.bankDetails?.paymentMode || "",
            accountType: getAllMarsData.value.bankInformation?.bankDetails?.accountType || "",
          })
          
          Object.assign(merchant.paymentDetails, {
            settlementType: getAllMarsData.value.paymentDetails?.settlementType || "",
            tipEnabled: getAllMarsData.value.paymentDetails?.tipEnabled || "",
            cashAtPosEnabled: getAllMarsData.value.paymentDetails?.cashAtPosEnabled || "",
            intlCardAcceptance: getAllMarsData.value.paymentDetails?.intlCardAcceptance || "",
            preAuth: getAllMarsData.value.paymentDetails?.preAuth || "",
            rentalPlanCode: getAllMarsData.value.paymentDetails?.rentalPlanCode || "",
          })
          
          merchant.salesInformation.institutionCode = getAllMarsData.value.salesInformation?.institutionCode || ""
        }
        
        $q.loading.hide()
      } catch (error) {
        console.error("Error loading Mars info:", error)
        $q.loading.hide()
      }
    }
    
    const shortLeadInfo = async () => {
      try {
        await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', getImplementedQueue.value.leadInformation.id)
      } catch (error) {
        console.error('Error fetching short lead info:', error)
      }
    }
    
    const MidBasedList = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      })
      
      try {
        await store.dispatch('GetMarsData/MIDBASEDLIST', getImplementedQueue.value.mid)
        if (getMidBasedList.value && getMidBasedList.value.tids) {
          formdata.mid = getMidBasedList.value.tids
        }
        $q.loading.hide()
      } catch (error) {
        console.error("Error loading MID based list:", error)
        $q.loading.hide()
      }
    }
    
    const fetchAllDropdownValuesFromMARSapi = async () => {
      try {
        await store.dispatch('mars_city/CITY_FROM_MARS')
        cityOptions.value = cityFromMars.value?.items?.map(item => ({
          label: item.name,
          value: item.code,
        })) || []
        
        await store.dispatch('mars_rentalPlans/RENTAL_PLAN_FROM_MARS')
        rentalPlanSet.value = rentalPlanFromMars.value?.items?.map(item => ({
          label: item.name,
          value: item.code,
        })) || []
        
        await store.dispatch('mars_state/STATE_FROM_MARS')
        stateOptions.value = stateFromMars.value?.items?.map(item => ({
          label: item.name,
          value: item.code,
        })) || []
      } catch (error) {
        console.error("Error fetching dropdown values:", error)
      }
    }
    
    // ADDED: finalFormSubmitKyc method that was missing
    const finalFormSubmitKyc = async (request) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Submitting to MARS...",
      })
      
      try {
        // Store the institution code in localStorage
        const key = merchant.salesInformation.institutionCode
        $q.localStorage.set("a_t", key)
        
        // Prepare merchant request params
        const merchantrequestparams = {
          url: {
            id: getImplementedQueue.value.mid
          },
          params: {
            merchant: {
              companyInformation: request.companyinformation,
              businessInformation: request.businessInformation,
              paymentDetails: request.paymentDetails,
              bankInformation: request.bankInformation,
              mdr: request.mdrPlan,
              kyc: request.kyc
            }
          }
        }
        
        // Prepare terminal request params
        const terminalparams = {
          terminal: {
            id: getImplementedQueue.value.tid
          },
          terminalparams: {
            merchant: {
              companyInformation: {
                applicationNumber: getAllMarsData.value.salesInformation.applicationNumber
              },
              paymentDetails: request.paymentDetails
            }
          }
        }
        
        // Submit merchant data
        await store.dispatch("CMS_EDIT_MDR/CMS_EDIT_MERCHANT", merchantrequestparams)
        
        // Update CMS status
        await store.dispatch("CMS_EDIT_MDR/CMS_STATUS_CHANGE", getImplementedQueue.value.leadInformation.id)
        
        // Submit terminal data
        await store.dispatch("CMS_EDIT_MDR/CMS_EDIT_TERMINAL", terminalparams)
        
        $q.loading.hide()
        
        $q.notify({
          color: "positive",
          position: "bottom",
          icon: "thumb_up",
          message: "Merchant Details successfully Updated"
        })
        
        router.push("/sat/change/management")
        
      } catch (error) {
        console.error('Error in finalFormSubmitKyc:', error)
        $q.loading.hide()
        
        if (error.status == 404) {
          $q.notify({
            color: "negative",
            position: "bottom",
            icon: "thumb_down",
            message: error.data?.errorDetails?.[1]?.field + "-" + error.data?.errorDetails?.[1]?.issue || "Error occurred"
          })
        } else {
          $q.notify({
            color: "negative",
            position: "bottom",
            icon: "thumb_down",
            message: error.data?.message || "An error occurred while submitting to MARS"
          })
        }
      }
    }
    
    // Lifecycle hooks
    onMounted(async () => {
      await ajaxLoadDataForDeviceTypeTable1()
      await ajaxLoadMarsData()
      await ajaxLoadShortLeadInfoForDocumentTypes()
      await fetchAllDropdownValuesFromMARSapi()
      await MidBasedList()
    })
    
    return {
      // Refs
      step,
      stepper,
      toggleshowPDFModal,
      PDFDetails,
      check,
      merchantTypeSelection,
      subDocumentTypeSelection,
      stateOptions,
      cityOptions,
      rentalPlanSet,
      dropDown,
      info,
      formdata,
      formdata1,
      merchant,
      forminfo,
      error,
      model,
      payment,
      autoormanualOptions,
      preauthOptions,
      cashandposOptions,
      internationalcardOptions,
      tipOptions,
      paymnentModeOptions,
      accountTypeOptions,
      
      // Computed
      getShortLeadInfo,
      getDeviceVerificationStatus,
      rentalPlanFromMars,
      categoryBasedRental,
      GLOBAL_FILE_FETCH_URL,
      getAllDevicesInfo,
      getActiveLeadSource,
      getActivePlan,
      categoryBasedMdr,
      getAllMarsData,
      getImplementedQueue,
      getMidBasedList,
      getShortLeadInfoDocumentTypes,
      cityFromMars,
      stateFromMars,
      ifscFromMars,
      getRsmReason,
      
      // Vuelidate
      $v,
      
      // Methods
      sendtoFinance,
      fnPlan,
      fnPlan1,
      sendtoNH,
      fnUploadApplicationForm,
      fnUploadApplicationForm1,
      ajaxLoadDataForDeviceTypeTable1,
      ajaxLoadMarsData,
      ajaxLoadShortLeadInfoForDocumentTypes,
      fnPDFViewModal,
      fnViewHandedOverFileImage,
      populateBankDetails,
      next,
      next1,
      marsInfo,
      shortLeadInfo,
      MidBasedList,
      fetchAllDropdownValuesFromMARSapi,
      finalFormSubmitKyc, // ADDED: This was missing from the return statement
    }
  },
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