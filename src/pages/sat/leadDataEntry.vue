<template>
  <q-page class="q-pa-md">
    <!-- Merchant Details -->
    <div class="row q-ma-xs">
      <div class="col-12 col-lg-3">
        <div class="q-title q-my-md capitalize">{{ shortLead.leadName }}</div>
        <div
          class="text-light-blue cursor-pointer"
          @click="toggleLeadInformation(shortLead)"
        >
          # {{ shortLead.leadNumber }}
        </div>
      </div>

      <div class="col-12 col-lg-3">
        <div class="q-title q-my-md">Contact</div>
        <p class="no-margin">{{ shortLead.contactNumber }}</p>
        <p>{{ shortLead.alternateContactNumber }}</p>
      </div>

      <div class="col-12 col-lg-3">
        <div class="q-title q-my-md">Address</div>
        <p v-if="shortLead.leadAddress" class="capitalize no-margin">
          {{ shortLead.leadAddress }}
        </p>
        <p class="capitalize no-margin">{{ shortLead.city }}, {{ shortLead.state }}</p>
      </div>

      <div class="col-12 col-lg-3">
        <div class="q-title q-my-md">Remarks</div>
        <div class="capitalize no-margin text-negative" v-if="shortLead.marsReason">
          {{ shortLead.marsReason }}
        </div>
        <div v-else>No Remarks</div>
      </div>
    </div>

    <!-- Merchant Info Collapsible -->
    <q-list>
      <q-expansion-item
        icon="info"
        group="primary"
        label="Merchant details"
        caption="Device, Exceptions, Payment, MDR"
        default-opened
      >
        <div class="row q-gutter-md">
          <!-- Device -->
          <div class="col">
            <q-card flat bordered class="q-custom-class">
              <q-card-section class="bg-grey-4 row items-center q-pa-sm border-bottom">
                <div class="col q-caption text-weight-medium">
                  Device - {{ shortLead.deviceCount }} {{ shortLead.device.deviceName }}
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm text-grey-9">
                <q-list separator dense>
                  <q-item>
                    <q-item-section>Plan</q-item-section>
                    <q-item-section side>{{ shortLead.plan.planName }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Setup Fees</q-item-section>
                    <q-item-section side>Rs. {{ shortLead.setupFees }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Recurring Fees</q-item-section>
                    <q-item-section side>Rs. {{ shortLead.recurringFees }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Merchant Category</q-item-section>
                    <q-item-section side>{{ shortLead.merchantCategory.merchantCategoryName }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Exception -->
          <div v-if="shortLead.leadCategory === 2" class="col">
            <div v-if="shortLead.kyc" class="q-mb-sm">
              <q-card flat bordered>
                <q-card-section class="bg-grey-4 row items-center q-pa-sm border-bottom">
                  <div class="col-auto q-caption text-weight-medium">Exception KYC</div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="row items-center">
                    <div class="col-3 q-caption text-faded">Reason</div>
                    <div class="col-9 q-caption text-faded">
                      {{ shortLead.reason ?? 'Reason not specified' }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div v-if="shortLead.bankSubvention" class="q-mb-sm">
              <q-card flat bordered>
                <q-card-section class="bg-grey-4 row items-center q-pa-sm border-bottom">
                  <div class="col-auto q-caption text-weight-medium">Exception Bank Subvention</div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="row items-center">
                    <div class="col-3 q-caption text-faded">Reason</div>
                    <div class="col-9 q-caption text-faded">
                      {{ shortLead.reason ?? 'Reason not specified' }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div v-if="shortLead.pricing" class="q-mb-sm">
              <q-card flat bordered>
                <q-card-section class="bg-grey-4 row items-center q-pa-sm border-bottom">
                  <div class="col-auto q-caption text-weight-medium">Exception Pricing</div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <div class="row items-center">
                    <div class="col-3 q-caption text-faded">Reason</div>
                    <div class="col-9 q-caption text-faded">{{ shortLead.reason }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Payment -->
          <div class="col">
            <q-card flat bordered class="q-custom-class">
              <q-card-section class="bg-grey-4 row items-center q-pa-sm border-bottom">
                <div class="col-auto q-caption text-weight-medium">Payment</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm text-grey-9">
                <q-list dense separator>
                  <q-item>
                    <q-item-section>Payment mode:</q-item-section>
                    <q-item-section side>
                      <span v-if="shortLead.paymentOption === 1">IMPS/NEFT</span>
                      <span v-else-if="shortLead.paymentOption === 2">Cheque</span>
                      <span v-else-if="shortLead.paymentOption === 3">Swipe</span>
                      <span v-else-if="shortLead.paymentOption === 4">UPI Link</span>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>Reference:</q-item-section>
                    <q-item-section side>{{ shortLead.referenceNumber || 'NA' }}</q-item-section>
                  </q-item>
                </q-list>

                <!-- Payment Documents -->
                <div v-if="shortLead.paymentOption === 2" class="q-mt-sm">
                  <q-btn
                    v-if="shortLead.paymentDocumentMimeType?.includes('pdf')"
                    size="sm"
                    :outline="!showOpenPaymentChequeDocumentInfo"
                    color="dark"
                    label="View Document"
                    icon="attach_file"
                    @click="fnPDFViewModal(shortLead.paymentDocumentFile, 'CHEQUE')"
                  />
                  <q-btn
                    v-else-if="shortLead.paymentDocumentMimeType?.includes('image')"
                    size="sm"
                    :outline="!showOpenPaymentChequeInfo"
                    color="dark"
                    label="View Document"
                    icon="attach_file"
                    @click="fnOpenPaymentChequeInfo(shortLead.paymentDocumentFile)"
                  />
                  <div v-else class="text-grey-9 q-mt-sm">
                    <q-icon name="clear" color="negative" /> No document attached
                  </div>
                </div>

                <div v-if="showOpenPaymentChequeInfo" class="q-mt-sm">
                  <viewer
                    class="cursor-pointer"
                    :images="[GLOBAL_FILE_FETCH_URL + '/' + shortLead.paymentDocumentFile]"
                  >
                    <img
                      :src="GLOBAL_FILE_FETCH_URL + '/' + shortLead.paymentDocumentFile"
                      style="max-width:100%"
                    />
                  </viewer>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- MDR -->
          <div class="col">
            <q-card flat bordered class="q-custom-class">
              <q-card-section class="bg-grey-4 row items-center q-pa-sm border-bottom">
                <div class="col-auto q-caption text-weight-medium">MDR</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm text-grey-9">
                <q-list dense separator>
                  <q-item>
                    <q-item-section>Debit &lt;= 2000</q-item-section>
                    <q-item-section side>{{ shortLead.debitLessthanAmount }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Debit > 2000</q-item-section>
                    <q-item-section side>{{ shortLead.debitGreaterthanAmount }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Std CC</q-item-section>
                    <q-item-section side>{{ shortLead.stdCC }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Premium CC</q-item-section>
                    <q-item-section side>{{ shortLead.premiumCC }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Corp Pre CC</q-item-section>
                    <q-item-section side>{{ shortLead.corpCC }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Intl Pre CC</q-item-section>
                    <q-item-section side>{{ shortLead.intlCC }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Super Pre CC</q-item-section>
                    <q-item-section side>{{ shortLead.superPremiumlCC }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Amex Domestic</q-item-section>
                    <q-item-section side>{{ shortLead.amexDomestic }}%</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>Amex International</q-item-section>
                    <q-item-section side>{{ shortLead.amexInternational }}%</q-item-section>
                  </q-item>

                  <q-item v-if="shortLead.posEnable" class="q-pa-sm">
                    <q-checkbox v-model="shortLead.posEnable" disable readonly color="grey-9">
                      <small class="q-caption">Enable Cash@POS Cash @POS incentive Rs. 5"</small>
                    </q-checkbox>
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
        default-opened
      >
        <showMarsForm :propLeadDeatils="shortLead" />
      </q-expansion-item>
    </q-list>

    <!-- PDF Viewer -->
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
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import showMarsForm from "../../components/sat/showMarsFormComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

const $q = useQuasar();
const route = useRoute();
const store = useStore();

const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);

const showOpenPaymentChequeDocumentInfo = ref(false);
const PDFDetails = ref(null);
const toggleshowPDFModal = ref(false);
const showOpenPaymentChequeInfo = ref(false);

const formData = ref({
  shortLead: {}
});

const shortLead = computed(() => formData.value.shortLead);

function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
}

function fnOpenPaymentChequeInfo() {
  showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
}

function fnPDFViewModal(documentUrl, viewChequeFlag) {
  if (viewChequeFlag === "CHEQUE") {
    showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
  }
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
}

async function ajaxLoadLeadDataEntryInfo() {
  $q.loading.show({ message: "Fetching data ..", spinnerColor: "purple-9" });
  try {
    await store.dispatch("SatLeadValidation/FETCH_SHORT_LEAD_DATA", route.params.id);
    formData.value.shortLead = store.getters["SatLeadValidation/getShortLeadInfo"];
  } finally {
    $q.loading.hide();
  }
}

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

.cursor-pointer {
  cursor: pointer;
}

.text-light-blue {
  color: #027be3;
}
</style>
