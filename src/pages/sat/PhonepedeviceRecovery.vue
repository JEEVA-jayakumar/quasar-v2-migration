<template>
  <q-page padding>
    <div>
      <!-- Page Title -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Device Recovery
      </div>

      <!-- Inventory Table -->
      <q-table
        table-class="customTableClass"
        :rows="getAllInventoryWithSo"
        :columns="columns"
        :filter="filter"
        row-key="name"
        v-model:pagination="paginationControl"
      >
        <!-- Top slot for search and download -->
        <template #top>
          <div class="row items-center q-mb-md">
            <div class="col-md-5">
              <q-input
                filled
                v-model="filter"
                clearable
                placeholder="Pod Number, Device Type"
                dense
                class="q-mr-lg"
                outlined
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-md-5">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg float-right"
                size="md"
                @click="toggleDownloadInventorySo"
              />
            </div>
          </div>
        </template>

        <!-- Custom cell formatting for dates -->
        <template #body-cell-created_at="props">
          {{ props.row.created_at ? formatDate(props.row.created_at) : "NA" }}
        </template>

        <template #body-cell-updated_at="props">
          {{ props.row.updated_at ? formatDate(props.row.updated_at) : "NA" }}
        </template>
      </q-table>

      <!-- Download Modal / Component -->
      <DownloadInventorySoList
        v-if="propInventoryWithSo"
        :propInventoryWithSo="propInventoryWithSo"
        @emitfnshowInventoryWithSo="toggleDownloadInventorySo"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import DownloadInventorySoList from "../../components/inventory/DownloadInventorySoList.vue";

export default {
  name: "AggregatorDeviceRecovery",
  components: { DownloadInventorySoList },
  setup() {
    const $q = useQuasar();

    const filter = ref("");
    const propInventoryWithSo = ref(false);

    const paginationControl = ref({
      rowsPerPage: 10
    });

    // Vuex actions & getters
    const { FETCH_INVENTORY_WITH_SO } = mapActions("InventoryWithSo", [
      "FETCH_INVENTORY_WITH_SO"
    ]);

    const { getAllInventoryWithSo } = mapGetters("InventoryWithSo", [
      "getAllInventoryWithSo"
    ]);

    onMounted(() => {
      FETCH_INVENTORY_WITH_SO();
    });

    // Columns configuration
    const columns = [
      { name: "soname", label: "So Name", align: "center", field: "name", sortable: true },
      { name: "pod_number", label: "Pod Number", field: "pod_number", align: "center", sortable: true },
      { name: "serial_number", label: "Serial Number", field: "serial_number", align: "center", sortable: true },
      { name: "device_name", label: "Device Type", field: "device_name", align: "center", sortable: true },
      {
        name: "created_at",
        label: "Create Date",
        align: "center",
        field: row => row.created_at,
      },
      {
        name: "updated_at",
        label: "Receive Date",
        align: "center",
        field: row => row.updated_at,
      },
      { name: "region_name", label: "BP Region", field: "region_name", align: "center", sortable: true }
    ];

    // Helper to format dates
    const formatDate = (value) => {
      return value ? moment(value).format("DD/MM/YYYY") : "NA";
    };

    // Toggle download modal
    const toggleDownloadInventorySo = () => {
      propInventoryWithSo.value = !propInventoryWithSo.value;
    };

    return {
      $q,
      filter,
      columns,
      paginationControl,
      getAllInventoryWithSo,
      propInventoryWithSo,
      formatDate,
      toggleDownloadInventorySo
    };
  }
};
</script>

<style scoped>
/* You can keep custom styling from your previous code */
</style>
