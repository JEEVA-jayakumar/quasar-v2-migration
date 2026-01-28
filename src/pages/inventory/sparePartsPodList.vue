<template>
  <q-page>
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular text-grey-9">
        Spare Parts Pod List
      </div>
      
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      
      <!-- content -->
      <q-table
        table-class="customTableClass"
        :columns="columns"
        :rows="tableData"
        color="grey-9"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <template #body-cell-updated_date="props">
          <q-td :props="props">
            {{ formatDate(props.row.updated_date) }}
          </q-td>
        </template>
        
        <template #body-cell-created_date="props">
          <q-td :props="props">
            {{ formatDate(props.row.created_date) }}
          </q-td>
        </template>
        
        <template #body-cell-regionAreaName="props">
          <q-td :props="props">
            {{ props.row.allocate_region?.regionAreaName || 'NA' }}
          </q-td>
        </template>
        
        <template #body-cell-name="props">
          <q-td :props="props">
            {{ props.row.allocate_so ? `${props.row.allocate_so.name} | ${props.row.allocate_so.employeeID}` : 'NA' }}
          </q-td>
        </template>
        
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge 
              :color="getStatusColor(props.row.status)" 
              :label="getStatusText(props.row.status)"
              class="q-pa-xs"
            />
          </q-td>
        </template>

        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn
              push
              class="q-mx-sm"
              color="positive"
              size="sm"
              :disable="shouldDisableUpdateButton(props.row)"
              @click="updatePodDetails(props.row)"
            >
              Update
            </q-btn>
          </q-td>
        </template>
        
        <template #top>
          <div class="row full-width items-center q-gutter-md">
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filterSearch"
                placeholder="Type.."
                label="Search Using POD Number"
                class="q-py-sm"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            
            <div class="col-md-5 text-right">
              <q-btn
                no-caps
                class="text-weight-regular"
                @click="$router.push('/inventory/master/sparePartsInventory')"
                label="Add Spare"
                color="purple-9"
                size="md"
                icon="add"
              />
            </div>
          </div>
        </template>
      </q-table>

      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />
      
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          style="color:#61116a"
          :size="35"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { format } from 'date-fns';
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";

const $q = useQuasar();
const router = useRouter();
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const toggleAjaxLoadFilter = ref(false);
const addtnLeadInformation = ref(null);
const valueToggleMerchantTransaction = ref(false);
const filterSearch = ref('');

const paginationControl = reactive({
  rowsNumber: 10,
  page: 1,
  sortBy: 'updated_date',
  descending: false,
  rowsPerPage: 5
});

const tableData = ref([]);

// Computed properties
const getsparePartsPodListDetails = computed(() => 
  store.getters["sparePartsPodListInventoryDetails/getsparePartsPodListDetails"] || 
  { totalElements: 0, content: [] }
);

const getInventoryUpdatedPodDetails = computed(() => 
  store.getters["getInventoryUpdatedPodDetails/getInventoryUpdatedPodDetails"] || {}
);

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'NA';
  try {
    const date = new Date(dateString);
    return format(date, 'do MMM yyyy');
  } catch (error) {

    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 1: return 'positive';
    case 2: return 'primary';
    case 3: case 4: case 5: return 'orange';
    case 6: return 'negative';
    default: return 'grey';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 1: return 'Created';
    case 2: return 'Assigned to R.I';
    case 3: return 'Approved By R.I';
    case 4: return 'Assigned To SO';
    case 5: return 'Approved By SO';
    case 6: return 'Rejected';
    default: return 'NA';
  }
};

const shouldDisableUpdateButton = (row) => {
  const status = row.status;
  const owner = row.owner;
  
  // Enable button only when status is 2 (Assigned to R.I) 
  // and owner is not 2 (assuming owner 2 means already processed)
  if (status === 2 && owner !== 2) {
    return false;
  }
  
  // Disable for all other statuses
  return status === 1 || status === 3 || status === 5 || 
         status === 6 || status === undefined;
};

// Columns configuration
const columns = [
  {
    name: "pod_number",
    required: true,
    label: "Pod Number",
    align: "left",
    field: "pod_number",
    sortable: false
  },
  {
    name: "total_count",
    required: true,
    label: "Total Count",
    align: "left",
    field: "total_count"
  },
  {
    name: "status",
    required: true,
    label: "Status",
    align: "left",
    field: "status",
    sortable: false,
  },
  {
    name: "regionAreaName",
    required: true,
    label: "Region",
    align: "left",
    field: row => row.allocate_region?.regionAreaName || 'NA'
  },
  {
    name: "name",
    required: true,
    label: "Assigned SO",
    align: "left",
    field: row => row.allocate_so ? 
      `${row.allocate_so.name} | ${row.allocate_so.employeeID}` : 
      'NA'
  },
  {
    name: "created_date",
    required: true,
    label: "Created Date",
    align: "left",
    field: "created_date",
    sortable: false
  },
  {
    name: "updated_date",
    required: true,
    label: "Updated Date",
    align: "left",
    field: "updated_date",
    sortable: true
  },
  {
    name: "action",
    required: true,
    label: "",
    align: "center",
    field: "action",
    sortable: false
  }
];

// Methods
const updatePodDetails = async (rowData) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to update this POD?",
    ok: {
      label: "Continue",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    }
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    });

    try {
      const param = {
        podNumber: rowData.pod_number
      };

      await store.dispatch(
        "getInventoryUpdatedPodDetails/FETCH_INVENTORY_UPDATED_POD_DETAILS", 
        param
      );

      const updatedData = getInventoryUpdatedPodDetails.value;
      
      $q.loading.hide();
      
      // Navigate to update page with data
      router.push({
        name: "updateSparePartsPodList",
        params: { data: updatedData }
      });

    } catch (error) {

      console.error("Error updating POD details:", error);
      $q.loading.hide();
      $q.notify({
        color: "negative",
        message: "Failed to load POD details. Please try again.",
        icon: "error"
      });
    }
  }).onCancel(() => {
    $q.notify({
      color: "info",
      message: "Update cancelled",
      icon: "info"
    });
  });
};

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  toggleAjaxLoadFilter.value = true;
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  });

  try {
    await store.dispatch(
      "sparePartsPodListInventoryDetails/FETCH_SPARE_PARTS_POD_LIST_INVENTORY_DETAILS", 
      { pagination, filter }
    );

    const response = getsparePartsPodListDetails.value;
    
    // Update pagination
    paginationControl.rowsNumber = response.totalElements || 0;
    paginationControl.page = (response.number || 0) + 1;
    
    // Update table data
    tableData.value = response.content || [];
    
    // Update sort if available
    if (response.sort && response.sort.length > 0) {
      paginationControl.sortBy = response.sort[0].property;
      paginationControl.descending = !response.sort[0].ascending;
    }

    $q.loading.hide();
  } catch (error) {

    console.error("Error loading spare parts pod list:", error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "Failed to load data. Please try again.",
      icon: "error"
    });
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

const rowClick = () => {
  valueToggleMerchantTransaction.value = false;
};

// Lifecycle hooks
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filterSearch.value
  });
});
</script>

<style scoped>
.customTableClass {
  border-collapse: separate;
  border-spacing: 0;
}

.customTableClass th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.q-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.q-badge {
  min-width: 100px;
  text-align: center;
}

@media (max-width: 768px) {
  .col-md-5 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 16px;
  }
  
  .text-right {
    text-align: left !important;
  }
  
  .q-table {
    overflow-x: auto;
  }
}
</style>