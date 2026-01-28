<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 q-title q-pb-md text-weight-regular bottom-border">
        Add MDR Details
      </div>
      
      <div class="col-md-5 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <!-- Common fields -->
            <div class="q-mb-md">
              <q-select
                outlined
                color="purple-9"
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                label="Select lead source"
                :error="v.formData.leadSource.$error"
                @blur="v.formData.leadSource.$touch"
                class="q-mb-md"
              />
              <div class="row items-center">
                <q-select
                  outlined
                  color="purple-9"
                  v-model="formData.device"
                  @update:model-value="onChange"
                  :options="dropDown.deviceOptions"
                  label="Select device"
                  :error="v.formData.device.$error"
                  @blur="v.formData.device.$touch"
                  class="col"
                />
                <q-btn
                  round
                  @click="fnManageDevice"
                  size="sm"
                  icon="add"
                  color="purple-9"
                  class="q-ml-sm"
                />
              </div>
            </div>

            <q-select
              outlined
              color="purple-9"
              v-model="formData.marsDeviceModel"
              :options="dropDown.marsDeviceOptions"
              label="Mars Device Model"
              :error="v.formData.marsDeviceModel.$error"
              @blur="v.formData.marsDeviceModel.$touch"
              class="q-mb-md"
            />

            <q-select
              outlined
              color="purple-9"
              v-model="formData.merchantType"
              :options="dropDown.merchantTypesOptions"
              label="Select merchant category type"
              @update:model-value="fnCategoryBasedMdr"
              :error="v.formData.merchantType.$error"
              @blur="v.formData.merchantType.$touch"
              class="q-mb-md"
            />

            <q-input
              outlined
              color="purple-9"
              type="text"
              v-model="formData.mdrPlanName"
              label="Mdr Plan Name"
              :error="v.formData.mdrPlanName.$error"
              @blur="v.formData.mdrPlanName.$touch"
              class="q-mb-md"
            />

            <!-- Conditional fields based on deviceId -->
            <div v-if="deviceId == 1">
              <div class="text-h6 q-mb-md">Device Type 1 MDR Charges</div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.debitLessthanAmount"
                    label="Debit <= 2000 %"
                    :error="formData.debitLessthanAmount && (formData.debitLessthanAmount < 0 || formData.debitLessthanAmount > 100)"
                    @blur="v.formData.debitLessthanAmount.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.debitGreaterthanAmount"
                    label="Debit > 2000 %"
                    :error="formData.debitGreaterthanAmount && (formData.debitGreaterthanAmount < 0 || formData.debitGreaterthanAmount > 100)"
                    @blur="v.formData.debitGreaterthanAmount.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.stdCC"
                    label="Std CC %"
                    :error="formData.stdCC && (formData.stdCC < 0 || formData.stdCC > 100)"
                    @blur="v.formData.stdCC.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.premiumCC"
                    label="Premium CC %"
                    :error="formData.premiumCC && (formData.premiumCC < 0 || formData.premiumCC > 100)"
                    @blur="v.formData.premiumCC.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.corpCC"
                    label="Corp Pre CC %"
                    :error="formData.corpCC && (formData.corpCC < 0 || formData.corpCC > 100)"
                    @blur="v.formData.corpCC.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.intlCC"
                    label="Intl Pre CC %"
                    :error="formData.intlCC && (formData.intlCC < 0 || formData.intlCC > 100)"
                    @blur="v.formData.intlCC.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.superPremiumlCC"
                    label="Super Pre CC %"
                    :error="formData.superPremiumlCC && (formData.superPremiumlCC < 0 || formData.superPremiumlCC > 100)"
                    @blur="v.formData.superPremiumlCC.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.amexDomestic"
                    label="Amex Domestic %"
                    :error="formData.amexDomestic && (formData.amexDomestic < 0 || formData.amexDomestic > 100)"
                    @blur="v.formData.amexDomestic.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.amexInternational"
                    label="Amex International %"
                    :error="formData.amexInternational && (formData.amexInternational < 0 || formData.amexInternational > 100)"
                    @blur="v.formData.amexInternational.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.upiDebitCardUpTo2000"
                    label="UPI Debit Card UpTo 2000 %"
                    :error="formData.upiDebitCardUpTo2000 && (formData.upiDebitCardUpTo2000 < 0 || formData.upiDebitCardUpTo2000 > 100)"
                    @blur="v.formData.upiDebitCardUpTo2000.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.upiDebitCardAbove2000"
                    label="UPI Debit Card Above 2000 %"
                    :error="formData.upiDebitCardAbove2000 && (formData.upiDebitCardAbove2000 < 0 || formData.upiDebitCardAbove2000 > 100)"
                    @blur="v.formData.upiDebitCardAbove2000.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.upiPrepaidCreditCardsUpTo2000"
                    label="UPI Prepaid Credit Cards UpTo 2000 %"
                    :error="formData.upiPrepaidCreditCardsUpTo2000 && (formData.upiPrepaidCreditCardsUpTo2000 < 0 || formData.upiPrepaidCreditCardsUpTo2000 > 100)"
                    @blur="v.formData.upiPrepaidCreditCardsUpTo2000.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.upiPrepaidCreditCardsAbove2000"
                    label="UPI Prepaid Credit Cards Above 2000 %"
                    :error="formData.upiPrepaidCreditCardsAbove2000 && (formData.upiPrepaidCreditCardsAbove2000 < 0 || formData.upiPrepaidCreditCardsAbove2000 > 100)"
                    @blur="v.formData.upiPrepaidCreditCardsAbove2000.$touch"
                  />
                </div>
              </div>
            </div>
            
            <div v-else>
              <div class="text-h6 q-mb-md">Other Device Types MDR Charges</div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.smallMerchantLessThanTwoDebit"
                    label="Small Merchant < 2000 % debit Card"
                    :error="formData.smallMerchantLessThanTwoDebit && (formData.smallMerchantLessThanTwoDebit < 0 || formData.smallMerchantLessThanTwoDebit > 100)"
                    @blur="v.formData.smallMerchantLessThanTwoDebit.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.smallMerchantGreaterThanTwoDebit"
                    label="Small Merchant > 2000 % debit Card"
                    :error="formData.smallMerchantGreaterThanTwoDebit && (formData.smallMerchantGreaterThanTwoDebit < 0 || formData.smallMerchantGreaterThanTwoDebit > 100)"
                    @blur="v.formData.smallMerchantGreaterThanTwoDebit.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.smallMerchantLessThanTwoCreditAndPrepaid"
                    label="Small Merchant < 2000 % credit and prepaid card"
                    :error="formData.smallMerchantLessThanTwoCreditAndPrepaid && (formData.smallMerchantLessThanTwoCreditAndPrepaid < 0 || formData.smallMerchantLessThanTwoCreditAndPrepaid > 100)"
                    @blur="v.formData.smallMerchantLessThanTwoCreditAndPrepaid.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.smallMerchantGreaterThanTwoCreditAndPrepaid"
                    label="Small Merchant > 2000 % credit and prepaid card"
                    :error="formData.smallMerchantGreaterThanTwoCreditAndPrepaid && (formData.smallMerchantGreaterThanTwoCreditAndPrepaid < 0 || formData.smallMerchantGreaterThanTwoCreditAndPrepaid > 100)"
                    @blur="v.formData.smallMerchantGreaterThanTwoCreditAndPrepaid.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.largeMerchantLessThanTwoDebit"
                    label="Large Merchant < 2000 % debit Card"
                    :error="formData.largeMerchantLessThanTwoDebit && (formData.largeMerchantLessThanTwoDebit < 0 || formData.largeMerchantLessThanTwoDebit > 100)"
                    @blur="v.formData.largeMerchantLessThanTwoDebit.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.largeMerchantGreaterThanTwoDebit"
                    label="Large Merchant > 2000 % debit Card"
                    :error="formData.largeMerchantGreaterThanTwoDebit && (formData.largeMerchantGreaterThanTwoDebit < 0 || formData.largeMerchantGreaterThanTwoDebit > 100)"
                    @blur="v.formData.largeMerchantGreaterThanTwoDebit.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.largeMerchantLessThanTwoCreditandPrepaid"
                    label="Large Merchant < 2000 % credit and prepaid card"
                    :error="formData.largeMerchantLessThanTwoCreditandPrepaid && (formData.largeMerchantLessThanTwoCreditandPrepaid < 0 || formData.largeMerchantLessThanTwoCreditandPrepaid > 100)"
                    @blur="v.formData.largeMerchantLessThanTwoCreditandPrepaid.$touch"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    color="purple-9"
                    type="number"
                    v-model="formData.largeMerchantGreaterThanTwoCreditandPrepaid"
                    label="Large Merchant > 2000 % credit and prepaid card"
                    :error="formData.largeMerchantGreaterThanTwoCreditandPrepaid && (formData.largeMerchantGreaterThanTwoCreditandPrepaid < 0 || formData.largeMerchantGreaterThanTwoCreditandPrepaid > 100)"
                    @blur="v.formData.largeMerchantGreaterThanTwoCreditandPrepaid.$touch"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
          
          <q-card-actions vertical align="right" class="q-pa-md">
            <q-btn
              :disable="Submitdata"
              label="Submit"
              @click="fnsubmit"
              color="purple-9"
              class="full-width"
            />
          </q-card-actions>
        </q-card>
      </div>
      
      <div class="col-md-7 col-sm-12 col-xs-12">
        <!-- Table component can be added here -->
      </div>
      
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      />
      
      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      />
      
      <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="fnManageMerchantType"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';
import { useStore } from 'vuex';

import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";

const $q = useQuasar();
const store = useStore();

const showLeadSourceModal = ref(false);
const showDeviceDetailModal = ref(false);
const showMerchantModal = ref(false);
const Submitdata = ref(false);
const deviceId = ref("");

const formData = ref({
  leadSource: "",
  device: "",
  marsDeviceModel: "",
  merchantType: "",
  mdrPlanName: "",
  debitLessthanAmount: "",
  debitGreaterthanAmount: "",
  stdCC: "",
  premiumCC: "",
  corpCC: "",
  intlCC: "",
  superPremiumlCC: "",
  amexDomestic: "",
  amexInternational: "",
  smallMerchantLessThanTwoDebit: "",
  smallMerchantGreaterThanTwoDebit: "",
  smallMerchantLessThanTwoCreditAndPrepaid: "",
  smallMerchantGreaterThanTwoCreditAndPrepaid: "",
  largeMerchantLessThanTwoDebit: "",
  largeMerchantGreaterThanTwoDebit: "",
  largeMerchantLessThanTwoCreditandPrepaid: "",
  largeMerchantGreaterThanTwoCreditandPrepaid: "",
  upiDebitCardUpTo2000: "",
  upiDebitCardAbove2000: "",
  upiPrepaidCreditCardsUpTo2000: "",
  upiPrepaidCreditCardsAbove2000: "",
});

const dropDown = ref({
  deviceOptions: [],
  leadSourceOptions: [],
  marsDeviceOptions: [],
  merchantTypesOptions: [],
});

const rules = {
  formData: {
    leadSource: { required },
    device: { required },
    marsDeviceModel: { required },
    merchantType: { required },
    mdrPlanName: { required },
    debitLessthanAmount: { minValue: minValue(0), maxValue: maxValue(100) },
    debitGreaterthanAmount: { minValue: minValue(0), maxValue: maxValue(100) },
    stdCC: { minValue: minValue(0), maxValue: maxValue(100) },
    premiumCC: { minValue: minValue(0), maxValue: maxValue(100) },
    corpCC: { minValue: minValue(0), maxValue: maxValue(100) },
    intlCC: { minValue: minValue(0), maxValue: maxValue(100) },
    superPremiumlCC: { minValue: minValue(0), maxValue: maxValue(100) },
    amexDomestic: { minValue: minValue(0), maxValue: maxValue(100) },
    amexInternational: { minValue: minValue(0), maxValue: maxValue(100) },
    upiDebitCardUpTo2000: { minValue: minValue(0), maxValue: maxValue(100) },
    upiDebitCardAbove2000: { minValue: minValue(0), maxValue: maxValue(100) },
    upiPrepaidCreditCardsUpTo2000: { minValue: minValue(0), maxValue: maxValue(100) },
    upiPrepaidCreditCardsAbove2000: { minValue: minValue(0), maxValue: maxValue(100) },
    smallMerchantLessThanTwoDebit: { minValue: minValue(0), maxValue: maxValue(100) },
    smallMerchantGreaterThanTwoDebit: { minValue: minValue(0), maxValue: maxValue(100) },
    smallMerchantLessThanTwoCreditAndPrepaid: { minValue: minValue(0), maxValue: maxValue(100) },
    smallMerchantGreaterThanTwoCreditAndPrepaid: { minValue: minValue(0), maxValue: maxValue(100) },
    largeMerchantLessThanTwoDebit: { minValue: minValue(0), maxValue: maxValue(100) },
    largeMerchantGreaterThanTwoDebit: { minValue: minValue(0), maxValue: maxValue(100) },
    largeMerchantLessThanTwoCreditandPrepaid: { minValue: minValue(0), maxValue: maxValue(100) },
    largeMerchantGreaterThanTwoCreditandPrepaid: { minValue: minValue(0), maxValue: maxValue(100) },
  }
};

const v = useVuelidate(rules, { formData });

const getAllDevicesInfo = computed(() => store.getters['SA_Devices/getAllDevicesInfo']);
const getMarsDeviceModel = computed(() => store.getters['SA_Devices/getMarsDeviceModel']);
const getActiveLeadSource = computed(() => store.getters['leadSource/getActiveLeadSource']);
const getActiveMerchantCategory = computed(() => store.getters['merchantCategory/getActiveMerchantCategory']);
const categoryBasedMdr = computed(() => store.getters['CategoryBasedMdr/categoryBasedMdr']);

const onChange = (device) => {
  if (device && device.isDevice) {
    deviceId.value = device.isDevice;
  }
};

const marsDeviceModelDatasLoading = async () => {
  await store.dispatch('SA_Devices/FETCH_MARS_DEVICE_MODEL');
  
  if (Array.isArray(getMarsDeviceModel.value) && getMarsDeviceModel.value.length > 0) {
    dropDown.value.marsDeviceOptions = getMarsDeviceModel.value.map(item => ({
      label: item.name,
      value: JSON.stringify(item),
    }));
  }
};

const ajaxLoadDataForDeviceTypeTable = async () => {
  try {
    await store.dispatch('SA_Devices/FETCH_DEVICES_DATA');
    
    if (Array.isArray(getAllDevicesInfo.value)) {
      dropDown.value.deviceOptions = getAllDevicesInfo.value.map(item => ({
        value: item,
        label: item.deviceName,
      }));
    }

    await store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST');
    if (Array.isArray(getActiveLeadSource.value)) {
      dropDown.value.leadSourceOptions = getActiveLeadSource.value.map(item => ({
        value: item.id,
        label: item.sourceName,
      }));
    }

    await store.dispatch('merchantCategory/MERCHANT_CATEGORY_ACTIVE_LIST');
    if (Array.isArray(getActiveMerchantCategory.value)) {
      dropDown.value.merchantTypesOptions = getActiveMerchantCategory.value.map(item => ({
        value: item.id,
        label: item.merchantCategoryName,
      }));
    }
  } catch (error) {
    console.error('Error loading data:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load dropdown data',
      position: 'bottom'
    });
  }
};

const fnsubmit = async () => {
  await v.value.formData.$validate();
  
  if (v.value.formData.$error) {
    $q.notify({
      type: 'warning',
      message: 'Please review fields again.',
      position: 'bottom'
    });
    return;
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..',
  });
  
  Submitdata.value = true;

  try {
    const requestParams = {
      url: {
        leadSource: formData.value.leadSource,
        device: formData.value.device?.id || '',
        merchantType: formData.value.merchantType,
      },
      params: {
        marsDeviceModel: formData.value.marsDeviceModel ? JSON.parse(formData.value.marsDeviceModel) : null,
        mdrPlanName: formData.value.mdrPlanName,
        debitLessthanAmount: formData.value.debitLessthanAmount || null,
        debitGreaterthanAmount: formData.value.debitGreaterthanAmount || null,
        stdCC: formData.value.stdCC || null,
        premiumCC: formData.value.premiumCC || null,
        corpCC: formData.value.corpCC || null,
        intlCC: formData.value.intlCC || null,
        superPremiumlCC: formData.value.superPremiumlCC || null,
        amexDomestic: formData.value.amexDomestic || null,
        amexInternational: formData.value.amexInternational || null,
        smallMerchantLessThanTwoDebit: formData.value.smallMerchantLessThanTwoDebit || null,
        smallMerchantGreaterThanTwoDebit: formData.value.smallMerchantGreaterThanTwoDebit || null,
        smallMerchantLessThanTwoCreditAndPrepaid: formData.value.smallMerchantLessThanTwoCreditAndPrepaid || null,
        smallMerchantGreaterThanTwoCreditAndPrepaid: formData.value.smallMerchantGreaterThanTwoCreditAndPrepaid || null,
        largeMerchantLessThanTwoDebit: formData.value.largeMerchantLessThanTwoDebit || null,
        largeMerchantGreaterThanTwoDebit: formData.value.largeMerchantGreaterThanTwoDebit || null,
        largeMerchantLessThanTwoCreditandPrepaid: formData.value.largeMerchantLessThanTwoCreditandPrepaid || null,
        largeMerchantGreaterThanTwoCreditandPrepaid: formData.value.largeMerchantGreaterThanTwoCreditandPrepaid || null,
        upiDebitCardUpTo2000: formData.value.upiDebitCardUpTo2000 || null,
        upiDebitCardAbove2000: formData.value.upiDebitCardAbove2000 || null,
        upiPrepaidCreditCardsUpTo2000: formData.value.upiPrepaidCreditCardsUpTo2000 || null,
        upiPrepaidCreditCardsAbove2000: formData.value.upiPrepaidCreditCardsAbove2000 || null,
      },
    };

    await store.dispatch('MdrPlan/MDR_PLAN', requestParams);
    
    $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'MDR Plan created successfully',
      icon: 'thumb_up',
    });

    Object.keys(formData.value).forEach(key => {
      formData.value[key] = '';
    });
    v.value.formData.$reset();
    deviceId.value = '';
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'bottom',
      icon: 'thumb_down',
      message: error.response?.data?.message || 'Failed to create MDR Plan',
    });
  } finally {
    $q.loading.hide();
    Submitdata.value = false;
  }
};

const fnCategoryBasedMdr = async () => {
  if (!formData.value.leadSource || !formData.value.device?.id || !formData.value.merchantType) {
    return;
  }

  try {
    const formDataReq = {
      leadSource: formData.value.leadSource,
      device: formData.value.device.id,
      merchantType: formData.value.merchantType,
    };

    await store.dispatch('CategoryBasedMdr/CATEGORY_BASED_MDR_PLAN', formDataReq);
    
    const mdrData = categoryBasedMdr.value;
    if (mdrData) {
      formData.value.debitLessthanAmount = mdrData.debitLessthanAmount || '';
      formData.value.debitGreaterthanAmount = mdrData.debitGreaterthanAmount || '';
      formData.value.stdCC = mdrData.stdCC || '';
      formData.value.premiumCC = mdrData.premiumCC || '';
      formData.value.corpCC = mdrData.corpCC || '';
      formData.value.intlCC = mdrData.intlCC || '';
      formData.value.superPremiumlCC = mdrData.superPremiumlCC || '';
      formData.value.amexDomestic = mdrData.amexDomestic || '';
      formData.value.amexInternational = mdrData.amexInternational || '';
      formData.value.upiDebitCardUpTo2000 = mdrData.upiDebitCardUpTo2000 || '';
      formData.value.upiDebitCardAbove2000 = mdrData.upiDebitCardAbove2000 || '';
      formData.value.upiPrepaidCreditCardsUpTo2000 = mdrData.upiPrepaidCreditCardsUpTo2000 || '';
      formData.value.upiPrepaidCreditCardsAbove2000 = mdrData.upiPrepaidCreditCardsAbove2000 || '';
    }
  } catch (error) {
    console.error('Error loading category based MDR:', error);
    
    const mdrFields = [
      'debitLessthanAmount', 'debitGreaterthanAmount', 'stdCC', 'premiumCC',
      'corpCC', 'intlCC', 'superPremiumlCC', 'amexDomestic', 'amexInternational',
      'upiDebitCardUpTo2000', 'upiDebitCardAbove2000', 'upiPrepaidCreditCardsUpTo2000',
      'upiPrepaidCreditCardsAbove2000'
    ];
    
    mdrFields.forEach(field => {
      formData.value[field] = '';
    });
  }
};

const fnManageLeadSource = () => {
  showLeadSourceModal.value = !showLeadSourceModal.value;
};

const fnManageDevice = () => {
  showDeviceDetailModal.value = !showDeviceDetailModal.value;
};

const fnManageMerchantType = () => {
  showMerchantModal.value = !showMerchantModal.value;
};

onMounted(() => {
  ajaxLoadDataForDeviceTypeTable();
  marsDeviceModelDatasLoading();
});
</script>

<style scoped>
.bottom-border {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-tooltip {
  position: absolute;
  top: 10%;
  left: 100%;
  background: #d32f2f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  margin-top: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.error-tooltip::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #d32f2f transparent;
}
</style>