<template>
  <q-page class="q-pa-md">
    <div class="q-ma-md">
      <!-- Merchant details -->
      <div class="row q-ma-xs">
        <div class="col-6 col-lg-3">
          <div class="text-h5 q-my-md capitalize">{{ formData.shortLead.leadName }}</div>
          <div
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.shortLead.leadNumber }}
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="text-h5 q-my-md">Contact</div>
          <div class="no-margin">{{ formData.shortLead.contactNumber }}</div>
          <div>{{ formData.shortLead.alternateContactNumber }}</div>
        </div>
        <div class="col-12 col-lg-3">
          <div class="text-h5 q-my-md">Address</div>
          <div class="capitalize no-margin">{{ formData.shortLead.leadAddress }}</div>
          <div class="capitalize no-margin">
            {{ formData.shortLead.city }}, {{ formData.shortLead.state }}
          </div>
        </div>
        <div class="col-12 col-lg-3">
          <div class="text-h5 q-my-md">Remarks</div>
          <div
            class="capitalize no-margin text-negative"
            v-if="formData.shortLead.marsReason"
          >
            {{ formData.shortLead.marsReason }}
          </div>
          <div v-else>No Remarks</div>
        </div>
      </div>

      <!-- Device, Exception, Payment, MDR and Documents -->
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <!-- Device -->
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">
                      Device -
                      {{ formData.shortLead.deviceCount }}
                      {{ formData.shortLead.device?.deviceName }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>Plan</q-item-section>
                      <q-item-section side>{{ formData.shortLead.plan?.planName }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>Setup Fees</q-item-section>
                      <q-item-section side v-if="getShortLeadInfo.leadSource?.id === 114">
                        Rs. {{ formData.shortLead.setUpFeeAppliedAmount }}
                      </q-item-section>
                      <q-item-section side v-else>
                        Rs. {{ formData.shortLead.setupFees }}
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>Recurring Fees</q-item-section>
                      <q-item-section side v-if="getShortLeadInfo.leadSource?.id === 114">
                        Rs. {{ formData.shortLead.recurringFeeAppliedAmount }}
                      </q-item-section>
                      <q-item-section side v-else>
                        Rs. {{ formData.shortLead.recurringFees }}
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>Merchant Category</q-item-section>
                      <q-item-section side>
                        {{ formData.shortLead.merchantCategory?.merchantCategoryName }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Payment -->
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">
                      Payment -
                      <span v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</span>
                      <span v-if="formData.shortLead.paymentOption == 2">Cheque</span>
                      <span v-if="formData.shortLead.paymentOption == 3">Swipe</span>
                      <span v-if="formData.shortLead.paymentOption == 4">UPI Link</span>
                    </div>
                    <div v-if="getShortLeadInfo.leadSource?.id != 81" class="col text-body1 text-positive" align="right">
                      Approved by
                      <span class="capitalize">{{ fnGetVerifiedPerson() }}</span> (Finance)
                    </div>
                    <div v-else class="col text-body1 text-positive" align="right">
                      Approved by
                      <span class="capitalize"></span> (Default)
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding">
                    <q-item class="q-pa-sm">
                      <q-item-section class="text-body1">Mode of payment</q-item-section>
                      <q-item-section side class="text-body1">
                        <span v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</span>
                        <span v-else-if="formData.shortLead.paymentOption == 2">Cheque</span>
                        <span v-else-if="formData.shortLead.paymentOption == 3">Swipe</span>
                        <span v-else-if="formData.shortLead.paymentOption == 4">UPI Link</span>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section class="text-body1">Reference No</q-item-section>
                      <q-item-section side class="text-body1">
                        {{ formData.shortLead.referenceNumber || 'NA' }}
                      </q-item-section>
                    </q-item>
                    <q-item v-if="formData.shortLead.paymentOption == 2">
                      <div v-if="formData.shortLead.paymentDocumentMimeType?.includes('pdf')">
                        <q-btn
                          size="sm"
                          :outline="!showOpenPaymentChequeDocumentInfo"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile)"
                        />
                      </div>
                      <div v-else-if="formData.shortLead.paymentDocumentMimeType?.includes('image')">
                        <q-btn
                          :outline="!showOpenPaymentChequeInfo"
                          size="sm"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnOpenPaymentChequeInfo()"
                        />
                      </div>
                      <div v-else class="text-grey-9">
                        <q-icon name="clear" color="negative" />No document attached
                      </div>
                    </q-item>
                    <q-item v-if="showOpenPaymentChequeInfo && formData.shortLead.paymentDocumentFile">
                      <img
                        :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                        style="max-width:100%"
                        @error="handleImageError"
                        class="cursor-pointer"
                        @click="openImageModal(GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile)"
                      />
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- MDR -->
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <span class="text-body1 text-weight-medium">MDR</span>
                  <span class="text-body1 text-positive float-right" v-if="getShortLeadInfo.pricing">
                    Approved by
                    <span class="capitalize">{{ fnGetVerifiedRSMPerson()?.createdBy?.name }}</span>
                    ({{ fnGetVerifiedRSMPerson()?.role?.role }})
                  </span>
                </q-card-section>
                <q-card-section>
                  <q-list class="no-padding">
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Debit <= 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelLesserThan"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Debit > 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelGreaterThan"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Std CC (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelStdCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Premium CC (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelPremiumCC"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Corp Pre CC (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelCorpCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Intl Pre CC (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelIntlCC"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Super Pre CC (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="debitModelSuperPremiumCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Upi Debit Card UpTo 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="upiDebitCardUpTo2000"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Upi Debit Card Above 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="upiDebitCardAbove2000"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Upi Prepaid Credit Cards UpTo 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="upiPrepaidCreditCardsUpTo2000"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Upi Prepaid Credit Cards Above 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="upiPrepaidCreditCardsAbove2000"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                      <q-checkbox
                        :model-value="formData.shortLead.posEnable"
                        class="no-pointer-events"
                        color="purple-9"
                      >
                        <small class="text-caption">Enable Cash@POS Cash @POS incentive Rs.5</small>
                      </q-checkbox>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Comments -->
            <div v-if="getShortLeadInfo.leadSource?.id != 81" class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <span class="text-body1 text-weight-medium">Remarks</span>
                </q-card-section>
                <q-card-section>
                  <q-scroll-area
                    :style="formData.shortLead.leadVerificationStatus?.length > 4 ? 'width: 100%; height:400px;' : 'width: 100%; height:100px;'"
                  >
                    <q-list class="no-padding">
                      <q-item
                        dense
                        v-for="(item, index) in formData.shortLead.leadVerificationStatus || []"
                        :key="index"
                        class="q-pa-sm"
                      >
                        <q-item-section avatar>
                          <q-avatar color="purple-9" text-color="white">
                            {{ item.createdBy?.name?.charAt(0) || '?' }}
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ item.reason }}</q-item-label>
                          <q-item-label caption>{{ item.createdBy?.name }}</q-item-label>
                          <q-item-label caption>{{ item.fieldName }}</q-item-label>
                          <q-item-label caption>{{ formatDate(item.updatedAt) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </q-scroll-area>
                </q-card-section>
              </q-card>
            </div>
            <div v-else>
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <span class="text-body1 text-weight-medium">Remarks</span>
                </q-card-section>
                <q-card-section>default</q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <!-- Exception -->
            <div class="col-12">
              <div v-if="formData.shortLead.leadCategory == 2">
                <q-card v-if="formData.shortLead.kyc" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <span class="text-body1 text-weight-medium">Exception KYC</span>
                    <span class="text-body1 text-positive float-right" v-if="getShortLeadInfo.kyc">
                      Approved by
                      <span class="capitalize">{{ fnGetVerifiedOPHPerson() }}</span> (OPS HEAD)
                    </span>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <span class="text-caption text-faded">Reason</span>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <span class="text-caption text-faded" v-if="!formData.shortLead.reason">
                          Reason not specified
                        </span>
                        <span class="text-caption text-faded" v-else>
                          {{ formData.shortLead.reason }}
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card
                  v-if="formData.shortLead.bankSubvention"
                  class="q-ma-xs border-1 q-custom-class"
                  flat
                >
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <span class="text-body1 text-weight-medium">Exception Bank Subvention</span>
                    <span class="text-body1 text-positive float-right" v-if="getShortLeadInfo.bankSubvention">
                      Approved by
                      <span class="capitalize">{{ fnGetVerifiedFINANCEPerson() }}</span> (Finance)
                    </span>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded">Reason</div>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded" v-if="!formData.shortLead.reason">
                          Reason not specified
                        </div>
                        <div class="text-caption text-faded" v-else>
                          {{ formData.shortLead.reason }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card
                  v-if="formData.shortLead.pricing"
                  class="q-ma-xs border-1 q-custom-class"
                  flat
                >
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <span class="text-body1 text-weight-medium">Exception Pricing</span>
                    <span class="text-body1 text-positive float-right" v-if="getShortLeadInfo.pricing">
                      Approved by
                      <span class="capitalize">{{ fnGetVerifiedRSMPerson()?.createdBy?.name }}</span>
                      ({{ fnGetVerifiedRSMPerson()?.role?.role }})
                    </span>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded">Reason</div>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded">{{ formData.shortLead.reason }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Documents proof -->
            <div class="col-12">
              <q-card class="q-ma-xs border-1" flat>
                <q-card-section class="q-pa-sm title-bg bottom-border">
                  <span class="text-body1 text-weight-medium">Document</span>
                  <span v-if="formData.shortLead.kyc" class="float-right text-body1 text-positive">
                    KYC Exception Case
                  </span>
                </q-card-section>
                <q-card-section class="no-padding">
                  <q-list class="no-padding">
                    <UploadLeadDocumentsComponent
                      v-if="formData.shortLead.documentUploadedType == 1 && !formData.shortLead.kyc"
                      class="full-width text-body1 no-padding"
                      :prop-get-short-lead-info-document-types="getShortLeadInfoDocumentTypes"
                      :prop-merchant-type-from-s-o="getShortLeadInfo"
                      @emit-trigger-component-hot-load="ajaxLoadShortLeadInfo"
                      @emit-ajax-load-short-lead-info="ajaxLoadShortLeadInfo"
                    />
                    <ViewLeadDocumentsComponent
                      v-else
                      @emit-trigger-component-hot-load="ajaxLoadShortLeadInfo"
                      :prop-lead-document-information="formData.shortLead.leadDocuments"
                      :prop-get-short-info="getShortLeadInfo"
                    />
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <!-- Final actions -->
      <div class="row">
        <div class="col-md-12" align="right">
          <q-btn
            icon="block"
            color="grey-5"
            class="q-ma-sm text-dark"
            @click="router.go(-1)"
            label="Cancel"
          />
          <q-btn
            icon="check"
            color="tertiary"
            class="q-ma-sm"
            @click="fnApproveLeadData(getShortLeadInfo)"
            label="Proceed to data entry"
          />
          <q-btn
            icon="clear"
            class="q-ma-sm"
            color="negative"
            label="REJECT"
            @click="fnToggleRejectLeadComp(getShortLeadInfo)"
          />
        </div>
      </div>

      <!-- START >> COMPONENT: Final reject -->
      <ShowFinalRejectLeadRemarksComponent
        v-if="toggleLeadRejectModal"
        :prop-toggle-lead-modal="toggleLeadRejectModal"
        :prop-lead-details="getShortLeadInfo"
        @toggle-lead-modal="fnToggleRejectLeadComp"
      />
      <!-- END >> COMPONENT: Final reject -->

      <!-- START >> Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
      <!-- END >> Show Ajax Spinner -->

      <!-- START >> COMPONENT: View PDF  -->
      <ShowPdfModalComponent
        v-if="toggleshowPDFModal"
        :prop-toggleshow-pdf-modal="toggleshowPDFModal"
        :prop-pdf-details="PDFDetails"
        @toggle-pdf-modal="fnPDFViewModal"
      />
      <!-- END >> COMPONENT: View PDF -->

      <!-- Common lead information in popup -->
      <GeneralLeadInformation
        v-if="propToggleLeadInformation"
        :lead-information="addtnLeadInformation"
        :prop-toggle-lead-information-pop="propToggleLeadInformation"
        @close-lead-information="toggleLeadInformation"
      />
    </div>

    <!-- Image Modal Dialog -->
    <q-dialog v-model="imageModal.show">
      <q-card>
        <q-card-section>
          <div class="text-h6">Image Preview</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <img :src="imageModal.src" style="max-width: 100%; max-height: 70vh" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { format } from 'date-fns'
import orderBy from 'lodash/orderBy'
import filter from 'lodash/filter'
import GeneralLeadInformation from '../../components/GeneralLeadInformation.vue'
import ShowPdfModalComponent from '../../components/sat/ShowPdfModalComponent.vue'
import ViewLeadDocumentsComponent from '../../components/sat/ViewLeadDocumentsComponent.vue'
import UploadLeadDocumentsComponent from '../../components/sat/UploadLeadDocumentsComponent.vue'
import ShowFinalRejectLeadRemarksComponent from '../../components/sat/ShowFinalRejectLeadRemarksComponent.vue'

const $q = useQuasar()
const store = useStore()
const router = useRouter()
const route = useRoute()

// Reactive state
const propToggleLeadInformation = ref(false)
const addtnLeadInformation = ref(null)
const showOpenPaymentChequeDocumentInfo = ref(false)
const PDFDetails = ref(null)
const toggleshowPDFModal = ref(false)
const toggleLeadRejectModal = ref(false)
const toggleAjaxLoadFilter = ref(false)
const showOpenPaymentChequeInfo = ref(false)
const imageModal = ref({
  show: false,
  src: ''
})

// Form data
const formData = ref({
  shortLead: {},
  documentType: []
})

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]
)

const getShortLeadInfo = computed(() => 
  store.getters["SatLeadValidation/getShortLeadInfo"]
)

const getShortLeadInfoDocumentTypes = computed(() => 
  store.getters["SatLeadValidation/getShortLeadInfoDocumentTypes"]
)

// MDR computed values
const debitModelLesserThan = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedDebitLessthanAmount
  } else {
    return formData.value.shortLead.debitLessthanAmount
  }
})

const debitModelGreaterThan = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedDebitGreaterthanAmount
  } else {
    return formData.value.shortLead.debitGreaterthanAmount
  }
})

const debitModelStdCC = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedStdCC
  } else {
    return formData.value.shortLead.stdCC
  }
})

const debitModelPremiumCC = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedPremiumCC
  } else {
    return formData.value.shortLead.premiumCC
  }
})

const debitModelCorpCC = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedCorpCC
  } else {
    return formData.value.shortLead.corpCC
  }
})

const debitModelIntlCC = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedIntlCC
  } else {
    return formData.value.shortLead.intlCC
  }
})

const debitModelSuperPremiumCC = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedSuperPremiumCC
  } else {
    return formData.value.shortLead.superPremiumlCC
  }
})

const upiDebitCardUpTo2000 = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedUpiDebitCardUpTo2000
  } else {
    return formData.value.shortLead.upiDebitCardUpTo2000
  }
})

const upiDebitCardAbove2000 = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedUpiDebitCardAbove2000
  } else {
    return formData.value.shortLead.upiDebitCardAbove2000
  }
})

const upiPrepaidCreditCardsUpTo2000 = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedUpiPrepaidCreditCardUpTo2000
  } else {
    return formData.value.shortLead.upiPrepaidCreditCardsUpTo2000
  }
})

const upiPrepaidCreditCardsAbove2000 = computed(() => {
  if (getShortLeadInfo.value.leadSource?.id === 114) {
    return formData.value.shortLead.appliedUpiPrepaidCreditCardAbove2000
  } else {
    return formData.value.shortLead.upiPrepaidCreditCardsAbove2000
  }
})

// Lifecycle
onMounted(() => {
  ajaxLoadShortLeadInfo()
})

// Route guard
onBeforeRouteLeave((to) => {
  if (to.name === "leadDataEntry" || to.name === "leadValidation" || to.path === "/404") {
    return true
  }
  
  const answer = window.confirm(
    "Do you really want to leave? you have unsaved changes!"
  )
  return answer
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return format(new Date(dateString), 'do MMM y')
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value
  if (leadDetails) {
    addtnLeadInformation.value = leadDetails
  }
}

const fnMoveToDataEntryScreen = () => {
  if (
    getShortLeadInfo.value.leadStatus === 'DATA_ENTRY_PENDING' ||
    getShortLeadInfo.value.leadStatus === 'MARS_REFERRAL_BACK_DATA_ENTRY_PENDING'
  ) {
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Redirecting to data entry screen",
      icon: "swap_horiz"
    })
    router.push(`/sat/lead/validation/${route.params.id}/data/entry`)
  }
}

const ajaxLoadShortLeadInfo = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  })
  
  try {
    await store.dispatch("SatLeadValidation/FETCH_SHORT_LEAD_DATA", route.params.id)
    formData.value.shortLead = { ...getShortLeadInfo.value }
    fnMoveToDataEntryScreen()
  } catch (error) {
    console.error("Error loading lead info:", error)
    $q.notify({
      color: "negative",
      message: "Failed to load lead information"
    })
  } finally {
    $q.loading.hide()
  }
}

const fnPDFViewModal = (documentUrl) => {
  showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value
  PDFDetails.value = documentUrl
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}

const fnOpenPaymentChequeInfo = () => {
  showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value
}

const openImageModal = (src) => {
  imageModal.value.src = src
  imageModal.value.show = true
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent) {
    parent.innerHTML = '<div class="text-negative">Failed to load image</div>'
  }
}

const fnApproveLeadData = async (leadInfo) => {
  const dialog = $q.dialog({
    title: "Confirm",
    message: "Are you sure want to proceed to data entry?",
    ok: {
      label: "Continue",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    }
  })

  try {
    await dialog
    
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Validating .."
    })
    
    // First verify documents
    await store.dispatch("SatLeadValidation/VERIFY_LEAD_DOCUMENTS", { 
      id: route.params.id, 
      params: [] 
    })
    
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    })
    
    // Then verify lead data
    const formData = {
      leadInformation: {
        fieldName: "Full Lead Information",
        reason: ""
      },
      leadId: leadInfo.id,
      defaultUrlValue: getShortLeadInfo.value.leadStatus === 'REFER_BACK'
        ? 'SAT_LEAD_VALIDATION_PROCEED_TO_DATA_ENTRY_WITH_REFERBACK'
        : 'SAT_LEAD_VALIDATION_APPROVE'
    }
    
    await store.dispatch("SatLeadValidation/VERIFY_LEAD_DATA", formData)
    
    $q.loading.hide()
    router.push(`/sat/lead/validation/${route.params.id}/data/entry/`)
    
  } catch (error) {
    $q.loading.hide()
    
    if (error?.data?.data?.toBeVerifiedDocuments?.length > 0) {
      const arrayMessage = error.data.data.toBeVerifiedDocuments.join(', ')
      $q.notify({
        color: "amber-9",
        position: "bottom-left",
        message: error.data.message || "Validation Error",
        caption: arrayMessage,
        timeout: 8000,
        icon: "warning",
        actions: [{ icon: "close" }]
      })
    } else if (error?.data?.data) {
      for (const key in error.data.data) {
        if (Array.isArray(error.data.data[key])) {
          const arrayMessage = error.data.data[key].join(', ')
          $q.notify({
            color: "amber-9",
            position: "bottom-left",
            message: `${error.data.message || "Validation Error"} for ${key}`,
            caption: arrayMessage,
            timeout: 8000,
            icon: "warning",
            actions: [{ icon: "close" }]
          })
        }
      }
    } else {
      $q.notify({
        color: "negative",
        message: "Failed to approve lead"
      })
    }
  }
}

const fnGetVerifiedPerson = () => {
  if (!formData.value.shortLead.leadVerificationStatus) return ''
  const sortedArr = orderBy(formData.value.shortLead.leadVerificationStatus, ["id"], ["desc"])
  const cookedArr = filter(sortedArr, {
    status: true,
    verificationType: 'VERIFICATION_TYPE_FINANCE'
  })
  return cookedArr[0]?.createdBy?.name || ''
}

const fnGetVerifiedFINANCEPerson = () => {
  if (!formData.value.shortLead.leadVerificationStatus) return ''
  const sortedArr = orderBy(formData.value.shortLead.leadVerificationStatus, ["id"], ["desc"])
  const cookedArr = filter(sortedArr, {
    status: true,
    verificationType: 'VERIFICATION_TYPE_FINANCE'
  })
  return cookedArr[0]?.createdBy?.name || ''
}

const fnGetVerifiedRSMPerson = () => {
  if (!formData.value.shortLead.leadVerificationStatus) return {}
  const sortedArr = orderBy(formData.value.shortLead.leadVerificationStatus, ["id"], ["desc"])
  const cookedArr = filter(sortedArr, {
    status: true,
    verificationType: 'VERIFICATION_TYPE_PRICING'
  })
  return cookedArr[0] || {}
}

const fnGetVerifiedOPHPerson = () => {
  if (!formData.value.shortLead.leadVerificationStatus) return ''
  const sortedArr = orderBy(formData.value.shortLead.leadVerificationStatus, ["id"], ["desc"])
  const cookedArr = filter(sortedArr, {
    status: true,
    verificationType: 'VERIFICATION_TYPE_KYC'
  })
  return cookedArr[0]?.createdBy?.name || ''
}
</script>

<style scoped>
.border-1 {
  border: 1px solid #c7c7c7;
}

.custom-z-index {
  z-index: 2;
}

.title-bg {
  background: #bbbbbb4a;
}

.no-underline {
  text-decoration: none;
  color: #222;
}

.no-underline:hover,
.no-underline:active,
.no-underline:focus {
  text-decoration: none;
  color: #027be3;
}

.customQuasarSelect {
  padding: 5px;
}

label {
  padding: 3px 8px;
  display: table;
}

input[type="file"] {
  display: none;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.capitalize {
  text-transform: capitalize;
}

.no-margin {
  margin: 0;
}

.float-right {
  float: right;
}
</style>