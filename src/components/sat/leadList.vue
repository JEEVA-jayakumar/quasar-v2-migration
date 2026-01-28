<template>
  <q-dialog v-model="toggleModal" maximized persistent :content-css="{padding:'50px 5px'}">
    <q-card flat class="q-pa-none">
      <div>
        <!-- Common Lead Information Popup -->
        <generalLeadInformation
          v-if="propToggleLeadInformation"
          :leadInformation="addtnLeadInformation"
          :propToggleLeadInformationPop="propToggleLeadInformation"
          @closeLeadInformation="toggleLeadInformation"
        />

        <!-- Table Header -->
        <div class="row items-center q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          <div class="col q-title">Lead Details</div>
          <div class="col-auto">
            <q-btn round outline color="dark" icon="close" @click="emitToggleRemarks" />
          </div>
        </div>

        <!-- Lead Validation Table -->
        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="leadNumber"
          :filter="filter"
          v-model:pagination="paginationControl"
          :rows-per-page-options="[5, 10, 15, 20]"
          @request="ajaxLoadAllLeadInfo"
          title="Lead Validation"
          class="q-py-none customTableClass"
        >
          <!-- Table Top Slot: Filter -->
          <template v-slot:top>
            <div class="col-md-5">
              <q-input
                filled
                debounce="600"
                clearable
                v-model="filter"
                placeholder="Type.."
                label="Search"
                class="q-mr-lg q-py-sm"
              />
            </div>
          </template>

          <!-- Table Body Slots -->
          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.date) }}
          </template>

          <template v-slot:body-cell-leadNumber="props">
            <span
              class="cursor-pointer"
              :class="[props.row.priority ? 'text-negative text-weight-bolder' : 'text-primary']"
              @click="toggleLeadInformation(props.row)"
            >
              # {{ props.row.leadNumber }}
            </span>
          </template>

          <template v-slot:body-cell-leadName="props">
            <span class="capitalize">{{ props.row.merchantName }}</span>
          </template>

          <template v-slot:body-cell-state="props">
            <span class="capitalize">{{ props.row.state }}</span>
          </template>

          <template v-slot:body-cell-verifiedFinanceStatus="props">
            <span
              v-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_SUCCESS"
              class="label text-positive"
            >
              Approved
            </span>
            <span
              v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_PENDING"
              class="label text-negative"
            >
              Pending
            </span>
            <span
              v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_REJECT"
              class="label text-negative"
            >
              Rejected
            </span>
            <span v-else class="label">NA</span>
          </template>

          <template v-slot:body-cell-action="props">
            <q-btn
              v-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING"
              push
              outline
              highlight
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')"
            >
              Data Entry
            </q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMITED_TO_MARS"
              push
              highlight
              class="disabled"
              color="purple-9"
              size="sm"
            >
              Pending with MARS
            </q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_SUCCESS"
              push
              outline
              highlight
              color="purple-9"
              size="sm"
              :to="'/sat/lead/validation/' + props.row.leadId"
            >
              Validate
            </q-btn>

            <q-btn v-else push outline highlight color="grey-9" size="sm" class="disabled">
              Validate
            </q-btn>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, getCurrentInstance, onMounted } from "vue";
import { useStore } from "vuex";
import generalLeadInformation from "../generalLeadInformation.vue";

export default {
  name: "LeadValidationModal",
  components: { generalLeadInformation },
  props: {
    propLeadInformation: { type: Array, default: () => [] },
    propToggleModal: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();

    const toggleModal = ref(props.propToggleModal);
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const filter = ref("");
    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "leadNumber",
      descending: false
    });

    const tableData = ref([]);

    const columns = ref([
      { name: "createdAt", required: true, label: "Date(C)", align: "left", field: "date", sortable: true },
      { name: "leadNumber", required: true, label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
      { name: "leadName", required: true, label: "Merchant Name", align: "left", field: "merchantName", sortable: true },
      { name: "state", required: true, label: "State", align: "left", field: "state", sortable: true },
      { name: "assignedTo.name", required: true, label: "SO Name", align: "left", field: "salesOfficerName", sortable: true },
      {
        name: "verifiedFinanceStatus",
        required: true,
        label: "Finance Approval",
        align: "left",
        field: row => {
          return row.verifiedFinanceStatus === proxy.$VERIFIED_FINANCE_STATUS_SUCCESS
            ? "Success"
            : row.verifiedFinanceStatus === proxy.$VERIFIED_FINANCE_STATUS_PENDING
            ? "Pending"
            : row.verifiedFinanceStatus === proxy.$VERIFIED_FINANCE_STATUS_REJECT
            ? "Rejected"
            : "NA";
        },
        sortable: true
      },
      { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
    ]);

    const ajaxLoadAllLeadInfo = async ({ pagination, filter: filterValue }) => {
      tableData.value = [];
      proxy.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });

      try {
        await store.dispatch("SAT_Dashboard/FETCH_SAT_AGING_TRACKER_LEADS_DATA", {
          pagination,
          filter: filterValue,
          leadIdList: { leadIdList: props.propLeadInformation }
        });

        const data = store.getters["SAT_Dashboard/getSatAgingTrackerListdata"];
        tableData.value = data.content || [];
        paginationControl.value.rowsNumber = data.totalElements || 0;
        paginationControl.value.page = (data.number || 0) + 1;

        if (data.sort?.length) {
          paginationControl.value.sortBy = data.sort[0].property;
          paginationControl.value.descending = !data.sort[0].ascending;
        }
      } catch (err) {
        console.error(err);
      } finally {
        proxy.$q.loading.hide();
      }
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const emitToggleRemarks = () => emit("closeLeadsList");

    const formatDate = (date) => {
      return date ? proxy.$moment(date).format("Do MMM Y") : "NA";
    };

    watch(() => props.propToggleModal, (val) => {
      toggleModal.value = val;
    });

    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
    });

    return {
      toggleModal,
      propToggleLeadInformation,
      addtnLeadInformation,
      filter,
      paginationControl,
      tableData,
      columns,
      ajaxLoadAllLeadInfo,
      toggleLeadInformation,
      emitToggleRemarks,
      formatDate
    };
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
.customTableClass .q-table__bottom {
  padding-top: 0;
}
</style>
