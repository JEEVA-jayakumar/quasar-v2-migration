<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" color="grey-1">
        <q-tab @click="ajaxSpareData" :selected="activeTab === 'tab-3'" color="dark" name="tab-3" label="Active Issue Types" />
        <q-tab color="dark" name="tab-4" label="Deactive Issue Types" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-3">
            <q-table 
              :rows="ActivetableData" 
              table-class="customSATableClass" 
              :columns="columns1" 
              :filter="filterSearch1"
              :pagination="paginationControl" 
              :filter-method="myCustomSearchFilter1" 
              row-key="name" 
              color="grey-9"
            >
              <template #body-cell-createdDate="props">
                <q-td :props="props">{{ formatDate(props.row.createdDate) }}</q-td>
              </template>
              
              <template #body-cell-updatedDate="props">
                <q-td :props="props">{{ formatDate(props.row.updatedDate) }}</q-td>
              </template>

              <template #body-cell-action1="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                      @click="fnShowEditSubTaskType(props.row)" flat class="text-light-blue"></q-btn>
                    <q-btn dense no-caps no-wrap label="Disable" icon="far fa-minus-square" size="md"
                      @click="fnDeleteSubTaskType(props.row)" flat class="text-negative"></q-btn>
                  </div>
                </q-td>
              </template>

              <template #top>
                <div class="col-3">
                  <q-input clearable color="grey-9" v-model="filterSearch1" placeholder="Type.." class="q-mr-lg" dense>
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-3" align="right">
                  <q-btn no-caps class="text-weight-regular" label="Add Sub Task"
                    @click="fnShowAddNewSubTaskType(null)" color="purple-9" size="md" />
                </div>
              </template>
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-4">
            <q-table 
              :rows="DeactivetableData" 
              table-class="customSATableClass" 
              :columns="columns4" 
              :filter="filterSearch3"
              :pagination="paginationControl2" 
              :filter-method="myCustomSearchFilter2" 
              row-key="name" 
              color="grey-9"
            >
              <template #body-cell-createdDate="props">
                <q-td :props="props">{{ formatDate(props.row.createdDate) }}</q-td>
              </template>
              
              <template #body-cell-updatedDate="props">
                <q-td :props="props">{{ formatDate(props.row.updatedDate) }}</q-td>
              </template>

              <template #body-cell-action2="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Active" icon="far fa-plus-square" size="md"
                      @click="fnShowActiveIssueType(props.row)" flat class="text-light-blue"></q-btn>
                  </div>
                </q-td>
              </template>

              <template #top>
                <div class="col-3">
                  <q-input clearable color="grey-9" v-model="filterSearch3" placeholder="Type.." class="q-mr-lg" dense>
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>

      <!-- Edit Service Type Modal -->
      <showEditServiceType 
        v-if="propShowEditServiceType" 
        :propShowEditServiceType="propShowEditServiceType"
        :propRowDetails="propRowDetails" 
        @emitfnshowEditServiceType="fnShowEditServiceType" 
      />

      <!-- Edit Sub Task Type Modal -->
      <showEditSubTaskType 
        v-if="propShowEditSubTaskType" 
        :propShowEditSubTaskType="propShowEditSubTaskType"
        :propRowDetails1="propRowDetails1" 
        @emitfnshowEditSubTaskType="fnShowEditSubTaskType" 
      />

      <!-- Add Service Type Modal -->
      <ShowAddServiceType 
        v-if="propShowAddServiceType" 
        :propShowAddServiceType="propShowAddServiceType"
        :propRowDetails="propRowDetails" 
        @emitfnShowAddNewServiceType="fnShowAddNewServiceType" 
      />

      <!-- Add Sub Task Type Modal -->
      <ShowAddSubTaskType 
        v-if="propShowAddSubTaskType" 
        :propShowAddSubTaskType="propShowAddSubTaskType"
        :propRowDetails2="propRowDetails2" 
        @emitfnShowAddNewSubTaskType="fnShowAddNewSubTaskType" 
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import ShowAddServiceType from "../../components/super_admin/ShowAddServiceType.vue";
import showEditServiceType from "../../components/super_admin/showEditServiceType.vue";
import showEditSubTaskType from "../../components/super_admin/showEditSubTaskType.vue";
import ShowAddSubTaskType from "../../components/super_admin/ShowAddSubTaskType.vue";

export default defineComponent({
  name: "getsubTaskDetails",
  
  components: {
    ShowAddServiceType,
    showEditServiceType,
    showEditSubTaskType,
    ShowAddSubTaskType
  },

  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const activeTab = ref("tab-3");
    const propShowAddServiceType = ref(false);
    const propShowEditServiceType = ref(false);
    const propShowEditSubTaskType = ref(false);
    const propShowActiveServiceType = ref(false);
    const propShowAddSubTaskType = ref(false);
    const propRowDetails = ref(null);
    const propRowDetails1 = ref(null);
    const propRowDetails2 = ref(null);
    const propRowDetails4 = ref(null);
    const filterSearch1 = ref("");
    const filterSearch3 = ref("");
    const tableData = ref([]);
    const ActivetableData = ref([]);
    const DeactivetableData = ref([]);
    const DeactiveissueTypes = ref([]);
    const ActiveissueTypes = ref([]);

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

    // Columns definition
    const columns1 = [
      {
        name: "name",
        required: true,
        label: "Issue Name",
        align: "left",
        field: "name",
        sortable: true
      },
      {
        name: "createdDate",
        required: true,
        label: "Created Date",
        align: "left",
        field: "createdDate",
        sortable: true
      },
      {
        name: "updatedDate",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updatedDate",
        sortable: true
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

    const columns4 = [
      {
        name: "name",
        required: true,
        label: "Issue Name",
        align: "left",
        field: "name",
        sortable: true
      },
      {
        name: "createdDate",
        required: true,
        label: "Created Date",
        align: "left",
        field: "createdDate",
        sortable: true
      },
      {
        name: "updatedDate",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updatedDate",
        sortable: true
      },
      {
        name: "action2",
        required: true,
        label: "",
        align: "left",
        field: "action2",
        sortable: false
      }
    ];

    // Computed properties
 
    
    const getsubTaskDetails = computed(() => 
      store.getters["serviceRequest/getsubTaskDetails"]
    );

    // Methods
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    };

    const fnShowActiveIssueType = async (reqData) => {
      console.log("REQUEST DATA---------->", JSON.stringify(reqData));
      
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to active this issue?",
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
            id: reqData.id,
            request: reqData,
          };
          
          await store.dispatch("serviceRequest/ACTIVE_SERVICE_ISSUE_TYPES", param);
          
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

    const fnDeleteSubTaskType = async (rowDetails) => {
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
          await store.dispatch("serviceRequest/DELETE_SUB_TASK_TYPES", rowDetails);
          
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
        await store.dispatch("serviceRequest/FETCH_SUB_TASK_DATAS");
        
        tableData.value = [...getsubTaskDetails.value];
        DeactivetableData.value = getsubTaskDetails.value.filter(service => !service.active);
        ActivetableData.value = getsubTaskDetails.value.filter(service => service.active);
        
        // Update pagination rows number
        paginationControl.value.rowsNumber = ActivetableData.value.length;
        paginationControl2.value.rowsNumber = DeactivetableData.value.length;
        
      } catch (error) {

        $q.loading.hide();
        console.error("Error fetching sub task data:", error);
      }
    };

    const ajaxSpareData1 = async () => {
      try {
        await store.dispatch("serviceRequest/FETCH_ALL_SERVICE_REQUEST_GET_TYPES");
        
        DeactiveissueTypes.value = getsubTaskDetails.value.filter(service => !service.active);
        ActiveissueTypes.value = getsubTaskDetails.value.filter(service => service.active);
        
      } catch (error) {

        $q.loading.hide();
        console.error("Error fetching service request types:", error);
      }
    };

    const fnShowAddNewServiceType = (rowDetails) => {
      propShowAddServiceType.value = !propShowAddServiceType.value;
      propRowDetails.value = rowDetails;
    };

    const fnShowAddNewSubTaskType = (token) => {
      propShowAddSubTaskType.value = !propShowAddSubTaskType.value;
      if (token === "refresh") {
        ajaxSpareData();
      }
    };

    const fnShowEditServiceType = (rowDetails) => {
      propShowEditServiceType.value = !propShowEditServiceType.value;
      propRowDetails.value = rowDetails;
    };

    const fnShowEditSubTaskType = (rowDetails) => {
      propShowEditSubTaskType.value = !propShowEditSubTaskType.value;
      propRowDetails1.value = rowDetails;
      
      if (!propShowEditSubTaskType.value) {
        ajaxSpareData();
      }
    };

    const myCustomSearchFilter1 = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        columns1.some(
          col =>
            col.field &&
            row[col.field] &&
            String(row[col.field]).toLowerCase().includes(lowerTerms)
        )
      );
    };

    const myCustomSearchFilter2 = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        columns4.some(
          col =>
            col.field &&
            row[col.field] &&
            String(row[col.field]).toLowerCase().includes(lowerTerms)
        )
      );
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxSpareData();
      ajaxSpareData1();
    });

    // Watch for tab changes
    watch(activeTab, (newTab) => {
      if (newTab === 'tab-3' || newTab === 'tab-4') {
        ajaxSpareData();
      }
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
      filterSearch1,
      filterSearch3,
      paginationControl,
      paginationControl2,
      columns1,
      columns4,
      ActivetableData,
      DeactivetableData,
      formatDate,
      fnShowActiveIssueType,
      fnDeleteServiceType,
      fnDeleteSubTaskType,
      ajaxSpareData,
      ajaxSpareData1,
      fnShowAddNewServiceType,
      fnShowAddNewSubTaskType,
      fnShowEditServiceType,
      fnShowEditSubTaskType,
      myCustomSearchFilter1,
      myCustomSearchFilter2
    };
  }
});
</script>

<style scoped>
.customSATableClass {
  width: 100%;
}

.shadow-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
</style>