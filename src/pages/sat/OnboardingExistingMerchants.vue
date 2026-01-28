<template>
  <q-page>
    <!-- content -->
    <q-card>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              class="shadow-1"
              animated
              swipeable
              align="justify"
              active-color="tertiary"
              indicator-color="tertiary"
            >
              <q-tab class="size1" label="UPLOAD CSV FILE" />
              <div>
                <div class="q-pa-md">
                  <div class="row text-center justify-center">
                    <div class="col-md-8 q-py-md" align="center">
                      <div class="col-md-5 align1" align="center">
                        <a
                          href="statics/files/iciciExistingMerchantOnboardingTemplate.xlsx"
                          class="hide-underline text-primary"
                        >
                          Click here to download the template
                        </a>
                      </div>
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
                        <label
                          style="width: auto;"
                          class="btn display-inline cursor-pointer"
                        >
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
                              <q-item-section>
                                {{ formData.fileSelected[0].name }}
                              </q-item-section>
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
                    <div class="col-md-12 group align2" align="center">
                      <q-btn
                        :disable="formData.fileSelected.length == 0"
                        type="button"
                        class="common-dark-blue"
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
              align="justify"
              active-color="tertiary"
              indicator-color="tertiary"
            >
              <q-tab class="size1" label="Onboarding Existing Merchants" />
              
              <q-tab-panel>
                <div v-if="selectedTab == 'unAssigned'">
                  <q-card class="group q-pa-md">
                    <div class="row items-center gutter-y-sm">
                      <div
                        class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium"
                        align="left"
                      >
                        <span class="text-h3 size2">
                          {{ formData.marsDeviceIdsCooked.length }}
                        </span>
                        / selected
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-6">
                        <q-select
                          clearable
                          v-model="formData.assignTo"
                          :disable="formData.marsDeviceIdsCooked.length == 0"
                          color="grey-9"
                          :options="assignToOptions"
                          placeholder="Assign To"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-6" align="right">
                        <q-btn
                          :disable="!formData.assignTo"
                          type="button"
                          label="Assign"
                          class="common-dark-blue"
                          @click="assignImplementationUser"
                        />
                      </div>
                    </div>
                  </q-card>
                </div>
                
                <div v-if="selectedTab == 'assigned'">
                  <q-card class="group q-pa-md">
                    <div class="row items-center gutter-y-sm">
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="row items-center">
                          <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>

                <q-tabs
                  v-model="selectedTab"
                  class="shadow-1"
                  active-color="dark"
                  indicator-color="dark"
                >
                  <q-tab name="unAssigned" label="Unassigned" />
                  <q-tab name="assigned" label="Assigned" />
                  
                  <q-tab-panel name="assigned">
                    <div class="row items-center gutter-y-sm q-mb-md">
                      <div
                        class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md"
                        align="left"
                      >
                        <span class="text-h3 size2">
                          {{ formData.marsDeviceIdsCookedUnAssinged.length }}
                        </span>
                        / selected
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="row items-center">
                          <div class="col-md-4 col-sm-6 col-xs-6">
                            <q-select
                              clearable
                              v-model="formData.assignTo"
                              :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                              color="grey-9"
                              :options="assignToOptions"
                              placeholder="Assign To"
                              emit-value
                              map-options
                            />
                          </div>
                          <div class="col-md-4 col-sm-6 col-xs-6 group">
                            <div class="q-mb-sm">
                              <q-btn
                                no-caps
                                :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0 || !formData.assignTo"
                                label="Re-Assign"
                                class="common-dark-blue"
                                @click="reAssignImplementationUser"
                              />
                            </div>
                            <div>
                              <q-btn
                                no-caps
                                :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                                label="Un-Assign"
                                class="common-dark-blue"
                                @click="unAssignImplementationUser"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!--START: table Data -->
                    <q-table
                      :rows="tableData"
                      :columns="columnDataAssigned"
                      table-class="customTableClass"
                      :filter="filterSearch"
                      v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
                      v-model:pagination="paginationControl"
                      row-key="id"
                      :loading="tableAjaxLoading"
                      :rows-per-page-options="[5, 10, 15, 20]"
                      color="dark"
                      @request="ajaxLoadAllLeadInfo"
                    >
                      <template #body-cell-tid="props">
                        <q-td :props="props" class="customTd">
                          <div class="text-primary">
                            {{ props.row.tid == null ? "NA" : props.row.tid }}
                          </div>
                        </q-td>
                      </template>
                      
                      <template #body-cell-mid="props">
                        <q-td :props="props" class="customTd">
                          <div class="text-primary">
                            {{ props.row.mid == null ? "NA" : props.row.mid }}
                          </div>
                        </q-td>
                      </template>
                      
                      <template #top>
                        <div class="col-md-5">
                          <q-input
                            clearable
                            color="grey-9"
                            v-model="filterSearch"
                            placeholder="Type.."
                            label="Search By Merchant Name, TID, MID ..."
                            class="q-mr-lg q-py-sm"
                          />
                        </div>
                      </template>
                    </q-table>
                    <!--END: table Data -->
                  </q-tab-panel>
                  
                  <q-tab-panel name="unAssigned">
                    <!--START: table Data -->
                    <q-table
                      :rows="tableData1"
                      :columns="columnDataUnassigned"
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
                          <div class="text-primary">
                            {{ props.row.tid == "" ? "NA" : props.row.tid }}
                          </div>
                        </q-td>
                      </template>
                      
                      <template #body-cell-mid="props">
                        <q-td :props="props" class="customTd">
                          <div class="text-primary">
                            {{ props.row.mid == "" ? "NA" : props.row.mid }}
                          </div>
                        </q-td>
                      </template>
                      
                      <template #top>
                        <div class="col-md-5">
                          <q-input
                            clearable
                            color="grey-9"
                            v-model="filterSearch1"
                            placeholder="Type.."
                            label="Search By Merchant Name, TID, MID ..."
                            class="q-mr-lg q-py-sm"
                          />
                        </div>
                      </template>
                    </q-table>
                    <!--END: table Data -->
                  </q-tab-panel>
                </q-tabs>
              </q-tab-panel>
            </q-tabs>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

export default defineComponent({
  name: "implementationQueue",
  
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const selectedTab = ref("assigned");
    const assignTo = ref("");
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    const uploaderHovered = ref(false);
    const currentDeviceInfo = ref({});
    const showDeviceAddressModal = ref(false);
    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);

    // Form data
    const formData = ref({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      assignTo: "",
      fileSelected: []
    });

    // Pagination controls
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

    // Columns definitions
    const columnDataAssigned = [
      {
        name: "leadNumber",
        required: true,
        label: "Lead Number",
        align: "left",
        field: row => row.leadInformation?.leadNumber || "NA",
        sortable: false
      },
      {
        name: "merchant_name",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: row => row.leadInformation?.leadName || "NA",
        sortable: false
      },
      {
        name: "tid",
        required: true,
        label: "TID",
        align: "left",
        field: row => row.tid || "NA",
        sortable: true
      },
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "left",
        field: row => row.mid || "NA",
        sortable: true
      },
      {
        name: "mobile_number",
        required: true,
        label: "Mobile Number",
        align: "center",
        field: row => row.leadInformation?.contactNumber || "NA",
        sortable: false
      },
      {
        name: "assigned_to",
        required: true,
        label: "Assigned To",
        align: "left",
        field: row => {
          const assigned = row.qrAssignedTo;
          return assigned 
            ? `${assigned.name} | ${assigned.employeeID}` 
            : "NA";
        },
        sortable: false
      }
    ];

    const columnDataUnassigned = [
      {
        name: "leadNumber",
        required: true,
        label: "Lead Number",
        align: "left",
        field: row => row.leadInformation?.leadNumber || "NA",
        sortable: false
      },
      {
        name: "merchant_name",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: row => row.leadInformation?.leadName || "NA",
        sortable: false
      },
      {
        name: "tid",
        required: true,
        label: "TID",
        align: "left",
        field: row => row.tid || "NA",
        sortable: true
      },
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "left",
        field: row => row.mid || "NA",
        sortable: true
      },
      {
        name: "mobile_number",
        required: true,
        label: "Mobile Number",
        align: "center",
        field: row => row.leadInformation?.contactNumber || "NA",
        sortable: false
      },
      {
        name: "leadAddress",
        required: true,
        label: "Address",
        align: "left",
        field: row => row.leadInformation?.leadAddress || "NA",
        sortable: false
      }
    ];

    // Computed properties
    const getOnboardingMerchantAssignedList = computed(() => 
      store.getters['OnboardingExistingMerchants/getOnboardingMerchantAssignedList']
    );

    const getOnboardingMerchantUnassignedList = computed(() => 
      store.getters['OnboardingExistingMerchants/getOnboardingMerchantUnassignedList']
    );

    const getImplementationExecutiveList = computed(() => 
      store.getters['ImplementationExecutive/getImplementationExecutiveList']
    );

    // Methods
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
        
        await store.dispatch("UploadOnboardingMerchants/FEED_ONBOARDING_EXISTING_MERCHANT_DEVICE_BULK_UPLOAD_DATA", {
          file: assumeFormData
        });

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Added!",
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

    const ajaxLoadAllLeadInfo1 = async ({ pagination, filter: searchFilter }) => {
      tableAjaxLoading1.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("OnboardingExistingMerchants/ONBOARDING_MERCHANT_UNASSIGNED_LIST", { 
          pagination, 
          filter: searchFilter 
        });

        const unassignedData = getOnboardingMerchantUnassignedList.value;
        
        paginationControl1.value = {
          ...pagination,
          rowsNumber: unassignedData.totalElements || 0,
          page: unassignedData.number ? unassignedData.number + 1 : 1,
          sortBy: unassignedData.sort?.[0]?.property || "createdAt",
          descending: !unassignedData.sort?.[0]?.ascending
        };

        tableData1.value = unassignedData.content || [];

        // Load implementation executives
        await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST");
        
        assignToOptions.value = getImplementationExecutiveList.value?.map(value => ({
          label: `${value.name} | ${value.employeeID} | ${value.email}`,
          value: value.id
        })) || [];

      } catch (error) {

        console.error('Error loading unassigned data:', error);
      } finally {
        tableAjaxLoading1.value = false;
        $q.loading.hide();
      }
    };

    const ajaxLoadAllLeadInfo = async ({ pagination, filter: searchFilter }) => {
      tableAjaxLoading.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      try {
        await store.dispatch("OnboardingExistingMerchants/ONBOARDING_MERCHANT_ASSIGNED_LIST", { 
          pagination, 
          filter: searchFilter 
        });

        const assignedData = getOnboardingMerchantAssignedList.value;
        
        paginationControl.value = {
          ...pagination,
          rowsNumber: assignedData.totalElements || 0,
          page: assignedData.number ? assignedData.number + 1 : 1,
          sortBy: assignedData.sort?.[0]?.property || "createdAt",
          descending: !assignedData.sort?.[0]?.ascending
        };

        tableData.value = assignedData.content || [];

        // Load implementation executives if not already loaded
        if (assignToOptions.value.length === 0) {
          await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST");
          assignToOptions.value = getImplementationExecutiveList.value?.map(value => ({
            label: `${value.name} | ${value.employeeID} | ${value.email}`,
            value: value.id
          })) || [];
        }

      } catch (error) {

        console.error('Error loading assigned data:', error);
      } finally {
        tableAjaxLoading.value = false;
        $q.loading.hide();
      }
    };

    const goToUnassignedTab = (tab) => {
      if (tab == "unAssigned") {
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        formData.value.marsDeviceIdsCooked = [];
        formData.value.assignTo = "";
      } else {
        ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignTo = "";
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

    const assignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCooked.length == 0) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Select at least one item to assign",
          icon: "thumb_down"
        });
        return;
      }

      if (!formData.value.assignTo) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Implementation officer cannot be empty!",
          icon: "thumb_down"
        });
        return;
      }

      const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
      const postValues = {
        marsDeviceIds: marsDeviceIdsCooked,
        userId: formData.value.assignTo
      };

      try {
        await store.dispatch("OnboardingExistingMerchants/ONBOARDING_MERCHANT_SUBMIT", postValues);
        
        await ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        
        formData.value.marsDeviceIdsCooked = [];
        formData.value.assignTo = "";
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Assigned!",
          icon: "thumb_up"
        });
      } catch {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down"
        });
      }
    };

    const unAssignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCookedUnAssinged.length == 0) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Select at least one item to Unassign",
          icon: "thumb_down"
        });
        return;
      }

      const marsDeviceIdsCookedUnAssinged = formData.value.marsDeviceIdsCookedUnAssinged.map(value => value.id);
      const postValues = {
        action: "MARS_DEVICE_STATUS_TID_GENERATED", // Replace with actual constant
        marsDeviceIds: marsDeviceIdsCookedUnAssinged,
        userId: 0 // Replace with actual constant
      };

      try {
        await store.dispatch("OnboardingExistingMerchants/ONBOARDING_MERCHANT_SUBMIT_UNASSIGN", postValues);
        
        await ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
        
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignTo = "";
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Un-Assigned!",
          icon: "thumb_up"
        });
      } catch {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down"
        });
      }
    };

    const reAssignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCookedUnAssinged.length == 0) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Select at least one item to assign",
          icon: "thumb_down"
        });
        return;
      }

      if (!formData.value.assignTo) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Implementation officer cannot be empty!",
          icon: "thumb_down"
        });
        return;
      }

      const marsDeviceIdsCookedUnAssinged = formData.value.marsDeviceIdsCookedUnAssinged.map(value => value.id);
      const postValues = {
        action: "MARS_DEVICE_STATUS_SAT_ASSIGNED", // Replace with actual constant
        marsDeviceIds: marsDeviceIdsCookedUnAssinged,
        triggerWelcomeMail: formData.value.triggerWelcomeMail,
        userId: formData.value.assignTo
      };

      try {
        await store.dispatch("OnboardingExistingMerchants/ONBOARDING_MERCHANT_SUBMIT", postValues);
        
        await ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
        
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignTo = "";
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Re-Assigned!",
          icon: "thumb_up"
        });
      } catch {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down"
        });
      }
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      getPincodeInformations();
      // Load initial data
      ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value
      });
    });

    return {
      // Refs
      propToggleLeadInformation,
      addtnLeadInformation,
      filterSearch,
      filterSearch1,
      selectedTab,
      assignTo,
      assignToOptions,
      tableData,
      tableData1,
      uploaderHovered,
      columnDataAssigned,
      columnDataUnassigned,
      currentDeviceInfo,
      showDeviceAddressModal,
      formData,
      paginationControl,
      paginationControl1,
      tableAjaxLoading,
      tableAjaxLoading1,
      
      // Methods
      removeBulkUploadFile,
      dragAndDropCustomAnimate,
      onDrop,
      fileCheckSum,
      onChange,
      uploadFileForBulkUpload,
      getPincodeInformations,
      ajaxLoadAllLeadInfo1,
      ajaxLoadAllLeadInfo,
      goToUnassignedTab,
      UpdateDeviceAddress,
      UpdateDeviceAddressAfterEmit,
      assignImplementationUser,
      unAssignImplementationUser,
      reAssignImplementationUser,
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

.align1 {
  margin-bottom: 7px;
}

.align2 {
  margin-top: 10px;
}

.size1 {
  margin-left: -15px;
}

.size2 {
  font-size: 2.5rem;
}

input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
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

.hide-underline {
  text-decoration: none;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-h3 {
  font-size: 3rem;
  font-weight: 300;
}

.text-primary {
  color: #027be3;
}
</style>