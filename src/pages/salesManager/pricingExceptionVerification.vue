<template>
  <q-page padding>
    <div>
      <!-- Lead Information Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Table Header -->
      <div
        class="row bottom-border items-center"
        :class="getRoleForTableToggleRsmList ? 'q-py-sm' : 'q-py-md'"
      >
        <div class="col q-title q-px-lg text-weight-regular text-grey-9">
          Pricing Exception Approval
        </div>
        <div class="col-auto">
          <q-btn
            v-if="getRoleForTableToggleRsmList"
            flat
            icon="arrow_left"
            label="Go back"
            @click="toggleTabs"
          />
        </div>
      </div>

      <!-- Tabs for Pricing Exception -->
      <div v-if="shouldShowGivenPricefield">
        <q-tabs v-model="tab" inverted color="purple-9">
          <q-tab name="pending" label="Pending" :count="pricingExceptionCountForTab" />
          <q-tab name="history" label="History" />
        </q-tabs>

        <q-tab-panels v-model="tab">
          <!-- Pending Tab -->
          <q-tab-panel name="pending">
            <q-table
              :rows="getPricingExceptionList"
              :columns="columns"
              :filter="filter"
              v-model:pagination="paginationControl"
              row-key="leadNumber"
              table-class="customTableClass"
            >
              <template #top>
                <div class="row bottom-border q-pa-sm items-center">
                  <div class="col-md-5">
                    <q-input
                      filled
                      clearable
                      v-model="filter"
                      label="Search by Merchant Name, Lead ID"
                      placeholder="Type..."
                      dense
                    >
                      <template #append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </template>

              <template #body-cell-leadNumber="props">
                <span
                  class="label text-primary cursor-pointer"
                  @click="toggleLeadInformation(props.row)"
                ># {{ props.row.leadNumber }}</span>
              </template>

              <template #body-cell-submittoRSMDate="props">
                {{ formatDate(props.row.submittoRSMDate) }}
              </template>

              <template #body-cell-action="props">
                <q-btn
                  outline
                  push
                  color="purple-9"
                  size="sm"
                  label="Review"
                  @click="pushToDetailedScreenRsm(props.row.id)"
                />
              </template>
            </q-table>
          </q-tab-panel>

          <!-- History Tab -->
          <q-tab-panel name="history">
            <q-table
              v-if="!getRoleForTableToggleRsmList"
              :rows="getPricingRsmList"
              :columns="rsmcolumns"
              :filter="filter"
              v-model:pagination="paginationControl"
              row-key="name"
              table-class="customTableClass"
            >
              <template #body="props">
                <q-tr
                  :class="rowActiveId === props.row.__index ? 'bg-grey-4 text-dark' : ''"
                  class="cursor-pointer"
                  @mouseover="rowHover(props.row.__index)"
                  @click="rowClick(props.row)"
                >
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>

            <q-table
              v-if="getRoleForTableToggleRsmList"
              :rows="pricingExceptionByRsmIDList"
              :columns="rsmcolumnsLeads"
              :filter="filter"
              v-model:pagination="paginationControl"
              row-key="leadNumber"
              table-class="customTableClass"
            >
              <template #top>
                <div class="row bottom-border q-pa-sm items-center">
                  <div class="col-md-5">
                    <q-input
                      filled
                      clearable
                      v-model="filter"
                      label="Search by Merchant Name, Lead ID"
                      placeholder="Type..."
                      dense
                    >
                      <template #append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </template>

              <template #body-cell-leadNumber="props">
                <span
                  class="label text-primary cursor-pointer"
                  @click="toggleLeadInformation(props.row)"
                ># {{ props.row.leadNumber }}</span>
              </template>

              <template #body-cell-action="props">
                <q-btn
                  outline
                  push
                  color="purple-9"
                  size="sm"
                  label="Review"
                  @click="pushToDetailedScreen(props.row.id)"
                />
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- Without Tabs -->
      <div v-else>
        <q-table
          :rows="getPricingExceptionList"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="leadNumber"
          table-class="customTableClass"
        >
          <template #top>
            <div class="row bottom-border q-pa-sm items-center">
              <div class="col-md-5">
                <q-input
                  filled
                  clearable
                  v-model="filter"
                  label="Search by Merchant Name, Lead ID"
                  placeholder="Type..."
                  dense
                >
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>

          <template #body-cell-leadNumber="props">
            <span
              class="label text-primary cursor-pointer"
              @click="toggleLeadInformation(props.row)"
            ># {{ props.row.leadNumber }}</span>
          </template>

          <template #body-cell-submittoRSMDate="props">
            {{ formatDate(props.row.submittoRSMDate) }}
          </template>

          <template #body-cell-action="props">
            <q-btn
              outline
              push
              color="purple-9"
              size="sm"
              label="Review"
              @click="pushToDetailedScreenRsm(props.row.id)"
            />
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import { date } from "quasar"; // for formatting date

export default {
  name: "RevenueApproval",
  components: { generalLeadInformation },
  setup(_, { root }) {
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const shouldShowGivenPricefield = ref(false);
    const pricingExceptionCountForTab = ref(0);
    const getRoleForTableToggleRsmList = ref(false);
    const rowActiveId = ref(0);
    const filter = ref("");
    const paginationControl = ref({ rowsPerPage: 10 });
    const tab = ref("pending");

    const { getPricingExceptionList, pricingExceptionByRsmIDList, getPricingRsmList } =
      root.$store.getters["rsmPricingExceptionVerification"];

    const { PRICING_EXCEPTION_LIST, PRICING_RSM_LIST, PRICING_EXCEPTION_LIST_WHERE_RSMID } =
      root.$store.dispatch;

    const columns = [
      {
        name: "createdBy",
        label: "SO name",
        align: "left",
        field: row => row.createdBy?.name || "",
        sortable: false,
      },
      {
        name: "submittoRSMDate",
        label: "Submitted to RSM date",
        align: "left",
        field: row => row.submittoRSMDate,
        sortable: false,
      },
      {
        name: "leadNumber",
        label: "Lead ID",
        align: "left",
        field: "leadNumber",
        sortable: true,
      },
      {
        name: "Status",
        label: "Type",
        align: "left",
        field: row =>
          [2, 6].includes(row.verifiedCmsPricingStatus) ? "Change Request" : "New Lead",
        sortable: true,
      },
      {
        name: "leadName",
        label: "Merchant name",
        align: "left",
        field: "leadName",
        sortable: false,
      },
      {
        name: "plan",
        label: "Regular plan",
        align: "left",
        field: row => row.plan?.planName || "",
        sortable: false,
      },
      {
        name: "merchantCategory",
        label: "Merchant category",
        align: "left",
        field: row => row.merchantCategory?.merchantCategoryName || "",
        sortable: false,
      },
      {
        name: "action",
        label: "",
        align: "left",
        field: "action",
        sortable: false,
      },
    ];

    const rsmcolumnsLeads = [
      ...columns
    ];

    const rsmcolumns = [
      { name: "name", label: "RSM name", align: "left", field: "name", sortable: false },
    ];

    const formatDate = dateStr => date.formatDate(dateStr, "Do MMM YYYY");

    const toggleLeadInformation = leadDetails => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const rowHover = index => {
      rowActiveId.value = index;
    };

    const rowClick = async item => {
      root.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching list..." });
      rowActiveId.value = item.__index;
      getRoleForTableToggleRsmList.value = true;
      try {
        await PRICING_EXCEPTION_LIST_WHERE_RSMID(item);
      } finally {
        root.$q.loading.hide();
      }
    };

    const pushToDetailedScreen = leadId => {
      root.$router.push(`/sales/manager/pricing/exception/verification/lead/${leadId}/details/${leadId}`);
    };

    const pushToDetailedScreenRsm = leadId => {
      root.$router.push(`/sales/manager/pricing/exception/verification/lead/${leadId}/details/`);
    };

    const toggleTabs = () => {
      getRoleForTableToggleRsmList.value = false;
    };

    const pricingExceptionList = async () => {
      root.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching list..." });

      const finalObj = _.find(JSON.parse(localStorage.getItem("u_i")).roles, o =>
        o.hierarchyRoleLevel === root.$ROLE_HIERARCHY_SALES_NATIONAL_HEAD
      );

      shouldShowGivenPricefield.value = !!finalObj;

      try {
        await PRICING_EXCEPTION_LIST();
        pricingExceptionCountForTab.value = getPricingExceptionList.length;
        await PRICING_RSM_LIST();
      } finally {
        root.$q.loading.hide();
      }
    };

    onMounted(() => {
      pricingExceptionList();
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      shouldShowGivenPricefield,
      pricingExceptionCountForTab,
      getRoleForTableToggleRsmList,
      rowActiveId,
      filter,
      paginationControl,
      tab,
      columns,
      rsmcolumnsLeads,
      rsmcolumns,
      getPricingExceptionList,
      pricingExceptionByRsmIDList,
      getPricingRsmList,
      toggleLeadInformation,
      rowHover,
      rowClick,
      pushToDetailedScreen,
      pushToDetailedScreenRsm,
      toggleTabs,
      formatDate,
    };
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
