<template>
  <q-page>
    <div>
      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Merchant Tracker - Transaction Level
      </div>

      <!-- Table -->
      <q-table
        table-class="customTableClass"
        :data="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="tid"
      >
        <!-- Row Click Template -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="cursor-pointer"
            @click="rowClick(props.row)"
          >
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.field === 'tid'">
                <span class="label text-primary"># {{ col.value }}</span>
              </div>
              <div v-else-if="col.field === 'mid'">
                <span class="label text-primary"># {{ col.value }}</span>
              </div>
              <div v-else>
                {{ col.value }}
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- Top Slot: Search, Date Filter, Excel Download -->
        <template v-slot:top>
          <div class="row q-pa-sm items-center">
            <!-- Search -->
            <div class="col-5">
              <q-search
                clearable
                v-model="filter"
                separator
                color="grey-9"
                placeholder="Type.."
                float-label="Search by MID, TID, Merchant Name, MCC, UTR Number, Device Type"
                class="q-mr-lg q-py-sm"
              />
            </div>

            <!-- Date Filter -->
            <div class="col-3">
              <q-datetime
                v-model="filter_values"
                type="date"
                modal
                outline
                placeholder="Select Date"
                float-label="Filter By"
                color="grey-9"
                class="q-mr-lg q-py-sm"
              />
            </div>

            <!-- Excel Download -->
            <div class="col-md-4 text-right">
              <downloadExcel
                :data="tableData"
                :fields="excelFields"
                name="Merchant Transaction Level.xls"
              >
                <q-btn
                  outline
                  color="grey-9"
                  label="Download as Excel"
                  class="q-mr-lg q-py-sm"
                  size="md"
                />
              </downloadExcel>
            </div>
          </div>
        </template>
      </q-table>

      <!-- Child Component: Transaction Details -->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import downloadExcel from "vue-json-excel";

export default {
  name: "MerchantTransactionLevel",
  components: {
    showMerchantTransactionLevelDetails,
    downloadExcel
  },
  setup() {
    // Search & Date Filter
    const filter = ref("");
    const filter_values = ref("");

    // Toggle for Child Component
    const valueToggleMerchantTransaction = ref(false);

    // Pagination
    const paginationControl = ref({
      page: 1,
      rowsPerPage: 10
    });

    // Table Columns
    const columns = ref([
      { name: "date", label: "Date", align: "left", field: "date", sortable: true },
      { name: "tid", label: "TID", align: "center", field: "tid", sortable: true },
      { name: "rrn", label: "RRN", align: "left", field: "rrn", sortable: true },
      { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
      { name: "merchant_name", label: "Merchant Name", align: "left", field: "merchant_name", sortable: true },
      { name: "location", label: "Location", align: "left", field: "location", sortable: true },
      { name: "device_type", label: "Device Type", align: "center", field: "device_type", sortable: true },
      { name: "mcc", label: "MCC", align: "center", field: "mcc", sortable: true },
      { name: "transaction_type", label: "Transaction Type", align: "center", field: "transaction_type", sortable: true },
      { name: "transaction_amount", label: "Transaction Amount (INR)", align: "center", field: "transaction_amount", sortable: true },
      { name: "mdr", label: "MDR (INR)", align: "center", field: "mdr", sortable: true },
      { name: "gst", label: "GST (INR)", align: "center", field: "gst", sortable: true },
      { name: "source", label: "Source", align: "left", field: "source", sortable: true }
    ]);

    // Table Data
    const tableData = ref([
      {
        date: "20 Apr, 2018",
        tid: 554845,
        rrn: 4845,
        mid: 554845,
        merchant_name: "Bombay Fries",
        location: "Tamilnadu",
        device_type: "mPOS",
        mcc: 18245,
        transaction_type: "Debit",
        transaction_amount: 500,
        mdr: 5,
        gst: 2,
        source: "Bank"
      },
      // ... duplicate rows can be added here
    ]);

    // Excel Fields (column name => label)
    const excelFields = computed(() => {
      const fields = {};
      columns.value.forEach(col => {
        fields[col.name] = col.label;
      });
      return fields;
    });

    // Row Click Toggle
    function rowClick() {
      valueToggleMerchantTransaction.value = !valueToggleMerchantTransaction.value;
    }

    return {
      filter,
      filter_values,
      columns,
      tableData,
      paginationControl,
      valueToggleMerchantTransaction,
      excelFields,
      rowClick
    };
  }
};
</script>

<style scoped>
/* Optional: Scoped styling */
.cursor-pointer {
  cursor: pointer;
}
</style>
