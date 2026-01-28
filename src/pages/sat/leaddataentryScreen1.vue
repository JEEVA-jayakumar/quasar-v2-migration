<template>
  <q-page>
    <div class="q-ma-md">
      <!-- Merchant details -->
      <div class="flex items-stretch q-ma-xs">
        <div class="col-12 col-lg-3">
          <div class="q-title q-my-md capitalize">{{ formData.shortLead.leadName }}</div>
          <div
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.shortLead.leadNumber }}
          </div>
        </div>
        <div class="col-12 col-lg-3">
          <div class="q-title q-my-md">Contact</div>
          <p class="no-margin">{{ formData.shortLead.contactNumber }}</p>
          <p>{{ formData.shortLead.alternateContactNumber }}</p>
        </div>
        <div class="col-12 col-lg-3">
          <div class="q-title q-my-md">Address</div>
          <p v-if="formData.shortLead.leadAddress" class="capitalize no-margin">
            {{ formData.shortLead.leadAddress }}
          </p>
          <p class="capitalize no-margin">
            {{ formData.shortLead.city }}, {{ formData.shortLead.state }}
          </p>
        </div>
        <div class="col-12 col-lg-3">
          <div class="q-title q-my-md">Remarks</div>
          <div
            v-if="formData.shortLead.marsReason"
            class="capitalize no-margin text-negative"
          >
            {{ formData.shortLead.marsReason }}
          </div>
          <div v-else>No Remarks</div>
        </div>
      </div>

      <q-list padding>
        <!-- Merchant Details -->
        <q-expansion-item
          icon="info"
          group="primary"
          label="Merchant details"
          caption="Device, Exceptions, Payment, MDR"
          dense
        >
          <div class="row content-stretch">
            <!-- Device Card -->
            <div class="col">
              <q-card flat class="border-1 q-custom-class">
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="row items-center">
                    <div class="col q-caption text-weight-medium">
                      Device - {{ formData.shortLead.deviceCount }}
                      {{ formData.shortLead.device.deviceName }}
                    </div>
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-sm text-grey-9">
                  <q-list separator dense padding-none>
                    <q-item>
                      <q-item-section>Plan</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.plan.planName }}
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Setup Fees</q-item-section>
                      <q-item-section side class="text-center">
                        Rs. {{ formData.shortLead.setupFees }}
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Recurring Fees</q-item-section>
                      <q-item-section side class="text-center">
                        Rs. {{ formData.shortLead.recurringFees }}
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Merchant Category</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.merchantCategory.merchantCategoryName }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Exception Cards -->
            <div v-if="formData.shortLead.leadCategory === 2" class="col">
              <q-card v-if="formData.shortLead.kyc" flat class="border-1 q-mb-sm">
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="q-caption text-weight-medium">Exception KYC</div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-3">
                      <span class="q-caption text-faded">Reason</span>
                    </div>
                    <div class="col-9">
                      <span class="q-caption text-faded">
                        {{ formData.shortLead.reason || "Reason not specified" }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                v-if="formData.shortLead.bankSubvention"
                flat
                class="border-1 q-mb-sm"
              >
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="q-caption text-weight-medium">Exception Bank Subvention</div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-3">
                      <span class="q-caption text-faded">Reason</span>
                    </div>
                    <div class="col-9">
                      <span class="q-caption text-faded">
                        {{ formData.shortLead.reason || "Reason not specified" }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card v-if="formData.shortLead.pricing" flat class="border-1 q-mb-sm">
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="q-caption text-weight-medium">Exception Pricing</div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-3">
                      <span class="q-caption text-faded">Reason</span>
                    </div>
                    <div class="col-9">
                      <span class="q-caption text-faded">{{ formData.shortLead.reason }}</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Payment Card -->
            <div class="col">
              <q-card flat class="border-1 q-custom-class">
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="q-caption text-weight-medium">Payment</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-pa-sm text-grey-9">
                  <q-list dense padding-none>
                    <q-item>
                      <q-item-section>Payment mode:</q-item-section>
                      <q-item-section side class="text-center">
                        <span v-if="formData.shortLead.paymentOption === 1">IMPS/NEFT</span>
                        <span v-else-if="formData.shortLead.paymentOption === 2">Cheque</span>
                        <span v-else-if="formData.shortLead.paymentOption === 3">Swipe</span>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Reference:</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.referenceNumber || "NA" }}
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <!-- Payment Document -->
                  <div v-if="formData.shortLead.paymentOption === 2">
                    <div v-if="isPDF(formData.shortLead.paymentDocumentMimeType)">
                      <q-btn
                        size="sm"
                        :outline="!showOpenPaymentChequeDocumentInfo"
                        color="dark"
                        label="View Document"
                        icon="attach_file"
                        @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile, 'CHEQUE')"
                      />
                    </div>
                    <div v-else-if="isImage(formData.shortLead.paymentDocumentMimeType)">
                      <q-btn
                        size="sm"
                        :outline="!showOpenPaymentChequeInfo"
                        color="dark"
                        label="View Document"
                        icon="attach_file"
                        @click="fnOpenPaymentChequeInfo()"
                      />
                    </div>
                    <div v-else class="text-grey-9">
                      <q-icon name="clear" color="negative" /> No document attached
                    </div>
                  </div>

                  <div v-if="showOpenPaymentChequeInfo">
                    <viewer :images="[`${GLOBAL_FILE_FETCH_URL}/${formData.shortLead.paymentDocumentFile}`]">
                      <img
                        :src="`${GLOBAL_FILE_FETCH_URL}/${formData.shortLead.paymentDocumentFile}`"
                        style="max-width: 100%"
                      />
                    </viewer>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- MDR Card -->
            <div class="col">
              <q-card flat class="border-1 q-custom-class">
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="q-caption text-weight-medium">MDR</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-pa-sm text-grey-9">
                  <q-list separator dense padding-none>
                    <q-item>
                      <q-item-section>Debit &lt;= 2000</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.debitLessthanAmount }}%
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Debit > 2000</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.debitGreaterthanAmount }}%
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Std CC</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.stdCC }}%
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Premium CC</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.premiumCC }}%
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Corp Pre CC</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.corpCC }}%
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Intl Pre CC</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.intlCC }}%
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Super Pre CC</q-item-section>
                      <q-item-section side class="text-center">
                        {{ formData.shortLead.superPremiumlCC }}%
                      </q-item-section>
                    </q-item>
                    <q-item v-if="formData.shortLead.posEnable">
                      <q-checkbox
                        v-model="formData.shortLead.posEnable"
                        disable
                        readonly
                        color="grey-9"
                        label="Enable Cash@POS Cash @POS incentive Rs. 5"
                      />
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-expansion-item>

        <!-- Documents -->
        <q-expansion-item
          icon="file_copy"
          group="primary"
          label="Documents"
          caption="Related documents"
          dense
          :default-opened="true"
        >
          <showMarsForm :propLeadDeatils="formData.shortLead" />
        </q-expansion-item>
      </q-list>

      <!-- PDF Modal -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />

      <!-- Lead Information Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";

import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import showMarsForm from "../../components/sat/showMarsFormComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

// Vuex
import { useStore } from "vuex";

const $q = useQuasar();
const store = useStore();
const route = useRoute();

// Data
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);

const showOpenPaymentChequeDocumentInfo = ref(false);
const showOpenPaymentChequeInfo = ref(false);
const toggleshowPDFModal = ref(false);
const PDFDetails = ref(null);

const formData = ref({
  shortLead: {}
});

// Computed
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
const getShortLeadInfo = computed(() => store.getters["SatLeadValidation/getShortLeadInfo"]);

// Functions
const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
};

const ajaxLoadLeadDataEntryInfo = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  });

  try {
    await store.dispatch("SatLeadValidation/FETCH_SHORT_LEAD_DATA", route.params.id);
    formData.value.shortLead = getShortLeadInfo.value;
  } finally {
    $q.loading.hide();
  }
};

const fnOpenPaymentChequeInfo = () => {
  showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
};

const fnPDFViewModal = (documentUrl, viewChequeFlag) => {
  if (viewChequeFlag === "CHEQUE") showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

const isPDF = (mime) => mime?.includes("pdf");
const isImage = (mime) => mime?.includes("image");

// Lifecycle
onMounted(() => {
  ajaxLoadLeadDataEntryInfo();
});
</script>

<style scoped>
.bottom-border-dark {
  border-bottom: 1px solid #afafaf;
}

.border-1 {
  border: 1px solid #afafaf;
}

.q-custom-class {
  min-height: 230px;
}

.custom-z-index {
  z-index: 2;
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
</style>
