<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 col-md-6 text-h6 text-weight-regular text-grey-9"></div>
      </div>
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <!--START: table title -->
        <div class="col-md-4">
          <q-select v-model="formData.leadSource" label="Select LeadSource" color="grey-9"
            @update:model-value="filterByLeadSource" :options="dropDown.leadSourceOptions" dense
            map-options emit-value option-value="value" option-label="label" />
        </div>
        <div class="col-md-8" align="right">
          <q-btn no-caps class="text-weight-regular" @click="fnaddprefix()" label="Add New" color="purple-9"
            size="md" />
        </div>
      </div>

      <!--START: table lead validation -->
      <q-table row-key="id" :filter="filter" :rows="tableData" class="q-py-none" :columns="columns"
        title="Lead Validation" table-class="customTableClass" :pagination="paginationControl"
        :loading="tableAjaxLoading">
        <!--START: table body modification -->
        <template #body-cell-createdAt="props">
          <q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td>
        </template>
        
        <template #body-cell-updatedAt="props">
          <q-td :props="props">{{ formatDate(props.row.updatedAt) }}</q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.active ? 'positive' : 'negative'" :label="props.row.active ? 'Active' : 'Inactive'" />
          </q-td>
        </template>

        <!-- <template #body-cell-action="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <div v-if="props.row.lastBaseMid == null && props.row.lastBaseTid == null">
                <q-btn dense no-caps no-wrap label="active" icon="far fa-plus-square" size="md"
                  @click="fnShowEditRegion(props.row)" flat class="text-light-blue" />
              </div>
            </div>
          </q-td>
        </template> -->
        <!-- END: table body modification -->
        
        <template #top>
          <!--START: table filter,search -->
          <div class="col-md-5">
            <q-input clearable color="grey-9" v-model="filter" placeholder="Type.." label="Search Lead Source..."
              class="q-mr-lg q-py-sm" dense>
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <!--END: table filter,search -->
        </template>
      </q-table>
      <!--END: table lead validation -->
      
      <!--START: Show create prefix -->
      <showCreatePrefix v-if="propShowAddPrefix" :propShowAddPrefix="propShowAddPrefix"
        @emitfnshowaddPrefix="fnaddprefix" />
      <!--END: Show create prefix -->
      
      <!--START: Open showPDOmodal model -->
      <showPDOmodal v-if="showPDOmodal" :propshowPDOmodal="showPDOmodal" :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion" />
      <!--END: Open showPDOmodal model -->

      <!--START: Show edit Region -->
      <inventoryWithRegion v-if="propShowEditRegion" :propShowEditRegion="propShowEditRegion"
        :propRowDetails="propRowDetails" @emitfnshowEditRegion="fnShowEditRegion" />
      <!--END: Show edit Region -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import showPDOmodal from "../../components/inventory/showFaultymodal.vue";
import inventoryWithRegion from "../../components/inventory/inventoryWithRegion.vue";
import showCreatePrefix from "./AddPrefix.vue";

export default defineComponent({
  name: "allocateDevice",
  
  components: {
    showPDOmodal,
    inventoryWithRegion,
    showCreatePrefix
  },
  
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const disableDeviceTypeSelection = ref(true);
    const propShowAddPrefix = ref(false);
    const disableSubmitButton = ref(true);
    const toggleFaultyBulkUpload = ref(false);
    const propShowEditRegion = ref(false);
    const filter = ref("");
    const showPDOmodal = ref(false);
    const regionOptions = ref([]);
    const deviceOptions = ref([]);
    const regionalItems = ref([]);
    const tableAjaxLoading = ref(false);
    const tableData = ref([]);
    const propRowDetails = ref(null);

    const formData = ref({
      leadSource: "",
      // scannedItems: []
    });

    const dropDown = ref({
      leadSourceOptions: [],
    });

    const paginationControl = ref({
      rowsPerPage: 10,
      page: 1,
      rowsNumber: 0,
      sortBy: 'createdAt',
      descending: true
    });

    // Table columns
    const columns = [
      {
        name: "sourceName",
        required: true,
        label: "Lead Source",
        align: "left",
        field: row => row.leadSource?.sourceName || '',
        sortable: true
      },
      {
        name: "prefix",
        required: true,
        label: "Prefix",
        align: "left",
        field: "prefix",
        sortable: true
      },
      {
        name: "baseTidLength",
        required: true,
        label: "Base Tid Length",
        align: 'center',
        field: "baseTidLength",
        sortable: true
      },
      {
        name: "baseMidLength",
        required: true,
        label: "Base Mid Length",
        align: 'center',
        field: "baseMidLength",
        sortable: true
      },
      {
        name: "nextBaseTid",
        required: true,
        label: "Next Base Tid",
        align: 'center',
        field: row => row.nextBaseTid == null ? "NA" : row.nextBaseTid,
        sortable: true
      },
      {
        name: "nextBaseMid",
        required: true,
        label: "Next Base Mid",
        align: 'center',
        field: row => row.nextBaseMid == null ? "NA" : row.nextBaseMid,
        sortable: true
      },
      {
        name: "minBaseTid",
        required: true,
        label: "Min Base Tid",
        align: 'center',
        field: "minBaseTid",
        sortable: true
      },
      {
        name: "maxBaseTid",
        required: true,
        label: "Max Base Tid",
        align: 'center',
        field: "maxBaseTid",
        sortable: true
      },
      {
        name: "minBaseMid",
        required: true,
        label: "Min Base Mid",
        align: 'center',
        field: "minBaseMid",
        sortable: true
      },
      {
        name: "maxBaseMid",
        required: true,
        label: "Max Base Mid",
        align: 'center',
        field: "maxBaseMid",
        sortable: true
      },
      {
        name: "createdAt",
        required: true,
        label: "Created At",
        align: 'center',
        field: "createdAt",
        sortable: true
      },
      {
        name: "updatedAt",
        required: true,
        label: "Updated At",
        align: 'center',
        field: "updatedAt",
        sortable: true
      },
      {
        name: "status",
        required: true,
        label: "Status",
        align: 'center',
        field: "active",
        format: val => val ? 'Active' : 'Inactive',
        sortable: true
      },
      // {
      //   name: "action",
      //   required: true,
      //   label: "",
      //   align: "left",
      //   field: "action",
      //   sortable: false,
      // },
    ];

    // Computed properties from Vuex store
    
    const getActiveLeadSource = computed(() => 
      store.getters["leadSource/getActiveLeadSource"]
    );
    
    const getAllPrefixDetails = computed(() => 
      store.getters["Prefix/getAllPrefixDetails"]
    );

    // Methods
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    };

    const ajaxLoadAllLeadInfo = async () => {
      tableAjaxLoading.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("Prefix/GET_PREFIX_DETAILS");
        
        tableData.value = [...getAllPrefixDetails.value];
        
        // Update pagination rows number
        paginationControl.value.rowsNumber = tableData.value.length;
        
        $q.loading.hide();
      } catch (error) {

        console.error("Error loading prefix details:", error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load prefix details",
          icon: "error"
        });
        $q.loading.hide();
      } finally {
        tableAjaxLoading.value = false;
      }
    };

    const fnaddprefix = (token) => {
      propShowAddPrefix.value = !propShowAddPrefix.value;
      if (token === "refresh") {
        ajaxLoadAllLeadInfo();
      }
    };

    const fnShowEditRegion = (rowDetails) => {
      propShowEditRegion.value = !propShowEditRegion.value;
      if (rowDetails !== undefined) {
        propRowDetails.value = rowDetails;
      }
    };

    const filterByLeadSource = (request) => {
      console.log("filterByLeadSource---------------------->", JSON.stringify(request));
      
      if (!request || request === '') {
        // Reset to all data
        tableData.value = [...getAllPrefixDetails.value];
      } else {
        // Filter by lead source
        tableData.value = getAllPrefixDetails.value.filter(
          service => service.leadSource?.id === request
        );
      }
      
      // Update pagination rows number
      paginationControl.value.rowsNumber = tableData.value.length;
      paginationControl.value.page = 1; // Reset to first page
    };

    const ajaxLoadDataForDeviceTypeTable = async () => {
      try {
        await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
        
        // Map lead sources to options format
        dropDown.value.leadSourceOptions = getActiveLeadSource.value.map(item => ({
          value: item.id,
          label: item.sourceName
        }));
        
        // Add "All" option at the beginning
        dropDown.value.leadSourceOptions.unshift({
          value: '',
          label: 'All Lead Sources'
        });
        
      } catch (error) {

        console.error("Error loading lead source data:", error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load lead sources",
          icon: "error"
        });
      }
    };

    // const filterInventoryByRegion = async (value) => {
    //   regionalItems.value = [];
      
    //   $q.loading.show({
    //     delay: 0,
    //     spinnerColor: "purple-9",
    //     message: "Fetching data .."
    //   });

    //   try {
    //     const params = {
    //       regionId: value.id
    //     };
        
    //     await store.dispatch("inventoryWithRegion/FETCH_INVENTORY_WITH_REGION_DATAS", params);
        
    //     regionalItems.value = [...getinventoryWithRegion.value];
        
    //     $q.loading.hide();
    //   } catch (error) {

    //     console.error("Error filtering inventory by region:", error);
    //     $q.notify({
    //       color: "negative",
    //       position: "bottom",
    //       message: "Failed to load inventory data",
    //       icon: "error"
    //     });
    //     $q.loading.hide();
    //   }
    // };

    // const fnAjaxGetAllRegionsData = async () => {
    //   try {
    //     await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
        
    //     regionOptions.value = getAllRegionsData.value.map(value => ({
    //       label: value.regionAreaName,
    //       value: value
    //     }));
        
    //   } catch (error) {

    //     console.error("Error loading regions data:", error);
    //     regionOptions.value = [];
    //     $q.notify({
    //       color: "negative",
    //       position: "bottom",
    //       message: "Failed to load regions",
    //       icon: "error"
    //     });
    //   }
    // };

    // const fnAjaxGetAllDevicesTypesData = async () => {
    //   try {
    //     await store.dispatch("InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA");
        
    //     deviceOptions.value = getAllInventoryDevicesTypesData.value.map(value => ({
    //       label: value.deviceName,
    //       value: value.id
    //     }));
        
    //   } catch (error) {

    //     console.error("Error loading device types data:", error);
    //     deviceOptions.value = [];
    //     $q.notify({
    //       color: "negative",
    //       position: "bottom",
    //       message: "Failed to load device types",
    //       icon: "error"
    //     });
    //   }
    // };

    const fnAllocateDeviceToRegion = () => {
      // Implementation for allocate device to region
      showPDOmodal.value = false;
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadDataForDeviceTypeTable();
      ajaxLoadAllLeadInfo();
      // fnAjaxGetAllDevicesTypesData();
      // fnAjaxGetAllRegionsData();
    });

    // Cleanup on component destruction
    onUnmounted(() => {
      // Clean up any listeners if needed
    });

    return {
      disableDeviceTypeSelection,
      propShowAddPrefix,
      disableSubmitButton,
      toggleFaultyBulkUpload,
      propShowEditRegion,
      filter,
      showPDOmodal,
      regionOptions,
      deviceOptions,
      regionalItems,
      tableAjaxLoading,
      tableData,
      propRowDetails,
      formData,
      dropDown,
      paginationControl,
      columns,
      formatDate,
      ajaxLoadAllLeadInfo,
      fnaddprefix,
      fnShowEditRegion,
      filterByLeadSource,
      fnAllocateDeviceToRegion,
      ajaxLoadDataForDeviceTypeTable,
      // filterInventoryByRegion,
      // fnAjaxGetAllRegionsData,
      // fnAjaxGetAllDevicesTypesData
    };
  }
});
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customTableClass {
  width: 100%;
}

.q-py-none {
  padding-top: 0;
  padding-bottom: 0;
}

.q-py-sm {
  padding-top: 8px;
  padding-bottom: 8px;
}

.group {
  gap: 16px;
}

.text-grey-9 {
  color: #212121;
}
</style>