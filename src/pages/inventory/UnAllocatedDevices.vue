<template>
  <q-page>
    <div>
      <!-- Table title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"></div>

      <!-- Table with filter & download -->
      <q-table
        table-class="customTableClass"
        class="q-py-none"
        :data="tableData"
        :columns="columns"
        :filter="filter"
        :rows-per-page-options="[5,10,15,20,25]"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:top>
          <div class="row items-center bottom-border q-mb-sm">
            <div class="col-md-4">
              <q-select
                outlined
                v-model="filter"
                float-label="Select a Region"
                color="grey-9"
                :options="getUnAllocatedDevicesMenuOptions"
              />
            </div>
            <div class="col-md-7 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                size="md"
                @click="downloadInventorySummaryInfoMenu"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Fullscreen spinner overlay -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="#61116a" size="35" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "GetUnAllocatedDevice",
  setup() {
    const store = useStore();

    const tableData = ref([]);
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const paginationControl = reactive({
      rowsNumber: 10,
      page: 1,
      sortBy: "tid",
      descending: false,
      rowsPerPage: 10,
    });

    const getUnAllocatedDevicesMenuOptions = ref([]);

    const columns = [
      { name: "BP Region", label: "BP Region", align: "left", field: "BpRegion", required: true },
      { name: "Device Type", label: "Device Type", align: "left", field: "deviceType", required: true },
      { name: "Total", label: "Total", align: "left", field: "Total", required: true },
    ];

    const fnAjaxUnAllocatedDevice = async () => {
      try {
        await store.dispatch("UnallocatedDevices/UNALLOCATED_DEVICE_LIST");
        const regions = [{ label: "ALL", value: "%" }];
        store.getters["UnallocatedDevices/getUnAllocatedDevicesRegionMenu"].forEach((r) => {
          regions.push({ label: r, value: r });
        });
        getUnAllocatedDevicesMenuOptions.value = regions;
      } catch (error) {

        getUnAllocatedDevicesMenuOptions.value = [];
        console.error(error);
      }
    };

    const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
      toggleAjaxLoadFilter.value = true;
      try {
        await store.dispatch("unallocate/UNALLOCATED_DEVICE", { pagination, filter });

        // update pagination control
        paginationControl.rowsNumber = store.getters["unallocate/getUnAllocatedDevice"].totalElements;
        paginationControl.page = store.getters["unallocate/getUnAllocatedDevice"].number + 1;

        tableData.value = store.getters["unallocate/getUnAllocatedDevice"].content;

        const sortInfo = store.getters["unallocate/getUnAllocatedDevice"].sort;
        if (sortInfo && sortInfo.length > 0) {
          paginationControl.sortBy = sortInfo[0].property;
          paginationControl.descending = !sortInfo[0].ascending;
        }
      } catch (err) {
        console.error(err);
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    const downloadInventorySummaryInfoMenu = async () => {
      toggleAjaxLoadFilter.value = true;
      try {
        await store.dispatch("InventoryCentral/REPORT_INVENTORY_SUMMARY2");
        store.$q.notify({
          color: "positive",
          position: "bottom",
          message: "Success, file has been downloaded",
          icon: "check",
        });
      } catch (err) {
        console.error(err);
        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down",
        });
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    onMounted(() => {
      fnAjaxUnAllocatedDevice();
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
    });

    return {
      tableData,
      filter,
      toggleAjaxLoadFilter,
      paginationControl,
      getUnAllocatedDevicesMenuOptions,
      columns,
      ajaxLoadAllLeadInfo,
      downloadInventorySummaryInfoMenu,
    };
  },
};
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}
</style>
