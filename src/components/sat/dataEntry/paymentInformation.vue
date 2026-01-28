<template>
  <div>
    <div class="row gutter-sm">
      <!-- Device Owned By -->
      <div class="col-md-6 col-sm-12">
        <p class="text-caption">Device Owned By</p>
        <q-option-group
          type="radio"
          :options="deviceOwnedByOptions"
          v-model="merchant.paymentDetails.deviceOwnedBy"
          @blur="v$.merchant.paymentDetails.deviceOwnedBy.$touch()"
          :error="v$.merchant.paymentDetails.deviceOwnedBy.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Installation Fee*"
          v-model.number="merchant.paymentDetails.installationFee"
          @blur="v$.merchant.paymentDetails.installationFee.$touch()"
          :error="v$.merchant.paymentDetails.installationFee.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Terminal Model*"
          :options="terminalModelSet"
          v-model="merchant.paymentDetails.terminalModeCode"
          @blur="v$.merchant.paymentDetails.terminalModeCode.$touch()"
          :error="v$.merchant.paymentDetails.terminalModeCode.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="No of Terminals*"
          disable
          v-model="merchant.paymentDetails.numberOfTerminals"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <p class="text-caption">Cash @POS Enabled?</p>
        <q-option-group
          type="radio"
          disable
          :options="cashAtPosEnabledOptions"
          v-model="merchant.paymentDetails.cashAtPosEnabled"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Rental Plan*"
          :options="rentalPlanSet"
          v-model="merchant.paymentDetails.rentalPlanCode"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Rental Mode*"
          :options="rentalModeOptions"
          v-model="merchant.paymentDetails.rentalMode"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Service Provider*"
          :options="serviceProviderListSet"
          v-model="merchant.paymentDetails.serviceProvider"
          @blur="v$.merchant.paymentDetails.serviceProvider.$touch()"
          :error="v$.merchant.paymentDetails.serviceProvider.$error"
        />
      </div>

      <div class="col-md-6 col-sm-12">
        <q-select
          label="Network Provider*"
          :options="networkProviderListSet"
          v-model="merchant.paymentDetails.networkPreferred"
          @blur="v$.merchant.paymentDetails.networkPreferred.$touch()"
          :error="v$.merchant.paymentDetails.networkPreferred.$error"
        />
      </div>

      <!-- Rental Type -->
      <div class="col-md-6 col-sm-12">
        <p class="text-caption">Rental Type</p>
        <q-option-group
          type="radio"
          :options="rentalTypeOptions"
          v-model="merchant.paymentDetails.rentalType"
          @update:model-value="merchant.paymentDetails.gracePeriod = 0"
        />
      </div>

      <div v-if="isRental" class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Grace Period*"
          v-model.number="merchant.paymentDetails.gracePeriod"
          @blur="v$.merchant.paymentDetails.gracePeriod.$touch()"
          :error="v$.merchant.paymentDetails.gracePeriod.$error"
        />
      </div>

      <div v-if="isAdvanced" class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Advance Rent Collected*"
          v-model.number="merchant.paymentDetails.advanceRentCollected"
          @blur="v$.merchant.paymentDetails.advanceRentCollected.$touch()"
          :error="v$.merchant.paymentDetails.advanceRentCollected.$error"
        />
      </div>

      <div v-if="isAdvanced" class="col-md-6 col-sm-12">
        <q-input
          type="number"
          label="Months Paid In Advance*"
          v-model.number="merchant.paymentDetails.noOfMonthRentPaidInAdvance"
          @blur="v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$touch()"
          :error="v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error"
        />
      </div>

      <div v-if="isAdvanced" class="col-md-6 col-sm-12">
        <p class="text-caption">Advance Rent Mode</p>
        <q-option-group
          type="radio"
          :options="advanceRentModeOptions"
          v-model="merchant.paymentDetails.advanceRentMode"
        />
      </div>
    </div>

    <!-- Navigation -->
    <q-stepper-navigation>
      <q-btn color="primary" label="Continue" @click="validate" />
      <q-btn
        color="amber-10"
        label="Save Partial"
        @click="$emit('saveData', 'paymentDetails', merchant)"
      />
      <q-btn color="grey-7" label="Back" @click="$emit('goBack')" />
    </q-stepper-navigation>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, requiredIf, between, decimal, numeric } from '@vuelidate/validators'

const props = defineProps({
  terminalModelSet: Array,
  rentalPlanSet: Array,
  serviceProviderListSet: Array,
  networkProviderListSet: Array,
  paymentInformation: Object
})

const emit = defineEmits(['goNext', 'saveData', 'goBack'])
const $q = useQuasar()

const merchant = reactive({
  paymentDetails: {}
})

watch(
  () => props.paymentInformation,
  v => (merchant.paymentDetails = { ...v }),
  { immediate: true }
)

const isRental = computed(() => merchant.paymentDetails.rentalType === 'R')
const isAdvanced = computed(() => merchant.paymentDetails.rentalType === 'A')

const rules = {
  merchant: {
    paymentDetails: {
      installationFee: {
        required: requiredIf(() => isRental.value),
        decimal,
        between: between(0, 999999)
      },
      terminalModeCode: { required },
      serviceProvider: { required },
      networkPreferred: { required },
      deviceOwnedBy: { required },
      cashAtPosEnabled: { required },
      rentalType: { required },
      advanceRentCollected: {
        required: requiredIf(() => isAdvanced.value),
        decimal
      },
      noOfMonthRentPaidInAdvance: {
        required: requiredIf(() => isAdvanced.value),
        numeric
      },
      gracePeriod: {
        required: requiredIf(() => isRental.value),
        numeric
      }
    }
  }
}

const v$ = useVuelidate(rules, { merchant })

function validate () {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
  } else {
    emit('goNext', 'paymentDetails', merchant)
  }
}

/* OPTIONS */
const deviceOwnedByOptions = [
  { label: 'Bijlipay', value: 'B' },
  { label: 'Merchant', value: 'M' }
]

const cashAtPosEnabledOptions = [
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
]

const rentalTypeOptions = [
  { label: 'Advanced', value: 'A' },
  { label: 'Regular', value: 'R' }
]

const advanceRentModeOptions = [
  { label: 'Card', value: 'Card' },
  { label: 'Cheque', value: 'Cheque' },
  { label: 'NEFT', value: 'NEFT' },
  { label: 'IMPS', value: 'IMPS' },
  { label: 'Cash', value: 'Cash' }
]

const rentalModeOptions = [
  { label: 'Standing instructions', value: 'S' },
  { label: 'Normal', value: 'N' }
]
</script>
