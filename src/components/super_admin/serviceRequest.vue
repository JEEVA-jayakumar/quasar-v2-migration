<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" color="grey-1">
        <q-tab @click="ajaxSpareData" :selected="activeTab === 'tab-1'" color="dark" name="tab-1" label="Active Service Request" />
        <q-tab color="dark" name="tab-2" label="Deactive Service Request" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <q-table 
              :rows="ActivetableData" 
              table-class="customSATableClass" 
              :columns="columns2" 
              :filter="filterSearch"
              :pagination="paginationControl" 
              :filter-method="myCustomSearchFilter1" 
              row-key="id" 
              color="grey-9"
              flat
            >
              <template #body-cell-action="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                      @click="fnShowEditServiceType(props.row)" flat class="text-light-blue" />
                    <q-btn dense no-caps no-wrap label="Disable" icon="far fa-minus-square" size="md"
                      @click="fnDeleteServiceType(props.row)" flat class="text-negative" />
                  </div>
                </q-td>
              </template>

              <template #body-cell-serviceReqIssueTypeSets="props">
                <q-td :props="props">
                  <div class="row no-wrap group">
                    <div v-for="menu in props.row.serviceReqIssueTypeSets" :key="menu.id">
                      <q-chip color="light" class="text-dark">
                        {{ menu.serviceReqIssueType?.name || 'N/A' }}
                      </q-chip>
                    </div>
                  </div>
                </q-td>
              </template>

              <template #body-cell-serviceRequestStatusSets="props">
                <q-td :props="props">
                  <div class="row no-wrap group">
                    <div v-for="menu in props.row.serviceRequestStatusSets" :key="menu.id">
                      <q-chip color="light" class="text-dark">
                        {{ menu.serviceRequestStatus?.name || 'N/A' }}
                      </q-chip>
                    </div>
                  </div>
                </q-td>
              </template>

              <template #top>
                <div class="col-7" align="right">
                  <q-btn no-caps class="text-weight-regular" label="Add Service Type"
                    @click="fnShowAddNewServiceType" color="purple-9" size="md" />
                </div>
              </template>
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-2">
            <q-table 
              :rows="DeactivetableData" 
              table-class="customSATableClass" 
              :columns="columns1" 
              :filter="filterSearch1"
              :pagination="paginationControl2" 
              :filter-method="myCustomSearchFilter2" 
              row-key="id" 
              color="grey-9"
              flat
            >
              <template #body-cell-serviceReqIssueTypeSets="props">
                <q-td :props="props">
                  <div class="row no-wrap group">
                    <div v-for="menu in props.row.serviceReqIssueTypeSets" :key="menu.id">
                      <q-chip color="light" class="text-dark">
                        {{ menu.serviceReqIssueType?.name || 'N/A' }}
                      </q-chip>
                    </div>
                  </div>
                </q-td>
              </template>

              <template #body-cell-serviceRequestStatusSets="props">
                <q-td :props="props">
                  <div class="row no-wrap group">
                    <div v-for="menu in props.row.serviceRequestStatusSets" :key="menu.id">
                      <q-chip color="light" class="text-dark">
                        {{ menu.serviceRequestStatus?.name || 'N/A' }}
                      </q-chip>
                    </div>
                  </div>
                </q-td>
              </template>

              <template #body-cell-action1="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Active" icon="far fa-plus-square" size="md"
                      @click="fnShowActiveServiceType(props.row)" flat class="text-light-blue" />
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>

      <!--START: Show edit service Parts -->
      <showEditServiceType v-if="propShowEditServiceType" :propShowEditServiceType="propShowEditServiceType"
        :propRowDetails2="propRowDetails2" @emitfnshowEditServiceType="fnShowEditServiceType" />
      <!-- END: Show edit Spare Parts -->

      <!--START: Show edit Sub Task -->
      <showEditSubTaskType v-if="propShowEditSubTaskType" :propShowEditSubTaskType="propShowEditSubTaskType"
        :propRowDetails1="propRowDetails1" @emitfnshowEditSubTaskType="fnShowEditSubTaskType" />
      <!-- END: Show edit Spare Parts -->

      <!--START: Show ServiceType -->
      <ShowAddServiceType v-if="propShowAddServiceType" :propShowAddServiceType="propShowAddServiceType"
        :propRowDetails="propRowDetails" @emitfnShowAddNewServiceType="fnShowAddNewServiceType" />
      <!--END: Show Add Spare Parts -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import ShowAddServiceType from "../../components/super_admin/ShowAddServiceType.vue";
import showEditServiceType from "../../components/super_admin/showEditServiceType.vue";
import showEditSubTaskType from "../../components/super_admin/showEditSubTaskType.vue";

export default defineComponent({
  name: "getserviceRequestGetTypes",
  
  components: {
    ShowAddServiceType,
    showEditServiceType,
    showEditSubTaskType,
  },

  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const activeTab = ref("tab-1");
    const propShowAddServiceType = ref(false);
    const propShowEditServiceType = ref(false);
    const propShowEditSubTaskType = ref(false);
    const propShowActiveServiceType = ref(false);
    const propShowAddSubTaskType = ref(false);
    const propRowDetails = ref(null);
    const propRowDetails1 = ref(null);
    const propRowDetails2 = ref(null);
    const propRowDetails4 = ref(null);
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const tableData = ref([]);
    const tableData1 = ref([]);
    const ActivetableData = ref([]);
    const DeactivetableData = ref([]);

    const paginationControl = ref({
      rowsPerPage: 10,
      page: 1,
      rowsNumber: 0
    });

    const paginationControl2 = ref({
      rowsPerPage: 10,
      page: 1,
      rowsNumber: 0
    });

    // Table columns
    const columns1 = [
      {
        name: "service_req_data",
        required: true,
        label: "Service Req Data",
        align: "left",
        field: row => row.serviceReqType?.name || 'N/A',
        sortable: true
      },
      {
        name: "serviceReqIssueTypeSets",
        required: true,
        label: "Service Req Issue TypeSets",
        align: "left",
        field: "serviceReqIssueTypeSets",
        sortable: false
      },
      {
        name: "serviceRequestStatusSets",
        required: true,
        label: "Service Status",
        align: "left",
        field: "serviceRequestStatusSets",
        sortable: false
      },
      {
        name: "action1",
        required: true,
        label: "",
        align: "left",
        field: "action1",
        sortable: false
      }
    ];

    const columns2 = [
      {
        name: "service_req_data",
        required: true,
        label: "Service Req Data",
        align: "left",
        field: row => row.serviceReqType?.name || 'N/A',
        sortable: true
      },
      {
        name: "serviceReqIssueTypeSets",
        required: true,
        label: "Service Req Issue TypeSets",
        align: "left",
        field: "serviceReqIssueTypeSets",
        sortable: false
      },
      {
        name: "serviceRequestStatusSets",
        required: true,
        label: "Service Status",
        align: "left",
        field: "serviceRequestStatusSets",
        sortable: false
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

    // Computed properties from Vuex store
    const getserviceRequestGetTypes = computed(() => 
      store.getters["serviceRequest/getserviceRequestGetTypes"]
    );
    
    const getsubTaskDetails = computed(() => 
      store.getters["serviceRequest/getsubTaskDetails"]
    );

    // Methods
    const fnShowActiveServiceType = async (reqData) => {
      console.log("REQUEST DATA---------->", JSON.stringify(reqData));
      
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to activate this service type?",
        ok: {
          label: "Continue",
          color: "positive"
        },
        cancel: {
          label: "Cancel",
          color: "negative"
        }
      }).onOk(async () => {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none"
        });

        try {
          const param = {
            id: reqData.serviceReqType?.id,
            request: reqData,
          };
          
          await store.dispatch("serviceRequest/EDIT_SERVICE_REQUEST_TYPES", param);
          
          $q.loading.hide();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully updated!",
            icon: "thumb_up"
          });
          
          ajaxSpareData();
        } catch (error) {

          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error.body?.message || "Please Try Again Later!",
            icon: "thumb_down"
          });
        }
      });
    };

    const fnDeleteServiceType = async (rowDetails) => {
      console.log("ROW DETAILS------------->", JSON.stringify(rowDetails));
      
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete?",
        ok: {
          label: "Continue",
          color: "positive"
        },
        cancel: {
          label: "Cancel",
          color: "negative"
        }
      }).onOk(async () => {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none"
        });

        try {
          await store.dispatch("serviceRequest/DELETE_SERVICE_REQUEST_TYPES", rowDetails);
          
          $q.loading.hide();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully removed",
            icon: "thumb_up"
          });
          
          ajaxSpareData();
        } catch {

          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: "Failed to delete. Please try again.",
            icon: "thumb_down"
          });
        }
      }).onCancel(() => {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "No changes made!",
          icon: "thumb_down"
        });
      });
    };

    const ajaxSpareData = async () => {
      try {
        await store.dispatch("serviceRequest/FETCH_ALL_SERVICE_REQUEST_GET_TYPES");
        
        tableData.value = [...getserviceRequestGetTypes.value];
        
        // Filter data based on active status
        DeactivetableData.value = getserviceRequestGetTypes.value.filter(
          service => service.serviceReqType?.active === false
        );
        
        ActivetableData.value = getserviceRequestGetTypes.value.filter(
          service => service.serviceReqType?.active === true
        );
        
        // Update pagination rows number
        paginationControl.value.rowsNumber = ActivetableData.value.length;
        paginationControl2.value.rowsNumber = DeactivetableData.value.length;
        
        console.log("Active table data:", ActivetableData.value.length);
        console.log("Deactive table data:", DeactivetableData.value.length);
        
      } catch (error) {

        console.error("Error fetching service request types:", error);
        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load service request types",
          icon: "error"
        });
      }
    };

    const ajaxSpareData1 = async () => {
      try {
        await store.dispatch("serviceRequest/FETCH_SUB_TASK_DATAS");
        
        tableData1.value = [...getsubTaskDetails.value];
        
      } catch (error) {

        console.error("Error fetching sub task data:", error);
        $q.loading.hide();
      }
    };

    const fnShowAddNewServiceType = (token) => {
      propShowAddServiceType.value = !propShowAddServiceType.value;
      if (token === "refresh") {
        ajaxSpareData();
      }
    };

    const fnShowEditServiceType = (rowDetails) => {
      propShowEditServiceType.value = !propShowEditServiceType.value;
      propRowDetails2.value = rowDetails;
      
      if (!propShowEditServiceType.value) {
        ajaxSpareData();
      }
    };

    const fnShowEditSubTaskType = (rowDetails) => {
      propShowEditSubTaskType.value = !propShowEditSubTaskType.value;
      propRowDetails1.value = rowDetails;
    };

    const myCustomSearchFilter1 = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => {
        const serviceName = (row.serviceReqType?.name || '').toLowerCase();
        const issueTypes = (row.serviceReqIssueTypeSets || [])
          .map(item => item.serviceReqIssueType?.name || '')
          .join(' ')
          .toLowerCase();
        const statusTypes = (row.serviceRequestStatusSets || [])
          .map(item => item.serviceRequestStatus?.name || '')
          .join(' ')
          .toLowerCase();
        
        return serviceName.includes(lowerTerms) || 
               issueTypes.includes(lowerTerms) || 
               statusTypes.includes(lowerTerms);
      });
    };

    const myCustomSearchFilter2 = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => {
        const serviceName = (row.serviceReqType?.name || '').toLowerCase();
        const issueTypes = (row.serviceReqIssueTypeSets || [])
          .map(item => item.serviceReqIssueType?.name || '')
          .join(' ')
          .toLowerCase();
        const statusTypes = (row.serviceRequestStatusSets || [])
          .map(item => item.serviceRequestStatus?.name || '')
          .join(' ')
          .toLowerCase();
        
        return serviceName.includes(lowerTerms) || 
               issueTypes.includes(lowerTerms) || 
               statusTypes.includes(lowerTerms);
      });
    };

    // Watch for tab changes
    // const watchActiveTab = watch(activeTab, (newTab) => {
    //   if (newTab === 'tab-1' || newTab === 'tab-2') {
    //     ajaxSpareData();
    //   }
    // });

    // Lifecycle hooks
    onMounted(() => {
      ajaxSpareData();
      ajaxSpareData1();
    });

    return {
      activeTab,
      propShowAddServiceType,
      propShowEditServiceType,
      propShowEditSubTaskType,
      propShowActiveServiceType,
      propShowAddSubTaskType,
      propRowDetails,
      propRowDetails1,
      propRowDetails2,
      propRowDetails4,
      filterSearch,
      filterSearch1,
      paginationControl,
      paginationControl2,
      columns1,
      columns2,
      tableData,
      tableData1,
      ActivetableData,
      DeactivetableData,
      fnShowActiveServiceType,
      fnDeleteServiceType,
      ajaxSpareData,
      ajaxSpareData1,
      fnShowAddNewServiceType,
      fnShowEditServiceType,
      fnShowEditSubTaskType,
      myCustomSearchFilter1,
      myCustomSearchFilter2
    };
  }
});
</script>

<style scoped>
.shadow-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.customSATableClass {
  width: 100%;
}

.group {
  gap: 4px;
  flex-wrap: wrap;
}

.no-padding {
  padding: 0;
}

.no-wrap {
  flex-wrap: nowrap;
}
</style>