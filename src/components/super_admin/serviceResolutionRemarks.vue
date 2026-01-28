<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" color="grey-1">
        <q-tab @click="ajaxSpareData" :selected="activeTab === 'tab-3'" color="dark" name="tab-3" label="Active Service Resolution Remarks" />
        <q-tab color="dark" name="tab-4" label="Deactive Service Resolution Remarks" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-3">
            <q-table 
              :rows="ActivetableData" 
              table-class="customSATableClass" 
              :columns="columns1" 
              :filter="filterSearch1"
              :pagination="paginationControl" 
              :filter-method="myCustomSearchFilter1" 
              row-key="id" 
              color="grey-9"
              flat
            >
              <template #body-cell-createdAt="props">
                <q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td>
              </template>
              
              <template #body-cell-updatedAt="props">
                <q-td :props="props">{{ formatDate(props.row.updatedAt) }}</q-td>
              </template>

              <template #body-cell-action1="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                      @click="fnShowEditServiceResolutionRemarks(props.row)" flat class="text-light-blue" />
                    <q-btn dense no-caps no-wrap label="Disable" icon="far fa-minus-square" size="md"
                      @click="fnDeleteServiceResolutionRemarks(props.row)" flat class="text-negative" />
                  </div>
                </q-td>
              </template>
              
              <template #top>
                <div class="col-3">
                  <q-input clearable color="grey-9" v-model="filterSearch1" placeholder="Search by Issue Name" class="q-mr-lg" dense>
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-3" align="right">
                  <q-btn no-caps class="text-weight-regular" label="Add Remarks"
                    @click="fnShowAddServiceResolutionRemarks" color="purple-9" size="md" />
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
              row-key="id" 
              color="grey-9"
              flat
            >
              <template #body-cell-createdAt="props">
                <q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td>
              </template>
              
              <template #body-cell-updatedAt="props">
                <q-td :props="props">{{ formatDate(props.row.updatedAt) }}</q-td>
              </template>

              <template #body-cell-action2="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Active" icon="far fa-plus-square" size="md"
                      @click="fnShowActiveServiceResolutionRemarks(props.row)" flat class="text-light-blue" />
                  </div>
                </q-td>
              </template>

              <template #top>
                <div class="col-3">
                  <q-input clearable color="grey-9" v-model="filterSearch3" placeholder="Search by Issue Name" class="q-mr-lg" dense>
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

      <!--START: Show edit Sub Task -->
      <showEditServiceResolutionRemarks 
        v-if="propShowEditServiceResolutionRemarks" 
        :propShowEditServiceResolutionRemarks="propShowEditServiceResolutionRemarks"
        :propRowDetails1="propRowDetails1" 
        @emitfnshowEditServiceResolutionRemarks="fnShowEditServiceResolutionRemarks" 
      />
      <!-- END: Show edit Spare Parts -->

      <!--START: Show SubTaskType -->
      <showAddServiceResolutionRemarks 
        v-if="propShowAddServiceResolutionRemarks" 
        :propShowAddServiceResolutionRemarks="propShowAddServiceResolutionRemarks"
        :propRowDetails2="propRowDetails2" 
        @emitfnShowAddServiceResolutionRemarks="fnShowAddServiceResolutionRemarks" 
      />
      <!--END: Show Add SubTaskType -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import showEditServiceResolutionRemarks from "../../components/super_admin/showEditServiceResolutionRemarks.vue";
import showAddServiceResolutionRemarks from "../../components/super_admin/showAddServiceResolutionRemarks.vue";

export default defineComponent({
  name: "getserviceActiveResolutionDeatils",
  
  components: {
    showEditServiceResolutionRemarks,
    showAddServiceResolutionRemarks,
  },

  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const activeTab = ref("tab-3");
    const propShowEditServiceResolutionRemarks = ref(false);
    const propShowAddServiceResolutionRemarks = ref(false);
    const propRowDetails1 = ref(null);
    const propRowDetails2 = ref(null);
    const filterSearch1 = ref("");
    const filterSearch3 = ref("");
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
        name: "name",
        required: true,
        label: "Issue Name",
        align: "left",
        field: row => row.name || 'N/A',
        sortable: true
      },
      {
        name: "createdAt",
        required: true,
        label: "Created Date",
        align: "left",
        field: "createdAt",
        sortable: true
      },
      {
        name: "updatedAt",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updatedAt",
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
        field: row => row.name || 'N/A',
        sortable: true
      },
      {
        name: "createdAt",
        required: true,
        label: "Created Date",
        align: "left",
        field: "createdAt",
        sortable: true
      },
      {
        name: "updatedAt",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updatedAt",
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

    // Computed properties from Vuex store
    const getserviceActiveResolutionDeatils = computed(() => 
      store.getters["serviceRequest/getserviceActiveResolutionDeatils"]
    );
    
    const getserviceDeactiveResolutionDeatils = computed(() => 
      store.getters["serviceRequest/getserviceDeactiveResolutionDeatils"]
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

    const fnShowActiveServiceResolutionRemarks = async (reqData) => {
      console.log("REQUEST DATA---------->", JSON.stringify(reqData));
      
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to active this Remarks?",
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
          
          await store.dispatch("serviceRequest/ACTIVE_SERVICE_RESOLUTION_REMARKS", param);
          
          $q.loading.hide();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Updated!",
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

    const fnDeleteServiceResolutionRemarks = async (rowDetails) => {
      console.log("ROW DETAILS------------->", JSON.stringify(rowDetails));
      
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to disable?",
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
          await store.dispatch("serviceRequest/DELETE_SERVICE_RESOLUTION_REMARKS", rowDetails);
          
          $q.loading.hide();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Removed",
            icon: "thumb_up"
          });
          
          ajaxSpareData();
        } catch {

          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: "Failed to disable. Please try again.",
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
        // Fetch active service resolution data
        await store.dispatch("serviceRequest/FETCH_ACTIVE_SERVICE_RESOLUTION_DATAS");
        
        // Filter active data
        ActivetableData.value = getserviceActiveResolutionDeatils.value.filter(
          service => service.active === true
        );
        
        // Update pagination for active table
        paginationControl.value.rowsNumber = ActivetableData.value.length;
        
        console.log("Active table data:", ActivetableData.value.length);

        // Fetch deactive service resolution data
        await store.dispatch("serviceRequest/FETCH_DEACTIVE_SERVICE_RESOLUTION_DATAS");
        
        // Filter deactive data
        DeactivetableData.value = getserviceDeactiveResolutionDeatils.value.filter(
          service => service.active === false
        );
        
        // Update pagination for deactive table
        paginationControl2.value.rowsNumber = DeactivetableData.value.length;
        
        console.log("Deactive table data:", DeactivetableData.value.length);
        
      } catch (error) {

        console.error("Error fetching service resolution data:", error);
        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load service resolution data",
          icon: "error"
        });
      }
    };

    const fnShowAddServiceResolutionRemarks = (token) => {
      propShowAddServiceResolutionRemarks.value = !propShowAddServiceResolutionRemarks.value;
      if (token === "refresh") {
        ajaxSpareData();
      }
    };

    const fnShowEditServiceResolutionRemarks = (rowDetails) => {
      propShowEditServiceResolutionRemarks.value = !propShowEditServiceResolutionRemarks.value;
      propRowDetails1.value = rowDetails;
      
      if (!propShowEditServiceResolutionRemarks.value) {
        ajaxSpareData();
      }
    };

    const myCustomSearchFilter1 = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => {
        const name = (row.name || '').toLowerCase();
        return name.includes(lowerTerms);
      });
    };

    const myCustomSearchFilter2 = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => {
        const name = (row.name || '').toLowerCase();
        return name.includes(lowerTerms);
      });
    };

    // Watch for tab changes
    watch(activeTab, (newTab) => {
      if (newTab === 'tab-3' || newTab === 'tab-4') {
        ajaxSpareData();
      }
    });

    // Lifecycle hooks
    onMounted(() => {
      ajaxSpareData();
    });

    return {
      activeTab,
      propShowEditServiceResolutionRemarks,
      propShowAddServiceResolutionRemarks,
      propRowDetails1,
      propRowDetails2,
      filterSearch1,
      filterSearch3,
      paginationControl,
      paginationControl2,
      columns1,
      columns4,
      ActivetableData,
      DeactivetableData,
      formatDate,
      fnShowActiveServiceResolutionRemarks,
      fnDeleteServiceResolutionRemarks,
      ajaxSpareData,
      fnShowAddServiceResolutionRemarks,
      fnShowEditServiceResolutionRemarks,
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

.row.no-wrap {
  flex-wrap: nowrap;
}

.row.no-padding {
  padding: 0;
}

.text-light-blue {
  color: #03a9f4;
}

.text-negative {
  color: #f44336;
}

.text-positive {
  color: #4caf50;
}

.q-mr-lg {
  margin-right: 16px;
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}
</style>