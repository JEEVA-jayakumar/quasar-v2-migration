<template>
  <q-page>
    <!-- Header -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
        Assign SO to SO
      </div>
    </div>

    <!-- Filters / Actions -->
    <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col-md-3">
        <q-select
          v-model="formData.so"
          :options="assignToOptions"
          filter
          clearable
          float-label="Select SO"
          @update:model-value="fnSelectSO"
        />
      </div>

      <div class="col-12 col-lg-4 text-right">
        <q-btn
          v-if="scannerToggleOption"
          :disabled="!formData.so"
          color="light-blue"
          class="q-py-xs"
          label="Start scan"
          @click="openScannerComp"
        />
        <q-btn
          :disabled="!formData.so"
          icon="shopping_cart"
          outline
          class="q-py-xs"
          label="Re-Assign"
          @click="fnAllocateDeviceToSo"
        />
      </div>
    </div>

    <!-- Scanned Items -->
    <div class="row text-weight-regular text-grey-9">
      <div v-for="(item, index) in formData.scannedItems" :key="index" class="col group">
        <q-card
          class="shadow-4"
          :style="{ border: formData.device_type?.id === item.device.id ? '2px solid #61116a' : 'unset' }"
        >
          <q-list highlight separator class="q-pa-none" :class="{ activeDeviceTab: formData.device_type?.id === item.device.id }">
            <q-list-header style="border-bottom:1px solid #ccc;">
              <q-icon :style="{ color: formData.device_type?.id === item.device.id ? '#fff' : '#202c3f' }" name="fas fa-tablet-alt" />
              {{ item.device.deviceName }}
            </q-list-header>

            <q-scroll-area
              style="height:400px"
              :thumb-style="{ right:'4px', borderRadius:'5px', background:'grey', width:'5px', opacity:0.5 }"
              :delay="1500"
            >
              <div v-if="item.deviceSerialNumbers.length">
                <q-item
                  v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                  :key="subIndex"
                  separator
                  class="text-light-blue"
                >
                  <q-item-section>{{ subItem }}</q-item-section>
                  <q-item-section>{{ item.userName[subIndex] }}</q-item-section>
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
                  <q-item-section>No data to display</q-item-section>
                  <q-item-section side>
                    <q-btn round size="sm" color="negative" icon="clear" @click="fnRemoveDeviceTypeFromList(index)" />
                  </q-item-section>
                </q-item>
              </div>
            </q-scroll-area>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Re-Assign Modal -->
    <reAssignSo
      v-if="reAssignSo"
      :propshowRegionBasedSo="reAssignSo"
      :propAllScannedItemArr="formData"
      @closeModel="fnAllocateDeviceToSo"
    />
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import VueBarcodeScanner from "vue-barcode-scanner";
import reAssignSo from "../../components/sat/reAssignSo.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "assignSoToSo",
  components: { reAssignSo },

  setup() {
    const $q = useQuasar();
    const scannerToggleOption = ref(true);
    const reAssignSoModal = ref(false);

    const formData = reactive({
      so: "",
      device_type: null,
      scannedItems: [],
      assignedUserId: null
    });

    const assignToOptions = ref([]);

    // Vuex Actions
    const { IMPLEMENTATION_EXECUTIVE_LIST, DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION } = mapActions({
      IMPLEMENTATION_EXECUTIVE_LIST: "ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST",
      DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION: "VerifyDevice/DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION"
    });

    // Vuex Getters
    const { getImplementationExecutiveList } = mapGetters({
      getImplementationExecutiveList: "ImplementationExecutive/getImplementationExecutiveList"
    });

    const barcodeScanner = new VueBarcodeScanner();

    onMounted(() => {
      loadImplementationExecutives();
    });

    onBeforeUnmount(() => {
      barcodeScanner.destroy();
    });

    const loadImplementationExecutives = async () => {
      await IMPLEMENTATION_EXECUTIVE_LIST();
      assignToOptions.value = getImplementationExecutiveList.value.map(u => ({
        label: `${u.name} | ${u.employeeID} | ${u.email}`,
        value: u.id
      }));
    };

    const fnSelectSO = () => {
      barcodeScanner.destroy();
    };

    const fnSetDevicesByDeviceId = () => {
      barcodeScanner.destroy();
      const exists = formData.scannedItems.find(i => i.device?.id === formData.device_type?.id);
      if (!exists) {
        formData.scannedItems.unshift({
          device: { id: formData.device_type.id, deviceName: formData.device_type.deviceName },
          deviceSerialNumbers: [],
          userName: []
        });
      }
    };

    const onBarcodeScanned = barcode => {
      fnSetDevicesByDeviceId();
      const scannedItem = formData.scannedItems.find(i => i.device?.id === formData.device_type?.id);
      if (!scannedItem.deviceSerialNumbers.includes(barcode)) {
        DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION({ device: formData.device_type.id, barcode })
          .then(response => {
            const user = response.body.data.user;
            scannedItem.deviceSerialNumbers.push(barcode);
            scannedItem.userName.push(user.username);
            formData.assignedUserId = user.id;
          })
          .catch(error => {
            const message = error.data?.message || "Invalid barcode";
            $q.notify({ color: "primary", position: "bottom", message: `${barcode} - ${message}`, icon: "info" });
          });
      } else {
        $q.notify({ color: "info", position: "bottom", message: `${barcode} already scanned` });
      }
    };

    const openScannerComp = () => {
      $q.notify({ color: "positive", position: "bottom", message: `Start scanning`, icon: "list" });
      scannerToggleOption.value = false;
      if (!barcodeScanner.hasListener()) barcodeScanner.init(onBarcodeScanned);
    };

    const fnRemoveScannedItems = (index, subIndex) => {
      formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
      formData.scannedItems[index].userName.splice(subIndex, 1);
      scannerToggleOption.value = true;
    };

    const fnRemoveDeviceTypeFromList = index => {
      formData.scannedItems.splice(index, 1);
      scannerToggleOption.value = true;
    };

    const fnAllocateDeviceToSo = () => {
      reAssignSoModal.value = !reAssignSoModal.value;
    };

    return {
      formData,
      assignToOptions,
      scannerToggleOption,
      reAssignSo: reAssignSoModal,
      fnSelectSO,
      fnSetDevicesByDeviceId,
      fnRemoveScannedItems,
      fnRemoveDeviceTypeFromList,
      fnAllocateDeviceToSo,
      openScannerComp
    };
  }
};
</script>

<style scoped>
.activeDeviceTab .q-list-header {
  border-bottom: 1px solid #ccc;
  background: #61116a;
  color: #fff;
}
</style>
