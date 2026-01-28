<template>
  <q-page padding>
    <q-tabs v-model="activeTab" class="shadow-1" color="grey-1">
      <q-tab name="active" label="Active Aggregators" color="dark" />
      <q-tab name="deactive" label="Deactive Aggregators" color="dark" />

      <!-- Active Aggregators Table -->
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="active">
          <q-table
            :rows="activeTableData"
            :columns="columns"
            row-key="name"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            color="grey-9"
            table-class="customSATableClass"
          >
            <template v-slot:top>
              <div class="row items-center q-pa-sm">
                <div class="col-6">
                  <q-input
                    dense
                    outlined
                    clearable
                    v-model="filterSearch"
                    placeholder="Type.."
                    color="grey-9"
                  />
                </div>
                <div class="col-6 text-right">
                  <q-btn
                    no-caps
                    color="purple-9"
                    label="Add New Aggregators"
                    @click="fnShowAddNewAggregators()"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  class="text-light-blue"
                  label="Modify"
                  icon="far fa-plus-square"
                  @click="fnShowEditAggregator(props.row)"
                />
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  class="text-negative"
                  label="Disable"
                  icon="far fa-minus-square"
                  @click="fnDeleteAggregators(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Deactive Aggregators Table -->
        <q-tab-panel name="deactive">
          <q-table
            :rows="deActiveTableData"
            :columns="columns1"
            row-key="name"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            color="grey-9"
            table-class="customSATableClass"
          >
            <template v-slot:top>
              <div class="row items-center q-pa-sm">
                <div class="col-6">
                  <q-input
                    dense
                    outlined
                    clearable
                    v-model="filterSearch"
                    placeholder="Type.."
                    color="grey-9"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action1="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  class="positive"
                  label="Active"
                  icon="far fa-plus-square"
                  @click="fnActivate(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Modals -->
      <show-create-region
        v-if="propShowCreateRegions"
        :prop-show-create-regions="propShowCreateRegions"
        @emitfnshowRegions="fnshowCreateRegions"
        @emitfnForRegionTable="ajaxLoadDataForRegionTable"
      />
      <show-edit-aggregator
        v-if="propShowEditAggregator"
        :prop-show-edit-aggregator="propShowEditAggregator"
        :prop-row-details="propRowDetails"
        @emitfnShowEditAggregator="fnShowEditAggregator"
      />
      <show-add-new-aggregators
        v-if="propShowAddNewAggregators"
        :prop-show-add-new-aggregators="propShowAddNewAggregators"
        :prop-row-details="propRowDetails"
        @emitfnShowAddNewAggregators="fnShowAddNewAggregators"
      />
    </q-tabs>
  </q-page>
</template>

<script>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import ShowCreateRegion from "../../components/super_admin/showCreateRegions.vue";
import ShowEditAggregator from "../../components/super_admin/showEditAggregator.vue";
import ShowAddNewAggregators from "../../components/super_admin/ShowAddNewAggregators.vue";

export default {
  name: "AggregatorsPage",
  components: {
    ShowCreateRegion,
    ShowEditAggregator,
    ShowAddNewAggregators,
  },
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();

    const activeTab = ref("active");

    const propShowCreateRegions = ref(false);
    const propShowEditAggregator = ref(false);
    const propShowAddNewAggregators = ref(false);
    const propRowDetails = ref(null);

    const filterSearch = ref("");
    const paginationControl = reactive({ rowsPerPage: 10 });

    const columns = [
      { name: "name", label: "Aggregator", field: "name", sortable: false },
      { name: "action", label: "", field: "action", sortable: false },
    ];
    const columns1 = [
      { name: "name", label: "Aggregator", field: "name", sortable: false },
      { name: "action1", label: "", field: "action1", sortable: false },
    ];

    const activeTableData = ref([]);
    const deActiveTableData = ref([]);
    const tableData = ref([]);

    const ajaxLoadDataForRegionTable = async () => {
      try {
        await store.dispatch("superAdminAggregators/GET_CREATED_AGGREGATORS_LIST");
        tableData.value = store.getters["superAdminAggregators/getCreatedAggregatorList"];
        activeTableData.value = tableData.value.filter((item) => item.active);
        deActiveTableData.value = tableData.value.filter((item) => !item.active);
        proxy.$q.loading.hide();
      } catch (error) {

        proxy.$q.notify({
          color: "negative",
          position: "bottom",
          message: error.body?.message || "Please Try Again Later !",
          icon: "thumb_down",
        });
      }
    };

    onMounted(() => {
      ajaxLoadDataForRegionTable();
    });

    const fnActivate = (row) => {
      proxy.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to activate?",
        ok: "Continue",
        cancel: "Cancel",
      })
      .then(async () => {
        proxy.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });
        try {
          await store.dispatch("superAdminAggregators/EDIT_CREATED_AGGREGATORS", row);
          await ajaxLoadDataForRegionTable();
          proxy.$q.notify({ color: "positive", position: "bottom", message: "Successfully Activated", icon: "thumb_up" });
        } catch {
          proxy.$q.notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" });
        } finally {
          proxy.$q.loading.hide();
        }
      })
      .catch(() => {
        proxy.$q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" });
      });
    };

    const fnDeleteAggregators = (row) => {
      proxy.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete region?",
        ok: "Continue",
        cancel: "Cancel",
      })
      .then(async () => {
        proxy.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });
        try {
          await store.dispatch("superAdminAggregators/DELETE_CREATED_AGGREGATORS", row);
          await ajaxLoadDataForRegionTable();
          proxy.$q.notify({ color: "positive", position: "bottom", message: "Successfully removed", icon: "thumb_up" });
        } catch {
          proxy.$q.notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" });
        } finally {
          proxy.$q.loading.hide();
        }
      })
      .catch(() => {
        proxy.$q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" });
      });
    };

    const fnShowAddNewAggregators = (row = null) => {
      propShowAddNewAggregators.value = !propShowAddNewAggregators.value;
      propRowDetails.value = row;
    };

    const fnShowEditAggregator = (row) => {
      propShowEditAggregator.value = !propShowEditAggregator.value;
      propRowDetails.value = row;
    };

    const fnshowCreateRegions = () => {
      propShowCreateRegions.value = !propShowCreateRegions.value;
    };

    const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter((row) =>
        cols.some((col) => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    };

    return {
      activeTab,
      propShowCreateRegions,
      propShowEditAggregator,
      propShowAddNewAggregators,
      propRowDetails,
      filterSearch,
      paginationControl,
      columns,
      columns1,
      activeTableData,
      deActiveTableData,
      fnActivate,
      fnDeleteAggregators,
      fnShowAddNewAggregators,
      fnShowEditAggregator,
      fnshowCreateRegions,
      myCustomSearchFilter,
      ajaxLoadDataForRegionTable,
    };
  },
};
</script>

<style scoped>
/* Optional: add your custom styling */
</style>
