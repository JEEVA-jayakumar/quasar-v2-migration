<template>
  <q-page>
    <q-card>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              class="shadow-1"
              animated
              swipeable
              color="tertiary"
              align="justify"
            >
              <q-tab class="size1" label="UPLOAD CSV FILE" />
              <div>
                <div class="q-pa-md">
                  <div class="row text-center justify-center">
                    <div class="col-md-8 q-py-md" align="center">
                      <div
                        v-if="formData.fileSelected.length == 0"
                        :class="[
                          uploaderHovered
                            ? 'toggleBulkUploadDisable'
                            : 'toggleBulkUploadActive'
                        ]"
                        class="drop display-inline align-center cursor-pointer"
                        @dragover.prevent="dragAndDropCustomAnimate(true)"
                        @dragleave.prevent="dragAndDropCustomAnimate(false)"
                        @drop="onDrop"
                      >
                        <label style="width: auto;" class="btn display-inline cursor-pointer">
                          Drag & Drop Or Click Here To Open A File
                          <input
                            type="file"
                            name="image"
                            @change="onChange"
                            ref="deviceBulkUpload"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          />
                        </label>
                      </div>
                      <div v-else align="left">
                        <q-card dense class="q-pa-xs">
                          <q-card-section>
                            <div class="text-h6">Uploaded File</div>
                          </q-card-section>
                          <q-separator />
                          <q-card-section>
                            <q-item dense>
                              <q-item-section avatar>
                                <q-icon name="attach_file" />
                              </q-item-section>
                              <q-item-section>{{
                                formData.fileSelected[0].name
                              }}</q-item-section>
                            </q-item>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions align="end">
                            <q-btn
                              size="10px"
                              type="button"
                              color="negative"
                              @click="removeBulkUploadFile"
                              label="Remove"
                              icon="clear"
                            />
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                    <div class="col-md-12 group" align="center">
                      <q-btn
                        :disable="formData.fileSelected.length == 0"
                        type="button"
                        color="purple-9"
                        label="Submit"
                        @click="uploadFileForBulkUpload"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-tabs>
          </div>
        </div>
      </div>
    </q-card>
    <q-card>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              class="shadow-1"
              animated
              swipeable
              color="tertiary"
              align="justify"
              v-model="selectedTab"
            >
              <q-tab
                class="size1"
                label="Hitachi Onboarding Merchants"
                default
                name="unAssigned"
              />
              <q-tab-panel name="unAssigned">
                <!--START: table Data -->
                <q-table
                  :rows="tableData1"
                  :columns="columnData"
                  table-class="customTableClass"
                  :filter="filterSearch1"
                  v-model:selected="formData.marsDeviceIdsCooked"
                  v-model:pagination="paginationControl1"
                  row-key="id"
                  :loading="tableAjaxLoading1"
                  :rows-per-page-options="[5, 10, 15, 20]"
                  color="dark"
                  @request="ajaxLoadAllLeadInfo1"
                >
                  <template #body-cell-tid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.tid }}</div>
                    </q-td>
                  </template>
                  
                  <template #body-cell-mid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.mid }}</div>
                    </q-td>
                  </template>
                  
                  <template #body-cell-createdAt="props">
                    <q-td :props="props">
                      {{ formatDate(props.row.createdAt) }}
                    </q-td>
                  </template>
                  
                  <template #body-cell-assign="props">
                    <q-td :props="props">
                      <q-btn
                        class="btn1"
                        v-if="props.row.isStatus == 1"
                        disable
                        color="positive"
                        size="sm"
                      >
                        Success
                      </q-btn>
                      <q-btn
                        v-if="props.row.isStatus == 2"
                        color="negative"
                        size="sm"
                        @click="OGSPendingStatus(props.row)"
                      >
                        Re-Submit
                      </q-btn>
                      <q-btn
                        v-if="props.row.isStatus == 3"
                        color="negative"
                        size="sm"
                        @click="OGSPendingStatus(props.row)"
                      >
                        Re-Submit
                      </q-btn>
                      <q-btn
                        class="btn1"
                        v-if="props.row.isStatus == 4"
                        disable
                        color="purple-9"
                        size="sm"
                      >
                        Installed
                      </q-btn>
                      <q-btn
                        v-if="props.row.isStatus == null"
                        color="purple-9"
                        size="sm"
                        @click="OGSPendingStatus(props.row)"
                      >
                        Re-Submit
                      </q-btn>
                    </q-td>
                  </template>
                  
                  <template #top>
                    <div class="col-md-4">
                      <q-input
                        clearable
                        color="grey-9"
                        v-model="filterSearch1"
                        placeholder="Type.."
                        label="Search by MerchantName, TID, MID..."
                        class="q-mr-lg q-py-sm"
                      />
                    </div>

                    <div class="col-md-6">
                      <q-btn
                        color="purple-9"
                        label="Download as Excel"
                        class="q-mr-lg q-py-sm float-right"
                        size="md"
                        @click="downloadHitachiIndianBank()"
                      />
                    </div>
                  </template>
                </q-table>
                <!--END: table Data -->
              </q-tab-panel>
            </q-tabs>
          </div>
        </div>
      </div>
    </q-card>
    
    <download-indian-bank-reports
      v-if="propHitachiReport"
      :propHitachiReport="propHitachiReport"
      @emitfnHitachiIndianBank="downloadHitachiIndianBank"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { format } from 'date-fns';

import downloadIndianBankReports from "../../components/sat/downloadIndianBankReports.vue";

export default defineComponent({
  name: "implementationQueue",
  
  components: {
    downloadIndianBankReports
  },
  
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const propToggleLeadInformation = ref(false);
    const propHitachiReport = ref(false);
    const addtnLeadInformation = ref(null);
    const filterSearch = ref('');
    const filterSearch1 = ref('');
    const selectedTab = ref('assigned');
    const assignTo = ref('');
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    const uploaderHovered = ref(false);
    const currentDeviceInfo = ref({});
    const showDeviceAddressModal = ref(false);
    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);

    const formData = ref({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      assignTo: "",
      fileSelected: []
    });

    const paginationControl = ref({
      sortBy: "createdAt",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0
    });

    const paginationControl1 = ref({
      sortBy: "createdAt",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0
    });

    // Columns definition
    const columnData = [
      {
        name: "createdAt",
        required: true,
        label: "Upload Date / Time",
        align: "left",
        field: row => row.createdAt,
        format: val => formatDate(val),
        sortable: true
      },
      {
        name: "merchant_name",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: row => row.leadName == null ? "NA" : row.leadName,
        sortable: false
      },
      {
        name: "tid",
        required: true,
        label: "TID",
        align: "left",
        field: row => row.tid,
        sortable: false
      },
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "left",
        field: row => row.mid,
        sortable: false
      },
      {
        name: "device_model",
        required: true,
        label: "Device Model",
        align: "center",
        field: row => row.device != null ? row.device : "NA",
        sortable: false
      },
      {
        name: "device_address",
        required: true,
        label: "Contact Name",
        align: "left",
        field: row => row.contactName == null ? "NA" : row.contactName,
        sortable: false
      },
      {
        name: "contact_number",
        required: true,
        label: "Contact Number",
        align: "center",
        field: row => row.contactNumber != null ? row.contactNumber : "NA",
        sortable: false
      },
      {
        name: "status",
        required: true,
        label: "Status",
        align: "left",
        field: row => {
          if (row.isStatus == 1) {
            return "Success";
          } else if (row.isStatus == 2) {
            return "Pending";
          } else if (row.isStatus == 3) {
            return "OGS Failure";
          } else if (row.isStatus == 4) {
            return "Installed";
          } else {
            return "Failure";
          }
        },
        sortable: false
      },
      {
        name: "assign",
        required: true,
        label: "Action",
        align: "left",
        field: "action",
        sortable: false
      }
    ];

    // Computed properties
    const getHitachiIndianOnboarding = computed(() => store.getters['HitachiIndianBankOnboarding/getHitachiIndianOnboarding']);

    // Methods
    const formatDate = (dateString) => {
      if (!dateString) return 'NA';
      try {
        const date = new Date(dateString);
        return format(date, 'do MMM y');
      } catch {
        return dateString;
      }
    };

    const removeBulkUploadFile = () => {
      formData.value.fileSelected = [];
    };

    const dragAndDropCustomAnimate = (action) => {
      uploaderHovered.value = action;
    };

    const onDrop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      formData.value.fileSelected = e.dataTransfer.files;
      fileCheckSum(e.dataTransfer.files);
    };

    const fileCheckSum = (file) => {
      const re = /(\.csv|\.xlsx|\.xls)$/i;
      if (!re.exec(file[0].name)) {
        formData.value.fileSelected = [];
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "File format not supported",
          icon: "clear"
        });
        return false;
      }
    };

    const onChange = (e) => {
      formData.value.fileSelected = e.target.files;
    };

    const uploadFileForBulkUpload = async () => {
      if (formData.value.fileSelected.length == 0) {
        $q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Please upload file",
          icon: "warning"
        });
        return false;
      }

      $q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Please wait.."
      });

      try {
        const assumeFormData = new FormData();
        assumeFormData.append("file", formData.value.fileSelected[0]);
        
        await store.dispatch("IndianBankUpload/FEED_HITACHI_INDIAN_BANK_ONBOARDING_UPLOAD_DATA", {
          file: assumeFormData
        });
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Uploaded!",
          icon: "thumb_up"
        });
        
        await ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        
        formData.value.fileSelected = [];
      } catch (error) {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.body?.message || "Please Try Again Later !",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const getPincodeInformations = () => {
      store.dispatch("SuperAdminUsers/FETCH_ALL_STATES_DATA");
    };

    const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
      tableAjaxLoading1.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("HitachiIndianBankOnboarding/HITACHI_INDIAN_ONBOARDING_LIST", { 
          pagination, 
          filter 
        });

        const onboardingData = getHitachiIndianOnboarding.value;
        
        paginationControl1.value = {
          ...pagination,
          rowsNumber: onboardingData.totalElements || 0,
          page: onboardingData.number ? onboardingData.number + 1 : 1,
          sortBy: onboardingData.sort?.[0]?.property || "createdAt",
          descending: !onboardingData.sort?.[0]?.ascending
        };

        tableData1.value = onboardingData.content || [];
      } catch (error) {

        console.error('Error loading onboarding data:', error);
      } finally {
        tableAjaxLoading1.value = false;
        $q.loading.hide();
      }
    };

    const goToUnassignedTab = (tab) => {
      if (tab == "unAssigned") {
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
      } else {
        // Implement other tab loading if needed
        console.log('Other tab selected');
      }
    };

    const UpdateDeviceAddress = (currentDeviceInfo) => {
      const deviceInfo = { ...currentDeviceInfo };
      if (formData.value.marsDeviceIdsCooked.length == 0) {
        currentDeviceInfo.value = {
          id: [deviceInfo.id],
          marsDeviceAddress: {
            deviceAddress: deviceInfo.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: deviceInfo.pincode,
            city: deviceInfo.city,
            state: deviceInfo.state
          }
        };
      } else {
        const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
        currentDeviceInfo.value = {
          id: marsDeviceIdsCooked,
          marsDeviceAddress: {
            deviceAddress: deviceInfo.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: deviceInfo.pincode,
            city: deviceInfo.city,
            state: deviceInfo.state
          }
        };
      }
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
    };

    const UpdateDeviceAddressAfterEmit = (pagination) => {
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
      paginationControl.value = pagination;
    };

    const OGSPendingStatus = async (request) => {
      const param = {
        tid: request.tid
      };
      
      $q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9"
      });

      try {
        await store.dispatch("HitachiIndianBankOnboarding/REASSIGN_HITACHI_MERCHANTS", param);
        
        await ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Re-Assigned Successfully",
          icon: "thumb_up"
        });
      } catch (error) {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.body?.message || "Please Try Again Later !",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const downloadHitachiIndianBank = () => {
      propHitachiReport.value = !propHitachiReport.value;
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      // Initialize data loading
      ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value
      });
    });

    return {
      // Refs
      propToggleLeadInformation,
      propHitachiReport,
      addtnLeadInformation,
      filterSearch,
      filterSearch1,
      selectedTab,
      assignTo,
      assignToOptions,
      tableData,
      tableData1,
      uploaderHovered,
      columnData,
      currentDeviceInfo,
      showDeviceAddressModal,
      formData,
      paginationControl,
      paginationControl1,
      tableAjaxLoading,
      tableAjaxLoading1,
      
      // Computed
      getHitachiIndianOnboarding,
      
      // Methods
      formatDate,
      removeBulkUploadFile,
      dragAndDropCustomAnimate,
      onDrop,
      fileCheckSum,
      onChange,
      uploadFileForBulkUpload,
      getPincodeInformations,
      ajaxLoadAllLeadInfo1,
      goToUnassignedTab,
      UpdateDeviceAddress,
      UpdateDeviceAddressAfterEmit,
      OGSPendingStatus,
      downloadHitachiIndianBank,
      toggleLeadInformation
    };
  }
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

* {
  font-family: "Arial";
  font-size: 12px;
}

*,
*:after,
*:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
}

input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.side1 {
  margin-left: 24px;
  font-size: 30px;
}

.btn1 {
  width: 87px;
}

.align-center {
  text-align: center;
}

.helper {
  height: 100%;
  display: inline-block;
  vertical-align: middle;
  width: 0;
}

.hidden {
  display: none !important;
}

.hidden.image {
  display: inline-block !important;
}

.display-inline {
  display: inline-block;
  vertical-align: middle;
}

.size3{
  margin-left: 30px;
}

.img {
  border: 1px solid #f6f6f6;
  display: inline-block;
  height: auto;
  max-height: 80%;
  max-width: 80%;
  width: auto;
}

.drop {
  padding: 15px;
  background-color: #f6f6f6;
  border-radius: 2px;
  height: 100%;
  max-height: 400px;
  max-width: 600px;
  width: 100%;
}

.toggleBulkUploadActive {
  border: 4px dashed #ccc;
}

.toggleBulkUploadDisable {
  border: 4px dashed #1f2c3fa6;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>