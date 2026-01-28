<template>
  <q-page>
    <div>
      <q-tabs v-model="selectedTab" inline-label align="left" active-color="primary" indicator-color="primary"
        class="shadow-1">
        <q-tab name="tab-1" label="Approved Pod" />
        <q-tab name="tab-2" label="Rejected Pod" />
        <q-tab name="tab-3" label="Allocated Pod" />

        <q-tab-panels v-model="selectedTab" animated>
          <!-- Tab 1: Approved Pod -->
          <q-tab-panel name="tab-1">
            <q-table :rows="tableData" :columns="columns" v-model:pagination="paginationControl"
              :filter="filterSearch" :rows-per-page-options="[5, 10, 15, 20]" row-key="name" color="grey-9"
              @request="ajaxLoadAllLeadInfo" :loading="loading">
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  {{ props.row.created_date ? formatDate(props.row.created_date) : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-updated_date="props">
                <q-td :props="props">
                  {{ props.row.updated_date ? formatDate(props.row.updated_date) : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="getStatusColor(props.row.status)">
                    {{ getStatusText(props.row.status) }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-owner="props">
                <q-td :props="props">
                  <span :class="getOwnerClass(props.row.owner)">
                    {{ getOwnerText(props.row.owner) }}
                  </span>
                </q-td>
              </template>

              <template v-slot:body-cell-regionAreaName="props">
                <q-td :props="props">
                  {{ props.row.allocate_region?.regionAreaName || 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <!-- Action buttons can be added here if needed -->
                </q-td>
              </template>

              <template v-slot:top>
                <div class="col-3">
                  <q-input v-model="filterSearch" placeholder="Type to search..." clearable dense
                    class="q-mr-lg">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Tab 2: Rejected Pod -->
          <q-tab-panel name="tab-2">
            <q-table :rows="tableData1" :columns="columns1" v-model:pagination="paginationControl1"
              :filter="filterSearch1" :rows-per-page-options="[5, 10, 15, 20]" row-key="name" color="grey-9"
              @request="ajaxLoadAllLeadInfo1" :loading="loading1">
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  {{ props.row.created_date ? formatDate(props.row.created_date) : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-updated_date="props">
                <q-td :props="props">
                  {{ props.row.updated_date ? formatDate(props.row.updated_date) : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="getStatusColor(props.row.status)">
                    {{ getStatusText(props.row.status) }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-owner="props">
                <q-td :props="props">
                  <span :class="getOwnerClass(props.row.owner)">
                    {{ getOwnerText(props.row.owner) }}
                  </span>
                </q-td>
              </template>

              <template v-slot:body-cell-regionAreaName="props">
                <q-td :props="props">
                  {{ props.row.allocate_region?.regionAreaName || 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  {{ props.row.allocate_so ? `${props.row.allocate_so.name} | ${props.row.allocate_so.employeeID}` : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-action1="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps label="Update" icon="fas fa-plus-square" size="sm"
                      @click="fnUpdateRejectedPodDetails(props.row)" flat class="text-primary">
                      <q-tooltip>Update rejected pod</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <template v-slot:top>
                <div class="col-3">
                  <q-input v-model="filterSearch1" placeholder="Type to search..." clearable dense
                    class="q-mr-lg">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Tab 3: Allocated Pod -->
          <q-tab-panel name="tab-3">
            <q-table :rows="tableData2" :columns="columns2" v-model:pagination="paginationControl2"
              :filter="filterSearch2" :rows-per-page-options="[5, 10, 15, 20]" row-key="name" color="grey-9"
              @request="ajaxLoadAllLeadInfo2" :loading="loading2">
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  {{ props.row.created_date ? formatDate(props.row.created_date) : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-updated_date="props">
                <q-td :props="props">
                  {{ props.row.updated_date ? formatDate(props.row.updated_date) : 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="getStatusColor(props.row.status)">
                    {{ getStatusText(props.row.status) }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-owner="props">
                <q-td :props="props">
                  <span :class="getOwnerClass(props.row.owner)">
                    {{ getOwnerText(props.row.owner) }}
                  </span>
                </q-td>
              </template>

              <template v-slot:body-cell-regionAreaName="props">
                <q-td :props="props">
                  {{ props.row.allocate_region?.regionAreaName || 'NA' }}
                </q-td>
              </template>

              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  {{ props.row.allocate_so ? `${props.row.allocate_so.name} | ${props.row.allocate_so.employeeID}` : 'NA' }}
                </q-td>
              </template>

              <template v-slot:top>
                <div class="col-3">
                  <q-input v-model="filterSearch2" placeholder="Type to search..." clearable dense
                    class="q-mr-lg">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useQuasar, date } from 'quasar';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PodManagement',

  setup() {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();

    // Reactive state
    const selectedTab = ref('tab-1');
    const filterSearch = ref('');
    const filterSearch1 = ref('');
    const filterSearch2 = ref('');
    
    const tableData = ref([]);
    const tableData1 = ref([]);
    const tableData2 = ref([]);
    const tableDataUpdate = ref([]);
    
    const loading = ref(false);
    const loading1 = ref(false);
    const loading2 = ref(false);
    
    const regionBasedSo = ref([]);
    
    const paginationControl = ref({
      sortBy: 'updated_date',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0
    });
    
    const paginationControl1 = ref({
      sortBy: 'updated_date',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0
    });
    
    const paginationControl2 = ref({
      sortBy: 'updated_date',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0
    });

    const formData = ref({
      allocate_region: '',
      allocate_reseller: null,
      total_count: 0,
      allocate_so: '',
      pod_number: '',
      sparePartsSets: []
    });

    // Table columns
    const columns = [
      { name: 'pod_number', label: 'Pod Number', field: 'pod_number', align: 'left', sortable: true },
      { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName || 'NA', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'owner', label: 'Owner', field: 'owner', align: 'left' },
      { name: 'total_count', label: 'Total Count', field: 'total_count', align: 'left' },
      { name: 'createdAt', label: 'Created Date', field: 'created_date', align: 'left' },
      { name: 'updated_date', label: 'Updated Date', field: 'updated_date', align: 'left', sortable: true },
      { name: 'action', label: '', field: 'action', align: 'left' }
    ];

    const columns1 = [
      { name: 'pod_number', label: 'Pod Number', field: 'pod_number', align: 'left', sortable: true },
      { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName || 'NA', align: 'left' },
      { name: 'name', label: 'SO', field: row => row.allocate_so ? `${row.allocate_so.name} | ${row.allocate_so.employeeID}` : 'NA', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'owner', label: 'Owner', field: 'owner', align: 'left' },
      { name: 'total_count', label: 'Total Count', field: 'total_count', align: 'left' },
      { name: 'createdAt', label: 'Created Date', field: 'created_date', align: 'left' },
      { name: 'updated_date', label: 'Updated Date', field: 'updated_date', align: 'left', sortable: true },
      { name: 'action1', label: '', field: 'action1', align: 'left' }
    ];

    const columns2 = [
      { name: 'pod_number', label: 'Pod Number', field: 'pod_number', align: 'left', sortable: true },
      { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName || 'NA', align: 'left' },
      { name: 'name', label: 'SO Name', field: row => row.allocate_so ? `${row.allocate_so.name} | ${row.allocate_so.employeeID}` : 'NA', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'owner', label: 'Owner', field: 'owner', align: 'left' },
      { name: 'total_count', label: 'Total Count', field: 'total_count', align: 'left' },
      { name: 'createdAt', label: 'Created Date', field: 'created_date', align: 'left' },
      { name: 'updated_date', label: 'Updated Date', field: 'updated_date', align: 'left', sortable: true },
      { name: 'action', label: '', field: 'action', align: 'left' }
    ];

    // Computed properties from Vuex store
    const getInventoryUpdatedPodDetails = computed(() => store.getters['getInventoryUpdatedPodDetails/getInventoryUpdatedPodDetails']);
    const getapprovedSoPodListDatas = computed(() => store.getters['soPodListDatas/getapprovedSoPodListDatas']);
    const getrejectedSoPodListDatas = computed(() => store.getters['soPodListDatas/getrejectedSoPodListDatas']);
    const getregionalInventoryAllocatedSoPodDetails = computed(() => store.getters['regionalInventoryDetails/getregionalInventoryAllocatedSoPodDetails']);

    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString) return 'NA';
      return date.formatDate(dateString, 'Do MMM Y');
    };

    const getStatusColor = (status) => {
      const colors = {
        1: 'positive',
        2: 'primary',
        3: 'orange',
        4: 'orange',
        5: 'orange',
        6: 'negative'
      };
      return colors[status] || 'grey';
    };

    const getStatusText = (status) => {
      const texts = {
        1: 'Created',
        2: 'Assigned to R.I',
        3: 'Approved By R.I',
        4: 'Assigned To SO',
        5: 'Approved By So',
        6: 'Rejected'
      };
      return texts[status] || 'NA';
    };

    const getOwnerText = (owner) => {
      const texts = {
        1: 'Central Inventory',
        2: 'Regional Inventory',
        3: 'SO'
      };
      return texts[owner] || 'NA';
    };

    const getOwnerClass = (owner) => {
      const classes = {
        1: 'text-positive',
        2: 'text-primary',
        3: 'text-primary'
      };
      return classes[owner] || '';
    };

    // Main methods
    const fnUpdateRejectedPodDetails = (reqData) => {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to Update?',
        ok: { label: 'Continue', color: 'primary' },
        cancel: { label: 'Cancel', flat: true }
      }).onOk(() => {
        $q.loading.show({
          delay: 0,
          message: 'Processing...',
          spinnerColor: 'primary'
        });

        const param = { podNumber: reqData.pod_number };
        
        store.dispatch('getInventoryUpdatedPodDetails/FETCH_INVENTORY_UPDATED_POD_DETAILS', param)
          .then(() => {
            tableDataUpdate.value = getInventoryUpdatedPodDetails.value;
            $q.loading.hide();
            router.push({
              name: 'updateRegionalRejectPods',
              params: { data: JSON.stringify(tableDataUpdate.value) }
            });
          })
          .catch(error => {
            $q.loading.hide();
            $q.notify({
              color: 'negative',
              position: 'bottom',
              message: error.message || 'Update failed!',
              icon: 'error'
            });
          });
      });
    };

    const ajaxLoadAllLeadInfo = (props) => {
      loading.value = true;
      const { pagination } = props;
      
      store.dispatch('soPodListDatas/FETCHING_APPROVED_POD_LIST_DETAILS', { 
        pagination: pagination, 
        filter: filterSearch.value 
      })
      .then(() => {
        paginationControl.value = {
          ...paginationControl.value,
          rowsNumber: getapprovedSoPodListDatas.value.totalElements,
          page: getapprovedSoPodListDatas.value.number + 1
        };
        
        tableData.value = getapprovedSoPodListDatas.value.content || [];
        loading.value = false;
      })
      .catch(error => {
        loading.value = false;
        console.error('Error loading approved pods:', error);
      });
    };

    const ajaxLoadAllLeadInfo1 = (props) => {
      loading1.value = true;
      const { pagination } = props;
      
      store.dispatch('soPodListDatas/FETCHING_REJECTED_POD_LIST_DETAILS', { 
        pagination: pagination, 
        filter: filterSearch1.value 
      })
      .then(() => {
        paginationControl1.value = {
          ...paginationControl1.value,
          rowsNumber: getrejectedSoPodListDatas.value.totalElements,
          page: getrejectedSoPodListDatas.value.number + 1
        };
        
        tableData1.value = getrejectedSoPodListDatas.value.content || [];
        loading1.value = false;
      })
      .catch(error => {
        loading1.value = false;
        console.error('Error loading rejected pods:', error);
      });
    };

    const ajaxLoadAllLeadInfo2 = (props) => {
      loading2.value = true;
      const { pagination } = props;
      
      store.dispatch('regionalInventoryDetails/FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS', { 
        pagination: pagination, 
        filter: filterSearch2.value 
      })
      .then(() => {
        paginationControl2.value = {
          ...paginationControl2.value,
          rowsNumber: getregionalInventoryAllocatedSoPodDetails.value.totalElements,
          page: getregionalInventoryAllocatedSoPodDetails.value.number + 1
        };
        
        tableData2.value = getregionalInventoryAllocatedSoPodDetails.value.content || [];
        loading2.value = false;
      })
      .catch(error => {
        loading2.value = false;
        console.error('Error loading allocated pods:', error);
      });
    };

    const goToSelectedTab = (tab) => {
      if (tab === 'tab-2') {
        ajaxLoadAllLeadInfo1({ pagination: paginationControl1.value });
      } else if (tab === 'tab-3') {
        ajaxLoadAllLeadInfo2({ pagination: paginationControl2.value });
      } else {
        ajaxLoadAllLeadInfo({ pagination: paginationControl.value });
      }
    };

    const regionBasedSoLoad = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('u_i'));
        const regionId = userInfo?.region?.id;
        
        if (regionId) {
          store.dispatch('InventoryCentral/FETCH_REGION_BASED_SO', regionId)
            .then(() => {
              const regionSO = store.getters['InventoryCentral/getRegionBasedSO'];
              regionBasedSo.value = regionSO.map(item => ({
                label: item.name,
                value: JSON.stringify(item)
              }));
            });
        }
      } catch (error) {

        console.error('Error loading region based SO:', error);
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      // Generate pod number
      const d = new Date();
      const number = d.getTime();
      formData.value.pod_number = `SO${number}`;
      
      // Initial data loading
      ajaxLoadAllLeadInfo({ pagination: paginationControl.value });
      ajaxLoadAllLeadInfo1({ pagination: paginationControl1.value });
      ajaxLoadAllLeadInfo2({ pagination: paginationControl2.value });
      
      regionBasedSoLoad();
    });

    // Watch for tab changes
    watch(selectedTab, (newTab) => {
      goToSelectedTab(newTab);
    });

    return {
      // State
      selectedTab,
      filterSearch,
      filterSearch1,
      filterSearch2,
      tableData,
      tableData1,
      tableData2,
      paginationControl,
      paginationControl1,
      paginationControl2,
      loading,
      loading1,
      loading2,
      columns,
      columns1,
      columns2,
      formData,
      
      // Methods
      fnUpdateRejectedPodDetails,
      ajaxLoadAllLeadInfo,
      ajaxLoadAllLeadInfo1,
      ajaxLoadAllLeadInfo2,
      formatDate,
      getStatusColor,
      getStatusText,
      getOwnerText,
      getOwnerClass
    };
  }
});
</script>

<style scoped>
.custom-table {
  font-size: 14px;
}

.q-table th {
  font-weight: 600;
  background-color: #f5f5f5;
}

.text-positive {
  color: #21ba45;
}

.text-primary {
  color: #1976d2;
}

.text-orange {
  color: #f57c00;
}

.text-negative {
  color: #c10015;
}

.q-badge {
  font-size: 12px;
  padding: 2px 8px;
}
</style>