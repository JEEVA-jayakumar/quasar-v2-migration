<template>
  <q-page>
    <div
      class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
    >
      Bijlipay Lost/Stolen
    </div>

    <!-- //Common lead information in popup -->
    <general-lead-information
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- content -->
    <!--START: table lead validation -->
    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="name"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >
      <template #body-cell-tid="props">
        <q-td :props="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </q-td>
      </template>

      <template #body-cell-mid="props">
        <q-td :props="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </q-td>
      </template>

      <template #body-cell-leadNumber="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click="toggleLeadInformation(props.row.leadInformation)"
        >
          <span class="label text-primary"
            ># {{ props.row.leadInformation?.leadNumber || 'N/A' }}</span
          >
        </q-td>
      </template>

      <template #body-cell-mobileNumber="props">
        <q-td :props="props">
          {{ props.row.leadInformation == null
            ? "NA"
            : props.row.leadInformation.contactNumber
          }}
        </q-td>
      </template>

      <template #body-cell-leadAddress="props">
        <q-td :props="props">
          {{ props.row.leadInformation == null
            ? "NA"
            : props.row.leadInformation.leadAddress
          }}
        </q-td>
      </template>

      <template #body-cell-lostOrStolenRemarks="props">
        <q-td :props="props">
          <span class="label">{{ props.row.lostOrStolenRemarks || 'N/A' }}</span>
        </q-td>
      </template>

      <template #body-cell-deviceStatusDate="props">
        <q-td :props="props">
          <span class="label">{{ formatDate(props.row.deviceStatusDate) }}</span>
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="positive"
            size="sm"
            @click="lostStolenDevice(props.row)"
          >
            Lost/Stolen
          </q-btn>
        </q-td>
      </template>

      <template #top>
        <!--START: table filter,search,excel download -->
        <div class="col-5">
          <q-input
            clearable
            v-model="filter"
            color="grey-9"
            placeholder="Type.."
            label="Search Using TID, MID, Lead ID, Merchant Name"
            class="q-mr-lg q-py-sm"
          />
        </div>
      </template>
    </q-table>

    <div
      class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
    >
      Lost/Stolen Status
    </div>

    <q-table
      table-class="customTableClass"
      :columns="columns1"
      :rows="tableData1"
      row-key="field"
      color="grey-9"
      :filter="filter1"
      :rows-per-page-options="[5, 10, 15, 20, 25]"
      v-model:pagination="paginationControl1"
      :loading="toggleAjaxLoadFilter1"
      @request="lostOrStolenLoadInfo"
      table-style="word-break: break-all"
      class="payment_verification_table capitalize"
    >
      <template #body-cell-updated_at="props">
        <q-td :props="props">
          {{ props.row.updatedAt == null 
            ? "NA" 
            : formatDate(props.row.updatedAt) 
          }}
        </q-td>
      </template>

      <template #body-cell-Status="props">
        <q-td :props="props">
          <span
            class="label text-positive"
            v-if="props.row.regionalInventory?.deviceStatus == 8"
          >
            Waiting for Approval
          </span>
          <span
            class="label text-amber"
            v-if="props.row.regionalInventory?.deviceStatus == 7"
          >
            Submitted By SO
          </span>
          <span
            class="label text-purple"
            v-if="props.row.regionalInventory?.deviceStatus == 10"
          >
            Rejected By Finance
          </span>
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="props.row.regionalInventory?.deviceStatus == 8"
            disable
            color="purple-9"
            size="sm"
          >
            Waiting for Approval
          </q-btn>
          <q-btn
            v-else-if="props.row.regionalInventory?.deviceStatus == 7"
            disable
            color="blue"
            size="sm"
          >
            Submitted By SO
          </q-btn>
          <q-btn
            v-else-if="props.row.regionalInventory?.deviceStatus == 10"
            disable
            color="red"
            size="sm"
          >
            Rejected By Finance
          </q-btn>
        </q-td>
      </template>

      <template #body-cell-action2="props">
        <q-td :props="props">
          <q-btn
            v-if="[10, 8].includes(props.row.regionalInventory?.deviceStatus)"
            color="purple-9"
            size="sm"
            @click="loststolendevice(props.row)"
          >
            Lost/Stolen
          </q-btn>
          <q-btn
            v-else-if="props.row.regionalInventory?.deviceStatus == 7"
            class="q-mx-sm"
            color="positive"
            size="sm"
            @click="loststolendevice(props.row)"
          >
            Lost/Stolen
          </q-btn>
        </q-td>
      </template>

      <template #top>
        <div class="col-md-5">
          <q-input
            clearable
            color="grey-9"
            v-model="filter1"
            placeholder="Type.."
            label="Search Using TID, MID"
            class="q-mr-lg q-py-sm"
          />
        </div>
        <div class="col-md-6">
          <q-btn
            outline
            color="purple-9"
            label="Download as Excel"
            class="q-mr-lg q-py-sm float-right"
            size="md"
            @click="downloadLostDatas()"
          />
        </div>
      </template>
    </q-table>

    <!--END: table lead validation -->
    <!--START >>  Download Reports -->
    <download-lost-or-stolen
      v-if="propLostStolenDatas"
      :propLostStolenDatas="propLostStolenDatas"
      @emitfnshowLostOrStolen="downloadLostDatas"
    />
    <!--END:  Download Reports-->

    <show-merchant-transaction-level-details
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!--START: Lost or Stolen model -->
    <lost-stolen-device-comp
      v-if="showLostModel"
      :showLostModel="showLostModel"
      :propShowLostComponent="propsLostAppend"
      @closeLostModel="lostStolenDevice"
    />
    <!--END: Lost or Stolen model -->

    <!--START >>  Show Ajax Spinner -->
    <div
      v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1"
      class="fullscreen spinner-overlay"
    >
      <q-spinner-bars
        class="absolute-center"
        style="color:#61116a"
        :size="35"
      />
    </div>
    <!--END >>  Show Ajax Spinner -->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { format } from 'date-fns';

import DownloadLostOrStolen from "../../components/sat/DownloadLostOrStolen.vue";
import LostStolenDeviceComp from "../../components/sat/lostStolenDeviceComp.vue";
import ShowMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import GeneralLeadInformation from "../../components/generalLeadInformation.vue";

export default defineComponent({
  name: "merchantTransactionLevel",

  components: {
    ShowMerchantTransactionLevelDetails,
    LostStolenDeviceComp,
    GeneralLeadInformation,
    DownloadLostOrStolen
  },

  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const propToggleLeadInformation = ref(false);
    const propLostStolenDatas = ref(false);
    const propsLostAppend = ref([]);
    const showLostModel = ref(false);
    const addtnLeadInformation = ref(null);
    const toggleAjaxLoadFilter = ref(false);
    const toggleAjaxLoadFilter1 = ref(false);
    const valueToggleMerchantTransaction = ref(false);
    const filter = ref("");
    const filter1 = ref("");
    const tableData = ref([]);
    const tableData1 = ref([]);

    // Pagination controls
    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "tid",
      descending: false,
      rowsPerPage: 10
    });

    const paginationControl1 = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "tid",
      descending: false,
      rowsPerPage: 10
    });

    // Columns definitions
    const columns = [
      {
        name: "tid",
        required: true,
        label: "TID",
        align: "left",
        field: "tid",
        sortable: true
      },
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "left",
        field: "mid",
        sortable: true
      },
      {
        name: "leadNumber",
        required: true,
        label: "Lead Id",
        align: "left",
        field: row => row.leadInformation?.leadNumber || 'N/A',
        sortable: false
      },
      {
        name: "leadInformation",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: row => row.leadInformation?.leadName || 'N/A',
        sortable: false
      },
      {
        name: "leadAddress",
        required: true,
        label: "Merchant Address",
        align: "center",
        field: row => row.leadInformation?.leadAddress || 'N/A',
        sortable: false
      },
      {
        name: "deviceName",
        required: true,
        label: "Device type",
        align: "right",
        field: row => row.leadInformation?.device?.deviceName || 'N/A',
        sortable: false
      },
      {
        name: "device_serial_number",
        required: true,
        label: "Device Serial Number",
        align: "left",
        field: row => row.regionalInventory?.serialNumber || "NA",
        sortable: true
      },
      {
        name: "deviceStatusDate",
        required: true,
        label: "Implementation Date",
        align: "left",
        field: "deviceStatusDate",
        sortable: true
      },
      {
        name: "assignedTo",
        required: true,
        label: "Implemented by",
        align: "left",
        field: row => {
          const assigned = row.assignedTo;
          return assigned 
            ? `${assigned.name} | ${assigned.employeeID}` 
            : "NA";
        },
        sortable: true
      },
      {
        name: "deviceAddress",
        required: true,
        label: "Implemented Address",
        align: "left",
        field: row => row.deviceAddress || 'N/A',
        sortable: true
      },
      {
        name: "mobileNumber",
        required: true,
        label: "Mobile Number",
        align: "center",
        field: row => row.leadInformation?.contactNumber || 'N/A',
        sortable: false
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "center",
        field: "action",
        sortable: true
      }
    ];

    const columns1 = [
      {
        name: "leadInformation.leadName",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: row => row.leadInformation?.leadName || 'N/A'
      },
      {
        name: "Address",
        required: true,
        label: "Address",
        align: "left",
        field: row => row.leadInformation?.leadAddress || 'N/A',
        sortable: true
      },
      {
        name: "leadInformation.device.deviceName",
        required: true,
        label: "Device",
        align: "left",
        field: row => row.leadInformation?.device?.deviceName || 'N/A'
      },
      {
        name: "tid",
        required: true,
        label: "TID",
        align: "left",
        field: "tid",
        sortable: true
      },
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "left",
        field: "mid",
        sortable: true
      },
      {
        name: "updated_at",
        required: true,
        label: "Receive Date",
        align: "center",
        field: row => row.updatedAt || 'N/A'
      },
      {
        name: "lostOrStolenRemarks",
        required: true,
        label: "Remarks",
        align: "left",
        field: row => row.regionalInventory?.lostOrStolenRemarks || 'N/A'
      },
      {
        name: "Status",
        required: true,
        label: "Status",
        align: "left",
        field: row => row.regionalInventory?.deviceStatus || 'N/A',
        sortable: true
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "left",
        field: "action",
        sortable: false
      },
      {
        name: "action2",
        required: true,
        label: "",
        align: "left",
        field: "action2",
        sortable: false
      }
    ];

    // Computed properties
    const getMasterTrackerList = computed(() => 
      store.getters["MasterTracker/getMasterTrackerList"]
    );

    const getLostOrStolenDatas = computed(() => 
      store.getters["lostOrStolenDatas/getLostOrStolenDatas"]
    );

    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString || dateString === 'NA') return 'NA';
      try {
        const date = new Date(dateString);
        return format(date, 'do MMM y');
      } catch {
        return dateString;
      }
    };

    // Methods
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    const ajaxLoadAllLeadInfo = async ({ pagination, filter: searchFilter }) => {
      toggleAjaxLoadFilter.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("MasterTracker/MASTER_TRACKER_LIST", { 
          pagination, 
          filter: searchFilter 
        });

        const masterData = getMasterTrackerList.value;
        
        paginationControl.value = {
          ...pagination,
          rowsNumber: masterData.totalElements || 0,
          page: masterData.number ? masterData.number + 1 : 1,
          sortBy: masterData.sort?.[0]?.property || "tid",
          descending: !masterData.sort?.[0]?.ascending
        };

        tableData.value = masterData.content || [];
      } catch (error) {

        console.error('Error loading master tracker data:', error);
        $q.notify({
          color: 'negative',
          message: 'Failed to load data'
        });
      } finally {
        toggleAjaxLoadFilter.value = false;
        $q.loading.hide();
      }
    };

    const lostOrStolenLoadInfo = async ({ pagination, filter: searchFilter }) => {
      toggleAjaxLoadFilter1.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("lostOrStolenDatas/FETCH_ALL_LOST_DEVICES_DATAS", { 
          pagination, 
          filter: searchFilter 
        });

        const lostData = getLostOrStolenDatas.value;
        
        paginationControl1.value = {
          ...pagination,
          rowsNumber: lostData.totalElements || 0,
          page: lostData.number ? lostData.number + 1 : 1,
          sortBy: lostData.sort?.[0]?.property || "tid",
          descending: !lostData.sort?.[0]?.ascending
        };

        tableData1.value = lostData.content || [];
      } catch (error) {

        console.error('Error loading lost/stolen data:', error);
        $q.notify({
          color: 'negative',
          message: 'Failed to load data'
        });
      } finally {
        toggleAjaxLoadFilter1.value = false;
        $q.loading.hide();
      }
    };

    const downloadLostDatas = () => {
      propLostStolenDatas.value = !propLostStolenDatas.value;
    };

    const lostStolenDevice = (exceptionDetails) => {
      showLostModel.value = !showLostModel.value;
      propsLostAppend.value = exceptionDetails;
    };

    const loststolendevice = (rowData) => {
      showLostModel.value = !showLostModel.value;
      propsLostAppend.value = rowData;
    };

    const rowClick = () => {
      valueToggleMerchantTransaction.value = !valueToggleMerchantTransaction.value;
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filter.value
      });
      
      lostOrStolenLoadInfo({
        pagination: paginationControl1.value,
        filter: filter1.value
      });
    });

    return {
      // Refs
      propToggleLeadInformation,
      propLostStolenDatas,
      propsLostAppend,
      showLostModel,
      addtnLeadInformation,
      toggleAjaxLoadFilter,
      toggleAjaxLoadFilter1,
      valueToggleMerchantTransaction,
      filter,
      filter1,
      tableData,
      tableData1,
      paginationControl,
      paginationControl1,
      columns,
      columns1,
      
      // Computed
      getMasterTrackerList,
      getLostOrStolenDatas,
      
      // Methods
      toggleLeadInformation,
      ajaxLoadAllLeadInfo,
      lostOrStolenLoadInfo,
      downloadLostDatas,
      lostStolenDevice,
      loststolendevice,
      rowClick,
      formatDate
    };
  }
});
</script>

<style scoped>
.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.payment_verification_table {
  font-size: 0.875rem;
}

.capitalize {
  text-transform: capitalize;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.label {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
}

.text-primary {
  color: #027be3;
}

.text-positive {
  color: #21ba45;
}

.text-amber {
  color: #f2c037;
}

.text-purple {
  color: #9c27b0;
}
</style>