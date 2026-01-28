<template>
  <div>
    <!-- Documents -->
    <div id="mainContainer" class="row">
      <!-- Documents proof -->
      <div 
        id="leftSidePane" 
        class="col-md-5 q-pa-xs largeCont" 
        v-if="showDocumentPreview"
      >
        <!-- <viewLeadDocuments
          :propLeadDocumentInformation="propLeadDeatils.leadDocuments"
          :propGetShortInfo="propLeadDeatils"
        />-->
      </div>
      
      <!-- Document related form -->
      <div id="rightSidePane" class="col-md-7 q-pa-xs block relative">
        <q-stepper 
          v-model="step"
          ref="stepper" 
          color="purple-9" 
          contracted
          flat
          alternative-labels
        >
          <q-step 
            :name="1" 
            title="Sales" 
            icon="settings"
            :done="step > 1"
          >
            <salesInformation
              :regionOptions="regionOptions"
              :leadFromOptions="leadFromOptions"
              :salesPersonOptions="salesPersonOptions"
              :sharingPartnerOptions="sharingPartnerOptions"
              :salesInformation="merchant.salesInformation"
              :leadDetails="{marsCurrentStatus: propLeadDeatils.marsFormSubmitAction}"
              @goNext="validate"
              @saveData="saveDetails"
            />
          </q-step>
          
          <q-step 
            :name="2" 
            title="Details" 
            icon="create_new_folder"
            :done="step > 2"
          >
            <companyInformation
              :cityOptions="cityOptions"
              :stateOptions="stateOptions"
              :mccSearchSet="mccSearchSet"
              :propLeadDeatils="propLeadDeatils"
              :companyInformation="merchant.companyInformation"
              @goNext="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>
          
          <q-step 
            :name="3" 
            title="Partners" 
            :icon="showPartnerstab ? 'add_comment' : 'block'"
            :done="step > 3"
          >
            <partnerInformation
              :constitution="propLeadDeatils.merchantType.marsMappingId"
              :partnerInformation="merchant.partnerInformation"
              :cityOptions="cityOptions"
              :stateOptions="stateOptions"
              @goNext="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>
          
          <q-step 
            :name="4" 
            title="Business" 
            icon="assignment"
            :done="step > 4"
          >
            <businessInformation
              :businessInformation="merchant.businessInformation"
              @goNext="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>
          
          <q-step 
            :name="5" 
            title="Payment" 
            icon="payment"
            :done="step > 5"
          >
            <paymentInformation
              :terminalModelSet="terminalModelSet"
              :rentalPlanSet="rentalPlanSet"
              :serviceProviderListSet="serviceProviderListSet"
              :networkProviderListSet="networkProviderListSet"
              :paymentInformation="merchant.paymentInformation"
              @goNext="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>
          
          <q-step 
            :name="6" 
            title="Discount" 
            icon="monetization_on"
            :done="step > 6"
          >
            <discountInformation
              :sharingModelCode="merchant.salesInformation.sharingModelCode"
              :mdrPlan="merchant.mdrPlan"
              :mdrAddtionalDetails="{
                debitLessthanAmount: propLeadDeatils.debitLessthanAmount,
                debitGreaterthanAmount: propLeadDeatils.debitGreaterthanAmount,
                stdCC: propLeadDeatils.stdCC,
                premiumCC: propLeadDeatils.premiumCC,
                superPremiumlCC: propLeadDeatils.superPremiumlCC,
                corpCC: propLeadDeatils.corpCC,
                intlCC: propLeadDeatils.intlCC
              }"
              :SharingDiscountFee="merchant.SharingDiscountFee"
              @goNext="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>

          <q-step 
            :name="7" 
            title="Bank & Collection" 
            icon="account_balance"
            :done="step > 7"
          >
            <bankInformation
              :cityOptions="cityOptions"
              :stateOptions="stateOptions"
              :bankListSet="bankListSet"
              :propLeadDeatils="propLeadDeatils"
              :bankInformation="merchant.bankInformation"
              @goNext="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>
          
          <q-step 
            :name="8" 
            title="KYC" 
            icon="verified_user"
            :done="step > 8"
          >
            <kycInformation
              :propLeadDeatils="propLeadDeatils"
              :kyc="merchant.kyc"
              @save="validate"
              @goBack="stepper?.previous()"
              @saveData="saveDetails"
            />
          </q-step>
        </q-stepper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import salesInformation from './dataEntry/salesInformation.vue';
import companyInformation from './dataEntry/companyInformation.vue';
import partnerInformation from './dataEntry/partnersInformation.vue';
import businessInformation from './dataEntry/businessInformation.vue';
import paymentInformation from './dataEntry/paymentInformation.vue';
import discountInformation from './dataEntry/discountInformation.vue';
import bankInformation from './dataEntry/bankInformation.vue';
import kycInformation from './dataEntry/kycInformation.vue';
// import viewLeadDocuments from './viewLeadDocumentsDataEntryComponent.vue';

// Props
const props = defineProps({
  propLeadDeatils: {
    type: Object,
    required: true
  }
});

// Composables
const $q = useQuasar();
const route = useRoute();
const store = useStore();

// Global properties (injected from main app config)
const $PARTNERS_TAB_ENABLED_ITEMS = inject('$PARTNERS_TAB_ENABLED_ITEMS', []);

// Refs
const stepper = ref(null);
const step = ref(1);
const showPartnerstab = ref(true);
const showDocumentPreview = ref(true);

// Reactive state
const regionOptions = ref([]);
const leadFromOptions = ref([]);
const salesPersonOptions = ref([]);
const sharingPartnerOptions = ref([]);
const cityOptions = ref([]);
const stateOptions = ref([]);
const mccSearchSet = ref([]);
const terminalModelSet = ref([]);
const rentalPlanSet = ref([]);
const bankListSet = ref([]);
const networkProviderListSet = ref([]);
const serviceProviderListSet = ref([]);


const merchant = reactive({
  salesInformation: {
    institutionCode: 3,
    applicationType: 'D',
    applicationNumber: '',
    applicationDate: '',
    aggreementDate: '',
    merchantType: 'M',
    categoryType: 'O',
    region: '',
    salesPersonCode: '',
    leadFrom: '',
    sharingModelCode: 'N',
    sharingPartnerCode: '',
    dailyFixedAmount: '',
    loanDisbursementPercentage: '',
    loanDisbursementAmount: '',
    loanDisbursementDate: '',
    tenureMonth: '',
    tenureDay: '',
    tenureStartDate: '',
    rentPercentage: 2,
    rentFixed: ''
  },
  companyInformation: {
    legalName: '',
    dbaName: '',
    registeredAddress: '',
    registeredPin: '',
    registeredCityRefCode: '',
    registeredStateRefCode: '',
    constitution: '',
    constitutionName: '',
    constitutionDescription: '',
    establishYear: '',
    registerNumber: '',
    pan: '',
    tin: '',
    tan: '',
    businessNature: '',
    businessType: 'R',
    mcc: '',
    residentialAddress: '',
    residentialPin: '',
    residentialCityRefCode: '',
    residentialStateRefCode: '',
    contactName: '',
    contactMobile: '',
    contactAlternateMobile: '',
    contactPhone: '',
    contactEmail: '',
    statementType: 'P',
    statementFrequency: 'D',
    statementEmail: ''
  },
  businessInformation: {
    weekdayStartHour: '00.00',
    weekdayEndHour: '00.00',
    weekendStartHour: '00.00',
    weekendEndHour: '00.00',
    lastTurnoverYear: 2017,
    lastTurnoverAmount: '',
    expectedCardBusiness: '',
    averageBillAmount: '',
    gstId: null,
    currentPosName: '',
    debitCardMdr: '',
    creditCardMdr: '',
    memberSince: '',
    businessIncome: ''
  },
  partnerInformation: [
    {
      name: '',
      address: '',
      pan: '',
      pin: '',
      stateRefCode: '',
      cityRefCode: '',
      contactMobile: '',
      contactEmail: ''
    }
  ],
  paymentDetails: {
    deviceOwnedBy: 'B',
    installationFee: '',
    terminalModeCode: '',
    numberOfTerminals: 1,
    cashAtPosEnabled: 'Y',
    rentalPlanCode: 1,
    serviceProvider: 1,
    networkPreferred: 1,
    rentalMode: 'S',
    rentalType: 'A',
    advanceRentCollected: '',
    advanceRentMode: 'NEFT',
    noOfMonthRentPaidInAdvance: '',
    gracePeriod: 0,
    devicePrice: '',
    otherCharges: '',
    totalAmountPaid: ''
  },
  bankInformation: {
    bankDetails: {
      ifsc: '',
      micr: '',
      bankName: '',
      branchName: '',
      bankCityRefCode: '',
      bankStateRefCode: '',
      paymentMode: 'D',
      accountType: 'S',
      accountNumber: '',
      bankStatementAttached: 'Y',
      cancelChequeAttached: 'Y',
      feeType: 'N',
      settlementOrNeftFee: ''
    },
    collectionDetails: {
      collectedDate: '',
      swipeAmount: '',
      swipeTerminal: '',
      chequeAmount: '',
      chequeDate: '',
      chequeDepositedDate: '',
      chequeNumber: '',
      acquirerBank: ''
    }
  },
  kyc: { documents: [] },
  mdrPlan: {
    code: 1,
    domesticDebitUpTo2000: { fixed: 0, percentage: 0, minimum: 0 },
    domesticDebitAbove2000: { fixed: 0, percentage: 0, minimum: 0 },
    standardOrClassic: { fixed: 0, percentage: 0, minimum: 0 },
    premiumOrPlatinum: { fixed: 0, percentage: 0, minimum: 0 },
    superPremiumOrSignature: { fixed: 0, percentage: 0, minimum: 0 },
    commercialOrCorporate: { fixed: 0, percentage: 0, minimum: 0 },
    internationalDebitCard: { fixed: 0, percentage: 0, minimum: 0 },
    internationalCreditCard: { fixed: 0, percentage: 0, minimum: 0 },
    onus: { fixed: 0, percentage: 0, minimum: 0 },
    mVisa: { fixed: 0, percentage: 0, minimum: 0 },
    masterPass: { fixed: 0, percentage: 0, minimum: 0 },
    cashAtPos: { fixed: 0, percentage: 0, minimum: 0 }
  },
  SharingDiscountFee: {
    domesticDebitUpTo2000: { fixed: 0, percentage: 0, minimum: 0 },
    domesticDebitAbove2000: { fixed: 0, percentage: 0, minimum: 0 },
    standardOrClassic: { fixed: 0, percentage: 0, minimum: 0 },
    premiumOrPlatinum: { fixed: 0, percentage: 0, minimum: 0 },
    superPremiumOrSignature: { fixed: 0, percentage: 0, minimum: 0 },
    commercialOrCorporate: { fixed: 0, percentage: 0, minimum: 0 },
    internationalDebitCard: { fixed: 0, percentage: 0, minimum: 0 },
    internationalCreditCard: { fixed: 0, percentage: 0, minimum: 0 },
    onus: { fixed: 0, percentage: 0, minimum: 0 },
    mVisa: { fixed: 0, percentage: 0, minimum: 0 },
    masterPass: { fixed: 0, percentage: 0, minimum: 0 },
    cashAtPos: { fixed: 0, percentage: 0, minimum: 0 }
  }
});

// Computed properties (Vuex getters)
const regionsFromMars = computed(() => store.getters['mars_regions/regionsFromMars']);
const leadFromInfoFromMars = computed(() => store.getters['mars_leadFrom/leadFromInfoFromMars']);
const salesPersonFromMars = computed(() => store.getters['mars_salesPerson/salesPersonFromMars']);
const sharingPartnerFromMars = computed(() => store.getters['mars_sharingPartner/sharingPartnerFromMars']);
const cityFromMars = computed(() => store.getters['mars_city/cityFromMars']);
const stateFromMars = computed(() => store.getters['mars_state/stateFromMars']);
const mccFromMars = computed(() => store.getters['mars_mcc/mccFromMars']);
const deviceModelFromMars = computed(() => store.getters['mars_deviceModel/deviceModelFromMars']);
const rentalPlanFromMars = computed(() => store.getters['mars_rentalPlans/rentalPlanFromMars']);
const bankListFromMars = computed(() => store.getters['mars_bankList/bankListFromMars']);
const serviceProviderFromMars = computed(() => store.getters['mars_serviceProvider/serviceProviderFromMars']);
const networkProviderFromMars = computed(() => store.getters['mars_networkProvider/networkProviderFromMars']);

// Methods
const validate = (stepName, details) => {
  if (stepName === 'kyc') {
    alert('finalStep');
  } else {
    saveDetails(stepName, details, { customStepper: true });
  }
};

const saveDetails = async (stepName, details, extras) => {
  if (stepName === 'salesInformation') {
    Object.assign(merchant.salesInformation, details.salesInformation);
  } else if (stepName === 'companyInformation') {
    Object.assign(merchant.companyInformation, details.companyInformation);
  } else if (stepName === 'partnerInformation') {
    merchant.partnerInformation = details.partnerInformation;
  } else if (stepName === 'businessInformation') {
    Object.assign(merchant.businessInformation, details.businessInformation);
  } else if (stepName === 'paymentDetails') {
    Object.assign(merchant.paymentDetails, details.paymentDetails);
  } else if (stepName === 'mdrPlan') {
    Object.assign(merchant.mdrPlan, details.mdrPlan);
    Object.assign(merchant.SharingDiscountFee, details.SharingDiscountFee);
  } else if (stepName === 'bankInformation') {
    Object.assign(merchant.bankInformation, details.bankInformation);
  } else if (stepName === 'kyc') {
    Object.assign(merchant.kyc, details.kyc);
  } else {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Oops, something went wrong!',
      icon: 'warning'
    });
    return false;
  }

  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Saving data ..'
  });

  try {
    const merchantData = { ...merchant, leadId: route.params.id };
    const response = await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', {
      merchant: merchantData,
      action: 1
    });

    if (extras?.customStepper) {
      stepper.value?.next();
    }

    $q.loading.hide();
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: response.data.message,
      icon: 'thumb_up'
    });
  } catch (error) {

    $q.loading.hide();
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.data?.message || 'Error saving data',
      icon: 'thumb_down'
    });
  }
};

const fetchAllDropdownValuesFromMARSapi = async (institutionCode) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Setting data ..'
  });

  try {
    // Fetch regions
    await store.dispatch('mars_regions/REGION_FROM_MARS', institutionCode);
    regionOptions.value = regionsFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch sharing partner
    await store.dispatch('mars_sharingPartner/SHARING_PARTNER_FROM_MARS', institutionCode);
    sharingPartnerOptions.value = sharingPartnerFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch lead from
    await store.dispatch('mars_leadFrom/LEAD_FROM_FROM_MARS', institutionCode);
    leadFromOptions.value = leadFromInfoFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.name
    }));

    // Fetch sales person
    await store.dispatch('mars_salesPerson/SALES_PERSON_FROM_MARS', institutionCode);
    salesPersonOptions.value = salesPersonFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch city
    await store.dispatch('mars_city/CITY_FROM_MARS');
    cityOptions.value = cityFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch state
    await store.dispatch('mars_state/STATE_FROM_MARS');
    stateOptions.value = stateFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch MCC
    await store.dispatch('mars_mcc/MCC_FROM_MARS');
    mccSearchSet.value = mccFromMars.value.items.map(oo => ({
      label: `${oo.code}-${oo.name}`,
      value: oo.code
    }));

    // Fetch device model
    await store.dispatch('mars_deviceModel/DEVICE_MODEL_FROM_MARS', institutionCode);
    terminalModelSet.value = deviceModelFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch rental plan
    await store.dispatch('mars_rentalPlans/RENTAL_PLAN_FROM_MARS', institutionCode);
    rentalPlanSet.value = rentalPlanFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch bank list
    await store.dispatch('mars_bankList/BANK_LIST_FROM_MARS', institutionCode);
    bankListSet.value = bankListFromMars.value.bankNames.map(oo => ({
      label: oo,
      value: oo
    }));

    // Fetch network provider
    await store.dispatch('mars_networkProvider/NETWORK_PROVIDER', institutionCode);
    networkProviderListSet.value = networkProviderFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Fetch service provider
    await store.dispatch('mars_serviceProvider/SERVICE_PROVIDER', institutionCode);
    serviceProviderListSet.value = serviceProviderFromMars.value.items.map(oo => ({
      label: oo.name,
      value: oo.code
    }));

    // Load saved data if applicable
    const marsFormSubmitAction = props.propLeadDeatils.marsFormSubmitAction;
    if ([1, 2].includes(marsFormSubmitAction)) {
      const res = await store.dispatch('mars_dataSubmit/FETCH_SAVED_DATA_FROM_OWN_DB', {
        leadId: route.params.id
      });

      // Format dates
      res.salesInformation.applicationDate = commonDateFormat(res.salesInformation.applicationDate);
      res.salesInformation.aggreementDate = commonDateFormat(res.salesInformation.aggreementDate);
      res.salesInformation.loanDisbursementDate = commonDateFormat(res.salesInformation.loanDisbursementDate);
      res.salesInformation.tenureStartDate = commonDateFormat(res.salesInformation.tenureStartDate);
      res.companyInformation.establishYear = commonDateFormat(res.companyInformation.establishYear);
      res.bankInformation.collectionDetails.chequeDepositedDate = commonDateFormat(res.bankInformation.collectionDetails.chequeDepositedDate);
      res.bankInformation.collectionDetails.collectedDate = commonDateFormat(res.bankInformation.collectionDetails.collectedDate);
      res.bankInformation.collectionDetails.chequeDate = commonDateFormat(res.bankInformation.collectionDetails.chequeDate);
      res.businessInformation.memberSince = commonDateFormat(res.businessInformation.memberSince);

      // Update merchant data
      Object.assign(merchant.salesInformation, res.salesInformation);
      Object.assign(merchant.companyInformation, res.companyInformation);
      merchant.partnerInformation = res.partnerInformation;
      Object.assign(merchant.businessInformation, res.businessInformation);
      Object.assign(merchant.paymentDetails, res.paymentDetails);
      Object.assign(merchant.mdrPlan, res.mdrPlan);
      Object.assign(merchant.SharingDiscountFee, res.SharingDiscountFee);
      Object.assign(merchant.bankInformation, res.bankInformation);
      Object.assign(merchant.kyc, res.kyc);

      showPartnerstab.value = $PARTNERS_TAB_ENABLED_ITEMS.includes(
        merchant.companyInformation.constitution
      );
    } else {
      // Initialize with lead details
      const leadDetails = props.propLeadDeatils;
      merchant.salesInformation.applicationNumber = Math.floor(Date.now() / 1000 + 22 * 10);
      merchant.companyInformation.dbaName = leadDetails.leadName;
      merchant.companyInformation.contactMobile = leadDetails.contactNumber;
      merchant.companyInformation.contactName = leadDetails.contactName;
      merchant.companyInformation.registeredAddress = leadDetails.leadAddress;
      merchant.companyInformation.registeredPin = leadDetails.pincode;
      merchant.companyInformation.constitution = leadDetails.merchantType.marsMappingId;
      merchant.companyInformation.constitutionName = leadDetails.merchantType.merchantTypeName;
      merchant.mdrPlan.domesticDebitUpTo2000.percentage = leadDetails.debitLessthanAmount;
      merchant.mdrPlan.domesticDebitAbove2000.percentage = leadDetails.debitGreaterthanAmount;
      merchant.mdrPlan.standardOrClassic.percentage = leadDetails.stdCC;
      merchant.mdrPlan.premiumOrPlatinum.percentage = leadDetails.premiumCC;
      merchant.mdrPlan.superPremiumOrSignature.percentage = leadDetails.superPremiumlCC;
      merchant.mdrPlan.commercialOrCorporate.percentage = leadDetails.corpCC;
      merchant.mdrPlan.internationalCreditCard.percentage = leadDetails.intlCC;
      merchant.paymentDetails.numberOfTerminals = leadDetails.deviceCount;
    }

    $q.loading.hide();
  } catch (error) {

    $q.loading.hide();
    console.error('Error fetching dropdown values:', error);
  }
};

const commonDateFormat = (selectedDate) => {
  if (!selectedDate || selectedDate === 'Invalid date') {
    return null;
  }
  return moment(selectedDate).format('YYYY-MM-DD');
};


// Lifecycle
onMounted(() => {
  fetchAllDropdownValuesFromMARSapi(3);
  showPartnerstab.value = $PARTNERS_TAB_ENABLED_ITEMS.includes(
    merchant.companyInformation.constitution
  );
});
</script>

<style scoped>
.border-1 {
  border: 1px solid #e5e5e5;
}

.q-custom-class {
  min-height: 270px;
}

.custom-z-index {
  z-index: 2;
}
</style>