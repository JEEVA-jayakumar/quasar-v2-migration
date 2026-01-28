<template>
  <q-page>
    <div>
      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Merchant Tracker - TID
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
        <!-- Body Cell Templates -->
        <template v-slot:body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </template>

        <template v-slot:body-cell-mid="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </template>

        <template v-slot:body-cell-transaction_amount="props">
          Rs. {{ props.row.transaction_amount }}
        </template>

        <template v-slot:body-cell-gst="props">
          Rs. {{ props.row.gst }}
        </template>

        <template v-slot:body-cell-net_amount="props">
          Rs. {{ props.row.net_amount }}
        </template>

        <template v-slot:body-cell-mdr="props">
          Rs. {{ props.row.mdr }}
        </template>

        <!-- Top Slot: Search, Date Filter, Excel Download -->
        <template v-slot:top>
          <div class="row q-pa-sm items-center">

            <!-- Search -->
            <div class="col-md-5">
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
            <div class="col-md-3">
              <q-datetime
                v-model="filter_values"
                type="date"
                float-label="Date Filter"
                class="q-mr-lg q-py-sm"
                color="grey-9"
              />
            </div>

            <!-- Excel Download -->
            <div class="col-md-4 text-right">
              <downloadExcel
                :data="tableData"
                :fields="excelFields"
                name="Merchant Tracker - TID.xls"
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
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import downloadExcel from "vue-json-excel";

export default {
  name: "MerchantTracker",
  components: { downloadExcel },
  setup() {
    // Search & Date Filter
    const filter = ref("");
    const filter_values = ref("");

    // Pagination
    const paginationControl = ref({
      page: 1,
      rowsPerPage: 10,
    });

    // Table Columns
    const columns = ref([
      { name: "on_boarded_date", label: "On Boarded Date", align: "left", field: "on_boarded_date", sortable: true },
      { name: "tid", label: "TID", align: "center", field: "tid", sortable: true },
      { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
      { name: "merchant_name", label: "Merchant Name", align: "left", field: "merchant_name", sortable: true },
      { name: "location", label: "Location", align: "left", field: "location", sortable: true },
      { name: "device_type", label: "Device Type", align: "left", field: "device_type", sortable: true },
      { name: "mcc", label: "MCC", align: "left", field: "mcc", sortable: true },
      { name: "transaction_amount", label: "Transaction Amount", align: "center", field: "transaction_amount", sortable: true },
      { name: "count", label: "Count", align: "center", field: "count", sortable: true },
      { name: "mdr", label: "MDR (INR)", align: "center", field: "mdr", sortable: true },
      { name: "gst", label: "GST (INR)", align: "center", field: "gst", sortable: true },
      { name: "net_amount", label: "Net Amount (INR)", align: "center", field: "net_amount", sortable: true },
      { name: "utr", label: "UTR", align: "center", field: "utr", sortable: true },
      { name: "settlement_date", label: "Settlement Date", align: "center", field: "settlement_date", sortable: true },
    ]);

    // Table Data
    const tableData = ref([
      {
        on_boarded_date: "20 Apr, 2018",
        tid: 554845,
        mid: "554845",
        merchant_name: "Bombay Fries",
        location: "Tamilnadu",
        device_type: "mPOS",
        mcc: "18245",
        transaction_amount: 500,
        count: 100,
        mdr: 5,
        gst: 2,
        net_amount: 2,
        utr: "6546AF6322",
        settlement_date: "20 Apr, 2018",
      },
      // ... more rows
    ]);

    // Excel Fields (dynamic mapping of column names to labels)
    const excelFields = computed(() => {
      const fields = {};
      columns.value.forEach(col => {
        fields[col.name] = col.label;
      });
      return fields;
    });

    return {
      filter,
      filter_values,
      paginationControl,
      columns,
      tableData,
      excelFields
    };
  },
};
</script>

<style scoped>
/* Optional: Scoped styling for the table page */
</style>
