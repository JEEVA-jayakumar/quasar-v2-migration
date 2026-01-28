<template>
  <q-page>
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        DOC Viewer
      </div>
      <div class="row q-gutter-x-md q-gutter-y-md q-pt-md justify-around items-end">
        <div class="col-md-6">
          <q-input
            clearable
            @clear="fnClearing"
            color="grey-9"
            @blur="v$.formData.searchTerm.$touch"
            :error="v$.formData.searchTerm.$error"
            :error-message="v$.formData.searchTerm.$errors[0]?.$message"
            v-model="formData.searchTerm"
            placeholder="Type.."
            label="Search By Ticket ID / TID..."
            class="q-py-sm"
            outlined
            dense
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-md-3">
          <div class="group">
            <q-radio 
              v-for="(item, index) in flagOptions" 
              :key="index" 
              color="primary" 
              v-model.trim="formData.flag" 
              :val="item.value" 
              :label="item.label"
            />
          </div>
        </div>
        <div class="col-md-2">
          <q-btn 
            class="full-width" 
            :disable="formData.searchTerm === '' || formData.flag === ''" 
            size="md" 
            color="primary" 
            @click="globalSubmit"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>
  
    <div v-if="tableData.length !== 0">
      <q-table
        class="customTableClass q-mt-md"
        :rows="tableData"
        :columns="columns"
        v-model:pagination="paginationControl"
        row-key="name"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template #body-cell-tid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{ props.row.tid }}</span>
          </q-td>
        </template>
        
        <template #body-cell-merchantName="props">
          <q-td :props="props">
            <span>{{ props.row.leadInformation?.contactName ?? 'NA' }}</span>
          </q-td>
        </template>
        
        <template #body-cell-regionAreaName="props">
          <q-td :props="props">
            <span>{{ props.row.aggregatorRegionalInventory?.region?.regionAreaName ?? 'NA' }}</span>
          </q-td>
        </template>
        
        <template #body-cell-viewDocument="props">
          <q-td :props="props">
            <div v-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.implementationForm)">
                <q-icon name="picture_as_pdf" color="primary" />
              </div>
            </div>
            <div v-else-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopup(props.row.implementationForm)">
                <q-icon name="photo_camera" />
              </q-btn>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        
        <template #body-cell-pictureOfShop="props">
          <q-td :props="props">
            <div v-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.pictureOfShop)">
                <q-icon name="picture_as_pdf" color="primary" />
              </div>
            </div>
            <div v-else-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopup(props.row.pictureOfShop)">
                <q-icon name="photo_camera" />
              </q-btn>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        
        <template #body-cell-cpvForm="props">
          <q-td :props="props">
            <div v-if="!props.row.cpvFormMimeType || props.row.cpvFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.cpvForm)">
                <q-icon name="picture_as_pdf" color="primary" />
              </div>
            </div>
            <div v-else-if="!props.row.cpvFormMimeType || props.row.cpvFormMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopup(props.row.cpvForm)">
                <q-icon name="photo_camera" />
              </q-btn>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
      </q-table>
    </div>
    
    <div v-else-if="tableData1.length !== 0">
      <q-table
        class="customTableClass q-mt-md"
        :rows="tableData1"
        :columns="columns1"
        v-model:pagination="paginationControlchange"
        row-key="name"
        :rows-per-page-options="[5,10,15,20]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo1"
      >
        <template #body-cell-tid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{ props.row.serviceRequestData?.tid }}</span>
          </q-td>
        </template>
        
        <template #body-cell-merchantName="props">
          <q-td :props="props">
            <span>{{ props.row.serviceRequestData?.meName ?? 'NA' }}</span>
          </q-td>
        </template>
        
        <template #body-cell-regionAreaName="props">
          <q-td :props="props">
            <span>{{ props.row.serviceRequestData?.bpRegion?.regionAreaName ?? 'NA' }}</span>
          </q-td>
        </template>
        
        <template #body-cell-ticket="props">
          <q-td :props="props">
            <span>{{ props.row.serviceRequestData?.serviceReqTicketId ?? 'NA' }}</span>
          </q-td>
        </template>
        
        <template #body-cell-pictureOfShop="props">
          <q-td :props="props">
            <div v-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.pictureOfShop)">
                <q-icon name="picture_as_pdf" color="primary" />
              </div>
            </div>
            <div v-else-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopup(props.row.pictureOfShop)">
                <q-icon name="photo_camera" />
              </q-btn>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        
        <template #body-cell-viewDocument="props">
          <q-td :props="props">
            <div v-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.implementationForm)">
                <q-icon name="picture_as_pdf" color="primary" />
              </div>
            </div>
            <div v-else-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopup(props.row.implementationForm)">
                <q-icon name="photo_camera" />
              </q-btn>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
      </q-table>
    </div>
    
    <div v-else class="row q-gutter-x-md q-gutter-y-md justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg" style="min-height: calc(80vh - 52px)">
      <div class="row" align="center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="text-subtitle1 text-bold text-grey-9" style="align-self: center">
          No Data Available
        </div>
      </div>
    </div>
    
    <q-inner-loading :showing="toggleAjaxLoadFilter">
      <q-spinner-bars size="35px" color="primary" />
    </q-inner-loading>
    
    <show-pdf 
      v-if="toggleshowPDFModal"
      :prop-toggleshow-pdf-modal="toggleshowPDFModal"
      :prop-pdf-details="PDFDetails"
      @toggle-pdf-modal="fnPDFViewModal"
    />
    
    <popup 
      v-if="propShowPopup"
      :prop-show-popup="propShowPopup"
      :prop-row-details="propRowDetails"
      @emitfnshowservice="fnShowPopup"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Popup from 'src/components/crm/popUp.vue';

// Quasar instance
const $q = useQuasar();
const store = useStore();


// Reactive state
const propShowPopup = ref(false);
const toggleshowPDFModal = ref(false);
const toggleAjaxLoadFilter = ref(false);
const tableData = ref([]);
const tableData1 = ref([]);
const propRowDetails = ref(null);
const PDFDetails = ref('');

// Form data
const formData = reactive({
  flag: '',
  searchTerm: '',
});

const flagOptions = [
  { label: 'Tid', value: 1 },
  { label: 'Ticket ID', value: 2 },
];

// Pagination controls
const paginationControl = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5,
});

const paginationControlchange = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5,
});

// Table columns
const columns = [
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: row => row.tid,
    sortable: false,
  },
  {
    name: 'merchantName',
    required: true,
    label: 'Merchant Name',
    align: 'left',
    field: row => row.leadInformation?.contactName || 'NA',
    sortable: false,
  },
  {
    name: 'regionAreaName',
    required: true,
    label: 'Region',
    align: 'left',
    field: row => row.aggregatorRegionalInventory?.region?.regionAreaName || 'NA',
    sortable: false,
  },
  {
    name: 'viewDocument',
    required: true,
    label: 'Imp Form',
    align: 'left',
    field: row => row.implementationForm || 'NA',
    sortable: false,
  },
  {
    name: 'pictureOfShop',
    required: true,
    label: 'Pic of Shop',
    align: 'left',
    field: row => row.pictureOfShop || 'NA',
    sortable: false,
  },
  {
    name: 'cpvForm',
    required: true,
    label: 'CPV form',
    align: 'left',
    field: row => row.cpvForm || 'NA',
    sortable: false,
  },
];

const columns1 = [
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: row => row.serviceRequestData?.tid || 'NA',
    sortable: false,
  },
  {
    name: 'merchantName',
    required: true,
    label: 'Merchant Name',
    align: 'left',
    field: row => row.serviceRequestData?.meName || 'NA',
    sortable: false,
  },
  {
    name: 'regionAreaName',
    required: true,
    label: 'Region',
    align: 'left',
    field: row => row.serviceRequestData?.bpRegion?.regionAreaName || 'NA',
    sortable: false,
  },
  {
    name: 'ticket',
    required: true,
    label: 'Ticket ID',
    align: 'left',
    field: row => row.serviceRequestData?.serviceReqTicketId || 'NA',
    sortable: false,
  },
  {
    name: 'pictureOfShop',
    required: true,
    label: 'Pic of Shop',
    align: 'left',
    field: row => row.pictureOfShop || 'NA',
    sortable: false,
  },
  {
    name: 'viewDocument',
    required: true,
    label: 'Imp Form',
    align: 'left',
    field: row => row.implementationForm || 'NA',
    sortable: false,
  },
];

// Validation rules
const rules = {
  formData: {
    searchTerm: { required },
    flag: { required },
  },
};

const v$ = useVuelidate(rules, { formData });

// Computed properties
const getdocview = computed(() => {
  return store.getters['globalSearchSerialNumber/getdocview'] || [];
});

const getdocticket = computed(() => {
  return store.getters['globalSearchSerialNumber/getdocticket'] || [];
});


// Methods
const globalSubmit = async () => {
  const isFormValid = await v$.value.$validate();
  
  if (!isFormValid) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Please review fields again.',
      icon: 'warning'
    });
    return;
  }
  
  if (formData.flag == 1) {
    $q.loading.show({
      delay: 0,
      message: 'Fetching data..',
      spinnerColor: 'primary',
    });
    
    try {
      await store.dispatch('globalSearchSerialNumber/FETCH_DOC_VIEW', formData);
      tableData.value = getdocview.value;
      tableData1.value = [];
      $q.loading.hide();
    } catch (error) {

      $q.loading.hide();
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      });
    }
  } else {
    $q.loading.show({
      delay: 0,
      message: 'Fetching data..',
      spinnerColor: 'primary',
    });
    
    try {
      await store.dispatch('globalSearchSerialNumber/FETCH_DOC_VIEW_TICKET', formData);
      tableData1.value = getdocticket.value;
      tableData.value = [];
      $q.loading.hide();
    } catch (error) {

      $q.loading.hide();
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      });
    }
  }
};

const ajaxLoadAllLeadInfo = async (props) => {
  toggleAjaxLoadFilter.value = true;
  
  try {
    const { pagination } = props;
    await store.dispatch('globalSearchSerialNumber/FETCH_DOC_VIEW', { pagination });
    
    const data = getdocview.value;
    if (data?.content) {
      paginationControl.value = {
        ...pagination,
        rowsNumber: data.totalElements || 0,
        page: (data.number || 0) + 1,
      };
      
      if (data.sort?.[0]) {
        paginationControl.value.sortBy = data.sort[0].property;
        paginationControl.value.descending = !data.sort[0].ascending;
      }
      
      tableData.value = data.content || [];
    }
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    });
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

const ajaxLoadAllLeadInfo1 = async (props) => {
  toggleAjaxLoadFilter.value = true;
  
  try {
    const { pagination } = props;
    await store.dispatch('globalSearchSerialNumber/FETCH_DOC_VIEW_TICKET', { pagination });
    
    const data = getdocticket.value;
    if (data?.content) {
      paginationControlchange.value = {
        ...pagination,
        rowsNumber: data.totalElements || 0,
        page: (data.number || 0) + 1,
      };
      
      if (data.sort?.[0]) {
        paginationControlchange.value.sortBy = data.sort[0].property;
        paginationControlchange.value.descending = !data.sort[0].ascending;
      }
      
      tableData1.value = data.content || [];
    }
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    });
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

const fnPDFViewModal = (documentUrl) => {
  if (documentUrl) {
    PDFDetails.value = documentUrl;
  }
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

const fnShowPopup = (rowDetails) => {
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails;
  }
  propShowPopup.value = !propShowPopup.value;
};

const fnClearing = () => {
  tableData.value = [];
  tableData1.value = [];
  formData.flag = '';
  formData.searchTerm = '';
  v$.value.$reset();
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customTableClass {
  font-size: 14px;
}

.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}

.group .q-radio {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>