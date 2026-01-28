<template>
  <div>
    <div class="row q-mb-md q-gutter-sm items-center">
      <div class="col-md-12">
        <div class="text-h6">Merchant Bank Details</div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          uppercase
          color="grey-9"
          :error="$v.merchant.bankInformation.bankDetails.ifsc.$error"
          @blur="populateBankDetails"
          v-model="merchant.bankInformation.bankDetails.ifsc"
          label="IFSC Code*"
          placeholder="Enter IFSC*"
          outlined
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.branchName.$touch"
          :error="$v.merchant.bankInformation.bankDetails.branchName.$error"
          v-model="merchant.bankInformation.bankDetails.branchName"
          label="Branch Name*"
          placeholder="Branch Name*"
          outlined
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          placeholder="Choose from the below"
          color="grey-9"
          v-model="merchant.bankInformation.bankDetails.feeType"
          label="Fee Type"
          :options="feeTypeOptions"
          outlined
          emit-value
          map-options
        />
      </div>
      <div
        v-if="merchant.bankInformation.bankDetails.feeType == 'N' || merchant.bankInformation.bankDetails.feeType == 'S'"
        class="col-md-6 col-sm-12 col-xs-12"
      >
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.settlementOrNeftFee.$touch"
          :error="$v.merchant.bankInformation.bankDetails.settlementOrNeftFee.$error"
          v-model="merchant.bankInformation.bankDetails.settlementOrNeftFee"
          label="NEFT/Settlement Fee Inclusive of Tax*"
          placeholder="NEFT/Settlement Fee Inclusive of Tax*"
          outlined
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.micr.$touch"
          :error="$v.merchant.bankInformation.bankDetails.micr.$error"
          v-model="merchant.bankInformation.bankDetails.micr"
          label="MICR*"
          placeholder="MICR*"
          outlined
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.bankName.$touch"
          :error="$v.merchant.bankInformation.bankDetails.bankName.$error"
          v-model="merchant.bankInformation.bankDetails.bankName"
          label="Bank Name*"
          placeholder="Bank Name*"
          outlined
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          placeholder="Choose from the below"
          color="grey-9"
          v-model="merchant.bankInformation.bankDetails.paymentMode"
          label="Payment mode"
          :options="paymentModeOptions"
          outlined
          emit-value
          map-options
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.bankCityRefCode.$touch"
          :error="$v.merchant.bankInformation.bankDetails.bankCityName.$anyError || $v.merchant.bankInformation.bankDetails.bankCityRefCode.$anyError"
          v-model="merchant.bankInformation.bankDetails.bankCityName"
          label="City (type min 3 characters)*"
          placeholder="Start typing ..*"
          outlined
          @keydown="fnCityTyping"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.bankCityRefCode.$touch"
          :error="$v.merchant.bankInformation.bankDetails.bankStateName.$anyError || $v.merchant.bankInformation.bankDetails.bankCityRefCode.$anyError"
          v-model="merchant.bankInformation.bankDetails.bankStateName"
          label="State (type min 3 characters)*"
          placeholder="Start typing ..*"
          outlined
          @keydown="fnStateTyping"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          placeholder="Choose from the below"
          color="grey-9"
          v-model="merchant.bankInformation.bankDetails.accountType"
          label="Account Type"
          :options="accountTypeOptions"
          outlined
          emit-value
          map-options
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="$v.merchant.bankInformation.bankDetails.accountNumber.$touch"
          :error="$v.merchant.bankInformation.bankDetails.accountNumber.$error"
          v-model="merchant.bankInformation.bankDetails.accountNumber"
          label="Bank A/c Number*"
          placeholder="Bank A/c Number*"
          outlined
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-checkbox
          color="grey-9"
          true-value="Y"
          false-value="N"
          v-model="merchant.bankInformation.bankDetails.bankStatementAttached"
          label="Bank Statement Attached"
        />
        <q-checkbox
          color="grey-9"
          true-value="Y"
          false-value="N"
          v-model="merchant.bankInformation.bankDetails.cancelChequeAttached"
          label="Cancelled Cheque Lead Attached"
        />
      </div>
    </div>
    <div class="row q-gutter-sm items-center">
      <div class="col-md-12">
        <div class="text-h6">Payment Collection Details</div>
      </div>
      <div v-show="props.propLeadDetails.paymentOption == 1" class="col-md-12">
        <div class="row">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.chequeNumber.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.chequeNumber.$error"
              v-model="merchant.bankInformation.collectionDetails.chequeNumber"
              label="Cheque/UTR No*"
              placeholder="Cheque/UTR No*"
              outlined
            />
          </div>
        </div>
      </div>
      <div v-show="props.propLeadDetails.paymentOption == 3" class="col-md-12">
        <div class="row">
          <div class="col-md-4 col-sm-12 col-xs-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.swipeAmount.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.swipeAmount.$error"
              v-model="merchant.bankInformation.collectionDetails.swipeAmount"
              label="Swipe Amount*"
              placeholder="Swipe Amount*"
              outlined
            />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.collectedDate.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.collectedDate.$error"
              v-model="merchant.bankInformation.collectionDetails.collectedDate"
              label="Swipe Date*"
              placeholder="Swipe Date*"
              outlined
              type="date"
              mask="####-##-##"
            />
          </div>
          <div class="col-md-4 col-sm-12 col-xs-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.swipeTerminal.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.swipeTerminal.$error"
              v-model="merchant.bankInformation.collectionDetails.swipeTerminal"
              label="Swiped on the terminal of*"
              placeholder="Swiped on the terminal of*"
              outlined
            />
          </div>
        </div>
      </div>
      <div v-show="props.propLeadDetails.paymentOption == 2" class="col-md-12">
        <div class="row">
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.chequeAmount.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.chequeAmount.$error"
              v-model="merchant.bankInformation.collectionDetails.chequeAmount"
              label="Cheque Amount*"
              placeholder="Cheque Amount*"
              outlined
            />
          </div>
          <div class="col-md-3 col-sm-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.chequeDate.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.chequeDate.$error"
              v-model="merchant.bankInformation.collectionDetails.chequeDate"
              label="Cheque Date*"
              placeholder="Cheque Date*"
              outlined
              type="date"
              mask="####-##-##"
            />
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.chequeDepositedDate.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.chequeDepositedDate.$error"
              v-model="merchant.bankInformation.collectionDetails.chequeDepositedDate"
              label="Cheque Deposited Date*"
              placeholder="Cheque Deposited Date*"
              outlined
              type="date"
              mask="####-##-##"
            />
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-input
              color="grey-9"
              @blur="$v.merchant.bankInformation.collectionDetails.chequeNumber.$touch"
              :error="$v.merchant.bankInformation.collectionDetails.chequeNumber.$error"
              v-model="merchant.bankInformation.collectionDetails.chequeNumber"
              label="Cheque/UTR No*"
              placeholder="Cheque/UTR No*"
              outlined
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
        <q-select
          clearable
          placeholder="Choose from the below"
          color="grey-9"
          v-model="merchant.bankInformation.collectionDetails.acquirerBank"
          label="Bank Name"
          :options="bankListSet"
          outlined
          emit-value
          map-options
        />
      </div>
    </div>
    <div class="q-stepper-navigation">
      <q-btn color="primary" class="q-ma-xs" icon="check" @click="validate" label="Continue" />
      <q-btn
        color="amber-10"
        class="q-ma-xs"
        icon="save"
        label="Save Partial"
        @click="$emit('saveData')"
      />
      <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="$emit('goBack')" label="Back" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import useVuelidate from '@vuelidate/core';
import { 
  required, 
  requiredIf, 
  alphaNum, 
  integer, 
  numeric, 
  minLength, 
  maxLength, 
  minValue,
  decimal, 
  between 
} from '@vuelidate/validators';


// Props
const props = defineProps({
  cityOptions: Array,
  stateOptions: Array,
  propLeadDetails: Object,
  bankInformation: Object,
  bankListSet: Array
});

// Emits
const emit = defineEmits(['goNext', 'saveData', 'goBack']);

// Quasar
const $q = useQuasar();

// Data options
const accountTypeOptions = ref([
  { label: 'Saving account', value: 'S' },
  { label: 'Current account', value: 'C' },
  { label: 'Overdraft account', value: 'O' },
  { label: 'Cash credit account', value: 'R' }
]);

const feeTypeOptions = ref([
  { label: 'NEFT', value: 'N' },
  { label: 'Settlement', value: 'S' },
  { label: 'None', value: 'X' }
]);

const paymentModeOptions = ref([
  { label: 'Direct credit', value: 'D' },
  { label: 'NEFT', value: 'N' },
  { label: 'IMPS', value: 'I' }
]);

// Reactive state
const merchant = reactive({
  bankInformation: {
    bankDetails: {
      ifsc: '',
      micr: '',
      branchName: '',
      bankName: '',
      bankCityName: '',
      bankCityRefCode: '',
      bankStateName: '',
      bankStateRefCode: '',
      accountNumber: '',
      paymentMode: '',
      accountType: '',
      feeType: '',
      settlementOrNeftFee: '',
      bankStatementAttached: 'N',
      cancelChequeAttached: 'N'
    },
    collectionDetails: {
      chequeNumber: '',
      swipeAmount: '',
      collectedDate: '',
      swipeTerminal: '',
      chequeAmount: '',
      chequeDate: '',
      chequeDepositedDate: '',
      acquirerBank: ''
    }
  }
});

// Initialize with props
onMounted(() => {
  if (props.bankInformation) {
    merchant.bankInformation = { ...merchant.bankInformation, ...props.bankInformation };
  }
});

// Vuelidate rules
const rules = {
  merchant: {
    bankInformation: {
      bankDetails: {
        ifsc: {
          required,
          alphaNum,
          maxLength: maxLength(11)
        },
        micr: {
          required,
          numeric,
          minLength: minLength(9),
          maxLength: maxLength(9)
        },
        branchName: { required },
        bankName: { required },
        bankCityName: { required },
        bankCityRefCode: {
          required,
          numeric
        },
        accountNumber: {
          required,
          numeric,
          minLength: minLength(6),
          maxLength: maxLength(19)
        },
        bankStateName: { required },
        bankStateRefCode: {
          required,
          numeric
        },
        paymentMode: { required },
        accountType: { required },
        settlementOrNeftFee: {
          required: requiredIf(() => {
            return merchant.bankInformation.bankDetails.feeType === 'N' || 
                   merchant.bankInformation.bankDetails.feeType === 'S';
          }),
          integer,
          between: between(0, 999)
        }
      },
      collectionDetails: {
        collectedDate: {
          required: requiredIf(() => props.propLeadDetails?.paymentOption === 3)
        },
        swipeAmount: {
          decimal,
          required: requiredIf(() => props.propLeadDetails?.paymentOption === 3),
          minValue: minValue(0)
        },
        swipeTerminal: {
          required: requiredIf(() => props.propLeadDetails?.paymentOption === 3)
        },
        chequeAmount: {
          decimal,
          required: requiredIf(() => props.propLeadDetails?.paymentOption === 2),
          minValue: minValue(0)
        },
        chequeNumber: {
          alphaNum,
          required: requiredIf(() => {
            return props.propLeadDetails?.paymentOption === 1 || 
                   props.propLeadDetails?.paymentOption === 2;
          }),
          minLength: minLength(6),
          maxLength: maxLength(25)
        },
        chequeDate: {
          required: requiredIf(() => props.propLeadDetails?.paymentOption === 2)
        },
        chequeDepositedDate: {
          required: requiredIf(() => props.propLeadDetails?.paymentOption === 2)
        }
      }
    }
  }
};

const $v = useVuelidate(rules, { merchant });

const fnCityTyping = () => {
  // Placeholder for city typing logic
};

const fnStateTyping = () => {
  // Placeholder for state typing logic
};

const populateBankDetails = async () => {
  try {
    // Implement IFSC validation logic here
    // Example: const response = await store.dispatch('IFSC_FROM_MARS', merchant.bankInformation.bankDetails.ifsc);
    $q.notify({
      color: 'positive',
      message: 'IFSC validated successfully',
      icon: 'check'
    });
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Invalid IFSC code',
      icon: 'error'
    });
    merchant.bankInformation.bankDetails.ifsc = '';
    merchant.bankInformation.bankDetails.bankName = '';
    merchant.bankInformation.bankDetails.branchName = '';
    merchant.bankInformation.bankDetails.micr = '';
  }
};

const validate = () => {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({
      color: 'negative',
      message: 'Please review fields again.',
      icon: 'warning'
    });
  } else {
    emit('goNext', 'bank', merchant);
  }
};
</script>