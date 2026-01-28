<template>
  <q-page>
    <q-pull-to-refresh :handler="PullToRefresh" inline>
      <!-- Table Title -->
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Merchant Transaction Level
      </div>

      <!-- Lead Information Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation.value"
        :leadInformation="addtnLeadInformation.value"
        :propToggleLeadInformationPop="propToggleLeadInformation.value"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- QTable -->
      <q-table
        :rows="tableData.value"
        :columns="columns"
        :filter="filter.value"
        row-key="tid"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter.value"
        table-class="customTableClass"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Table Top Slot (Search) -->
        <template v-slot:top>
          <div class="col-5">
            <q-search
              v-model="filter.value"
              clearable
              color="grey-9"
              placeholder="Type.."
              float-label="Search Using Device Serial Number/TID"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>

        <!-- Table Body Slots -->
        <template v-slot:body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </template>

        <template v-slot:body-cell-mid="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label text-primary cursor-pointer"
            @click="() => toggleLeadInformation(props.row.leadInformation)"
          >
            # {{ props.row.leadInformation?.leadNumber || 'NA' }}
          </span>
        </template>

        <template v-slot:body-cell-mobileNumber="props">
          {{ props.row.leadInformation?.contactNumber || 'NA' }}
        </template>

        <template v-slot:body-cell-leadAddress="props">
          {{ props.row.leadInformation?.leadAddress || 'NA' }}
        </template>

        <template v-slot:body-cell-deviceStatusDate="props">
          <span class="label">{{ formatDate(props.row.deviceStatusDate) }}</span>
        </template>

        <template v-slot:body-cell-action="props">
          <q-btn
            highlight
            push
            class="q-mx-sm"
            color="positive"
            size="sm"
            @click="() => openReject(props.row)"
          >
            Reject
          </q-btn>
          <q-btn
            highlight
            push
            class="q-mx-sm"
            color="negative"
            size="sm"
            @click="() => openAccept(props.row)"
          >
            Approve
          </q-btn>
        </template>
      </q-table>

      <!-- Reject Modal -->
      <openRejectModel
        v-if="showRejectModel.value"
        :showRejectModel="showRejectModel.value"
        :propShowRejectComponent="propsRejectAppend.value"
        @reloadPaymentTrackerData="ajaxLoadAllLeadInfo"
        @closeRejectModel="openReject"
      />

      <!-- Merchant Transaction Details -->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction.value"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction.value"
        @revertRowClick="rowClick"
      />

      <!-- Spinner Overlay -->
      <div v-if="toggleAjaxLoadFilter.value" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" :size="35" style="color:#61116a" />
      </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import openRejectModel from '../../components/finance/openRejectModel.vue';
import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue';
import generalLeadInformation from '../../components/generalLeadInformation.vue';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with custom parse format plugin
dayjs.extend(customParseFormat);

// --- Quasar ---
const $q = useQuasar();

// --- Vuex Store ---
const store = useStore();

// --- Reactive State ---
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const tableData = ref([]);
const toggleAjaxLoadFilter = ref(false);
const showRejectModel = ref(false);
const propsRejectAppend = ref(null);
const valueToggleMerchantTransaction = ref(false);
const filter = ref('');

// Pagination
const paginationControl = reactive({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'tid',
  descending: false
});

// Columns
const columns = [
  { name: 'tid', label: 'TID', align: 'left', field: 'tid', sortable: true },
  { name: 'mid', label: 'MID', align: 'left', field: 'mid', sortable: true },
  { name: 'leadNumber', label: 'Lead Id', align: 'left', field: row => row.leadInformation?.leadNumber || 'NA', sortable: false },
  { name: 'leadInformation', label: 'ME Name', align: 'left', field: row => row.leadInformation?.leadName || 'NA', sortable: false },
  { name: 'leadAddress', label: 'Merchant Address', align: 'center', field: row => row.leadInformation?.leadAddress || 'NA', sortable: false },
  { name: 'deviceName', label: 'Device type', align: 'right', field: row => row.leadInformation?.device?.deviceName || 'NA', sortable: false },
  { name: 'device_serial_number', label: 'Device Serial Number', align: 'left', field: row => row.regionalInventory?.serialNumber || 'NA', sortable: true },
  { name: 'deviceStatusDate', label: 'Implementation Date', align: 'left', field: 'deviceStatusDate', sortable: true },
  { name: 'assignedTo', label: 'Implemented by', align: 'left', field: row => row.assignedTo?.name || 'NA', sortable: true },
  { name: 'deviceAddress', label: 'Implemented Address', align: 'left', field: 'deviceAddress', sortable: true },
  { name: 'mobileNumber', label: 'Mobile Number', align: 'center', field: row => row.leadInformation?.contactNumber || 'NA', sortable: false },
  { name: 'lostOrStolenRemarks', label: 'Remarks', align: 'right', field: row => row.regionalInventory?.lostOrStolenRemarks || 'NA', sortable: false },
  { name: 'action', label: '', align: 'center', field: 'action', sortable: false }
];

// Computed Vuex Getter
const getlostDatas = computed(() => store.getters['LostFinance/getlostDatas']);

// Date formatting function
const formatDate = (date) => {
  if (!date) return 'NA';
  return dayjs(date).format('Do MMM Y');
};

// --- Methods ---
const ajaxLoadAllLeadInfo = async ({ pagination = paginationControl, filter: filterValue = filter.value } = {}) => {
  toggleAjaxLoadFilter.value = true;
  $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ..' });

  try {
    await store.dispatch('LostFinance/FETCH_LOST_FINANCE_DATAS', { pagination, filter: filterValue });
    tableData.value = getlostDatas.value.content;
    paginationControl.rowsNumber = getlostDatas.value.totalElements;
    paginationControl.page = getlostDatas.value.number + 1;

    if (getlostDatas.value.sort) {
      paginationControl.sortBy = getlostDatas.value.sort[0].property;
      paginationControl.descending = !getlostDatas.value.sort[0].ascending;
    }
  } catch {
    // Error handling without unused variable
  } finally {
    toggleAjaxLoadFilter.value = false;
    $q.loading.hide();
  }
};

const openAccept = (reqData) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to Move Lost/Stolen?',
    ok: 'Continue',
    cancel: 'Cancel'
  }).onOk(async () => {
    $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Processing ..' });
    const obj = { id: reqData.regionalInventory.id, serialNumber: reqData.regionalInventory.serialNumber, lostOrStolenRemarks: '' };
    try {
      await store.dispatch('LostFinance/APPROVE_LOST_STOLEN_EXCEPTION', obj);
      $q.notify({ color: 'positive', position: 'bottom', message: 'Successfully Approved!', icon: 'thumb_up' });
      await ajaxLoadAllLeadInfo();
    } catch {
      $q.notify({ color: 'negative', position: 'bottom', message: 'Please try again later!', icon: 'thumb_down' });
    } finally {
      $q.loading.hide();
    }
  });
};

const openReject = (exceptionDetails) => {
  showRejectModel.value = !showRejectModel.value;
  propsRejectAppend.value = exceptionDetails;
};

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
};

// Pull-to-refresh handler
const PullToRefresh = (done) => {
  ajaxLoadAllLeadInfo().finally(done);
};

// --- Mounted ---
onMounted(() => {
  ajaxLoadAllLeadInfo();
});
</script>

<style scoped>
.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
}
</style>