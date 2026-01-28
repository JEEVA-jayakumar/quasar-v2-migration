<template>
  <q-page padding>
    <div>
      <!-- Common lead information popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Table title -->
      <div class="row bottom-border items-center q-px-lg q-py-md">
        <div class="col q-title text-weight-regular text-grey-9">
          Lead Allocation Tracker
        </div>
        <div class="col-auto">
          <q-btn
            color="dark"
            label="Lead Allocation"
            icon="add"
            @click="$router.push('/sales/manager/lead/allocation/tracker/add/new')"
          />
        </div>
      </div>

      <!-- Lead Allocation Table -->
      <q-table
        table-class="customTableClass"
        class="q-py-none"
        :rows="getAllLeadAllocationData.assignedLeads"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
      >
        <!-- Top slot: search -->
        <template #top>
          <div class="row bottom-border q-pa-sm items-center">
            <div class="col-md-5">
              <q-input
                filled
                clearable
                v-model="filter"
                label="Search by SO name, Merchant Name, Lead ID"
                placeholder="Type.."
                dense
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>

        <!-- Custom cells -->
        <template #body-cell-dateCreated="props">
          {{ formatDate(props.row.createdAt) }}
        </template>

        <template #body-cell-shortleadDate="props">
          {{ formatDate(props.row.shortleadDate) }}
        </template>

        <template #body-cell-leadId="props">
          <span
            class="text-primary cursor-pointer"
            @click="toggleLeadInformation(props.row)"
          >
            # {{ props.row.leadNumber }}
          </span>
        </template>

        <template #body-cell-leadAddress="props">
          <span class="breakAll">{{ props.row.leadAddress }}</span>
        </template>

        <template #body-cell-assignedTo="props">
          {{ props.row.assignedTo ? props.row.assignedTo.name : "NA" }}
        </template>

        <template #body-cell-action="props">
          <q-btn
            label="Edit"
            color="amber-9"
            icon="edit"
            @click="navigateToEditScreen(props.row)"
          />
        </template>
      </q-table>

      <!-- Ajax spinner overlay -->
      <q-spinner-bars
        v-if="toggleAjaxLoadFilter"
        class="absolute-full bg-white bg-opacity-60"
        color="#61116a"
        size="35"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import dayjs from "dayjs"; // Using dayjs for date formatting

export default {
  name: "leadsPendingAssignment",
  components: { generalLeadInformation },
  setup() {
    const store = useStore();
    const router = useRouter();

    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);

    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);

    const paginationControl = reactive({
      rowsPerPage: 10,
    });

    const columns = [
      { name: "dateCreated", label: "Date Created", align: "left", field: "createdAt", sortable: true },
      { name: "shortleadDate", label: "Submitted On", align: "center", field: "shortleadDate", sortable: true },
      { name: "leadId", label: "Lead ID", align: "left", field: row => "# " + row.leadNumber, sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: "leadName", sortable: false },
      { name: "leadAddress", label: "Location", align: "left", field: "leadAddress", sortable: false },
      { name: "assignedTo", label: "SO Name", align: "left", field: "assignedTo", sortable: false },
      { name: "action", label: "", align: "left", field: "action", sortable: false },
    ];

    // Vuex getter
    const getAllLeadAllocationData = computed(() =>
      store.getters["SalesManager_LeadAllocation/getAllLeadAllocationData"]
    );

    // Vuex action to fetch data
    const fnAjaxRequestPopulateTrackerData = () => {
      toggleAjaxLoadFilter.value = true;
      store.dispatch("SalesManager_LeadAllocation/FETCH_ALL_LEAD_ALLOCATION_DATA").finally(() => {
        toggleAjaxLoadFilter.value = false;
      });
    };

    // Navigate to edit screen
    const navigateToEditScreen = (item) => {
      router.push({ name: "leadAllocationEdit", params: { id: item.id } });
    };

    // Toggle lead information popup
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    // Date formatting
    const formatDate = (date) => (date ? dayjs(date).format("Do MMM YYYY") : "-");

    // Fetch data on mounted
    onMounted(() => {
      fnAjaxRequestPopulateTrackerData();
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      filter,
      toggleAjaxLoadFilter,
      paginationControl,
      columns,
      getAllLeadAllocationData,
      navigateToEditScreen,
      toggleLeadInformation,
      formatDate,
    };
  },
};
</script>

<style scoped>
.breakAll {
  word-break: break-word;
}
.absolute-full {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
