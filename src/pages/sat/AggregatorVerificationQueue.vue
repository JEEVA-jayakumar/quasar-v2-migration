<template>
  <q-page class="q-pa-md">
    <div>
      <!--START: table title -->
      <div class="col-md-12 text-h5 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Implementation Verification Queue
      </div>
      <!--END: table title -->
      
      <!-- Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      
      <!-- content -->
      <!--START: table lead validation -->
      <q-table
        class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        :pagination="paginationControl"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="tid">
              <span class="text-primary"># {{ props.row.tid }}</span>
            </q-td>
            
            <q-td key="mid">
              <span class="text-primary"># {{ props.row.mid }}</span>
            </q-td>
            
            <q-td key="leadNumber" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
              <span class="text-primary"># {{ props.row.leadInformation?.leadNumber || 'NA' }}</span>
            </q-td>
            
            <q-td key="leadName">
              {{ props.row.leadInformation?.leadName || 'NA' }}
            </q-td>
            
            <q-td key="leadAddress">
              {{ props.row.leadInformation?.leadAddress || 'NA' }}
            </q-td>
            
            <q-td key="deviceName">
              {{ props.row.leadInformation?.aggregatorDevice?.deviceName || 'NA' }}
            </q-td>
            
            <q-td key="serialNumber">
              {{ props.row.aggregatorRegionalInventory?.serialNumber || 'NA' }}
            </q-td>
            
            <q-td key="deviceStatusDate">
              <span>{{ formatDate(props.row.deviceStatusDate) }}</span>
            </q-td>
            
            <q-td key="assignedTo">
              {{ props.row.assignedTo ? `${props.row.assignedTo.name} | ${props.row.assignedTo.employeeID}` : 'NA' }}
            </q-td>
            
            <q-td key="deviceAddress">
              {{ props.row.deviceAddress || 'NA' }}
            </q-td>
            
            <q-td key="pincode">
              {{ props.row.leadInformation?.pincode || 'NA' }}
            </q-td>
            
            <q-td key="city">
              {{ props.row.leadInformation?.city || 'NA' }}
            </q-td>
            
            <q-td key="contactNumber">
              {{ props.row.assignedTo?.contactNumber || 'NA' }}
            </q-td>
            
            <q-td key="status">
              <span v-if="props.row.deviceStatus == 6" class="text-positive">Approved</span>
              <span v-else-if="props.row.deviceStatus == 7" class="text-negative">Pending</span>
              <span v-else class="text-amber">NA</span>
            </q-td>
            
            <q-td key="viewDocument">
              <div v-if="!props.row.implementationForm" class="text-grey">NA Document</div>
              <div v-else-if="props.row.implementationFormMimeType?.includes('application/pdf')" class="cursor-pointer">
                <div @click="fnPDFViewModal(props.row.implementationForm)">
                  <q-icon name="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ props.row.implementationForm }}
                </div>
              </div>
              <div v-else-if="props.row.implementationFormMimeType?.includes('image')" class="cursor-pointer">
                <div @click="fnViewImage(props.row.implementationForm)">
                  <img 
                    :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm"
                    style="max-width: 50px; max-height: 50px; cursor: pointer;"
                    @click="fnOpenImageViewer(GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm)"
                  />
                  &nbsp;{{ props.row.implementationForm }}
                </div>
              </div>
              <div v-else class="text-grey">NA Document</div>
            </q-td>
            
            <q-td key="pictureOfShop">
              <div v-if="!props.row.pictureOfShop" class="text-grey">NA Document</div>
              <div v-else-if="props.row.pictureOfShopMimeType?.includes('application/pdf')" class="cursor-pointer">
                <div @click="fnPDFViewModal(props.row.pictureOfShop)">
                  <q-icon name="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ props.row.pictureOfShop }}
                </div>
              </div>
              <div v-else-if="props.row.pictureOfShopMimeType?.includes('image')" class="cursor-pointer">
                <div @click="fnViewImage(props.row.pictureOfShop)">
                  <img 
                    :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop"
                    style="max-width: 50px; max-height: 50px; cursor: pointer;"
                    @click="fnOpenImageViewer(GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop)"
                  />
                  &nbsp;{{ props.row.pictureOfShop }}
                </div>
              </div>
              <div v-else class="text-grey">NA Document</div>
            </q-td>
            
            <q-td key="cpvForm">
              <div v-if="!props.row.cpvForm" class="text-grey">NA Document</div>
              <div v-else-if="props.row.cpvFormMimeType?.includes('application/pdf')" class="cursor-pointer">
                <div @click="fnPDFViewModal(props.row.cpvForm)">
                  <q-icon name="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ props.row.cpvForm }}
                </div>
              </div>
              <div v-else-if="props.row.cpvFormMimeType?.includes('image')" class="cursor-pointer">
                <div @click="fnViewImage(props.row.cpvForm)">
                  <img 
                    :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm"
                    style="max-width: 50px; max-height: 50px; cursor: pointer;"
                    @click="fnOpenImageViewer(GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm)"
                  />
                  &nbsp;{{ props.row.cpvForm }}
                </div>
              </div>
              <div v-else class="text-grey">NA Document</div>
            </q-td>
            
            <q-td key="action">
              <div v-if="props.row.deviceStatus == 6">
                <q-btn
                  disable
                  dense
                  no-caps
                  no-wrap
                  label="Already Approved"
                  icon="block"
                  size="md"
                />
              </div>
              <div v-else>
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Approve"
                  icon="done"
                  size="md"
                  color="green-5"
                  @click="fnShowConvertToSat(props.row)"
                />
              </div>
            </q-td>
            
            <q-td key="data">
              <div v-if="props.row.deviceStatus == 6">
                <q-btn
                  disable
                  dense
                  no-caps
                  no-wrap
                  label="Reject"
                  icon="block"
                  size="md"
                />
              </div>
              <div v-else>
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Reject"
                  icon="close"
                  size="md"
                  color="red-5"
                  @click="fnShowConvertReject(props.row)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
        
        <template #top>
          <!--START: table filter,search,excel download -->
          <div class="col-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Search by MID, TID, Merchant Name"
              class="q-mr-lg q-py-sm"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          
          <div class="col-2">
            <q-input
              v-model="formData.fromDate"
              type="date"
              class="q-mr-lg q-py-sm"
              label="From Date"
              :min="yesterday"
              :max="tomorrow"
              standout="bg-grey-3 text-grey-9"
            />
          </div>
          
          <div class="col-2">
            <q-input
              v-model="formData.toDate"
              type="date"
              class="q-mr-lg q-py-sm"
              label="To Date"
              :min="yesterday"
              :max="tomorrow"
              standout="bg-grey-3 text-grey-9"
            />
          </div>
          
          <div class="col-2">
            <q-btn
              align="right"
              color="purple-9"
              :disabled="!formData.fromDate || !formData.toDate"
              style="margin-right: 10px"
              @click="SubmitData"
            >
              Submit
            </q-btn>
            
            <q-btn
              color="red"
              v-if="selectedRow"
              @click="DeleteData"
              icon="delete"
            />
          </div>
        </template>
      </q-table>
      <!--END: table lead validation -->
      
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />
    </div>
    
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
    
    <viewDocumentApprove
      v-if="propShowConvertToSat"
      :propShowConvertToSat="propShowConvertToSat"
      :propRowDetails="propRowDetails"
      @emitfnshowConvertToSat="fnShowConvertToSat"
    />
    
    <viewDocumentReject
      v-if="propShowViewReject"
      :propShowViewReject="propShowViewReject"
      :propRowDetails="propRowDetails"
      @emitfnshowConvertToSat="fnShowConvertReject"
    />
    <!-- END >> COMPONENT: View PDF -->
    
    <!-- Image Viewer Dialog -->
    <q-dialog v-model="showImageDialog" full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Image Preview</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section class="q-pt-none" style="text-align: center;">
          <img :src="selectedImage" style="max-width: 100%; max-height: 70vh;" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue';
import showPdfModalComponent from '../../components/sat/showPdfModalComponent.vue';
import generalLeadInformation from '../../components/generalLeadInformation.vue';
import viewDocumentApprove from '../../components/sat/viewDocumentApprove.vue';
import viewDocumentReject from '../../components/sat/viewRejectDocument.vue';

const $q = useQuasar();
const store = useStore();

const { addToDate, subtractFromDate } = date;
const today = new Date();
const tomorrow = addToDate(today, { days: 0 });
const yesterday = subtractFromDate(today, { days: 720 });

// Reactive variables
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const toggleshowPDFModal = ref(false);
const PDFDetails = ref('');
const propShowConvertToSat = ref(false);
const propShowViewReject = ref(false);
const propRowDetails = ref(null); // Added missing ref
const toggleAjaxLoadFilter = ref(false);
const tableData = ref([]);
const valueToggleMerchantTransaction = ref(false);
const filter = ref('');
const showImageDialog = ref(false);
const selectedImage = ref('');

const formData = ref({
  fromDate: '',
  toDate: '',
});

const formData1 = ref({
  fromDate: '',
  toDate: '',
});

const selectedRow = ref(null);

const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: 'deviceStatusDate',
  descending: false,
  rowsPerPage: 10,
});

// Columns definition
const columns = [
  { name: 'tid', align: 'left', label: 'TID', field: 'tid', sortable: true },
  { name: 'mid', align: 'left', label: 'MID', field: 'mid', sortable: true },
  { name: 'leadNumber', align: 'left', label: 'Lead ID', field: 'leadNumber', sortable: true },
  { name: 'leadName', align: 'left', label: 'Merchant Name', field: 'leadName', sortable: false },
  { name: 'leadAddress', align: 'left', label: 'Merchant Address', field: 'leadAddress', sortable: false },
  { name: 'deviceName', align: 'left', label: 'Device type', field: 'deviceName', sortable: false },
  { name: 'serialNumber', align: 'left', label: 'Device Serial Number', field: 'serialNumber', sortable: true },
  { name: 'deviceStatusDate', align: 'left', label: 'Implementation Date', field: 'deviceStatusDate', sortable: true },
  { name: 'assignedTo', align: 'left', label: 'Implemented by', field: 'assignedTo', sortable: true },
  { name: 'deviceAddress', align: 'left', label: 'Implemented Address', field: 'deviceAddress', sortable: true },
  { name: 'pincode', align: 'left', label: 'Merchants Pincode', field: 'pincode', sortable: false },
  { name: 'city', align: 'left', label: 'Merchants City Town', field: 'city', sortable: false },
  { name: 'contactNumber', align: 'center', label: 'FSE Mobile Number', field: 'contactNumber', sortable: false },
  { name: 'status', align: 'center', label: 'Device Status', field: 'deviceStatus', sortable: false },
  { name: 'viewDocument', align: 'center', label: 'Implementation Form', field: 'viewDocument', sortable: false },
  { name: 'pictureOfShop', align: 'center', label: 'PictureOfShop', field: 'pictureOfShop', sortable: false },
  { name: 'cpvForm', align: 'center', label: 'cpvForm', field: 'cpvForm', sortable: false },
  { name: 'action', align: 'center', label: 'Approve', field: 'action', sortable: false },
  { name: 'data', align: 'center', label: 'Reject', field: 'data', sortable: false },
];

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);

const getAggregatorVerificationQueue = computed(() => 
  store.getters['aggregatorVerificationQueue/getAggregatorVerificationQueue']);

// Helper functions
const formatDate = (date) => {
  if (!date) return 'NA';
  return moment(date).format('Do MMM Y');
};

const toTimestamp = (strDate, isFromDate = true) => {
  if (!strDate) return null;
  const datePart = strDate.split('T')[0] || strDate;
  const timeStr = isFromDate ? '00:00:00' : '23:59:00';
  const formattedDate = `${datePart}T${timeStr}Z`;
  return Date.parse(formattedDate);
};

// Main function to load data
const ajaxLoadAllLeadInfo = (params = {}) => {
  const { pagination = paginationControl.value, filter: filterValue = filter.value } = params;
  
  toggleAjaxLoadFilter.value = true;
  
  const requestParams = {
    pagination: {
      page: pagination.page - 1,
      rowsPerPage: pagination.rowsPerPage,
      sortBy: pagination.sortBy,
      descending: pagination.descending,
    },
    filter: filterValue,
    formData: formData1.value,
  };

  store.dispatch('aggregatorVerificationQueue/AGGREGATOR_VERIFICATION_QUEUE_LIST', requestParams)
    .then(() => {
      tableData.value = getAggregatorVerificationQueue.value.content || [];
      paginationControl.value.rowsNumber = getAggregatorVerificationQueue.value.totalElements || 0;
      paginationControl.value.page = getAggregatorVerificationQueue.value.number + 1 || 1;
    })
    .catch((error) => {
      console.error('Error loading data:', error);
      $q.notify({
        color: 'negative',
        message: 'Failed to load data',
      });
    })
    .finally(() => {
      toggleAjaxLoadFilter.value = false;
    });
};

const SubmitData = () => {
  if (!formData.value.fromDate || !formData.value.toDate) {
    $q.notify({
      color: 'negative',
      message: 'Please select both From Date and To Date',
    });
    return;
  }

  const fromTimestamp = toTimestamp(formData.value.fromDate, true);
  const toTimestampValue = toTimestamp(formData.value.toDate, false);

  if (fromTimestamp > toTimestampValue) {
    $q.notify({
      color: 'negative',
      message: 'To Date must be greater than From Date',
    });
    return;
  }

  formData1.value = {
    fromDate: fromTimestamp,
    toDate: toTimestampValue,
  };

  selectedRow.value = { ...formData.value };
  
  // Reset to first page when filtering
  paginationControl.value.page = 1;
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value });
};

const DeleteData = () => {
  formData.value = { fromDate: '', toDate: '' };
  formData1.value = { fromDate: '', toDate: '' };
  selectedRow.value = null;
  
  // Reset to first page when clearing filters
  paginationControl.value.page = 1;
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value });
};

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

const fnOpenImageViewer = (imageUrl) => {
  selectedImage.value = imageUrl;
  showImageDialog.value = true;
};

const fnViewImage = (imageName) => {
  if (imageName) {
    fnOpenImageViewer(GLOBAL_FILE_FETCH_URL.value + '/' + imageName);
  }
};

const fnShowConvertToSat = (rowDetails) => {
  propShowConvertToSat.value = !propShowConvertToSat.value;
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails;
  }
};

const fnShowConvertReject = (rowDetails) => {
  propShowViewReject.value = !propShowViewReject.value;
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails;
  }
};

const rowClick = () => {
  valueToggleMerchantTransaction.value = false;
};


// Lifecycle
onMounted(() => {
  ajaxLoadAllLeadInfo();
});
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customTableClass {
  width: 100%;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
}
</style>