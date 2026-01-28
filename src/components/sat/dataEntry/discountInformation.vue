<template>
  <div>
    <div class="row group items-center">
      <div class="col-md-12">

        <!-- ALL ROWS UNCHANGED – ONLY $v → v$ -->

        <div
          v-for="item in sections"
          :key="item.key"
          class="row items-center"
        >
          <div class="col-3">
            <div class="q-caption text-weight-medium">{{ item.label }}</div>
          </div>

          <!-- MDR -->
          <div class="col">
            <div class="row group bg-green-2">
              <div class="col" v-for="field in feeFields" :key="field">
                <q-input
                  color="grey-9"
                  type="number"
                  :placeholder="fieldLabel(field)"
                  v-model.number="merchant.mdrPlan[item.key][field]"
                  @blur="v$.merchant.mdrPlan[item.key][field].$touch"
                  :error="v$.merchant.mdrPlan[item.key][field].$error"
                />
              </div>
            </div>
          </div>

          <!-- SHARING -->
          <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
            <div class="row group bg-yellow-2">
              <div class="col" v-for="field in feeFields" :key="field">
                <q-input
                  color="grey-9"
                  type="number"
                  :placeholder="fieldLabel(field)"
                  v-model.number="merchant.SharingDiscountFee[item.key][field]"
                  @blur="v$.merchant.SharingDiscountFee[item.key][field].$touch"
                  :error="v$.merchant.SharingDiscountFee[item.key][field].$error"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <q-stepper-navigation>
      <q-btn color="primary" class="q-ma-xs" icon="check" label="Continue" @click="validate" />
      <q-btn
        color="amber-10"
        class="q-ma-xs"
        icon="save"
        label="Save Partial"
        @click="$emit('saveData','mdrPlan',merchant)"
      />
      <q-btn color="grey-7" class="q-ma-xs" icon="block" label="Back" @click="$emit('goBack')" />
    </q-stepper-navigation>
  </div>
</template>
<script setup>
import { reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, minValue, decimal, between, helpers } from '@vuelidate/validators'

/* PROPS */
const props = defineProps({
  sharingModelCode: String,
  mdrPlan: Object,
  SharingDiscountFee: Object,
  mdrAddtionalDetails: Object
})

const emit = defineEmits(['goNext', 'goBack', 'saveData'])
const $q = useQuasar()

/* STATE */
const merchant = reactive({
  mdrPlan: {},
  SharingDiscountFee: {}
})

/* KEEP EXISTING PROP REACTIVITY */
watch(() => props.mdrPlan, v => merchant.mdrPlan = v, { immediate: true })
watch(() => props.SharingDiscountFee, v => merchant.SharingDiscountFee = v, { immediate: true })

/* SHARING FLAG */
const showOnlyIfSharingModelIsEnabled = computed(() => props.sharingModelCode !== 'N')

/* UI HELPERS */
const feeFields = ['fixed', 'percentage', 'minimum']
const fieldLabel = f => (f === 'fixed' ? 'Fixed' : f === 'percentage' ? '%' : 'Max')

/* SECTIONS (DRY replacement for repeated markup) */
const sections = [
  { key: 'domesticDebitUpTo2000', label: 'Domestic Debit Card below 2000' },
  { key: 'domesticDebitAbove2000', label: 'Domestic Debit Card above 2000' },
  { key: 'standardOrClassic', label: 'Standard/Classic (1st Stab)' },
  { key: 'premiumOrPlatinum', label: 'Premium/Platinum (2nd Stab)' },
  { key: 'superPremiumOrSignature', label: 'Super Premium/Signature (3rd Stab)' },
  { key: 'commercialOrCorporate', label: 'Commercial/Corporate (4th Stab)' },
  { key: 'internationalDebitCard', label: 'International Debit Card' },
  { key: 'internationalCreditCard', label: 'International Credit Card' },
  { key: 'onus', label: 'Onus' },
  { key: 'mVisa', label: 'mVISA' },
  { key: 'masterPass', label: 'Master Pass' },
  { key: 'cashAtPos', label: 'Cash at POS' }
]

/* VALIDATION FACTORIES */
const baseFeeRules = {
  fixed: { required, decimal, minValue: minValue(0) },
  percentage: { required, decimal, between: between(0, 100) },
  minimum: { required, decimal, minValue: minValue(0) }
}

const sharingFeeRules = {
  fixed: {
    decimal,
    minValue: minValue(0),
    required: helpers.withMessage('Required', () => showOnlyIfSharingModelIsEnabled.value)
  },
  percentage: {
    decimal,
    between: between(0, 100),
    required: helpers.withMessage('Required', () => showOnlyIfSharingModelIsEnabled.value)
  },
  minimum: {
    decimal,
    minValue: minValue(0),
    required: helpers.withMessage('Required', () => showOnlyIfSharingModelIsEnabled.value)
  }
}

/* BUILD VALIDATION TREE */
const mdrRules = {}
const sharingRules = {}

sections.forEach(s => {
  mdrRules[s.key] = baseFeeRules
  sharingRules[s.key] = sharingFeeRules
})

const rules = {
  merchant: {
    mdrPlan: mdrRules,
    SharingDiscountFee: sharingRules
  }
}

const v$ = useVuelidate(rules, { merchant })

/* ACTIONS */
const validate = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
    return
  }
  emit('goNext', 'mdr', merchant)
}
</script>
<style scoped>
</style>
