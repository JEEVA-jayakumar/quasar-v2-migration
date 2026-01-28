<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModel"
      class="customModalOverlay"
      @hide="emitfnzEditshowConvertToSat(toggleModel)"
      persistent
    >
      <q-card style="padding: 25px; min-width: 40vw; max-width: 800px; max-height: 80vh; overflow-y: auto">
        <form @submit.prevent="submitShortLead(formData)">
          <div class="column group">
            <div class="col-md-12">
              <div class="q-title text-weight-regular">Edit WIP List</div>
            </div>

            <!-- Lead ID -->
            <div class="col-md-12">
              <q-input
                v-model="formData.id"
                disable
                label="Lead ID"
                placeholder="Lead ID"
                color="grey-9"
              />
            </div>

            <!-- Lead Name -->
            <div class="col-md-12">
              <q-input
                v-model="formData.leadName"
                :error="v$.formData.leadName.$error"
                label="Lead Name"
                placeholder="Lead Name"
                color="grey-9"
              />
            </div>

            <!-- Lead Number -->
            <div class="col-md-12">
              <q-input
                v-model="formData.leadNumber"
                disable
                label="Lead Number"
                placeholder="Lead Number"
                color="grey-9"
              />
            </div>

            <!-- Contact Number -->
            <div class="col-md-12">
              <q-input
                v-model="formData.contactNumber"
                type="tel"
                @keydown="numberOnly($event)"
                :error="v$.formData.contactNumber.$error"
                label="Contact Number"
                placeholder="Contact Number"
                color="grey-9"
              />
            </div>

            <!-- Alternate Contact Number -->
            <div class="col-md-12">
              <q-input
                v-model="formData.alternateContactNumber"
                type="tel"
                @keydown="numberOnly($event)"
                label="Alternate Contact Number"
                placeholder="Alternate Contact Number"
                color="grey-9"
              />
            </div>

            <!-- Email -->
            <div class="col-md-12">
              <q-input
                v-model="formData.email"
                :error="v$.formData.email.$error"
                label="Email"
                placeholder="Email"
                color="grey-9"
              />
            </div>

            <!-- Address -->
            <div class="col-md-12">
              <q-input
                v-model="formData.leadAddress"
                :error="v$.formData.leadAddress.$error"
                label="Lead Address"
                placeholder="Lead Address"
                color="grey-9"
              />
            </div>

            <!-- Pincode -->
            <div class="col-md-12">
              <q-input
                v-model="formData.pincode"
                type="tel"
                @keydown="numberOnly($event)"
                :error="v$.formData.pincode.$error"
                label="Pincode"
                placeholder="Pincode"
                color="grey-9"
              />
            </div>

            <!-- City & State -->
            <div class="col-md-12">
              <q-input v-model="formData.city" disable label="City" color="grey-9" />
            </div>
            <div class="col-md-12">
              <q-input v-model="formData.state" disable label="State" color="grey-9" />
            </div>

            <!-- Merchant Tier Mapping -->
            <div class="col-md-12 q-mt-md">Merchant Tier Mapping</div>
            <div class="col-md-12">
              <q-select
                v-model="formData.merchantState"
                :options="dropDown.merchantState"
                :error="v$.formData.merchantState.$error"
                label="Select Merchant State*"
                @update:model-value="getdistrict"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-select
                v-model="formData.district"
                :options="dropDown.merchantDistrict"
                :error="v$.formData.district.$error"
                label="Select Merchant District*"
                @update:model-value="getSubDistrict"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-select
                v-model="formData.subDistrict"
                :options="dropDown.merchantSubDistrict"
                :error="v$.formData.subDistrict.$error"
                label="Select Merchant Sub District*"
                @update:model-value="getTownOrVillage"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-select
                v-model="formData.village"
                :options="dropDown.merchantTownOrVillageDetails"
                :error="v$.formData.village.$error"
                label="Select Merchant Town/Village*"
                @update:model-value="getVillageTier"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-input v-model="formData.tier" disable label="Merchant Tier" color="grey-9" />
            </div>

            <!-- Lead Source & Device -->
            <div class="col-md-12">
              <q-select
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                :error="v$.formData.leadSource.$error"
                label="Select Lead Source"
                @update:model-value="fnleadSource"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-select
                v-model="formData.device"
                :options="dropDown.deviceOptions"
                :error="v$.formData.device.$error"
                label="Select Device"
                @update:model-value="fnDevice"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-input
                v-model="formData.deviceCount"
                :disable="deviceFlag"
                :error="v$.formData.deviceCount.$error"
                label="Device Count"
                color="grey-9"
              />
            </div>

            <!-- MATM Plan Section -->
            <div v-if="plan === 'mATM'" class="col-md-12">
              <q-select
                v-model="formData.mAtmOnboardingPlan"
                :options="dropDown.planNameOptions"
                label="Select MATM Plans"
                @update:model-value="fnPlanName"
                color="grey-9"
              />
            </div>
            <div v-if="plan === 'mATM'" class="col-md-12">
              <q-input
                v-model="formData.incentivePercentage"
                disable
                label="Percentage"
                color="grey-9"
              />
            </div>
            <div v-if="plan === 'mATM'" class="col-md-12">
              <q-input v-model="formData.minTxnVal" disable label="Minimum" color="grey-9" />
            </div>
            <div v-if="plan === 'mATM'" class="col-md-12">
              <q-input v-model="formData.maxIncPerTxn" disable label="Maximum Txn Value" color="grey-9" />
            </div>

            <!-- Merchant Category & MDR Plan -->
            <div class="col-md-12">
              <q-select
                v-model="formData.merchantCategory"
                :options="dropDown.merchantCategory"
                :error="v$.formData.merchantCategory.$error"
                label="Select Merchant Category"
                @update:model-value="fnMerchantCategory"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <q-select
                v-model="mdrPlan"
                :options="dropDown.mdrOptions"
                label="Select MDR Plan"
                @update:model-value="fnFillMdr(mdrPlan)"
                color="grey-9"
              />
            </div>

            <!-- Payment Section -->
            <div class="col-md-12 q-mt-md">Payment Option</div>
            <div class="col-md-12">
              <q-input
                v-model="formData.amountCollected"
                :error="v$.formData.amountCollected.$error"
                label="Amount Collected"
                color="grey-9"
              />
            </div>
            <div class="col-md-12">
              <!-- CHANGE: q-datetime to q-date + q-time (if needed) -->
              <q-input
                v-model="formData.paymentMadeon"
                :error="v$.formData.paymentMadeon.$error"
                label="Transaction Made On"
                type="date"
                color="grey-9"
              />
              <!-- OR use q-date picker:
              <q-date
                v-model="formData.paymentMadeon"
                :error="v$.formData.paymentMadeon.$error"
                label="Transaction Made On"
                color="grey-9"
              />
              -->
            </div>
            <div class="col-md-12">
              <q-select
                v-model="formData.paymentOption"
                :options="paymentType"
                :error="v$.formData.paymentOption.$error"
                label="Payment Type"
                color="grey-9"
              />
            </div>

            <!-- Conditional Reference Number -->
            <div class="col-md-12" v-if="formData.paymentOption == 1">
              <q-input
                v-model="formData.referenceNumber"
                :error="v$.formData.referenceNumber.$error"
                label="NEFT Number"
                color="grey-9"
              />
            </div>
            <div class="col-md-12" v-if="formData.paymentOption == 2">
              <q-input
                v-model="formData.referenceNumber"
                :error="v$.formData.referenceNumber.$error"
                label="Cheque Number"
                color="grey-9"
              />
              <q-item>
                <q-item-section>Upload the Cheque File:</q-item-section>
                <label class="cursor-pointer text-white q-pa-xs" style="background-color: #202c3f; border-radius: 4px;">
                  <span>Attach</span>
                  <input type="file" accept=".png, .jpg, .pdf" @change="fnUploadApplicationForm($event)" style="display: none;" />
                </label>
                &nbsp;{{ formData.paymentDocumentFile }}
              </q-item>
            </div>
            <div class="col-md-12" v-if="formData.paymentOption == 3">
              <q-input
                v-model="formData.referenceNumber"
                :error="v$.formData.referenceNumber.$error"
                label="SWIPE Number"
                color="grey-9"
              />
            </div>

            <!-- Merchant Type -->
            <div class="col-md-12">
              <q-select
                v-model="formData.merchantType"
                :options="dropDown.merchantType"
                :error="v$.formData.merchantType.$error"
                label="Select Merchant Type"
                color="grey-9"
              />
            </div>

            <!-- Action Buttons -->
            <div class="col-md-12 group q-mt-md" align="right">
              <q-btn flat color="grey-8" class="bg-white" @click="emitfnzEditshowConvertToSat(toggleModel)">
                Cancel
              </q-btn>
              <q-btn color="purple-9" type="submit">Submit to SAT</q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required, numeric, email, maxLength, minLength } from "@vuelidate/validators";

// Props
const props = defineProps({
  propShowConvertToSat: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitEditshowConvertToSat"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowConvertToSat);
const plan = ref("");
const mdrPlan = ref("");
const deviceFlag = ref(false);

const paymentType = ref([
  { label: "Cheque", value: 2 },
  { label: "NEFT", value: 1 },
  { label: "SWIPE", value: 3 },
]);

const formData = reactive({
  id: props.propRowDetails.id,
  leadNumber: props.propRowDetails.leadNumber,
  leadName: props.propRowDetails.leadName,
  contactNumber: props.propRowDetails.contactNumber,
  alternateContactNumber: props.propRowDetails.alternateContactNumber,
  email: props.propRowDetails.email,
  leadAddress: props.propRowDetails.leadAddress,
  pincode: props.propRowDetails.pincode,
  city: props.propRowDetails.city,
  state: props.propRowDetails.state,
  leadCategory: 1,
  merchantState: "",
  district: "",
  subDistrict: "",
  village: "",
  tier: "",
  leadSource: JSON.stringify(props.propRowDetails.leadSource),
  device: JSON.stringify(props.propRowDetails.device),
  deviceCount: props.propRowDetails.deviceCount,
  merchantType: "",
  merchantCategory: "",
  plan: "",
  setupFees: 0,
  recurringFees: 0,
  posEnable: "",
  amountCollected: "",
  paymentMadeon: "",
  paymentOption: 1,
  referenceNumber: "",
  paymentDocumentFile: "",
  paymentDocumentMimeType: "",
  mAtmOnboardingPlan: null,
  incentivePercentage: 0,
  minTxnVal: 0,
  maxIncPerTxn: 0,
});

const dropDown = reactive({
  deviceOptions: [],
  leadSourceOptions: [],
  merchantState: [],
  merchantDistrict: [],
  merchantSubDistrict: [],
  merchantTownOrVillageDetails: [],
  merchantCategory: [],
  planNameOptions: [],
  merchantType: [],
  mdrOptions: [],
});

// Validation rules
const rules = {
  formData: {
    leadName: { required },
    contactNumber: { required, minLength: minLength(10), maxLength: maxLength(10) },
    email: { required, email },
    leadAddress: { required },
    pincode: { required },
    city: { required },
    state: { required },
    merchantState: { required },
    district: { required },
    subDistrict: { required },
    village: { required },
    leadSource: { required },
    device: { required },
    deviceCount: { required },
    merchantType: { required },
    merchantCategory: { required },
    paymentOption: { required, numeric },
    amountCollected: { required },
    paymentMadeon: { required },
  }
};

const v$ = useVuelidate(rules, { formData });

// Watch prop to sync modal
watch(() => props.propShowConvertToSat, (val) => {
  toggleModel.value = val;
});

// Lifecycle hooks
onMounted(() => {
  if (props.propRowDetails.device.deviceName === "Q161_PRO_SQR") {
    formData.deviceCount = 1;
    deviceFlag.value = true;
  }
});

// Methods
const emitfnzEditshowConvertToSat = (toggleModel) => {
  emit("emitEditshowConvertToSat", toggleModel);
};

const numberOnly = (event) => {
  const allowedKeys = [8, 46]; // backspace & delete
  if (!allowedKeys.includes(event.keyCode) && isNaN(Number(event.key))) {
    event.preventDefault();
  }
};

const fnUploadApplicationForm = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const formDataObj = new FormData();
  formDataObj.append("file", file);
  $q.loading.show({ message: "Uploading file...", spinnerColor: "purple-9" });
  // Simulate API call
  setTimeout(() => {
    formData.paymentDocumentFile = file.name;
    formData.paymentDocumentMimeType = file.type;
    $q.loading.hide();
    $q.notify({ color: "positive", message: "File Uploaded Successfully!" });
  }, 1000);
};

const submitShortLead = async (request) => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    $q.notify({ color: "negative", message: "Please review fields again." });
    return;
  }
  
  if (request.paymentOption == 2 && !request.paymentDocumentFile) {
    $q.notify({ color: "amber", message: "Please attach the Cheque File." });
    return;
  }
  
  // Here you can call SO_TO_SAT API
  console.log("Form Submitted", request);
  $q.notify({ color: "positive", message: "WIP Lead successfully created!" });
  emitfnzEditshowConvertToSat(toggleModel.value);
};

// Placeholder methods - you need to implement these
const getdistrict = () => { /* implement */ };
const getSubDistrict = () => { /* implement */ };
const getTownOrVillage = () => { /* implement */ };
const getVillageTier = () => { /* implement */ };
const fnleadSource = () => { /* implement */ };
const fnDevice = () => { /* implement */ };
const fnPlanName = () => { /* implement */ };
const fnMerchantCategory = () => { /* implement */ };
const fnFillMdr = () => { /* implement */ };
</script>

<style scoped>
.customModalOverlay {
  z-index: 7000 !important;
}
.group > .col-md-12 {
  margin-bottom: 16px;
}
.q-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 20px;
}
</style>