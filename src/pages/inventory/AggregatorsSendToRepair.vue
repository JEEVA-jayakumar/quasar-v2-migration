<template>
  <q-page>
    <!-- content -->
    <div>
      <q-pull-to-refresh @refresh="onRefresh" inline>
        <!--START: table title -->
        <div
          class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >
          Aggregators Send To Repair
        </div>
        <!--END: table title -->
        <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
          <!--END: table title -->
        </div>
        <!--START: table lead validation -->
        <q-table
          table-class="customTableClass"
          :columns="columns"
          :rows="tableData"
          color="grey-9"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :rows-per-page-options="[5,10,15,20,25]"
          :loading="toggleAjaxLoadFilter"
          @request="ajaxLoadAllLeadInfo2"
        >
          <!--START: table header -->
          <template #header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
                col.label
              }}</q-th>
            </q-tr>
          </template>

          <!--END: table header -->
          <template #body="props">
            <!--START: table rows -->
            <q-tr :props="props" class="bottom-border">
              <q-td auto-width key="aggregatorDevice" :props="props">{{
                props.row.aggregatorDevice?.deviceName || 'N/A'
              }}</q-td>
              <q-td auto-width key="serialNumber" :props="props">{{
                props.row.serialNumber
              }}</q-td>
              <q-td auto-width key="updated_at" :props="props">
                {{ props.row.updatedAt ? formatDate(props.row.updatedAt) : "NA" }}
              </q-td>
              <q-td auto-width key="action" :props="props">
                <q-btn
                  highlight
                  push
                  class="q-mx-sm"
                  color="positive"
                  @click="openAcceptModel(props.row)"
                  size="sm"
                  >Accept</q-btn
                >
                <q-btn
                  highlight
                  push
                  class="q-mx-sm"
                  color="negative"
                  @click="AggregatorsmoveToScrap(props.row)"
                  size="sm"
                  >Moved To Scrap</q-btn
                >
              </q-td>
              <!--END: table other data -->
            </q-tr>
          </template>
          <template #top>
            <!--START: table filter,search -->
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filterSearch"
                placeholder="Type.."
                label="Search Using Device Serial Number"
                class="q-mr-lg q-py-sm"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-md-5">
              <q-btn 
                square 
                outline 
                color="purple-9" 
                label="Download as Excel" 
                class="q-mr-lg q-py-sm float-right" 
                size="md" 
                @click="downloadAggregatorsSendToRepair()" />
            </div>
            <div class="col-md-12" align="right">
              <q-btn
                outline
                color="grey-9"
                icon="attach_file"
                @click="fnOpenBulkModal"
                label="Bulk Upload"
              />
            </div>
            <!--END: table filter,search -->
          </template>
        </q-table>
      </q-pull-to-refresh>
      
      <!--START >>  Download Reports -->
      <DownloadAggregatorsSendToRepair
        v-if="propSendToRepair" 
        :propSendToRepair="propSendToRepair"
        :propData="propSelectedAggregators" 
        @emitfnshowSendToRepair="downloadAggregatorsSendToRepair"
      />
      <!--END:  Download Reports-->
      
      <openAddAggregatorsBulkModelComp
        v-if="openBulkModal"
        :propOpenBulkModal="openBulkModal"
        @closeModel="fnOpenBulkModal"
        @emitToggleinventoryBulkUploadOnSuccess="fnReloadPageInformation"
      />

      <AggregatorsmoveToScrapComp
        v-if="showScrapModel"
        :showScrapModel="showScrapModel"
        :propShowScrapComponent="propsScrapAppend"
        @closeScrapModel="AggregatorsmoveToScrap"
      />

      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import DownloadAggregatorsSendToRepair from "../../components/inventory/DownloadAggregatorsSendToRepair.vue";
import AggregatorsmoveToScrapComp from "../../components/inventory/AggregatorsmoveToScrapComp.vue";
import openAddAggregatorsBulkModelComp from "../../components/inventory/openAddAggregatorsBulkModelComp.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

dayjs.extend(advancedFormat);

export default defineComponent({
  name: "getAggregatorsSendToRepairDetails",
  components: {
    DownloadAggregatorsSendToRepair,
    AggregatorsmoveToScrapComp,
    openAddAggregatorsBulkModelComp,
    generalLeadInformation
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const propToggleLeadInformation = ref(false);
    const propSendToRepair = ref(false);
    const propSelectedAggregators = ref(null);
    const toggleAjaxLoadFilter = ref(false);
    const propsScrapAppend = ref([]);
    const showScrapModel = ref(false);
    const openBulkModal = ref(false);
    const filterSearch = ref("");
    const addtnLeadInformation = ref(null);
    
    const paginationControl = reactive({
      rowsNumber: 10,
      page: 1,
      sortBy: "serialNumber",
      descending: false,
      rowsPerPage: 5
    });

    const tableData = ref([]);

    // Computed properties
    const getAggregatorsSendToRepairDetails = computed(() => 
      store.getters["SendToRepair/getAggregatorsSendToRepairDetails"] || { totalElements: 0, number: 0, content: [] }
    );

    // Columns definition
    const columns = [
      {
        name: "aggregatorDevice",
        required: true,
        label: "Device Type",
        align: "left",
        field: row => row.aggregatorDevice?.deviceName || 'N/A',
        sortable: true
      },
      {
        name: "serialNumber",
        required: true,
        label: "Device Serial Numbers",
        align: "left",
        field: "serialNumber",
        sortable: false
      },
      {
        name: "updated_at",
        required: true,
        label: "Receive Date",
        align: "center",
        field: row => formatDate(row.updatedAt)
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
    const onRefresh = (done) => {
      ajaxLoadAllLeadInfo2({
        pagination: paginationControl,
        filter: filterSearch.value
      }).finally(() => done());
    };

    const fetchAggregatorList = async () => {
      try {
        await store.dispatch("superAdminAggregators/GET_ACTIVE_CREATED_AGGREGATORS_LIST");
      } catch (error) {

        console.error("Error fetching aggregator list:", error);
      }
    };

    const fnReloadPageInformation = () => {
      ajaxLoadAllLeadInfo2({
        pagination: paginationControl,
        filter: filterSearch.value
      });
    };

    const fnOpenBulkModal = () => {
      openBulkModal.value = !openBulkModal.value;
    };

    const downloadAggregatorsSendToRepair = (val) => {
      propSendToRepair.value = !propSendToRepair.value;
      propSelectedAggregators.value = val;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'NA';
      return dayjs(dateString).format('Do MMM Y');
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    const ajaxLoadAllLeadInfo2 = async ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("SendToRepair/FETCH_AGGREGATORS_SEND_TO_REPAIR_DETAILS", { 
          pagination, 
          filter 
        });

        Object.assign(paginationControl, pagination);
        paginationControl.rowsNumber = getAggregatorsSendToRepairDetails.value.totalElements;
        paginationControl.page = getAggregatorsSendToRepairDetails.value.number + 1;
        tableData.value = getAggregatorsSendToRepairDetails.value.content || [];

        if (getAggregatorsSendToRepairDetails.value.sort && getAggregatorsSendToRepairDetails.value.sort.length > 0) {
          paginationControl.sortBy = getAggregatorsSendToRepairDetails.value.sort[0].property;
          paginationControl.descending = !getAggregatorsSendToRepairDetails.value.sort[0].ascending;
        }

        $q.loading.hide();
      } catch (error) {

        console.error("Error loading data:", error);
        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load data",
          icon: "error"
        });
      }
    };

    const AggregatorsmoveToScrap = (exceptionDetails) => {
      showScrapModel.value = !showScrapModel.value;
      propsScrapAppend.value = exceptionDetails;
    };

    const openAcceptModel = (reqData) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure you want to approve?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(async () => {
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing .."
        });

        try {
          await store.dispatch("SendToRepair/APPROVE_AGGREGATORS_SEND_TO_REPAIR", reqData);
          
          // Refresh the table data
          await ajaxLoadAllLeadInfo2({
            pagination: paginationControl,
            filter: filterSearch.value
          });
          
          $q.loading.hide();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Approved!",
            icon: "thumb_up"
          });
        } catch (error) {

          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error.message || "Please try again later!",
            icon: "thumb_down"
          });
        }
      }).onCancel(() => {
        // User canceled
      });
    };

    const downloadTxtFile = () => {
      if (tableData.value.length === 0) {
        $q.notify({
          color: "warning",
          position: "bottom",
          message: "No data to download",
          icon: "warning"
        });
        return;
      }

      let output = "";
      tableData.value.forEach(element => {
        output += element.serialNumber + "\r\n";
      });

      const file = new Blob([output], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "serialNumber.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadAllLeadInfo2({
        pagination: paginationControl,
        filter: filterSearch.value
      });
      fetchAggregatorList();
    });

    return {
      // State
      propToggleLeadInformation,
      propSendToRepair,
      propSelectedAggregators,
      toggleAjaxLoadFilter,
      showScrapModel,
      openBulkModal,
      filterSearch,
      addtnLeadInformation,
      paginationControl,
      tableData,
      columns,
      
      // Methods
      onRefresh,
      fnReloadPageInformation,
      fnOpenBulkModal,
      downloadAggregatorsSendToRepair,
      formatDate,
      toggleLeadInformation,
      ajaxLoadAllLeadInfo2,
      AggregatorsmoveToScrap,
      openAcceptModel,
      downloadTxtFile
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

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.q-table >>> .q-table__top {
  border-bottom: 1px solid #e0e0e0;
}
</style>