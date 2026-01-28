<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 q-title text-weight-regular text-grey-9">Faulty Inventory</div>
        <div class="col-6 text-right">
          <q-btn
            icon="attach_file"
            @click="bulkUploadFaultyDevices"
            outline
            color="dark"
            label="Bulk upload"
          />
        </div>
      </div>

      <!-- POD Input -->
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-6">
          <q-input v-model="podNumber" float-label="Enter POD number" color="grey-9" />
        </div>
        <div class="col-6 text-right">
          <q-btn
            @click="fnAjaxFaultyInventoryData"
            color="light-blue"
            class="q-py-xs"
            label="Submit"
          />
        </div>
      </div>

      <!-- Device Type Select -->
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-6">
          <q-select
            :disable="disableDeviceTypeSelection"
            v-model="formData.device_type"
            :options="deviceOptions"
            label="Select Device Type"
            @update:model-value="fnSetDevicesByDeviceId"
            color="grey-9"
            emit-value
            map-options
          />
        </div>
        <div class="col-6 text-right">
          <q-btn
            v-if="scannerToggleOption"
            :disabled="!formData.device_type || !formData.region"
            @click="openScannerComp"
            color="light-blue"
            class="q-py-xs"
            label="Start scan"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-12 text-right">
          <q-btn
            :disabled="disabledButton"
            class="q-py-xs"
            icon="build"
            outline
            color="amber-9"
            label="Send to repair"
            @click="fnFinalFaultySubmit(1)"
          />
          <q-btn
            :disabled="disabledButton"
            class="q-py-xs"
            icon="check"
            outline
            color="positive"
            label="Accept Devices"
            @click="fnFinalFaultySubmit(2)"
          />
        </div>
      </div>

      <!-- Lead Validation Table -->
      <q-table
        :rows="tableData"
        :columns="columns"
        row-key="serialNumber"
        :filter="filter"
        title="Lead Validation"
        table-class="customTableClass"
        v-model:pagination="paginationControl"
      >
        <template v-slot:top>
          <div class="col-md-5">
            <q-input
              v-model="filter"
              placeholder="Search by SO name, Merchant Name, Lead ID"
              clearable
              color="grey-9"
              outlined
              dense
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>

        <template v-slot:body-cell-deviceType="props">
          {{ props.row.deviceName }}
        </template>
        <template v-slot:body-cell-serialNumber="props">
          {{ props.row.serialNumber }}
        </template>
        <template v-slot:body-cell-status="props">
          <q-btn flat v-if="props.row.status === true" icon="check" color="positive" />
          <q-btn flat v-else-if="props.row.status === false" icon="clear" color="negative" />
          <q-btn flat v-else icon="warning" color="amber-9" />
        </template>
      </q-table>

      <!-- PDO Modal -->
      <showPDOmodal
        v-if="showPDOmodal"
        :propshowPDOmodal="showPDOmodal"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"
      />

      <!-- Bulk Upload Modal -->
      <faultyBulkUploadModal
        v-if="toggleFaultyBulkUpload"
        :propBulkUpload="toggleFaultyBulkUpload"
        :propAllDevicestypes="deviceOptions"
        @closeModel="bulkUploadFaultyDevices"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import showPDOmodal from "../../components/inventory/showFaultymodal.vue";
import faultyBulkUploadModal from "../../components/inventory/faultyBulkUploadModal.vue";
import VueBarcodeScanner from "vue-barcode-scanner";

export default {
  name: "AllocateDevice",
  components: { showPDOmodal, faultyBulkUploadModal },
  setup(_, { root }) {
    const $q = useQuasar();

    const podNumber = ref("");
    const disableDeviceTypeSelection = ref(true);
    const scannerToggleOption = ref(true);
    const toggleFaultyBulkUpload = ref(false);
    const showPDOmodalFlag = ref(false);
    const deviceOptions = ref([]);
    const filter = ref("");
    const tableData = ref([]);
    const formData = reactive({
      device_type: "",
      scannedItems: [],
      region: ""
    });
    const paginationControl = reactive({
      rowsPerPage: 10
    });

    const disabledButton = computed(() => {
      return !formData.scannedItems.some((item) => item.deviceSerialNumbers.length > 0);
    });

    const fnSetDevicesByDeviceId = () => {
      scannerToggleOption.value = true;

      // Remove previous scanner listener
      window.barcodeScanner?.destroy();

      const existingDevice = formData.scannedItems.find(
        (item) => item.device.id === formData.device_type.id
      );

      if (!existingDevice) {
        formData.scannedItems.unshift({
          device: { name: formData.device_type.deviceName, id: formData.device_type.id },
          deviceSerialNumbers: []
        });
      }
    };

    const onBarcodeScanned = (barcode) => {
      const deviceItem = formData.scannedItems.find((item) => item.device.id === formData.device_type.id);
      if (!deviceItem) return;

      if (!deviceItem.deviceSerialNumbers.includes(barcode)) {
        root.$store.dispatch("VerifyDevice/DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID", {
          device: formData.device_type.id,
          barcode
        }).then(() => {
          deviceItem.deviceSerialNumbers.push(barcode);
          const tableRow = tableData.value.find(
            (row) => row.serialNumber === barcode && row.device === formData.device_type.id
          );
          if (tableRow) tableRow.status = true;
        }).catch(() => {
          $q.notify({ color: "primary", position: "bottom", message: `${barcode} is invalid`, icon: "info" });
        });
      } else {
        $q.notify({
          color: "primary",
          position: "bottom",
          message: `${barcode} - already exist in ${deviceItem.device.name}`,
          icon: "info"
        });
      }
    };

    const openScannerComp = () => {
      $q.notify({
        color: "positive",
        position: "bottom",
        message: `Start scanning for ${formData.device_type.deviceName}`,
        icon: "list"
      });
      scannerToggleOption.value = false;

      if (!window.barcodeScanner) {
        window.barcodeScanner = new VueBarcodeScanner(onBarcodeScanned);
      }
    };

    const fnAjaxGetAllDevicesTypesData = () => {
      root.$store.dispatch("InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA")
        .then(() => {
          deviceOptions.value = root.$store.getters.getAllInventoryDevicesTypesData.map((v) => ({
            label: v.deviceName,
            value: v
          }));
        })
        .catch(() => { deviceOptions.value = []; });
    };

    const fnAjaxFaultyInventoryData = () => {
      root.$store.dispatch("InventoryCentral/FETCH_FAULT_INVENTORY_DEVICES_FROM_REGIONAL", podNumber.value)
        .then(() => {
          disableDeviceTypeSelection.value = false;
          tableData.value = root.$store.getters.getInvenotryAsFaultyData.map((oo) => ({
            serialNumber: oo.serialNumber,
            deviceName: oo.device.deviceName,
            device: oo.device.id,
            status: false
          }));
        })
        .catch(() => { disableDeviceTypeSelection.value = true; });
    };

    const bulkUploadFaultyDevices = () => {
      toggleFaultyBulkUpload.value = !toggleFaultyBulkUpload.value;
    };

    const fnFinalFaultySubmit = (action) => {
      $q.dialog({
        title: "Confirm",
        message: `Are you sure want${action === 1 ? " to send to repair" : " accept devices"}?`,
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

        root.$store.dispatch("InventoryCentral/FEED_SAT_FAULTY_FINAL_SUBMIT", {
          data: formData.scannedItems,
          action
        }).then(() => {
          scannerToggleOption.value = false;
          formData.device_type = "";
          formData.scannedItems = [];
          tableData.value = [];
          $q.loading.hide();
          $q.notify({ color: "positive", position: "bottom", message: "Devices has been updated successfully", icon: "thumb_up" });
        }).catch(() => {
          $q.loading.hide();
          $q.notify({ color: "negative", position: "bottom", message: "Please try again", icon: "thumb_down" });
        });
      });
    };

    onMounted(() => {
      fnAjaxGetAllDevicesTypesData();
    });

    onBeforeUnmount(() => {
      window.barcodeScanner?.destroy();
    });

    return {
      podNumber,
      disableDeviceTypeSelection,
      toggleFaultyBulkUpload,
      showPDOmodal: showPDOmodalFlag,
      deviceOptions,
      scannerToggleOption,
      tableData,
      filter,
      formData,
      columns: [
        { name: "deviceName", required: true, label: "Device Type", align: "left", field: "deviceName", sortable: false },
        { name: "serialNumber", required: true, label: "Serial number", align: "left", field: "serialNumber", sortable: false },
        { name: "status", required: true, label: "", align: "left", field: "status", sortable: true }
      ],
      paginationControl,
      disabledButton,
      fnSetDevicesByDeviceId,
      fnAjaxFaultyInventoryData,
      openScannerComp,
      bulkUploadFaultyDevices,
      fnFinalFaultySubmit
    };
  }
};
</script>
