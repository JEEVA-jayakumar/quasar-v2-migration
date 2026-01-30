<template>
  <q-page>
    <div>
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
          Bijlipay Allocate to Reseller
        </div>
        <div class="col-6 col-sm-8 col-md-4" align="right">
          <!-- Optional right-side content -->
        </div>
      </div>

      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-4">
          <q-select
            :disable="formData.device_type != ''"
            :class="[formData.device_type != '' ? 'no-pointer-events' : '']"
            v-model="formData.region"
            label="Select Region"
            color="grey-9"
            :options="regionOptions"
            @update:model-value="regionBasedSO"
            emit-value
            map-options
            outlined
            dense
          />
        </div>
        <div class="col-md-3">
          <q-select
            v-model="formData.resellar"
            label="Select Reseller"
            color="grey-9"
            :options="resellarOptions"
            emit-value
            map-options
            outlined
            dense
          />
        </div>
        <div class="col-md-4">
          <q-select
            clearable
            :disable="!formData.region"
            @clear="fnClearingDeviceTypeSelection"
            @update:model-value="fnSetDevicesByDeviceId"
            v-model="formData.device_type"
            label="Select Device Type"
            color="grey-9"
            :options="deviceOptions"
            emit-value
            map-options
            outlined
            dense
          />
        </div>

        <div class="col-12 col-lg-4 group q-mt-md" align="right">
          <q-btn
            :disable="!formData.device_type || !formData.region"
            @click="openScannerComp"
            v-if="scannerToggleOption"
            color="light-blue"
            class="q-py-xs q-mr-sm"
            label="Start scan"
          />
          <q-btn
            icon="shopping_cart"
            outline
            class="q-py-xs"
            label="Add to cart"
            @click="fnAllocateDeviceToResellar"
          />
        </div>
      </div>

      <div class="row text-weight-regular text-grey-9 q-col-gutter-md">
        <div class="col group" v-for="(item, index) in formData.scannedItems" :key="index">
          <q-card
            class="shadow-4"
            :style="'border:' + (formData.device_type?.id == item.device.id ? '2px solid #61116a' : 'unset')"
          >
            <q-list
              highlight
              separator
              class="q-pa-none"
              :class="[formData.device_type?.id == item.device.id ? 'activeDeviceTab' : '']"
            >
              <q-item-section class="q-pa-sm" style="border-bottom: 1px solid #ccc;">
                <div class="row items-center">
                  <q-icon
                    :style="'color:' + (formData.device_type?.id == item.device.id ? '#fff' : '#202c3f')"
                    name="fas fa-tablet-alt"
                    class="q-mr-sm"
                  />
                  <span>{{ item.device.deviceName }}</span>
                </div>
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
                    class="text-light-blue"
                  >
                    <q-item-section class="text-body1">{{ subItem }}</q-item-section>
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
                    <q-item-section class="text-body1">No data to display</q-item-section>
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

      <!-- Show PDO Modal -->
      <showPDORegionBasedSellar
        v-if="showPDORegionBasedSellar"
        :propshowRegionBasedResellar="showPDORegionBasedSellar"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToResellar"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

const $q = useQuasar();
const store = useStore();

// Refs
const scannerToggleOption = ref(true);
const showPDORegionBasedSellar = ref(false);
const regionOptions = ref([]);
const deviceOptions = ref([]);
const resellarOptions = ref([]);
const regionBasedSo = ref([]);

// Form Data
const formData = reactive({
  region: "",
  device_type: null,
  resellar: "",
  scannedItems: []
});


// Computed
const getAllInventoryDevicesTypesData = computed(() => 
  store.getters['InventoryCentral/getAllInventoryDevicesTypesData'] || []
);

const getAllRegionsData = computed(() => 
  store.getters['InventoryCentral/getAllRegionsData'] || []
);

const getRegionBasedSO = computed(() => 
  store.getters['InventoryCentral/getRegionBasedSO'] || []
);

const getRegionBasedResellar = computed(() => 
  store.getters['InventoryCentral/getRegionBasedResellar'] || []
);

// Methods
const fnSetDevicesByDeviceId = () => {
  scannerToggleOption.value = true;
  
  if (!formData.device_type) {
    return;
  }

  const deviceId = formData.device_type.id;
  const deviceName = formData.device_type.deviceName;
  
  const predictIfDeviceExist = formData.scannedItems.find(
    value => value.device.id === deviceId
  );

  if (!predictIfDeviceExist) {
    formData.scannedItems.unshift({
      device: {
        deviceName: deviceName,
        id: deviceId
      },
      deviceSerialNumbers: []
    });
  }
};



const openScannerComp = () => {
  if (!formData.device_type) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Please select a device type first',
      icon: 'warning'
    });
    return;
  }

  $q.notify({
    color: 'positive',
    position: 'bottom',
    message: `Start scanning for ${formData.device_type.deviceName}`,
    icon: 'qr_code_scanner'
  });

  scannerToggleOption.value = false;
  
  // Note: For Vue 3, you'll need to use a different barcode scanner library
  // This is a placeholder for scanner implementation
  console.log('Scanner functionality needs Vue 3 compatible implementation');
  
  // Example: You might use a custom scanner component or library like:
  // - vue3-qrcode-reader for QR codes
  // - Web Barcode Detection API for modern browsers
  // - A custom implementation with getUserMedia
};

const fnRemoveScannedItems = (index, subIndex) => {
  if (formData.scannedItems[index]) {
    formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
  }
};

const fnAllocateDeviceToResellar = () => {
  if (!formData.resellar) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Please select a reseller',
      icon: 'warning'
    });
    return;
  }

  if (formData.scannedItems.length === 0) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Please scan some devices first',
      icon: 'warning'
    });
    return;
  }

  showPDORegionBasedSellar.value = !showPDORegionBasedSellar.value;
};

const fnAjaxGetAllDevicesTypes = async () => {
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
    $q.notify({
      color: 'negative',
      message: 'Failed to load device types'
    });
  }
};

const fnAjaxGetAllDevicesTypesData = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_REGION_BASED_RESELLAR');
    
    resellarOptions.value = getRegionBasedResellar.value.map(value => ({
      label: value.user?.name || 'Unknown',
      value: value.user?.id,
      id: value.user?.id
    }));
  } catch (error) {

    console.error('Error fetching resellers:', error);
    resellarOptions.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load resellers'
    });
  }
};

const regionBasedSO = async () => {
  if (!formData.region) {
    regionBasedSo.value = [];
    return;
  }

  try {
    await store.dispatch('InventoryCentral/FETCH_REGION_BASED_SO', formData.region);
    
    regionBasedSo.value = getRegionBasedSO.value.map(value => ({
      label: value.name || 'Unknown',
      value: value.id,
      id: value.id
    }));
  } catch (error) {

    console.error('Error fetching region-based SO:', error);
    regionBasedSo.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load SOs for this region'
    });
  }
};

const fnAjaxGetAllRegionsData = async () => {
  try {
    await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA');
    
    regionOptions.value = getAllRegionsData.value.map(value => ({
      label: value.regionAreaName,
      value: value.id,
      id: value.id
    }));
  } catch (error) {

    console.error('Error fetching regions:', error);
    regionOptions.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load regions'
    });
  }
};

const fnRemoveDeviceTypeFromList = (index) => {
  if (formData.scannedItems[index]) {
    formData.scannedItems.splice(index, 1);
  }
};

const fnClearingDeviceTypeSelection = () => {
  formData.device_type = null;
  formData.scannedItems = [];
};

// Lifecycle
onMounted(() => {
  fnAjaxGetAllDevicesTypes();
  fnAjaxGetAllDevicesTypesData();
  fnAjaxGetAllRegionsData();
  
  // Initialize scanner if needed
  // Note: Vue 3 may require a different scanner approach
});

onUnmounted(() => {
  // Clean up scanner if needed
});
</script>

<style scoped>
.activeDeviceTab .q-item-section {
  border-bottom: 1px solid rgb(204, 204, 204);
  background: #61116a;
  color: #fff;
  border-radius: 4px 4px 0 0;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-body1 {
  font-size: 1rem;
}

.q-col-gutter-md > * {
  padding: 8px;
}

.shadow-4 {
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
}

.no-pointer-events {
  pointer-events: none;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .col-md-4, .col-md-3 {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .col-12.col-lg-4 {
    width: 100%;
    text-align: center;
  }
  
  .group {
    margin-bottom: 16px;
  }
  
  .q-title {
    font-size: 1.1rem;
  }
}
</style>