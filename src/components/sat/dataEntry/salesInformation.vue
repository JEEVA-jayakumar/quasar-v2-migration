<template>
  <div>
    <div class="row gutter-sm">
      <!-- Institution -->
      <div class="col-md-6 col-sm-12">
        <q-select
          label="Institution Code*"
          :options="institutionOptions"
          v-model="merchant.salesInformation.institutionCode"
          @blur="v$.merchant.salesInformation.institutionCode.$touch()"
          :error="v$.merchant.salesInformation.institutionCode.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Application Type*"
          :options="applicationTypeOptions"
          v-model="merchant.salesInformation.applicationType"
          @blur="v$.merchant.salesInformation.applicationType.$touch()"
          :error="v$.merchant.salesInformation.applicationType.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-input
          label="Application Number*"
          v-model="merchant.salesInformation.applicationNumber"
          @blur="v$.merchant.salesInformation.applicationNumber.$touch()"
          :error="v$.merchant.salesInformation.applicationNumber.$error"
        />
      </div>

      <!-- Application Date -->
      <div class="col-md-6 col-sm-12">
        <q-input
          label="Application Date*"
          readonly
          v-model="merchant.salesInformation.applicationDate"
          @blur="v$.merchant.salesInformation.applicationDate.$touch()"
          :error="v$.merchant.salesInformation.applicationDate.$error"
        >
          <q-popup-proxy cover transition-show="scale">
            <q-date
              mask="DD/MM/YYYY"
              v-model="merchant.salesInformation.applicationDate"
            />
          </q-popup-proxy>
        </q-input>
      </div>

      <!-- Agreement Date -->
      <div class="col-md-6 col-sm-12">
        <q-input
          label="Agreement Date*"
          readonly
          v-model="merchant.salesInformation.aggreementDate"
          @blur="v$.merchant.salesInformation.aggreementDate.$touch()"
          :error="v$.merchant.salesInformation.aggreementDate.$error"
        >
          <q-popup-proxy cover>
            <q-date
              mask="DD/MM/YYYY"
              v-model="merchant.salesInformation.aggreementDate"
            />
          </q-popup-proxy>
        </q-input>
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Merchant Type*"
          :options="merchantTypeOptions"
          v-model="merchant.salesInformation.merchantType"
          @blur="v$.merchant.salesInformation.merchantType.$touch()"
          :error="v$.merchant.salesInformation.merchantType.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Category Type*"
          :options="categoryTypeOptions"
          v-model="merchant.salesInformation.categoryType"
          @blur="v$.merchant.salesInformation.categoryType.$touch()"
          :error="v$.merchant.salesInformation.categoryType.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Sales Person*"
          :options="salesPersonOptions"
          v-model="merchant.salesInformation.salesPersonCode"
          @blur="v$.merchant.salesInformation.salesPersonCode.$touch()"
          :error="v$.merchant.salesInformation.salesPersonCode.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Region*"
          :options="regionOptions"
          v-model="merchant.salesInformation.region"
          @blur="v$.merchant.salesInformation.region.$touch()"
          :error="v$.merchant.salesInformation.region.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Lead From*"
          :options="leadFromOptions"
          v-model="merchant.salesInformation.leadFrom"
          @blur="v$.merchant.salesInformation.leadFrom.$touch()"
          :error="v$.merchant.salesInformation.leadFrom.$error"
        />
      </div>

      <!-- Sharing Model -->
      <div class="col-md-6 col-sm-12">
        <p class="text-caption">Sharing Model</p>
        <q-option-group
          type="radio"
          :options="sharingModelOptions"
          v-model="merchant.salesInformation.sharingModelCode"
        />
      </div>
    </div>

    <!-- TRANSACTION MODEL -->
    <div v-if="isTransactionModel" class="row gutter-sm q-my-sm">
      <div class="col-md-6 col-sm-12">
        <q-select
          label="Sharing Partner*"
          :options="sharingPartnerOptions"
          v-model="merchant.salesInformation.sharingPartnerCode"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Daily Fixed Amount*"
          v-model.number="merchant.salesInformation.dailyFixedAmount"
        />
      </div>
    </div>

    <!-- MDR MODEL -->
    <div v-if="isMdrModel" class="row gutter-sm q-my-sm">
      <div class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Rent %*"
          v-model.number="merchant.salesInformation.rentPercentage"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Rent Fixed*"
          v-model.number="merchant.salesInformation.rentFixed"
        />
      </div>
    </div>

    <q-stepper-navigation>
      <q-btn color="primary" label="Continue" @click="validate" />
      <q-btn
        color="amber-10"
        label="Save Partial"
        @click="$emit('saveData','salesInformation',merchant,{mdrCode,customStepper:false})"
      />
    </q-stepper-navigation>
  </div>
</template>

<script setup>
import { reactive, computed, watch, ref } from 'vue'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, requiredIf, alphaNum, decimal, between } from '@vuelidate/validators'

/* PROPS */
const props = defineProps({
  regionOptions: Array,
  leadFromOptions: Array,
  salesInformation: Object,
  salesPersonOptions: Array,
  sharingPartnerOptions: Array
})

const emit = defineEmits(['goNext', 'saveData'])
const $q = useQuasar()
const mdrCode = ref(null)

/* STATE */
const merchant = reactive({
  salesInformation: {}
})

watch(
  () => props.salesInformation,
  v => (merchant.salesInformation = { ...v }),
  { immediate: true }
)

/* OPTIONS */
const institutionOptions = [{ label: 'GPRS', value: 3 }]
const applicationTypeOptions = [
  { label: 'Digital', value: 'D' },
  { label: 'Non Digital', value: 'N' }
]
const categoryTypeOptions = [
  { label: 'Small', value: 'S' },
  { label: 'Other', value: 'O' }
]
const merchantTypeOptions = [
  { label: 'Group Merchant', value: 'G' },
  { label: 'Merchant Outlet', value: 'O' },
  { label: 'Merchant', value: 'M' }
]
const sharingModelOptions = [
  { label: 'No sharing', value: 'N' },
  { label: 'Transaction value model', value: 'T' },
  { label: 'MDR/cash@pos/rent', value: 'M' }
]

/* COMPUTED */
const isTransactionModel = computed(() => merchant.salesInformation.sharingModelCode === 'T')
const isMdrModel = computed(() => merchant.salesInformation.sharingModelCode === 'M')

/* VALIDATIONS */
const rules = {
  merchant: {
    salesInformation: {
      institutionCode: { required },
      applicationType: { required },
      applicationNumber: { required, alphaNum },
      applicationDate: { required },
      aggreementDate: { required },
      salesPersonCode: { required },
      region: { required },
      merchantType: { required },
      categoryType: { required },
      leadFrom: { required },
      sharingPartnerCode: {
        required: requiredIf(() => isTransactionModel.value || isMdrModel.value)
      },
      dailyFixedAmount: {
        required: requiredIf(() => isTransactionModel.value),
        decimal,
        between: between(0, 99999.99)
      },
      rentPercentage: {
        required: requiredIf(() => isMdrModel.value),
        decimal,
        between: between(0, 100)
      },
      rentFixed: {
        required: requiredIf(() => isMdrModel.value),
        decimal
      }
    }
  }
}

const v$ = useVuelidate(rules, { merchant })

/* SUBMIT */
function validate () {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
    return
  }

  mdrCode.value = merchant.salesInformation.categoryType === 'S' ? 44 : 45
  emit('goNext', 'salesInformation', merchant, mdrCode.value)
}
</script>
