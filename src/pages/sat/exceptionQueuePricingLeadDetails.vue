<template>
  <q-page>
    <div class="q-ma-md">
      <!-- Merchant details -->
      <div class="flex items-stretch q-ma-xs">
        <div class="col-md-3">
          <div class="q-title q-my-md capitalize">
            {{ formData.shortLead?.leadName }}
          </div>
          <p
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.shortLead?.id }}
          </p>
        </div>

        <div class="col-md-3">
          <div class="q-title q-my-md">Contact</div>
          <p class="no-margin">{{ formData.shortLead?.contactNumber }}</p>
          <p>{{ formData.shortLead?.alternateContactNumber }}</p>
        </div>

        <div class="col-md-3">
          <div class="q-title q-my-md">Address</div>
          <p
            v-if="formData.shortLead?.leadAddress"
            class="capitalize no-margin"
          >
            {{ formData.shortLead.leadAddress }}
          </p>
          <p class="capitalize no-margin">
            {{ formData.shortLead?.city }},
            {{ formData.shortLead?.state }}
          </p>
        </div>
      </div>

      <div class="row">
        <!-- LEFT -->
        <div class="col-md-6">
          <!-- Device -->
          <q-card class="q-ma-xs border-1 q-custom-class" flat>
            <q-card-section class="q-pa-sm bottom-border title-bg">
              <div class="q-body-1 text-weight-medium">
                Device -
                {{ formData.shortLead?.deviceCount }}
                {{ formData.shortLead?.device?.deviceName }}
              </div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-list separator>
                <q-item>
                  <q-item-section>Plan</q-item-section>
                  <q-item-section side>
                    {{ formData.shortLead?.plan?.planName }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Setup Fees</q-item-section>
                  <q-item-section side>
                    Rs. {{ formData.shortLead?.setupFees }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Recurring Fees</q-item-section>
                  <q-item-section side>
                    Rs. {{ formData.shortLead?.recurringFees }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Merchant Category</q-item-section>
                  <q-item-section side>
                    {{
                      formData.shortLead?.merchantCategory
                        ?.merchantCategoryName
                    }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Payment -->
          <q-card class="q-ma-xs border-1 q-custom-class" flat>
            <q-card-section class="q-pa-sm bottom-border title-bg">
              <div class="q-body-1 text-weight-medium">Payment</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-list separator>
                <q-item>
                  <q-item-section>Mode of payment</q-item-section>
                  <q-item-section side>
                    <span v-if="formData.shortLead?.paymentOption === 1">
                      IMPS / NEFT
                    </span>
                    <span v-else-if="formData.shortLead?.paymentOption === 2">
                      Cheque
                    </span>
                    <span v-else-if="formData.shortLead?.paymentOption === 3">
                      Swipe
                    </span>
                    <span v-else-if="formData.shortLead?.paymentOption === 4">
                      UPI Link
                    </span>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Reference No</q-item-section>
                  <q-item-section side>
                    {{
                      formData.shortLead?.referenceNumber || "NA"
                    }}
                  </q-item-section>
                </q-item>

                <q-item v-if="formData.shortLead?.paymentOption === 2">
                  <q-btn
                    size="sm"
                    color="dark"
                    icon="attach_file"
                    label="View Document"
                    @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile)"
                  />
                </q-item>

                <q-item v-if="showOpenPaymentChequeInfo">
                  <img
                    :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead?.paymentDocumentFile"
                    style="max-width: 100%"
                  />
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- MDR -->
          <q-card class="q-ma-xs border-1 q-custom-class" flat>
            <q-card-section class="q-pa-sm bottom-border title-bg">
              <div class="q-body-1 text-weight-medium">MDR</div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="formData.shortLead.debitLessthanAmount"
                label="Debit < 2000 (%)"
                readonly
                stack-label
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- RIGHT -->
        <div class="col-md-6">
          <q-card
            v-if="formData.shortLead?.leadCategory === 2"
            class="q-ma-xs border-1"
            flat
          >
            <q-card-section class="bottom-border title-bg">
              <div class="q-body-1 text-weight-medium">
                Exception Details
              </div>
            </q-card-section>

            <q-card-section>
              <div class="q-caption">
                {{ formData.shortLead?.reason || "Reason not specified" }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end">
        <q-btn
          icon="block"
          color="grey-5"
          class="q-ma-sm text-dark"
          label="Cancel"
          @click="router.go(-1)"
        />
      </div>

      <!-- PDF Modal -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />

      <!-- Lead Info -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Loader -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" size="35" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const formData = reactive({ shortLead: {} });

const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const showOpenPaymentChequeInfo = ref(false);
const toggleshowPDFModal = ref(false);
const PDFDetails = ref(null);
const toggleAjaxLoadFilter = ref(false);

const GLOBAL_FILE_FETCH_URL = computed(
  () => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]
);

const getShortLeadInfo = computed(
  () => store.getters["SatLeadValidation/getShortLeadInfo"]
);

const toggleLeadInformation = (lead) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (lead) addtnLeadInformation.value = lead;
};

const ajaxLoadShortLeadInfo = async () => {
  $q.loading.show({ message: "Fetching data..." });
  try {
    await store.dispatch(
      "SatLeadValidation/FETCH_SHORT_LEAD_DATA",
      route.params.id
    );
    formData.shortLead = getShortLeadInfo.value;
  } finally {
    $q.loading.hide();
  }
};

const fnPDFViewModal = (doc) => {
  PDFDetails.value = doc;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

onMounted(ajaxLoadShortLeadInfo);
</script>

<style scoped>
.border-1 {
  border: 1px solid #c7c7c7;
}
.title-bg {
  background: #bbbbbb4a;
}
</style>
