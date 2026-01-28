<template>
  <q-page class="q-pa-md">
    <div>
      <q-table
        :rows="getAllDevicesInfo"
        :columns="columns"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :row-key="'id'"
        color="grey-9"
        :filter-method="myCustomSearchFilter"
      >
        <template v-slot:top>
          <div class="row items-center q-mb-md">
            <div class="col-md-6 text-right">
              <q-btn
                no-caps
                no-wrap
                label="Add New Device"
                class="q-mt-lg text-weight-regular"
                color="purple-9"
                icon="far fa-plus-square"
                size="md"
                @click="fnShowCreateDeviceType"
              />
            </div>
            <div class="col-md-5">
              <q-input
                clearable
                v-model="filterSearch"
                placeholder="Type.."
                label="Search by name, short name"
                color="grey-9"
                dense
                class="q-mr-lg"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>

        <template v-slot:body-cell-action="props">
          <div class="row no-wrap no-padding">
            <q-btn
              dense
              no-caps
              no-wrap
              label="Modify"
              icon="far fa-plus-square"
              size="md"
              flat
              class="text-light-blue"
              @click="fnShowEditDeviceType(props.row)"
            />
            <q-btn
              dense
              no-caps
              no-wrap
              label="Disable"
              icon="far fa-minus-square"
              size="md"
              flat
              class="text-negative"
              @click="fnDeleteDeviceType(props.row.id)"
            />
          </div>
        </template>
      </q-table>

      <!-- Create Device Modal -->
      <show-create-device-type
        v-if="propShowCreateDeviceTypes"
        :prop-show-create-device-types="propShowCreateDeviceTypes"
        @emitfnshow-device-types="fnShowCreateDeviceType"
        @emitfn-for-device-type-table="ajaxLoadDataForDeviceTypeTable"
      />

      <!-- Edit Device Modal -->
      <show-edit-device-type
        v-if="propShowEditDeviceTypes"
        :prop-show-edit-device-types="propShowEditDeviceTypes"
        :prop-row-details="propRowDetails"
        @emitfnshow-device-types="fnShowEditDeviceType"
        @emitfn-for-device-type-table="ajaxLoadDataForDeviceTypeTable"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import ShowCreateDeviceType from "../../components/super_admin/showCreateDeviceTypes.vue";
import ShowEditDeviceType from "../../components/super_admin/showEditDeviceTypes.vue";
import { useQuasar } from "quasar";

export default {
  name: "DeviceTypes",
  components: {
    ShowCreateDeviceType,
    ShowEditDeviceType,
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const propShowCreateDeviceTypes = ref(false);
    const propShowEditDeviceTypes = ref(false);
    const propRowDetails = ref(null);

    const filterSearch = ref("");
    const paginationControl = reactive({ rowsPerPage: 10 });

    const columns = [
      { name: "deviceType", required: true, label: "Device Type", align: "left", field: "deviceName", sortable: true },
      { name: "action", required: true, label: "", align: "left", field: "action", sortable: false },
    ];

    const getAllDevicesInfo = computed(() => store.getters["SA_Devices/getAllDevicesInfo"] || []);

    const ajaxLoadDataForDeviceTypeTable = async () => {
      await store.dispatch("SA_Devices/FETCH_DEVICES_DATA");
    };

    const fnShowCreateDeviceType = () => {
      propShowCreateDeviceTypes.value = !propShowCreateDeviceTypes.value;
    };

    const fnShowEditDeviceType = (rowDetails) => {
      propShowEditDeviceTypes.value = !propShowEditDeviceTypes.value;
      propRowDetails.value = rowDetails;
    };

    const fnDeleteDeviceType = async (id) => {
      try {
        await $q.dialog({
          title: "Confirm",
          message: "Are you sure want to delete device type?",
          ok: "Continue",
          cancel: "Cancel",
        });

        $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });

        await store.dispatch("SA_Devices/DELETE_DEVICE_DATA", id);
        await ajaxLoadDataForDeviceTypeTable();

        $q.loading.hide();
        $q.notify({ color: "positive", position: "bottom", message: "Successfully removed", icon: "thumb_up" });
      } catch (err) {
        $q.loading.hide();
        $q.notify({ color: "negative", position: "bottom", message: err?.message || "No changes made!", icon: "thumb_down" });
      }
    };

    const myCustomSearchFilter = (rows, terms, cols, getCellValue) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter((row) => cols.some((col) => (getCellValue(col, row) + "").toLowerCase().includes(lowerTerms)));
    };

    onMounted(() => {
      ajaxLoadDataForDeviceTypeTable();
    });

    return {
      propShowCreateDeviceTypes,
      propShowEditDeviceTypes,
      propRowDetails,
      filterSearch,
      paginationControl,
      columns,
      getAllDevicesInfo,
      ajaxLoadDataForDeviceTypeTable,
      fnShowCreateDeviceType,
      fnShowEditDeviceType,
      fnDeleteDeviceType,
      myCustomSearchFilter,
    };
  },
};
</script>

<style scoped>
</style>
