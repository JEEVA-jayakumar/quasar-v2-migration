<template>
  <q-page padding>
    <div>
      <q-table
        :rows="tableData"
        :columns="columnDatacancelled"
        table-class="customTableClass"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        row-key="id"
        :loading="tableAjaxLoading"
        :rows-per-page-options="[5, 10, 15, 20]"
        color="dark"
        @request="ajaxLoadAllClosedInfo"
      >
        <!-- START: Top Row Header -->
        <template v-slot:top-row="props">
          <q-tr>
            <q-th auto-width></q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- START: Body -->
        <template v-slot:body="props">
          <!-- Table Row -->
          <q-tr :props="props" class="bottom-border">
            <q-td key="serviceReqTicketId">
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
            <q-td key="tid">{{ props.row.tid || 'NA' }}</q-td>
            <q-td key="mid">{{ props.row.mid || 'NA' }}</q-td>
            <!-- FIXED: Replaced filter with method call -->
            <q-td key="createdDate">{{ formatDate(props.row.createdDate, 'Do MMM Y') }}</q-td>
            <q-td key="updatedDate">{{ formatDate(props.row.updatedDate, 'Do MMM Y') }}</q-td>
            <q-td key="meName">{{ props.row.meName || 'NA' }}</q-td>
            <q-td key="address">{{ props.row.address || 'NA' }}</q-td>
            <q-td key="contactNumber">{{ props.row.contactNumber || 'NA' }}</q-td>
            <q-td key="pincode">{{ props.row.pincode || 'NA' }}</q-td>
            <q-td key="bpRegion">{{ props.row.bpRegion?.regionAreaName || 'NA' }}</q-td>
            <q-td key="assignedTo">
              {{ props.row.assignedTo ? props.row.assignedTo.name + ' | ' + props.row.assignedTo.employeeID : 'NA' }}
            </q-td>
            <q-td key="crmRemark">
              <span v-if="props.row.crmRemark" v-html="props.row.crmRemark"></span>
              <span v-else>NA</span>
            </q-td>
            <q-td key="deviceType">{{ props.row.deviceType || 'NA' }}</q-td>
            <q-td key="serviceRequestTicketStatus">
              <span class="label text-positive" v-if="props.row.serviceRequestTicketStatus === 1">REQUEST_UNASSIGNED</span>
              <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus === 2">REQUEST_ASSIGNED</span>
              <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus === 3">REQUEST_CLOSED</span>
              <span class="label" v-else>NA</span>
            </q-td>
            <q-td key="serviceRequestMode">{{ props.row.serviceRequestMode || 'NA' }}</q-td>
            <q-td key="serviceRequestSubTicketStatus">
              <span v-for="status in subTicketStatuses" :key="status.value">
                <span
                  v-if="props.row.serviceRequestSubTicketStatus === status.value"
                  :class="status.class"
                >{{ status.label }}</span>
              </span>
            </q-td>
          </q-tr>

          <!-- START: Expanded Row -->
          <q-tr v-show="props.row.expand" class="wordWrapCustom bottom-border">
            <q-td colspan="100%">
              <div v-for="sub in props.row.subTicketsList" :key="sub.serviceRequestType?.id" class="q-mb-sm">
                <div class="q-gutter-y-sm row">
                  <div class="col q-caption text-grey-8 text-weight-medium">Request Type</div>
                  <div class="col">{{ sub.serviceRequestType?.name || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Issue Type</div>
                  <div class="col">{{ sub.serviceRequestIssueType || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                  <div class="col">{{ sub.serviceRequestSubTicketStatus?.name || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Schedule Date</div>
                  <div class="col">{{ formatDate(sub.scheduleDate, 'Do MMM Y') || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Pod Number</div>
                  <div class="col">{{ sub.podNumber || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Service Remarks</div>
                  <div class="col">{{ sub.serviceRemarks || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Cancel Reason</div>
                  <div class="col">{{ sub.cancelReason || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Issue Remark</div>
                  <div class="col">{{ sub.issueRemark || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Remark</div>
                  <div class="col">{{ sub.remark || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Latitude</div>
                  <div class="col">{{ sub.latitude || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Longitude</div>
                  <div class="col">{{ sub.longitude || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Implementation Form</div>
                  <div class="col">{{ sub.implementationForm || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Picture Of Shop</div>
                  <div class="col">{{ sub.pictureOfShop || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Old Sim Number</div>
                  <div class="col">{{ sub.oldSimNumber || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Old Sim Network</div>
                  <div class="col">{{ sub.oldSimNetwork || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">New Sim Number</div>
                  <div class="col">{{ sub.newSimNumber || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">New Sim Network</div>
                  <div class="col">{{ sub.newSimNetwork || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Scan Sim Number</div>
                  <div class="col">{{ sub.scanSimNumber || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Scan Device</div>
                  <div class="col">{{ sub.scanDeviceSerialNumber || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Part Type</div>
                  <div class="col">{{ sub.partType || 'NA' }}</div>

                  <div class="col q-caption text-grey-8 text-weight-medium">Paper Roll Count</div>
                  <div class="col">{{ sub.paperRollCount || 'NA' }}</div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- START: Top search bar -->
        <template v-slot:top>
          <q-search
            v-model="filterSearch"
            placeholder="Type.."
            float-label="Search By ServiceReqTicketId, TID .."
            clearable
            color="grey-9"
            class="q-mr-lg q-py-sm col-md-5"
          />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import moment from "moment"; // Import moment.js

export default {
  setup() {
    const store = useStore();

    const tableData = ref([]);
    const filterSearch = ref("");
    const tableAjaxLoading = ref(false);

    const paginationControl = ref({
      sortBy: "createdDate",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });

    // Format date method
    const formatDate = (dateString, format = 'Do MMM Y') => {
      if (!dateString) return 'NA';
      return moment(dateString).format(format);
    };

    const columnDatacancelled = [
      { name: "serviceReqTicketId", label: "ServiceReq", align: "left", field: row => row.serviceReqTicketId },
      { name: "tid", label: "TID", align: "left", field: row => row.tid || "NA" },
      { name: "mid", label: "MID", align: "left", field: row => row.mid || "NA" },
      { name: "createdDate", label: "CreatedDate", align: "left", field: row => formatDate(row.createdDate, 'Do MMM Y'), sortable: true },
      { name: "updatedDate", label: "UpdatedDate", align: "left", field: row => formatDate(row.updatedDate, 'Do MMM Y') },
      { name: "meName", label: "Merchant Name", align: "left", field: row => row.meName || "NA" },
      { name: "address", label: "Address", align: "left", field: row => row.address || "NA" },
      { name: "contactNumber", label: "Contact Number", align: "left", field: row => row.contactNumber || "NA" },
      { name: "pincode", label: "Pincode", align: "left", field: row => row.pincode || "NA" },
      { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName || "NA" },
      { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo ? row.assignedTo.name + " | " + row.assignedTo.employeeID : "NA" },
      { name: "crmRemark", label: "CRM Remark", align: "left", field: row => row.crmRemark || "NA" },
      { name: "deviceType", label: "DeviceType", align: "left", field: row => row.deviceType || "NA" },
      { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: row => row.serviceRequestTicketStatus },
      { name: "serviceRequestMode", label: "RequestMode", align: "left", field: row => row.serviceRequestMode || "NA" },
      { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: row => row.serviceRequestSubTicketStatus },
    ];

    const getserviceRequestPhonepeCancelledDatas = computed(() => store.getters["serviceRequestPhonepeSat/getserviceRequestPhonepeCancelledDatas"]);

    const subTicketStatuses = [
      { value: 1, label: "SR_TICKET_RAISED", class: "label text-positive" },
      { value: 2, label: "SR_TICKET_ESCALATED_TO_SAT", class: "label text-positive" },
      { value: 3, label: "SR_ASSIGNED_TO_ENGINEER", class: "label text-positive" },
      { value: 4, label: "SR_ISSUE_RESOLVED_COURIERED", class: "label text-positive" },
      { value: 5, label: "SR_DEVICE_COURIERED", class: "label text-positive" },
      { value: 6, label: "SR_ISSUE_RESOLVED_REMOTELY", class: "label text-positive" },
      { value: 7, label: "SR_SCHEDULED_ENGINEER_VISIT", class: "label text-positive" },
      { value: 8, label: "SR_ISSUE_RESOLVED", class: "label text-positive" },
      { value: 9, label: "SR_MERCHANT_NOT_REACHABLE", class: "label text-positive" },
      { value: 10, label: "SR_CANCELLED", class: "label text-negative" }
    ];

    const ajaxLoadAllClosedInfo = async ({ pagination, filter }) => {
      tableAjaxLoading.value = true;

      try {
        await store.dispatch("serviceRequestPhonepeSat/FETCH_PHONEPE_CANCELLED_SERVICE_REQUEST_DATAS", { pagination, filter });

        paginationControl.value.rowsNumber = getserviceRequestPhonepeCancelledDatas.value.totalElements;
        paginationControl.value.page = getserviceRequestPhonepeCancelledDatas.value.number + 1;
        paginationControl.value.sortBy = getserviceRequestPhonepeCancelledDatas.value.sort?.[0]?.property || "createdDate";
        paginationControl.value.descending = getserviceRequestPhonepeCancelledDatas.value.sort?.[0]?.ascending || false;

        tableData.value = getserviceRequestPhonepeCancelledDatas.value.content;
      } catch (err) {
        console.error(err);
      } finally {
        tableAjaxLoading.value = false;
      }
    };

    const expandRowPlease = (row) => {
      row.expand = !row.expand;
    };

    onMounted(() => {
      ajaxLoadAllClosedInfo({ pagination: paginationControl.value, filter: filterSearch.value });
    });

    return {
      tableData,
      filterSearch,
      paginationControl,
      tableAjaxLoading,
      columnDatacancelled,
      ajaxLoadAllClosedInfo,
      expandRowPlease,
      subTicketStatuses,
      formatDate // Make formatDate available in template
    };
  }
};
</script>