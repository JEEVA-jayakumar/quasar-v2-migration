<template>
  <q-page padding>
    <div>
      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        SAT - Service Verification
      </div>

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="serviceReqTicketId"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
      >

        <!-- Top slot: Search -->
        <template v-slot:top>
          <div class="col-5 q-mr-lg q-py-sm">
            <q-input
              v-model="filter"
              clearable
              dense
              outlined
              placeholder="Type.."
              label="Search by TID, Ticket ID, Merchant Name"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <!-- Table Body Slots -->
        <template v-slot:body-cell-createdDate="props">
          <span>{{ formatDate(props.row.createdDate) }}</span>
        </template>

        <template v-slot:body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.serviceRequestData?.tid || 'NA' }}</span>
        </template>

        <template v-slot:body-cell-ticketid="props">
          <span class="label text-primary">
            # {{ props.row.serviceRequestData?.serviceReqTicketId || 'NA' }}
          </span>
        </template>

        <template v-slot:body-cell-statusReport="props">
          {{ props.row.serviceRequestType?.name || 'NA' }}
        </template>

        <template v-slot:body-cell-merchantname="props">
          {{ props.row.serviceRequestData?.meName || 'NA' }}
        </template>

        <template v-slot:body-cell-merchantaddress="props">
          {{ props.row.serviceRequestData?.address || 'NA' }}
        </template>

        <template v-slot:body-cell-typeofvisit="props">
          {{ props.row.resolutionType || 'NA' }}
        </template>

        <template v-slot:body-cell-viewDocument="props">
          <div v-if="props.row.implementationFormMimeType?.includes('pdf')" class="cursor-pointer">
            <q-icon name="fas fa-file-pdf" color="primary" @click="fnPDFViewModal(props.row.implementationForm)" />
          </div>
          <div v-else-if="props.row.implementationFormMimeType?.includes('image')" class="cursor-pointer">
            <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]">
              <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm" style="max-width: 15%" />
            </viewer>
          </div>
          <div v-else>NA Document</div>
        </template>

        <template v-slot:body-cell-pictureOfShop="props">
          <div v-if="props.row.pictureOfShopMimeType?.includes('pdf')" class="cursor-pointer">
            <q-icon name="fas fa-file-pdf" color="primary" @click="fnPDFViewModal(props.row.pictureOfShop)" />
          </div>
          <div v-else-if="props.row.pictureOfShopMimeType?.includes('image')" class="cursor-pointer">
            <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]">
              <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop" style="max-width: 15%" />
            </viewer>
          </div>
          <div v-else>NA Document</div>
        </template>

        <template v-slot:body-cell-closedate="props">
          <span>{{ formatDate(props.row.updatedDate) }}</span>
        </template>

        <template v-slot:body-cell-status="props">
          <span
            class="label text-positive"
            v-if="[92, 98, 88, 94, 89].includes(props.row.serviceRequestSubTicketStatus?.id)"
          >Approved</span>
          <span
            class="label text-negative"
            v-else-if="props.row.serviceRequestSubTicketStatus?.id === 87 && props.row.reject"
          >Rejected</span>
          <span class="label text-amber" v-else>Pending</span>
        </template>

        <template v-slot:body-cell-device="props">
          {{ props.row.serviceRequestData?.deviceType || 'NA' }}
        </template>

        <template v-slot:body-cell-action="props">
          <q-btn
            :disabled="props.row.serviceRequestSubTicketStatus?.id !== 102"
            no-caps
            no-wrap
            label="Approve"
            icon="done"
            size="md"
            color="green-7"
            @click="fnshowservice(props.row)"
          />
        </template>

        <template v-slot:body-cell-data="props">
          <q-btn
            :disabled="props.row.serviceRequestSubTicketStatus?.id !== 102"
            no-caps
            no-wrap
            label="Reject"
            icon="close"
            size="md"
            color="red-5"
            @click="fnShowConvertReject(props.row)"
          />
        </template>

      </q-table>
    </div>

    <!-- PDF Modal -->
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />

    <!-- Approve Modal -->
    <viewticketApprove
      v-if="propShowTicketApprove"
      :propShowTicketApprove="propShowTicketApprove"
      :propRowDetails="propRowDetails"
      @emitfnshowservice="fnshowservice"
    />

    <!-- Reject Modal -->
    <viewticketReject
      v-if="propShowTicketReject"
      :propShowTicketReject="propShowTicketReject"
      :propRowDetails="propRowDetails"
      @emitfnshowservice="fnShowConvertReject"
    />

  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { mapGetters, mapActions } from "vuex";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import viewticketApprove from "src/components/sat/viewticketApprove.vue";
import viewticketReject from "src/components/sat/viewticketReject.vue";

export default {
  name: "serviceVerification",

  components: {
    showPdfModalComponent,
    viewticketApprove,
    viewticketReject,
  },

  setup() {
    const tableData = ref([]);
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const toggleshowPDFModal = ref(false);
    const PDFDetails = ref("");
    const propShowTicketApprove = ref(false);
    const propShowTicketReject = ref(false);
    const propRowDetails = ref(null);

    const paginationControl = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: "createdDate",
      descending: false,
    });

    // Date formatter
    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "NA";
    };

    return {
      tableData,
      filter,
      toggleAjaxLoadFilter,
      toggleshowPDFModal,
      PDFDetails,
      propShowTicketApprove,
      propShowTicketReject,
      propRowDetails,
      paginationControl,
      formatDate
    };
  },

  computed: {
    ...mapGetters("equitasImplementedQueue", ["getserviceticketlist"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
  },

  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
  },

  methods: {
    ...mapActions("equitasImplementedQueue", ["SERVICE_TICKET_LIST"]),

    ajaxLoadAllLeadInfo({ pagination, filter } = {}) {
      this.toggleAjaxLoadFilter = true;
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });

      this.SERVICE_TICKET_LIST({ pagination, filter })
        .then(() => {
          const list = this.getserviceticketlist;
          if (list) {
            this.tableData = list.content || [];
            this.paginationControl.rowsNumber = list.totalElements || 0;
            this.paginationControl.page = (list.number || 0) + 1;
            if (list.sort) {
              this.paginationControl.sortBy = list.sort[0].property;
              this.paginationControl.descending = list.sort[0].ascending;
            }
          }
          this.toggleAjaxLoadFilter = false;
          this.$q.loading.hide();
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error?.body?.message || "Please Try Again Later !",
            icon: "thumb_down",
          });
          this.toggleAjaxLoadFilter = false;
          this.$q.loading.hide();
        });
    },

    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },

    fnshowservice(rowDetails) {
      this.propShowTicketApprove = !this.propShowTicketApprove;
      if (rowDetails) this.propRowDetails = rowDetails;
    },

    fnShowConvertReject(rowDetails) {
      this.propShowTicketReject = !this.propShowTicketReject;
      if (rowDetails) this.propRowDetails = rowDetails;
    },
  },

  data() {
    return {
      columns: [
        { name: "createdDate", label: "Created Date", align: "left", field: "createdDate", sortable: true },
        { name: "tid", label: "TID", align: "left", field: row => row.serviceRequestData?.tid || "NA", sortable: false },
        { name: "ticketid", label: "Ticket ID", align: "left", field: row => row.serviceRequestData?.serviceReqTicketId || "NA", sortable: false },
        { name: "statusReport", label: "Status Reported", align: "left", field: row => row.serviceRequestType?.name || "NA", sortable: false },
        { name: "merchantname", label: "Merchant Name", align: "left", field: row => row.serviceRequestData?.meName || "NA", sortable: false },
        { name: "assignedTo", label: "Implemented by", align: "left", field: row => row.serviceRequestData?.assignedTo ? `${row.serviceRequestData.assignedTo.name} | ${row.serviceRequestData.assignedTo.employeeID}` : "NA", sortable: false },
        { name: "mobileNumber", label: "FSE Mobile Number", align: "left", field: row => row.serviceRequestData?.assignedTo?.contactNumber || "NA", sortable: false },
        { name: "merchantaddress", label: "Merchant Address", align: "left", field: row => row.serviceRequestData?.address || "NA", sortable: false },
        { name: "typeofvisit", label: "Type Of Visit", align: "left", field: row => row.resolutionType || "NA", sortable: false },
        { name: "viewDocument", label: "Implementation Form", align: "left", field: row => row.implementationForm || "NA", sortable: false },
        { name: "pictureOfShop", label: "Picture of the Shop", align: "left", field: row => row.pictureOfShop || "NA", sortable: false },
        { name: "closedate", label: "Close Date", align: "left", field: "updatedDate", sortable: false },
        { name: "status", label: "Status", align: "center", field: "id", sortable: false },
        { name: "device", label: "Device Type", align: "left", field: row => row.serviceRequestData?.deviceType || "NA", sortable: false },
        { name: "action", label: "Approve", align: "center", field: "action", sortable: false },
        { name: "data", label: "Reject", align: "center", field: "data", sortable: false },
      ]
    };
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
