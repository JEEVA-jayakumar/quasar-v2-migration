<template>
  <q-page padding>
    <div>
      <!--START: table title -->
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Aging Tracker for Pending Leads
      </div>
      <!--END: table title -->

      <!--START: table lead validation -->
      <q-table
        title="Lead Validation"
        table-class="customTableClass"
        class="q-py-none"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        row-key="soName"
        v-model:pagination="paginationControl"
      >
        <template #top>
          <div class="row bottom-border q-pa-sm items-center">
            <!--START: table filter/search -->
            <div class="col-md-5">
              <q-input
                filled
                clearable
                v-model="filter"
                label="Search by SO name, Merchant Name, Lead ID"
                placeholder="Type.."
                class="q-mr-lg q-py-sm"
                dense
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <!--END: table filter/search -->
          </div>
        </template>
      </q-table>
      <!--END: table lead validation -->

      <!--START >> Show Ajax Spinner -->
      <q-spinner-bars
        v-if="toggleAjaxLoadFilter"
        class="absolute-full bg-white bg-opacity-60"
        color="#61116a"
        size="35"
      />
      <!--END >> Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "leadsPendingAssignment",
  setup() {
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const paginationControl = reactive({ rowsPerPage: 10 });

    const columns = [
      {
        name: "soName",
        required: true,
        label: "SO Name",
        align: "left",
        field: "soName",
        sortable: true,
      },
      {
        name: "shortLead",
        required: true,
        label: "Short Lead",
        align: "center",
        field: "shortLead",
        sortable: true,
      },
      {
        name: "fullLead",
        required: true,
        label: "Full Lead",
        align: "left",
        field: "fullLead",
        sortable: true,
      },
      {
        name: "pendingDays",
        required: true,
        label: "Pending Days",
        align: "left",
        field: "pendingDays",
        sortable: true,
      },
    ];

    const tableData = ref([
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
      { soName: "Arun Kumar", shortLead: 4, fullLead: 7, pendingDays: ">7 days" },
    ]);

    return {
      filter,
      toggleAjaxLoadFilter,
      paginationControl,
      columns,
      tableData,
    };
  },
};
</script>

<style scoped>
/* Spinner overlay */
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
