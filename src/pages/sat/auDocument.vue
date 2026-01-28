<template>
  <q-page padding>

    <!-- START: Table Title -->
    <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Bijlipay Implementation Verification Queue
    </div>
    <!-- END: Table Title -->

    <!-- Lead Information Modal -->
    <generalLeadInformation 
      v-if="propToggleLeadInformation" 
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" 
      @closeLeadInformation="toggleLeadInformation" 
    />

    <!-- Main Table -->
    <q-table
      class="customTableClass"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="tid"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >

      <!-- Column Slots -->
      <template v-slot:body-cell-tid="props">
        <span class="label text-primary"># {{ props.row.tid }}</span>
      </template>

      <template v-slot:body-cell-mid="props">
        <span class="label text-primary"># {{ props.row.mid }}</span>
      </template>

      <template v-slot:body-cell-leadNumber="props">
        <span class="label text-primary cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
          # {{ props.row.leadInformation.leadNumber }}
        </span>
      </template>

      <template v-slot:body-cell-LeadSource="props">
        <span :class="{ 'text-red': props.row.leadInformation.leadSource.sourceName === 'LS_TOHANDS' }">
          {{ props.row.leadInformation.leadSource.sourceName }}
        </span>
      </template>

      <template v-slot:body-cell-mobileNumber="props">
        {{ props.row.assignedTo?.contactNumber ?? "NA" }}
      </template>

      <template v-slot:body-cell-leadAddress="props">
        {{ props.row.leadInformation?.leadAddress ?? "NA" }}
      </template>

      <template v-slot:body-cell-deviceStatusDate="props">
        <span class="label">{{ formatDate(props.row.deviceStatusDate) }}</span>
      </template>

      <!-- Implementation Form -->
      <template v-slot:body-cell-viewDocument="props">
        <div v-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
          <div @click="fnPDFViewModal(props.row.implementationForm)">
            <q-icon name="fas fa-file-pdf" color="primary" /> &nbsp;{{ props.row.implementationForm }}
          </div>
        </div>

        <div v-else-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('image/')"
          class="cursor-pointer"
        >
          <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]">
            <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm" style="max-width: 15%;" />
          </viewer>
        </div>

        <div v-else>NA Document</div>
      </template>

      <!-- Picture of Shop -->
      <template v-slot:body-cell-pictureOfShop="props">
        <div v-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
          <div @click="fnPDFViewModal(props.row.pictureOfShop)">
            <q-icon name="fas fa-file-pdf" color="primary" /> &nbsp;{{ props.row.pictureOfShop }}
          </div>
        </div>

        <div v-else-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('image/')"
          class="cursor-pointer"
        >
          <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]">
            <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop" style="max-width: 15%;" />
          </viewer>
        </div>

        <div v-else>NA Document</div>
      </template>

      <!-- CPV Form -->
      <template v-slot:body-cell-cpvForm="props">
        <div v-if="!props.row.cpvFormMimeType || props.row.cpvFormMimeType.includes('application/pdf')" class="cursor-pointer">
          <div @click="fnPDFViewModal(props.row.cpvForm)">
            <q-icon name="fas fa-file-pdf" color="primary" /> &nbsp;{{ props.row.cpvForm }}
          </div>
        </div>

        <div v-else-if="!props.row.cpvFormMimeType || props.row.cpvFormMimeType.includes('image/')" class="cursor-pointer">
          <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]">
            <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm" style="max-width: 15%;" />
          </viewer>
        </div>

        <div v-else>NA Document</div>
      </template>

      <!-- Status -->
      <template v-slot:body-cell-status="props">
        <span v-if="props.row.deviceStatus === 6" class="label text-positive">Approved</span>
        <span v-else-if="props.row.deviceStatus === 7" class="label text-negative">Pending</span>
        <span v-else class="label text-amber">NA</span>
      </template>

      <!-- Approve Button -->
      <template v-slot:body-cell-action="props">
        <q-btn 
          v-if="props.row.deviceStatus === 6" 
          disable dense no-caps no-wrap label="Already Approved" icon="block" 
          size="md" @click="fnShowConvertToSat(props.row)" 
        />
        <q-btn 
          v-else 
          dense no-caps no-wrap label="Approve" icon="done" 
          size="md" color="green-5" @click="fnShowConvertToSat(props.row)" 
        />
      </template>

      <!-- Reject Button -->
      <template v-slot:body-cell-data="props">
        <q-btn 
          v-if="props.row.deviceStatus === 6" 
          disable dense no-caps no-wrap label="Reject" icon="block" 
          size="md" @click="fnShowConvertToSat(props.row)" 
        />
        <q-btn 
          v-else 
          dense no-caps no-wrap label="Reject" icon="close" 
          size="md" color="red-5" @click="fnShowConvertReject(props.row)" 
        />
      </template>

      <!-- Top Section -->
      <template v-slot:top>
        <div class="row items-center q-mb-md">
          <div class="col-5">
            <q-input filled v-model="filter" clearable debounce="300" placeholder="Search by MID, TID, Merchant Name" />
          </div>

          <div class="col-2">
            <q-input filled v-model="formData.fromDate" mask="date" :rules="[dateRule]" placeholder="From Date" />
          </div>

          <div class="col-2">
            <q-input filled v-model="formData.toDate" mask="date" :rules="[dateRule]" placeholder="To Date" />
          </div>

          <div class="col-2">
            <q-btn color="purple-9" :disable="!isDateRangeValid" @click="SubmitData(formData)">Submit</q-btn>
            <q-btn color="red" v-if="selectedRow" @click="DeleteData"><q-icon name="delete" /></q-btn>
          </div>
        </div>
      </template>

    </q-table>

    <!-- Merchant Transaction Details Modal -->
    <showMerchantTransactionLevelDetails 
      v-if="valueToggleMerchantTransaction" 
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction" 
      @revertRowClick="rowClick"
    />

    <!-- PDF Modal -->
    <showPdfModalComponent 
      v-if="toggleshowPDFModal" 
      :propToggleshowPDFModal="toggleshowPDFModal" 
      :propPDFDetails="PDFDetails" 
      @togglePDFModal="fnPDFViewModal"
    />

    <!-- Approve Modal -->
    <viewDocumentApprove 
      v-if="propShowConvertToSat" 
      :propShowConvertToSat="propShowConvertToSat" 
      :propRowDetails="propRowDetails" 
      @emitfnshowConvertToSat="fnShowConvertToSat"
    />

    <!-- Reject Modal -->
    <viewDocumentReject 
      v-if="propShowViewReject" 
      :propShowViewReject="propShowViewReject" 
      :propRowDetails="propRowDetails" 
      @emitfnshowConvertToSat="fnShowConvertReject"
    />

  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { date } from "quasar";
import { useStore } from "vuex";

import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import viewDocumentApprove from "../../components/sat/viewDocumentApprove.vue";
import viewDocumentReject from "../../components/sat/viewRejectDocument.vue";

const store = useStore();

const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const toggleshowPDFModal = ref(false);
const PDFDetails = ref("");
const propShowConvertToSat = ref(false);
const propShowViewReject = ref(false);
const propRowDetails = ref(null); // Added missing ref
const tableData = ref([]);
const valueToggleMerchantTransaction = ref(false);
const filter = ref("");
const selectedRow = ref(null);
const toggleAjaxLoadFilter = ref(false);

const formData = reactive({ fromDate: "", toDate: "" });
const formData1 = reactive({ fromDate: "", toDate: "" });

const paginationControl = reactive({
  rowsNumber: 10,
  page: 1,
  sortBy: "deviceStatusDate",
  descending: false,
  rowsPerPage: 10,
});

// Date formatting function to replace the deprecated filter
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v-20)%10] || s[v] || s[0]);
    };
    
    return `${getOrdinalSuffix(day)} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Computed getters from store
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
const getEquitasReport = computed(() => store.getters["equitasImplementedQueue/getEquitasReport"]);

// Date validation computed property
const isDateRangeValid = computed(() => {
  return formData.fromDate && formData.toDate && formData.fromDate <= formData.toDate;
});

// Date rule for validation
const dateRule = (val) => {
  if (!val) return true;
  return date.isValid(val) || "Please enter a valid date";
};

// Columns
const columns = [
  { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
  { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
  { name: "leadNumber", label: "Lead Id", align: "left", field: row => row.leadInformation.leadNumber },
  { name: "LeadSource", label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource.sourceName },
  { name: "leadInformation", label: "ME Name", align: "left", field: row => row.leadInformation.leadName },
  { name: "leadAddress", label: "Merchant Address", align: "center", field: row => row.leadInformation.leadAddress },
  { name: "deviceName", label: "Device type", align: "right", field: row => row.leadInformation.device?.deviceName ?? "NA" },
  { name: "regionalInventory.serialNumber", label: "Device Serial Number", align: "left", field: row => row.leadInformation.leadSource.sourceName === "LS_TOHANDS" ? (row.toHandsSerialNumber ?? "NA") : (row.regionalInventory?.serialNumber ?? "NA"), sortable: true },
  { name: "deviceStatusDate", label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
  { name: "assignedTo", label: "Implemented by", align: "left", field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : "NA" },
  { name: "deviceAddress", label: "Implemented Address", align: "left", field: row => row.deviceAddress },
  { name: "pincode", label: "Merchants Pincode", align: "left", field: row => row.leadInformation.pincode ?? "NA" },
  { name: "city", label: "Merchants City Town", align: "left", field: row => row.leadInformation.city ?? "NA" },
  { name: "mobileNumber", label: "FSE Mobile Number", align: "center", field: row => row.assignedTo?.contactNumber ?? "NA" },
  { name: "status", label: "Device Status", align: "center", field: "deviceStatus", sortable: false },
  { name: "viewDocument", label: "Implementation Form", align: "center", field: "implementationForm", sortable: false },
  { name: "pictureOfShop", label: "PictureOfShop", align: "center", field: "pictureOfShop", sortable: false },
  { name: "cpvForm", label: "cpvForm", align: "center", field: "cpvForm", sortable: false },
  { name: "action", label: "Approve", align: "center", field: "action", sortable: false },
  { name: "data", label: "Reject", align: "center", field: "data", sortable: false },
];

// Methods
function toTimestamp(strDate, isFromDate = true) {
  if (!strDate) return "";
  const datePart = strDate.split("T")[0];
  const timeStr = isFromDate ? "00:00:00" : "23:59:00";
  return Date.parse(`${datePart}T${timeStr}Z`);
}

function SubmitData(request) {
  formData1.fromDate = toTimestamp(request.fromDate, true);
  formData1.toDate = toTimestamp(request.toDate, false);

  if (formData1.fromDate && formData1.toDate && formData1.fromDate <= formData1.toDate) {
    selectedRow.value = request;
    ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value, formData: formData1 });
  } else {
    window.$q.notify({
      color: "negative",
      position: "bottom",
      message: "Please enter valid dates. TO Date must be greater than From Date",
      icon: "thumb_down",
    });
  }
}

function DeleteData() {
  formData.fromDate = "";
  formData.toDate = "";
  formData1.fromDate = "";
  formData1.toDate = "";
  selectedRow.value = null;
  ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value, formData: formData1 });
}

function toggleLeadInformation(details) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (details) addtnLeadInformation.value = details;
}

function fnPDFViewModal(documentUrl) {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
}

function fnShowConvertToSat(rowDetails) {
  propShowConvertToSat.value = !propShowConvertToSat.value;
  if (rowDetails) propRowDetails.value = rowDetails;
}

function fnShowConvertReject(rowDetails) {
  propShowViewReject.value = !propShowViewReject.value;
  if (rowDetails) propRowDetails.value = rowDetails;
}

function ajaxLoadAllLeadInfo({ pagination, filter, formData }) {
  toggleAjaxLoadFilter.value = true;
  store.dispatch("equitasImplementedQueue/EQUITAS_TRACKER_LIST", { pagination, filter, formData })
    .finally(() => {
      tableData.value = getEquitasReport.value.content;
      paginationControl.rowsNumber = getEquitasReport.value.totalElements;
      paginationControl.page = getEquitasReport.value.number + 1;
      toggleAjaxLoadFilter.value = false;
    });
}

onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value, formData });
});

</script>

<style scoped>
.customTableClass .q-td {
  vertical-align: middle;
}
</style>