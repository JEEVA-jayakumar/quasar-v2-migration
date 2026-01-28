<template>
  <q-page padding>
    <q-stepper flat ref="stepper" v-model="step" color="secondary">
      <q-step default name="campaign" title="Device Deployment">
        <div>
          {{ getImplementedQueue?.cpvForm }}
          <div class="row q-col-gutter-sm q-my-xs">
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="merchant.paymentDetails.deviceSerialNumber"
                class="no-margin"
                label="Serial Number"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="merchant.paymentDetails.installationDate"
                class="no-margin"
                label="Installation Date"
                type="date"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="merchant.paymentDetails.deinstallationDate"
                class="no-margin"
                label="DeInstallation Date"
                type="date"
              />
            </div>
          </div>
        </div>
        <br />
        <q-stepper-navigation>
          <div>
            <q-btn class="q-ml-sm" color="primary" @click="finalTerminal(merchant)">Submit to mars</q-btn>
          </div>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

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

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, minLength, maxLength } from '@vuelidate/validators';
import _ from 'lodash';
import moment from 'moment';

const gstn = helpers.regex(
  'gstn',
  /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
);

export default defineComponent({
  name: 'DeviceDeployment',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    
    const stepper = ref(null);
    const step = ref('campaign');
    const check = ref(false);
    const merchantTypeSelection = ref('');
    const stateOptions = ref([]);
    const cityOptions = ref([]);
    const PDFDetails = ref(null);
    const toggleshowPDFModal = ref(false);
    
    // Form data
    const formData = ref({
      shortLead: null,
      documentType: []
    });
    
    const info = ref({
      datainfo1: ''
    });
    
    const merchant = ref({
      salesInformation: {
        institutionCode: ''
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
        applicationNumber: ''
      },
      bankInformation: {
        bankDetails: {
          accountNumber: '',
          ifsc: '',
          bankName: '',
          paymentMode: '',
          accountType: ''
        }
      },
      businessInformation: {
        gstId: ''
      },
      kyc: {
        documents: []
      },
      paymentDetails: {
        settlementType: '',
        tipEnabled: '',
        cashAtPosEnabled: '',
        intlCardAcceptance: '',
        preAuth: '',
        rentalPlanCode: '',
        deviceSerialNumber: '',
        installationDate: '',
        deinstallationDate: ''
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
      }
    });
    
    const formdata = ref({
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
      amountCollected: '',
      merchantCategory: '',
      corpCC: '',
      debitGreaterthanAmount: '',
      debitLessthanAmount: '',
      premiumCC: '',
      pricing: 1,
      leadStatus: '',
      submittoRSMDate: '',
      posIncentive: '',
      posEnable: '',
      leadName: '',
      paymentDocumentFile: '',
      paymentDocumentMimeType: ''
    });
    
    const formdata1 = ref({
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
      amountCollected: '',
      merchantCategory: '',
      corpCC: '',
      debitGreaterthanAmount: '',
      debitLessthanAmount: '',
      premiumCC: '',
      pricing: 1,
      leadStatus: '',
      submittoRSMDate: '',
      posIncentive: '',
      posEnable: '',
      leadName: '',
      paymentDocumentFile: '',
      paymentDocumentMimeType: ''
    });
    
    const dropDown = ref({
      deviceOptions: [],
      planOptions: [],
      leadSourceOptions: [],
      merchantTypesOptions: []
    });
    
    const error = ref({
      field: {
        merchant: {
          businessInformation: {
            gstId: {
              alert: false,
              issue: '',
              value: ''
            }
          }
        }
      }
    });
    
    const payment = ref([
      { label: 'Cheque', value: 2 },
      { label: 'Swipe', value: 3 },
      { label: 'Neft', value: 1 }
    ]);
    
    const autoormanualOptions = ref([
      { label: 'Auto Settlement', value: 'A' },
      { label: 'Manual Settlement', value: 'M' }
    ]);
    
    const preauthOptions = ref([
      { label: 'Enable', value: 'Y' },
      { label: 'Disable', value: 'N' }
    ]);
    
    const cashandposOptions = ref([
      { label: 'Enable', value: 'Y' },
      { label: 'Disable', value: 'N' }
    ]);
    
    const internationalcardOptions = ref([
      { label: 'Enable', value: 'Y' },
      { label: 'Disable', value: 'N' }
    ]);
    
    const tipOptions = ref([
      { label: 'Enable', value: 'Y' },
      { label: 'Disable', value: 'N' }
    ]);
    
    const paymnentModeOptions = ref([
      { label: 'Direct credit', value: 'D' },
      { label: 'NEFT', value: 'N' }
    ]);
    
    const accountTypeOptions = ref([
      { label: 'Saving account', value: 'S' },
      { label: 'Current account', value: 'C' },
      { label: 'Overdraft account', value: 'O' },
      { label: 'Cash credit account', value: 'R' }
    ]);
    
    // Validation rules
    const rules = {
      formdata: {
        referenceNumber: { required },
        paymentOption: { required },
        paymentMadeon: { required }
      },
      merchant: {
        businessInformation: {
          gstId: {
            gstn,
            maxLength: maxLength(15),
            minLength: minLength(15)
          }
        }
      }
    };
    
    const $v = useVuelidate(rules, { formdata, merchant });
    
    // Computed properties
    const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo']);
    const getDeviceVerificationStatus = computed(() => store.getters['SatLeadValidation/getDeviceVerificationStatus']);
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);
    const getAllDevicesInfo = computed(() => store.getters['SA_Devices/getAllDevicesInfo']);
    const getActiveLeadSource = computed(() => store.getters['leadSource/getActiveLeadSource']);
    const getActivePlan = computed(() => store.getters['plan/getActivePlan']);
    const categoryBasedMdr = computed(() => store.getters['CategoryBasedMdr/categoryBasedMdr']);
    const getAllMarsData = computed(() => store.getters['GetMarsData/getAllMarsData']);
    const getImplementedQueue = computed(() => store.getters['GetMarsData/getImplementedQueue']);
    const getShortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes']);
    const cityFromMars = computed(() => store.getters['mars_city/cityFromMars']);
    const stateFromMars = computed(() => store.getters['mars_state/stateFromMars']);
    const ifscFromMars = computed(() => store.getters['mars_ifsc/ifscFromMars']);
    
    // Methods
    const ajaxLoadLeadDataEntryInfo = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });
      
      try {
        await store.dispatch('GetMarsData/IMPLEMENTED_QUEUE', route.params.id);
        
        if (getImplementedQueue.value) {
          merchant.value.kyc.documents.push({
            documentName: 'CPV Form',
            documentType: 11,
            documentImage: [
              `${GLOBAL_FILE_FETCH_URL.value}/${getImplementedQueue.value.cpvForm}`
            ]
          });
          
          merchant.value.kyc.documents.push({
            documentName: 'Implementation Form',
            documentType: 11,
            documentImage: [
              `${GLOBAL_FILE_FETCH_URL.value}/${getImplementedQueue.value.implementationForm}`
            ]
          });
          
          merchant.value.kyc.documents.push({
            documentName: 'Picture of Shop',
            documentType: 11,
            documentImage: [
              `${GLOBAL_FILE_FETCH_URL.value}/${getImplementedQueue.value.pictureOfShop}`
            ]
          });
        }
      } catch (error) {

        console.error('Error loading lead data:', error);
      } finally {
        $q.loading.hide();
      }
    };
    
    const sendtoFinance = async (request) => {
      await $v.value.formdata.$validate();
      if ($v.value.formdata.$error) {
        $q.notify('Please review fields again.');
        return;
      }
      
      if (formdata.value.paymentOption == 2 && formdata.value.paymentDocumentFile == '') {
        $q.notify({
          color: 'amber',
          position: 'bottom',
          message: 'Please attach the Cheque File',
          icon: 'attachment'
        });
        return;
      }
      
      const requestparams = {
        url: {
          id: getShortLeadInfo.value?.id
        },
        params: {
          ...request,
          leadCategory: check.value ? 2 : 1,
          pricing: check.value ? 1 : 0
        }
      };
      
      try {
        await store.dispatch('SendTORSMCMS/SEND_TO_RSM_CMS', requestparams);
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully sent to Finance',
          icon: 'thumb_up'
        });
        router.push('/sat/change/management');
      } catch (error) {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          icon: 'thumb_down',
          message: error.data?.message || 'Error sending to Finance'
        });
      }
    };
    
    const sendtoNH = async (request) => {
      const requestparams = {
        url: {
          id: getShortLeadInfo.value?.id
        },
        params: {
          ...request,
          leadCategory: check.value ? 2 : 1,
          pricing: check.value ? 1 : 0
        }
      };
      
      try {
        await store.dispatch('SendTORSMCMS/SEND_TO_RSM_CMS', requestparams);
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully sent to RSM',
          icon: 'thumb_up'
        });
        router.push('/sat/change/management');
      } catch (error) {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          icon: 'thumb_down',
          message: error.data?.message || 'Error sending to RSM'
        });
      }
    };
    
    const fnVerificationDocumentUpload = async (event, documentDetails) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Uploading file ..'
      });
      
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      
      const requestParams = {
        files: formData,
        leadId: route.params.id,
        documentId: documentDetails.id
      };
      
      try {
        await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', requestParams);
        if (getShortLeadInfo.value?.id) {
          await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', getShortLeadInfo.value.id);
        }
      } catch {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Failed to upload document',
          icon: 'thumb_down'
        });
      } finally {
        $q.loading.hide();
      }
    };
    
    const ajaxLoadDataForDeviceTypeTable1 = async () => {
      try {
        await store.dispatch('SA_Devices/FETCH_DEVICES_DATA');
        dropDown.value.deviceOptions = getAllDevicesInfo.value?.map(item => ({
          value: item.id,
          label: item.deviceName
        })) || [];
        
        await store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST');
        dropDown.value.leadSourceOptions = getActiveLeadSource.value?.map(item => ({
          value: item.id,
          label: item.sourceName
        })) || [];
        
        await store.dispatch('plan/PLAN_ACTIVE_LIST');
        dropDown.value.planOptions = getActivePlan.value?.map(item => ({
          value: item.id,
          label: item.planName
        })) || [];
      } catch (error) {

        console.error('Error loading device data:', error);
      }
    };
    
    const ajaxLoadMarsData = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });
      
      try {
        await store.dispatch('GetMarsData/FETCH_MARS_DATA', 382);
        
        if (getAllMarsData.value) {
          merchant.value.paymentDetails.settlementType = getAllMarsData.value.paymentDetails?.settlementType;
          merchant.value.paymentDetails.tipEnabled = getAllMarsData.value.paymentDetails?.tipEnabled;
          merchant.value.paymentDetails.cashAtPosEnabled = getAllMarsData.value.paymentDetails?.cashAtPosEnabled;
          merchant.value.paymentDetails.intlCardAcceptance = getAllMarsData.value.paymentDetails?.intlCardAcceptance;
          merchant.value.paymentDetails.preAuth = getAllMarsData.value.paymentDetails?.preAuth;
          merchant.value.paymentDetails.rentalPlanCode = getAllMarsData.value.paymentDetails?.rentalPlanCode;
          merchant.value.salesInformation.institutionCode = getAllMarsData.value.salesInformation?.institutionCode;
          
          fetchAndCookDocuments();
        }
      } catch (error) {

        console.error('Error loading Mars data:', error);
      } finally {
        $q.loading.hide();
      }
    };
    
    const finalTerminal = async (request) => {
      const key = merchant.value.salesInformation.institutionCode;
      $q.localStorage.set('a_t', key);
      
      const requestparams = {
        url: {
          id: getAllMarsData.value?.merchantRefCode
        },
        params: {
          merchant: {
            companyInformation: {
              applicationNumber: getAllMarsData.value?.salesInformation?.applicationNumber
            },
            kyc: request.kyc
          }
        }
      };
      
      const terminalparams = {
        terminal: {
          id: getAllMarsData.value?.paymentDetails?.terminalModeCode
        },
        terminalparams: {
          merchant: {
            companyInformation: {
              applicationNumber: getAllMarsData.value?.salesInformation?.applicationNumber
            },
            paymentDetails: request.paymentDetails
          },
          paymentDetails: {
            deviceSerialNumber: request.paymentDetails.deviceSerialNumber,
            installationDate: request.paymentDetails.installationDate,
            deinstallationDate: request.paymentDetails.deinstallationDate
          }
        }
      };
      
      try {
        await store.dispatch('CMS_EDIT_MDR/CMS_EDIT_TERMINAL', terminalparams);
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Terminal updated successfully',
          icon: 'thumb_up'
        });
        
        await store.dispatch('CMS_EDIT_MDR/CMS_EDIT_KYC', requestparams);
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'KYC updated successfully',
          icon: 'thumb_up'
        });
      } catch (error) {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          icon: 'thumb_down',
          message: error.data?.message || 'Error updating terminal/KYC'
        });
      }
    };
    
    const finalFormSubmit = async (request) => {
      const key = merchant.value.salesInformation.institutionCode;
      $q.localStorage.set('a_t', key);
      
      const requestparams = {
        url: {
          id: getAllMarsData.value?.merchantRefCode
        },
        params: {
          merchant: {
            companyInformation: {
              applicationNumber: getAllMarsData.value?.salesInformation?.applicationNumber
            },
            mdrPlan: request.mdrPlan
          }
        }
      };
      
      try {
        await store.dispatch('CMS_EDIT_MDR/CMS_EDIT_MDR', requestparams);
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'MDR updated successfully',
          icon: 'thumb_up'
        });
      } catch (error) {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          icon: 'thumb_down',
          message: error.data?.message || 'Error updating MDR'
        });
      }
    };
    
    const finalFormSubmitKyc = async (request) => {
      const key = merchant.value.salesInformation.institutionCode;
      $q.localStorage.set('a_t', key);
      
      const requestparams = {
        url: {
          id: getAllMarsData.value?.merchantRefCode
        },
        params: {
          merchant: {
            companyInformation: {
              applicationNumber: getAllMarsData.value?.salesInformation?.applicationNumber
            },
            kyc: request.kyc
          }
        }
      };
      
      try {
        await store.dispatch('CMS_EDIT_MDR/CMS_EDIT_KYC', requestparams);
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'KYC updated successfully',
          icon: 'thumb_up'
        });
      } catch (error) {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          icon: 'thumb_down',
          message: error.data?.message || 'Error updating KYC'
        });
      }
    };
    
    const fetchAllDropdownValuesFromMARSapi = async () => {
      try {
        await store.dispatch('mars_city/CITY_FROM_MARS');
        cityOptions.value = cityFromMars.value?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        
        await store.dispatch('mars_state/STATE_FROM_MARS');
        stateOptions.value = stateFromMars.value?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
      } catch (error) {

        console.error('Error fetching dropdown values:', error);
      }
    };
    
    const fetchAndCookDocuments = () => {
      if (getImplementedQueue.value?.cpvForm) {
        merchant.value.kyc.documents.push({
          documentName: 'Agreement',
          documentType: 11,
          documentImage: [
            `${GLOBAL_FILE_FETCH_URL.value}/${getImplementedQueue.value.cpvForm}`
          ]
        });
      }
    };
    
    const populateBankDetails = async () => {
      try {
        await store.dispatch('mars_ifsc/IFSC_FROM_MARS', merchant.value.bankInformation.bankDetails.ifsc);
        if (ifscFromMars.value?.bankName) {
          merchant.value.bankInformation.bankDetails.bankName = ifscFromMars.value.bankName;
        } else {
          $q.notify({
            color: 'negative',
            position: 'bottom-left',
            message: 'Invalid IFSC code',
            icon: 'clear'
          });
          merchant.value.bankInformation.bankDetails.ifsc = '';
          merchant.value.bankInformation.bankDetails.bankName = '';
        }
      } catch (error) {

        console.error('Error fetching bank details:', error);
      }
    };
    
    const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
      return _.filter(arraySet, function(oo) {
        return (
          oo.label.toLowerCase().includes(terms.toLowerCase()) ||
          oo.value.toString().includes(terms.toString())
        );
      });
    };
    
    const residentStateSearch = (terms) => {
      return COMMON_FILTER_FUNCTION(stateOptions.value, terms);
    };
    
    const registeredStateSelected = (item) => {
      merchant.value.companyinformation.registeredStateName = item.label;
      merchant.value.companyinformation.registeredStateRefCode = item.value;
    };
    
    const residentCitySearch = (terms) => {
      return COMMON_FILTER_FUNCTION(cityOptions.value, terms);
    };
    
    const registeredCitySelected = (item) => {
      merchant.value.companyinformation.registeredCityName = item.label;
      merchant.value.companyinformation.registeredCityRefCode = item.value;
    };
    
    const commonDateFormat = (selectedDate) => {
      if (!selectedDate || selectedDate === 'Invalid date') {
        return null;
      }
      return moment(selectedDate).format('DD/MM/YYYY');
    };
    
    const goBackToDocumentVerificationStage = async () => {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to proceed to document verification stage?',
        ok: 'Continue',
        cancel: 'Cancel'
      }).onOk(async () => {
        $q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Processing ..'
        });
        
        const formData = {
          leadId: route.params.id,
          defaultUrlValue: 0 // Replace with actual constants
        };
        
        try {
          await store.dispatch('SatLeadValidation/MOVE_BACK_DOCUMENT_VERIFICATION_STAGE', formData);
          router.push(`/sat/lead/validation/${route.params.id}`);
        } catch (error) {

          console.error('Error moving back:', error);
        } finally {
          $q.loading.hide();
        }
      });
    };
    
    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadLeadDataEntryInfo();
      ajaxLoadMarsData();
    });
    
    return {
      // Refs
      stepper,
      step,
      check,
      merchantTypeSelection,
      PDFDetails,
      toggleshowPDFModal,
      formData,
      info,
      merchant,
      formdata,
      formdata1,
      dropDown,
      error,
      payment,
      autoormanualOptions,
      preauthOptions,
      cashandposOptions,
      internationalcardOptions,
      tipOptions,
      paymnentModeOptions,
      accountTypeOptions,
      stateOptions,
      cityOptions,
      
      // Computed
      getShortLeadInfo,
      getDeviceVerificationStatus,
      GLOBAL_FILE_FETCH_URL,
      getAllDevicesInfo,
      getActiveLeadSource,
      getActivePlan,
      categoryBasedMdr,
      getAllMarsData,
      getImplementedQueue,
      getShortLeadInfoDocumentTypes,
      cityFromMars,
      stateFromMars,
      ifscFromMars,
      
      // Methods
      sendtoFinance,
      sendtoNH,
      fnVerificationDocumentUpload,
      ajaxLoadDataForDeviceTypeTable1,
      ajaxLoadMarsData,
      finalTerminal,
      finalFormSubmit,
      finalFormSubmitKyc,
      fetchAllDropdownValuesFromMARSapi,
      fetchAndCookDocuments,
      populateBankDetails,
      residentStateSearch,
      registeredStateSelected,
      residentCitySearch,
      registeredCitySelected,
      commonDateFormat,
      goBackToDocumentVerificationStage,
      
      // Validation
      $v
    };
  }
});
</script>