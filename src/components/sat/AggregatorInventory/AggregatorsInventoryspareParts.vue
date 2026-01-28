<template>
  <q-page padding>
    <!-- Spare Counts Section -->
    <div class="row bottom-border q-ma-md q-py-md">
      <div class="col-12 text-weight-regular text-grey-9" align="left" style="width: 50px;">
        Spare Counts
      </div>

      <div class="col-md-9 col-sm-12 col-xs-12">
        <div v-if="regionSpareCount.length > 0" class="row">
          <q-card
            v-for="menu in regionSpareCount"
            :key="menu.value.id"
            class="border-radius-10 q-pa-md q-ma-md"
            color="purple-9"
            style="height: 35px; width: 35px;"
          >
            <div>
              <big>{{ menu.value.count }}</big>
            </div>
            <div>
              <label>{{ menu.value.spareParts.spare_parts_types }}</label>
            </div>
          </q-card>
        </div>

        <div v-else class="row group">
          <q-alert color="primary" icon="info">
            No data available to display
          </q-alert>
        </div>
      </div>
    </div>

    <!-- Tabs Section -->
    <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToSelectedTab">
      <q-tab name="incomingPods" label="Incoming Pod's" color="dark" />
      <q-tab name="stocks" label="Stocks" color="dark" />
      <q-tab name="SoPodList" label="So Pod List" color="dark" />
      <q-tab name="createSoPod" label="Create So Pod" color="dark" />

      <!-- So Pod List Tab -->
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="SoPodList">
          <PhonepeSoPodList />
        </q-tab-panel>

        <!-- Incoming Pods Tab -->
        <q-tab-panel name="incomingPods">
          <q-table
            :rows="tableData"
            :columns="columns"
            row-key="name"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            class="customSATableClass"
            color="grey-9"
            @request="ajaxLoadAllLeadInfo"
          >
            <template #top>
              <div class="col-3">
                <q-input
                  v-model="filterSearch"
                  clearable
                  outlined
                  dense
                  placeholder="Search By POD Number"
                  label="Search By POD Number"
                  class="q-mr-lg"
                />
              </div>
            </template>

            <template #body-cell-createdAt="props">
              {{ props.row.created_date ? formatDate(props.row.created_date) : "NA" }}
            </template>

            <template #body-cell-updated_date="props">
              {{ props.row.updated_date ? formatDate(props.row.updated_date) : "NA" }}
            </template>

            <template #body-cell-status="props">
              <q-chip
                :color="statusColor(props.row.status)"
                dense
                outline
                label="true"
                class="q-ma-xs"
              >
                {{ statusLabel(props.row.status) }}
              </q-chip>
            </template>

            <template #body-cell-owner="props">
              <q-chip
                dense
                outline
                class="q-ma-xs"
                color="primary"
                label="true"
              >
                {{ ownerLabel(props.row.owner) }}
              </q-chip>
            </template>

            <template #body-cell-regionAreaName="props">
              {{ props.row.allocate_region?.regionAreaName ?? "NA" }}
            </template>

            <template #body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  color="negative"
                  label="Reject"
                  icon="far fa-minus-square"
                  @click="fnRejectPodDetails(props.row)"
                />
                <q-btn
                  dense
                  flat
                  color="info"
                  label="Approve"
                  icon="far fa-plus-square"
                  @click="fnApprovePodDetails(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Stocks Tab -->
        <q-tab-panel name="stocks">
          <q-table
            :rows="tableData1"
            :columns="columns1"
            row-key="name"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            :filter-method="myCustomSearchFilter"
            class="customSATableClass"
            color="grey-9"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template #top>
              <div class="col-3">
                <q-input
                  v-model="filterSearch1"
                  clearable
                  outlined
                  dense
                  placeholder="Search By POD Number"
                  label="Search By POD Number"
                  class="q-mr-lg"
                />
              </div>
            </template>

            <template #body-cell-createdAt="props">
              {{ props.row.created_date ? formatDate(props.row.created_date) : "NA" }}
            </template>

            <template #body-cell-updated_date="props">
              {{ props.row.updated_date ? formatDate(props.row.updated_date) : "NA" }}
            </template>

            <template #body-cell-status="props">
              <q-chip
                :color="statusColor(props.row.status)"
                dense
                outline
                class="q-ma-xs"
              >
                {{ statusLabel(props.row.status) }}
              </q-chip>
            </template>

            <template #body-cell-owner="props">
              <q-chip dense outline class="q-ma-xs">
                {{ ownerLabel(props.row.owner) }}
              </q-chip>
            </template>

            <template #body-cell-regionAreaName="props">
              {{ props.row.allocate_region?.regionAreaName ?? "NA" }}
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Create So Pod Tab -->
        <q-tab-panel name="createSoPod">
          <div class="col-sm-12 col-md-6">
            <q-select
              v-model="formData.allocate_so"
              :options="regionBasedSo"
              label="Select SO"
              outlined
              dense
              clearable
              @blur="$v.formData.allocate_so.$touch()"
              :error="$v.formData.allocate_so.$error"
            />

            <div class="q-mt-md">
              <p class="caption">Spare Parts Type*</p>
              <div class="row q-gutter-sm">
                <div
                  class="row items-center"
                  v-for="menu in sparePartsTypes"
                  :key="menu.value.id"
                >
                  <q-checkbox
                    v-model="menu.selected"
                    :label="menu.value.spare_parts_types"
                    @update:model-value="() => getSelectedDetails($event, menu.value)"
                    dense
                  />
                  <div :id="menu.value.id + '_DV'" v-show="menu.selected" class="q-mt-sm">
                    <q-input
                      type="number"
                      min="0"
                      max="5000"
                      :value="menu.count"
                      @blur="getAllCounts($event, menu)"
                      dense
                      outlined
                      label="Count"
                    />
                  </div>
                </div>
              </div>
            </div>

            <q-input
              v-model="formData.pod_number"
              label="Pod Number"
              outlined
              dense
              disable
              class="q-mt-md"
            />

            <q-input
              v-model="formData.total_count"
              label="Total Count"
              outlined
              dense
              disable
              class="q-mt-md"
            />

            <div class="q-mt-md" align="center">
              <q-btn
                :disable="formData.total_count === 0"
                color="purple-9"
                label="Submit"
                @click="fnSubmitBankDetails(formData)"
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-tabs>

    <!-- Reject Modal -->
    <PhonepeRejectPodDetails
      v-if="showRejectModel"
      :showRejectModel="showRejectModel"
      :propShowRejectComponent="propsRejectAppend"
      @reloadPaymentTrackerData="ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter })"
      @closeRejectModel="fnRejectPodDetails"
    />
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

import PhonepeSoPodList from '../AggregatorInventory/PhonepeSoPodList.vue';
import PhonepeRejectPodDetails from '../AggregatorInventory/PhonepeRejectPodDetails.vue';

// Vuelidate for Vue 3
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const $q = useQuasar();
const store = useStore();

// ---------- COMPONENT STATE ----------
const showRejectModel = ref(false);
const propsRejectAppend = ref([]);
const filterSearch = ref('');
const filterSearch1 = ref('');
const regionBasedSo = ref([]);
const regionSpareCount = ref([]);
const sparePartsTypes = ref([]);
const tableData = ref([]);
const tableData1 = ref([]);
const selectedTab = ref('');

// ---------- FORM DATA ----------
const formData = reactive({
  allocate_region: '',
  allocate_reseller: null,
  allocate_so: '',
  pod_number: '',
  sparePartsSets: [],
  total_count: 0
});

// ---------- PAGINATION CONTROL ----------
const paginationControl = reactive({
  page: 1,
  rowsNumber: 0,
  rowsPerPage: 5,
  sortBy: 'updated_date',
  descending: false
});

const paginationControl1 = reactive({ ...paginationControl });

// ---------- TABLE COLUMNS ----------
const columns = [
  { name: 'pod_number', label: 'Pod Number', align: 'left', field: 'pod_number', sortable: true },
  {
    name: 'regionAreaName',
    label: 'Region',
    align: 'left',
    field: row => row.allocate_region?.regionAreaName ?? '',
  },
  { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: false },
  { name: 'owner', label: 'Owner', align: 'left', field: 'owner', sortable: false },
  { name: 'total_count', label: 'Total Count', align: 'left', field: 'total_count', sortable: false },
  { name: 'createdAt', label: 'Created Date', align: 'left', field: 'created_date', sortable: false },
  { name: 'updated_date', label: 'Updated Date', align: 'left', field: 'updated_date', sortable: true },
  { name: 'action', label: '', align: 'left', field: 'action', sortable: false },
];

// ---------- VUELIDATE ----------
const rules = reactive({
  formData: {
    allocate_so: { required }
  }
});

const v$ = useVuelidate(rules, { formData });

// ---------- HELPER FUNCTIONS ----------
function generatePodNumber() {
  const timestamp = new Date().getTime();
  formData.pod_number = `SO${timestamp}`;
}

// ---------- REGION BASED SO ----------
async function regionBasedSoLoad() {
  const regionId = JSON.parse(localStorage.getItem('u_i'))?.region?.id;
  if (!regionId) return;

  await store.dispatch('InventoryCentral/FETCH_REGION_BASED_SO', regionId);
  regionBasedSo.value = store.getters['InventoryCentral/getRegionBasedSO'].map(
    so => ({
      label: `${so.name} | ${so.employeeID} | ${so.email}`,
      value: JSON.stringify(so)
    })
  );
}

// ---------- SPARE PARTS TYPES ----------
async function fnSparePartsTypes() {
  await store.dispatch('sparePartsGetTypes/FETCH_SPARE_PARTS_GET_TYPES');
  sparePartsTypes.value = store.getters['sparePartsGetTypes/getsparePartsGetTypes'].map(item => ({
    value: item,
    label: item.spare_parts_types
  }));
}

// ---------- REGION SPARE COUNT ----------
async function fnregionSpareCount() {
  await store.dispatch('regionalInventoryDetails/FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS');
  regionSpareCount.value = store.getters['regionalInventoryDetails/getPhonepeSparePartsSetsAndCounts'].map(item => ({
    value: item,
    label: item.spare_parts_types
  }));
}

// ---------- AJAX LOAD ----------
async function ajaxLoadAllLeadInfo({ pagination, filter }) {
  $q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' });

  try {
    await store.dispatch('regionalInventoryDetails/FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS', { pagination, filter });
    const data = store.getters['regionalInventoryDetails/getphonepeRegionalInventoryAllocatedSoPodDetails'];

    paginationControl.rowsNumber = data.totalElements;
    paginationControl.page = data.number + 1;
    paginationControl.sortBy = data.sort?.[0]?.property ?? 'updated_date';
    paginationControl.descending = data.sort?.[0]?.ascending ?? false;
    tableData.value = data.content;
  } catch (err) {
    console.error(err);
  } finally {
    $q.loading.hide();
  }
}

// ---------- APPROVE POD ----------
async function fnApprovePodDetails(reqdata) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to Approve?',
    ok: 'Continue',
    cancel: 'Cancel'
  }).onOk(async () => {
    try {
      const response = await store.dispatch('singlePodData/FETCH_PHONEPE_SINGLE_POD_DETAILS', reqdata);
      const podData = response.data.data;

      const param = { ...podData, status: reqdata.status, owner: reqdata.owner };
      await store.dispatch('regionalInventoryDetails/APPROVE_PHONEPE_INCOMING_POD_DETAILS', param);

      $q.notify({ color: 'positive', position: 'bottom', message: 'Successfully Approved!', icon: 'thumb_up' });
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch.value });
      fnregionSpareCount();
    } catch (err) {
      $q.notify({ color: 'negative', position: 'bottom', message: err?.body?.message ?? 'Please Try Again Later !', icon: 'thumb_down' });
    }
  });
}

// ---------- SUBMIT BANK DETAILS ----------
async function fnSubmitBankDetails(request) {
  formData.allocate_so = JSON.parse(formData.allocate_so || null);
  formData.allocate_region = JSON.parse(localStorage.getItem('u_i'))?.region;
  formData.allocate_reseller = JSON.parse(formData.allocate_reseller || null);

  v$.value.$touch();
  if (v$.value.$error) {
    $q.notify({ color: 'negative', position: 'bottom', message: 'Please fill all mandatory fields', icon: 'info' });
    return;
  }

  try {
    $q.loading.show();
    await store.dispatch('sparePartsInventory/UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS', request);
    $q.notify({ color: 'positive', position: 'bottom', message: 'Successfully updated!', icon: 'thumb_up' });
    Object.assign(formData, { allocate_so: '', allocate_reseller: null, sparePartsSets: [], total_count: 0 });
  } catch (err) {
    $q.notify({ color: 'negative', position: 'bottom', message: err?.body?.message ?? 'Please Try Again Later !', icon: 'thumb_down' });
  } finally {
    $q.loading.hide();
  }
}

// ---------- ON MOUNT ----------
onMounted(() => {
  generatePodNumber();
  fnSparePartsTypes();
  fnregionSpareCount();
  regionBasedSoLoad();
  ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch.value });
});
</script>

<style scoped>
/* Add any scoped styles here */
</style>
