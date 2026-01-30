<template>
  <q-page>
    <!-- content -->
    <div class="backgroundimage">
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!--START: table title -->
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
          Aggregator Allocation Type / So
        </div>

        <div class="col-md-5" align="row">
          <div class="group">
            <q-radio 
              v-for="(item, index) in flagOptions" 
              :key="index" 
              color="grey-9" 
              v-model="flag"
              :val="item.value" 
              :label="item.label" 
            />
            <div 
              v-if="!flag" 
              class="text-negative q-py-xs group q-caption" 
              align="right" 
              width="25px"
            >
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required Field
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <!--START: table title -->
        <div v-if="flag === '0' || flag === '1'" class="col-md-4">
          <q-select 
            v-model="formData.allocate_region" 
            label="Select Region" 
            color="grey-9"
            :options="regionOptions" 
            @update:model-value="regionBasedSoLoad"
            emit-value
            map-options
          />
        </div>
        <div v-if="flag === '1'" class="col-md-3">
          <q-select 
            v-model="formData.allocate_so" 
            label="Select SO" 
            color="grey-9"
            :options="regionBasedSo" 
            clearable
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-select>
        </div>
        <div v-if="flag === '2'" class="col-md-3">
          <q-select 
            v-model="formData.allocate_reseller" 
            label="Select Reseller" 
            color="grey-9"
            :options="resellarOptions" 
            emit-value
            map-options
          />
        </div>
        <div class="col-md-7">
          <p class="caption">Spare Parts Type*</p>
          <div class="row q-gutter-md">
            <div class="row items-center" v-for="menu in sparePartsTypes" :key="menu.value.id">
              <q-checkbox 
                :model-value="isSparePartSelected(menu.value.id)"
                @update:model-value="toggleSparePart($event, menu.value)"
                :label="menu.value.spare_parts_types"
                color="primary"
              />
              <div 
                v-if="isSparePartSelected(menu.value.id)" 
                class="q-ml-md"
              >
                <q-input 
                  :model-value="getSparePartCount(menu.value.id)"
                  @update:model-value="updateSparePartCount($event, menu.value)"
                  type="number" 
                  min="1" 
                  max="5000"
                  dense
                  style="width: 100px;"
                  outlined
                  label="Count"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-7">
          <q-input 
            v-model="formData.pod_number" 
            label="Pod Number" 
            color="grey-9" 
            readonly
            outlined
          />
        </div>

        <div class="col-md-7">
          <q-input 
            v-model="formData.total_count" 
            label="Total Count" 
            color="grey-9" 
            readonly
            outlined
          />
        </div>

        <div class="full-width group q-mt-lg" align="center">
          <q-btn 
            :disable="formData.total_count == 0 || !flag"
            size="md" 
            type="button" 
            color="purple-9" 
            @click="fnSubmitBankDetails"
            :loading="submitting"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $q = useQuasar();
const router = useRouter();
const store = useStore();

// Reactive state
const flag = ref('');
const submitting = ref(false);
const regionOptions = ref([]);
const regionBasedSo = ref([]);
const resellarOptions = ref([]);
const sparePartsTypes = ref([]);

const formData = reactive({
  allocate_region: '',
  allocate_reseller: '',
  total_count: 0,
  allocate_so: '',
  pod_number: '',
  sparePartsSets: []
});

// Flag options
const flagOptions = [
  { label: "Region", value: "0" },
  { label: "SO", value: "1" },
  { label: "Reseller", value: "2" }
];

// Computed properties
const getRegionBasedResellar = computed(() => 
  store.getters["InventoryCentral/getRegionBasedResellar"] || []
);

const getRegionBasedSO = computed(() => 
  store.getters["InventoryCentral/getRegionBasedSO"] || []
);

const getAllRegionsData = computed(() => 
  store.getters["InventoryCentral/getAllRegionsData"] || []
);

const getsparePartsGetTypes = computed(() => 
  store.getters["sparePartsGetTypes/getsparePartsGetTypes"] || []
);

// Helper functions
const isSparePartSelected = (sparePartId) => {
  return formData.sparePartsSets.some(item => item.spareParts.id === sparePartId && item.count > 0);
};

const getSparePartCount = (sparePartId) => {
  const sparePart = formData.sparePartsSets.find(item => item.spareParts.id === sparePartId);
  return sparePart ? sparePart.count : 0;
};

const toggleSparePart = (selected, menu) => {
  if (selected) {
    // Add spare part with default count of 0 (user will input count)
    const existingIndex = formData.sparePartsSets.findIndex(
      item => item.spareParts.id === menu.id
    );
    
    if (existingIndex === -1) {
      formData.sparePartsSets.push({
        count: 0,
        spareParts: {
          id: menu.id
        }
      });
    }
  } else {
    // Remove spare part
    const index = formData.sparePartsSets.findIndex(
      item => item.spareParts.id === menu.id
    );
    
    if (index !== -1) {
      formData.sparePartsSets.splice(index, 1);
      updateTotalCount();
    }
  }
};

const updateSparePartCount = (count, menu) => {
  const index = formData.sparePartsSets.findIndex(
    item => item.spareParts.id === menu.id
  );
  
  if (index !== -1) {
    const parsedCount = parseInt(count) || 0;
    formData.sparePartsSets[index].count = parsedCount;
    updateTotalCount();
  }
};

const updateTotalCount = () => {
  formData.total_count = formData.sparePartsSets.reduce(
    (total, item) => total + (item.count || 0), 
    0
  );
};

const generatePodNumber = () => {
  const name = "SPAPOD";
  const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const d = new Date();
  const monthName = month[d.getMonth()];
  const timestamp = new Date().getTime();
  
  return `${name}${monthName}${timestamp}`;
};

// Methods
const fnSparePartsTypes = async () => {
  try {
    await store.dispatch("sparePartsGetTypes/FETCH_SPARE_PARTS_GET_TYPES");
    
    const parts = getsparePartsGetTypes.value.map(item => ({
      value: item,
      label: item.spare_parts_types
    }));
    
    sparePartsTypes.value = parts;
  } catch (error) {

    console.error("Error fetching spare parts types:", error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load spare parts types'
    });
  }
};

const fnAjaxGetAllRegionsData = async () => {
  try {
    await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
    
    const regions = getAllRegionsData.value.map(item => ({
      label: item.regionAreaName,
      value: JSON.stringify(item)
    }));
    
    regionOptions.value = regions;
  } catch (error) {

    console.error("Error fetching regions:", error);
    regionOptions.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load regions'
    });
  }
};

const regionBasedSoLoad = async (value) => {
  if (!value) {
    regionBasedSo.value = [];
    return;
  }
  
  try {
    const regionArea = JSON.parse(value);
    await store.dispatch("InventoryCentral/FETCH_REGION_BASED_SO", regionArea.id);
    
    const soList = getRegionBasedSO.value.map(item => ({
      label: `${item.name} | ${item.employeeID} | ${item.email}`,
      value: JSON.stringify(item)
    }));
    
    regionBasedSo.value = soList;
  } catch (error) {

    console.error("Error loading region-based SO:", error);
    regionBasedSo.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load SO list'
    });
  }
};

const fnAjaxGetAllDevicesTypesData = async () => {
  try {
    await store.dispatch("InventoryCentral/FETCH_REGION_BASED_RESELLAR");
    
    const resellers = getRegionBasedResellar.value.map(item => ({
      label: item.user?.name || 'Unknown',
      value: JSON.stringify(item)
    }));
    
    resellarOptions.value = resellers;
  } catch (error) {

    console.error("Error fetching resellers:", error);
    resellarOptions.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load resellers'
    });
  }
};

const fnSubmitBankDetails = async () => {
  // Validate flag is selected
  if (!flag.value) {
    $q.notify({
      color: "negative",
      message: "Please select an allocation type",
      icon: "warning"
    });
    return;
  }

  // Validate total count
  if (formData.total_count === 0) {
    $q.notify({
      color: "negative",
      message: "Please add at least one spare part with count",
      icon: "warning"
    });
    return;
  }

  // Validate allocation target based on flag
  if (flag.value === '0' && !formData.allocate_region) {
    $q.notify({
      color: "negative",
      message: "Please select a region",
      icon: "warning"
    });
    return;
  }

  if (flag.value === '1' && (!formData.allocate_region || !formData.allocate_so)) {
    $q.notify({
      color: "negative",
      message: "Please select both region and SO",
      icon: "warning"
    });
    return;
  }

  if (flag.value === '2' && !formData.allocate_reseller) {
    $q.notify({
      color: "negative",
      message: "Please select a reseller",
      icon: "warning"
    });
    return;
  }

  // Prepare request data
  const requestData = {
    ...formData,
    allocate_so: formData.allocate_so ? JSON.parse(formData.allocate_so) : null,
    allocate_region: formData.allocate_region ? JSON.parse(formData.allocate_region) : null,
    allocate_reseller: formData.allocate_reseller ? JSON.parse(formData.allocate_reseller) : null,
    sparePartsSets: formData.sparePartsSets.filter(item => item.count > 0)
  };

  console.log("Submitting data:", requestData);

  submitting.value = true;
  $q.loading.show({
    message: 'Submitting...',
    spinnerColor: 'purple-9'
  });

  try {
    await store.dispatch("sparePartsInventory/CREATE_PHONEPE_SPARE_POD_LIST_INVENTORY", requestData);
    
    $q.notify({
      color: "positive",
      message: "Successfully submitted!",
      icon: "thumb_up"
    });
    
    // Reset form
    resetForm();
    
    // Refresh the page
    router.go();
    
  } catch (error) {

    console.error("Error submitting form:", error);
    
    $q.notify({
      color: "negative",
      message: error?.body?.message || "Please try again later!",
      icon: "thumb_down"
    });
  } finally {
    submitting.value = false;
    $q.loading.hide();
  }
};

const resetForm = () => {
  flag.value = '';
  formData.allocate_region = '';
  formData.allocate_reseller = '';
  formData.total_count = 0;
  formData.allocate_so = '';
  formData.sparePartsSets = [];
  // Generate new POD number
  formData.pod_number = generatePodNumber();
};

// Lifecycle hooks
onMounted(() => {
  // Generate initial POD number
  formData.pod_number = generatePodNumber();
  
  // Load initial data
  fnAjaxGetAllRegionsData();
  fnSparePartsTypes();
  fnAjaxGetAllDevicesTypesData();
});

onUnmounted(() => {
  // Clean up if needed
});

// Watch for flag changes to reset dependent fields
watch(flag, (newFlag) => {
  if (newFlag !== '0' && newFlag !== '1') {
    formData.allocate_region = '';
    regionBasedSo.value = [];
  }
  
  if (newFlag !== '1') {
    formData.allocate_so = '';
  }
  
  if (newFlag !== '2') {
    formData.allocate_reseller = '';
  }
});

// Watch for region selection to reset SO
watch(() => formData.allocate_region, (newRegion) => {
  if (!newRegion) {
    formData.allocate_so = '';
  }
});
</script>

<style scoped>
.backgroundimage {
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-title {
  font-size: 1.5rem;
  line-height: 2rem;
}

.group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.caption {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #424242;
}

.q-radio {
  margin-right: 16px;
}

.q-checkbox {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .col-md-4, .col-md-3, .col-md-7 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 16px;
  }
  
  .row.items-center {
    flex-wrap: wrap;
  }
  
  .group {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .q-radio {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>