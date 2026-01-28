<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-h5 q-mb-md text-weight-regular">Add MDR details</div>
      </div>
      
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-6 col-xs-12">
        <q-card>
          <q-card-section>
            <q-list>
              <!-- Lead Source -->
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select lead source"
                    filled
                    map-options
                    emit-value
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn 
                    round 
                    @click="fnManageLeadSource" 
                    size="sm" 
                    icon="add" 
                    color="purple-9" 
                  />
                </q-item-section>
              </q-item>

              <!-- Device -->
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.device"
                    :options="dropDown.deviceOptions"
                    label="Select device"
                    filled
                    map-options
                    emit-value
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn 
                    round 
                    @click="fnManageDevice" 
                    size="sm" 
                    icon="add" 
                    color="purple-9" 
                  />
                </q-item-section>
              </q-item>

              <!-- Mars Device Model -->
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.marsDevice"
                    :options="dropDown.marsDeviceOptions"
                    label="Mars Device Model"
                    filled
                    map-options
                    emit-value
                  />
                </q-item-section>
              </q-item>

              <!-- Merchant Type -->
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.merchantType"
                    :options="dropDown.merchantTypesOptions"
                    label="Select merchant category type"
                    filled
                    map-options
                    emit-value
                    @update:model-value="fnCategoryBasedMdr"
                  />
                </q-item-section>
              </q-item>

              <!-- Debit <= 2000 % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.debitLessthanAmount"
                    label="Debit <= 2000 %"
                    placeholder="Debit <= 2000 %"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Debit > 2000 % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.debitGreaterthanAmount"
                    label="Debit > 2000 %"
                    placeholder="Debit > 2000 %"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Std CC % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.stdCC"
                    label="Std CC %"
                    placeholder="Std CC %"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Premium CC % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.premiumCC"
                    label="Premium CC %"
                    placeholder="Premium CC %"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Corp Pre CC % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.corpCC"
                    label="Corp Pre CC %"
                    placeholder="Corp Pre CC %"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Intl Pre CC % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.intlCC"
                    label="Intl Pre CC %"
                    placeholder="Intl Pre CC %"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Super Pre CC % -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.superPremiumlCC"
                    label="Super Pre CC %"
                    placeholder="Super Pre CC %"
                    filled
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          
          <q-card-actions vertical align="right">
            <q-btn 
              label="Submit" 
              @click="fnsubmit" 
              color="purple-9" 
              class="q-mt-md"
            />
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup MDR details -->

      <!-- START >> Table >> MDR details -->
      <div class="col-md-7 col-sm-6 col-xs-12">
        <!-- Table component can be added here as needed -->
      </div>
      <!-- END >> Table >> MDR details -->

      <!-- START: Modal Components -->
      <showLeadSourceModalComponent
        v-model="showLeadSourceModal"
        @update:model-value="fnManageLeadSource"
      />
      
      <showDeviceDetailModalComponent
        v-model="showDeviceDetailModal"
        @update:model-value="fnManageDevice"
      />
      
      <showMerchantModalComponent
        v-model="showMerchantModal"
        @update:model-value="fnManageMerchantType"
      />
      <!-- END: Modal Components -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import _ from 'lodash';

/* START >> Modal components Lead source, device, merchant type */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";
/* END >> Modal components Lead source, device, merchant type */

const $q = useQuasar();

/* START >> Modal refs */
const showLeadSourceModal = ref(false);
const showDeviceDetailModal = ref(false);
const showMerchantModal = ref(false);
/* END >> Modal refs */

/* START >> Form data */
const formData = ref({
  leadSource: null,
  device: null,
  marsDevice: null,
  merchantType: null,
  debitLessthanAmount: '',
  debitGreaterthanAmount: '',
  stdCC: '',
  premiumCC: '',
  corpCC: '',
  intlCC: '',
  superPremiumlCC: ''
});

const dropDown = ref({
  deviceOptions: [],
  leadSourceOptions: [],
  marsDeviceOptions: [],
  merchantTypesOptions: []
});
/* END >> Form data */

// Vuex Store Integration (Composition API style)
// Note: In Vue 3 with Composition API, you might need to adjust Vuex usage
// If you're using Vuex 4 with Vue 3, you can use useStore()
// For now, keeping the existing mapGetters/actions pattern with adjustments

// Since we're using <script setup>, we need to use composables
// If Vuex store is set up for Composition API:
import { useStore } from 'vuex';

const store = useStore();

// Getters (Composition API style)
const getAllDevicesInfo = computed(() => store.getters['SA_Devices/getAllDevicesInfo']);
const getMarsDeviceModel = computed(() => store.getters['SA_Devices/getMarsDeviceModel']);
const getActiveLeadSource = computed(() => store.getters['leadSource/getActiveLeadSource']);
const getActiveMerchantCategory = computed(() => store.getters['merchantCategory/getActiveMerchantCategory']);
const categoryBasedMdr = computed(() => store.getters['CategoryBasedMdr/categoryBasedMdr']);

// Actions (Composition API style)
const fetchDevicesData = () => store.dispatch('SA_Devices/FETCH_DEVICES_DATA');
const fetchMarsDeviceModel = () => store.dispatch('SA_Devices/FETCH_MARS_DEVICE_MODEL');
const loadLeadSourceActiveList = () => store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST');
const loadMerchantCategoryActiveList = () => store.dispatch('merchantCategory/MERCHANT_CATEGORY_ACTIVE_LIST');
const submitMdrPlan = (params) => store.dispatch('MdrPlan/MDR_PLAN', params);
const loadCategoryBasedMdrPlan = (params) => store.dispatch('CategoryBasedMdr/CATEGORY_BASED_MDR_PLAN', params);

onMounted(() => {
  /* START: Load user table data filter > DeviceTypes */
  ajaxLoadDataForDeviceTypeTable();
  marsDeviceModelDatasLoading();
  /* End: Load user table data filter > DeviceTypes */
});

async function marsDeviceModelDatasLoading() {
  try {
    await fetchMarsDeviceModel();
    
    if (getMarsDeviceModel.value) {
      // Assuming getMarsDeviceModel returns an array directly
      if (Array.isArray(getMarsDeviceModel.value)) {
        getMarsDeviceModel.value.forEach(item => {
          if (item && item.code && item.name) {
            dropDown.value.marsDeviceOptions.push({
              label: item.name,
              value: item.code
            });
          }
        });
      }
      // Handle if it's an array of arrays (based on original code)
      else if (_.isArray(getMarsDeviceModel.value) && getMarsDeviceModel.value.length > 0) {
        getMarsDeviceModel.value.forEach(itemArray => {
          if (Array.isArray(itemArray)) {
            itemArray.forEach(oo => {
              if (oo && oo.code && oo.name) {
                dropDown.value.marsDeviceOptions.push({
                  label: oo.name,
                  value: oo.code
                });
              }
            });
          }
        });
      }
    }
  } catch (error) {

    console.error('Error loading Mars device models:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load Mars device models',
      icon: 'error'
    });
  }
}

async function ajaxLoadDataForDeviceTypeTable() {
  try {
    // Fetch devices data
    await fetchDevicesData();
    
    if (getAllDevicesInfo.value) {
      getAllDevicesInfo.value.forEach(item => {
        if (item && item.id && item.deviceName) {
          dropDown.value.deviceOptions.push({
            value: item.id,
            label: item.deviceName
          });
        }
      });
    }

    // Fetch lead sources
    await loadLeadSourceActiveList();
    
    if (getActiveLeadSource.value) {
      getActiveLeadSource.value.forEach(item => {
        if (item && item.id && item.sourceName) {
          dropDown.value.leadSourceOptions.push({
            value: item.id,
            label: item.sourceName
          });
        }
      });
    }

    // Fetch merchant categories
    await loadMerchantCategoryActiveList();
    
    if (getActiveMerchantCategory.value) {
      getActiveMerchantCategory.value.forEach(item => {
        if (item && item.id && item.merchantCategoryName) {
          dropDown.value.merchantTypesOptions.push({
            value: item.id,
            label: item.merchantCategoryName
          });
        }
      });
    }
  } catch (error) {

    console.error('Error loading dropdown data:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load dropdown options',
      icon: 'error'
    });
  }
}

async function fnsubmit() {
  const request = formData.value;
  
  if (!request.leadSource || !request.device || !request.merchantType) {
    $q.notify({
      color: 'warning',
      message: 'Please fill all required fields',
      icon: 'warning'
    });
    return;
  }

  const requestParams = {
    url: {
      leadSource: request.leadSource,
      device: request.device,
      merchantType: request.merchantType
    },
    params: {
      debitLessthanAmount: request.debitLessthanAmount,
      debitGreaterthanAmount: request.debitGreaterthanAmount,
      stdCC: request.stdCC,
      premiumCC: request.premiumCC,
      corpCC: request.corpCC,
      intlCC: request.intlCC,
      superPremiumlCC: request.superPremiumlCC
    }
  };

  try {
    const response = await submitMdrPlan(requestParams);
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: response.data?.message || 'MDR plan submitted successfully',
      icon: 'thumb_up'
    });
    
    // Reset form
    Object.keys(formData.value).forEach(key => {
      if (key !== 'marsDevice') { // Keep marsDevice if needed
        formData.value[key] = '';
      }
    });
  } catch (error) {

    console.error('Error submitting MDR plan:', error);
    
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.response?.data?.message || 'Failed to submit MDR plan',
      icon: 'error'
    });
  }
}

// Uncomment and adjust if needed
// async function fnEditMdrPlan() {
//   const request = formData.value;
//   const requestParams = {
//     id: categoryBasedMdr.value?.id,
//     debitLessthanAmount: request.debitLessthanAmount,
//     debitGreaterthanAmount: request.debitGreaterthanAmount,
//     stdCC: request.stdCC,
//     premiumCC: request.premiumCC,
//     corpCC: request.corpCC,
//     intlCC: request.intlCC,
//     superPremiumlCC: request.superPremiumlCC
//   };

//   try {
//     const response = await editMdrPlan(requestParams);
//     $q.notify({
//       color: 'positive',
//       position: 'bottom',
//       message: response.data?.message || 'MDR plan updated successfully',
//       icon: 'thumb_up'
//     });
//   } catch (error) {

//     console.error('Error editing MDR plan:', error);
//     $q.notify({
//       color: 'negative',
//       position: 'bottom',
//       message: error.response?.data?.message || 'Failed to update MDR plan',
//       icon: 'error'
//     });
//   }
// }

async function fnCategoryBasedMdr() {
  const request = formData.value;
  
  if (!request.leadSource || !request.device || !request.merchantType) {
    return;
  }

  const formDataForRequest = {
    leadSource: request.leadSource,
    device: request.device,
    merchantType: request.merchantType
  };

  try {
    const response = await loadCategoryBasedMdrPlan(formDataForRequest);
    
    if (response.status === 200 && categoryBasedMdr.value) {
      formData.value.debitLessthanAmount = categoryBasedMdr.value.debitLessthanAmount || '';
      formData.value.debitGreaterthanAmount = categoryBasedMdr.value.debitGreaterthanAmount || '';
      formData.value.stdCC = categoryBasedMdr.value.stdCC || '';
      formData.value.premiumCC = categoryBasedMdr.value.premiumCC || '';
      formData.value.corpCC = categoryBasedMdr.value.corpCC || '';
      formData.value.intlCC = categoryBasedMdr.value.intlCC || '';
      formData.value.superPremiumlCC = categoryBasedMdr.value.superPremiumlCC || '';
    } else {
      // Clear fields if no data found
      formData.value.debitLessthanAmount = '';
      formData.value.debitGreaterthanAmount = '';
      formData.value.stdCC = '';
      formData.value.premiumCC = '';
      formData.value.corpCC = '';
      formData.value.intlCC = '';
      formData.value.superPremiumlCC = '';
    }
  } catch (error) {

    console.error('Error loading category based MDR:', error);
    
    // Clear fields on error
    formData.value.debitLessthanAmount = '';
    formData.value.debitGreaterthanAmount = '';
    formData.value.stdCC = '';
    formData.value.premiumCC = '';
    formData.value.corpCC = '';
    formData.value.intlCC = '';
    formData.value.superPremiumlCC = '';
  }
}

/* START >> Manage lead source, device, merchant type */
function fnManageLeadSource() {
  showLeadSourceModal.value = !showLeadSourceModal.value;
}

function fnManageDevice() {
  showDeviceDetailModal.value = !showDeviceDetailModal.value;
}

function fnManageMerchantType() {
  showMerchantModal.value = !showMerchantModal.value;
}
/* END >> Manage lead source, device, merchant type */
</script>

<style scoped>
/* Add any custom styles here */
.q-card {
  min-height: 100%;
}

.q-item {
  padding-left: 0;
  padding-right: 0;
}
</style>