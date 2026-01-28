<template>
  <q-page>

    <!-- Lead Information Popup -->
    <staticQrGeneralLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Pull to refresh wrapper -->
    <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>

      <!-- Page Title -->
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Static QR Lead Validation
      </div>

      <!-- Lead Table -->
      <q-table
        title="Lead Validation"
        table-class="customTableClass"
        class="q-py-none"
        :data="tableData"
        :columns="columns"
        row-key="name"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >

        <!-- Date -->
        <template v-slot:body-cell-createdAt="props">
          {{ formatDate(props.row.date) }}
        </template>

        <!-- Lead Number -->
        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label cursor-pointer"
            :class="props.row.priority ? 'text-negative text-weight-bolder' : 'text-primary'"
            @click="toggleLeadInformation(props.row)"
          >
            # {{ props.row.leadNumber }}
          </span>
        </template>

        <!-- Merchant Name -->
        <template v-slot:body-cell-leadName="props">
          <span class="capitalize">{{ props.row.marketingName }}</span>
        </template>

        <!-- State -->
        <template v-slot:body-cell-state="props">
          <span class="capitalize">{{ props.row.state }}</span>
        </template>

        <!-- Sales Officer Name -->
        <template v-slot:body-cell-salesOfficer="props">
          <span class="capitalize">{{ props.row.salesOfficerName }}</span>
        </template>

        <!-- Lead Status -->
        <template v-slot:body-cell-leadStatus="props">
          <span
            v-if="props.row.leadStatus == 1"
            class="label text-primary"
          >Pending With Bank Details</span>
          <span
            v-else-if="props.row.leadStatus == 2"
            class="label text-orange"
          >Pending With Document Upload</span>
          <span
            v-else-if="props.row.leadStatus == 3"
            class="label text-lime"
          >Pending With QR Scan</span>
          <span
            v-else-if="props.row.leadStatus == 4 && !props.row.referbackStatus"
            class="label text-purple-9"
          >Manual Verification</span>
          <span
            v-else-if="props.row.leadStatus == 5"
            class="label text-amber"
          >Pending With MDR and Rental Details</span>
          <span
            v-else-if="props.row.leadStatus == 6"
            class="label text-blue"
          >WIP</span>
          <span
            v-else-if="props.row.leadStatus == 7"
            class="label text-green"
          >Pending For Registration With Axis</span>
          <span
            v-else-if="props.row.leadStatus == 8"
            class="label text-orange"
          >Reffer Back</span>
          <span
            v-else-if="props.row.leadStatus == 4 && props.row.referbackStatus"
            class="label text-green"
          >Re-Upload</span>
          <span
            v-else-if="props.row.leadStatus == 10"
            class="label text-blue"
          >QR Activated</span>
          <span
            v-else-if="props.row.leadStatus == 11"
            class="label text-negative"
          >Mars Rejected</span>
          <span
            v-else-if="props.row.leadStatus == 12"
            class="label text-green"
          >Waiting For Response File</span>
          <span
            v-else-if="props.row.leadStatus == 13"
            class="label text-green"
          >Pending With Personal Info</span>
          <span
            v-else-if="props.row.leadStatus == 14"
            class="label text-green"
          >Pending With Risk Info</span>
          <span
            v-else-if="props.row.leadStatus == 9"
            class="label text-orange"
          >Mars Re-Upload</span>
          <span class="label text-negative" v-else>Pending</span>
        </template>

        <!-- Action Buttons -->
        <template v-slot:body-cell-action="props">
          <q-btn
            v-if="props.row.leadStatus == 4 && !props.row.referbackStatus"
            :disabled="props.row.verifiedFinanceStatus != 1"
            highlight
            push
            color="purple-9"
            size="sm"
            :to="'qrLead/validation/' + props.row.leadId"
            class="btn1"
          >
            Validate
          </q-btn>

          <q-btn
            v-if="props.row.leadStatus == 4 && props.row.referbackStatus"
            highlight
            push
            outline
            color="blue"
            size="sm"
            :to="'qrLead/validation/' + props.row.leadId"
            class="btn3"
          >
            Re-submit
          </q-btn>

          <q-btn
            v-if="props.row.leadStatus == 9"
            highlight
            push
            outline
            color="green"
            size="sm"
            :to="'qrLead/validation/' + props.row.leadId"
            class="btn3"
          >
            MARS ReferBack
          </q-btn>

          <q-btn
            v-else-if="props.row.leadStatus == 6"
            disable
            highlight
            push
            color="red"
            size="sm"
            class="btn2"
          >
            Pending With Mars
          </q-btn>

          <q-btn
            v-else-if="props.row.leadStatus == 7"
            disable
            highlight
            push
            color="green"
            size="sm"
          >
            Mars Approved
          </q-btn>

          <q-btn
            v-else-if="props.row.leadStatus == 8"
            highlight
            push
            outline
            color="amber"
            size="sm"
            class="btn3"
          >
            Reffer Back
          </q-btn>
        </template>

        <!-- Finance Status -->
        <template v-slot:body-cell-verifiedFinanceStatus="props">
          <span v-if="props.row.verifiedFinanceStatus == 1" class="label text-green">Approved</span>
          <span v-else-if="props.row.verifiedFinanceStatus == 2" class="label text-negative">Pending</span>
          <span v-else-if="props.row.verifiedFinanceStatus == 3" class="label text-negative">Rejected</span>
          <span v-else class="label text-negative">Pending</span>
        </template>

        <!-- Table Top Slot (Search) -->
        <template v-slot:top>
          <div class="row bottom-border">
            <div class="col-md-4">
              <q-search
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Type.."
                :debounce="300"
                class="q-mr-lg q-py-sm"
                label="Search By Lead ID, Merchant Name ..."
              />
            </div>
          </div>
        </template>

      </q-table>

    </q-pull-to-refresh>

    <!-- Reject Lead Modal -->
    <openRejectLeadComp
      v-if="showRejectLeadModel"
      :showRejectLeadModel="showRejectLeadModel"
      :propShowRejectLeadComponent="propsRejectLeadAppend"
      @closeRejectLeadModel="openRejectLead"
    />

    <!-- File Upload Modal -->
    <staticQrFileUpload
      v-if="toggleFileUpload"
      :propFileUpload="toggleFileUpload"
      :propAllExcelFile="deviceOptions"
      @closeModel="excelFileUpload"
    />

  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import staticQrGeneralLeadInformation from "../../components/sat/staticQrGeneralLeadInformation.vue";
import openRejectLeadComp from "../../components/sat/openRejectLeadComp.vue";
import staticQrFileUpload from "../../components/sat/staticQrFileUpload.vue";

export default {
  name: "staticQrLeads",
  components: { staticQrGeneralLeadInformation, openRejectLeadComp, staticQrFileUpload },
  setup(_, { store }) {
    const $q = useQuasar();

    // Reactive state
    const propToggleLeadInformation = ref(false);
    const showRejectLeadModel = ref(false);
    const addtnLeadInformation = ref(null);
    const toggleFileUpload = ref(false);
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const paginationControl = reactive({
      rowsNumber: 10,
      page: 1,
      sortBy: "qrLeadNumber",
      descending: false,
      rowsPerPage: 10
    });
    const tableData = ref([]);
    const propsRejectLeadAppend = ref([]);
    const deviceOptions = ref([]);

    // Columns - Fixed the column name for sales officer
    const columns = [
      { name: "createdAt", required: true, label: "Date(C)", align: "left", field: "date", sortable: true },
      { name: "leadNumber", required: true, label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: false },
      { name: "leadName", required: true, label: "Merchant Name", align: "left", field: "marketingName", sortable: false },
      { name: "state", required: true, label: "State", align: "left", field: "state", sortable: true },
      { name: "salesOfficer", required: true, label: "SO Name", align: "left", field: row => row.salesOfficerName, sortable: false },
      { name: "verifiedFinanceStatus", required: true, label: "Finace Status", align: "left", field: "verifiedFinanceStatus", sortable: true },
      { name: "leadStatus", required: true, label: "Status", align: "left", field: "leadStatus", sortable: false },
      { name: "action", required: true, label: "", align: "left", field: "action", sortable: false },
      { name: "rejectLead", required: true, label: "", align: "left", field: "rejectLead", sortable: false }
    ];

    // Vuex Getters and Actions
    const getAllStaticQrLeadsValidationInfo = computed(() => store.getters["iciciStaticQr/getAllStaticQrLeadsValidationInfo"]);
    const { FETCH_ALL_STATIC_QR_LEAD_VALIDATIONS_DATA, STATIC_QR_LEAD_VALIDATION_DOWNLOAD_FILE } = store._actions;

    // Load Table Data
    const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
      $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      try {
        await FETCH_ALL_STATIC_QR_LEAD_VALIDATIONS_DATA({ pagination, filter });
        paginationControl.rowsNumber = getAllStaticQrLeadsValidationInfo.value.totalElements;
        paginationControl.page = getAllStaticQrLeadsValidationInfo.value.number + 1;
        tableData.value = getAllStaticQrLeadsValidationInfo.value.content;
        if (getAllStaticQrLeadsValidationInfo.value.sort != null) {
          paginationControl.sortBy = getAllStaticQrLeadsValidationInfo.value.sort[0].property;
          paginationControl.descending = getAllStaticQrLeadsValidationInfo.value.sort[0].ascending;
        }
      } catch (error) {
        console.error(error);
      } finally {
        $q.loading.hide();
      }
    };

    // Lifecycle
    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
    });

    // Pull To Refresh
    const PullToRefresh = (done) => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
      done();
    };

    // Open/Close Lead Info
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) addtnLeadInformation.value = leadDetails;
    };

    // Reject Lead Modal
    const openRejectLead = (exceptionDetails) => {
      showRejectLeadModel.value = !showRejectLeadModel.value;
      propsRejectLeadAppend.value = exceptionDetails;
    };

    // File Upload
    const excelFileUpload = () => {
      toggleFileUpload.value = !toggleFileUpload.value;
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
    };

    // Download Excel
    const downloadFiles = async () => {
      $q.loading.show({ delay: 100 });
      try {
        await STATIC_QR_LEAD_VALIDATION_DOWNLOAD_FILE();
        $q.notify({ color: "positive", position: "bottom", message: "Success, file has been downloaded", icon: "check" });
        ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
      } catch (error) {
        console.error(error);
        $q.notify({ color: "negative", position: "bottom", message: "Please try again", icon: "thumb_down" });
      } finally {
        $q.loading.hide();
      }
    };

    // Date Formatting
    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "NA";

    return {
      propToggleLeadInformation,
      showRejectLeadModel,
      addtnLeadInformation,
      toggleFileUpload,
      filter,
      toggleAjaxLoadFilter,
      paginationControl,
      tableData,
      columns,
      propsRejectLeadAppend,
      deviceOptions,
      ajaxLoadAllLeadInfo,
      PullToRefresh,
      toggleLeadInformation,
      openRejectLead,
      excelFileUpload,
      downloadFiles,
      formatDate
    };
  }
};
</script>

<style scoped>
.q-btn-flat,
.q-btn-outline {
  min-width: 100px !important;
}
.btn1 {
  width: 114px;
}
.btn2 {
  width: 140px;
}
.btn3 {
  width: 114px;
}
.size1 {
  margin-left: 367px;
}
.size2 {
  margin-left: 10px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.capitalize {
  text-transform: capitalize;
}

.customTableClass {
  width: 100%;
}

.label {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>