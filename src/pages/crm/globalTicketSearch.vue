<template>
  <q-page class="q-pa-md">
    <!-- Page Title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      CRM Global Ticket Search
    </div>

    <!-- Search Bar -->
    <div class="row gutter-x-xs gutter-y-xs q-pt-md items-end">
      <div class="col-md-4">
        <q-input
          outlined
          clearable
          v-model="formData.searchTerm"
          placeholder="Search By Ticket ID..."
          @clear="handleClear"
          dense
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-md-2">
        <q-btn
          class="auto"
          size="md"
          color="purple-9"
          label="Submit"
          :disable="formData.searchTerm === ''"
          @click="globalSearchSubmit"
        />
      </div>
    </div>

    <!-- No Data Available -->
    <div
      v-if="!tableData"
      class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg dFont"
      style="min-height: calc(80vh - 52px);"
    >
      <div class="row items-center justify-center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="q-subheading text-bold text-grey-9 q-ml-md">No Data Available</div>
      </div>
    </div>

    <!-- Data Cards -->
    <div v-if="tableData" class="row q-gutter-lg justify-center">
      <!-- Merchant Details Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md items-center round-borders q-pa-sm algn1">
          <q-card-section class="bg-purple-9 text-white">
            <div class="q-subheading text-bold">Merchant Details</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="col">
              <div
                class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9"
              >
                <span class="col-md-4 text-weight-medium">{{ fieldKeys.merchantDetails.meName.label }}</span>
                <span class="col-md-8 text-wrap text-primary">{{ tableData.meName }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{ fieldKeys.merchantDetails.leadId.label }}</span>
                <span class="col-md-8 text-wrap text-primary"># {{ tableData.leadId }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{ fieldKeys.merchantDetails.region.label }}</span>
                <span class="col-md-8 text-wrap text-primary">{{ tableData.bpRegion.regionAreaName }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{ fieldKeys.merchantDetails.contactNumber.label }}</span>
                <span class="col-md-8 text-wrap text-primary">{{ tableData.contactNumber }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Ticket Status Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md round-borders q-pa-sm algn2">
          <q-card-section class="bg-purple-9 text-white">
            <div class="q-subheading text-bold">Ticket Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">{{ fieldKeys.ticketStatus.ticketNumber.label }}</span>
              <span class="col-md-8 text-wrap text-primary">{{ tableData.serviceReqTicketId }}</span>
            </div>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">{{ fieldKeys.ticketStatus.ticketStatus.label }}</span>
              <span class="col-md-8 text-wrap text-primary">
                {{ tableData.subTicketsList[0].serviceRequestSubTicketStatus.name }}
              </span>
            </div>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">{{ fieldKeys.ticketStatus.createdDate.label }}</span>
              <span class="col-md-8 text-wrap text-primary">{{ formatDate(tableData.createdDate) }}</span>
            </div>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">{{ fieldKeys.ticketStatus.updatedDate.label }}</span>
              <span class="col-md-8 text-wrap text-primary">{{ formatDate(tableData.updatedDate) }}</span>
            </div>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">{{ fieldKeys.ticketStatus.serviceResolutionRemarks.label }}</span>
              <span class="col-md-8 text-wrap text-primary">
                {{ tableData.subTicketsList[0].serviceResolutionRemarks?.name || "NA" }}
              </span>
            </div>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">{{ fieldKeys.ticketStatus.resolutionRemark.label }}</span>
              <span class="col-md-8 text-wrap text-primary">
                {{ tableData.subTicketsList[0].resolutionRemark || "NA" }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = useStore();

const formData = ref({
  searchTerm: "",
});
const tableData = ref(null);

const fieldKeys = {
  merchantDetails: {
    meName: { label: "Merchant Name" },
    leadId: { label: "Lead Number" },
    region: { label: "Region" },
    contactNumber: { label: "Mobile Number" },
  },
  ticketStatus: {
    ticketNumber: { label: "Ticket Number" },
    ticketStatus: { label: "Ticket Status" },
    createdDate: { label: "Created Date" },
    updatedDate: { label: "Updated Date" },
    serviceResolutionRemarks: { label: "Service Resolution Remarks" },
    resolutionRemark: { label: "Resolution Remarks" },
  },
};

// Vuex getters
const getcrmGlobalSearchTicketId = computed(
  () => store.getters["crmGlobalSearchTicketId/getcrmGlobalSearchTicketId"]
);

// Global Search Submit
const globalSearchSubmit = async () => {
  if (!formData.value.searchTerm) return;
  $q.loading.show();
  try {
    await store.dispatch("crmGlobalSearchTicketId/FETCH_CRM_GLOBAL_SEARCH_DATAS", {
      searchTerm: formData.value.searchTerm,
    });
    tableData.value = getcrmGlobalSearchTicketId.value;
  } finally {
    $q.loading.hide();
  }
};

// Clear Table Data
const handleClear = () => {
  tableData.value = null;
};

// Date formatting helper
const formatDate = (date) => {
  if (!date) return "NA";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

<style scoped>
.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}

.algn1 {
  width: 268%;
  height: 124%;
  margin-left: -103%;
  border: 1px solid #5a5959;
}

.algn2 {
  width: 281%;
  height: 97%;
  margin-left: -117%;
  border: 1px solid #5a5959;
}
</style>
