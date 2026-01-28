<template>
  <q-page>

    <!-- Common lead information popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table Lead Validation -->
    <q-table
      table-class="customTableClass"
      :data="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="name"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >

      <!-- Table top row (column headers) -->
      <template v-slot:top-row="props">
        <q-tr :props="props">
          <q-th v-for="col in props.columns" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <!-- Table body cells -->
      <template v-slot:body-cell-tid="props">
        <q-td :props="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-mid="props">
        <q-td :props="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-leadNumber="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click="toggleLeadInformation(props.row.leadInformation)"
        >
          <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-mobileNumber="props">
        <q-td :props="props">
          {{ props.row.leadInformation?.contactNumber || 'NA' }}
        </q-td>
      </template>

      <template v-slot:body-cell-leadAddress="props">
        <q-td :props="props">
          {{ props.row.leadInformation?.leadAddress || 'NA' }}
        </q-td>
      </template>

      <template v-slot:body-cell-deviceStatusDate="props">
        <q-td :props="props">
          <span class="label">{{ formatDate(props.row.deviceStatusDate) }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            highlight
            push
            color="positive"
            class="q-mx-sm"
            size="sm"
            @click="openReject(props.row)"
          >
            Reject
          </q-btn>
          <q-btn
            highlight
            push
            color="negative"
            class="q-mx-sm"
            size="sm"
            @click="openAccept(props.row)"
          >
            Approve
          </q-btn>
        </q-td>
      </template>

      <!-- Table top slot: search bar -->
      <template v-slot:top>
        <div class="col-5 bottom-border">
          <q-search
            clearable
            v-model="filter"
            separator
            color="grey-9"
            placeholder="Type.."
            float-label="Search Using Device Serial Number/TID"
            class="q-mr-lg q-py-sm"
          />
        </div>
      </template>

    </q-table>

    <!-- Reject Modal -->
    <PhonepeRejectModel
      v-if="showRejectModel"
      :showRejectModel="showRejectModel"
      :propShowRejectComponent="propsRejectAppend"
      @reloadPaymentTrackerData="ajaxLoadAllLeadInfo"
      @closeRejectModel="openReject"
    />

    <!-- Merchant Transaction Details -->
    <showMerchantTransactionLevelDetails
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!-- Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="#61116a" :size="35" />
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import PhonepeRejectModel from '../../components/finance/PhonepeRejectModel.vue';
import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue';
import generalLeadInformation from '../../components/generalLeadInformation.vue';
import { date } from 'quasar';

// Reactive state
const store = useStore();

const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);

const toggleAjaxLoadFilter = ref(false);
const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: 'tid',
  descending: false,
  rowsPerPage: 10
});

const tableData = ref([]);
const showRejectModel = ref(false);
const valueToggleMerchantTransaction = ref(false);
const filter = ref('');
const propsRejectAppend = ref(null);

// Columns definition
const columns = [
  { name: 'tid', label: 'TID', align: 'left', field: 'tid', sortable: true },
  { name: 'mid', label: 'MID', align: 'left', field: 'mid', sortable: true },
  { name: 'leadNumber', label: 'Lead Id', align: 'left', field: row => row.leadInformation?.leadNumber, sortable: false },
  { name: 'leadInformation', label: 'ME Name', align: 'left', field: row => row.leadInformation?.leadName, sortable: false },
  { name: 'leadAddress', label: 'Merchant Address', align: 'center', field: row => row.leadInformation?.leadAddress, sortable: false },
  { name: 'deviceName', label: 'Device type', align: 'right', field: row => row.leadInformation?.device?.deviceName, sortable: false },
  { name: 'device_serial_number', label: 'Device Serial Number', align: 'left', field: row => row.regionalInventory?.serialNumber || 'NA', sortable: true },
  { name: 'deviceStatusDate', label: 'Implementation Date', align: 'left', field: 'deviceStatusDate', sortable: true },
  { name: 'assignedTo', label: 'Implemented by', align: 'left', field: row => row.assignedTo?.name || 'NA', sortable: true },
  { name: 'deviceAddress', label: 'Implemented Address', align: 'left', field: 'deviceAddress', sortable: true },
  { name: 'mobileNumber', label: 'Mobile Number', align: 'center', field: row => row.leadInformation?.contactNumber, sortable: false },
  { name: 'lostOrStolenRemarks', label: 'Remarks', align: 'right', field: row => row.regionalInventory?.lostOrStolenRemarks, sortable: false },
  { name: 'action', label: '', align: 'center', field: 'action', sortable: true }
];

// Computed Getters
const getPhonepeLostDatas = computed(() => store.getters['LostFinance/getPhonepeLostDatas']);

// Format date helper
function formatDate(dateVal) {
  return dateVal ? date.formatDate(dateVal, 'DD MMM YYYY') : 'NA';
}

// Load data
async function ajaxLoadAllLeadInfo({ pagination, filter: filterVal } = {}) {
  toggleAjaxLoadFilter.value = true;
  store._vm.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ..' });

  try {
    await store.dispatch('LostFinance/FETCH_PHONEPE_LOST_FINANCE_DATAS', { pagination: pagination || paginationControl.value, filter: filterVal || filter.value });

    paginationControl.value = pagination || paginationControl.value;
    paginationControl.value.rowsNumber = getPhonepeLostDatas.value.totalElements;
    paginationControl.value.page = getPhonepeLostDatas.value.number + 1;

    tableData.value = getPhonepeLostDatas.value.content;

    if (getPhonepeLostDatas.value.sort) {
      paginationControl.value.sortBy = getPhonepeLostDatas.value.sort[0].property;
      paginationControl.value.descending = getPhonepeLostDatas.value.sort[0].ascending;
    }
  } finally {
    toggleAjaxLoadFilter.value = false;
    store._vm.$q.loading.hide();
  }
}

// Approve
function openAccept(reqData) {
  store._vm.$q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to Move Lost/Stolen?',
    ok: 'Continue',
    cancel: 'Cancel'
  }).onOk(async () => {
    store._vm.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Processing ..' });

    const obj = {
      id: reqData.regionalInventory.id,
      serialNumber: reqData.regionalInventory.serialNumber,
      lostOrStolenRemarks: ''
    };

    try {
      await store.dispatch('LostFinance/APPROVE_PHONEPE_LOST_STOLEN_EXCEPTION', obj);
      store._vm.$q.notify({ color: 'positive', position: 'bottom', message: 'Successfully Approved!', icon: 'thumb_up' });
    } catch {
      store._vm.$q.notify({ color: 'negative', position: 'bottom', message: 'Please try again later!', icon: 'thumb_down' });
    } finally {
      store._vm.$q.loading.hide();
    }
  });
}

// Reject
function openReject(exceptionDetails) {
  showRejectModel.value = !showRejectModel.value;
  propsRejectAppend.value = exceptionDetails;
  console.log('Exception Details:', exceptionDetails);
}

// Toggle lead information popup
function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
}

// Load data on mount
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
});
</script>

<style scoped>
.fullscreen.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
