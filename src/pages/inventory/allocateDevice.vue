<template>
  <q-page>
    <!-- content -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <q-radio
        class="radio"
        v-for="(item, index) in formData.flagOptions"
        :key="index"
        color="grey-9"
        v-model="formData.flag"
        :val="item.value"
        :label="item.label"
      />
    </div>

    <div v-if="formData.flag == 1">
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!-- START: table title -->
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
          Bijlipay Allocate Device
        </div>
        <div class="col-md-12 col-md-6 q-pt-md group" align="right">
          <q-btn
            @click="$router.push('/inventory/central')"
            outline
            label="Cancel Allocation"
            color="negative"
          />
        </div>
        <!-- END: table title -->
      </div>

      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-4">
          <q-select
            :disable="formData.device_type != ''"
            :class="[formData.device_type != '' ? 'no-pointer-events' : '']"
            v-model="formData.region"
            label="Select Region"
            emit-value
            map-options
            color="grey-9"
            :options="regionOptions"
          />
        </div>
        <div class="col-md-4">
          <q-select
            clearable
            :disable="formData.region == ''"
            @clear="fnClearingDeviceTypeSelection"
            @update:model-value="fnSetDevicesByDeviceId"
            v-model="formData.device_type"
            label="Select Device Type"
            emit-value
            map-options
            color="grey-9"
            :options="deviceOptions"
          />
        </div>
        <div class="col-12 col-lg-4 group" align="right">
          <q-btn
            :disable="formData.device_type == '' || formData.region == ''"
            @click="openScannerComp"
            v-if="scannerToggleOption"
            color="light-blue"
            class="q-py-xs"
            label="Start scan"
          />
          <q-btn
            icon="shopping_cart"
            outline
            class="q-py-xs"
            label="Add to cart"
            @click="fnAllocateDeviceToRegion"
          />
        </div>
        <!-- END: table title -->
      </div>

      <div class="row text-weight-regular text-grey-9">
        <div class="col group" v-for="(item, index) in formData.scannedItems" :key="index">
          <q-card
            class="shadow-4"
            :style="'border:' + [formData.device_type?.id == item.device.id ? '2px solid #61116a' : 'unset']"
          >
            <q-list
              highlight
              separator
              class="q-pa-none"
              :class="[formData.device_type?.id == item.device.id ? 'activeDeviceTab' : '']"
            >
              <q-item-section style="border-bottom: 1px solid #ccc;">
                <q-icon
                  :style="'color:' + [formData.device_type?.id == item.device.id ? '#fff' : '#202c3f']"
                  name="fas fa-tablet-alt"
                />
                {{ item.device.deviceName }}
              </q-item-section>
              <q-scroll-area
                style="height:400px"
                :thumb-style="{
                  right: '4px',
                  borderRadius: '5px',
                  background: 'grey',
                  width: '5px',
                  opacity: 0.5
                }"
                :delay="1500"
              >
                <div v-if="item.deviceSerialNumbers.length > 0">
                  <q-item
                    v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                    :key="subIndex"
                  >
                    <q-item-section class="q-body-1">{{ subItem }}</q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        size="sm"
                        color="negative"
                        icon="clear"
                        @click="fnRemoveScannedItems(index, subIndex)"
                      />
                    </q-item-section>
                  </q-item>
                </div>
                <div v-else>
                  <q-item>
                    <q-item-section class="q-body-1">No data to display</q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        size="sm"
                        color="negative"
                        @click="fnRemoveDeviceTypeFromList(index)"
                        icon="clear"
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </q-scroll-area>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>

    <div v-if="formData.flag == 2">
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9 align1">
          Bijlipay Allocate QR
        </div>
      </div>

      <div class="row q-px-md q-py-md">
        <div class="col-md-3">
          <div class="row">
            <div v-if="formData.count != null" class="row">
              <q-card class="card" align="center" color="purple-9">
                <div>
                  <big class="alignbtn">
                    {{ remainingCount === '' ? 0 : remainingCount }}
                  </big>
                </div>
                <div>
                  <label></label>
                </div>
                <p>{{ label }}</p>
              </q-card>
            </div>
            <div v-else class="row group">
              <div>
                <q-banner color="purple-9" icon="info">
                  No data available to display
                </q-banner>
              </div>
            </div>
          </div>

          <div class="row q-mt-md">
            <label class="qrlabel"><b>Select Bank</b></label>
            <div class="col-md-12">
              <q-select
                class="sizeBank"
                clearable
                label="Select Bank"
                @update:model-value="showChannel"
                v-model="formData.bank"
                :error="$v.formData.bank.$error"
                color="grey-9"
                :options="bankListOptions"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="row q-mt-md">
            <label class="qrlabel"><b>Select Region</b></label>
            <div class="col-md-12">
              <q-select
                class="sizeRegion"
                clearable
                :disable="!formData.bank"
                label="Select Region"
                v-model="formData.regionList"
                :error="$v.formData.regionList.$error"
                color="grey-9"
                :options="RegionOptionIcici"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="row q-mt-md">
            <label class="qrlabel" for="input-id"><b>Enter No Of QR</b></label>
            <div class="col-md-12">
              <q-input
                class="sizeQR"
                type="number"
                :disable="!formData.regionList"
                label="Enter no of QR"
                min="1"
                v-model.number="formData.count"
                :error="$v.formData.count.$error"
                @blur="$v.formData.count.$touch"
                color="grey-9"
              />
            </div>
          </div>

          <div class="row q-mt-md">
            <label class="qrlabel" for="input-id"><b>Enter POD</b></label>
            <div class="col-md-12">
              <q-input
                class="alignPOD"
                disable
                label="Enter POD"
                v-model="formData.podNumber"
                :error="$v.formData.podNumber.$error"
                @blur="$v.formData.podNumber.$touch"
                color="grey-9"
              />
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col-md-12" align="right">
              <q-btn
                color="purple-9"
                :disable="!formData.count"
                label="Assign"
                @click="fnAssignsubmit()"
              />
            </div>
          </div>
        </div>

        <div class="col-md-9 q-pl-md">
          <q-tabs v-model="activeTab" class="shadow-1" dense>
            <q-tab name="tab-1" label="Pending QR" />
            <q-tab name="tab-2" label="Approved QR" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="tab-1">
              <div>
                <q-input
                  class="col-5 search"
                  clearable
                  color="grey-9"
                  placeholder="Type.."
                  v-model="filter"
                  label="Search By POD Number"
                  filled
                  dense
                />
              </div>
              <q-table
                table-class="customTableClass"
                :rows="tableData"
                :columns="columns"
                v-model:pagination="paginationControl2"
                :filter="filter"
                row-key="id"
                :loading="toggleAjaxLoadFilter1"
                :rows-per-page-options="[5, 10, 15, 20]"
                @request="ajaxLoadAllRegionList"
              >
                <template #body-cell-createdAt="props">
                  <q-td :props="props">
                    {{ props.row.createdAt == null ? 'NA' : formatDate(props.row.createdAt) }}
                  </q-td>
                </template>
                <template #body-cell-podNumber="props">
                  <q-td :props="props">
                    {{ props.row.podNumber == null ? 'NA' : props.row.podNumber }}
                  </q-td>
                </template>
                <template #body-cell-count="props">
                  <q-td :props="props">
                    {{ props.row.requestCount == null ? 'NA' : props.row.requestCount }}
                  </q-td>
                </template>
                <template #body-cell-region="props">
                  <q-td :props="props">
                    {{ props.row.region?.regionAreaName == null ? 'NA' : props.row.region.regionAreaName }}
                  </q-td>
                </template>
                <template #body-cell-batchId="props">
                  <q-td :props="props">
                    {{ props.row.batch?.batchId == null ? 'NA' : props.row.batch.batchId }}
                  </q-td>
                </template>
                <template #body-cell-Action="props">
                  <q-td :props="props">
                    <q-btn
                      no-caps
                      icon="edit"
                      color="primary"
                      @click="editCount(props.row)"
                      size="xs"
                      round
                    />
                  </q-td>
                </template>
                <template #body-cell-Action2="props">
                  <q-td :props="props">
                    <div v-if="props.row.updated == true">
                      <q-btn no-caps icon="priority_high" color="orange" size="xs" round />
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="tab-2">
              <q-input
                class="col-5 search"
                clearable
                color="grey-9"
                placeholder="Type.."
                v-model="filter1"
                label="Search By POD Number"
                filled
                dense
              />
              <q-table
                table-class="customTableClass"
                :rows="tableData1"
                :columns="columns1"
                v-model:pagination="paginationControl1"
                :filter="filter1"
                row-key="id"
                :loading="toggleAjaxLoadFilter1"
                :rows-per-page-options="[5, 10, 15, 20]"
                @request="ajaxLoadAllRegionList1"
              >
                <template #body-cell-podNumber="props">
                  <q-td :props="props">
                    {{ props.row.podNumber == null ? 'NA' : props.row.podNumber }}
                  </q-td>
                </template>
                <template #body-cell-count="props">
                  <q-td :props="props">
                    {{ props.row.requestCount == null ? 'NA' : props.row.requestCount }}
                  </q-td>
                </template>
                <template #body-cell-region="props">
                  <q-td :props="props">
                    {{ props.row.region?.regionAreaName == null ? 'NA' : props.row.region.regionAreaName }}
                  </q-td>
                </template>
                <template #body-cell-batchId="props">
                  <q-td :props="props">
                    {{ props.row.batch?.batchId == null ? 'NA' : props.row.batch.batchId }}
                  </q-td>
                </template>
                <template #body-cell-qrBank="props">
                  <q-td :props="props">
                    {{ props.row.qrBank?.name == null ? 'NA' : props.row.qrBank.name }}
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <!-- START: Open showPDOmodal modal -->
    <ShowPDOmodalComponent
      v-if="showPDOmodal"
      :showPDOmodal="showPDOmodal"
      :propAllScannedItemArr="formData"
      @closeModel="fnAllocateDeviceToRegion"
    />

    <EditCountModalComponent
      v-if="editCountModal"
      :propseditCountModal="editCountModal"
      :propsAllPendingQrItem="Data"
      @closeModel="editCount"
    />
    <!-- END: Open showPDOmodal modal -->
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import { useStore } from 'vuex';
import { minValue, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import dayjs from 'dayjs';
import ShowPDOmodalComponent from '../../components/inventory/showPDOmodal.vue';
import EditCountModalComponent from '../../components/inventory/editCountModal.vue';

const $q = useQuasar();
const store = useStore();

// Refs
const scannerToggleOption = ref(true);
const showPDOmodal = ref(false);
const editCountModal = ref(false);
const tableData = ref([]);
const tableData1 = ref([]);
const regionOptions = ref([]);
const deviceOptions = ref([]);
const filter = ref('');
const filter1 = ref('');
const activeTab = ref('tab-1');
const toggleAjaxLoadFilter1 = ref(false);
const Data = ref(null);
const RegionOptionIcici = ref([]);
const inventoryQrCount = ref([]);
const remainingCount = ref([]);
const label = ref('');
const bankListOptions = ref([]);

// Pagination
const paginationControl2 = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'podNumber',
  descending: false,
  rowsPerPage: 5
});

const paginationControl1 = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'podNumber',
  descending: false,
  rowsPerPage: 5
});

// Form Data
const formData = reactive({
  region: '',
  device_type: '',
  count: null,
  Batch: '',
  podNumber: '',
  regionList: '',
  bank: '',
  scannedItems: [],
  flag: 1,
  flagOptions: [
    {
      label: 'Device',
      value: 1
    },
    {
      label: 'QR',
      value: 2
    }
  ]
});

// Validation
const rules = {
  formData: {
    bank: { required },
    regionList: { required },
    count: { required, minValue: minValue(1) },
    podNumber: { required }
  }
};

const $v = useVuelidate(rules, { formData });

// Table Columns
const columns = [
  {
    name: 'createdAt',
    required: true,
    label: 'Created At',
    align: 'left',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'podNumber',
    required: true,
    label: 'Pod Number',
    align: 'left',
    field: 'podNumber',
    sortable: true
  },
  {
    name: 'count',
    required: true,
    label: 'Assigned Count',
    align: 'left',
    field: 'requestCount',
    sortable: false
  },
  {
    name: 'receivedCount',
    required: true,
    label: 'Received Count',
    align: 'left',
    field: row => row.receivedCount == 0 ? 'Not Yet Received' : row.receivedCount,
    sortable: false
  },
  {
    name: 'region',
    required: true,
    label: 'Region',
    align: 'left',
    field: row => row.region?.regionAreaName || 'NA',
    sortable: false
  },
  {
    name: 'qrBank',
    required: true,
    label: 'Bank Name',
    align: 'left',
    field: row => row.qrBank?.name || 'NA',
    sortable: false
  },
  {
    name: 'Action',
    required: true,
    label: 'Action',
    align: 'left',
    sortable: false
  },
  {
    name: 'Action2',
    required: true,
    label: 'Updated',
    align: 'left',
    sortable: false
  }
];

const columns1 = [
  {
    name: 'podNumber',
    required: true,
    label: 'Pod Number',
    align: 'left',
    field: 'podNumber',
    sortable: true
  },
  {
    name: 'count',
    required: true,
    label: 'Count',
    align: 'left',
    field: 'requestCount',
    sortable: false
  },
  {
    name: 'region',
    required: true,
    label: 'Region',
    align: 'left',
    field: row => row.region?.regionAreaName || 'NA',
    sortable: false
  },
  {
    name: 'qrBank',
    required: true,
    label: 'Bank Name',
    align: 'left',
    field: row => row.qrBank?.name || 'NA',
    sortable: false
  }
];

// Computed
const getAllInventoryDevicesTypesData = computed(() => 
  store.getters['InventoryCentral/getAllInventoryDevicesTypesData'] || []
);

const getAllRegionsData = computed(() => 
  store.getters['InventoryCentral/getAllRegionsData'] || []
);

const getAllRegionList = computed(() => 
  store.getters['generateQR/getAllRegionList'] || []
);

const getAllBankList = computed(() => 
  store.getters['generateQR/getAllBankList'] || []
);

const getStaicQrInventoryCount = computed(() => 
  store.getters['iciciStaticQr/getStaicQrInventoryCount'] || []
);

// Methods
const formatDate = (date) => {
  return dayjs(date).format('Do MMM Y');
};

const fnAjaxGetAllDevicesTypesData = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA');
    deviceOptions.value = getAllInventoryDevicesTypesData.value.map(value => ({
      label: value.deviceName,
      value: value,
      id: value.id
    }));
  } catch (error) {

    console.error('Error fetching device types:', error);
    deviceOptions.value = [];
  }
};

const fnAjaxGetAllRegionsData = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA');
    regionOptions.value = getAllRegionsData.value.map(value => ({
      label: value.regionAreaName,
      value: value.id
    }));
  } catch (error) {

    console.error('Error fetching regions:', error);
    regionOptions.value = [];
  }
};

const fnAjaxGetAllRegionList = async () => {
  try {
    await store.dispatch('generateQR/FETCH_REGION_LIST');
    const regions = getAllRegionList.value?.data?.data || [];
    RegionOptionIcici.value = regions.map(value => ({
      label: value.regionAreaName,
      value: value.id
    }));
  } catch (error) {

    console.error('Error fetching region list:', error);
    RegionOptionIcici.value = [];
  }
};

const fnAjaxGetAllBankList = async () => {
  try {
    await store.dispatch('generateQR/FETCH_BANK_LIST');
    const banks = getAllBankList.value?.data?.data || [];
    bankListOptions.value = banks.map(value => ({
      label: value.name,
      value: value.id
    }));
  } catch (error) {

    console.error('Error fetching bank list:', error);
    bankListOptions.value = [];
  }
};

const inventoryCount = async () => {
  try {
    await store.dispatch('iciciStaticQr/FETCH_STATIC_QR_INVENTORY_COUNT');
    inventoryQrCount.value = getStaicQrInventoryCount.value;
  } catch (error) {

    console.error('Error fetching inventory count:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to fetch inventory count',
      icon: 'error'
    });
  }
};

const showChannel = (bankId) => {
  if (inventoryQrCount.value.length > 0) {
    const bank = inventoryQrCount.value.find(obj => obj.staticQrBank?.id === bankId);
    if (bank) {
      remainingCount.value = bank.count;
      label.value = bank.staticQrBank?.name || '';
    } else {
      remainingCount.value = 0;
      label.value = '';
    }
  } else {
    remainingCount.value = 0;
    label.value = '';
  }
};

const podGeneration = () => {
  const name = 'REG';
  const d = new Date();
  let number = d.getTime();
  let finalValue = name.concat(number);
  formData.podNumber = finalValue;
};

const fnAssignsubmit = async () => {
  const validation = await $v.value.formData.$validate();
  
  if (!validation) {
    $q.notify('Please review fields again.');
    return;
  }

  const request = {
    staticQrBank: {
      id: formData.bank
    },
    region: {
      id: formData.regionList
    },
    requestedCount: formData.count,
    podNumber: formData.podNumber
  };

  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: 'purple-9',
    message: 'Processing...'
  });

  try {
    await store.dispatch('generateQR/ASSIGN_REGION', request);
    
    await ajaxLoadAllRegionList({
      pagination: paginationControl2.value
    });
    
    await inventoryCount();
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Assigned!',
      icon: 'thumb_up'
    });
    
    // Reset form
    formData.bank = '';
    formData.regionList = '';
    formData.count = null;
    formData.podNumber = '';
    remainingCount.value = '';
    label.value = '';
    
    podGeneration();
  } catch {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'No changes made!',
      icon: 'thumb_down'
    });
  } finally {
    $q.loading.hide();
  }
};

const ajaxLoadAllRegionList = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: 'purple-9',
    message: 'Fetching data...'
  });

  try {
    const response = await store.dispatch('generateQR/FETCH_REGION_BASED_QR_ALLOCATED_LIST', { pagination, filter });
    
    paginationControl2.value = {
      ...paginationControl2.value,
      rowsNumber: response.totalElements,
      page: response.number + 1
    };
    
    tableData.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl2.value.sortBy = response.sort[0].property;
      paginationControl2.value.descending = !response.sort[0].ascending;
    }
  } catch (error) {

    console.error('Error loading region list:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load data'
    });
  } finally {
    $q.loading.hide();
  }
};

const ajaxLoadAllRegionList1 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: 'purple-9',
    message: 'Fetching data...'
  });

  try {
    const response = await store.dispatch('generateQR/FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST', { pagination, filter });
    
    paginationControl1.value = {
      ...paginationControl1.value,
      rowsNumber: response.totalElements,
      page: response.number + 1
    };
    
    tableData1.value = response.content || [];
    
    if (response.sort && response.sort.length > 0) {
      paginationControl1.value.sortBy = response.sort[0].property;
      paginationControl1.value.descending = !response.sort[0].ascending;
    }
  } catch (error) {

    console.error('Error loading approved region list:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load data'
    });
  } finally {
    $q.loading.hide();
  }
};

const fnSetDevicesByDeviceId = () => {
  scannerToggleOption.value = true;
  
  if (!formData.device_type) {
    return;
  }

  const deviceId = formData.device_type.id;
  const predictIfDeviceExist = formData.scannedItems.find(value => 
    value.device.id === deviceId
  );

  if (!predictIfDeviceExist) {
    formData.scannedItems.unshift({
      device: {
        deviceName: formData.device_type.deviceName,
        id: deviceId
      },
      deviceSerialNumbers: []
    });
  }
};


const openScannerComp = () => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.mediaDevices) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: `Start scanning for ${formData.device_type?.deviceName || 'device'}`,
      icon: 'qr_code_scanner'
    });
    
    scannerToggleOption.value = false;
    
    // Note: For barcode scanning, you would need to implement a scanner
    // This could be a custom component or using a library like vue-qrcode-reader
    // The original vue-barcode-scanner plugin might need replacement
    console.log('Scanner functionality needs implementation');
  } else {
    $q.notify({
      color: 'warning',
      message: 'Camera access not available'
    });
  }
};

const fnRemoveScannedItems = (index, subIndex) => {
  if (formData.scannedItems[index]) {
    formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
  }
};

const fnAllocateDeviceToRegion = () => {
  showPDOmodal.value = !showPDOmodal.value;
};

const fnRemoveDeviceTypeFromList = (index) => {
  formData.scannedItems.splice(index, 1);
};

const fnClearingDeviceTypeSelection = () => {
  formData.device_type = '';
  formData.scannedItems = [];
};

const editCount = (rowDetails) => {
  editCountModal.value = !editCountModal.value;
  if (rowDetails) {
    Data.value = rowDetails;
  }
  if (!editCountModal.value) {
    ajaxLoadAllRegionList({
      pagination: paginationControl2.value
    });
  }
};

// Lifecycle Hooks
onMounted(() => {
  fnAjaxGetAllDevicesTypesData();
  fnAjaxGetAllRegionsData();
  fnAjaxGetAllBankList();
  fnAjaxGetAllRegionList();
  inventoryCount();
  podGeneration();
  
  ajaxLoadAllRegionList({
    pagination: paginationControl2.value,
    filter: filter.value
  });
  
  ajaxLoadAllRegionList1({
    pagination: paginationControl1.value,
    filter: filter1.value
  });
});

onUnmounted(() => {
  // Cleanup if needed
});

// Watchers
watch(filter, (newValue) => {
  ajaxLoadAllRegionList({
    pagination: paginationControl2.value,
    filter: newValue
  });
});

watch(filter1, (newValue) => {
  ajaxLoadAllRegionList1({
    pagination: paginationControl1.value,
    filter: newValue
  });
});
</script>

<style scoped>
.activeDeviceTab .q-item-section {
  border-bottom: 1px solid rgb(204, 204, 204);
  background: #61116a;
  color: #fff;
}

.qrlabel {
  padding: 8px 0;
  display: block;
}

.card {
  padding: 12px;
  width: 180px;
  border-radius: 12px;
  margin-top: 10px;
}

.sizeBank,
.sizeRegion {
  width: 100%;
  max-width: 300px;
}

.sizeQR,
.alignPOD {
  width: 100%;
  max-width: 300px;
}

.alignbtn {
  font-size: 2rem;
}

.radio {
  padding: 5px;
  margin-right: 15px;
}

.align1 {
  margin-left: 10px;
  margin-top: 10px;
}

.search {
  width: 100%;
  max-width: 300px;
  margin-bottom: 16px;
}

.group {
  margin-bottom: 16px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.customTableClass {
  width: 100%;
}

@media (max-width: 768px) {
  .col-group {
    margin-bottom: 16px;
  }
  
  .card {
    width: 100%;
  }
  
  .search {
    max-width: 100%;
  }
}
</style>