<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Page Title -->
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay De-Active List
      </div>

      <!-- Lead Information Modal -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Data Table -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="tid"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="onRequest"
      >
        <!-- Custom Cells -->
        <template v-slot:body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </template>

        <template v-slot:body-cell-mid="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label text-primary cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            # {{ props.row.leadInformation.leadNumber }}
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

        <!-- Document Cells -->
        <template v-slot:body-cell-viewDocument="props">
          <div class="cursor-pointer">
            <div v-if="isPDF(props.row.implementationFormMimeType)" @click="fnPDFViewModal(props.row.implementationForm)">
              <q-icon name="fas fa-file-pdf" color="primary" /> &nbsp; {{ props.row.implementationForm }}
            </div>
            <div v-else-if="isImage(props.row.implementationFormMimeType)" @click="fnViewMultiAttachedFileImageUploadedBySat">
              <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]">
                <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm" style="max-width: 15%" />
              </viewer>
            </div>
            <div v-else>NA Document</div>
          </div>
        </template>

        <template v-slot:body-cell-pictureOfShop="props">
          <div class="cursor-pointer">
            <div v-if="isPDF(props.row.pictureOfShopMimeType)" @click="fnPDFViewModal(props.row.pictureOfShop)">
              <q-icon name="fas fa-file-pdf" color="primary" /> &nbsp; {{ props.row.pictureOfShop }}
            </div>
            <div v-else-if="isImage(props.row.pictureOfShopMimeType)" @click="fnViewMultiAttachedFileImageUploadedByPictureShop">
              <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]">
                <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop" style="max-width: 15%" />
              </viewer>
            </div>
            <div v-else>NA Document</div>
          </div>
        </template>

        <template v-slot:body-cell-cpvForm="props">
          <div class="cursor-pointer">
            <div v-if="isPDF(props.row.cpvFormMimeType)" @click="fnPDFViewModal(props.row.cpvForm)">
              <q-icon name="fas fa-file-pdf" color="primary" /> &nbsp; {{ props.row.cpvForm }}
            </div>
            <div v-else-if="isImage(props.row.cpvFormMimeType)" @click="fnViewMultiAttachedFileImageUploadedByCpvForm">
              <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]">
                <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm" style="max-width: 15%" />
              </viewer>
            </div>
            <div v-else>NA Document</div>
          </div>
        </template>

        <template v-slot:body-cell-status="props">
          <span class="label text-negative" v-if="props.row.deviceStatus === 3">Deactivated</span>
        </template>

        <!-- Top Slot: Search & Date Filters -->
        <template v-slot:top>
          <div class="row items-center q-mb-md">
            <div class="col-5">
              <q-input
                clearable
                v-model="filter"
                placeholder="Type.."
                outlined
                dense
                label="Search by MID, TID, Merchant Name"
              />
            </div>
            <div class="col-2">
              <q-datetime
                v-model="formData.fromDate"
                :min="yesterday"
                :max="tomorrow"
                label="From Date"
                dense
                outlined
              />
            </div>
            <div class="col-2">
              <q-datetime
                v-model="formData.toDate"
                :min="yesterday"
                :max="tomorrow"
                label="To Date"
                dense
                outlined
              />
            </div>
            <div class="col-2 row items-center">
              <q-btn
                color="purple-9"
                label="Submit"
                :disable="!formData.fromDate || !formData.toDate"
                @click="SubmitData(formData)"
                class="q-mr-sm"
              />
              <q-btn
                v-if="selectedRow"
                color="red"
                icon="delete"
                round
                @click="DeleteData"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Merchant Transaction Modal -->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />

      <!-- PDF Viewer Modal -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar, date } from "quasar";
import { useStore } from "vuex";

import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

const $q = useQuasar();
const store = useStore();

const today = new Date();
const { addToDate, subtractFromDate } = date;

const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const toggleshowPDFModal = ref(false);
const PDFDetails = ref("");

const toggleAjaxLoadFilter = ref(false);
const valueToggleMerchantTransaction = ref(false);
const filter = ref("");
const selectedRow = ref(null);

const tomorrow = addToDate(today, { days: 0 });
const yesterday = subtractFromDate(today, { days: 7200 });

const formData = reactive({
  fromDate: "",
  toDate: "",
});

const formData1 = reactive({
  fromDate: "",
  toDate: "",
});

const paginationControl = reactive({
  rowsNumber: 10,
  page: 1,
  sortBy: "deviceStatusDate",
  descending: false,
  rowsPerPage: 10,
});

const tableData = ref([]);

const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
const getbijdeactivelist = computed(() => store.getters["equitasImplementedQueue/getbijdeactivelist"]);

const columns = [
  { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
  { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
  { name: "leadNumber", label: "Lead Id", align: "left", field: row => row.leadInformation.leadNumber, sortable: false },
  { name: "leadInformation", label: "ME Name", align: "left", field: row => row.leadInformation.leadName, sortable: false },
  { name: "leadAddress", label: "Merchant Address", align: "center", field: row => row.leadInformation.leadAddress, sortable: false },
  { name: "deviceName", label: "Device type", align: "right", field: row => row.leadInformation.device?.deviceName ?? "NA", sortable: false },
  { name: "regionalInventory.serialNumber", label: "Device Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber ?? "NA", sortable: true },
  { name: "deviceStatusDate", label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
  { name: "assignedTo", label: "Implemented by", align: "left", field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : "NA", sortable: true },
  { name: "deviceAddress", label: "Implemented Address", align: "left", field: "deviceAddress", sortable: true },
  { name: "pincode", label: "Merchants Pincode", align: "left", field: row => row.leadInformation.pincode ?? "NA", sortable: false },
  { name: "city", label: "Merchants City Town", align: "left", field: row => row.leadInformation.city ?? "NA", sortable: false },
  { name: "mobileNumber", label: "Mobile Number", align: "center", field: row => row.assignedTo?.contactNumber ?? "NA", sortable: false },
  { name: "status", label: "Device Status", align: "center", field: "deviceStatus", sortable: false },
  { name: "viewDocument", label: "Implementation Form", align: "center", field: "implementationForm", sortable: false },
  { name: "pictureOfShop", label: "PictureOfShop", align: "center", field: "pictureOfShop", sortable: false },
  { name: "cpvForm", label: "cpvForm", align: "center", field: "cpvForm", sortable: false },
];

// Composable Methods
const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
};

const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

const formatDate = (val) => {
  if (!val) return "NA";
  return new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const isPDF = (mimeType) => !mimeType || mimeType.includes("application/pdf");
const isImage = (mimeType) => !mimeType || mimeType.includes("image/");

const toTimestamp = (strDate, isFromDate = true) => {
  const datePart = strDate.split("T")[0];
  const timeStr = isFromDate ? "00:00:00" : "23:59:00";
  return Date.parse(`${datePart}T${timeStr}Z`);
};

const SubmitData = (request) => {
  formData1.fromDate = toTimestamp(request.fromDate, true);
  formData1.toDate = toTimestamp(request.toDate, false);

  if (formData1.fromDate <= formData1.toDate) {
    selectedRow.value = request;
    ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value, formData: formData1 });
  } else {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "TO Date must be greater than From Date",
      icon: "thumb_down",
    });
  }
};

const DeleteData = () => {
  formData.fromDate = "";
  formData.toDate = "";
  formData1.fromDate = "";
  formData1.toDate = "";
  ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value, formData: formData1 });
  selectedRow.value = null;
};

const ajaxLoadAllLeadInfo = async ({ pagination, filter, formData }) => {
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
  toggleAjaxLoadFilter.value = true;
  try {
    await store.dispatch("equitasImplementedQueue/BIJLIPAY_DEACTIVE_LIST", { pagination, filter, formData });
    paginationControl.rowsNumber = getbijdeactivelist.value.totalElements;
    paginationControl.page = getbijdeactivelist.value.number + 1;
    tableData.value = getbijdeactivelist.value.content;
    if (getbijdeactivelist.value.sort) {
      paginationControl.sortBy = getbijdeactivelist.value.sort[0].property;
      paginationControl.descending = !getbijdeactivelist.value.sort[0].ascending;
    }
  } catch (error) {

    console.error(error);
  } finally {
    toggleAjaxLoadFilter.value = false;
    $q.loading.hide();
  }
};

const onRequest = (props) => {
  ajaxLoadAllLeadInfo({ pagination: props.pagination, filter: filter.value, formData: formData1 });
};

// Placeholder functions for viewer clicks
const fnViewMultiAttachedFileImageUploadedBySat = () => {};
const fnViewMultiAttachedFileImageUploadedByPictureShop = () => {};
const fnViewMultiAttachedFileImageUploadedByCpvForm = () => {};

onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value, formData: formData });
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
