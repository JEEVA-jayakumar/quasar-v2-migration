<template>
  <q-page>
    <!-- content -->
    <div>
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          default
          color="dark"
          name="active"
          label="Active MDR"
        />
        <q-tab
          color="dark"
          name="deactive"
          label="Deactived MDR"
        />
        <q-tab-panel name="active" class="q-pa-none">
          <!--START: table Data -->
          <q-table
            :rows="activetableData"
            :columns="columns"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
            binary-state-sort
          >
            <template #body-cell-leadSource="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadSource.sourceName)">
                <span class="label text-primary">{{ props.row.leadSource.sourceName }}</span>
              </q-td>
            </template>
            
            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnDeleteMDR(props.row)"
                    flat
                    class="text-negative"
                  />
                </div>
              </q-td>
            </template>
            
            <template #body-cell-device="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.device.deviceName)">
                <span class="label text-primary">{{ props.row.device.deviceName }}</span>
              </q-td>
            </template>

            <template #body-cell-marsDeviceModel="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.marsDeviceModel == null ? "NA" : props.row.marsDeviceModel.name }}</span>
              </q-td>
            </template>
            
            <template #body-cell-mdrPlanName="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.mdrPlanName == null ? "NA" : props.row.mdrPlanName }}</span>
              </q-td>
            </template>
            
            <!-- Static UPI columns -->
            <template #body-cell-staticUpiLessThanTwo="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.staticUpiLessThanTwo == null ? "NA" : props.row.staticUpiLessThanTwo }}</span>
              </q-td>
            </template>
            
            <template #body-cell-staticUpigreaterThanTwo="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.staticUpigreaterThanTwo == null ? "NA" : props.row.staticUpigreaterThanTwo }}</span>
              </q-td>
            </template>
            
            <template #body-cell-staticUpiDebitCard="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.staticUpiDebitCard == null ? "NA" : props.row.staticUpiDebitCard }}</span>
              </q-td>
            </template>
            
            <template #body-cell-staticUpicreditCardAndPrepaid="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.staticUpicreditCardAndPrepaid == null ? "NA" : props.row.staticUpicreditCardAndPrepaid }}</span>
              </q-td>
            </template>
            
            <!-- Merchant category columns -->
            <template #body-cell-merchantCategory="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="editMerchantDetails(props.row)"
                  :label="props.row.merchantCategory?.merchantCategoryName || 'NA'"
                  class="capitalize"
                />
              </q-td>
            </template>
            
            <!-- Small Merchant columns -->
            <template #body-cell-smallMerchantLessThanTwoDebit="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.smallMerchantLessThanTwoDebit == null ? "NA" : props.row.smallMerchantLessThanTwoDebit }}</span>
              </q-td>
            </template>
            
            <template #body-cell-smallMerchantGreaterThanTwoDebit="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.smallMerchantGreaterThanTwoDebit == null ? "NA" : props.row.smallMerchantGreaterThanTwoDebit }}</span>
              </q-td>
            </template>
            
            <template #body-cell-smallMerchantLessThanTwoCreditAndPrepaid="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.smallMerchantLessThanTwoCreditAndPrepaid == null ? "NA" : props.row.smallMerchantLessThanTwoCreditAndPrepaid }}</span>
              </q-td>
            </template>
            
            <template #body-cell-smallMerchantGreaterThanTwoCreditAndPrepaid="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.smallMerchantGreaterThanTwoCreditAndPrepaid == null ? "NA" : props.row.smallMerchantGreaterThanTwoCreditAndPrepaid }}</span>
              </q-td>
            </template>
            
            <!-- Large Merchant columns -->
            <template #body-cell-largeMerchantLessThanTwoDebit="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.largeMerchantLessThanTwoDebit == null ? "NA" : props.row.largeMerchantLessThanTwoDebit }}</span>
              </q-td>
            </template>
            
            <template #body-cell-largeMerchantGreaterThanTwoDebit="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.largeMerchantGreaterThanTwoDebit == null ? "NA" : props.row.largeMerchantGreaterThanTwoDebit }}</span>
              </q-td>
            </template>
            
            <template #body-cell-largeMerchantLessThanTwoCreditandPrepaid="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.largeMerchantLessThanTwoCreditandPrepaid == null ? "NA" : props.row.largeMerchantLessThanTwoCreditandPrepaid }}</span>
              </q-td>
            </template>
            
            <template #body-cell-largeMerchantGreaterThanTwoCreditandPrepaid="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.largeMerchantGreaterThanTwoCreditandPrepaid == null ? "NA" : props.row.largeMerchantGreaterThanTwoCreditandPrepaid }}</span>
              </q-td>
            </template>

            <template #top>
              <!--START: table filter,search -->
              <div class="col-md-12 group">
                <div class="row">
                  <div class="col-md-6">
                    <q-input
                      outlined
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Plan Name"
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-md-12" align="right">
                <q-btn
                  no-caps
                  class="text-weight-regular q-mt-md"
                  @click="$router.push('/super/admin/manage/mdr/charges')"
                  label="Add New Mdr Charges"
                  color="purple-9"
                  size="md"
                />
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
        
        <q-tab-panel name="deactive" class="q-pa-none">
          <!--START: table Data -->
          <q-table
            :rows="deActivetableData"
            :columns="columnDataDiabled"
            table-class="customTableClass"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
            binary-state-sort
          >
            <template #body-cell-leadSource="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadSource.sourceName)">
                <span class="label text-primary">{{ props.row.leadSource.sourceName }}</span>
              </q-td>
            </template>
            
            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Enable"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnEnableMDR(props.row)"
                    flat
                    class="text-positive"
                  />
                </div>
              </q-td>
            </template>
            
            <template #body-cell-device="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.device.deviceName)">
                <span class="label text-primary">{{ props.row.device.deviceName }}</span>
              </q-td>
            </template>

            <template #body-cell-marsDeviceModel="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.marsDeviceModel == null ? "NA" : props.row.marsDeviceModel.name }}</span>
              </q-td>
            </template>
            
            <template #body-cell-mdrPlanName="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.mdrPlanName == null ? "NA" : props.row.mdrPlanName }}</span>
              </q-td>
            </template>
            
            <!-- Add all other body-cell templates for deactive table similar to active table -->
            
            <template #top>
              <!--START: table filter,search -->
              <div class="col-md-12 group">
                <div class="row">
                  <div class="col-md-6">
                    <q-input
                      outlined
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch1"
                      placeholder="Type.."
                      label="Search by Plan Name"
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tabs>
      
      <div class="row items-center gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center"></div>
        </div>
      </div>
      
      <EditMDRCharges
        v-if="propShoweditMerchantDetails"
        :propShoweditMerchantDetails="propShoweditMerchantDetails"
        :propRowDetails="propRowDetails"
        @emitfnshowEditMDR="editMerchantDetails"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import EditMDRCharges from "../../pages/super_admin/editMDRCharges.vue";

const $q = useQuasar();
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const propShoweditMerchantDetails = ref(false);
const propRowDetails = ref("");
const filterSearch = ref("");
const filterSearch1 = ref("");
const selectedTab = ref("active");
const tableData = ref([]);
const activetableData = ref([]);
const deActivetableData = ref([]);


const formData = ref({
  marsDeviceIdsCooked: [],
  marsDeviceIdsCookedUnAssinged: [],
  triggerWelcomeMail: false,
  assignTo: ""
});

const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: "id",
  descending: false,
  rowsPerPage: 10
});

const paginationControl1 = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: "id",
  descending: false,
  rowsPerPage: 10
});

const tableAjaxLoading = ref(false);
const tableAjaxLoading1 = ref(false);

// Columns definition
const columns = [
  {
    name: "mdrPlanName",
    required: true,
    label: "Mdr Plan Name",
    align: "left",
    field: row => row.mdrPlanName,
    sortable: true
  },
  {
    name: "merchantCategory",
    required: true,
    label: "Selected Merchant Category",
    align: "left",
    field: row => row.merchantCategory?.merchantCategoryName,
    sortable: true
  },
  {
    name: "leadSource",
    required: true,
    label: "Lead Source",
    align: "left",
    field: row => row.leadSource?.sourceName,
    sortable: true
  },
  {
    name: "device",
    required: true,
    label: "Device Type",
    align: "left",
    field: row => row.device?.deviceName,
    sortable: true
  },
  {
    name: "marsDeviceModel",
    required: true,
    label: "Mars Device Model",
    align: "left",
    field: row => row.marsDeviceModel?.name,
    sortable: true
  },
  {
    name: "debitLessthanAmount",
    required: true,
    label: "Debit Less Amount",
    align: "left",
    field: "debitLessthanAmount",
    sortable: true
  },
  {
    name: "debitGreaterthanAmount",
    required: true,
    label: "Debit Greater Amount",
    align: "left",
    field: "debitGreaterthanAmount",
    sortable: true
  },
  {
    name: "stdCC",
    required: true,
    label: "stdCC",
    align: "left",
    field: "stdCC",
    sortable: true
  },
  {
    name: "premiumCC",
    required: true,
    label: "premiumCC",
    align: "left",
    field: "premiumCC",
    sortable: true
  },
  {
    name: "corpCC",
    required: true,
    label: "corpCC",
    align: "left",
    field: "corpCC",
    sortable: true
  },
  {
    name: "intlCC",
    required: true,
    label: "intlCC",
    align: "left",
    field: "intlCC",
    sortable: true
  },
  {
    name: "superPremiumlCC",
    required: true,
    label: "superPremiumlCC",
    align: "left",
    field: "superPremiumlCC",
    sortable: true
  },
  {
    name: "amexDomestic",
    required: true,
    label: "Amex Domestic",
    align: "left",
    field: "amexDomestic",
    sortable: true
  },
  {
    name: "amexInternational",
    required: true,
    label: "Amex International",
    align: "left",
    field: "amexInternational",
    sortable: true
  },
  {
    name: "upiDebitCardUpTo2000",
    required: true,
    label: "UPI Debit Card UpTo 2000",
    align: "left",
    field: "upiDebitCardUpTo2000",
    sortable: true
  },
  {
    name: "upiDebitCardAbove2000",
    required: true,
    label: "UPI Debit Card Above 2000",
    align: "left",
    field: "upiDebitCardAbove2000",
    sortable: true
  },
  {
    name: "upiPrepaidCreditCardsUpTo2000",
    required: true,
    label: "UPI Prepaid Credit Cards UpTo 2000",
    align: "left",
    field: "upiPrepaidCreditCardsUpTo2000",
    sortable: true
  },
  {
    name: "upiPrepaidCreditCardsAbove2000",
    required: true,
    label: "UPI Prepaid Credit Cards Above 2000",
    align: "left",
    field: "upiPrepaidCreditCardsAbove2000",
    sortable: true
  },
  {
    name: "smallMerchantLessThanTwoDebit",
    required: true,
    label: "Small merchant < 2000 debit",
    align: "left",
    field: row => row.smallMerchantLessThanTwoDebit,
    sortable: true
  },
  {
    name: "smallMerchantGreaterThanTwoDebit",
    required: true,
    label: "Small merchant > 2000 debit",
    align: "left",
    field: row => row.smallMerchantGreaterThanTwoDebit,
    sortable: true
  },
  {
    name: "smallMerchantLessThanTwoCreditAndPrepaid",
    required: true,
    label: "Small merchant < 2000 credit and prepaid",
    align: "left",
    field: row => row.smallMerchantLessThanTwoCreditAndPrepaid,
    sortable: true
  },
  {
    name: "smallMerchantGreaterThanTwoCreditAndPrepaid",
    required: true,
    label: "small Merchant > 2000 Credit and Prepaid",
    align: "left",
    field: row => row.smallMerchantGreaterThanTwoCreditAndPrepaid,
    sortable: true
  },
  {
    name: "largeMerchantLessThanTwoDebit",
    required: true,
    label: "large merchant < 2000 debit ",
    align: "left",
    field: row => row.largeMerchantLessThanTwoDebit,
    sortable: true
  },
  {
    name: "largeMerchantGreaterThanTwoDebit",
    required: true,
    label: "Large merchant > 2000 debit ",
    align: "left",
    field: row => row.largeMerchantGreaterThanTwoDebit,
    sortable: true
  },
  {
    name: "largeMerchantLessThanTwoCreditandPrepaid",
    required: true,
    label: "Large merchant < 2000 credit and prepaid",
    align: "left",
    field: row => row.largeMerchantLessThanTwoCreditandPrepaid,
    sortable: true
  },
  {
    name: "largeMerchantGreaterThanTwoCreditandPrepaid",
    required: true,
    label: "Large merchant > 2000 credit and prepaid",
    align: "left",
    field: row => row.largeMerchantGreaterThanTwoCreditandPrepaid,
    sortable: true
  },
  {
    name: "action",
    required: true,
    label: "",
    align: "left",
    field: "action",
    sortable: false
  }
];

const columnDataDiabled = [...columns]; // Copy columns for deactivated tab

// Computed properties
const getAllMdrPlanDetails = computed(() => store.getters['mdrCharges/getAllMdrPlanDetails']);
const getMdrChargesDeactive = computed(() => store.getters['mdrChargesDeactive/getMdrChargesDeactive']);

// Methods
const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  });
  
  try {
    await store.dispatch('mdrCharges/FETCH_ALL_MDR_PLAN_DETAILS', { pagination, filter });
    
    paginationControl.value = {
      ...paginationControl.value,
      ...pagination,
      rowsNumber: getAllMdrPlanDetails.value.totalElements || 0,
      page: (getAllMdrPlanDetails.value.number || 0) + 1
    };
    
    tableData.value = getAllMdrPlanDetails.value.content || [];
    activetableData.value = tableData.value.filter(service => service.active === true);
    
    if (getAllMdrPlanDetails.value.sort && getAllMdrPlanDetails.value.sort.length > 0) {
      paginationControl.value.sortBy = getAllMdrPlanDetails.value.sort[0].property;
      paginationControl.value.descending = !getAllMdrPlanDetails.value.sort[0].ascending;
    }
  } catch (error) {
    console.error('Error loading MDR plan details:', error);
  } finally {
    $q.loading.hide();
  }
};

const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  });
  
  try {
    await store.dispatch('mdrChargesDeactive/FETCH_ALL_DEACTIVATED_MDR_PLAN_DETAILS', { pagination, filter });
    
    paginationControl1.value = {
      ...paginationControl1.value,
      ...pagination,
      rowsNumber: getMdrChargesDeactive.value.totalElements || 0,
      page: (getMdrChargesDeactive.value.number || 0) + 1
    };
    
    tableData.value = getMdrChargesDeactive.value.content || [];
    deActivetableData.value = tableData.value.filter(service => service.active === false);
    
    if (getMdrChargesDeactive.value.sort && getMdrChargesDeactive.value.sort.length > 0) {
      paginationControl1.value.sortBy = getMdrChargesDeactive.value.sort[0].property;
      paginationControl1.value.descending = !getMdrChargesDeactive.value.sort[0].ascending;
    }
  } catch (error) {
    console.error('Error loading deactivated MDR plan details:', error);
  } finally {
    $q.loading.hide();
  }
};

const editMerchantDetails = (rowDetails) => {
  propShoweditMerchantDetails.value = !propShoweditMerchantDetails.value;
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails;
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filterSearch.value
    });
  }
};



const fnEnableMDR = (request) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure, do you want to enable this MDR?",
    ok: "Continue",
    cancel: "Cancel"
  }).onOk(() => {
    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "purple-9",
      customClass: "shadow-none"
    });
    
    request.active = !request.active;
    
    store.dispatch('CategoryBasedMdr/ENABLE_OR_DISABLE_MDR_PLAN', request)
      .then(() => {
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully enabled",
          icon: "thumb_up"
        });
      })
      .catch((error) => {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.data?.message || "An error occurred",
          icon: "thumb_down"
        });
      })
      .finally(() => {
        $q.loading.hide();
      });
  }).onCancel(() => {
    // Cancel action
  });
};

const fnDeleteMDR = (request) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to disable MDR?",
    ok: "Continue",
    cancel: "Cancel"
  }).onOk(() => {
    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "purple-9",
      customClass: "shadow-none"
    });
    
    request.active = false;
    
    store.dispatch('CategoryBasedMdr/ENABLE_OR_DISABLE_MDR_PLAN', request)
      .then(() => {
        ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully disabled",
          icon: "thumb_up"
        });
      })
      .catch((error) => {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.data?.message || "An error occurred",
          icon: "thumb_down"
        });
      })
      .finally(() => {
        $q.loading.hide();
      });
  }).onCancel(() => {
    // Cancel action
  });
};

const goToUnassignedTab = (tab) => {
  if (tab === "deactive") {
    filterSearch1.value = "";
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1.value,
      filter: filterSearch1.value
    });
  } else {
    filterSearch.value = "";
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filterSearch.value
    });
  }
};

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

// Lifecycle
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filterSearch.value
  });
  
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1.value,
    filter: filterSearch1.value
  });
});

// Watch for filter changes
watch(filterSearch, (newValue) => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: newValue
  });
});

watch(filterSearch1, (newValue) => {
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1.value,
    filter: newValue
  });
});
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}

.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>