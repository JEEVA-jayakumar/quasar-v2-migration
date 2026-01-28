<template>
  <q-page padding>
    <!-- Page Title -->
    <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator De-Active List
    </div>

    <!-- Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Merchant Table -->
    <q-table
      table-class="customTableClass"
      :data="tableData"
      :columns="columns"
      row-key="tid"
      :filter="filter"
      v-model:pagination="paginationControl"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >
      <!-- Custom Columns -->
      <template v-slot:body-cell-tid="props">
        <span class="label text-primary"># {{ props.row.tid }}</span>
      </template>

      <template v-slot:body-cell-mid="props">
        <span class="label text-primary"># {{ props.row.mid }}</span>
      </template>

      <template v-slot:body-cell-leadNumber="props">
        <span class="label text-primary cursor-pointer" @click="toggleLeadInformation(props.row)">
          # {{ props.row.leadInformation?.leadNumber || 'NA' }}
        </span>
      </template>

      <template v-slot:body-cell-mobileNumber="props">
        {{ props.row.leadInformation?.contactNumber || 'NA' }}
      </template>

      <template v-slot:body-cell-leadAddress="props">
        {{ props.row.leadInformation?.leadAddress || 'NA' }}
      </template>

      <template v-slot:body-cell-deviceStatusDate="props">
        <span class="label">{{ formatDate(props.row.deviceStatusDate) }}</span>
      </template>

      <template v-slot:body-cell-viewDocument="props">
        <div v-if="isPDF(props.row.implementationFormMimeType)" class="cursor-pointer">
          <div @click="fnPDFViewModal(props.row.implementationForm)">
            <q-icon name="fas fa-file-pdf" color="primary" />
            &nbsp;{{ props.row.implementationForm }}
          </div>
        </div>
        <div v-else-if="isImage(props.row.implementationFormMimeType)" class="cursor-pointer">
          <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]">
            <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm" style="max-width: 15%" />
          </viewer>
        </div>
        <div v-else>NA Document</div>
      </template>

      <template v-slot:body-cell-pictureOfShop="props">
        <div v-if="isPDF(props.row.pictureOfShopMimeType)" class="cursor-pointer">
          <div @click="fnPDFViewModal(props.row.pictureOfShop)">
            <q-icon name="fas fa-file-pdf" color="primary" />
            &nbsp;{{ props.row.pictureOfShop }}
          </div>
        </div>
        <div v-else-if="isImage(props.row.pictureOfShopMimeType)" class="cursor-pointer">
          <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]">
            <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop" style="max-width: 15%" />
          </viewer>
        </div>
        <div v-else>NA Document</div>
      </template>

      <template v-slot:body-cell-cpvForm="props">
        <div v-if="isPDF(props.row.cpvFormMimeType)" class="cursor-pointer">
          <div @click="fnPDFViewModal(props.row.cpvForm)">
            <q-icon name="fas fa-file-pdf" color="primary" />
            &nbsp;{{ props.row.cpvForm }}
          </div>
        </div>
        <div v-else-if="isImage(props.row.cpvFormMimeType)" class="cursor-pointer">
          <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]">
            <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm" style="max-width: 15%" />
          </viewer>
        </div>
        <div v-else>NA Document</div>
      </template>

      <template v-slot:body-cell-status="props">
        <span
          class="label"
          :class="{
            'text-positive': props.row.deviceStatus === 6,
            'text-negative': props.row.deviceStatus === 7,
            'text-amber': props.row.deviceStatus !== 6 && props.row.deviceStatus !== 7
          }"
        >
          {{ props.row.deviceStatus === 6 ? 'Approved' : props.row.deviceStatus === 7 ? 'Pending' : 'NA' }}
        </span>
      </template>

      <!-- Table Top Slot -->
      <template v-slot:top>
        <div class="row items-center q-pa-sm">
          <div class="col-5">
            <q-input
              dense
              outlined
              clearable
              debounce="300"
              v-model="filter"
              placeholder="Type.."
              label="Search by MID, TID, Merchant Name"
            />
          </div>

          <div class="col-2">
            <q-input
              dense
              outlined
              type="date"
              v-model="formData.fromDate"
              :max="tomorrow"
              label="From Date"
            />
          </div>

          <div class="col-2">
            <q-input
              dense
              outlined
              type="date"
              v-model="formData.toDate"
              :max="tomorrow"
              label="To Date"
            />
          </div>

          <div class="col-2 row">
            <q-btn
              class="q-mr-sm"
              color="purple-9"
              :disable="!formData.fromDate || !formData.toDate"
              label="Submit"
              @click="SubmitData(formData)"
            />
            <q-btn
              v-if="selectedRow"
              color="red"
              round
              dense
              icon="delete"
              @click="DeleteData"
            />
          </div>
        </div>
      </template>
    </q-table>

    <!-- Merchant Transaction Level Details -->
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
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { date, Notify, Loading } from "quasar";
import { mapGetters, mapActions } from "vuex";

import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

const today = new Date();
const { addToDate, subtractFromDate } = date;

export default {
  name: "merchantTransactionLevel",
  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    showPdfModalComponent,
  },
  setup() {
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const toggleshowPDFModal = ref(false);
    const PDFDetails = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const tableData = ref([]);
    const valueToggleMerchantTransaction = ref(false);
    const filter = ref("");
    const selectedRow = ref(null);

    const paginationControl = reactive({
      page: 1,
      rowsPerPage: 10,
      sortBy: "deviceStatusDate",
      descending: false,
      rowsNumber: 10,
    });

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

    const { formatDate } = date;

    const columns = [
      { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
      { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
      {
        name: "leadNumber",
        label: "Lead ID",
        align: "left",
        field: (row) => row.leadInformation?.leadNumber || "NA",
        sortable: true,
      },
      {
        name: "leadName",
        label: "Merchant Name",
        align: "left",
        field: (row) => row.leadInformation?.leadName || "NA",
      },
      {
        name: "leadAddress",
        label: "Merchant Address",
        align: "left",
        field: (row) => row.leadInformation?.leadAddress || "NA",
      },
      {
        name: "deviceStatusDate",
        label: "Implementation Date",
        align: "left",
        field: "deviceStatusDate",
        sortable: true,
      },
      { name: "status", label: "Device Status", align: "center", field: "deviceStatus" },
    ];

    // Vuex
    const { getaggdeactivelist, GLOBAL_FILE_FETCH_URL } = mapGetters("equitasImplementedQueue", [
      "getaggdeactivelist",
      "GLOBAL_FILE_FETCH_URL",
    ]);

    const { AGGREGATOR_DEACTIVE_LIST } = mapActions("equitasImplementedQueue", [
      "AGGREGATOR_DEACTIVE_LIST",
    ]);

    const isPDF = (mime) => !mime || mime.includes("application/pdf");
    const isImage = (mime) => !mime || mime.includes("image/");

    const fnPDFViewModal = (documentUrl) => {
      PDFDetails.value = documentUrl;
      toggleshowPDFModal.value = !toggleshowPDFModal.value;
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

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
        ajaxLoadAllLeadInfo();
      } else {
        Notify.create({
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
      ajaxLoadAllLeadInfo();
      selectedRow.value = null;
    };

    const ajaxLoadAllLeadInfo = async () => {
      toggleAjaxLoadFilter.value = true;
      Loading.show({ spinnerColor: "purple-9", message: "Fetching data ..." });
      try {
        await AGGREGATOR_DEACTIVE_LIST();
        tableData.value = getaggdeactivelist.content;
      } finally {
        toggleAjaxLoadFilter.value = false;
        Loading.hide();
      }
    };

    onMounted(() => {
      ajaxLoadAllLeadInfo();
    });

    const formatDateDisplay = (value) => {
      return value ? formatDate(value, "DD MMM YYYY") : "NA";
    };

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      toggleshowPDFModal,
      PDFDetails,
      toggleAjaxLoadFilter,
      tableData,
      valueToggleMerchantTransaction,
      filter,
      paginationControl,
      formData,
      formData1,
      selectedRow,
      columns,
      tomorrow,
      yesterday,
      fnPDFViewModal,
      toggleLeadInformation,
      SubmitData,
      DeleteData,
      ajaxLoadAllLeadInfo,
      isPDF,
      isImage,
      formatDate: formatDateDisplay,
      GLOBAL_FILE_FETCH_URL,
    };
  },
};
</script>

<style scoped>
.label {
  font-weight: 500;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
