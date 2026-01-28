<template>
  <q-page>
    <div>
      <q-table
        title="Change Management"
        table-class="customTableClass"
        class="q-py-none q-mb-md"
        :rows="tableData"
        :columns="columns"
        row-key="id"
        :filter="filter1"
        v-model:pagination="paginationControlchange"
        :rows-per-page-options="[5,10,15]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllCMS"
      >
        <template #top>
          <div class="row full-width items-center q-gutter-md">
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filter1"
                placeholder="Type.."
                :debounce="600"
                class="q-py-sm"
                label="Search By MID/TID/Merchant Name"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row items-center q-gutter-md">
            <div class="col-md-5">
              <q-input
                v-model="Add"
                color="grey-9"
                placeholder="Enter Device Serial Number/TID"
                label="Add Device Serial Number/TID"
                @keyup.enter="fnCookDispatchedHistoryDetails"
                class="text-weight-regular text-grey-8"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="add" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
                :disable="Add === ''"
                label="Add"
                color="primary"
                class="text-white text-weight-regular q-py-sm"
                @click="fnCookDispatchedHistoryDetails"
                :loading="addingItem"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-table
        title="Change Management List"
        class="q-py-none"
        :rows="tableData1"
        :columns="columns1"
        row-key="id"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5,10,15,20]"
        :loading="toggleAjaxLoadFilter1"
        @request="ajaxLoadAllLeadInfo"
      >
        <template #top>
          <div class="row full-width items-center q-gutter-md">
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Type.."
                :debounce="600"
                class="q-py-sm"
                label="Search By MID/TID/Merchant Name"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-btn
                @click="downloadBpRegionsMenu"
                outline
                color="grey-9"
                label="Download as Excel"
                class="float-right"
                size="md"
                :loading="downloading"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Downloading...
                </template>
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

const $q = useQuasar();
const store = useStore();

// Reactive state
const filter = ref('');
const filter1 = ref('');
const Add = ref('');
const toggleAjaxLoadFilter1 = ref(false);
const toggleAjaxLoadFilter = ref(false);
const addingItem = ref(false);
const downloading = ref(false);

const paginationControlchange = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: 'mid',
  descending: false,
  rowsPerPage: 5,
});

const paginationControl = reactive({
  rowsNumber: 5,
  page: 1,
  sortBy: 'mid',
  descending: false,
  rowsPerPage: 5,
});

const columns = [
  {
    name: 'S No',
    required: true,
    label: 'S No',
    align: 'left',
    field: 'mid',
    sortable: true,
  },
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: 'mid',
    sortable: true,
  },
  {
    name: 'Device Serial Number',
    required: true,
    label: 'Device Serial Number',
    align: 'left',
    field: 'mid',
    sortable: true,
  },
];

const columns1 = [
  {
    name: 'S No',
    required: true,
    label: 'S No',
    align: 'left',
    field: 'mid',
    sortable: true,
  },
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: 'mid',
    sortable: true,
  },
  {
    name: 'Device Serial Number',
    required: true,
    label: 'Device Serial Number',
    align: 'left',
    field: 'mid',
    sortable: true,
  },
];

const tableData = ref([]);
const tableData1 = ref([]);

// Computed properties
const getChangeManagementList = computed(() => 
  store.getters["ChangeManagementList/getChangeManagementList"] || { totalElements: 0, content: [] }
);

const getCMSList = computed(() => 
  store.getters["CMSList/getCMSList"] || { totalElements: 0, content: [] }
);


const getImplementedQueue = computed(() => 
  store.getters["GetMarsData/getImplementedQueue"] || {}
);


// Lifecycle hooks
onMounted(() => {
  loadInitialData();
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filter.value,
  });
  ajaxLoadAllCMS({
    pagination: paginationControlchange,
    filter: filter1.value,
  });
});

// Methods
const loadInitialData = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..',
  });

  try {
    await store.dispatch("GetMarsData/IMPLEMENTED_QUEUE", "BIB09598");
    
    if (getImplementedQueue.value.leadInformation) {
      await store.dispatch(
        "SatLeadValidation/FETCH_SHORT_LEAD_DATA",
        getImplementedQueue.value.leadInformation.id
      );
      
      // Process data as needed
      processInitialData();
    }
    
    $q.loading.hide();
  } catch (error) {

    console.error('Error loading initial data:', error);
    $q.loading.hide();
  }
};

const processInitialData = () => {
  // This function processes the initial data
  // You can add your data processing logic here
  console.log('Initial data loaded:', getImplementedQueue.value);
};

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..',
  });

  try {
    await store.dispatch("ChangeManagementList/CHANGE_MANAGEMENT_LIST", { 
      pagination, 
      filter 
    });

    // Update pagination
    const response = getChangeManagementList.value;
    paginationControl.rowsNumber = response.totalElements || 0;
    paginationControl.page = (response.number || 0) + 1;
    
    // Update table data
    tableData1.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl.sortBy = response.sort[0].property;
      paginationControl.descending = !response.sort[0].ascending;
    }

    $q.loading.hide();
  } catch (error) {

    console.error('Error loading lead info:', error);
    $q.loading.hide();
  }
};

const ajaxLoadAllCMS = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching CMS data ..',
  });

  try {
    await store.dispatch("CMSList/CMS_LIST", { 
      pagination, 
      filter 
    });

    // Update pagination
    const response = getCMSList.value;
    paginationControlchange.rowsNumber = response.totalElements || 0;
    paginationControlchange.page = (response.number || 0) + 1;
    
    // Update table data
    tableData.value = response.content || [];
    
    // Note: The original code had commented out sort handling
    // if (response.sort && response.sort.length > 0) {
    //   paginationControlchange.sortBy = response.sort[0].property;
    //   paginationControlchange.descending = !response.sort[0].ascending;
    // }

    $q.loading.hide();
  } catch (error) {

    console.error('Error loading CMS data:', error);
    $q.loading.hide();
  }
};

const fnCookDispatchedHistoryDetails = async () => {
  if (!Add.value.trim()) {
    $q.notify({
      color: 'warning',
      message: 'Please enter a value to add',
      icon: 'warning'
    });
    return;
  }

  addingItem.value = true;

  try {
    // Implement your add logic here
    console.log('Adding item:', Add.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    $q.notify({
      color: 'positive',
      message: 'Item added successfully',
      icon: 'check'
    });
    
    // Clear input
    Add.value = '';
    
    // Refresh data
    await ajaxLoadAllLeadInfo({
      pagination: paginationControl,
      filter: filter.value,
    });
    
  } catch (error) {

    console.error('Error adding item:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to add item',
      icon: 'error'
    });
  } finally {
    addingItem.value = false;
  }
};

const downloadBpRegionsMenu = async () => {
  downloading.value = true;

  try {
    // Implement your download logic here
    console.log('Downloading data...');
    
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    $q.notify({
      color: 'positive',
      message: 'Download started successfully',
      icon: 'file_download'
    });
    
    // You can trigger actual file download here
    // Example: window.open('your-download-url', '_blank');
    
  } catch (error) {

    console.error('Error downloading:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to download',
      icon: 'error'
    });
  } finally {
    downloading.value = false;
  }
};


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

.q-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-btn {
  min-width: 100px;
}

@media (max-width: 768px) {
  .col-md-5 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .float-right {
    float: none !important;
    margin-top: 16px;
    width: 100%;
  }
  
  .q-table {
    overflow-x: auto;
  }
}
</style>