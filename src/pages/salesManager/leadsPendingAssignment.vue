<template>
  <q-page padding>
    <div>
      <!-- Table title -->
      <div class="row bottom-border items-center q-px-lg q-py-md">
        <div class="col q-title text-weight-regular text-grey-9">
          Leads Pending Assignment
        </div>
      </div>

      <!-- Leads Pending Assignment Table -->
      <q-table
        table-class="customTableClass"
        class="q-py-none"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="leadId"
      >
        <!-- Top slot: search -->
        <template #top>
          <div class="row bottom-border q-pa-sm items-center">
            <div class="col-md-5">
              <q-input
                filled
                clearable
                v-model="filter"
                label="Search by SO name, Merchant Name, Lead ID"
                placeholder="Type.."
                dense
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>

      <!-- Ajax spinner overlay -->
      <q-spinner-bars
        v-if="toggleAjaxLoadFilter"
        class="absolute-full bg-white bg-opacity-60"
        color="#61116a"
        size="35"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "LeadsPendingAssignment",
  setup() {
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);

    const paginationControl = reactive({
      rowsPerPage: 10
    });

    const columns = [
      { name: "dateCreated", label: "Date Created", align: "left", field: "dateCreated", sortable: true },
      { name: "submittedOn", label: "Submitted On", align: "center", field: "submittedOn", sortable: true },
      { name: "leadId", label: "Lead ID", align: "left", field: "leadId", sortable: true },
      { name: "merchant_name", label: "Merchant Name", align: "left", field: "merchant_name", sortable: true },
      { name: "location", label: "Location", align: "left", field: "location", sortable: true },
      { name: "so_name", label: "SO Name", align: "left", field: "so_name", sortable: true }
    ];

    const tableData = ref([
      {
        dateCreated: "29 Apr, 2018",
        submittedOn: "29 Apr, 2018",
        leadId: 545454,
        merchant_name: "Bombay Fries",
        location: "Chennai",
        so_name: "Dinesh"
      },
      {
        dateCreated: "29 Apr, 2018",
        submittedOn: "29 Apr, 2018",
        leadId: 545455,
        merchant_name: "Bombay Fries",
        location: "Chennai",
        so_name: "Dinesh"
      },
      // ... duplicate data removed for brevity
    ]);

    return {
      filter,
      toggleAjaxLoadFilter,
      paginationControl,
      columns,
      tableData
    };
  }
};
</script>

<style scoped>
.absolute-full {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
