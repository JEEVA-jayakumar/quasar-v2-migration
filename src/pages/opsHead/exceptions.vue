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
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20]"
        row-key="leadId"
        flat
        @request="ajaxLoadDataForAllExceptionList"
      >
        <!-- Body slot -->
        <template #body="props">
          <q-tr
            :props="props"
            class="cursor-pointer"
            :class="{ 'bg-grey-3': props.row.__index === activeId }"
            @click="fnRowClick(props.row)"
            @mouseover="fnRowMouseOver(props.row.__index)"
            @mouseleave="fnRowMouseLeave"
          >
            <q-td :props="props">
              <span class="label capitalize">{{ formatDate(props.row.updatedAt) }}</span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize text-primary cursor-pointer" @click.stop="toggleLeadInformation(props.row)">
                # {{ props.row.leadId }}
              </span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize">{{ props.row.leadName }}</span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize">{{ props.row.soName }}</span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize">{{ props.row.soRemarks }}</span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize">{{ props.row.satName }}</span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize">{{ props.row.kycSatRemark }}</span>
            </q-td>

            <q-td :props="props">
              <span class="label capitalize">{{ formatDate(props.row.expectedSubmitDate) }}</span>
            </q-td>
          </q-tr>
        </template>

        <!-- Top slot: Search -->
        <template #top>
          <div class="row q-pa-sm items-center">
            <div class="col-md-5">
              <q-input
                filled
                v-model="filter"
                clearable
                label="Search .."
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
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "OpsHeadExceptions", // Changed to multi-word component name
  components: { generalLeadInformation },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const activeId = ref("");
    const filter = ref("");

    const paginationControl = ref({
      page: 1,
      rowsPerPage: 10,
      sortBy: "leadId",
      descending: false,
      rowsNumber: 0
    });

    const tableData = ref([]);

    const columns = ref([
      { name: "updatedAt", label: "Date of updation", align: "left", field: "updatedAt", sortable: true },
      { name: "leadId", label: "Lead ID", align: "center", field: row => "# " + row.leadId, sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: "leadName", sortable: true },
      { name: "soName", label: "SO Name", align: "left", field: "soName", sortable: true },
      { name: "soRemarks", label: "SO Remarks", align: "left", field: "soRemarks", sortable: true },
      { name: "satName", label: "SAT Name", align: "left", field: "satName", sortable: true },
      { name: "kycSatRemark", label: "SAT Remarks", align: "left", field: "kycSatRemark", sortable: true },
      { name: "expectedSubmitDate", label: "Expected date of submission", align: "left", field: "expectedSubmitDate", sortable: true }
    ]);

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

    // Toggle Lead Information Popup
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    // Row click
    const fnRowClick = (row) => {
      console.log("Row clicked:", row);
      store.$router.push(`/ops/head/exceptions/${row.leadId}`);
    };
    
    const fnRowMouseOver = (index) => (activeId.value = index);
    const fnRowMouseLeave = () => (activeId.value = ""); // Fixed: removed unused parameter

    // Fetch table data (server-side)
    const ajaxLoadDataForAllExceptionList = async ({ pagination, filter: searchFilter }) => {
      $q.loading.show({ spinnerColor: "purple-9", message: "Fetching list..." });

      try {
        await store.dispatch("OPSHead/FETCH_ALL_EXCEPTION_KYC_DATA", { pagination, filter: searchFilter });

        const response = store.getters["OPSHead/getKycExceptionInfo"];

        paginationControl.value.rowsNumber = response.totalElements;
        paginationControl.value.page = response.number + 1;
        if (response.sort) {
          paginationControl.value.sortBy = response.sort[0].property;
          paginationControl.value.descending = response.sort[0].ascending;
        }

        tableData.value = response.content;
      } catch (error) {
        console.error("Failed to fetch exceptions:", error);
        $q.notify({
          color: "negative",
          message: "Failed to load exceptions data",
          icon: "error"
        });
      } finally {
        $q.loading.hide();
      }
    };

    // Load data on mount
    onMounted(() => {
      ajaxLoadDataForAllExceptionList({ pagination: paginationControl.value, filter: filter.value });
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      activeId,
      filter,
      paginationControl,
      columns,
      tableData,
      toggleLeadInformation,
      fnRowClick,
      fnRowMouseOver,
      fnRowMouseLeave,
      ajaxLoadDataForAllExceptionList,
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