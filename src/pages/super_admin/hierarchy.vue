<template>
  <q-page>
    <div>
      <!-- Tabs for Active / Deactive Hierarchy -->
      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="changeTabs">
        <q-tab name="active" label="Active Hierarchy" color="dark" />
        <q-tab name="deactive" label="Deactive Hierarchy" color="dark" />
      </q-tabs>

      <!-- Active Tab -->
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="active">
          <q-table
            :rows="activeTableData"
            :columns="columns"
            table-class="customSATableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :row-key="'name'"
            :filter-method="myCustomSearchFilter"
            @request="ajaxLoadDataForHierarchyTable"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row q-mb-md">
                <div class="col-md-6">
                  <q-search
                    v-model="filterSearch"
                    clearable
                    color="grey-9"
                    placeholder="Type.."
                    class="q-mr-lg"
                  />
                </div>
                <div class="col-md-12 text-right">
                  <q-btn
                    label="Add New Hierarchy"
                    color="purple-9"
                    size="md"
                    no-caps
                    @click="$router.push('/super/admin/add/New/Hierarchy')"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Disable"
                  icon="far fa-plus-square"
                  size="md"
                  flat
                  class="text-light-blue"
                  @click="fnDisable(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Deactive Tab -->
        <q-tab-panel name="deactive">
          <q-table
            :rows="deActiveTableData"
            :columns="columns1"
            table-class="customSATableClass"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            :row-key="'name'"
            :filter-method="myCustomSearchFilter"
            @request="ajaxLoadDataForHierarchyTable"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row q-mb-md">
                <div class="col-md-6">
                  <q-search
                    v-model="filterSearch1"
                    clearable
                    color="grey-9"
                    placeholder="Type.."
                    class="q-mr-lg"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Active"
                  icon="far fa-plus-square"
                  size="md"
                  flat
                  class="text-light-blue"
                  @click="fnActive(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Hierarchy Modal -->
      <show-create-hierarchy
        v-if="propShowCreateHierarchy"
        :prop-get-all-hierarchies-data="getAllHierarchiesData"
        :prop-show-create-hierarchy="propShowCreateHierarchy"
        @emit-create-hierarchy-details="fnShowCreateHierarchy"
      />

      <!-- Edit Hierarchy Modal -->
      <show-edit-hierarchy
        v-if="propShowEditHierarchy"
        :prop-show-edit-hierarchy="propShowEditHierarchy"
        :prop-row-details="propRowDetails"
        @emit-edit-hierarchy-details="fnShowEditHierarchy"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

import ShowCreateHierarchy from "../../components/super_admin/showCreateHierarchy.vue";
import ShowEditHierarchy from "../../components/super_admin/ShowEditHierarchy.vue";

export default {
  name: "HierarchyManagement",
  components: {
    ShowCreateHierarchy,
    ShowEditHierarchy,
  },
  setup() {
    const store = useStore();

    // State
    const selectedTab = ref("active");
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const propShowCreateHierarchy = ref(false);
    const propShowEditHierarchy = ref(false);
    const propRowDetails = ref(null);

    const paginationControl = ref({ rowsPerPage: 10 });
    const paginationControl1 = ref({ rowsPerPage: 10 });

    const tableData = ref([]);
    const activeTableData = ref([]);
    const deActiveTableData = ref([]);

    // Columns
    const columns = [
      { name: "label", required: true, label: "Hierarchy", align: "left", field: "label", sortable: false },
      { name: "shortCode", required: true, label: "Hierarchy Code", align: "left", field: "shortCode", sortable: false },
      { name: "action", required: true, label: "", align: "left", field: "action", sortable: true }
    ];
    const columns1 = [...columns];

    // Getters
    const getAllHierarchiesData = computed(() => store.getters["SuperAdminUsers/getAllHierarchiesData"]);

    // Methods
    const ajaxLoadDataForHierarchyTable = async () => {
      try {
        store.commit("SET_LOADING", true);
        await store.dispatch("SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA");
        tableData.value = getAllHierarchiesData.value;
        activeTableData.value = tableData.value.filter(h => h.active === true);
        deActiveTableData.value = tableData.value.filter(h => h.active === false);
      } catch (error) {

        console.error(error);
        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to fetch hierarchy data.",
          icon: "thumb_down"
        });
      } finally {
        store.commit("SET_LOADING", false);
      }
    };

    const fnDisable = async (row) => {
      try {
        const confirmed = await store.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to delete hierarchy?",
          cancel: true,
          persistent: true
        });
        if (confirmed) {
          await store.dispatch("AddHierarchy/DELETE_HIERARCHY", row);
          store.$q.notify({ color: "negative", position: "bottom", message: "Successfully deactivated", icon: "thumb_up" });
          ajaxLoadDataForHierarchyTable();
        }
      } catch (error) {

        console.error(error);
        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to fetch hierarchy data.",
          icon: "thumb_down"
        });
      }
    };

    const fnActive = async (row) => {
      try {
        const confirmed = await store.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to activate hierarchy?",
          cancel: true,
          persistent: true
        });
        if (confirmed) {
          const param = { hierarchy: row.label, hierarchyCode: row.shortCode, id: row.value };
          await store.dispatch("AddHierarchy/ACTIVE_HIERARCHY", param);
          store.$q.notify({ color: "positive", position: "bottom", message: "Successfully activated", icon: "thumb_up" });
          ajaxLoadDataForHierarchyTable();
        }
      } catch (error) {

        console.error(error);
        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to fetch hierarchy data.",
          icon: "thumb_down"
        });
      }
    };

    const fnShowCreateHierarchy = () => {
      propShowCreateHierarchy.value = !propShowCreateHierarchy.value;
    };

    const fnShowEditHierarchy = (rowDetails) => {
      propShowEditHierarchy.value = !propShowEditHierarchy.value;
      propRowDetails.value = rowDetails;
    };

    const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    };

    // Lifecycle
    onMounted(() => {
      ajaxLoadDataForHierarchyTable();
    });

    return {
      selectedTab,
      filterSearch,
      filterSearch1,
      propShowCreateHierarchy,
      propShowEditHierarchy,
      propRowDetails,
      tableData,
      activeTableData,
      deActiveTableData,
      paginationControl,
      paginationControl1,
      columns,
      columns1,
      getAllHierarchiesData,
      ajaxLoadDataForHierarchyTable,
      fnDisable,
      fnActive,
      fnShowCreateHierarchy,
      fnShowEditHierarchy,
      myCustomSearchFilter,
    };
  }
};
</script>

<style scoped>
/* Add any custom styles if required */
</style>
