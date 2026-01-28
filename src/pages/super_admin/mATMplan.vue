<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Add M-ATM plan</div>
      
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-select
                  color="grey-9"
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select lead source"
                  placeholder="Lead source"
                  outlined
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-select
                  color="grey-9"
                  v-model="formData.device"
                  :options="dropDown.deviceOptions"
                  label="Select device"
                  placeholder="Device"
                  outlined
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-input
                  color="grey-9"
                  type="text"
                  v-model.trim="formData.planName"
                  placeholder="Enter Your Plan"
                  label="Enter Your Plan"
                  outlined
                />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-input
                  color="grey-9"
                  type="number"
                  v-model.trim="formData.incentivePercentage"
                  placeholder="%"
                  label="Incentive Percentage *"
                  outlined
                />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-input
                  color="grey-9"
                  type="number"
                  v-model.trim="formData.minTxnVal"
                  placeholder="Minimum Transaction Value*"
                  label="Minimum Transaction Value*"
                  outlined
                />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-input
                  color="grey-9"
                  type="number"
                  v-model.trim="formData.maxIncPerTxn"
                  placeholder="Maximum Incentive Per Transaction *"
                  label="Maximum Incentive Per Transaction *"
                  outlined
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          
          <q-card-actions vertical align="right">
            <q-btn label="Submit" @click="fnsubmit(formData)" color="purple-9" />
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup MDR details -->

      <!-- Modal Components -->
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      />
      
      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      />
      
      <showPlanModalComponent
        v-if="showPlanDetailModal"
        :propToggleModal="showPlanDetailModal"
        @emitToggleModal="fnManagePlan"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import _ from 'lodash';

/* START >> Modal components */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showPlanModalComponent from "../../components/super_admin/showPlanModalComponent.vue";
/* END >> Modal components */

const store = useStore();
const $q = useQuasar();

// Reactive state
const showLeadSourceModal = ref(false);
const showDeviceDetailModal = ref(false);
const showPlanDetailModal = ref(false);
const activeLeadSourceList = ref([]);
const activeDeviceList = ref([]);
const filterSearch = ref("");
const paginationControl = ref({
  rowsPerPage: 5
});

// Form data
const formData = ref({
  leadSource: "",
  device: "",
  planName: "",
  incentivePercentage: "",
  minTxnVal: "", 
  maxIncPerTxn: "",
});

// Dropdown options
const dropDown = ref({
  deviceOptions: [],
  leadSourceOptions: [],
});

const selectOptions = ref([
  {
    label: "Option 01",
    value: 1
  },
  {
    label: "Option 02",
    value: 2
  }
]);

// Computed properties for Vuex getters
const getAllDevicesInfo = computed(() => store.getters["SA_Devices/getAllDevicesInfo"]);
const getActiveLeadSource = computed(() => store.getters["leadSource/getActiveLeadSource"]);
const getActiveMerchantTypes = computed(() => store.getters["merchantTypes/getActiveMerchantTypes"]);
const getActivePlan = computed(() => store.getters["plan/getActivePlan"]);
const categoryBasedRental = computed(() => store.getters["categoryBasedRental/categoryBasedRental"]);

// Vuex actions
const FETCH_DEVICES_DATA = () => store.dispatch("SA_Devices/FETCH_DEVICES_DATA");
const LEAD_SOURCE_ACTIVE_LIST = () => store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
const PLAN_ACTIVE_LIST = () => store.dispatch("plan/PLAN_ACTIVE_LIST");
const MATM_SUBMIT_PLAN_DETAILS = (params) => store.dispatch("mATMSubmitPlan/MATM_SUBMIT_PLAN_DETAILS", params);
const CATEGORY_BASED_RENTAL_PLAN = (params) => store.dispatch("categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN", params);
const EDIT_RENTAL_PLAN = (params) => store.dispatch("categoryBasedRental/EDIT_RENTAL_PLAN", params);

onMounted(() => {
  // Load initial data
  ajaxLoadDataForDeviceTypeTable();
});

// Methods
const ajaxLoadDataForDeviceTypeTable = async () => {
  try {
    await FETCH_DEVICES_DATA();
    
    // Map device options
    dropDown.value.deviceOptions = getAllDevicesInfo.value.map(item => ({
      value: item.id,
      label: item.deviceName
    }));
    
    await LEAD_SOURCE_ACTIVE_LIST();
    
    // Map lead source options
    dropDown.value.leadSourceOptions = getActiveLeadSource.value.map(item => ({
      value: item.id,
      label: item.sourceName
    }));
    
  } catch (error) {
    console.error("Error loading device type data:", error);
    $q.notify({
      color: "negative",
      position: "bottom-left",
      message: "Failed to load device data",
      icon: "error"
    });
  }
};

const fnsubmit = async (request) => {
  const requestParams = {
    url: {
      leadSource: request.leadSource,
      device: request.device,
    },
    params: {
      planName: request.planName,
      incentivePercentage: request.incentivePercentage,
      minTxnVal: request.minTxnVal, 
      maxIncPerTxn: request.maxIncPerTxn,
    }
  };
  
  try {
    const response = await MATM_SUBMIT_PLAN_DETAILS(requestParams);
    
    $q.notify({
      color: "positive",
      position: "bottom",
      icon: "thumb_up",
      message: response.data.message || "Plan submitted successfully"
    });
    
    // Reset form
    formData.value = {
      leadSource: "",
      device: "",
      planName: "",
      incentivePercentage: "",
      minTxnVal: "", 
      maxIncPerTxn: "",
    };
    
  } catch (error) {
    console.error("Submit error:", error);
    
    $q.notify({
      color: "negative",
      position: "bottom",
      icon: "error",
      message: error.data?.message || "Failed to submit plan"
    });
  }
};

// Modal management methods
const fnManageLeadSource = () => {
  showLeadSourceModal.value = !showLeadSourceModal.value;
};

const fnManageDevice = (token) => {
  showDeviceDetailModal.value = !showDeviceDetailModal.value;
  if (token === "refresh") {
    activeDevice();
  }
};

const fnManagePlan = (token) => {
  showPlanDetailModal.value = !showPlanDetailModal.value;
  if (token === "refresh") {
    activePincode();
  }
};

const activeDevice = async () => {
  try {
    await FETCH_DEVICES_DATA();
    activeDeviceList.value = getAllDevicesInfo.value;
  } catch (error) {
    console.error("Error loading active devices:", error);
  }
};

const activePincode = async () => {
  try {
    await PLAN_ACTIVE_LIST();
    activeLeadSourceList.value = getActivePlan.value;
  } catch (error) {
    console.error("Error loading active plans:", error);
  }
};

// Custom search filter method
const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : "";
  return rows.filter(row =>
    cols.some(
      col =>
        (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
    )
  );
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 2px solid #e0e0e0;
}
</style>