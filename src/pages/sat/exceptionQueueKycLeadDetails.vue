<template>
  <q-page>
    <div class="q-ma-md">
      <div class="row">
        <div class="col-6">
          <q-banner
            v-if="formData.shortLead.verifiedBanksubventionStatus == $VERIFIED_BANKSUBVENTION_STATUS_ATTACH_FILE_PENDING"
            class="bg-primary text-white q-mb-sm"
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
            class="bg-primary text-white q-mb-sm"
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
          <div class="q-title q-my-md capitalize">{{ formData.shortLead.leadName }}</div>
          <div
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.shortLead.id }}
          </div>
        </div>
        <div class="col">
          <div class="q-title q-my-md">Contact</div>
          <div class="no-margin">{{ formData.shortLead.contactNumber }}</div>
          <div>{{ formData.shortLead.alternateContactNumber }}</div>
        </div>
        <div class="col">
          <div class="q-title q-my-md">Address</div>
          <div class="capitalize no-margin">{{ formData.shortLead.leadAddress }}</div>
          <div class="capitalize no-margin">
            {{ formData.shortLead.city }}, {{ formData.shortLead.state }}
          </div>
        </div>
      </div>

      <!-- Device, Exception, Payment, MDR and Documents -->
      <div class="row">
        <div class="col-md-6">
          <div class="flex">
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
                    <q-item class="q-pa-sm">
                      <q-item-section>Plan</q-item-section>
                      <q-item-section side>{{ formData.shortLead.plan.planName }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>Setup Fees</q-item-section>
                      <q-item-section side>Rs. {{ formData.shortLead.setupFees }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>Recurring Fees</q-item-section>
                      <q-item-section side>Rs. {{ formData.shortLead.recurringFees }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>Merchant Category</q-item-section>
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
                      <q-item-section class="text-body1">Mode of payment</q-item-section>
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
                        <span
                          class="text-body1"
                          v-else-if="formData.shortLead.paymentOption == 4"
                        >
                          UPI Link
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section class="text-body1">Reference No</q-item-section>
                      <q-item-section side class="text-body1">
                        {{ formData.shortLead.referenceNumber == '' ? 'NA' : formData.shortLead.referenceNumber }}
                      </q-item-section>
                    </q-item>
                    <q-item v-if="formData.shortLead.paymentOption == 2" class="q-pa-sm">
                      <div
                        v-if="formData.shortLead.paymentDocumentMimeType != null && formData.shortLead.paymentDocumentMimeType.includes('pdf')"
                      >
                        <q-btn
                          size="sm"
                          :outline="!showOpenPaymentChequeDocumentInfo"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile, 'CHEQUE')"
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
                          @click="fnOpenPaymentChequeInfo(formData.shortLead.paymentDocumentFile)"
                        />
                      </div>
                      <div v-else class="text-grey-9">
                        <q-icon name="clear" color="negative" />
                        No document attached
                      </div>
                    </q-item>
                    <q-item v-if="showOpenPaymentChequeInfo" class="q-pa-sm">
                      <img
                        :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                        style="max-width: 100%"
                        class="cursor-pointer"
                        @click="fnOpenPaymentChequeInfo(formData.shortLead.paymentDocumentFile)"
                      />
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
                          label="Debit > 2000 (%)"
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
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Upi Debit Card UpTo 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="formData.shortLead.upiDebitCardUpTo2000"
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
                          :model-value="formData.shortLead.upiDebitCardAbove2000"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Upi Prepaid Credit Cards UpTo 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          :model-value="formData.shortLead.upiPrepaidCreditCardsUpTo2000"
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
                          :model-value="formData.shortLead.upiPrepaidCreditCardsAbove2000"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                      <q-checkbox
                        :model-value="formData.shortLead.posEnable"
                        class="no-pointer-events"
                        color="purple-9"
                        label="Enable Cash@POS Cash @POS incentive Rs.5"
                      />
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="flex">
            <!-- Exception -->
            <div class="full-width">
              <div v-if="formData.shortLead.leadCategory == 2">
                <q-card v-if="formData.shortLead.kyc" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <div class="row items-center">
                      <div class="col-auto text-body1 text-weight-medium">Exception KYC</div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
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
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
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
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
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
                <q-card-section class="no-padding">
                  <q-list class="no-padding">
                    <!-- START >> Component for handover to sat -->
                    <upload-lead-documents-component
                      v-if="formData.shortLead.documentUploadedType == 1 && formData.shortLead.leadCategory == 2"
                      class="full-width text-body1 no-padding"
                      :prop-get-short-lead-info-document-types="getShortLeadInfoDocumentTypes"
                      :prop-merchant-type-from-so="getShortLeadInfo"
                      @emitTriggerComponentHotLoad="ajaxLoadShortLeadInfo"
                      @emitAjaxLoadShortLeadInfo="ajaxLoadShortLeadInfo"
                      @emitCookUpKYCdocumentsId="fnCookUpKYCmarkedDocumentsId"
                    />
                    <!-- END >> Component for handover to sat -->
                    <!-- START >> Component for Full document upload -->
                    <view-lead-documents-component
                      v-else
                      @emitTriggerComponentHotLoad="ajaxLoadShortLeadInfo"
                      :prop-lead-document-information="formData.shortLead.leadDocuments"
                      :prop-get-short-info="formData.shortLead"
                      @update:prop-lead-document-information="formData.shortLead.leadDocuments = $event"
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
      <div class="flex">
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
        :prop-toggleshow-p-d-f-modal="toggleshowPDFModal"
        :prop-p-d-f-details="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />
      <!-- END >> COMPONENT: View PDF -->
      <!-- START >> COMPONENT: Final approval -->
      <show-approve-remarks-component
        v-if="toggleApproveLeadModal"
        :prop-toggle-lead-modal="toggleApproveLeadModal"
        :prop-lead-details="getShortLeadInfo"
        :prop-document-ids="merchantDocumentIds"
        @toggleLeadModal="fnApproveLeadData"
      />
      <!-- END >> COMPONENT: Final approval -->
      <!-- START >> COMPONENT: Final reject -->
      <show-reject-lead-reject-component
        v-if="toggleLeadRejectModal"
        :prop-toggle-lead-modal="toggleLeadRejectModal"
        :prop-lead-details="getShortLeadInfo"
        @toggleLeadModal="fnToggleRejectLeadComp"
      />
      <!-- END >> COMPONENT: Final reject -->
      <!-- //Common lead information in popup -->
      <general-lead-information
        v-if="propToggleLeadInformation"
        :lead-information="addtnLeadInformation"
        :prop-toggle-lead-information-pop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
      </div>
      <!--END >>  Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

import ShowPdfModalComponent from '../../components/sat/showPdfModalComponent.vue';
import ShowApproveRemarksComponent from '../../components/sat/showApproveRemarksComponent.vue';
import ShowRejectLeadRejectComponent from '../../components/sat/showRejectLeadRejectComponent.vue';

/* For documents view or upload */
import UploadLeadDocumentsComponent from '../../components/sat/uploadExceptionLeadDocumentsComponent.vue';
import ViewLeadDocumentsComponent from '../../components/sat/viewExceptionLeadDocumentsComponent.vue';
/* For documents view or upload */

import GeneralLeadInformation from '../../components/generalLeadInformation.vue';

const $q = useQuasar();
const route = useRoute();
const store = useStore();

// Reactive state
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
const select = ref('');

// Component properties
const toggleApproveLeadModal = ref(false);
const toggleLeadRejectModal = ref(false);

// Template properties
const showProceedToDataEntryButton = ref(false);
const toggleAjaxLoadFilter = ref(false);
const model = ref('');
const tabsModel = ref('xtab-2');
const toggleChequeImageResult = ref(false);
const toggleDocumentLeadRejectModal = ref(false);
const checked = ref(false);
const thumbnailsHorizontal = ref(false);
const leadRejectReason = ref('');

const formData = ref({
  shortLead: '',
  documentType: []
});

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);
const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo']);
const getShortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes']);

// Global constants (assuming these are defined elsewhere in the app)
const $VERIFIED_BANKSUBVENTION_STATUS_ATTACH_FILE_PENDING = ref(null);
const $VERIFIED_PRICING_STATUS_RSM_PENDING = ref(null);
const $DOCUMENT_UPLOAEDED_TYPE_HANDOVER_SAT = ref(1);

// Function to toggle lead information pop up screen
const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

// Function to load all lead details
const ajaxLoadShortLeadInfo = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  });
  
  try {
    await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', route.params.id);
    formData.value.shortLead = getShortLeadInfo.value;
    toggleAjaxLoadFilter.value = false;
  } catch (error) {
    console.error('Error loading lead info:', error);
    toggleAjaxLoadFilter.value = false;
  } finally {
    $q.loading.hide();
  }
};

// fnCookUpKYCmarkedDocumentsId
const fnCookUpKYCmarkedDocumentsId = (cookedDocumentArr) => {
  merchantDocumentIds.value = cookedDocumentArr;
};

// Function to approve lead and send to OPS HEAD
const fnApproveLeadData = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Validating ..'
  });
  
  try {
    await store.dispatch('SatLeadValidation/VERIFY_LEAD_DOCUMENTS', {
      id: route.params.id,
      params: merchantDocumentIds.value
    });
    toggleApproveLeadModal.value = !toggleApproveLeadModal.value;
  } catch (error) {
    if (error.data?.data?.toBeVerifiedDocuments?.length > 0) {
      const arrayMessage = error.data.data.toBeVerifiedDocuments.join(', ');
      $q.notify({
        color: 'amber-9',
        position: 'bottom-left',
        message: `${error.data.message}`,
        caption: arrayMessage,
        timeout: 8000,
        icon: 'warning',
        actions: [
          {
            icon: 'close',
            dense: true
          }
        ]
      });
    } else if (error.data?.data) {
      for (const key in error.data.data) {
        if (key !== 'toBeVerifiedDocuments') {
          const arrayMessage = error.data.data[key].join(', ');
          $q.notify({
            color: 'amber-9',
            position: 'bottom-left',
            message: `${error.data.message} for ${key}`,
            caption: arrayMessage,
            timeout: 8000,
            icon: 'warning',
            actions: [
              {
                icon: 'close',
                dense: true
              }
            ]
          });
        }
      }
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom-left',
        message: 'An error occurred while verifying documents',
        icon: 'error'
      });
    }
  } finally {
    $q.loading.hide();
  }
};

// Function to toggle reject lead component
const fnToggleRejectLeadComp = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Validating ..'
  });

  // If handover to sat then open the modal without validating
  if (getShortLeadInfo.value.documentUploadedType == $DOCUMENT_UPLOAEDED_TYPE_HANDOVER_SAT.value) {
    toggleLeadRejectModal.value = !toggleLeadRejectModal.value;
    $q.loading.hide();
    return;
  }

  try {
    await store.dispatch('SatLeadValidation/VERIFY_REJECT_LEAD_DOCUMENTS', {
      id: route.params.id
    });
    toggleLeadRejectModal.value = !toggleLeadRejectModal.value;
  } catch (error) {
    if (error.data?.data) {
      const arrayMessage = Object.values(error.data.data).flat().join(', ');
      $q.notify({
        color: 'amber-9',
        position: 'bottom-left',
        message: `${error.data.message}`,
        caption: arrayMessage,
        timeout: 8000,
        icon: 'warning',
        actions: [
          {
            icon: 'close',
            dense: true
          }
        ]
      });
    }
  } finally {
    $q.loading.hide();
  }
};

// Function to toggle between payment cheque image
const fnOpenPaymentChequeInfo = () => {
  showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
};

// Function to toggle PDF modal
const fnPDFViewModal = (documentUrl, documentType = '') => {
  showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
  PDFDetails.value = {
    url: documentUrl,
    type: documentType
  };
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

// Lifecycle hooks
onMounted(() => {
  ajaxLoadShortLeadInfo();
});

// Expose to template
defineExpose({
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
  model,
  tabsModel,
  toggleChequeImageResult,
  toggleDocumentLeadRejectModal,
  checked,
  thumbnailsHorizontal,
  leadRejectReason,
  formData,
  GLOBAL_FILE_FETCH_URL,
  getShortLeadInfo,
  getShortLeadInfoDocumentTypes,
  $VERIFIED_BANKSUBVENTION_STATUS_ATTACH_FILE_PENDING,
  $VERIFIED_PRICING_STATUS_RSM_PENDING,
  $DOCUMENT_UPLOAEDED_TYPE_HANDOVER_SAT,
  toggleLeadInformation,
  ajaxLoadShortLeadInfo,
  fnCookUpKYCmarkedDocumentsId,
  fnApproveLeadData,
  fnToggleRejectLeadComp,
  fnOpenPaymentChequeInfo,
  fnPDFViewModal
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}
</style>