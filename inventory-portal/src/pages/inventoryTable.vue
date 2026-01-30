<template>
  <q-page>
    <!-- content -->
    <div>
      <!--START: table title -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-12 q-title text-weight-regular text-grey-9">Bijlipay Inventory Table</div>
      </div>
      <!--END: table title -->
      
      <!-- Central Inventory Section -->
      <div class="row bottom-border q-ma-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9">Central Inventory</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.centralItems.length > 0" class="row">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders"
              v-for="(device, index) in inventoryData.centralItems"
              :key="index"
              :style="'border: 1px solid ' + (device.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (device.device?.colorCode || '#000')">{{ device.count || 0 }}</big>
              </div>
              <div>{{ device.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <div>
              <q-banner class="bg-primary text-white" icon="info">
                No data available to display
              </q-banner>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory with Regions Section -->
      <div class="row bottom-border q-ma-md q-py-md group">
        <div class="col-12 text-weight-regular text-grey-9">Inventory with regions</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.regionalItems.length > 0" class="row">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders cursor-pointer"
              @click="ajaxLoadDataForCentralInventoryByDeviceIdFilter(index, deviceInfo)"
              v-for="(deviceInfo, index) in inventoryData.regionalItems"
              :key="index"
              :style="'border: 1px solid ' + (deviceInfo.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (deviceInfo.device?.colorCode || '#000')">{{ deviceInfo.count || 0 }}</big>
              </div>
              <div>{{ deviceInfo.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <q-banner class="bg-primary text-white" icon="info">
              No data available to display
            </q-banner>
          </div>
        </div>
        
        <div v-if="inventoryData.regionalItems.length > 0" class="col-md-6 q-mt-md">
          <div>
            <q-table
              :rows="getAllRegionalInventorySerialNumbersByDevice"
              :columns="columnData"
              table-class="customTableClass shadow-0"
              :filter="filterSearch"
              v-model:pagination="paginationControl"
              row-key="id"
              :loading="tableAjaxLoading"
              color="primary"
            >
              <template #top>
                <div class="row full-width items-center q-gutter-md">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model="filterSearch"
                      placeholder="Search by serial no"
                      class="q-py-sm"
                      filled
                      dense
                    />
                  </div>
                  <div class="col-md-6 text-right">
                    <q-btn
                      outline
                      color="grey-9"
                      label="Download as Excel"
                      @click="downloadExcelReport"
                      icon="file_download"
                    />
                  </div>
                </div>
              </template>
              
              <template #body-cell-serialNumber="props">
                <q-td :props="props">
                  {{ props.row.serialNumber || 'N/A' }}
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
        
        <div class="col-md-12 q-mt-md">
          <q-select
            v-model="inventoryData.region"
            color="grey-9"
            @update:model-value="filterInventoryCountByRegion"
            :options="inventoryData.regionFilterOptions"
            label="Filter By Region Wise"
            filled
            dense
            clearable
            emit-value
            map-options
          />
        </div>
      </div>

      <!-- Inventory with SO Section -->
      <div class="row bottom-border q-ma-md q-py-md group">
        <div class="col-12 text-weight-regular text-grey-9">Inventory with SO</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.billPartnerInventory.length > 0" class="row">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders"
              v-for="(device, index) in inventoryData.billPartnerInventory"
              :key="index"
              :style="'border: 1px solid ' + (device.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (device.device?.colorCode || '#000')">{{ device.count || 0 }}</big>
              </div>
              <div>{{ device.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <q-banner class="bg-primary text-white" icon="info">
              No data available to display
            </q-banner>
          </div>
        </div>
        <div class="col-md-12 q-mt-md">
          <q-select
            clearable
            v-model="inventoryData.so"
            color="grey-9"
            :options="inventoryData.SOFilterOptions"
            label="Filter By SO Wise"
            @update:model-value="filterInventoryCountBySO"
            filled
            dense
            emit-value
            map-options
          />
        </div>
      </div>

      <!-- Inventory with Reseller Section -->
      <div class="row bottom-border q-mx-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9">Inventory with Reseller</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.resellarItems.length > 0" class="row group">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders"
              v-for="(device, index) in inventoryData.resellarItems"
              :key="index"
              :style="'border: 1px solid ' + (device.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (device.device?.colorCode || '#000')">{{ device.count || 0 }}</big>
              </div>
              <div>{{ device.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <q-banner class="bg-primary text-white" icon="info">
              No data available to display
            </q-banner>
          </div>
        </div>
      </div>

      <!-- Inventory with Merchant Section -->
      <div class="row bottom-border q-mx-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9">Inventory with Merchant</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.merchantItems.length > 0" class="row group">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders"
              v-for="(device, index) in inventoryData.merchantItems"
              :key="index"
              :style="'border: 1px solid ' + (device.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (device.device?.colorCode || '#000')">{{ device.count || 0 }}</big>
              </div>
              <div>{{ device.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <q-banner class="bg-primary text-white" icon="info">
              No data available to display
            </q-banner>
          </div>
        </div>
      </div>

      <!-- Faulty Inventory Section -->
      <div class="row bottom-border q-mx-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9">Faulty Inventory</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.faultyInventory.length > 0" class="row group">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders"
              v-for="(device, index) in inventoryData.faultyInventory"
              :key="index"
              :style="'border: 1px solid ' + (device.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (device.device?.colorCode || '#000')">{{ device.count || 0 }}</big>
              </div>
              <div>{{ device.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <q-banner class="bg-primary text-white" icon="info">
              No data available to display
            </q-banner>
          </div>
        </div>
      </div>

      <!-- Send to Repair Section -->
      <div class="row bottom-border q-mx-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9">Send to Repair</div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="inventoryData.sendtoRepair.length > 0" class="row group">
            <div
              class="col-md-2 col-sm-3 col-xs-3 q-ma-xs q-pa-md rounded-borders"
              v-for="(device, index) in inventoryData.sendtoRepair"
              :key="index"
              :style="'border: 1px solid ' + (device.device?.colorCode || '#ccc')"
              align="center"
            >
              <div>
                <big :style="'color:' + (device.device?.colorCode || '#000')">{{ device.count || 0 }}</big>
              </div>
              <div>{{ device.device?.deviceName || 'Unknown Device' }}</div>
            </div>
          </div>
          <div v-else class="row group">
            <q-banner class="bg-primary text-white" icon="info">
              No data available to display
            </q-banner>
          </div>
        </div>
      </div>

      <!-- Bulk Upload Modal -->
      <openAddBulkDeviceModelComp
        v-if="openBulkUploadModal"
        :propOpenBulkUploadModal="openBulkUploadModal"
        @closeModel="fnOpenBulkUploadModal"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';

// Constants
const $REGIONAL_INVENTORY_FILTER_ACTION_DEVICE = ref(1);

const $q = useQuasar();
const store = useStore();

// Refs
const openBulkUploadModal = ref(false);
const activeItemId = ref(0);
const tableAjaxLoading = ref(false);
const filterSearch = ref("");

// Inventory Data
const inventoryData = reactive({
  region: null,
  so: null,
  regionFilterOptions: [],
  SOFilterOptions: [],
  regionalItems: [],
  billPartnerInventory: [],
  centralItems: [],
  merchantItems: [],
  resellarItems: [],
  faultyInventory: [],
  sendtoRepair: []
});

// Pagination
const paginationControl = ref({
  rowsPerPage: 10,
  page: 1,
  sortBy: 'serialNumber',
  descending: false
});

// Table Columns
const columnData = [
  {
    name: "serialNumber",
    required: true,
    label: "Device Serial Number",
    align: "left",
    field: "serialNumber",
    sortable: true
  }
];

// Computed Properties
const getAllRegionalInventorySerialNumbersByDevice = computed(() => 
  store.getters['SAT_RegionalInventoryAllocation/getAllRegionalInventorySerialNumbersByDevice'] || []
);

const getCentralInventoryDashboardCount = computed(() => 
  store.getters['InventoryCentral/getCentralInventoryDashboardCount'] || {}
);


const getAllRegionsData = computed(() => 
  store.getters['SuperAdminUsers/getAllRegionsData'] || []
);

const getAllSOsData = computed(() => 
  store.getters['SuperAdminUsers/getAllSOsData'] || []
);

const getAllRegionalInventoryDeviceDetailsWithCount = computed(() => 
  store.getters['SAT_RegionalInventoryAllocation/getAllRegionalInventoryDeviceDetailsWithCount'] || {}
);

const getAllSoInventoryDeviceDetailsWithCount = computed(() => 
  store.getters['SAT_RegionalInventoryAllocation/getAllSoInventoryDeviceDetailsWithCount'] || {}
);

// Methods
const ajaxLoadDataForCentralInventoryByDeviceIdFilter = async (itemIndex, deviceInfo) => {
  if (!deviceInfo?.device?.id) {
    $q.notify({
      type: 'warning',
      message: 'Invalid device information'
    });
    return;
  }

  activeItemId.value = itemIndex;
  tableAjaxLoading.value = true;

  const requestParams = {
    region: inventoryData.region,
    action: $REGIONAL_INVENTORY_FILTER_ACTION_DEVICE.value,
    device: deviceInfo.device.id
  };

  try {
    await store.dispatch('SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE', requestParams);
  } catch (error) {

    console.error('Error loading device data:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load device details'
    });
  } finally {
    tableAjaxLoading.value = false;
  }
};

const getAllInventoryData = async () => {
  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: "purple-9",
    message: "Fetching data..."
  });

  try {
    await store.dispatch('InventoryCentral/FETCH_CENTRAL_INVENTORY_DASHBOARD_COUNT');
    
    const dashboardData = getCentralInventoryDashboardCount.value;
    
    // Update inventory data with proper null checks
    inventoryData.centralItems = dashboardData.centralInventory || [];
    inventoryData.merchantItems = dashboardData.merchantInventory || [];
    inventoryData.regionalItems = dashboardData.regionalInventory || [];
    inventoryData.billPartnerInventory = dashboardData.billPartnerInventory || [];
    inventoryData.resellarItems = dashboardData.resellerInventory || [];
    inventoryData.faultyInventory = dashboardData.faultyInventory || [];
    inventoryData.sendtoRepair = dashboardData.faultySentToRepair || [];

    // Fetch regions
    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA');
    
    // Map regions to options format
    inventoryData.regionFilterOptions = getAllRegionsData.value.map(region => ({
      label: region.regionAreaName,
      value: region.id
    }));

  } catch (error) {

    console.error('Error fetching inventory data:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load inventory data'
    });
  } finally {
    $q.loading.hide();
  }
};

const getAllSOData = async () => {
  try {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_SO_DATA');
    
    // Map SOs to options format
    inventoryData.SOFilterOptions = getAllSOsData.value.map(so => ({
      label: so.name || so.user?.name || 'Unknown',
      value: so.id
    }));
  } catch (error) {

    console.error('Error fetching SO data:', error);
    inventoryData.SOFilterOptions = [];
  }
};

const filterInventoryCountByRegion = async (regionId) => {
  if (!regionId) {
    // Reset to original data when region is cleared
    const dashboardData = getCentralInventoryDashboardCount.value;
    inventoryData.regionalItems = dashboardData.regionalInventory || [];
    return;
  }

  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: "purple-9",
    message: "Filtering by region..."
  });

  try {
    await store.dispatch('SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT', regionId);
    
    const regionData = getAllRegionalInventoryDeviceDetailsWithCount.value;
    inventoryData.regionalItems = regionData.inventryCount || [];
    
  } catch (error) {

    console.error('Error filtering by region:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to filter by region'
    });
    inventoryData.regionalItems = [];
  } finally {
    $q.loading.hide();
  }
};

const filterInventoryCountBySO = async (soId) => {
  if (!soId) {
    // Reset to original data when SO is cleared
    const dashboardData = getCentralInventoryDashboardCount.value;
    inventoryData.billPartnerInventory = dashboardData.billPartnerInventory || [];
    return;
  }

  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: "purple-9",
    message: "Filtering by SO..."
  });

  try {
    await store.dispatch('SAT_RegionalInventoryAllocation/FETCH_SO_INVENTORY_DEVICE_DETAIL_WITH_COUNT', soId);
    
    const soData = getAllSoInventoryDeviceDetailsWithCount.value;
    inventoryData.billPartnerInventory = soData.inventryCount || [];
    
  } catch (error) {

    console.error('Error filtering by SO:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to filter by SO'
    });
    inventoryData.billPartnerInventory = [];
  } finally {
    $q.loading.hide();
  }
};

const downloadExcelReport = () => {
  const data = getAllRegionalInventorySerialNumbersByDevice.value;
  
  if (!data || data.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'No data available to download'
    });
    return;
  }

  try {
    // Prepare data for Excel
    const excelData = data.map(item => ({
      'Device Type': item.device?.deviceName || 'Unknown',
      'Serial Number': item.serialNumber || 'N/A'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Data');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Central_Inventory_Region.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    $q.notify({
      type: 'positive',
      message: 'Excel file downloaded successfully'
    });
    
  } catch (error) {

    console.error('Error downloading Excel:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to download Excel file'
    });
  }
};

const fnOpenBulkUploadModal = () => {
  openBulkUploadModal.value = !openBulkUploadModal.value;
};

// Lifecycle
onMounted(() => {
  getAllInventoryData();
  getAllSOData();
});
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.rounded-borders {
  border-radius: 4px;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.customTableClass {
  width: 100%;
}

@media (max-width: 768px) {
  .col-md-2, .col-sm-3, .col-xs-3 {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .q-ma-md {
    margin: 8px;
  }
  
  .q-mx-md {
    margin-left: 8px;
    margin-right: 8px;
  }
  
  .q-py-md {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  
  .q-title {
    font-size: 1.1rem;
  }
}
</style>