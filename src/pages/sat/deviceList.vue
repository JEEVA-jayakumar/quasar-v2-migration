<template>
  <q-page padding>
    <div>
      <!-- START: table title -->
      <div
        class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Merchant Tracker - TID
      </div>
      <!-- END: table title -->

      <!-- START: table data -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="serialnumber"
        flat
      >
        <!-- Custom columns -->
        <template #body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </template>

        <template #body-cell-mid="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </template>

        <template #body-cell-transaction_amount="props">
          Rs. {{ props.row.transaction_amount }}
        </template>

        <template #body-cell-gst="props">
          Rs. {{ props.row.gst }}
        </template>

        <template #body-cell-net_amount="props">
          Rs. {{ props.row.net_amount }}
        </template>

        <template #body-cell-mdr="props">
          Rs. {{ props.row.mdr }}
        </template>

        <!-- Top slot: search, filter, fullscreen -->
        <template #top>
          <div class="row q-col-gutter-md q-mb-md items-center">
            <!-- Search -->
            <div class="col-md-5">
              <q-input
                v-model="filter"
                clearable
                placeholder="Type..."
                label="SO Name, Region, Device Type"
                dense
                outlined
                class="q-mb-sm"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <!-- Filter dropdown -->
            <div class="col-md-5">
              <q-select
                v-model="filter_values"
                label="SO Name"
                outlined
                dense
                :options="data"
                class="q-mb-sm"
              />
            </div>

            <!-- Excel download placeholder -->
            <div class="col-md-2 text-right">
              <!-- Add download button here if needed -->
            </div>
          </div>
        </template>
      </q-table>
      <!-- END: table data -->
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

// Pagination
const paginationControl = ref({
  page: 1,
  rowsPerPage: 10
});

// Search/filter
const filter = ref("");
const filter_values = ref("");

// SO Name dropdown options
const data = ref([
  { label: "ramesh", value: "ramesh" },
  { label: "suresh", value: "suresh" },
  { label: "dinesh", value: "dinesh" }
]);

// Table columns
const columns = ref([
  {
    name: "soname",
    label: "SO Name",
    align: "left",
    field: "soname",
    sortable: true
  },
  {
    name: "region",
    label: "Region",
    align: "center",
    field: "region",
    sortable: true
  },
  {
    name: "devicename",
    label: "Device Name",
    align: "left",
    field: "devicename",
    sortable: true
  },
  {
    name: "serialnumber",
    label: "Serial Number",
    align: "left",
    field: "serialnumber",
    sortable: true
  },
  {
    name: "count",
    label: "Number of Device",
    align: "left",
    field: "count",
    sortable: true
  }
]);

// Table data
const tableData = ref([
  {
    soname: "suresh",
    region: "chennai",
    devicename: "GPRS",
    serialnumber: "123456",
    count: "1"
  },
  {
    soname: "suresh",
    region: "chennai",
    devicename: "GPRS",
    serialnumber: "123457",
    count: "1"
  },
  {
    soname: "suresh",
    region: "chennai",
    devicename: "GPRS",
    serialnumber: "123458",
    count: "1"
  },
  {
    soname: "suresh",
    region: "chennai",
    devicename: "GPRS",
    serialnumber: "123459",
    count: "1"
  },
  {
    soname: "suresh",
    region: "chennai",
    devicename: "GPRS",
    serialnumber: "123460",
    count: "1"
  }
]);
</script>

<style scoped>
/* Optional: keep your custom table styles */
.customTableClass .q-td {
  padding: 6px 12px;
}
</style>
