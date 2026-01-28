<template>
  <q-page padding>
    <div>
      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Exceptions
      </div>

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        :rows="getKycExceptionInfo"
        :columns="columns"
        :filter="filterSearch"
        :filter-method="myCustomSearchFilter"
        row-key="id"
        v-model:pagination="paginationControl"
        flat
      >
        <!-- Custom body row -->
        <template #body="props">
          <q-tr
            :props="props"
            class="cursor-pointer"
            :class="{ 'bg-grey-3': props.row.__index === activeId }"
            @click="fnRowClick(props.row)"
            @mouseover="fnRowMouseOver(props.row.__index)"
            @mouseleave="fnRowMouseLeave(props.row.__index)"
          >
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'dateOfUpdation'">
                {{ formatDate(props.row.submitteSATDate) }}
              </template>

              <template v-else-if="col.name === 'leadId'">
                <span class="label capitalize text-primary cursor-pointer" @click.stop="toggleLeadInformation(props.row)">
                  # {{ props.row.id }}
                </span>
              </template>

              <template v-else-if="col.name === 'leadName'">
                {{ props.row.leadName }}
              </template>

              <template v-else-if="col.name === 'SOName'">
                {{ props.row.createdBy.name }}
              </template>

              <template v-else-if="col.name === 'reason'">
                {{ props.row.reason }}
              </template>

              <template v-else-if="col.name === 'SATName'">
                <span v-if="props.row.leadVerificationStatus.length > 0">
                  {{ sortArraysForCreatedBy(props.row.leadVerificationStatus) }}
                </span>
                <span v-else>NA</span>
              </template>

              <template v-else-if="col.name === 'SATRemarks'">
                <span v-if="props.row.leadVerificationStatus.length > 0">
                  {{ sortArraysForReason(props.row.leadVerificationStatus) }}
                </span>
                <span v-else>NA</span>
              </template>

              <template v-else-if="col.name === 'expectedDateSubmission'">
                <span v-if="props.row.leadVerificationStatus.length > 0">
                  {{ formatDate(sortArraysForExpectedSubmitDate(props.row.leadVerificationStatus)) }}
                </span>
                <span v-else>NA</span>
              </template>
            </q-td>
          </q-tr>
        </template>

        <!-- Top slot: Search -->
        <template #top>
          <div class="row q-pa-sm items-center">
            <div class="col-md-5">
              <q-input
                filled
                v-model="filterSearch"
                clearable
                label="Search by MID, TID, Merchant Name, MCC, UTR Number, Device Type"
                placeholder="Type.."
                dense
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Lead Information Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :lead-information="addtnLeadInformation"
        :prop-toggle-lead-information-pop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import _ from "lodash";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "ExceptionsOpsHead",
  components: {
    generalLeadInformation
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const activeId = ref("");
    const filterSearch = ref("");
    const paginationControl = ref({
      page: 1,
      rowsPerPage: 10
    });

    const columns = ref([
      { name: "dateOfUpdation", label: "Date of updation", align: "left", field: "dateOfUpdation", sortable: true },
      { name: "leadId", label: "Lead ID", align: "center", field: row => "# " + row.id, sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: "leadName", sortable: true },
      { name: "SOName", label: "SO Name", align: "left", field: row => row.createdBy.name, sortable: true },
      { name: "reason", label: "SO Remarks", align: "left", field: "reason", sortable: true },
      { name: "SATName", label: "SAT Name", align: "left", field: "SATName", sortable: true },
      { name: "SATRemarks", label: "SAT Remarks", align: "left", field: "SATRemarks", sortable: true },
      { name: "expectedDateSubmission", label: "Expected date of submission", align: "left", field: "expectedDateSubmission", sortable: true }
    ]);

    const getKycExceptionInfo = computed(() => store.getters["OPSHead/getKycExceptionInfo"]);

    // Date formatting function to replace moment filter
    const formatDate = (dateString) => {
      if (!dateString) return "NA";
      
      try {
        const date = new Date(dateString);
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        
        // Add ordinal suffix to day
        const getOrdinalSuffix = (n) => {
          if (n > 3 && n < 21) return n + "th";
          switch (n % 10) {
            case 1: return n + "st";
            case 2: return n + "nd";
            case 3: return n + "rd";
            default: return n + "th";
          }
        };
        
        const year = date.getFullYear();
        return `${month} ${getOrdinalSuffix(day)} ${year}`;
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    };

    // --- Methods ---
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const ajaxLoadDataForAllExceptionList = async () => {
      try {
        $q.loading.show({ spinnerColor: "purple-9", message: "Fetching list.." });
        await store.dispatch("OPSHead/FETCH_ALL_EXCEPTION_KYC_DATA");
      } finally {
        $q.loading.hide();
      }
    };

    const fnRowClick = (itemDetails) => {
      store.$router.push(`/ops/head/exceptions/${itemDetails.id}`);
    };
    const fnRowMouseOver = (index) => (activeId.value = index);
    const fnRowMouseLeave = () => (activeId.value = "");

    const sortArraysForCreatedBy = (item) => {
      const arrCooked = _.orderBy(item, "id", "desc");
      const arrFinal = arrCooked.find((value) => value.verificationType === 3 && value.status);
      return arrFinal ? arrFinal.createdBy.name : "NA";
    };

    const sortArraysForReason = (item) => {
      const arrCooked = _.orderBy(item, "id", "desc");
      const arrFinal = arrCooked.find((value) => value.verificationType === 3 && value.status);
      return arrFinal ? arrFinal.kycSatRemark : "NA";
    };

    const sortArraysForExpectedSubmitDate = (item) => {
      const arrCooked = _.orderBy(item, "id", "desc");
      const arrFinal = arrCooked.find((value) => value.verificationType === 3 && value.status);
      return arrFinal ? arrFinal.expectedSubmitDate : "NA";
    };

    const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter((row) =>
        cols.some((col) => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    };

    // Load data on mount
    onMounted(() => {
      ajaxLoadDataForAllExceptionList();
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      activeId,
      filterSearch,
      paginationControl,
      columns,
      getKycExceptionInfo,
      toggleLeadInformation,
      fnRowClick,
      fnRowMouseOver,
      fnRowMouseLeave,
      sortArraysForCreatedBy,
      sortArraysForReason,
      sortArraysForExpectedSubmitDate,
      myCustomSearchFilter,
      formatDate // Added formatDate function
    };
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>