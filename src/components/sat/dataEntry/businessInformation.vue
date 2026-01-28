<template>
  <div>
    <div class="row q-col-gutter-sm">
      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.weekdayStartHour"
          label="Weekday start hour (00.00)"
          outlined
          @blur="v$.merchant.businessInformation.weekdayStartHour.$touch"
          :error="v$.merchant.businessInformation.weekdayStartHour.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.weekdayEndHour"
          label="Weekday end hour (00.00)"
          outlined
          @blur="v$.merchant.businessInformation.weekdayEndHour.$touch"
          :error="v$.merchant.businessInformation.weekdayEndHour.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.weekendStartHour"
          label="Weekend start hour (00.00)"
          outlined
          @blur="v$.merchant.businessInformation.weekendStartHour.$touch"
          :error="v$.merchant.businessInformation.weekendStartHour.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.weekendEndHour"
          label="Weekend end hour (00.00)"
          outlined
          @blur="v$.merchant.businessInformation.weekendEndHour.$touch"
          :error="v$.merchant.businessInformation.weekendEndHour.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.lastTurnoverYear"
          label="Last turnover year"
          outlined
          @blur="v$.merchant.businessInformation.lastTurnoverYear.$touch"
          :error="v$.merchant.businessInformation.lastTurnoverYear.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.lastTurnoverAmount"
          type="number"
          label="Turnover during last year"
          outlined
          @blur="v$.merchant.businessInformation.lastTurnoverAmount.$touch"
          :error="v$.merchant.businessInformation.lastTurnoverAmount.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.expectedCardBusiness"
          type="number"
          label="Expected Card Business"
          outlined
          @blur="v$.merchant.businessInformation.expectedCardBusiness.$touch"
          :error="v$.merchant.businessInformation.expectedCardBusiness.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.averageBillAmount"
          type="number"
          label="Average Bill Amount"
          outlined
          @blur="v$.merchant.businessInformation.averageBillAmount.$touch"
          :error="v$.merchant.businessInformation.averageBillAmount.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.gstId"
          label="GST ID"
          outlined
          maxlength="15"
          @blur="v$.merchant.businessInformation.gstId.$touch"
          :error="v$.merchant.businessInformation.gstId.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.currentPosName"
          label="Name of other POS currently used"
          outlined
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.debitCardMdr"
          label="Debit Card MDR"
          outlined
          @blur="v$.merchant.businessInformation.debitCardMdr.$touch"
          :error="v$.merchant.businessInformation.debitCardMdr.$error"
        />
      </div>

      <div class="col-md-6 col-12">
        <q-input
          v-model="merchant.businessInformation.creditCardMdr"
          label="Credit Card MDR"
          outlined
          @blur="v$.merchant.businessInformation.creditCardMdr.$touch"
          :error="v$.merchant.businessInformation.creditCardMdr.$error"
        />
      </div>

      <!-- MEMBER SINCE -->
      <div class="col-md-6 col-12">
        <q-input
          label="Member Since"
          outlined
          readonly
          :model-value="formattedMemberSince"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale">
                <q-date
                  v-model="merchant.businessInformation.memberSince"
                  mask="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <!-- ACTION BUTTONS -->
    <q-stepper-navigation>
      <q-btn color="primary" icon="check" label="Continue" @click="validate" />
      <q-btn color="amber" icon="save" label="Save Partial" @click="$emit('saveData')" />
      <q-btn color="grey" icon="arrow_back" label="Back" @click="$emit('goBack')" />
    </q-stepper-navigation>
  </div>
</template>
<script setup>
import { reactive, computed, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { helpers, decimal, integer, minLength, maxLength, between } from '@vuelidate/validators'

const props = defineProps({
  businessInformation: Object
})

const emit = defineEmits(['goNext', 'goBack', 'saveData'])
const $q = useQuasar()

/* Reactive copy */
const merchant = reactive({
  businessInformation: {}
})

watch(
  () => props.businessInformation,
  val => {
    merchant.businessInformation = val
  },
  { immediate: true }
)

/* Custom time validator */
const timeValidate = helpers.regex(
  /^(?:\d|[01]\d|2[0-3])\.[0-5]\d$/
)

/* Vuelidate rules */
const rules = {
  merchant: {
    businessInformation: {
      gstId: { minLength: minLength(15), maxLength: maxLength(15) },
      weekdayStartHour: { timeValidate },
      weekdayEndHour: { timeValidate },
      weekendStartHour: { timeValidate },
      weekendEndHour: { timeValidate },
      debitCardMdr: { decimal, between: between(0, 99.99) },
      creditCardMdr: { decimal, between: between(0, 99.99) },
      expectedCardBusiness: { decimal, between: between(0, 9999999999.99) },
      averageBillAmount: { decimal, between: between(0, 9999999999.99) },
      lastTurnoverAmount: { decimal, between: between(0, 9999999999.99) },
      lastTurnoverYear: {
        integer,
        minLength: minLength(4),
        maxLength: maxLength(4),
        between: between(0, 2018)
      }
    }
  }
}

const v$ = useVuelidate(rules, { merchant })

const formattedMemberSince = computed(() =>
  merchant.businessInformation.memberSince
    ? date.formatDate(merchant.businessInformation.memberSince, 'DD/MM/YYYY')
    : ''
)

const validate = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ type: 'negative', message: 'Please review fields again.' })
    return
  }
  emit('goNext', 'businessInformation', merchant)
}
</script>
