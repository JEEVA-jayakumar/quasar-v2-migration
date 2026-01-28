<template>
  <q-page padding>
    <div>

      <!-- Filters Section (commented out for now) -->
      <!--
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-4">
          <q-select
            v-model="aggregator"
            :options="aggregatorOptions"
            label="Select Aggregator"
            emit-value
            map-options
            @update:model-value="getaggregator"
          />
        </div>
      </div>
      -->

      <!-- QTable -->
      <div>
        <q-table
          table-class="customTableClass"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="id"
          @request="ajaxLoadAllLeadInfo"
        >
          <!-- Top slot -->
          <template v-slot:top>
            <div class="row items-center q-px-md q-py-sm">
              <div class="col-md-5">
                <q-input
                  v-model="filter"
                  clearable
                  placeholder="Type..."
                  label="Pod Number, Device Type"
                  dense
                  outlined
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-md-5 text-right">
                <q-btn
                  square
                  outline
                  color="purple-9"
                  label="Download as Excel"
                  class="q-py-sm"
                  size="md"
                  @click="downloadAggregatorsInventoryWithSoList"
                />
              </div>
            </div>
          </template>

          <!-- Custom date formatting -->
          <template v-slot:body-cell-created_at="props">
            {{ props.row.created_at ? formatDate(props.row.created_at) : "NA" }}
          </template>

          <template v-slot:body-cell-updated_at="props">
            {{ props.row.updated_at ? formatDate(props.row.updated_at) : "NA" }}
          </template>
        </q-table>
      </div>

      <!-- Download Modal -->
      <DownloadAggregatorsInventoryWithSoList
        v-if="propInventoryWithSo"
        :propInventoryWithSo="propInventoryWithSo"
        @emitfnshowInventoryWithSo="downloadAggregatorsInventoryWithSoList"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive} from "vue";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import DownloadAggregatorsInventoryWithSoList from "../../components/inventory/DownloadAggregatorsInventoryWithSoList.vue";

export default {
  name: "merchantTracker",
  components: { DownloadAggregatorsInventoryWithSoList },

  setup() {
    const tableData = ref([]);
    const filter = ref("");
    const paginationControl = reactive({ page: 1, rowsPerPage: 10 });
    const propInventoryWithSo = ref(false);

    const formatDate = (value) => moment(value).format("DD/MM/YYYY");

    return {
      tableData,
      filter,
      paginationControl,
      propInventoryWithSo,
      formatDate
    };
  },

  computed: {
    ...mapGetters("InventoryWithSo", [
      "getAllInventoryWithSo",
      "getAllAggregatorsInventoryWithSo"
    ]),
    ...mapGetters("superAdminAggregators", [
      "getCreatedAggregatorList",
      "getActiveCreatedAggregatorList"
    ])
  },

  data() {
    return {
      columns: [
        {
          name: "soname",
          label: "SO Name",
          align: "center",
          field: row => `${row.name} | ${row.soEmpId}`,
          sortable: true
        },
        {
          name: "pod_number",
          label: "Pod Number",
          field: "pod_number",
          align: "center",
          sortable: true
        },
        {
          name: "serial_number",
          label: "Serial Number",
          field: "serial_number",
          align: "center",
          sortable: true
        },
        {
          name: "device_name",
          label: "Device Type",
          field: "device_name",
          align: "center",
          sortable: true
        },
        {
          name: "created_at",
          label: "Create Date",
          align: "center",
          sortable: true
        },
        {
          name: "updated_at",
          label: "Receive Date",
          align: "center",
          sortable: true
        },
        {
          name: "region_name",
          label: "BP Region",
          field: "region_name",
          align: "center",
          sortable: true
        }
      ]
    };
  },

  methods: {
    ...mapActions("InventoryWithSo", [
      "FETCH_INVENTORY_WITH_SO",
      "FETCH_AGGREGATORS_INVENTORY_WITH_SO"
    ]),
    ...mapActions("reports", ["INVENTORY_WITH_SO_LIST_DOWNLOAD"]),

    ajaxLoadAllLeadInfo() {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      this.FETCH_AGGREGATORS_INVENTORY_WITH_SO()
        .then(() => {
          this.tableData = this.getAllAggregatorsInventoryWithSo;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    AggregatorsValues() {
      this.ajaxLoadAllLeadInfo();
    },

    downloadAggregatorsInventoryWithSoList() {
      this.propInventoryWithSo = !this.propInventoryWithSo;
    },

    downloadReport() {
      this.$q.loading.show({ delay: 100 });
      this.INVENTORY_WITH_SO_LIST_DOWNLOAD()
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Success, file has been downloaded",
            icon: "check"
          });
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again",
            icon: "thumb_down"
          });
        });
    }
  },

  mounted() {
    this.AggregatorsValues();
  }
};
</script>

<style scoped>
/* Add custom table styling here if needed */
</style>
