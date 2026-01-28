<template>
  <q-page class="q-pa-md">
    <!-- Merchant details -->
    <div class="row q-mb-md">
      <div class="col">
        <div class="text-h6 q-my-md capitalize">{{ shortLead.leadName }}</div>
        <div
          class="text-primary cursor-pointer"
          @click="toggleLeadInformation(shortLead)"
        >
          # {{ shortLead.id }}
        </div>
      </div>
      <div class="col">
        <div class="text-h6 q-my-md">Contact</div>
        <div class="no-margin">{{ shortLead.contactNumber }}</div>
        <div>{{ shortLead.alternateContactNumber }}</div>
      </div>
      <div class="col">
        <div class="text-h6 q-my-md">Address</div>
        <div class="capitalize">{{ shortLead.leadAddress }}</div>
      </div>
    </div>

    <!-- Device, Exception, Payment, MDR and Documents -->
    <div class="row">
      <div class="col-md-6">
        <div class="row">
          <!-- Device -->
          <div class="col-12">
            <q-card class="q-ma-xs border-1" flat bordered>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <div class="row items-center">
                  <div class="col text-weight-medium">
                    Device -
                    {{ shortLead.deviceCount }}
                    {{ shortLead.device?.deviceName }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list separator class="no-padding">
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label>Plan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ shortLead.plan?.planName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label>Setup Fees</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>Rs. {{ formData.leadInformation.setupGivenFees }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label>Recurring Fees</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>Rs. {{ formData.leadInformation.recurringGivenFees }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label>Merchant Category</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ shortLead.merchantCategory?.merchantCategoryName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- MDR -->
          <div class="col-12">
            <q-card class="q-ma-xs border-1" flat bordered>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <span class="text-weight-medium">MDR</span>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Debit <= 2000 (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.debitLessthanAmount"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Debit > 2000 (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.debitGreaterthanAmount"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Std CC (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.stdCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Premium CC (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.premiumCC"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Corp Pre CC (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.corpCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Intl Pre CC (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.intlCC"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        type="number"
                        color="grey-9"
                        label="Super Pre CC (%)"
                        :class="[shouldShowGivenPricefield ? '' : 'no-pointer-events']"
                        :readonly="!shouldShowGivenPricefield"
                        v-model="formData.leadInformation.superPremiumlCC"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="items-start q-pa-sm">
                    <q-checkbox
                      v-model="shortLead.posEnable"
                      color="purple-9"
                      :readonly="!shouldShowGivenPricefield"
                    >
                      <small class="text-caption">Enable Cash@POS Cash @POS incentive Rs.5</small>
                    </q-checkbox>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <q-card class="q-ma-xs border-1" flat bordered>
          <q-card-section class="q-pa-sm bottom-border title-bg">
            <span class="text-weight-medium">Price Details</span>
          </q-card-section>
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Expected Setup Price</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-icon name="fas fa-rupee-sign" size="12px" />
                    {{ formData.leadInformation.setupGivenFees }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Expected Recurring Price</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-icon name="fas fa-rupee-sign" size="12px" />
                    {{ formData.leadInformation.recurringGivenFees }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>SO Remarks</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ shortLead.reason }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="shouldShowGivenPricefield && (shortLead.verifiedPricingStatus != 2 || shortLead.verifiedCmsPricingStatus == 4)"
              >
                <q-item-section>
                  <q-item-label>RSM Remarks</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ getRsmReason?.reason }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="shouldShowGivenPricefield && (shortLead.verifiedPricingStatus != 2 || shortLead.verifiedCmsPricingStatus == 4)"
              >
                <q-item-section>
                  <q-input
                    v-model="formData.leadInformation.recurringFees"
                    @blur="v$.formData.leadInformation.recurringFees.$touch"
                    :error="v$.formData.leadInformation.recurringFees.$error"
                    color="grey-9"
                    @input="fnCheckPrice(formData)"
                    label="Given recurring fees"
                    type="number"
                  />
                </q-item-section>
              </q-item>
              <q-item
                v-if="shouldShowGivenPricefield && (shortLead.verifiedPricingStatus == 2 || shortLead.verifiedCmsPricingStatus == 4)"
              >
                <q-item-section>
                  <q-item-label>Recurring fees</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ formData.leadInformation.recurringGivenFees }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="shouldShowGivenPricefield && (shortLead.verifiedPricingStatus != 2 || shortLead.verifiedCmsPricingStatus == 4)"
              >
                <q-item-section>
                  <q-input
                    v-model="formData.leadInformation.setupFees"
                    @blur="v$.formData.leadInformation.setupFees.$touch"
                    :error="v$.formData.leadInformation.setupFees.$error"
                    color="grey-9"
                    @input="fnCheckPrice(formData)"
                    label="Given Setup Price"
                    type="number"
                  />
                </q-item-section>
              </q-item>
              <q-item
                v-if="shouldShowGivenPricefield && (shortLead.verifiedPricingStatus == 2 || shortLead.verifiedCmsPricingStatus == 4)"
              >
                <q-item-section>
                  <q-item-label>Given Setup Price</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ formData.leadInformation.setupGivenFees }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="!route.params.showAction">
                <q-item-section>
                  <q-input
                    @keyup.enter="shouldShowGivenPricefield ? leadVerificationNHApprove() : leadVerificationApprove()"
                    v-model="formData.leadVerificationStatus.reason"
                    @blur="v$.formData.leadVerificationStatus.reason.$touch"
                    :error="v$.formData.leadVerificationStatus.reason.$error"
                    color="grey-9"
                    label="Remarks"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Final actions -->
    <div class="row" v-if="!route.params.showAction">
      <div class="col-md-12" align="right">
        <q-btn
          icon="block"
          color="grey-5"
          class="q-ma-sm text-dark"
          @click="router.go(-1)"
          label="Cancel"
        />
        <q-btn
          icon="clear"
          color="negative"
          class="q-ma-sm"
          label="Reject"
          @click="leadVerificationReject"
        />
        <q-btn
          v-if="!shouldShowGivenPricefield"
          icon="check"
          color="positive"
          class="q-ma-sm"
          label="Send to NH"
          @click="leadVerificationApprove"
        />
        <q-btn
          v-if="shouldShowGivenPricefield"
          icon="check"
          color="positive"
          class="q-ma-sm"
          label="Approve"
          @click="leadVerificationNHApprove"
        />
      </div>
    </div>

    <!-- Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" size="35" />
    </div>

    <!-- Common lead information in popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, requiredIf } from '@vuelidate/validators';
import _ from 'lodash';
import generalLeadInformation from '../../components/generalLeadInformation.vue';

const $q = useQuasar();
const store = useStore();
const route = useRoute();
const router = useRouter();

// Reactive variables
const shouldShowGivenPricefield = ref(false);
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const toggleAjaxLoadFilter = ref(false);
const shortLead = ref({});
const formData = ref({
  leadInformation: {
    debitGreaterthanAmount: '',
    debitLessthanAmount: '',
    corpCC: '',
    premiumCC: '',
    superPremiumlCC: '',
    intlCC: '',
    stdCC: '',
    setupFees: '',
    recurringFees: '',
    setupGivenFees: '',
    recurringGivenFees: '',
  },
  leadVerificationStatus: {
    reason: '',
  },
});

// Validation rules
const rules = {
  formData: {
    leadInformation: {
      debitGreaterthanAmount: { required },
      debitLessthanAmount: { required },
      corpCC: { required },
      premiumCC: { required },
      superPremiumlCC: { required },
      intlCC: { required },
      stdCC: { required },
      setupFees: {
        required: requiredIf(() => shouldShowGivenPricefield.value === true),
        numeric,
      },
      recurringFees: {
        required: requiredIf(() => shouldShowGivenPricefield.value === true),
        numeric,
      },
    },
    leadVerificationStatus: {
      reason: { required },
    },
  },
};

const v$ = useVuelidate(rules, { formData });

// Computed properties
const getShortLeadInfo = computed(() => store.getters['SalesManagerException/getShortLeadInfo']);

const getRsmReason = computed(() => {
  if (!getShortLeadInfo.value?.leadVerificationStatus) return null;
  return _.find(getShortLeadInfo.value.leadVerificationStatus, (oo) => {
    return oo.verificationType == 4 && oo.status == true;
  });
});

// Methods
const { FETCH_SHORT_LEAD_DATA } = store._actions['SalesManagerException'];
const { PRICING_EXCEPTION_VERIFICATION } = store._actions['rsmPricingExceptionVerification'];

const ajaxLoadShortLeadInfo = async () => {
  try {
    await FETCH_SHORT_LEAD_DATA(route.params.id);
    shortLead.value = { ...getShortLeadInfo.value };
    
    formData.value.leadInformation = {
      debitGreaterthanAmount: getShortLeadInfo.value.debitGreaterthanAmount || '',
      debitLessthanAmount: getShortLeadInfo.value.debitLessthanAmount || '',
      corpCC: getShortLeadInfo.value.corpCC || '',
      premiumCC: getShortLeadInfo.value.premiumCC || '',
      superPremiumlCC: getShortLeadInfo.value.superPremiumlCC || '',
      intlCC: getShortLeadInfo.value.intlCC || '',
      stdCC: getShortLeadInfo.value.stdCC || '',
      setupGivenFees: getShortLeadInfo.value.setupFees || '',
      recurringGivenFees: getShortLeadInfo.value.recurringFees || '',
      setupFees: '',
      recurringFees: '',
    };

    // Check user role
    const userInfo = JSON.parse(localStorage.getItem('u_i') || '{}');
    const roles = userInfo.roles || [];
    const finalObj = _.find(roles, (oo) => {
      return oo.hierarchyRoleLevel == ROLE_HIERARCHY_SALES_NATIONAL_HEAD;
    });

    shouldShowGivenPricefield.value = finalObj !== undefined;
  } catch (error) {

    console.error('Error loading lead info:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load lead information',
    });
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

const leadVerificationReject = async () => {
  v$.value.formData.leadVerificationStatus.reason.$touch();
  if (v$.value.formData.leadVerificationStatus.reason.$error) {
    $q.notify('Reason for rejection is mandatory');
    return;
  }

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to reject lead?',
    ok: {
      label: 'Continue',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).then(async () => {
    try {
      const requestParams = {
        leadId: route.params.id,
        action: 0,
        remarks: formData.value,
      };

      await PRICING_EXCEPTION_VERIFICATION(requestParams);
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Rejected Lead : #' + route.params.id,
        icon: 'thumb_up',
      });
      
      router.push('/sales/manager/pricing/exception/verification');
    } catch (error) {

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error?.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down',
      });
    }
  });
};

const leadVerificationApprove = async () => {
  v$.value.$touch();
  if (v$.value.$error) {
    $q.notify('Please review fields again.');
    return;
  }

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to approve lead?',
    ok: {
      label: 'Continue',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).then(async () => {
    $q.loading.show({
      delay: 100,
      message: 'Please Wait',
      spinnerColor: 'purple-9',
      customClass: 'shadow-none',
    });

    try {
      const requestParams = {
        leadId: route.params.id,
        action: 1,
        remarks: formData.value,
      };

      await PRICING_EXCEPTION_VERIFICATION(requestParams);
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Approved Lead : #' + route.params.id,
        icon: 'thumb_up',
      });
      
      router.push('/sales/manager/pricing/exception/verification');
    } catch (error) {

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error?.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down',
      });
    } finally {
      $q.loading.hide();
    }
  });
};

const leadVerificationNHApprove = async () => {
  v$.value.$touch();
  if (v$.value.$error) {
    $q.notify('Please review fields again.');
    return;
  }

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to approve lead?',
    ok: {
      label: 'Continue',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).then(async () => {
    try {
      const requestParams = {
        leadId: route.params.id,
        action: 1,
        remarks: formData.value,
      };

      await PRICING_EXCEPTION_VERIFICATION(requestParams);
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Approved Lead : #' + route.params.id,
        icon: 'thumb_up',
      });
      
      router.push('/sales/manager/pricing/exception/verification');
    } catch (error) {

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error?.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down',
      });
    }
  });
};

const fnCheckPrice = () => {
  // Implement price checking logic here
};

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

// Lifecycle hooks
onMounted(() => {
  ajaxLoadShortLeadInfo();
});

// Constants (replace with actual values from your project)
const ROLE_HIERARCHY_SALES_NATIONAL_HEAD = 4; // Adjust based on your actual constant
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

.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.bottom-border {
  border-bottom: 1px solid #c7c7c7;
}
</style>