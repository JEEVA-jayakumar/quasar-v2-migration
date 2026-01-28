<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Search Input -->
      <div class="row q-mb-md">
        <div class="col-md-5">
          <q-input
            v-model="filterSearch"
            outlined
            clearable
            debounce="300"
            label="Search by ServiceReqTicketId, TID..."
            dense
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Table -->
      <q-table
        :rows="tableData2"
        :columns="columnDataclosed"
        row-key="id"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="tableAjaxLoading"
        table-class="customTableClass"
        color="dark"
        :filter="filterSearch"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Custom Header -->
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Custom Body -->
        <template v-slot:body="props">
          <q-tr :props="props" class="bottom-border">
            <q-td>
              <q-checkbox
                v-model="props.row.expand"
                color="grey-9"
                :true-value="true"
                :false-value="false"
                checked-icon="fas fa-chevron-up"
                unchecked-icon="fas fa-chevron-down"
                class="q-mr-md"
                @update:model-value="expandRowPlease(props.row)"
              />
              <span>{{ props.row.serviceReqTicketId }}</span>
            </q-td>
            <q-td>{{ props.row.tid }}</q-td>
            <q-td>{{ props.row.mid ?? 'NA' }}</q-td>
            <q-td>{{ formatDate(props.row.createdDate) }}</q-td>
            <q-td>{{ formatDate(props.row.updatedDate) }}</q-td>
            <q-td>{{ props.row.meName ?? 'NA' }}</q-td>
            <q-td>{{ props.row.bpRegion?.regionAreaName ?? 'NA' }}</q-td>
            <q-td>{{ props.row.assignedTo?.name ?? 'NA' }}</q-td>
            <!-- FIXED: Wrap v-html in a span inside q-td -->
            <q-td>
              <span v-if="props.row.crmRemark" v-html="props.row.crmRemark"></span>
              <span v-else>NA</span>
            </q-td>
            <q-td>{{ props.row.deviceType ?? 'NA' }}</q-td>
            <q-td>
              <span v-if="props.row.serviceRequestTicketStatus === 1" class="label text-positive">
                REQUEST_UNASSIGNED
              </span>
              <span v-else-if="props.row.serviceRequestTicketStatus === 2" class="label text-negative">
                REQUEST_ASSIGNED
              </span>
              <span v-else-if="props.row.serviceRequestTicketStatus === 3" class="label text-negative">
                REQUEST_CLOSED
              </span>
              <span v-else>NA</span>
            </q-td>
            <q-td>{{ props.row.serviceRequestMode ?? 'NA' }}</q-td>
            <q-td>
              <span v-if="[1,2,3,4,5,6,7,8,9].includes(props.row.serviceRequestSubTicketStatus)" class="label text-positive">
                {{ subTicketStatusLabel(props.row.serviceRequestSubTicketStatus) }}
              </span>
              <span v-else-if="props.row.serviceRequestSubTicketStatus === 10" class="label text-negative">
                SR_CANCELLED
              </span>
              <span v-else>NA</span>
            </q-td>
          </q-tr>

          <!-- Expanded Row -->
          <q-tr v-show="props.row.expand" class="wordWrapCustom bottom-border">
            <q-td colspan="12">
              <div v-for="sub in props.row.subTicketsList" :key="sub.serviceRequestType?.id" class="q-mb-sm">
                <div class="q-gutter-y-xs">
                  <div><b>Request Type:</b> {{ sub.serviceRequestType?.name ?? 'NA' }}</div>
                  <div><b>Issue Type:</b> {{ sub.serviceRequestIssueType ?? 'NA' }}</div>
                  <div><b>SubTicket Status:</b> {{ sub.serviceRequestSubTicketStatus?.name ?? 'NA' }}</div>
                  <div><b>Schedule Date:</b> {{ sub.scheduleDate ?? 'NA' }}</div>
                  <div><b>Pod Number:</b> {{ sub.podNumber ?? 'NA' }}</div>
                  <div><b>Service Remarks:</b> {{ sub.serviceRemarks ?? 'NA' }}</div>
                  <div><b>Cancel Reason:</b> {{ sub.cancelReason ?? 'NA' }}</div>
                  <div><b>Issue Remark:</b> {{ sub.issueRemark ?? 'NA' }}</div>
                  <div><b>Remark:</b> {{ sub.remark ?? 'NA' }}</div>
                  <div><b>Latitude:</b> {{ sub.latitude ?? 'NA' }}</div>
                  <div><b>Longitude:</b> {{ sub.longitude ?? 'NA' }}</div>
                  <div><b>Implementation Form:</b> {{ sub.implementationForm ?? 'NA' }}</div>
                  <div><b>Picture Of Shop:</b> {{ sub.pictureOfShop ?? 'NA' }}</div>
                  <div><b>Old Sim Number:</b> {{ sub.oldSimNumber ?? 'NA' }}</div>
                  <div><b>Old Sim Network:</b> {{ sub.oldSimNetwork ?? 'NA' }}</div>
                  <div><b>New Sim Number:</b> {{ sub.newSimNumber ?? 'NA' }}</div>
                  <div><b>New Sim Network:</b> {{ sub.newSimNetwork ?? 'NA' }}</div>
                  <div><b>Scan Sim Number:</b> {{ sub.scanSimNumber ?? 'NA' }}</div>
                  <div><b>Scan Device:</b> {{ sub.scanDeviceSerialNumber ?? 'NA' }}</div>
                  <div><b>Part Type:</b> {{ sub.partType ?? 'NA' }}</div>
                  <div><b>Paper Roll Count:</b> {{ sub.paperRollCount ?? 'NA' }}</div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { date } from "quasar";

// State & Refs
const store = useStore();
const tableData2 = ref([]);
const filterSearch = ref("");
const tableAjaxLoading = ref(false);

const paginationControl = ref({
  sortBy: "createdDate",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// Columns definition
const columnDataclosed = [
  { name: "serviceReqTicketId", label: "ServiceReqTicketId", align: "left", field: "serviceReqTicketId", sortable: false },
  { name: "tid", label: "TID", align: "left", field: "tid", sortable: false },
  { name: "mid", label: "MID", align: "left", field: "mid", sortable: false },
  { name: "createdDate", label: "CreatedDate", align: "left", field: "createdDate", sortable: true },
  { name: "updatedDate", label: "UpdatedDate", align: "left", field: "updatedDate", sortable: false },
  { name: "meName", label: "ME Name", align: "left", field: "meName", sortable: false },
  { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName ?? 'NA', sortable: false },
  { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo?.name ?? 'NA', sortable: false },
  { name: "crmRemark", label: "CRM Remark", align: "left", field: "crmRemark", sortable: false },
  { name: "deviceType", label: "DeviceType", align: "left", field: "deviceType", sortable: false },
  { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus", sortable: false },
  { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode", sortable: false },
  { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus", sortable: false },
];

// Computed Getter
const getserviceRequestCancelledDatas = computed(() => store.getters["serviceRequestSat/getserviceRequestCancelledDatas"]);

// Methods
const ajaxLoadAllLeadInfo = async ({ pagination = paginationControl.value, filter = filterSearch.value } = {}) => {
  tableAjaxLoading.value = true;
  try {
    await store.dispatch("serviceRequestSat/FETCH_CANCELLED_SERVICE_REQUEST_DATAS", { pagination, filter });

    const data = getserviceRequestCancelledDatas.value;
    tableData2.value = data.content ?? [];
    paginationControl.value.rowsNumber = data.totalElements ?? 0;
    paginationControl.value.page = (data.number ?? 0) + 1;

    if (data.sort?.length) {
      paginationControl.value.sortBy = data.sort[0].property;
      paginationControl.value.descending = !data.sort[0].ascending;
    }
  } catch (err) {
    console.error(err);
  } finally {
    tableAjaxLoading.value = false;
  }
};

const expandRowPlease = (row) => {
  row.expand = !row.expand;
};

const formatDate = (val) => (val ? date.formatDate(val, "DD MMM YYYY") : "NA");

const subTicketStatusLabel = (status) => {
  const map = {
    1: "SR_TICKET_RAISED",
    2: "SR_TICKET_ESCALATED_TO_SAT",
    3: "SR_ASSIGNED_TO_ENGINEER",
    4: "SR_ISSUE_RESOLVED_COURIERED",
    5: "SR_DEVICE_COURIERED",
    6: "SR_ISSUE_RESOLVED_REMOTELY",
    7: "SR_SCHEDULED_ENGINEER_VISIT",
    8: "SR_ISSUE_RESOLVED",
    9: "SR_MERCHANT_NOT_REACHABLE",
  };
  return map[status] ?? "NA";
};

// On Mounted
onMounted(() => {
  ajaxLoadAllLeadInfo();
});
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}

.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.wordWrapCustom {
  white-space: normal;
  word-wrap: break-word;
}
</style>