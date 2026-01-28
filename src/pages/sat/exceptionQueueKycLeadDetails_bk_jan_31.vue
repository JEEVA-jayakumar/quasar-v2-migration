<template>
  <q-page class="q-ma-md">
    <div class="row">
      <div class="col-6">
        <q-banner
          v-if="formData.shortLead.verifiedBanksubventionStatus == $VERIFIED_BANKSUBVENTION_STATUS_ATTACH_FILE_PENDING"
          class="bg-primary text-white q-mb-md"
          rounded
        >
          <template #avatar>
            <q-icon name="info" />
          </template>
          KYC & Bank subvention
          <template #subtitle>
            Status: Bank subvention verification pending
          </template>
        </q-banner>
        
        <q-banner
          v-if="formData.shortLead.verifiedPricingStatus == $VERIFIED_PRICING_STATUS_RSM_PENDING"
          class="bg-primary text-white q-mb-md"
          rounded
        >
          <template #avatar>
            <q-icon name="info" />
          </template>
          KYC & Pricing
          <template #subtitle>
            Status: RSM pricing verification pending
          </template>
        </q-banner>
      </div>
    </div>

    <!-- Merchant details -->
    <div class="row q-ma-xs">
      <div class="col">
        <div class="text-h6 q-my-md text-capitalize">{{ formData.shortLead.leadName }}</div>
        <div
          class="text-light-blue cursor-pointer"
          @click="toggleLeadInformation(formData.shortLead)"
        >
          # {{ formData.shortLead.id }}
        </div>
      </div>
      <div class="col">
        <div class="text-h6 q-my-md">Contact</div>
        <div class="no-margin">{{ formData.shortLead.contactNumber }}</div>
        <div>{{ formData.shortLead.alternateContactNumber }}</div>
      </div>
      <div class="col">
        <div class="text-h6 q-my-md">Address</div>
        <div class="capitalize no-margin">{{ formData.shortLead.leadAddress }}</div>
        <div
          class="capitalize no-margin"
        >
          {{ formData.shortLead.city }}, {{ formData.shortLead.state }}
        </div>
      </div>
    </div>

    <!-- Device, Exception, Payment, MDR and Documents -->
    <div class="row">
      <div class="col-md-6">
        <div class="flex column">
          <!-- Device -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <div class="row items-center">
                  <div class="col text-body1 text-weight-medium">
                    Device -
                    {{ formData.shortLead.deviceCount }}
                    {{ formData.shortLead.device.deviceName }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list separator class="no-padding text-body1">
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Plan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ formData.shortLead.plan.planName }}
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Setup Fees</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      Rs. {{ formData.shortLead.setupFees }}
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Recurring Fees</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      Rs. {{ formData.shortLead.recurringFees }}
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Merchant Category</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ formData.shortLead.merchantCategory.merchantCategoryName }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Payment -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <div class="row items-center">
                  <div class="col-auto text-body1 text-weight-medium">Payment</div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list separator class="no-padding">
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label class="text-body1">Mode of payment</q-item-label>
                    </q-item-section>
                    <q-item-section side class="text-body1">
                      <span
                        class="text-body1"
                        v-if="formData.shortLead.paymentOption == 1"
                      >
                        IMPS/NEFT
                      </span>
                      <span
                        class="text-body1"
                        v-else-if="formData.shortLead.paymentOption == 2"
                      >
                        Cheque
                      </span>
                      <span
                        class="text-body1"
                        v-else-if="formData.shortLead.paymentOption == 3"
                      >
                        Swipe
                      </span>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label class="text-body1">Reference No</q-item-label>
                    </q-item-section>
                    <q-item-section side class="text-body1">
                      {{ formData.shortLead.referenceNumber == '' ? 'NA' : formData.shortLead.referenceNumber }}
                    </q-item-section>
                  </q-item>
                  <q-item v-if="formData.shortLead.paymentOption == 2">
                    <q-item-section>
                      <div
                        v-if="formData.shortLead.paymentDocumentMimeType != null && formData.shortLead.paymentDocumentMimeType.includes('pdf')"
                      >
                        <q-btn
                          size="sm"
                          :outline="!showOpenPaymentChequeDocumentInfo"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile,'CHEQUE')"
                        />
                      </div>
                      <div
                        v-else-if="formData.shortLead.paymentDocumentMimeType != null && formData.shortLead.paymentDocumentMimeType.includes('image')"
                      >
                        <q-btn
                          :outline="!showOpenPaymentChequeInfo"
                          size="sm"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnOpenPaymentChequeInfo"
                        />
                      </div>
                      <div v-else class="text-grey-9">
                        <q-icon name="clear" color="negative" /> No document attached
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="showOpenPaymentChequeInfo">
                    <q-item-section>
                      <div class="cursor-pointer">
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                          style="max-width:100%"
                          @click="fnOpenPaymentChequeInfo"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- MDR -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <span class="text-body1 text-weight-medium">MDR</span>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list class="no-padding">
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Debit < 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        :model-value="formData.shortLead.debitLessthanAmount"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Debit < 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        :model-value="formData.shortLead.debitGreaterthanAmount"
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
                        :model-value="formData.shortLead.stdCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Premium CC (%)"
                        readonly
                        class="no-pointer-events"
                        :model-value="formData.shortLead.premiumCC"
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
                        :model-value="formData.shortLead.corpCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Intl Pre CC (%)"
                        readonly
                        class="no-pointer-events"
                        :model-value="formData.shortLead.intlCC"
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
                        :model-value="formData.shortLead.superPremiumlCC"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                    <q-item-section>
                      <q-checkbox
                        :model-value="formData.shortLead.posEnable"
                        class="no-pointer-events"
                        color="purple-9"
                        label="Enable Cash@POS Cash @POS incentive Rs.5"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="flex column">
          <!-- Exception -->
          <div class="full-width">
            <div v-if="formData.shortLead.leadCategory == 2">
              <q-card v-if="formData.shortLead.kyc" class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">Exception KYC</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-md-3 col-sm-12 col-xs-12">
                      <span class="text-caption text-faded">Reason</span>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
                      <span
                        class="text-caption text-faded"
                        v-if="formData.shortLead.reason == null"
                      >
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
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">Exception Bank Subvention</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-md-3 col-sm-12 col-xs-12">
                      <div class="text-caption text-faded">Reason</div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
                      <div
                        class="text-caption text-faded"
                        v-if="formData.shortLead.reason == null"
                      >
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
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">Exception Pricing</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-md-3 col-sm-12 col-xs-12">
                      <div class="text-caption text-faded">Reason</div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
                      <div class="text-caption text-faded">
                        {{ formData.shortLead.reason }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Documents proof -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1" flat>
              <q-card-section class="q-pa-sm title-bg bottom-border">
                <span class="text-body1 text-weight-medium">Document</span>
              </q-card-section>
              <q-card-section>
                <q-list class="no-padding">
                  <!-- START >> Component for handover to sat -->
                  <upload-lead-documents-component
                    v-if="formData.shortLead.documentUploadedType == 1 && formData.shortLead.leadCategory == 2"
                    class="full-width text-body1 no-padding"
                    :propGetShortLeadInfoDocumentTypes="getShortLeadInfoDocumentTypes"
                    :propMerchantTypeFromSO="getShortLeadInfo"
                    @emitTriggerComponentHotLoad="ajaxLoadShortLeadInfo"
                    @emitAjaxLoadShortLeadInfo="ajaxLoadShortLeadInfo"
                    @emitCookUpKYCdocumentsId="fnCookUpKYCmarkedDocumentsId"
                  />
                  <!-- END >> Component for handover to sat -->
                  <!-- START >> Component for Full document upload -->
                  <view-lead-documents-component
                    v-else
                    @emitTriggerComponentHotLoad="ajaxLoadShortLeadInfo"
                    :propLeadDocumentInformation="formData.shortLead.leadDocuments"
                    :propGetShortInfo="formData.shortLead"
                  />
                  <!-- END >> Component for Full document upload -->
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons - Cancel, Approve, Reject -->
    <div class="flex q-mt-md">
      <div class="col-md-12" align="right">
        <!-- START >> Buttons - Cancel -->
        <q-btn
          icon="block"
          color="grey-5"
          class="q-ma-sm text-dark"
          :to="'/sat/lead/validation'"
          label="Cancel"
        />
        <!-- END >> Buttons - Cancel -->
        <!-- START >> Buttons - Send to operations head -->
        <q-btn
          icon="check"
          color="positive"
          class="q-ma-sm"
          @click="fnApproveLeadData(getShortLeadInfo)"
          label="Send to OPS Head"
        />
        <!-- END >> Buttons - Send to operations head -->
        <!-- START >> Buttons - Reject if any document is rejected -->
        <q-btn
          :disable="!fnCheckIfAnyDocumentIsRejected"
          icon="clear"
          class="q-ma-sm"
          color="negative"
          label="Reject"
          @click="fnToggleRejectLeadComp"
        />
        <!-- END >> Buttons - Reject if any document is rejected -->
      </div>
    </div>

    <!-- START >> COMPONENT: View PDF  -->
    <show-pdf-modal-component
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
    <!-- END >> COMPONENT: View PDF -->
    
    <!-- START >> COMPONENT: Final approval -->
    <show-approve-remarks-component
      v-if="toggleApproveLeadModal"
      :propToggleLeadModal="toggleApproveLeadModal"
      :propLeadDetails="getShortLeadInfo"
      :propDocumentIds="merchantDocumentIds"
      @toggleLeadModal="fnApproveLeadData"
    />
    <!-- END >> COMPONENT: Final approval -->
    
    <!-- START >> COMPONENT: Final reject -->
    <show-reject-lead-reject-component
      v-if="toggleLeadRejectModal"
      :propToggleLeadModal="toggleLeadRejectModal"
      :propLeadDetails="getShortLeadInfo"
      @toggleLeadModal="fnToggleRejectLeadComp"
    />
    <!-- END >> COMPONENT: Final reject -->
    
    <!-- //Common lead information in popup -->
    <general-lead-information
      v-if="propToggleLeadInformation"
      :propLeadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35"/>
    </div>
    <!--END >>  Show Ajax Spinner -->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { filter } from 'lodash';

import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import showApproveRemarksComponent from "../../components/sat/showApproveRemarksComponent.vue";
import showRejectLeadRejectComponent from "../../components/sat/showRejectLeadRejectComponent.vue";

/* For documents view or upload */
import uploadLeadDocumentsComponent from "../../components/sat/uploadExceptionLeadDocumentsComponent.vue";
import viewLeadDocumentsComponent from "../../components/sat/viewExceptionLeadDocumentsComponent.vue";
/* For documents view or upload */

import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default defineComponent({
  name: "exceptionQueueKycLeadDetails",
  
  components: {
    showApproveRemarksComponent,
    showRejectLeadRejectComponent,
    showPdfModalComponent,
    uploadLeadDocumentsComponent,
    viewLeadDocumentsComponent,
    generalLeadInformation
  },

  setup() {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();

    // Refs
    const sample = ref([]);
    const merchantDocumentIds = ref([]);
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const isAllDocumentsUploaded = ref(false);
    const showOpenPaymentChequeInfo = ref(false);
    const showOpenPaymentChequeDocumentInfo = ref(false);
    const toggleshowPDFModal = ref(false);
    const PDFDetails = ref(null);
    const merchantTypeSelection = ref(0);
    const subDocumentTypeSelection = ref(0);
    const select = ref("");
    const toggleApproveLeadModal = ref(false);
    const toggleLeadRejectModal = ref(false);
    const showProceedToDataEntryButton = ref(false);
    const toggleAjaxLoadFilter = ref(false);
    const toggleChequeImageResult = ref(false);
    const toggleDocumentLeadRejectModal = ref(false);
    const checked = ref(false);
    const thumbnailsHorizontal = ref(false);
    const leadRejectReason = ref("");

    const formData = ref({
      shortLead: "",
      documentType: []
    });

    // Computed properties
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);
    
    const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo']);
    
    const getShortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes']);

    // toggle function to check if any documents are rejected
    const fnCheckIfAnyDocumentIsRejected = computed(() => {
      if (!getShortLeadInfo.value?.leadDocuments) return false;
      
      let dummyArr = [];
      const documents = getShortLeadInfo.value.leadDocuments;
      
      // Function to check if any of the document is rejected
      for (const key in documents) {
        const returnSubValue = filter(documents[key], (subValue) => {
          return subValue.documentVerifiedStatus == 3;
        });
        
        if (returnSubValue.length > 0) {
          dummyArr.push(returnSubValue);
        }
      }
      
      // If yes, then throw an alert
      return dummyArr.length > 0;
    });

    // Methods
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    const ajaxLoadShortLeadInfo = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      
      try {
        const leadId = router.currentRoute.value.params.id;
        await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', leadId);
        formData.value.shortLead = getShortLeadInfo.value;
      } catch (error) {

        console.error('Error loading lead info:', error);
        $q.notify({
          color: 'negative',
          message: 'Failed to load lead information'
        });
      } finally {
        $q.loading.hide();
        toggleAjaxLoadFilter.value = false;
      }
    };

    const fnCookUpKYCmarkedDocumentsId = (cookedDocumentArr) => {
      merchantDocumentIds.value = cookedDocumentArr;
    };

    const fnApproveLeadData = () => {
      if (!getShortLeadInfo.value) return;
      
      if (
        getShortLeadInfo.value.documentUploadedType == 1
      ) {
        // START >> Operation for handed over to SAT flow
        const innerSelfLeadDocument = getShortLeadInfo.value.leadDocuments;
        const finalAssumeArr = [];
        
        // END >> Operation for handed over to SAT flow
        // START >> Traverse through single document upload array
        if (getShortLeadInfoDocumentTypes.value?.uploadedDocuments?.forSingleDocument) {
          getShortLeadInfoDocumentTypes.value.uploadedDocuments.forSingleDocument.forEach((o) => {
            o.documents.forEach((io) => {
              if (!io.isKycChecked) {
                // FIXED: Use Object.prototype.hasOwnProperty.call() instead of .hasOwnProperty()
                if (Object.prototype.hasOwnProperty.call(innerSelfLeadDocument, io.documentType)) {
                  innerSelfLeadDocument[io.documentType].forEach((oo) => {
                    if (
                      (oo.uploadedDocuments.length == 0 &&
                        String(oo.subDocumentType) == String(io.subDocumentType)) ||
                      (oo.documentVerifiedStatus == 3 &&
                        String(oo.subDocumentType) == String(io.subDocumentType))
                    ) {
                      oo.viewType = 1;
                      finalAssumeArr.push(oo);
                    }
                  });
                } else {
                  io.viewType = 1;
                  finalAssumeArr.push(io);
                }
              }
            });
          });
        }
        // END >> Traverse through single document upload array
        // START >> Traverse through multiple document upload array
        if (getShortLeadInfoDocumentTypes.value?.uploadedDocuments?.forMutipleDocument) {
          getShortLeadInfoDocumentTypes.value.uploadedDocuments.forMutipleDocument.forEach((o) => {
            if (!o.isKycChecked) {
              // FIXED: Use Object.prototype.hasOwnProperty.call() instead of .hasOwnProperty()
              if (Object.prototype.hasOwnProperty.call(innerSelfLeadDocument, o.documentType)) {
                innerSelfLeadDocument[o.documentType].forEach((oo) => {
                  o.documents.forEach((coo) => {
                    if (
                      (oo.uploadedDocuments.length == 0 &&
                        String(oo.subDocumentType) == String(coo.subDocumentType)) ||
                      (coo.documentVerifiedStatus == 3 &&
                        String(oo.subDocumentType) == String(coo.subDocumentType))
                    ) {
                      oo.viewType = 0;
                      finalAssumeArr.push(oo);
                    }
                  });
                });
              } else {
                o.viewType = 0;
                finalAssumeArr.push(o);
              }
            }
          });
        }
        // END >> Traverse through multiple document upload array
        // START >> Get array size and throw all errors
        if (finalAssumeArr.length > 0) {
          $q.notify({
            color: "amber-9",
            position: "bottom",
            timeout: 3000,
            message:
              finalAssumeArr[0].subDocumentType == undefined
                ? finalAssumeArr[0].documentType
                : finalAssumeArr[0].viewType == 0
                ? finalAssumeArr[0].documentType
                : finalAssumeArr[0].subDocumentType + " is mandatory",
            icon: "warning"
          });
        } else {
          toggleApproveLeadModal.value = !toggleApproveLeadModal.value;
        }
        // END >> Get array size and throw all errors
      } else {
        let dummyArr_rejection = [];
        let dummyArr_pending = [];
        const documents = getShortLeadInfo.value.leadDocuments;
        
        // Function to check if any of the document is rejected
        for (const key in documents) {
          // START>> Function to get all rejected documents count
          const returnSubValue_rejection = filter(documents[key], (subValue) => {
            return subValue.documentVerifiedStatus == 3;
          });
          if (returnSubValue_rejection.length > 0) {
            dummyArr_rejection.push(returnSubValue_rejection);
          }
          // END>> Function to get all rejected documents count
          // START>> Function to get pending document count
          const returnSubValue_pending = filter(documents[key], (subValue) => {
            return (
              subValue.documentVerifiedStatus == 2 && !subValue.kycException
            );
          });
          if (returnSubValue_pending.length > 0) {
            dummyArr_pending.push(returnSubValue_pending);
          }
          // END>> Function to get pending document count
        }
        // If yes, then throw an alert
        if (dummyArr_rejection.length > 0) {
          $q.notify({
            color: "amber-9",
            position: "bottom",
            message:
              "Some document(s) are rejected. You can only reject this lead",
            icon: "warning"
          });
        } else if (dummyArr_pending.length > 0) {
          $q.notify({
            color: "amber-9",
            position: "bottom",
            message: "Some document(s) are pending for approval",
            icon: "warning"
          });
        } else {
          toggleApproveLeadModal.value = !toggleApproveLeadModal.value;
        }
      }
    };

    const fnToggleRejectLeadComp = () => {
      toggleLeadRejectModal.value = !toggleLeadRejectModal.value;
    };

    const fnOpenPaymentChequeInfo = () => {
      showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
    };

    const fnPDFViewModal = (documentUrl, viewChequeFlag) => {
      if (viewChequeFlag == "CHEQUE") {
        showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
      }
      PDFDetails.value = documentUrl;
      toggleshowPDFModal.value = !toggleshowPDFModal.value;
    };

    // Route guard using Vue 3 Composition API
    onBeforeRouteLeave((to) => {
      if (to.name == "exceptionQueue") {
        return true;
      } else {
        const answer = window.confirm(
          "Do you really want to leave? you have unsaved changes!"
        );
        return answer;
      }
    });

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadShortLeadInfo();
    });

    onBeforeUnmount(() => {
      // Cleanup if needed
    });

    return {
      // Refs
      sample,
      merchantDocumentIds,
      propToggleLeadInformation,
      addtnLeadInformation,
      isAllDocumentsUploaded,
      showOpenPaymentChequeInfo,
      showOpenPaymentChequeDocumentInfo,
      toggleshowPDFModal,
      PDFDetails,
      merchantTypeSelection,
      subDocumentTypeSelection,
      select,
      toggleApproveLeadModal,
      toggleLeadRejectModal,
      showProceedToDataEntryButton,
      toggleAjaxLoadFilter,
      toggleChequeImageResult,
      toggleDocumentLeadRejectModal,
      checked,
      thumbnailsHorizontal,
      leadRejectReason,
      formData,
      
      // Computed
      GLOBAL_FILE_FETCH_URL,
      getShortLeadInfo,
      getShortLeadInfoDocumentTypes,
      fnCheckIfAnyDocumentIsRejected,
      
      // Methods
      toggleLeadInformation,
      ajaxLoadShortLeadInfo,
      fnCookUpKYCmarkedDocumentsId,
      fnApproveLeadData,
      fnToggleRejectLeadComp,
      fnOpenPaymentChequeInfo,
      fnPDFViewModal
    };
  }
});
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

.text-caption {
  font-size: 0.75rem;
}

.text-body1 {
  font-size: 1rem;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>