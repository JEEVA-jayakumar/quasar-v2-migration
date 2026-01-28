<template>
  <q-page>
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Assign Short Lead
      </div>
      <div class="q-px-lg">
        <div class="q-body-1 uppercase text-weight-medium text-grey-9 q-my-md">Merchant Details</div>
        <div class="row group q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="formData.leadName"
              @blur="v$.formData.leadName.$touch"
              :error="v$.formData.leadName.$error"
              :error-message="v$.formData.leadName.$errors[0]?.$message"
              label="Merchant Name"
              placeholder="Merchant Name"
              color="grey-9"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="formData.contactName"
              @blur="v$.formData.contactName.$touch"
              :error="v$.formData.contactName.$error"
              :error-message="v$.formData.contactName.$errors[0]?.$message"
              label="Contact Name"
              placeholder="Contact Name"
              color="grey-9"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="formData.contactNumber"
              @blur="v$.formData.contactNumber.$touch"
              :error="v$.formData.contactNumber.$error"
              :error-message="v$.formData.contactNumber.$errors[0]?.$message"
              label="Contact Number"
              placeholder="Contact Number"
              color="grey-9"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="formData.alternateContactNumber"
              @blur="v$.formData.alternateContactNumber.$touch"
              :error="v$.formData.alternateContactNumber.$error"
              :error-message="v$.formData.alternateContactNumber.$errors[0]?.$message"
              label="Alternate Contact Number"
              placeholder="Alternate Contact Number"
              color="grey-9"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row group q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="formData.leadAddress"
              label="Merchant Address"
              placeholder="Merchant Address"
              color="grey-9"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              type="number"
              :error="v$.formData.pincode.$error"
              :error-message="v$.formData.pincode.$errors[0]?.$message"
              clearable
              @clear="fnClearStateCity"
              color="grey-9"
              v-model="formData.pincode"
              label="Pincode"
              placeholder="Pincode"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-input
              disable
              v-model="formData.city"
              @blur="v$.formData.city.$touch"
              :error="v$.formData.city.$error"
              :error-message="v$.formData.city.$errors[0]?.$message"
              label="City/Town"
              placeholder="City/Town"
              color="grey-9"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              disable
              v-model="formData.state"
              @blur="v$.formData.state.$touch"
              :error="v$.formData.state.$error"
              :error-message="v$.formData.state.$errors[0]?.$message"
              label="State"
              placeholder="State"
              color="grey-9"
              outlined
              dense
            />
          </div>
        </div>

        <div class="q-body-1 uppercase text-weight-medium text-grey-9 q-my-md">Device Details</div>
        <div class="row group q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="formData.leadSource"
              @blur="v$.formData.leadSource.id.$touch"
              :error="v$.formData.leadSource.id.$error"
              :error-message="v$.formData.leadSource.id.$errors[0]?.$message"
              label="Lead Source"
              placeholder="Lead Source"
              color="grey-9"
              :options="leadSourceSelectOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              clearable
              @clear="fnClearDeviceList"
              outlined
              dense
              use-input
              @filter="leadSourceFilterFn"
              input-debounce="500"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No data available</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              :disable="deviceSelectOptions.length === 0"
              label="Device Type"
              placeholder="Device Type"
              clearable
              color="grey-9"
              v-model="formData.device.id"
              @blur="v$.formData.device.id.$touch"
              :error="v$.formData.device.id.$error"
              :error-message="v$.formData.device.id.$errors[0]?.$message"
              :options="deviceSelectOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No data available</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="formData.deviceCount"
              @blur="v$.formData.deviceCount.$touch"
              :error="v$.formData.deviceCount.$error"
              :error-message="v$.formData.deviceCount.$errors[0]?.$message"
              type="number"
              label="Device Count"
              placeholder="Device Count"
              color="grey-9"
              outlined
              dense
            />
          </div>
        </div>
        
        <div class="q-body-1 uppercase text-weight-medium text-grey-9 q-my-md">Assign To</div>
        <div class="row">
          <div class="col-md-6 group">
            <q-radio
              v-model="formData.tempAssignedTo"
              @update:model-value="fnToShowAssignSelect"
              val="1"
              label="RSM"
              color="primary"
            />
            <q-radio
              v-model="formData.tempAssignedTo"
              @update:model-value="fnToShowAssignSelect"
              val="2"
              label="ASM"
              color="primary"
            />
          </div>
        </div>

        <div class="row group q-col-gutter-md q-mt-xs">
          <div class="col-12 col-md-4" v-if="formData.tempAssignedTo === '1'">
            <q-select
              :disable="RSMselectOptions.length === 0"
              @blur="v$.formData.assignedOpsTo.id.$touch"
              :error="v$.formData.assignedOpsTo.id.$error"
              :error-message="v$.formData.assignedOpsTo.id.$errors[0]?.$message"
              label="RSM Name"
              placeholder="Choose from the below"
              clearable
              color="grey-9"
              v-model="formData.assignedOpsTo.id"
              :options="RSMselectOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No data available</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4" v-if="formData.tempAssignedTo === '2'">
            <q-select
              :disable="getAllRegionsData.length === 0"
              label="Region"
              placeholder="Choose Region"
              clearable
              color="grey-9"
              v-model="region"
              :options="getAllRegionsData"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              @clear="fnClearASMList"
              @update:model-value="fnFetchASMList"
              outlined
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No data available</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4" v-if="formData.tempAssignedTo === '2'">
            <q-select
              :disable="ASMselectOptions.length === 0"
              @blur="v$.formData.assignedOpsTo.id.$touch"
              :error="v$.formData.assignedOpsTo.id.$error"
              :error-message="v$.formData.assignedOpsTo.id.$errors[0]?.$message"
              label="ASM Name"
              placeholder="Choose from the below"
              clearable
              color="grey-9"
              v-model="formData.assignedOpsTo.id"
              :options="ASMselectOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No data available</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        
        <div class="row q-mt-lg">
          <div class="col group" align="right">
            <q-btn icon="block" outline color="dark" label="Cancel" class="q-mr-md" />
            <q-btn @click="fnSubmitAssignShortLead" icon="check" color="primary" label="Submit" />
          </div>
        </div>
      </div>
      
      <!-- Loading Spinner -->
      <q-inner-loading :showing="toggleAjaxLoadFilter">
        <q-spinner-bars size="35px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue, minLength, maxLength } from '@vuelidate/validators';

// Quasar instance
const $q = useQuasar();
const router = useRouter();
const store = useStore();

// Reactive state
const toggleAjaxLoadFilter = ref(false);
const region = ref('');
const deviceSelectOptions = ref([]);
const leadSourceSelectOptions = ref([]);
const RSMselectOptions = ref([]);
const ASMselectOptions = ref([]);
const filteredLeadSourceOptions = ref([]);

// Form data
const formData = reactive({
  leadName: '',
  contactName: '',
  contactNumber: '',
  alternateContactNumber: '',
  leadAddress: '',
  latitude: 13.458,
  longitude: 89.236,
  city: '',
  deviceCount: '',
  state: '',
  device: {
    id: ''
  },
  leadSource: {
    id: '',
    name: ''
  },
  tempAssignedTo: '1',
  assignedOpsTo: {
    id: ''
  },
  pincode: ''
});

// Validation rules
const rules = {
  formData: {
    leadName: { required },
    contactName: { required },
    contactNumber: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(10)
    },
    alternateContactNumber: {
      minLength: minLength(10),
      maxLength: maxLength(10)
    },
    latitude: { required },
    longitude: { required },
    city: { required },
    deviceCount: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(100)
    },
    state: { required },
    device: {
      id: { required }
    },
    leadSource: {
      id: { required }
    },
    assignedOpsTo: {
      id: { required }
    },
    pincode: { required }
  }
};

const v$ = useVuelidate(rules, { formData });

// Computed properties


const getAllRegionsData = computed(() => {
  const regions = store.getters['SuperAdminUsers/getAllRegionsData'] || [];
  return regions.map(region => ({
    label: region.regionName || region.name || '',
    value: region.id || region.value || ''
  }));
});

const getAllDevicesInfo = computed(() => {
  return store.getters['SA_Devices/getAllDevicesInfo'] || [];
});

const getSelectOptionsRSMInfo = computed(() => {
  return store.getters['BankOpsShortLead/getSelectOptionsRSMInfo'] || [];
});

const getSelectOptionsASMInfo = computed(() => {
  return store.getters['BankOpsShortLead/getSelectOptionsASMInfo'] || [];
});

const getSelectOptionsLeadSourceBankInfo = computed(() => {
  return store.getters['BankOpsShortLead/getSelectOptionsLeadSourceBankInfo'] || [];
});

// Lifecycle hooks
onMounted(() => {
  ajaxLoadDataForAllStatesList();
  ajaxLoadDataForRSMandASMList();
});

// Methods
const ajaxLoadDataForAllStatesList = async () => {
  try {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA');
    
    await store.dispatch('BankOpsShortLead/FETCH_ALL_LEAD_SOURCE_BANK_DATA');
    const leadSourceData = getSelectOptionsLeadSourceBankInfo.value;
    leadSourceSelectOptions.value = leadSourceData.map(item => ({
      label: item.sourceName,
      value: item.id
    }));
    filteredLeadSourceOptions.value = [...leadSourceSelectOptions.value];
    
    await store.dispatch('SA_Devices/FETCH_DEVICES_DATA');
    const devicesData = getAllDevicesInfo.value;
    deviceSelectOptions.value = devicesData.map(item => ({
      label: item.deviceName,
      value: item.id
    }));
    
    await store.dispatch('BankOpsShortLead/FETCH_RSM_DATA');
    const rsmData = getSelectOptionsRSMInfo.value;
    RSMselectOptions.value = rsmData.map(item => ({
      label: item.name,
      value: item.id
    }));
  } catch (error) {

    console.error('Error loading initial data:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to load initial data',
      icon: 'error'
    });
  }
};

const ajaxLoadDataForRSMandASMList = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
};

const fnClearStateCity = () => {
  formData.pincode = '';
  formData.state = '';
  formData.city = '';
};

const fnClearASMList = () => {
  ASMselectOptions.value = [];
  region.value = '';
};

const fnClearDeviceList = () => {
  deviceSelectOptions.value = [];
  formData.device.id = '';
  formData.leadSource.id = '';
  formData.leadSource.name = '';
};

const leadSourceFilterFn = (val, update) => {
  update(() => {
    if (val === '') {
      filteredLeadSourceOptions.value = leadSourceSelectOptions.value;
    } else {
      const needle = val.toLowerCase();
      filteredLeadSourceOptions.value = leadSourceSelectOptions.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};


const fnToShowAssignSelect = () => {
  formData.assignedOpsTo.id = '';
};

const fnFetchASMList = async () => {
  if (!region.value) return;
  
  try {
    await store.dispatch('BankOpsShortLead/FETCH_ASM_DATA', region.value);
    const asmData = getSelectOptionsASMInfo.value;
    
    if (asmData.length > 0) {
      ASMselectOptions.value = asmData.map(item => ({
        label: item.name,
        value: item.id
      }));
    } else {
      ASMselectOptions.value = [];
      $q.notify({
        color: 'warning',
        position: 'bottom',
        message: 'No ASM available in the selected region',
        icon: 'warning'
      });
    }
  } catch (error) {

    console.error('Error fetching ASM list:', error);
  }
};

const fnSubmitAssignShortLead = async () => {
  const isFormValid = await v$.value.$validate();
  
  if (!isFormValid) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Please review fields again.',
      icon: 'warning'
    });
    return;
  }
  
  $q.loading.show({
    message: 'Submitting...'
  });
  
  try {
    await store.dispatch('BankOpsShortLead/CREATE_SHORT_LEAD', formData);
    
    $q.loading.hide();
    router.push('/bank/ops/assign/short/lead');
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully submitted!',
      icon: 'thumb_up'
    });
    
    // Reset form
    Object.assign(formData, {
      leadName: '',
      contactName: '',
      contactNumber: '',
      alternateContactNumber: '',
      leadAddress: '',
      latitude: 13.458,
      longitude: 89.236,
      city: '',
      deviceCount: '',
      state: '',
      device: { id: '' },
      leadSource: { id: '', name: '' },
      tempAssignedTo: '1',
      assignedOpsTo: { id: '' },
      pincode: ''
    });
    region.value = '';
    v$.value.$reset();
    
  } catch (error) {

    $q.loading.hide();
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    });
  }
};
</script>

<style scoped>
.group {
  margin-bottom: 20px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.q-radio {
  margin-right: 20px;
}
</style>