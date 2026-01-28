<template>
  <q-page>
    <div class="q-ma-md">
      <!-- Merchant details -->
      <div class="row q-ma-xs">
        <div class="col">
          <div class="q-title q-my-md capitalize">{{ formData.shortLead.leadName }}</div>
          <div
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.shortLead.leadNumber }}
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
          <div class="row">
            <!-- Device -->
            <div class="col-12">
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
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">
                      Payment -
                      <span v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</span>
                      <span v-if="formData.shortLead.paymentOption == 2">Cheque</span>
                      <span v-if="formData.shortLead.paymentOption == 3">Swipe</span>
                    </div>
                    <div class="col text-body1 text-positive" align="right">
                      Approved by
                      <span class="capitalize">{{ fnGetVerifiedPerson() }}</span> (Finance)
                    </div>
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
                          >IMPS/NEFT</span
                        >
                        <span
                          class="text-body1"
                          v-else-if="formData.shortLead.paymentOption == 2"
                          >Cheque</span
                        >
                        <span
                          class="text-body1"
                          v-else-if="formData.shortLead.paymentOption == 3"
                          >Swipe</span
                        >
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-item-label class="text-body1">Reference No</q-item-label>
                      </q-item-section>
                      <q-item-section side class="text-body1">
                        {{
                          formData.shortLead.referenceNumber == ""
                            ? "NA"
                            : formData.shortLead.referenceNumber
                        }}
                      </q-item-section>
                    </q-item>
                    <q-item v-if="formData.shortLead.paymentOption == 2">
                      <q-item-section>
                        <div
                          v-if="
                            formData.shortLead.paymentDocumentMimeType != null &&
                            formData.shortLead.paymentDocumentMimeType.includes('pdf')
                          "
                        >
                          <q-btn
                            size="sm"
                            :outline="!showOpenPaymentChequeDocumentInfo"
                            color="dark"
                            label="View Document"
                            icon="attach_file"
                            @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile)"
                          ></q-btn>
                        </div>
                        <div
                          v-else-if="
                            formData.shortLead.paymentDocumentMimeType != null &&
                            formData.shortLead.paymentDocumentMimeType.includes('image')
                          "
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
                      </q-item-section>
                    </q-item>
                    <q-item v-if="showOpenPaymentChequeInfo">
                      <q-item-section>
                        <viewer
                          class="cursor-pointer"
                          :images="[
                            GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile,
                          ]"
                        >
                          <img
                            :src="
                              GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile
                            "
                            style="max-width: 100%"
                          />
                        </viewer>
                      </q-item-section>
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
                    <span class="capitalize">{{ fnGetVerifiedRSMPerson() }}</span> (RSM)
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
                          v-model="formData.shortLead.debitLessthanAmount"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Debit > 2000 (%)"
                          readonly
                          class="no-pointer-events"
                          v-model="formData.shortLead.debitGreaterthanAmount"
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
                          v-model="formData.shortLead.stdCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Premium CC (%)"
                          readonly
                          class="no-pointer-events"
                          v-model="formData.shortLead.premiumCC"
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
                          v-model="formData.shortLead.corpCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Intl Pre CC (%)"
                          readonly
                          class="no-pointer-events"
                          v-model="formData.shortLead.intlCC"
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
                          v-model="formData.shortLead.superPremiumlCC"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                      <q-checkbox
                        v-model="formData.shortLead.posEnable"
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
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <span class="text-body1 text-weight-medium">Remarks</span>
                </q-card-section>
                <q-card-section>
                  <q-scroll-area
                    :style="
                      formData.shortLead.leadVerificationStatus.length > 4
                        ? 'width: 100%; height:400px;'
                        : 'width: 100%; height:100px;'
                    "
                  >
                    <q-list class="no-padding">
                      <q-item
                        dense
                        v-for="(item, index) in formData.shortLead.leadVerificationStatus"
                        :key="index"
                        class="q-pa-sm"
                      >
                        <q-item-section avatar>
                          <q-avatar
                            color="purple-9"
                            text-color="white"
                            :label="item.createdBy.name.charAt(0)"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ item.reason }}</q-item-label>
                          <q-item-label caption>{{ item.createdBy.name }}</q-item-label>
                          <q-item-label caption>{{ item.fieldName }}</q-item-label>
                          <q-item-label caption>{{
                            $filters.moment(item.updatedAt, "Do MMM Y")
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-card-section>
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
                        <span
                          class="text-caption text-faded"
                          v-if="formData.shortLead.reason == null"
                          >Reason not specified</span
                        >
                        <span class="text-caption text-faded" v-else>{{
                          formData.shortLead.reason
                        }}</span>
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
                    <span
                      class="text-body1 text-positive float-right"
                      v-if="getShortLeadInfo.bankSubvention"
                    >
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
                        <div
                          class="text-caption text-faded"
                          v-if="formData.shortLead.reason == null"
                        >
                          Reason not specified
                        </div>
                        <div class="text-caption text-faded" v-else>{{ formData.shortLead.reason }}</div>
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
                    <span
                      class="text-body1 text-positive float-right"
                      v-if="getShortLeadInfo.pricing"
                    >
                      Approved by
                      <span class="capitalize">{{ fnGetVerifiedRSMPerson() }}</span> (RSM)
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
                  <span v-if="formData.shortLead.kyc" class="float-right text-body1 text-positive"
                    >KYC Exception Case</span
                  >
                </q-card-section>
                <q-card-section class="no-padding">
                  <q-list class="no-padding">
                    <uploadLeadDocumentsComponent
                      v-if="
                        formData.shortLead.documentUploadedType == 1 &&
                        formData.shortLead.kyc === false
                      "
                      class="full-width text-body1 no-padding"
                      :propGetShortLeadInfoDocumentTypes="getShortLeadInfoDocumentTypes"
                      :propMerchantTypeFromSO="getShortLeadInfo"
                      @emitTriggerComponentHotLoad="ajaxLoadShortLeadInfo"
                      @emitAjaxLoadShortLeadInfo="ajaxLoadShortLeadInfo"
                    />
                    <viewLeadDocumentsComponent
                      v-else
                      @emitTriggerComponentHotLoad="ajaxLoadShortLeadInfo"
                      :propLeadDocumentInformation="formData.shortLead.leadDocuments"
                      :propGetShortInfo="getShortLeadInfo"
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
            @click="$router.go(-1)"
            label="Cancel"
          />
          <q-btn
            :disable="!showProceedToDataEntryButton"
            icon="check"
            color="tertiary"
            class="q-ma-sm"
            @click="fnApproveLeadData(getShortLeadInfo)"
            label="Proceed to data entry"
          />
          <q-btn
            :disable="!showFinalRejectionAction"
            icon="clear"
            class="q-ma-sm"
            color="negative"
            label="REJECT"
            @click="fnToggleRejectLeadComp"
          />
        </div>
      </div>

      <!-- START >> COMPONENT: Final reject -->
      <showFinalRejectLeadRemarksComponent
        v-if="toggleLeadRejectModal"
        :propToggleLeadModal="toggleLeadRejectModal"
        :propLeadDetails="getShortLeadInfo"
        @toggleLeadModal="fnToggleRejectLeadComp"
      />
      <!-- END >> COMPONENT: Final reject -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
      </div>
      <!--END >>  Show Ajax Spinner -->
      <!-- START >> COMPONENT: View PDF  -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />
      <!-- END >> COMPONENT: View PDF -->
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :propLeadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useQuasar } from "quasar";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import _ from "lodash";
import { useStore } from "vuex";

// Async components
const uploadLeadDocumentsComponent = defineAsyncComponent(() =>
  import("../../components/sat/uploadLeadDocumentsComponent.vue")
);
const viewLeadDocumentsComponent = defineAsyncComponent(() =>
  import("../../components/sat/viewLeadDocumentsComponent.vue")
);
const showPdfModalComponent = defineAsyncComponent(() =>
  import("../../components/sat/showPdfModalComponent.vue")
);
const showFinalRejectLeadRemarksComponent = defineAsyncComponent(() =>
  import("../../components/sat/showFinalRejectLeadRemarksComponent.vue")
);
const generalLeadInformation = defineAsyncComponent(() =>
  import("../../components/generalLeadInformation.vue")
);

const $q = useQuasar();
const router = useRouter();
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const showOpenPaymentChequeDocumentInfo = ref(false);
const PDFDetails = ref(null);
const toggleshowPDFModal = ref(false);
const toggleLeadRejectModal = ref(false);
const showProceedToDataEntryButton = ref(true);
const toggleAjaxLoadFilter = ref(false);
const showOpenPaymentChequeInfo = ref(false);

const formData = ref({
  shortLead: "",
  documentType: [],
});

// Store getters
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
const getShortLeadInfo = computed(() => store.getters["SatLeadValidation/getShortLeadInfo"]);
const getShortLeadInfoDocumentTypes = computed(() => store.getters["SatLeadValidation/getShortLeadInfoDocumentTypes"]);

const showFinalRejectionAction = computed(() => {
  let dummyArr = [];
  const documents = getShortLeadInfo.value?.leadDocuments || {};
  
  // Function to check if any of the document is rejected
  for (const key in documents) {
    const returnSubValue = _.filter(documents[key], function (subValue) {
      return subValue.documentVerifiedStatus == 3;
    });
    if (returnSubValue.length > 0) {
      dummyArr.push(returnSubValue);
    }
  }
  
  // If yes, then throw an alert
  return dummyArr.length > 0;
});

// Function to toggle lead information pop up screen
const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

// Function redirect to data entry screen
const fnMoveToDataEntryScreen = () => {
  if (!getShortLeadInfo.value) return;
  
  if (
    getShortLeadInfo.value.leadStatus >=
    getShortLeadInfo.value.$LEAD_STATUS_DATA_ENTRY_PENDING
  ) {
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Redirecting to data entry screen",
      icon: "fas fa-exchange-alt",
    });
    router.push(
      "/sat/lead/validation/" + router.currentRoute.value.params.id + "/data/entry"
    );
  }
};

// Function to load all lead details
const ajaxLoadShortLeadInfo = async (hotReloadForDocumentsUploadValidation, merchantTypeSelection) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    await store.dispatch("SatLeadValidation/FETCH_SHORT_LEAD_DATA", router.currentRoute.value.params.id);
    formData.value.shortLead = getShortLeadInfo.value;
    fnMoveToDataEntryScreen();
    
    if (formData.value.shortLead.documentUploadedType == 1) {
      if (hotReloadForDocumentsUploadValidation == "hotReloadForDocumentsUploadValidation") {
        fnToToggleSubmitAction(merchantTypeSelection);
      }
    } else {
      fnCheckValidationFlag();
    }
  } catch (error) {
    console.error("Error loading short lead info:", error);
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to load lead information",
      icon: "error"
    });
  } finally {
    $q.loading.hide();
  }
};

// Function to show PDF
const fnPDFViewModal = (documentUrl) => {
  showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

// Function to open payment document as image info
const fnOpenPaymentChequeInfo = () => {
  showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
};

// Function to approve lead and send to data entry final screen MARS
const fnApproveLeadData = async (leadInfo) => {
  if (!leadInfo) return;
  
  let dummyArr_rejection = [];
  const documents = leadInfo.leadDocuments || {};
  
  // Function to check if any of the document is rejected
  for (const key in documents) {
    const returnSubValue_rejection = _.filter(documents[key], function (subValue) {
      return subValue.documentVerifiedStatus == 3;
    });
    if (returnSubValue_rejection.length > 0) {
      dummyArr_rejection.push(returnSubValue_rejection);
    }
  }
  
  if (dummyArr_rejection.length > 0) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Some document(s) are rejected",
      icon: "warning",
    });
    return;
  }

  const formData = {
    leadInformation: {
      fieldName: "Full Lead Information",
      reason: "",
    },
    leadId: leadInfo.id,
    defaultUrlValue: leadInfo.$SAT_LEAD_VALIDATION_APPROVE,
  };
  
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to proceed to data entry?",
    ok: {
      label: "Continue",
      color: "positive",
    },
    cancel: {
      label: "Cancel",
      color: "negative",
    },
  })
    .then(async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Processing ..",
      });
      
      try {
        await store.dispatch("SatLeadValidation/VERIFY_LEAD_DATA", formData);
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully approved",
          icon: "thumb_up",
        });
        router.push(
          "/sat/lead/validation/" +
            router.currentRoute.value.params.id +
            "/data/entry"
        );
      } catch (error) {
        if (error.status == 422) {
          $q.notify({
            color: "primary",
            position: "bottom",
            message: error.data?.data?.subDocumentType + " is pending for approval",
            icon: "info",
          });
        } else {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error.body?.message == null ? "Please Try Again Later !" : error.body.message,
            icon: "thumb_down",
          });
        }
      } finally {
        $q.loading.hide();
      }
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "bottom",
        message: "No changes made!",
        icon: "thumb_down",
      });
    });
};

// Function to toggle reject lead component
const fnToggleRejectLeadComp = () => {
  toggleLeadRejectModal.value = !toggleLeadRejectModal.value;
};

// Function to check validation flag
const fnCheckValidationFlag = () => {
  if (!formData.value.shortLead?.leadDocuments) return;
  
  let cookedArr = [];
  const leadDocuments = formData.value.shortLead.leadDocuments;
  
  for (const key in leadDocuments) {
    if (Object.prototype.hasOwnProperty.call(leadDocuments, key)) {
      _.forEach(leadDocuments[key], function (subValue) {
        if (subValue.documentVerifiedStatus == subValue.$VERIFIED_DOCUMENT_STATUS_REJECT) {
          cookedArr.push(subValue.id);
        }
      });
    }
  }
  showProceedToDataEntryButton.value = cookedArr.length === 0;
};

// Function to toggle between submit button/action
const fnToToggleSubmitAction = (merchantTypeSelection) => {
  if (!getShortLeadInfo.value || !getShortLeadInfoDocumentTypes.value) return;
  
  // Get document applicable from Lead Info Documents Type
  const parentArr = getShortLeadInfoDocumentTypes.value.filter(function (value) {
    return value.merchantType == merchantTypeSelection;
  });

  if (!parentArr.length || !parentArr[0].documentsApplicable) return;

  // Get uploaded documents count
  const majorArr = [];
  Object.keys(getShortLeadInfo.value.leadDocuments || {}).forEach(function (key) {
    const childArr = _.find(parentArr[0].documentsApplicable, function (o) {
      return (
        key == o.documentType &&
        Object.prototype.hasOwnProperty.call(getShortLeadInfo.value.leadDocuments, key) &&
        getShortLeadInfo.value.leadDocuments[key].length > 0
      );
    });
    majorArr.push(childArr);
  });

  showProceedToDataEntryButton.value = parentArr[0].documentsApplicable.length == majorArr.length;
};

// Function to get approved by user for payment information
const fnGetVerifiedPerson = () => {
  if (!getShortLeadInfo.value?.leadVerificationStatus) return "";
  
  const sortedArr = _.orderBy(
    getShortLeadInfo.value.leadVerificationStatus,
    ["id"],
    ["desc"]
  );
  const cookedArr = _.filter(sortedArr, {
    status: true,
    verificationType: getShortLeadInfo.value.$VERIFICATION_TYPE_FINANCE,
  });
  return cookedArr[0]?.createdBy?.name || "";
};

// Function to get verified Finance person name
const fnGetVerifiedFINANCEPerson = () => {
  if (!getShortLeadInfo.value?.leadVerificationStatus) return "";
  
  const sortedArr = _.orderBy(
    getShortLeadInfo.value.leadVerificationStatus,
    ["id"],
    ["desc"]
  );
  const cookedArr = _.filter(sortedArr, {
    status: true,
    verificationType: getShortLeadInfo.value.$VERIFICATION_TYPE_FINANCE,
  });
  return cookedArr[0]?.createdBy?.name || "";
};

// Function to get verified RSM person name
const fnGetVerifiedRSMPerson = () => {
  if (!getShortLeadInfo.value?.leadVerificationStatus) return "";
  
  const sortedArr = _.orderBy(
    getShortLeadInfo.value.leadVerificationStatus,
    ["id"],
    ["desc"]
  );
  const cookedArr = _.filter(sortedArr, {
    status: true,
    verificationType: getShortLeadInfo.value.$VERIFICATION_TYPE_PRICING,
  });
  return cookedArr[0]?.createdBy?.name || "";
};

// Function to get verified OPS Head person name
const fnGetVerifiedOPHPerson = () => {
  if (!getShortLeadInfo.value?.leadVerificationStatus) return "";
  
  const sortedArr = _.orderBy(
    getShortLeadInfo.value.leadVerificationStatus,
    ["id"],
    ["desc"]
  );
  const cookedArr = _.filter(sortedArr, {
    status: true,
    verificationType: getShortLeadInfo.value.$VERIFICATION_TYPE_KYC,
  });
  return cookedArr[0]?.createdBy?.name || "";
};

onMounted(() => {
  // function to load all lead details when page loads
  ajaxLoadShortLeadInfo();
});

// Route leave guard
onBeforeRouteLeave((to, from, next) => {
  if (
    to.name == "leadDataEntry" ||
    to.name == "leadValidation" ||
    to.path == "/404"
  ) {
    next();
  } else {
    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!"
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
});
</script>

<script>
// Export component name
export default {
  name: "LeadDataEntry"
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

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.capitalize {
  text-transform: capitalize;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>