<template>
  <div>
    <q-select
      label="Sales Person*"
      placeholder="Choose from the below*"
      color="grey-9"
      v-model="merchant.salesInformation.salesPersonCode"
      :options="salesPersonOptions"
      @blur="v$.merchant.salesInformation.salesPersonCode.$touch()"
      :error="v$.merchant.salesInformation.salesPersonCode.$error"
      emit-value
      map-options
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* 
  PROPS (same as existing project)
*/
defineProps({
  salesPersonOptions: {
    type: Array,
    required: true
  }
})

/*
  STATE (same structure as existing project)
*/
const merchant = reactive({
  salesInformation: {
    salesPersonCode: null
  }
})

/*
  VALIDATIONS (same logic as before)
*/
const rules = {
  merchant: {
    salesInformation: {
      salesPersonCode: { required }
    }
  }
}

const v$ = useVuelidate(rules, { merchant })
</script>
