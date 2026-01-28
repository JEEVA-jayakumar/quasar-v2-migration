<template>
  <div>
    <div class="row q-col-gutter-sm">

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.legalName"
          label="Legal Name*"
          outlined
          @blur="v$.merchant.companyInformation.legalName.$touch"
          :error="v$.merchant.companyInformation.legalName.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.dbaName"
          label="DBA Name*"
          outlined
          @blur="v$.merchant.companyInformation.dbaName.$touch"
          :error="v$.merchant.companyInformation.dbaName.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.registeredAddress"
          label="Registered Address*"
          outlined
          @blur="v$.merchant.companyInformation.registeredAddress.$touch"
          :error="v$.merchant.companyInformation.registeredAddress.$error"
        />
      </div>

      <!-- REGISTERED CITY -->
      <div class="col-md-6 col-12">
        <q-select
          use-input
          fill-input
          hide-selected
          input-debounce="300"
          v-model="merchant.companyInformation.registeredCityName"
          label="Registered City*"
          outlined
          :options="filteredCities"
          @filter="filterCities"
          @update:model-value="registeredCitySelected"
          :error="v$.merchant.companyInformation.registeredCityName.$error"
        />
      </div>

      <!-- REGISTERED STATE -->
      <div class="col-md-6 col-12">
        <q-select
          use-input
          fill-input
          hide-selected
          input-debounce="300"
          v-model="merchant.companyInformation.registeredStateName"
          label="Registered State*"
          outlined
          :options="filteredStates"
          @filter="filterStates"
          @update:model-value="registeredStateSelected"
          :error="v$.merchant.companyInformation.registeredStateName.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.registeredPin"
          label="PIN*"
          type="number"
          outlined
          @blur="v$.merchant.companyInformation.registeredPin.$touch"
          :error="v$.merchant.companyInformation.registeredPin.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.constitutionName"
          label="Type of Business Entity"
          outlined
          disable
        />
      </div>

      <!-- ESTABLISH YEAR -->
      <div class="col-md-6 col-12">
        <q-input
          label="Year of Establishment*"
          outlined
          readonly
          :model-value="formattedEstablishYear"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover>
                <q-date
                  v-model="merchant.companyInformation.establishYear"
                  mask="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.pan"
          label="Company PAN*"
          outlined
          maxlength="10"
          @blur="v$.merchant.companyInformation.pan.$touch"
          :error="v$.merchant.companyInformation.pan.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-select
          v-model="merchant.companyInformation.businessType"
          label="Type of Business"
          outlined
          :options="businessTypeOptions"
        />
      </div>

      <!-- STATEMENT TYPE -->
      <div class="col-md-6 col-12">
        <div class="q-mb-xs">Statement Type</div>
        <q-radio
          v-for="item in viewBinding.statementType"
          :key="item.value"
          v-model="merchant.companyInformation.statementType"
          :val="item.value"
          :label="item.label"
        />
      </div>

      <!-- STATEMENT FREQUENCY -->
      <div class="col-md-12">
        <div class="q-mb-xs">Statement Frequency</div>
        <q-radio
          v-for="item in viewBinding.statementFrequency"
          :key="item.value"
          v-model="merchant.companyInformation.statementFrequency"
          :val="item.value"
          :label="item.label"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.companyInformation.statementEmail"
          label="Statement Email"
          outlined
          @blur="v$.merchant.companyInformation.statementEmail.$touch"
          :error="v$.merchant.companyInformation.statementEmail.$error"
        />
      </div>

    </div>

    <q-stepper-navigation>
      <q-btn color="primary" icon="check" label="Continue" @click="validate" />
      <q-btn color="amber" icon="save" label="Save Partial" @click="$emit('saveData','companyInformation',merchant)" />
      <q-btn color="grey" icon="arrow_back" label="Back" @click="$emit('goBack')" />
    </q-stepper-navigation>
  </div>
</template>
<script setup>
import { reactive, watch, computed, ref } from 'vue'
import { useQuasar, date } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { helpers, required, minLength, maxLength, email } from '@vuelidate/validators'

const props = defineProps({
  cityOptions: Array,
  stateOptions: Array,
  mccSearchSet: Array,
  companyInformation: Object
})

const emit = defineEmits(['goNext','goBack','saveData'])
const $q = useQuasar()

const merchant = reactive({
  companyInformation: {}
})

watch(
  () => props.companyInformation,
  val => merchant.companyInformation = val,
  { immediate: true }
)

/* Filters */
const filteredCities = ref([])
const filteredStates = ref([])

const filterCities = (val, update) => {
  update(() => {
    filteredCities.value = props.cityOptions.filter(o =>
      o.label.toLowerCase().includes(val.toLowerCase())
    )
  })
}

const filterStates = (val, update) => {
  update(() => {
    filteredStates.value = props.stateOptions.filter(o =>
      o.label.toLowerCase().includes(val.toLowerCase())
    )
  })
}

const registeredCitySelected = item => {
  merchant.companyInformation.registeredCityName = item.label
  merchant.companyInformation.registeredCityRefCode = item.value
}

const registeredStateSelected = item => {
  merchant.companyInformation.registeredStateName = item.label
  merchant.companyInformation.registeredStateRefCode = item.value
}

/* VALIDATION */
const alphaNumericValidate = helpers.regex(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/)
const panCard = helpers.regex(/^([A-Za-z]){5}([0-9]){4}([A-Za-z]){1}$/)

const rules = {
  merchant: {
    companyInformation: {
      legalName: { required, alphaNumericValidate },
      dbaName: { required, alphaNumericValidate },
      registeredAddress: { required },
      registeredPin: { required, minLength: minLength(6), maxLength: maxLength(6) },
      registeredCityName: { required },
      registeredStateName: { required },
      pan: { required, panCard, minLength: minLength(10), maxLength: maxLength(10) },
      contactEmail: { required, email },
      statementType: { required },
      statementFrequency: { required },
      statementEmail: {
        required: helpers.withMessage(
          'Required for E-Statement',
          () => merchant.companyInformation.statementType === 'E'
        ),
        email
      }
    }
  }
}

const v$ = useVuelidate(rules, { merchant })

const formattedEstablishYear = computed(() =>
  merchant.companyInformation.establishYear
    ? date.formatDate(merchant.companyInformation.establishYear, 'DD/MM/YYYY')
    : ''
)

const validate = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
    return
  }
  emit('goNext','companyInformation',merchant)
}
</script>
