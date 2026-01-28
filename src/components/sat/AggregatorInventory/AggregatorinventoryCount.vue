<template>
  <div>
    <div class="row">

      <!-- LEFT PANEL -->
      <div class="col-md-4" style="border-right: 1px solid #ccc;">
        <div class="q-ma-md">
          <div class="q-mb-md q-subheading">Region: {{ computedUserRegion }}</div>

          <!-- TOTAL DEVICES CARD -->
          <q-card class="no-shadow">
            <q-card-section class="q-pa-none">
              <div class="q-body-1 q-mb-sm"><strong><h6>Inventory with Region</h6></strong></div>
            </q-card-section>
            <q-separator />
            <q-card-section
              align="center"
              class="cursor-pointer bg-grey-5"
              :class="activeItemId === REGIONAL_INVENTORY_ALL_DEVICES ? 'shadow-5' : 'shadow-0'"
              @click="loadDevicesTableData(REGIONAL_INVENTORY_ALL_DEVICES, { name: 'Total Devices' })"
            >
              <div>Count</div>
              <div><big>{{ totalDeviceCount }}</big></div>
            </q-card-section>
          </q-card>

          <!-- DEVICE CATEGORIES GRID -->
          <div class="row gutter-md q-mt-md">
            <div class="col-md-6" v-for="(cat, idx) in deviceCategories" :key="idx">
              <q-card class="no-shadow cursor-pointer" role="button">
                <q-card-section class="q-pa-none">{{ cat.name }}</q-card-section>
                <q-separator />
                <q-card-section
                  align="center"
                  class="bg-grey-5"
                  :class="activeItemId === cat.id ? 'shadow-5' : 'shadow-0'"
                  @click="loadDevicesTableData(cat.id, cat)"
                >
                  <div>Count</div>
                  <div><big>{{ cat.count }}</big></div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- DEVICE INVENTORY LIST -->
          <div class="q-ma-md">
            <div class="row gutter-md">
              <div
                class="col-md-6"
                v-for="(item, index) in getAllPhonePeRegionalInventoryDeviceDetailsWithCount.inventryCount"
                :key="index"
              >
                <q-card class="no-shadow cursor-pointer" role="button">
                  <q-card-section class="q-pa-none">{{ item.aggregatorDevice.deviceName }}</q-card-section>
                  <q-separator />
                  <q-card-section
                    align="center"
                    :style="{ background: item.aggregatorDevice.colorCode }"
                    :class="activeItemId === index ? 'shadow-5' : 'shadow-0'"
                    @click="loadDevicesTableData(index, item)"
                  >
                    <div>Count</div>
                    <div><strong>{{ item.count }}</strong></div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="col-md-8">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="text-weight-regular text-grey-9 q-subheading q-py-sm">
            {{ inventoryCountTableTitle }}
          </div>
        </div>

        <q-table
          :title="'Lead Validation'"
          table-class="customTableClass"
          class="q-py-none"
          :rows="getAllAggregatorsRegionalInventorySerialNumbersByDevice"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          :loading="toggleAjaxLoadFilter"
          row-key="name"
        >
          <!-- TOP SLOT -->
          <template v-slot:top>
            <div class="row items-center q-px-md q-py-sm">
              <div class="col-md-6">
                <q-input
                  dense
                  clearable
                  v-model="filter"
                  placeholder="Search by SO Name, Serial Number"
                  outlined
                  color="grey-9"
                  class="q-mr-lg"
                />
              </div>
              <div class="col-md-5">
                <download-excel
                  :data="getAllAggregatorsRegionalInventorySerialNumbersByDevice"
                  :fields="jsonFields"
                  name="InventoryWithSO.xls"
                >
                  <q-btn outline color="grey-9" label="Download as Excel" />
                </download-excel>
              </div>
            </div>
          </template>

          <!-- DEVICE TYPE COLUMN -->
          <template v-slot:body-cell-device_type="{ row }">
            {{ row.aggregatorDevice ? row.aggregatorDevice.deviceName : 'NA' }}
          </template>

          <!-- ACTION COLUMN -->
          <template v-slot:body-cell-action="{ row }" v-if="info === 6">
            <div class="row no-wrap no-padding">
              <q-btn dense flat label="Usable" icon="check" class="text-light-blue" @click="fnShowUsable(row)" />
              <q-btn dense flat label="Faulty" icon="close" class="text-negative" @click="fnShowFaulty(row)" />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import downloadExcel from "vue-json-excel";

export default {
  components: { downloadExcel },

  setup() {
    const store = useStore();

    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const paginationControl = ref({ rowsPerPage: 10 });
    const activeItemId = ref(null);
    const inventoryCountTableTitle = ref("Total Devices");
    const info = ref("");
    const region = computed(() => JSON.parse(localStorage.getItem("u_i")).region.id);

    // Column definitions for table
    const columns = [
      { name: "device_type", label: "Device Type", align: "left", field: "deviceName", sortable: true },
      {
        name: "serialNumber",
        label: "Serial Number",
        align: "left",
        field: (row) => row.serialNumber,
        sortable: true
      },
      {
        name: "user",
        label: "SO Name",
        align: "left",
        field: (row) => (row.user ? `${row.user.name} | ${row.user.employeeID}` : "NA"),
        sortable: true
      },
      { name: "action", label: "", align: "left", field: "action", sortable: false }
    ];

    const jsonFields = { DeviceType: "device.deviceName", SerialNumber: "serialNumber" };

    const computedUserRegion = computed(() => JSON.parse(localStorage.getItem("u_i")).region.regionAreaName);

    // Device category cards
    const deviceCategories = computed(() => {
      const counts = store.getters.getAllPhonePeRegionalInventoryDeviceDetailsWithCount;
      return [
        { id: 1, name: "Pending Allocation", count: counts.pendingDeviceCount.count },
        { id: 2, name: "Allocated Devices", count: counts.allocatedCount.count },
        { id: 3, name: "Damaged Devices", count: counts.damageDeviceCount.count },
        { id: 4, name: "Inbound Devices", count: counts.inbountDeviceCount.count },
        { id: 5, name: "Pending List From App Count", count: counts.pendingListFromAppCount.count }
      ];
    });

    const totalDeviceCount = computed(() => {
      const list = store.getters.getAllPhonePeRegionalInventoryDeviceDetailsWithCount.inventryCount;
      return list.reduce((acc, item) => acc + item.count, 0);
    });

    onMounted(() => {
      fetchAllRegionalInventoryDeviceDetailsWithCount();
      fetchAllRegionalInventoryDeviceListBasedOnRegionalDevice();
    });

    // Actions
    const fetchAllRegionalInventoryDeviceDetailsWithCount = () => {
      const param = { region: region.value };
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_PHONE_PE_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT", param);
    };

    const fetchAllRegionalInventoryDeviceListBasedOnRegionalDevice = () => {
      const param = { region: JSON.parse(localStorage.getItem("u_i")).region, action: 1 };
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_AGGREGATORS_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", param);
    };

    const loadDevicesTableData = (itemIndex, item) => {
      toggleAjaxLoadFilter.value = true;
      activeItemId.value = itemIndex;

      let requestParams = { region: JSON.parse(localStorage.getItem("u_i")).region, action: 1 };

      inventoryCountTableTitle.value = item.name || item.aggregatorDevice?.deviceName;
      info.value = itemIndex;

      // Dispatch table data based on category
      store.dispatch("SAT_RegionalInventoryAllocation/FETCH_AGGREGATORS_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE", requestParams)
        .finally(() => {
          toggleAjaxLoadFilter.value = false;
        });
    };

    const fnShowUsable = (row) => {
      // Quasar dialog logic
      const { dialog, notify, loading } = window.$q; // Quasar plugin
      dialog({ title: "Confirm", message: "Are you sure to submit Usable Device?", ok: "Submit", cancel: "Cancel" })
        .onOk(() => {
          loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
          store.dispatch("InventoryCentral/USEABLE_DEVICE", row)
            .then(() => {
              fetchAllRegionalInventoryDeviceDetailsWithCount();
              notify({ color: "positive", position: "bottom", message: "Successfully Submitted", icon: "thumb_up" });
            })
            .catch(() => {
              notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" });
            })
            .finally(() => loading.hide());
        })
        .onCancel(() => {
          notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" });
        });
    };

    const fnShowFaulty = (row) => {
      const { dialog, notify, loading } = window.$q;
      dialog({ title: "Confirm", message: "Are you sure to submit Faulty Device?", ok: "Submit", cancel: "Cancel" })
        .onOk(() => {
          loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
          store.dispatch("InventoryCentral/FAULTY_DEVICE", row)
            .then(() => {
              fetchAllRegionalInventoryDeviceDetailsWithCount();
              notify({ color: "positive", position: "bottom", message: "Successfully Submitted", icon: "thumb_up" });
            })
            .catch(() => {
              notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" });
            })
            .finally(() => loading.hide());
        })
        .onCancel(() => {
          notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" });
        });
    };

    return {
      filter,
      toggleAjaxLoadFilter,
      paginationControl,
      activeItemId,
      inventoryCountTableTitle,
      info,
      columns,
      jsonFields,
      deviceCategories,
      totalDeviceCount,
      computedUserRegion,
      loadDevicesTableData,
      fnShowUsable,
      fnShowFaulty,
      fetchAllRegionalInventoryDeviceDetailsWithCount,
      fetchAllRegionalInventoryDeviceListBasedOnRegionalDevice,
      REGIONAL_INVENTORY_ALL_DEVICES: 0 // Example constant
    };
  }
};
</script>
