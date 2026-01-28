<template>
  <q-page padding>
    <!-- Table Title -->
    <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Lead Allocation
    </div>

    <div class="q-px-lg text-weight-regular text-grey-8">
      <div class="row q-gutter-md">
        <!-- Left Column -->
        <div class="col-md-6 col-sm-12">
          <q-input
            v-model="formData.leadName"
            label="Merchant Name*"
            placeholder="Merchant Name"
            color="grey-9"
            :error="!!$v.formData.leadName.$error"
            @blur="$v.formData.leadName.$touch"
          />

          <q-input
            v-model="formData.contactName"
            label="Contact Name*"
            placeholder="Contact Name"
            color="grey-9"
            :error="!!$v.formData.contactName.$error"
            @blur="$v.formData.contactName.$touch"
          />

          <q-input
            v-model="formData.contactNumber"
            label="Contact Number*"
            placeholder="Contact Number"
            type="number"
            color="grey-9"
            :error="!!$v.formData.contactNumber.$error"
            @blur="$v.formData.contactNumber.$touch"
          />

          <q-input
            v-model="formData.alternateContactNumber"
            label="Alternate Contact Number"
            placeholder="Alternate Contact Number"
            type="number"
            color="grey-9"
          />

          <q-input
            v-model="formData.email"
            label="Email"
            placeholder="Email"
            type="email"
            color="grey-9"
          />

          <q-input
            v-model="formData.leadAddress"
            label="Merchant Address"
            placeholder="Merchant Address"
            color="grey-9"
            :error="!!$v.formData.leadAddress.$error"
            @blur="$v.formData.leadAddress.$touch"
          />

          <q-input
            v-model.trim="formData.pincodeObj"
            label="Pincode"
            placeholder="Pincode"
            type="number"
            color="grey-9"
            clearable
            :error="!!$v.formData.pincodeObj.$error"
            @clear="fnClearStateCity"
          >
            <template #append>
              <q-autocomplete
                @search="pincodeSearch"
                :debounce="500"
                :min-characters="1"
                @selected="pincodeSelected"
              />
            </template>
          </q-input>

          <q-input
            v-model="formData.city"
            label="City/Town"
            placeholder="City/Town"
            color="grey-9"
            disable
            :error="!!$v.formData.city.$error"
            @blur="$v.formData.city.$touch"
          />

          <q-input
            v-model="formData.state"
            label="State"
            placeholder="State"
            color="grey-9"
            disable
            :error="!!$v.formData.state.$error"
            @blur="$v.formData.state.$touch"
          />
        </div>

        <!-- Right Column -->
        <div class="col-md-6 col-sm-12">
          <q-select
            v-model="formData.leadSource.id"
            label="Lead Source*"
            placeholder="Lead Source"
            color="grey-9"
            :error="!!$v.formData.leadSource.id.$error"
            @blur="$v.formData.leadSource.id.$touch"
            :options="leadSourceOptions"
            @update:model-value="fnAjaxRequestPopulateDeviceListData"
            use-chips
          />

          <q-select
            v-model="formData.device.id"
            label="Device Type"
            placeholder="Device Type"
            color="grey-9"
            :disable="isDeviceTypeSelectionDisabled"
            :error="!!$v.formData.device.id.$error"
            @blur="$v.formData.device.id.$touch"
            :options="deviceTypeOptions"
            use-chips
          />

          <q-input
            v-model="formData.deviceCount"
            label="Device Count*"
            placeholder="Device Count"
            color="grey-9"
            type="number"
            :error="!!$v.formData.deviceCount.$error"
            @blur="$v.formData.deviceCount.$touch"
          />

          <!-- RSM, ASM, TL, SO dropdowns -->
          <q-select
            v-model="currentAssingedToRSM"
            label="--RSM--"
            placeholder="Select RSM"
            color="grey-9"
            :options="assignToOptionsRSM"
            :disable="assignToOptionsRSM.length === 0"
            @update:model-value="fnGetAllUsersByHidUidASM"
            use-chips
          />

          <q-select
            v-model="currentAssingedToASM"
            label="--ASM--"
            placeholder="Select ASM"
            color="grey-9"
            :options="assignToOptionsASM"
            :disable="assignToOptionsASM.length === 0"
            @update:model-value="fnGetAllUsersByHidUidTL"
            use-chips
          />

          <q-select
            v-model="assignTo"
            label="--TL--"
            placeholder="Select TL"
            color="grey-9"
            :options="assignToOptionsTL"
            :disable="assignToOptionsTL.length === 0"
            @update:model-value="fnGetAllUsersByHidUidTL"
            use-chips
          />

          <q-select
            v-model="formData.assignedTo.id"
            label="--SO--"
            placeholder="Select SO"
            color="grey-9"
            :options="assignToOptionsSO"
            :disable="assignToOptionsSO.length === 0"
            :error="!!$v.formData.assignedTo.id.$error"
            @blur="$v.formData.assignedTo.id.$touch"
            use-chips
          />
        </div>
      </div>

      <div class="row q-mt-md">
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-btn color="dark" label="Assign" @click="fnFinalSubmit(formData)" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, minValue, maxValue } from "@vuelidate/validators";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import _ from "lodash";

const $q = useQuasar();
const store = useStore();
const route = useRoute(); // Added route

// Data
const formData = reactive({
  leadName: "",
  contactName: "",
  contactNumber: "",
  email: "",
  alternateContactNumber: "",
  leadAddress: "",
  latitude: 13.458,
  longitude: 89.236,
  city: "",
  state: "",
  deviceCount: "",
  device: { id: null },
  leadSource: { id: null },
  assignedTo: { id: null },
  pincodeObj: null,
  pincode: null,
});

// Validations
const rules = reactive({
  formData: {
    leadName: { required },
    leadAddress: { required },
    contactName: { required },
    contactNumber: { required, minLength: minLength(8), maxLength: maxLength(10) },
    latitude: { required },
    longitude: { required },
    city: { required },
    state: { required },
    deviceCount: { required, minValue: minValue(1), maxValue: maxValue(100) },
    device: { id: { required } },
    leadSource: { id: { required } },
    assignedTo: { id: { required } },
    pincodeObj: { required },
  },
});
const $v = useVuelidate(rules, { formData });

// Options
const isDeviceTypeSelectionDisabled = ref(true);
const leadSourceOptions = ref([]);
const deviceTypeOptions = ref([]);
const assignToOptionsRSM = ref([]);
const assignToOptionsASM = ref([]);
const assignToOptionsTL = ref([]);
const assignToOptionsSO = ref([]);
const currentAssingedToRSM = ref(null);
const currentAssingedToASM = ref(null);
const assignTo = ref(null);

// Vuex getters using computed properties
const getAllStatesData = computed(() => store.getters["SalesManager_LeadAllocation/getAllStatesData"] || []);
const getDevicesBasedOnLeadSource = computed(() => store.getters["SalesManager_LeadAllocation/getDevicesBasedOnLeadSource"] || {});
const getSelectOptionsLeadSourceInfo = computed(() => store.getters["SalesManager_LeadAllocation/getSelectOptionsLeadSourceInfo"] || []);
const getAllShortLeadInfoById = computed(() => store.getters["SalesManager_LeadAllocation/getAllShortLeadInfoById"] || {});

// Vuex actions using store.dispatch
const FETCH_ALL_STATES_DATA = () => store.dispatch("SalesManager_LeadAllocation/FETCH_ALL_STATES_DATA");
const FETCH_PINCODE_WITH_TERM = (term) => store.dispatch("SalesManager_LeadAllocation/FETCH_PINCODE_WITH_TERM", term);
const FETCH_ALL_LEAD_SOURCE_DATA = () => store.dispatch("SalesManager_LeadAllocation/FETCH_ALL_LEAD_SOURCE_DATA");
const FETCH_LEAD_DETAILS_IN_DETAIL = (id) => store.dispatch("SalesManager_LeadAllocation/FETCH_LEAD_DETAILS_IN_DETAIL", id);
const DEVICE_LIST_BASED_ON_LEAD_SOURCE = (leadSourceId) => store.dispatch("SalesManager_LeadAllocation/DEVICE_LIST_BASED_ON_LEAD_SOURCE", leadSourceId);
const UPDATE_SHORT_LEAD_SALES_INFO = (data) => store.dispatch("SalesManager_LeadAllocation/UPDATE_SHORT_LEAD_SALES_INFO", data);

// Functions
function COMMON_FILTER_FUNCTION(arraySet, terms) {
  return _.filter(arraySet, (oo) => oo.label.toLowerCase().includes(terms.toLowerCase()));
}

function pincodeSearch(terms, done) {
  formData.city = "";
  formData.state = "";
  FETCH_PINCODE_WITH_TERM(terms)
    .then(() => {
      // Convert getAllStatesData to options format for filtering
      const statesOptions = getAllStatesData.value.map(item => ({
        label: `${item.pincode} - ${item.cityName}, ${item.stateName}`,
        value: item
      }));
      done(COMMON_FILTER_FUNCTION(statesOptions, terms));
    })
    .catch(() => done([]));
}

function pincodeSelected(item) {
  if (item.value) {
    formData.state = item.value.stateName;
    formData.city = item.value.cityName;
    formData.pincode = item.value.pincode;
    formData.pincodeObj = item.value.pincode;
  }
}

function fnClearStateCity() {
  formData.state = "";
  formData.city = "";
  formData.pincode = null;
}

function fnAjaxRequestPopulateDeviceListData() {
  deviceTypeOptions.value = [];
  if (!formData.leadSource.id) return;
  
  DEVICE_LIST_BASED_ON_LEAD_SOURCE(formData.leadSource.id)
    .then(() => {
      const devices = getDevicesBasedOnLeadSource.value.device || [];
      deviceTypeOptions.value = devices.map((value) => ({
        label: value.deviceName,
        value: value.id,
      }));
      isDeviceTypeSelectionDisabled.value = false;
    })
    .catch((error) => {
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.body?.message ?? "Please Try Again Later !",
        icon: "thumb_down",
      });
    });
}

// Added missing functions
function fnGetAllUsersByHidUidASM() {
  // Implement your logic for ASM user fetching
  console.log("Fetch ASM users based on RSM selection:", currentAssingedToRSM.value);
}

function fnGetAllUsersByHidUidTL() {
  // Implement your logic for TL user fetching
  console.log("Fetch TL users based on ASM selection:", currentAssingedToASM.value);
}

function fnFinalSubmit() {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({
      color: "negative",
      message: "Please review fields again.",
      icon: "thumb_down",
    });
    return;
  }
  
  UPDATE_SHORT_LEAD_SALES_INFO(formData)
    .then(() => {
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully lead has been created and allocated!",
        icon: "thumb_up",
      });
    })
    .catch((error) => {
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.body?.message ?? "Please Try Again Later !",
        icon: "thumb_down",
      });
    });
}

// Populate Lead Details
onMounted(() => {
  const leadId = route.params.id;
  if (!leadId) {
    $q.notify({
      color: "negative",
      message: "No lead ID provided in route parameters",
      icon: "thumb_down",
    });
    return;
  }

  FETCH_ALL_STATES_DATA();
  FETCH_LEAD_DETAILS_IN_DETAIL(leadId).then(() => {
    const leadInfo = getAllShortLeadInfoById.value.assignedLeads;
    if (leadInfo) {
      Object.assign(formData, leadInfo);
      
      // Ensure nested objects exist
      if (!formData.device) formData.device = { id: null };
      if (!formData.leadSource) formData.leadSource = { id: null };
      if (!formData.assignedTo) formData.assignedTo = { id: null };
      
      FETCH_ALL_LEAD_SOURCE_DATA().then(() => {
        leadSourceOptions.value = getSelectOptionsLeadSourceInfo.value.map((v) => ({ 
          label: v.sourceName, 
          value: v.id 
        }));
      });
      fnAjaxRequestPopulateDeviceListData();
    }
  }).catch(error => {
    $q.notify({
      color: "negative",
      message: "Failed to load lead details",
      icon: "thumb_down",
    });
    console.error("Error loading lead details:", error);
  });
});
</script>

<style scoped>
</style>