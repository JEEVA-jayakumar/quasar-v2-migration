<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-h5 q-mb-md text-weight-regular">Existing Rental charge</div>
      </div>
      
      <!-- START >> Setup rental details -->
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
                    placeholder="Lead source"
                    filled
                    map-options
                    emit-value
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
                    placeholder="Device"
                    filled
                    map-options
                    emit-value
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

              <!-- Plan -->
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.plan"
                    :options="dropDown.planOptions"
                    label="Select plan"
                    placeholder="Plan"
                    filled
                    map-options
                    emit-value
                    @update:model-value="fnCategoryBasedRental"
                  />
                </q-item-section>
              </q-item>

              <!-- Setup Fee -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.setupFees"
                    label="Enter Setup fee"
                    placeholder="Setup fee"
                    filled
                  />
                </q-item-section>
              </q-item>

              <!-- Monthly Fee -->
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.monthlyFees"
                    label="Enter recurring fee"
                    placeholder="Recurring fee"
                    filled
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          
          <q-card-actions vertical align="right">
            <q-btn 
              label="Submit" 
              @click="fnEditRentalPlan" 
              color="purple-9" 
              class="q-mt-md"
            />
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup fee and recurring fee -->

      <!-- START >> Table >> rental charge details -->
      <!-- Table component can be added here as needed -->

      <!-- START: Modal Components -->
      <showLeadSourceModalComponent
        v-model="showLeadSourceModal"
        @update:model-value="fnManageLeadSource"
      />
      
      <showDeviceDetailModalComponent
        v-model="showDeviceDetailModal"
        @update:model-value="fnManageDevice"
      />
      
      <showPlanModalComponent
        v-model="showPlanDetailModal"
        @update:model-value="fnManagePlan"
      />
      <!-- END: Modal Components -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import _ from 'lodash';

/* START >> Modal components Lead source, device, plan */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showPlanModalComponent from "../../components/super_admin/showPlanModalComponent.vue";
/* END >> Modal components Lead source, device, plan */

const $q = useQuasar();
const store = useStore();

/* START >> Modal refs */
const showLeadSourceModal = ref(false);
const showDeviceDetailModal = ref(false);
const showPlanDetailModal = ref(false);
/* END >> Modal refs */

/* START >> Form data */
const formData = ref({
  leadSource: null,
  device: null,
  marsDevice: null,
  plan: null,
  setupFees: '',
  monthlyFees: ''
});

const dropDown = ref({
  deviceOptions: [],
  leadSourceOptions: [],
  marsDeviceOptions: [],
  planOptions: []
});
/* END >> Form data */

// Vuex Getters
const getAllDevicesInfo = computed(() => store.getters['SA_Devices/getAllDevicesInfo']);
const getMarsDeviceModel = computed(() => store.getters['SA_Devices/getMarsDeviceModel']);
const getActiveLeadSource = computed(() => store.getters['leadSource/getActiveLeadSource']);
const getActivePlan = computed(() => store.getters['plan/getActivePlan']);
const categoryBasedRental = computed(() => store.getters['categoryBasedRental/categoryBasedRental']);

// Vuex Actions
const fetchDevicesData = () => store.dispatch('SA_Devices/FETCH_DEVICES_DATA');
const fetchMarsDeviceModel = () => store.dispatch('SA_Devices/FETCH_MARS_DEVICE_MODEL');
const loadLeadSourceActiveList = () => store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST');
const loadPlanActiveList = () => store.dispatch('plan/PLAN_ACTIVE_LIST');
const loadCategoryBasedRentalPlan = (params) => store.dispatch('categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN', params);
const editRentalPlan = (params) => store.dispatch('categoryBasedRental/EDIT_RENTAL_PLAN', params);

onMounted(() => {
  ajaxLoadDataForDeviceTypeTable();
  marsDeviceModelDatasLoading();
});

async function marsDeviceModelDatasLoading() {
  try {
    await fetchMarsDeviceModel();
    
    if (getMarsDeviceModel.value) {
      // Handle different response structures
      if (Array.isArray(getMarsDeviceModel.value)) {
        // Direct array
        getMarsDeviceModel.value.forEach(item => {
          if (item && item.code && item.name) {
            dropDown.value.marsDeviceOptions.push({
              label: item.name,
              value: item.code
            });
          }
        });
      } else if (_.isObject(getMarsDeviceModel.value)) {
        // Check if it's an array of arrays (from original code pattern)
        Object.values(getMarsDeviceModel.value).forEach(itemArray => {
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

    // Fetch plans
    await loadPlanActiveList();
    
    if (getActivePlan.value) {
      getActivePlan.value.forEach(item => {
        if (item && item.id && item.planName) {
          dropDown.value.planOptions.push({
            value: item.id,
            label: item.planName
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

async function fnCategoryBasedRental() {
  const request = formData.value;
  
  if (!request.leadSource || !request.device || !request.plan) {
    return;
  }

  const requestData = {
    leadSource: request.leadSource,
    device: request.device,
    plan: request.plan
  };

  try {
    const response = await loadCategoryBasedRentalPlan(requestData);
    
    if (response && response.status === 200) {
      if (categoryBasedRental.value) {
        formData.value.setupFees = categoryBasedRental.value.setupFees || '0';
        formData.value.monthlyFees = categoryBasedRental.value.monthlyFees || '0';
      } else {
        // If response is 200 but no data, set to 0
        formData.value.setupFees = '0';
        formData.value.monthlyFees = '0';
      }
    } else if (response && response.data === null) {
      // Handle null response data
      formData.value.setupFees = '0';
      formData.value.monthlyFees = '0';
    } else {
      throw new Error('Invalid MDR Plan Code');
    }
  } catch (error) {

    console.error('Error loading category based rental:', error);
    
    $q.notify({
      color: 'negative',
      position: 'bottom-left',
      message: error.message || 'Failed to load rental plan',
      icon: 'clear'
    });
    
    formData.value.setupFees = '';
    formData.value.monthlyFees = '';
  }
}

async function fnEditRentalPlan() {
  const request = formData.value;
  
  // Validate required fields
  if (!request.leadSource || !request.device || !request.plan) {
    $q.notify({
      color: 'warning',
      message: 'Please select lead source, device, and plan',
      icon: 'warning'
    });
    return;
  }

  const requestParams = {
    id: categoryBasedRental.value?.id,
    setupFees: request.setupFees || '0',
    monthlyFees: request.monthlyFees || '0'
  };

  try {
    const response = await editRentalPlan(requestParams);
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: response.data?.message || 'Rental plan updated successfully',
      icon: 'thumb_up'
    });
    
    // Reset form after successful update
    resetForm();
  } catch (error) {

    console.error('Error editing rental plan:', error);
    
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.response?.data?.message || 'Failed to update rental plan',
      icon: 'error'
    });
  }
}



function resetForm() {
  Object.keys(formData.value).forEach(key => {
    if (key !== 'marsDevice') { // Keep marsDevice if needed
      formData.value[key] = '';
    }
  });
}

/* START >> Manage lead source, device, merchant type */
function fnManageLeadSource() {
  showLeadSourceModal.value = !showLeadSourceModal.value;
}

async function fnManageDevice(token) {
  showDeviceDetailModal.value = !showDeviceDetailModal.value;
  
  if (token === "refresh") {
    try {
      await fetchDevicesData();
      // Optionally refresh the dropdown
      dropDown.value.deviceOptions = [];
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
    } catch (error) {

      console.error('Error refreshing devices:', error);
    }
  }
}

async function fnManagePlan(token) {
  showPlanDetailModal.value = !showPlanDetailModal.value;
  
  if (token === "refresh") {
    try {
      await loadPlanActiveList();
      // Optionally refresh the dropdown
      dropDown.value.planOptions = [];
      if (getActivePlan.value) {
        getActivePlan.value.forEach(item => {
          if (item && item.id && item.planName) {
            dropDown.value.planOptions.push({
              value: item.id,
              label: item.planName
            });
          }
        });
      }
    } catch (error) {

      console.error('Error refreshing plans:', error);
    }
  }
}
/* END >> Manage lead source, device, merchant type */
</script>

<style scoped>
.q-card {
  min-height: 100%;
}

.q-item {
  padding-left: 0;
  padding-right: 0;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>