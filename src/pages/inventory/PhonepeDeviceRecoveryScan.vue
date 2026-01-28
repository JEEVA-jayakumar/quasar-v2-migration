<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-8 q-title text-weight-regular text-grey-9">
          Aggregator Add New Device Recovery - Scan & Upload
        </div>
      </div>

      <!-- Controls -->
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-2">
          <q-select
            v-model="formData.device.id"
            label="Select Device Type"
            color="grey-9"
            :options="deviceOptions"
            emit-value
            map-options
            @update:model-value="fnDisableDeviceTypeSelection"
          />
        </div>

        <div class="col-12 col-lg-4 group text-right">
          <q-btn
            v-if="scanningActive"
            :disabled="!formData.device.id"
            color="primary"
            label="Start scan"
            @click="fnStartScanner"
          />
          <q-btn
            v-if="tempTableData.length > 0"
            class="common-btn q-py-xs"
            label="Upload"
            @click="finalSubmit"
          />
          <q-btn
            v-else
            class="common-btn q-py-xs"
            label="Upload"
            disable
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        class="customTableClass shadow-0"
        :rows="tempTableData"
        :columns="columnData"
        row-key="deviceSerialNumbers"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :loading="tableAjaxLoading"
      >
        <template v-slot:top>
          <div class="col-md-5">
            <q-input
              v-model="filterSearch"
              clearable
              dense
              type="search"
              label="Search"
              color="grey-9"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              label="Remove"
              icon="close"
              color="red-6"
              size="sm"
              @click="removeScannedItems(props.row.deviceSerialNumbers)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
/* ---------------- Imports ---------------- */
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

/* ---------------- Setup ---------------- */
const store = useStore();
const router = useRouter();
const $q = useQuasar();
const { proxy } = getCurrentInstance();

/* ---------------- State ---------------- */
const filterSearch = ref("");
const scanningActive = ref(true);
const tableAjaxLoading = ref(false);

const deviceOptions = ref([]);
const tempTableData = ref([]);

const paginationControl = ref({
  rowsPerPage: 10
});

const formData = reactive({
  device: {
    id: "",
    isDisable: false
  },
  deviceSerialNumbers: []
});

/* ---------------- Table Columns ---------------- */
const columnData = [
  {
    name: "deviceSerialNumbers",
    label: "Serial Number",
    field: "deviceSerialNumbers",
    align: "left",
    sortable: true
  },
  {
    name: "action",
    label: "",
    field: "action",
    align: "left"
  }
];

/* ---------------- Lifecycle ---------------- */
onMounted(async () => {
  await loadDeviceTypes();
});

/* ---------------- Methods ---------------- */
async function loadDeviceTypes() {
  await store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");
  deviceOptions.value = store.getters[
    "superAdminAggregatorsDevice/getCreatedActiveDeviceList"
  ].map(item => ({
    label: item.deviceName,
    value: item.id
  }));
}

function fnDisableDeviceTypeSelection() {
  if (!scanningActive.value) {
    scanningActive.value = true;
  }
  proxy.$barcodeScanner?.destroy();
}

function fnStartScanner() {
  proxy.$barcodeScanner.init(onBarcodeScanned);
  scanningActive.value = false;
}

async function onBarcodeScanned(barcode) {
  const exists = tempTableData.value.some(
    item => item.deviceSerialNumbers === barcode
  );

  if (exists) {
    notify(`${barcode} - device already scanned`);
    return;
  }

  try {
    await store.dispatch(
      "VerifyDevice/AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY",
      {
        device: formData.device.id,
        barcode
      }
    );

    tempTableData.value.push({ deviceSerialNumbers: barcode });
  } catch {
    notify(`${barcode} - device already available in the inventory`);
  }
}

function removeScannedItems(serial) {
  tempTableData.value = tempTableData.value.filter(
    item => item.deviceSerialNumbers !== serial
  );

  if (tempTableData.value.length === 0) {
    scanningActive.value = true;
  }
}

async function finalSubmit() {
  formData.deviceSerialNumbers = tempTableData.value.map(
    item => item.deviceSerialNumbers
  );

  const payload = {
    deviceId: formData.device.id,
    request: {
      deviceSerialNumbers: formData.deviceSerialNumbers
    }
  };

  try {
    await store.dispatch(
      "InventoryScanAddDevice/FEED_PHONE_PE_DEVICE_SCAN_BY_ID_DATA",
      payload
    );

    $q.notify({
      type: "positive",
      message: "Devices are added successfully!"
    });

    router.push("/inventory/PhonepeInventory");
  } catch {
    $q.notify({
      type: "negative",
      message: "Error in updating devices!"
    });
  }
}

function notify(message) {
  $q.notify({
    color: "primary",
    position: "bottom",
    message,
    icon: "info"
  });
}
</script>
