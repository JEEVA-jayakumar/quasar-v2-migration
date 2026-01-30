<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" dense @update:model-value="goToDownloadTab">
        <q-tab name="tab-1" label="Generate QR" />
        <q-tab name="tab-2" label="Download/View QR" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <q-card style="width:100%">
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <label class="qrlabel q-mr-md"><b>Select Bank</b></label>
                  <div class="col-3">
                    <q-select
                      class="select"
                      label="Select Bank"
                      v-model="formData.id"
                      :error="v$.formData.id.$error"
                      color="grey-9"
                      :options="bankListOptions"
                      emit-value
                      map-options
                      outlined
                      dense
                    />
                  </div>
                </div>
                
                <div class="row items-center q-mb-md">
                  <label class="invlabel q-mr-md"><b>Enter No Of QR</b></label>
                  <div class="col-3">
                    <q-input
                      type="number"
                      class="qr-input"
                      :disable="!formData.id"
                      @update:model-value="trackChange"
                      @keydown="nameKeydown"
                      label="Enter Numbers of QR Count"
                      v-model.number="formData.count"
                      :error="v$.formData.count.$error"
                      @blur="v$.formData.count.$touch"
                      color="grey-9"
                      outlined
                      dense
                    />
                  </div>
                </div>
                
                <div class="row group justify-center">
                  <div class="col-auto">
                    <q-btn
                      class="common-dark-blue"
                      :disabled="!formData.count"
                      label="Generate"
                      @click="fnsubmit()"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="tab-2">
            <div class="row q-mb-md">
              <div class="col-md-10">
                <q-input
                  clearable
                  class="btnsize"
                  color="grey-9"
                  placeholder="Type.."
                  v-model="filter"
                  label="Search by Batch"
                  filled
                  dense
                />
              </div>
            </div>
            
            <q-table
              table-class="customTableClass"
              :rows="tableData"
              :columns="columns"
              v-model:pagination="paginationControl"
              :filter="filter"
              row-key="id"
              :loading="toggleAjaxLoadFilter"
              :rows-per-page-options="[5, 10, 15, 20]"
              @request="ajaxLoadAllBatchList"
            >
              <template #body-cell-createdAt="props">
                <q-td :props="props">
                  {{ props.row.createdAt == null ? 'NA' : formatDate(props.row.createdAt) }}
                </q-td>
              </template>
              
              <template #body-cell-Batch="props">
                <q-td :props="props">
                  {{ props.row.batchId == null ? 'NA' : props.row.batchId }}
                </q-td>
              </template>
              
              <template #body-cell-Bank="props">
                <q-td :props="props">
                  {{ props.row.staticQrBank?.name == null ? 'NA' : props.row.staticQrBank.name }}
                </q-td>
              </template>
              
              <template #body-cell-Count="props">
                <q-td :props="props">
                  {{ props.row.count == null ? 'NA' : props.row.count }}
                </q-td>
              </template>
              
              <template #body-cell-remainingCount="props">
                <q-td :props="props">
                  {{ props.row.remainingQrCount == 0 ? '' : props.row.remainingQrCount }}
                </q-td>
              </template>
              
              <template #body-cell-Action="props">
                <q-td :props="props">
                  <div class="row no-wrap q-gutter-xs">
                    <q-btn
                      dense
                      no-caps
                      label="Download"
                      icon="file_download"
                      size="sm"
                      @click="downloadQrString(props.row)"
                      color="green"
                      outline
                    />
                    <q-btn
                      dense
                      no-caps
                      label="View"
                      icon="visibility"
                      size="sm"
                      @click="ListVpaData(props.row)"
                      color="negative"
                      outline
                    />
                  </div>
                </q-td>
              </template>
              
              <template #body-cell-Action2="props">
                <q-td :props="props">
                  <div class="row no-wrap q-gutter-xs">
                    <q-btn
                      :disable="props.row.batchCount == true"
                      dense
                      no-caps
                      label="Sticker Received"
                      icon="thumb_up_alt"
                      size="sm"
                      @click="stickerRecieved(props.row)"
                      color="blue"
                      outline
                    />
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>

      <qrPopUp
        v-if="propToggleData"
        :QrInfo="addBasicInformation"
        :propToggleDataPop="propToggleData"
        @closeRemarksInfo="toggle"
      />

      <ViewVpaData
        v-if="VpaDataModal"
        :VpaDataModal="VpaDataModal"
        :propRowDetails="propRowDetails"
        @toggleModal="ListVpaData"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import { useStore } from 'vuex';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import dayjs from 'dayjs';
import qrPopUp from '../components/qrPopUp.vue';
import ViewVpaData from '../components/ViewVpaData.vue';

const $q = useQuasar();
const store = useStore();

// Refs
const filter = ref('');
const propToggleData = ref(false);
const VpaDataModal = ref(false);
const propRowDetails = ref(null);
const addBasicInformation = ref(null);
const bankListOptions = ref([]);
const tableData = ref([]);
const toggleAjaxLoadFilter = ref(false);
const activeTab = ref('tab-1');

// Form Data
const formData = reactive({
  id: '',
  count: '',
  name: ''
});

// Pagination
const paginationControl = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdAt',
  descending: false,
  rowsPerPage: 5
});

// Validation
const rules = {
  formData: {
    count: { required },
    id: { required }
  }
};

const v$ = useVuelidate(rules, { formData });

// Table Columns
const columns = [
  {
    name: 'createdAt',
    required: true,
    label: 'Created At',
    align: 'left',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'Batch',
    required: true,
    label: 'Batch',
    align: 'left',
    field: 'batchId',
    sortable: false
  },
  {
    name: 'Bank',
    required: true,
    label: 'Bank',
    align: 'left',
    field: row => row.staticQrBank?.name || 'NA',
    sortable: false
  },
  {
    name: 'Count',
    required: true,
    label: 'QR Generated',
    align: 'left',
    field: 'count',
    sortable: false
  },
  {
    name: 'remainingCount',
    required: true,
    label: 'Remaining QR Count',
    align: 'left',
    field: 'remainingQrCount',
    sortable: false
  },
  {
    name: 'Action',
    required: true,
    label: 'Action',
    align: 'left',
    sortable: false
  },
  {
    name: 'Action2',
    required: true,
    label: 'Action',
    align: 'left',
    sortable: false
  }
];

// Computed
const getAllBankList = computed(() => 
  store.getters['generateQR/getAllBankList'] || []
);

const getAllBatchList = computed(() => 
  store.getters['generateQR/getAllBatchList'] || {}
);

// Methods
const formatDate = (date) => {
  return dayjs(date).format('Do MMM Y');
};

const trackChange = () => {
  if (formData.count === 0) {
    formData.count = '';
  }
};

const nameKeydown = (event) => {
  if (/^\W$/.test(event.key)) {
    event.preventDefault();
  }
};

const fnAjaxGetAllBankData = async () => {
  try {
    await store.dispatch('generateQR/FETCH_BANK_LIST');
    const banks = getAllBankList.value?.data?.data || getAllBankList.value || [];
    bankListOptions.value = banks.map(value => ({
      label: value.name,
      value: value.id
    }));
  } catch (error) {

    console.error('Error fetching bank data:', error);
    bankListOptions.value = [];
  }
};

const goToDownloadTab = (tab) => {
  if (tab === 'tab-2') {
    ajaxLoadAllBatchList({
      pagination: paginationControl.value,
      filter: filter.value
    });
  } else {
    ajaxLoadAllBatchList({
      pagination: paginationControl.value
    });
  }
};

const ajaxLoadAllBatchList = async ({ pagination, filter } = {}) => {
  const params = {
    pagination: pagination || paginationControl.value,
    filter: filter || filter.value
  };

  $q.loading.show({
    delay: 0,
    spinner: QSpinnerGears,
    spinnerColor: 'purple-9',
    message: 'Fetching data...'
  });

  try {
    await store.dispatch('generateQR/FETCH_BATCH_DETAILS', params);
    
    const batchListData = getAllBatchList.value;
    if (batchListData) {
      paginationControl.value = {
        ...paginationControl.value,
        rowsNumber: batchListData.totalElements || 0,
        page: (batchListData.number || 0) + 1
      };
      
      tableData.value = batchListData.content || [];
      
      if (batchListData.sort && batchListData.sort.length > 0) {
        paginationControl.value.sortBy = batchListData.sort[0].property;
        paginationControl.value.descending = !batchListData.sort[0].ascending;
      }
    }
    
    toggleAjaxLoadFilter.value = false;
  } catch (error) {

    console.error('Error fetching batch list:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load batch data'
    });
    toggleAjaxLoadFilter.value = false;
  } finally {
    $q.loading.hide();
  }
};

const fnsubmit = async () => {
  const validation = await v$.value.formData.$validate();
  
  if (!validation) {
    $q.notify('Please review fields again.');
    return;
  }

  const qrData = {
    staticQrBank: {
      id: formData.id
    },
    count: formData.count
  };

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to generate QR?',
    ok: {
      label: 'Continue',
      color: 'primary'
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
      flat: true
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinner: QSpinnerGears,
      spinnerColor: 'purple-9',
      message: 'Processing...'
    });

    try {
      const response = await store.dispatch('generateQR/GENERATE_QR', qrData);
      
      addBasicInformation.value = response;
      propToggleData.value = true;
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Successfully Generated!',
        icon: 'thumb_up'
      });
      
      // Reset form
      formData.id = '';
      formData.count = '';
      formData.name = '';
      
      // Refresh batch list
      await ajaxLoadAllBatchList();
    } catch (error) {

      console.error('Error generating QR:', error);
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error?.message || 'No changes made!',
        icon: 'thumb_down'
      });
    } finally {
      $q.loading.hide();
    }
  });
};

const stickerRecieved = async (rowData) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure?',
    ok: {
      label: 'Yes',
      color: 'primary'
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
      flat: true
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinner: QSpinnerGears,
      spinnerColor: 'purple-9',
      message: 'Processing...'
    });

    try {
      await store.dispatch('generateQR/APPROVE_RECIEVED_STICKER', rowData);
      
      await ajaxLoadAllBatchList();
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Approved Successfully!',
        icon: 'thumb_up'
      });
    } catch (error) {

      console.error('Error approving sticker:', error);
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error?.message || 'No changes made!',
        icon: 'thumb_down'
      });
    } finally {
      $q.loading.hide();
    }
  });
};

const toggle = () => {
  propToggleData.value = !propToggleData.value;
};

const ListVpaData = (rowDetails) => {
  VpaDataModal.value = !VpaDataModal.value;
  propRowDetails.value = rowDetails;
};

const downloadQrString = async (data) => {
  if (!data?.batchId) {
    $q.notify({
      color: 'negative',
      message: 'Invalid batch data'
    });
    return;
  }

  $q.loading.show({
    delay: 100,
    spinner: QSpinnerGears,
    spinnerColor: 'purple-9',
    message: 'Please wait...'
  });

  try {
    await store.dispatch('staticQrDownloads/DOWNLOAD_STATIC_QR_DATA', data.batchId);
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    });
  } catch (error) {

    console.error('Error downloading QR data:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Download failed',
      icon: 'error'
    });
  } finally {
    $q.loading.hide();
  }
};

// Lifecycle Hooks
onMounted(() => {
  fnAjaxGetAllBankData();
  ajaxLoadAllBatchList();
});

// Watchers
watch(filter, (newValue) => {
  ajaxLoadAllBatchList({
    pagination: paginationControl.value,
    filter: newValue
  });
});

watch(() => activeTab.value, (newTab) => {
  if (newTab === 'tab-2') {
    ajaxLoadAllBatchList();
  }
});
</script>

<style scoped>
.qrlabel,
.invlabel {
  font-weight: bold;
  min-width: 150px;
}

.select {
  min-width: 250px;
}

.qr-input {
  min-width: 200px;
}

.btnsize {
  width: 100%;
  max-width: 300px;
}

.col3 {
  text-align: center;
  margin-top: 20px;
}

.common-dark-blue {
  background-color: #1976d2;
  color: white;
}

.customTableClass {
  width: 100%;
}

.row.no-wrap {
  flex-wrap: nowrap;
}

.q-gutter-xs {
  gap: 4px;
}

@media (max-width: 768px) {
  .qrlabel,
  .invlabel {
    min-width: 120px;
    margin-bottom: 8px;
  }
  
  .select,
  .qr-input {
    width: 100%;
  }
  
  .btnsize {
    max-width: 100%;
  }
  
  .row.no-wrap {
    flex-wrap: wrap;
  }
}
</style>