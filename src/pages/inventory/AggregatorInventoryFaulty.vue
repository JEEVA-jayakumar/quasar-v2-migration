<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!--START: table title -->
        <div class="col-6 col-md-6 q-title text-weight-regular text-grey-9">Aggregator Faulty Inventory</div>
        <div class="col-6 col-md-6" align="right">
          <q-btn icon="attach_file" @click="bulkUploadFaultyDevices" outline color="dark" label="Bulk upload" />
        </div>
        <!--END: table title -->
      </div>
      <div>
        <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
          <div class="col-6 col-md-6">
            <q-input v-model="podNumber" label="Enter POD number" color="grey-9" />
          </div>
          <div class="col-6 col-md-6" align="right">
            <q-btn @click="fnAjaxFaultyInventoryData" color="light-blue" class="q-py-xs" label="Submit" />
          </div>
        </div>
        <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
          <!--START: table title -->
          <div class="col-6 col-md-6">
            <q-select :disable="disableDeviceTypeSelection" @update:model-value="fnSetDevicesByDeviceId"
              v-model="formData.device_type" label="Select Device Type" color="grey-9" :options="deviceOptions" />
          </div>
          <div class="col-6 col-md-6" align="right">
            <q-btn :disabled="formData.device_type == '' || scannerToggleOption" @click="openScannerComp"
              color="light-blue" class="q-py-xs" label="Start scan" />
          </div>
        </div>
        <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
          <div class="col-12 group" align="right">
            <q-btn :disabled="disabledButton" class="q-py-xs" icon="build" outline color="amber-9"
              label="Send to repair" @click="fnFinalFaultySubmit(1)" />

            <q-btn :disabled="disabledButton" class="q-py-xs" icon="check" outline color="positive"
              label="Accept Devices" @click="fnFinalFaultySubmit(2)" />
          </div>
          <!--END: table title -->
        </div>
        <!--START: table lead validation -->
        <q-table row-key="name" :filter="filter" :rows="tableData" class="q-py-none" :columns="columns"
          title="Lead Validation" table-class="customTableClass" v-model:pagination="paginationControl">
          <!--START: table body modification -->
          <template #body-cell-deviceType="props">
            <q-td :props="props">{{ props.row.device?.name || props.row.deviceName }}</q-td>
          </template>
          <template #body-cell-serialNumber="props">
            <q-td :props="props">{{ props.row.serialNumber }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-btn flat v-if="props.row.status === true" icon="check" color="positive" />
              <q-btn flat v-else-if="props.row.status === false" icon="clear" color="negative" />
              <q-btn flat color="amber-9" v-else icon="warning" />
            </q-td>
          </template>
          <!-- END: table body modification -->
          <template #top>
            <!--START: table filter,search -->
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Type.."
                label="Search by SO name, Merchant Name, Lead ID"
                class="q-mr-lg q-py-sm"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <!--END: table filter,search -->
          </template>
        </q-table>
      </div>
      <!--END: table lead validation -->
      <!--START: Open showPDOmodal model -->
      <showPDOmodal v-if="showPDOmodal" :propshowPDOmodal="showPDOmodal" :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"></showPDOmodal>
      <!--END: Open showPDOmodal model -->
      <!--START: Open showPDOmodal model -->
      <AggregatorFaultyBulkUploadModal v-if="toggleFaultyBulkUpload" :propBulkUpload="toggleFaultyBulkUpload"
        :propAllDevicestypes="deviceOptions" @closeModel="bulkUploadFaultyDevices"></AggregatorFaultyBulkUploadModal>
      <!--END: Open showPDOmodal model -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import showPDOmodal from "../../components/inventory/AggregatorShowFaultyModal.vue";
import AggregatorFaultyBulkUploadModal from "../../components/inventory/AggregatorFaultyBulkUploadModal.vue";

export default defineComponent({
  name: "allocateDevice",
  components: {
    showPDOmodal,
    AggregatorFaultyBulkUploadModal
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const deviceOptions = ref([]);
    const disableDeviceTypeSelection = ref(true);
    const podNumber = ref("");
    const toggleFaultyBulkUpload = ref(false);
    const filter = ref("");
    const scannerToggleOption = ref(true);
    const showPDOmodal = ref(false);
    const tableData = ref([]);
    
    const formData = reactive({
      device_type: "",
      scannedItems: []
    });
    
    const paginationControl = reactive({
      rowsPerPage: 10,
      page: 1,
      sortBy: null,
      descending: false
    });

    // Computed properties
    const getAggregatorInvenotryAsFaultyData = computed(() => 
      store.getters["AggregatorInventoryCentral/getAggregatorInvenotryAsFaultyData"] || []
    );
    
    const getCreatedActiveDeviceList = computed(() => 
      store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"] || []
    );

    const disabledButton = computed(() => {
      return !formData.scannedItems.some(item => 
        item.deviceSerialNumbers && item.deviceSerialNumbers.length > 0
      );
    });

    // Columns definition
    const columns = [
      {
        name: "deviceName",
        required: true,
        label: "Device Type",
        align: "left",
        field: "deviceName",
        sortable: false
      },
      {
        name: "serialNumber",
        required: true,
        label: "Serial number",
        align: "left",
        field: "serialNumber",
        sortable: false
      },
      {
        name: "status",
        required: true,
        label: "",
        align: "left",
        field: "status",
        sortable: true
      }
    ];

    
    const setupBarcodeScanner = () => {
      if (typeof window !== 'undefined' && window.document) {
        document.addEventListener('keydown', handleBarcodeScan);
      }
    };

    const removeBarcodeScanner = () => {
      if (typeof window !== 'undefined' && window.document) {
        document.removeEventListener('keydown', handleBarcodeScan);
      }
    };

    const handleBarcodeScan = (event) => {
      // Simple barcode scanner implementation
      // For production, use a proper barcode scanning library
      if (event.key === 'Enter' && scannerToggleOption.value === false) {
        // This is a simplified version - in real app, you'd use a proper barcode scanner
        console.log('Barcode scan simulated');
      }
    };

    // Methods
    const AggregatorsDevice = async () => {
      try {
        await store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");
        const cookedArr = getCreatedActiveDeviceList.value.map(item => ({
          value: item,
          label: item.deviceName
        }));
        deviceOptions.value = cookedArr;
      } catch (error) {

        console.error("Error fetching device list:", error);
        deviceOptions.value = [];
      }
    };

    const fnSetDevicesByDeviceId = () => {
      scannerToggleOption.value = false;
      removeBarcodeScanner();
      
      if (!formData.device_type?.id) return;
      
      const predictIfDeviceExist = formData.scannedItems.filter(
        value => value.aggregatorDevice?.id === formData.device_type.id
      );

      if (predictIfDeviceExist.length === 0) {
        formData.scannedItems.unshift({
          aggregatorDevice: {
            name: formData.device_type.deviceName,
            id: formData.device_type.id
          },
          deviceSerialNumbers: []
        });
      }
    };

    const onBarcodeScanned = async (barcode) => {
      if (!formData.device_type?.id) return;
      
      const predictIfDeviceExist = formData.scannedItems.find(
        value => value.aggregatorDevice?.id === formData.device_type.id
      );
      
      if (!predictIfDeviceExist) return;
      
      const finalAssumation = predictIfDeviceExist.deviceSerialNumbers.find(oo => oo === barcode);
      
      if (finalAssumation === undefined) {
        try {
          await store.dispatch("VerifyDevice/AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID", {
            device: formData.device_type.id,
            barcode: barcode
          });
          
          predictIfDeviceExist.deviceSerialNumbers.push(barcode);
          
          const findDeviceSerialNumber = tableData.value.find(oo => 
            oo.serialNumber === barcode && oo.device === formData.device_type.id
          );
          
          if (findDeviceSerialNumber) {
            findDeviceSerialNumber.status = true;
          }
        } catch {

          $q.notify({
            color: "primary",
            position: "bottom",
            message: barcode + " is invalid",
            icon: "info"
          });
        }
      } else {
        $q.notify({
          color: "primary",
          position: "bottom",
          message: barcode + " - already exist in " + predictIfDeviceExist.aggregatorDevice.name,
          icon: "info"
        });
      }
    };

    const openScannerComp = () => {
      if (!formData.device_type) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please select a device type first",
          icon: "warning"
        });
        return;
      }
      
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Start scanning for " + formData.device_type.deviceName,
        icon: "list"
      });
      
      scannerToggleOption.value = true;
      setupBarcodeScanner();
      
      // For testing: simulate a barcode scan
      // setTimeout(() => onBarcodeScanned("TEST123456"), 1000);
    };

    const fnAjaxFaultyInventoryData = async () => {
      if (!podNumber.value.trim()) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please enter a POD number",
          icon: "warning"
        });
        return;
      }
      
      try {
        await store.dispatch("AggregatorInventoryCentral/FETCH_AGGREGATOR_FAULT_INVENTORY_DEVICES_FROM_REGIONAL", 
          podNumber.value.trim()
        );
        
        disableDeviceTypeSelection.value = false;
        
        const cookedArr = getAggregatorInvenotryAsFaultyData.value.map(oo => ({
          serialNumber: oo.serialNumber,
          deviceName: oo.aggregatorDevice?.deviceName || '',
          device: oo.aggregatorDevice?.id || '',
          status: false
        }));
        
        tableData.value = cookedArr;
        
        if (cookedArr.length === 0) {
          $q.notify({
            color: "info",
            position: "bottom",
            message: "No devices found for this POD number",
            icon: "info"
          });
        }
      } catch {

        disableDeviceTypeSelection.value = true;
        tableData.value = [];
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to fetch inventory data",
          icon: "error"
        });
      }
    };

    const bulkUploadFaultyDevices = () => {
      toggleFaultyBulkUpload.value = !toggleFaultyBulkUpload.value;
    };

    const fnFinalFaultySubmit = (action) => {
      if (formData.scannedItems.length === 0 || disabledButton.value) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "No scanned devices to submit",
          icon: "warning"
        });
        return;
      }
      
      const actionText = action === 1 ? "send to repair" : "accept devices";
      
      $q.dialog({
        title: "Confirm",
        message: `Are you sure you want to ${actionText}?`,
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(async () => {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none"
        });
        
        const assumeArr = {
          data: formData.scannedItems.filter(item => 
            item.deviceSerialNumbers && item.deviceSerialNumbers.length > 0
          ),
          action: action
        };
        
        try {
          await store.dispatch("AggregatorInventoryCentral/FEED_AGGREGATOR_FAULTY_FINAL_SUBMIT", assumeArr);
          
          scannerToggleOption.value = false;
          formData.device_type = "";
          formData.scannedItems = [];
          tableData.value = [];
          podNumber.value = "";
          disableDeviceTypeSelection.value = true;
          
          $q.loading.hide();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Devices have been updated successfully",
            icon: "thumb_up"
          });
        } catch {

          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again",
            icon: "thumb_down"
          });
        }
      }).onCancel(() => {
        // User canceled
      });
    };

    const fnAllocateDeviceToRegion = () => {
      showPDOmodal.value = false;
    };

    // Lifecycle hooks
    onMounted(() => {
      AggregatorsDevice();
    });

    onUnmounted(() => {
      removeBarcodeScanner();
    });

    return {
      // State
      deviceOptions,
      disableDeviceTypeSelection,
      podNumber,
      toggleFaultyBulkUpload,
      filter,
      scannerToggleOption,
      showPDOmodal,
      tableData,
      formData,
      paginationControl,
      columns,
      
      // Computed
      disabledButton,
      
      // Methods
      AggregatorsDevice,
      fnSetDevicesByDeviceId,
      onBarcodeScanned,
      openScannerComp,
      fnAjaxFaultyInventoryData,
      bulkUploadFaultyDevices,
      fnFinalFaultySubmit,
      fnAllocateDeviceToRegion
    };
  }
});
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.group {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.customTableClass {
  width: 100%;
}
</style>