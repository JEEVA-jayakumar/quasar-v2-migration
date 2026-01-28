<template>
  <q-page padding>
    <div>
      <!-- Page Title -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Device Recovery
      </div>

      <!-- Table -->
      <q-table
        :rows="tableData"
        :columns="columns"
        row-key="tid"
        :filter="filter"
        v-model:pagination="paginationControl"
        table-class="customTableClass"
        @request="fnajaxLoadingData"
      >
        <!-- Custom Column Renderers -->
        <template v-slot:body-cell-serialNumber="props">
          {{ props.row.aggregatorRegionalInventory?.serialNumber || 'NA' }}
        </template>

        <template v-slot:body-cell-podNumber="props">
          {{ props.row.aggregatorRegionalInventory?.podNumber || 'NA' }}
        </template>

        <template v-slot:body-cell-deviceName="props">
          {{ props.row.aggregatorRegionalInventory?.aggregatorDevice?.deviceName || 'NA' }}
        </template>

        <template v-slot:body-cell-tid="props">
          {{ props.row.tid || 'NA' }}
        </template>

        <template v-slot:body-cell-mid="props">
          {{ props.row.mid || 'NA' }}
        </template>

        <template v-slot:body-cell-leadNumber="props">
          {{ props.row.leadInformation?.leadNumber || 'NA' }}
        </template>

        <!-- Top Slot: Search + Buttons -->
        <template v-slot:top>
          <div class="row items-center q-mb-md">
            <div class="col-md-5">
              <q-search
                v-model="filter"
                clearable
                separator
                color="grey-9"
                placeholder="Type.."
                float-label="Search TID, MID"
                debounce="300"
              />
            </div>

            <div class="col-md-2 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                @click="downloadDeviceRecovery"
              />
            </div>

            <div class="col-md-5 text-right">
              <q-btn-dropdown
                outline
                no-caps
                color="purple-9"
                label="Add Phonepe Device Recovery Manufacturer"
              >
                <q-list>
                  <q-item clickable :to="{ path: 'DeviceRecoveryUpload' }">
                    <q-item-section avatar>
                      <q-icon name="search" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Scan and Upload</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="fnPhonePeBulkUpload">
                    <q-item-section avatar>
                      <q-icon name="attach_file" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Bulk Upload</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </template>
      </q-table>

      <!-- Bulk Upload Modal -->
      <PhonepeBulkDeviceUpload
        v-if="openBulkUploadModal"
        :propOpenBulkUploadModal="openBulkUploadModal"
        :propAllDevicestypes="getPhonepeDeviceRecoveryDatas"
        @closeModel="fnPhonePeBulkUpload"
        @emitToggleinventoryBulkUploadOnSuccess="fnReloadPageInformation"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import PhonepeBulkDeviceUpload from "../../pages/sat/PhonepeBulkDeviceUpload.vue";

export default {
  name: "merchantTracker",
  components: { PhonepeBulkDeviceUpload },

  setup() {
    const store = useStore();

    const tableData = ref([]);
    const filter = ref("");
    const openBulkUploadModal = ref(false);

    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "tid",
      descending: false,
      rowsPerPage: 10
    });

    const columns = [
      {
        name: "leadNumber",
        required: true,
        label: "Lead Number",
        align: "center",
        field: row => row.leadInformation?.leadNumber || "NA",
        sortable: false
      },
      {
        name: "serialNumber",
        required: true,
        label: "Serial Number",
        align: "center",
        field: row => row.aggregatorRegionalInventory?.serialNumber || "NA",
        sortable: false
      },
      {
        name: "tid",
        required: true,
        label: "TID",
        align: "center",
        field: "tid",
        sortable: true
      },
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "center",
        field: "mid",
        sortable: false
      },
      {
        name: "podNumber",
        required: true,
        label: "Pod Number",
        align: "center",
        field: row => row.aggregatorRegionalInventory?.podNumber || "NA",
        sortable: false
      },
      {
        name: "deviceName",
        required: true,
        label: "Device Name",
        align: "center",
        field: row => row.aggregatorRegionalInventory?.aggregatorDevice?.deviceName || "NA",
        sortable: false
      }
    ];

    const getPhonepeDeviceRecoveryDatas = computed(
      () => store.getters["PhonepeDeviceRecovery/getPhonepeDeviceRecoveryDatas"]
    );

    const fnajaxLoadingData = async ({ pagination, filter }) => {
      try {
        store.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });

        await store.dispatch("PhonepeDeviceRecovery/FETCH_PHONEPE_DEVICE_RECOVERY_DATAS", { pagination, filter });

        paginationControl.value = { ...pagination };
        const data = getPhonepeDeviceRecoveryDatas.value;

        paginationControl.value.rowsNumber = data.totalElements;
        paginationControl.value.page = data.number + 1;

        tableData.value = data.content;

        if (data.sort) {
          paginationControl.value.sortBy = data.sort[0].property;
          paginationControl.value.descending = data.sort[0].ascending;
        }
      } catch (error) {

        console.error(error);
      } finally {
        store.$q.loading.hide();
      }
    };

    const fnPhonePeBulkUpload = () => {
      openBulkUploadModal.value = !openBulkUploadModal.value;
    };

    const fnReloadPageInformation = () => {
      fnajaxLoadingData({ pagination: paginationControl.value, filter: filter.value });
    };

    const downloadDeviceRecovery = async () => {
      try {
        store.$q.loading.show({ delay: 100 });
        await store.dispatch("PhonepeDeviceRecovery/DOWNLOAD_PHONEPE_DEVICE_RECOVERY_DATAS");
        store.$q.notify({ color: "positive", position: "bottom", message: "Success, file has been downloaded", icon: "check" });
      } catch {
        store.$q.notify({ color: "negative", position: "bottom", message: "Please try again", icon: "thumb_down" });
      } finally {
        store.$q.loading.hide();
      }
    };

    onMounted(() => {
      fnajaxLoadingData({ pagination: paginationControl.value, filter: filter.value });
    });

    return {
      tableData,
      columns,
      filter,
      paginationControl,
      openBulkUploadModal,
      fnPhonePeBulkUpload,
      fnReloadPageInformation,
      fnajaxLoadingData,
      downloadDeviceRecovery,
      getPhonepeDeviceRecoveryDatas
    };
  }
};
</script>

<style scoped>
/* Optional custom styles */
</style>
