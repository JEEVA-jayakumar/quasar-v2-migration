<template>
  <div>
    <div
      v-for="(partner, index) in partnersArr"
      :key="index"
      class="row q-my-xs gutter-sm"
    >
      <!-- Header -->
      <div class="col-12">
        <div class="row group items-center">
          <div class="col">
            <span class="q-pa-sm bg-light text-dark">
              <q-icon name="people" />
              Partner 0{{ index + 1 }}
            </span>
          </div>

          <div
            class="col-auto"
            v-if="partnersArr.length > 1"
          >
            <q-btn
              round
              icon="delete"
              color="negative"
              @click="removePartner(index)"
            />
          </div>
        </div>
      </div>

      <!-- Name -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          v-model="partner.name"
          :error="v$.partnersArr[index].name.$error"
          @blur="v$.partnersArr[index].name.$touch()"
          label="Name*"
          color="grey-9"
        />
      </div>

      <!-- PAN -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          v-model="partner.pan"
          :error="v$.partnersArr[index].pan.$error"
          @blur="v$.partnersArr[index].pan.$touch()"
          label="PAN*"
          color="grey-9"
          input-class="text-uppercase"
        />
      </div>

      <!-- Address -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          v-model="partner.address"
          :error="v$.partnersArr[index].address.$error"
          @blur="v$.partnersArr[index].address.$touch()"
          label="Address*"
          color="grey-9"
        />
      </div>

      <!-- PIN -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          v-model="partner.pin"
          type="number"
          :error="v$.partnersArr[index].pin.$error"
          @blur="v$.partnersArr[index].pin.$touch()"
          label="Pincode*"
          color="grey-9"
        />
      </div>

      <!-- City -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          v-model="partner.city"
          use-input
          fill-input
          hide-selected
          :options="filteredCities"
          option-label="label"
          option-value="value"
          label="City (type min 3 characters)*"
          color="grey-9"
          @filter="filterCities"
          @update:model-value="val => selectCity(val, index)"
          :error="v$.partnersArr[index].cityRefCode.$error"
        />
      </div>

      <!-- State -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          v-model="partner.state"
          use-input
          fill-input
          hide-selected
          :options="filteredStates"
          option-label="label"
          option-value="value"
          label="State*"
          color="grey-9"
          @filter="filterStates"
          @update:model-value="val => selectState(val, index)"
          :error="v$.partnersArr[index].stateRefCode.$error"
        />
      </div>

      <!-- Mobile -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          v-model="partner.contactMobile"
          type="tel"
          :error="v$.partnersArr[index].contactMobile.$error"
          @blur="v$.partnersArr[index].contactMobile.$touch()"
          label="Mobile*"
          color="grey-9"
        />
      </div>

      <!-- Email -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          v-model="partner.contactEmail"
          type="email"
          :error="v$.partnersArr[index].contactEmail.$error"
          @blur="v$.partnersArr[index].contactEmail.$touch()"
          label="Email*"
          color="grey-9"
        />
      </div>
    </div>

    <!-- Footer -->
    <q-stepper-navigation>
      <q-btn
        color="primary"
        class="q-ma-xs"
        icon="check"
        label="Continue"
        @click="validate"
      />
      <q-btn
        color="amber-10"
        class="q-ma-xs"
        icon="save"
        label="Save Partial"
        @click="$emit('saveData', 'partnerInformation', partnersArr)"
      />
      <q-btn
        color="grey-7"
        class="q-ma-xs"
        icon="block"
        label="Back"
        @click="$emit('goBack')"
      />
      <q-btn
        color="positive"
        class="q-ma-xs"
        icon="add"
        label="Add More"
        @click="addPartner"
      />
    </q-stepper-navigation>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, email, integer, minLength, maxLength, helpers } from '@vuelidate/validators'

const props = defineProps({
  cityOptions: Array,
  stateOptions: Array,
  constitution: String,
  partnerInformation: Array
})

const emit = defineEmits(['goNext', 'saveData', 'goBack'])

const $q = useQuasar()
/* PAN validator */
const panCard = helpers.regex(
  /^([A-Za-z]){5}([0-9]){4}([A-Za-z])$/
)

/* STATE */
const partnersArr = ref([])

/* WATCH PROPS */
watch(
  () => props.partnerInformation,
  val => {
    partnersArr.value = JSON.parse(JSON.stringify(val || []))
  },
  { immediate: true }
)

/* FILTERED OPTIONS */
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

/* SELECT HANDLERS */
const selectCity = (val, index) => {
  partnersArr.value[index].cityRefLabel = val.label
  partnersArr.value[index].cityRefCode = val.value
}

const selectState = (val, index) => {
  partnersArr.value[index].stateRefLabel = val.label
  partnersArr.value[index].stateRefCode = val.value
}

/* ADD / REMOVE */
const addPartner = () => {
  partnersArr.value.push({
    name: '',
    address: '',
    pan: '',
    pin: '',
    cityRefCode: '',
    cityRefLabel: '',
    stateRefCode: '',
    stateRefLabel: '',
    contactMobile: '',
    contactEmail: ''
  })
}

const removePartner = index => {
  partnersArr.value.splice(index, 1)
}

/* VALIDATIONS */
const rules = {
  partnersArr: {
    $each: {
      name: { required },
      address: { required },
      pan: { required, panCard, minLength: minLength(10), maxLength: maxLength(10) },
      pin: { required, integer, minLength: minLength(6), maxLength: maxLength(7) },
      cityRefCode: { required },
      stateRefCode: { required },
      contactMobile: { required, minLength: minLength(10), maxLength: maxLength(10) },
      contactEmail: { required, email }
    }
  }
}

const v$ = useVuelidate(rules, { partnersArr })

/* SUBMIT */
const validate = async () => {
  const valid = await v$.value.$validate()
  if (!valid) {
    $q.notify('Please review fields again.')
    return
  }

  emit('goNext', 'partnerInformation', {
    partnerInformation: partnersArr.value
  })
}
</script>
<style scoped>
</style>
