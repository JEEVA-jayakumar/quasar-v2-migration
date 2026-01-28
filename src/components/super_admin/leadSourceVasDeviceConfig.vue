<template>
  <q-page>
    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="changeTabs"
    >
      <q-tab name="active" label="Active" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="active">
        <q-table
          :rows="activeTableData"
          :columns="columns"
          row-key="id"
          :filter="filterSearch"
          v-model:pagination="pagination"
          @request="ajaxLoadData"
          table-class="customSATableClass"
        >
          <!-- TOP -->
          <template #top>
            <div class="row full-width q-col-gutter-md items-center">
              <div class="col-md-6">
                <q-input
                  dense
                  outlined
                  clearable
                  v-model="filterSearch"
                  placeholder="Type.."
                />
              </div>
              <div class="col-md-6 text-right">
                <q-btn
                  color="purple-9"
                  no-caps
                  label="Add New"
                  @click="openAddModal"
                />
              </div>
            </div>
          </template>

          <!-- VAS COLUMN -->
          <template #body-cell-vas="{ row }">
            <q-td>
              <div
                v-for="vas in row.vasList"
                :key="vas.id"
                class="row no-wrap text-dark"
              >
                {{ vas.name }}
              </div>
            </q-td>
          </template>

          <!-- ACTION COLUMN -->
          <template #body-cell-action="{ row }">
            <q-td>
              <q-btn
                dense
                flat
                icon="add"
                label="Modify"
                class="text-light-blue"
                @click="openEditModal(row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- ADD -->
    <showAddLeadSOurceVasDevice
      v-if="showAddModal"
      :propShowAddLeadSOurceVasDevice="showAddModal"
      @emitAddLeadSOurceVasDevice="closeAddModal"
    />

    <!-- EDIT -->
    <showEditLsVasDevice
      v-if="showEditModal"
      :propShowEditLsVasDevice="showEditModal"
      :propRowDetails="selectedRow"
      @emitfnshowLsVasDevice="refreshList"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showAddLeadSOurceVasDevice from "../../components/super_admin/AddLeadSOurceVasDevice.vue";
import showEditLsVasDevice from "../../components/super_admin/leadSourceVasDeviceModify.vue";

const $q = useQuasar();
const store = useStore();

/* STATE */
const selectedTab = ref("active");
const filterSearch = ref("");
const activeTableData = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedRow = ref(null);

const pagination = ref({
  page: 1,
  rowsPerPage: 10
});

/* TABLE COLUMNS */
const columns = [
  {
    name: "device",
    label: "Device Name",
    align: "left",
    field: row => row.leadSourceDeviceVasMapping.device.deviceName
  },
  {
    name: "leadSource",
    label: "LeadSource",
    align: "left",
    field: row => row.leadSourceDeviceVasMapping.leadSource.sourceName
  },
  {
    name: "vas",
    label: "VAS",
    align: "left",
    field: "vasList"
  },
  {
    name: "action",
    label: "",
    align: "left"
  }
];

/* METHODS */
const openAddModal = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const openEditModal = row => {
  selectedRow.value = row;
  showEditModal.value = true;
};

const refreshList = () => {
  showEditModal.value = false;
  ajaxLoadData();
};

const changeTabs = () => {
  ajaxLoadData();
};

const ajaxLoadData = async () => {
  $q.loading.show({
    message: "Please Wait...",
    spinnerColor: "purple-9"
  });

  try {
    await store.dispatch(
      "leadSourceVasDeviceConfig/GET_LS_VAS_DEVICE_CONFIG_DETAILS"
    );
    activeTableData.value =
      store.getters[
        "leadSourceVasDeviceConfig/getLsVasDeviceDetails"
      ] || [];
  } catch {
    $q.notify({
      type: "negative",
      message: "Please Try Again Later!"
    });
  } finally {
    $q.loading.hide();
  }
};

/* LIFECYCLE */
onMounted(() => {
  ajaxLoadData();
});
</script>

<style scoped>
.customSATableClass {
  min-height: 300px;
}
</style>
