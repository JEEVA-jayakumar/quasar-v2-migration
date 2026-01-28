<template>
  <div>
    <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Update SpareParts Pod List
    </div>

    <form @submit.prevent="fnSubmitBankDetails">
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-3">
          <q-select 
            color="grey-9" 
            v-model="formData.allocate_region" 
            :options="regionOptions"
            label="Select Region" 
            @update:model-value="regionBasedSoLoad"
            emit-value
            map-options
            outlined
          />
        </div>
        
        <div class="col-md-3">
          <q-select 
            v-model="formData.allocate_so" 
            label="Select SO" 
            color="grey-9"
            :options="regionBasedSo" 
            :disable="propRowDetails.allocate_so == null"
            clearable
            emit-value
            map-options
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-select>
        </div>
        
        <div class="col-md-12 q-mt-md">
          <div class="row">
            <div class="col-12">
              <p class="caption text-weight-medium q-mb-sm">Spare Parts</p>
              <div class="row q-gutter-md">
                <div v-for="menu in sparePartsTypes" :key="menu.spareParts.id" class="col-md-4">
                  <q-card flat bordered class="q-pa-sm">
                    <div class="row items-center">
                      <div class="col">
                        <label class="text-body1 text-weight-medium">
                          {{ menu.spareParts.spare_parts_types }}
                        </label>
                      </div>
                      <div class="col-auto">
                        <q-input 
                          :model-value="menu.count"
                          @update:model-value="updateSpareCount($event, menu)"
                          type="number" 
                          min="0" 
                          max="5000"
                          dense
                          outlined
                          style="width: 120px;"
                          class="q-ml-sm"
                        >
                          <template v-slot:prepend>
                            <q-icon name="inventory" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 q-mt-md">
          <q-input 
            v-model="formData.pod_number" 
            label="Pod Number" 
            color="grey-9" 
            readonly
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="receipt" />
            </template>
          </q-input>
        </div>
        
        <div class="col-md-3 q-mt-md">
          <q-input 
            v-model="formData.total_count" 
            label="Total Count" 
            color="grey-9" 
            readonly
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="summarize" />
            </template>
          </q-input>
        </div>
      </div>
      
      <div class="full-width group q-mt-lg" align="center">
        <q-btn 
          size="md" 
          type="submit" 
          color="purple-9" 
          :loading="submitting"
        >
          Update
        </q-btn>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const store = useStore();

// Reactive state
const submitting = ref(false);
const regionOptions = ref([]);
const regionBasedSo = ref([]);
const sparePartsTypes = ref([]);
const allocate_region1 = ref('');
const propRowDetails = ref({});

const formData = reactive({
  allocate_region: '',
  allocate_so: '',
  allocate_reseller: null,
  pod_number: '',
  total_count: '',
  sparePartsSets: []
});

// Computed properties
const getAllRegionsData = computed(() => 
  store.getters["InventoryCentral/getAllRegionsData"] || []
);

const getRegionBasedSO = computed(() => 
  store.getters["InventoryCentral/getRegionBasedSO"] || []
);

const getPhonepeInventoryUpdatedPodDetails = computed(() => 
  store.getters["getInventoryUpdatedPodDetails/getPhonepeInventoryUpdatedPodDetails"] || {}
);

// Lifecycle hooks
onMounted(() => {
  initializeComponent();
});

// Methods
const initializeComponent = () => {
  propRowDetails.value = route.params.data || {};
  
  // Load existing data
  if (propRowDetails.value) {
    loadExistingData();
  }
  
  // Fetch regions
  ajaxLoadDataForDeviceTypeTable();
};

const loadExistingData = () => {
  console.log("Loading existing data:", propRowDetails.value);
  
  // Set form data from propRowDetails
  formData.allocate_region = propRowDetails.value.allocate_region 
    ? JSON.stringify(propRowDetails.value.allocate_region)
    : '';
    
  formData.allocate_so = propRowDetails.value.allocate_so 
    ? JSON.stringify(propRowDetails.value.allocate_so)
    : '';
    
  formData.pod_number = propRowDetails.value.pod_number || '';
  formData.total_count = propRowDetails.value.total_count || '';
  
  // Load spare parts
  const spareParts = getPhonepeInventoryUpdatedPodDetails.value.sparePartsSets || [];
  sparePartsTypes.value = [...spareParts];
  formData.sparePartsSets = [...spareParts];
  
  // Calculate initial total count
  updateTotalCount();
  
  // Load SO options based on region
  if (formData.allocate_region) {
    regionBasedSoLoad(formData.allocate_region);
  }
};

const ajaxLoadDataForDeviceTypeTable = async () => {
  try {
    await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
    
    const regions = getAllRegionsData.value.map(item => ({
      label: item.regionAreaName,
      value: JSON.stringify(item)
    }));
    
    regionOptions.value = regions;
  } catch (error) {

    console.error("Error loading regions:", error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load regions'
    });
  }
};

const regionBasedSoLoad = async (item) => {
  if (!item) {
    regionBasedSo.value = [];
    formData.allocate_so = '';
    return;
  }
  
  try {
    const data = JSON.parse(item);
    allocate_region1.value = data.id;
    
    await store.dispatch("InventoryCentral/FETCH_REGION_BASED_SO", data.id);
    
    const soList = getRegionBasedSO.value.map(item => ({
      label: item.name || 'Unknown',
      value: JSON.stringify(item)
    }));
    
    regionBasedSo.value = soList;
  } catch (error) {

    console.error("Error loading SO list:", error);
    regionBasedSo.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load SO list'
    });
  }
};

const updateSpareCount = (count, menu) => {
  const parsedCount = parseInt(count) || 0;
  
  // Update the spare parts array
  const index = sparePartsTypes.value.findIndex(
    item => item.spareParts.id === menu.spareParts.id
  );
  
  if (index !== -1) {
    sparePartsTypes.value[index].count = parsedCount;
    
    // Update formData.sparePartsSets
    const formIndex = formData.sparePartsSets.findIndex(
      item => item.spareParts.id === menu.spareParts.id
    );
    
    if (formIndex !== -1) {
      formData.sparePartsSets[formIndex].count = parsedCount;
    } else {
      formData.sparePartsSets.push({
        ...sparePartsTypes.value[index]
      });
    }
    
    updateTotalCount();
  }
};

const updateTotalCount = () => {
  const total = formData.sparePartsSets.reduce(
    (sum, item) => sum + (parseInt(item.count) || 0), 
    0
  );
  
  formData.total_count = total.toString();
};

const fnSubmitBankDetails = async () => {
  // Validate required fields
  if (!formData.allocate_region) {
    $q.notify({
      color: 'negative',
      message: 'Please select a region',
      icon: 'warning'
    });
    return;
  }

  if (propRowDetails.value.allocate_so !== null && !formData.allocate_so) {
    $q.notify({
      color: 'negative',
      message: 'Please select an SO',
      icon: 'warning'
    });
    return;
  }

  if (formData.total_count === '0' || formData.total_count === '') {
    $q.notify({
      color: 'negative',
      message: 'Please add at least one spare part',
      icon: 'warning'
    });
    return;
  }

  // Prepare request data
  const param = {
    allocate_region: JSON.parse(formData.allocate_region),
    allocate_so: formData.allocate_so ? JSON.parse(formData.allocate_so) : null,
    allocate_reseller: formData.allocate_reseller,
    pod_number: formData.pod_number,
    total_count: parseInt(formData.total_count) || 0,
    sparePartsSets: formData.sparePartsSets
      .filter(item => item.count > 0)
      .map(item => ({
        count: parseInt(item.count) || 0,
        spareParts: {
          id: item.spareParts.id,
          spare_parts_types: item.spareParts.spare_parts_types
        }
      }))
  };

  // Add additional properties from existing data
  const existingData = getPhonepeInventoryUpdatedPodDetails.value;
  param.created_by = existingData.created_by;
  param.status = existingData.status === '6' ? 2 : existingData.status;
  param.owner = existingData.owner;
  param.created_date = existingData.created_date;

  console.log("Submitting data:", param);

  submitting.value = true;
  $q.loading.show({
    message: 'Updating...',
    spinnerColor: 'purple-9'
  });

  try {
    await store.dispatch(
      "sparePodUpdateDetails/PHONEPE_SPARE_PARTS_POD_UPDATE_DETAILS", 
      param
    );
    
    $q.notify({
      color: "positive",
      message: "Successfully updated!",
      icon: "thumb_up"
    });
    
    // Navigate back to spare parts list
    router.push({ name: "AggregatorsspareParts" });
    
  } catch (error) {

    console.error("Error updating pod details:", error);
    
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
</script>

<style scoped>
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
  gap: 16px;
  align-items: center;
}

.caption {
  font-size: 1rem;
  font-weight: 500;
  color: #424242;
}

form {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-card {
  transition: all 0.2s ease;
}

.q-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .col-md-3, .col-md-4, .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 16px;
  }
  
  .row.q-gutter-md {
    margin: 0;
  }
  
  .col-md-4 {
    margin-bottom: 12px;
  }
  
  .q-card {
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .q-px-lg {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .q-py-md {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
</style>