<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    position="right"
    @escape-key="emitModalClose"
    class="customModalOverlay"
  >
    <q-card style="min-width: 50vw; min-height: 100vh; padding: 60px 25px">
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col-8">
          <div class="row group">
            <div class="col-12">
              <div class="text-h6 text-weight-regular">Manage merchant document types</div>
            </div>
            <div class="col-12">
              <q-select
                color="grey-9"
                placeholder="Merchant type"
                :options="activeMerchantType"
                v-model="formData.merchantType"
                label="Select merchant type"
                @update:model-value="handleMerchantTypeChange"
                @blur="v$.formData.merchantType.$touch"
                :error="v$.formData.merchantType.$error"
                map-options
                emit-value
                option-value="value"
                option-label="label"
                dense
              />
            </div>
          </div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose"/>
        </div>
      </q-card-section>

      <q-card-section>
        <q-tabs v-model="currentListTabulation" color="grey-9">
          <q-tab name="tab-1" label="Active List" @click="fetchMerchantDocumentTypeActivatedList" />
          <q-tab name="tab-2" label="De-Actived List" @click="fetchMerchantDocumentTypeDeActivatedList" />
        </q-tabs>

        <q-tab-panels v-model="currentListTabulation" animated>
          <q-tab-panel name="tab-1">
            <q-table
              :rows="merchantDocumentTypesList"
              table-class="customSATableClass"
              :columns="merchantActiveDocumentcolumns"
              :filter="filterSearch"
              :pagination="paginationControl"
              :filter-method="myCustomSearchFilter"
              row-key="id"
              color="grey-9"
              flat
            >
              <template #body-cell-action="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Modify"
                      icon="far fa-plus-square"
                      size="md"
                      @click="fnShowEditMerchantDocumentTypes(props.row)"
                      flat
                      class="text-light-blue"
                    />
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Disable"
                      icon="far fa-minus-square"
                      size="md"
                      @click="fnDeleteMerchantDocumentType(props.row)"
                      flat
                      class="text-negative"
                    />
                  </div>
                </q-td>
              </template>

              <template #top>
                <div class="col-8">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search merchant type"
                    dense
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-4" align="right">
                  <q-btn
                    no-caps
                    no-wrap
                    label="Add New"
                    class="text-weight-regular"
                    color="purple-9"
                    icon="far fa-plus-square"
                    @click="fnshowCreateMerchantDocumentType"
                  />
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2">
            <q-table
              :rows="merchantDocumentTypesDeactivatedList"
              table-class="customSATableClass"
              :columns="merchantDeactiveDocumentcolumns"
              :filter="deActivatedSearch"
              :pagination="paginationControl"
              :filter-method="myCustomSearchFilter"
              row-key="id"
              color="grey-9"
              flat
            >
              <template #body-cell-action="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Enable"
                      icon="far fa-check-square"
                      size="md"
                      @click="fnEnableMerchantDocumentType(props.row)"
                      flat
                      class="text-positive"
                    />
                  </div>
                </q-td>
              </template>

              <template #top>
                <div class="col-8">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="deActivatedSearch"
                    placeholder="Type.."
                    label="Search merchant type"
                    dense
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!--START: Show create MerchantDocumentTypes -->
    <showCreateMerchantDocumentType
      v-if="propShowCreateMerchantDocumentTypes"
      :propShowCreateMerchantDocumentTypes="propShowCreateMerchantDocumentTypes"
      :propActiveMerchantTypes="activeMerchantType"
      @emitfnshowMerchantDocumentTypes="fnshowCreateMerchantDocumentType"
    />
    <!--END: Show create MerchantDocumentTypes -->
    
    <!--START: Show edit MerchantDocumentTypes -->
    <showEditMerchantDocumentType
      v-if="showEditMerchantDocumentTypes"
      :propShowEditMerchantDocumentTypes="showEditMerchantDocumentTypes"
      :propActiveMerchantTypes="activeMerchantType"
      :propCurrentMerchantType="formData.merchantType"
      :propRowDetails="propRowDetails"
      @emitfnshowMerchantDocumentTypes="refreshMerchantDocumentTypeList"
    />
    <!--END: Show edit MerchantDocumentTypes -->
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import showCreateMerchantDocumentType from "./createMerchantDocumentType.vue";
import showEditMerchantDocumentType from "./editMerchantDocumentType.vue";
import _ from 'lodash';

export default defineComponent({
  name: 'ManageMerchantDocumentTypes',
  
  props: {
    propToggleModal: {
      type: Boolean,
      required: true
    },
    propactiveMerchantDocumentTypes: {
      type: Array,
      default: () => []
    },
    propMerchantType: {
      type: Object,
      default: null
    }
  },
  
  components: {
    showCreateMerchantDocumentType,
    showEditMerchantDocumentType
  },
  
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const currentListTabulation = ref("tab-1");
    const activeMerchantType = ref([]);
    const toggleModal = ref(props.propToggleModal);
    const merchantDocumentTypes = ref(props.propactiveMerchantDocumentTypes);
    const makeUpdateElementActive = ref(false);
    const propShowCreateMerchantDocumentTypes = ref(false);
    const showEditMerchantDocumentTypes = ref(false);
    const propRowDetails = ref(null);
    const filterSearch = ref("");
    const deActivatedSearch = ref("");
    const merchantDocumentTypesList = ref([]);
    const merchantDocumentTypesDeactivatedList = ref([]);

    const formData = ref({
      merchantType: props.propMerchantType
    });

    // Validation rules
    const rules = {
      formData: {
        merchantType: { required }
      }
    };

    const v$ = useVuelidate(rules, { formData });

    // Pagination
    const paginationControl = ref({
      rowsPerPage: 10,
      page: 1,
      rowsNumber: 0
    });

    // Table columns
    const merchantActiveDocumentcolumns = [
      {
        name: "documentType",
        required: true,
        label: "Merchant Document Type",
        align: "left",
        field: row => row.documentType || row.merchantDocumentTypeName,
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

    const merchantDeactiveDocumentcolumns = [
      {
        name: "documentType",
        required: true,
        label: "Merchant Document Type",
        align: "left",
        field: row => row.documentType || row.merchantDocumentTypeName,
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
    const getActiveMerchantTypes = computed(() => 
      store.getters["merchantTypes/getActiveMerchantTypes"]
    );
    
    const getActiveMerchantDocumentTypes = computed(() => 
      store.getters["merchantDocumentTypes/getActiveMerchantDocumentTypes"]
    );
    
    const getDeActivatedMerchantDocumentTypes = computed(() => 
      store.getters["merchantDocumentTypes/getDeActivatedMerchantDocumentTypes"]
    );

    // Methods
    const emitModalClose = () => {
      emit("emitToggleModal");
    };

    const handleMerchantTypeChange = () => {
      if (currentListTabulation.value === 'tab-1') {
        fetchMerchantDocumentTypeActivatedList();
      } else {
        fetchMerchantDocumentTypeDeActivatedList();
      }
    };

    const fetchMerchantDocumentTypeList = async () => {
      try {
        await store.dispatch("merchantTypes/MERCHANT_TYPE_ACTIVE_LIST");
        
        // Map merchant types to options format
        activeMerchantType.value = getActiveMerchantTypes.value.map(item => ({
          value: item.id,
          label: item.merchantTypeName
        }));
        
        await fetchMerchantDocumentTypeActivatedList();
      } catch (error) {

        console.error("Error fetching merchant types:", error);
      }
    };

    const fetchMerchantDocumentTypeActivatedList = async () => {
      await v$.value.$touch();
      if (v$.value.formData.merchantType.$error) {
        return;
      }

      $q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });

      try {
        merchantDocumentTypesList.value = [];
        
        await store.dispatch("merchantDocumentTypes/MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST", {
          merchantTypeId: formData.value.merchantType,
          parentId: 0 // for primary document
        });

        // Use lodash uniqBy to remove duplicates
        merchantDocumentTypesList.value = _.uniqBy(
          getActiveMerchantDocumentTypes.value,
          "documentType"
        );
        
        // Update pagination rows number
        paginationControl.value.rowsNumber = merchantDocumentTypesList.value.length;
      } catch (error) {

        console.error("Error fetching active merchant document types:", error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load active document types",
          icon: "error"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const fetchMerchantDocumentTypeDeActivatedList = async () => {
      await v$.value.$touch();
      if (v$.value.formData.merchantType.$error) {
        return;
      }

      $q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });

      try {
        merchantDocumentTypesDeactivatedList.value = [];
        
        await store.dispatch("merchantDocumentTypes/MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST", {
          merchantTypeId: formData.value.merchantType,
          parentId: 0 // for primary document
        });

        merchantDocumentTypesDeactivatedList.value = [...getDeActivatedMerchantDocumentTypes.value];
        
        // Update pagination rows number
        paginationControl.value.rowsNumber = merchantDocumentTypesDeactivatedList.value.length;
      } catch (error) {

        console.error("Error fetching deactivated merchant document types:", error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Failed to load deactivated document types",
          icon: "error"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const fnshowCreateMerchantDocumentType = (token) => {
      propShowCreateMerchantDocumentTypes.value = !propShowCreateMerchantDocumentTypes.value;
      if (token === "refresh") {
        fetchMerchantDocumentTypeActivatedList();
      }
    };

    const fnShowEditMerchantDocumentTypes = (rowDetails) => {
      showEditMerchantDocumentTypes.value = !showEditMerchantDocumentTypes.value;
      propRowDetails.value = rowDetails;
    };

    const refreshMerchantDocumentTypeList = () => {
      showEditMerchantDocumentTypes.value = !showEditMerchantDocumentTypes.value;
      fetchMerchantDocumentTypeActivatedList();
    };

    const fnDeleteMerchantDocumentType = (rowDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete merchant type?",
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
          await store.dispatch("merchantDocumentTypes/DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE", rowDetails.id);
          
          await fetchMerchantDocumentTypeActivatedList();
          
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `Merchant type: ${rowDetails.documentType || rowDetails.merchantDocumentTypeName} has been deactivated`,
            icon: "thumb_up"
          });
        } catch {

          $q.notify({
            color: "warning",
            position: "bottom",
            message: "Please try again!",
            icon: "thumb_down"
          });
        } finally {
          $q.loading.hide();
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

    const fnEnableMerchantDocumentType = (rowDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to enable merchant type?",
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
          await store.dispatch("merchantDocumentTypes/UPDATE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE", {
            merchantType: formData.value.merchantType,
            hasSubDoc: rowDetails.viewType ? false : true,
            id: rowDetails.id,
            params: rowDetails,
            parentId: rowDetails.parentID
          });

          await fetchMerchantDocumentTypeDeActivatedList();
          
          $q.notify({
            color: "positive",
            position: "bottom",
            message: `Merchant type: ${rowDetails.documentType || rowDetails.merchantDocumentTypeName} has been activated`,
            icon: "thumb_up"
          });
        } catch (error) {

          console.error("Error enabling merchant document type:", error);
          $q.notify({
            color: "warning",
            position: "bottom",
            message: "Please try again!",
            icon: "thumb_down"
          });
        } finally {
          $q.loading.hide();
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

    const myCustomSearchFilter = (rows, terms) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => {
        const documentType = (row.documentType || row.merchantDocumentTypeName || '').toLowerCase();
        return documentType.includes(lowerTerms);
      });
    };

    // Watch for prop changes
    watch(() => props.propToggleModal, (newVal) => {
      toggleModal.value = newVal;
      if (newVal) {
        fetchMerchantDocumentTypeList();
      }
    });

    // Lifecycle hooks
    onMounted(() => {
      fetchMerchantDocumentTypeList();
    });

    return {
      currentListTabulation,
      activeMerchantType,
      toggleModal,
      merchantDocumentTypes,
      makeUpdateElementActive,
      propShowCreateMerchantDocumentTypes,
      showEditMerchantDocumentTypes,
      propRowDetails,
      formData,
      filterSearch,
      deActivatedSearch,
      paginationControl,
      merchantActiveDocumentcolumns,
      merchantDeactiveDocumentcolumns,
      merchantDocumentTypesList,
      merchantDocumentTypesDeactivatedList,
      v$,
      emitModalClose,
      handleMerchantTypeChange,
      fetchMerchantDocumentTypeList,
      fetchMerchantDocumentTypeActivatedList,
      fetchMerchantDocumentTypeDeActivatedList,
      fnshowCreateMerchantDocumentType,
      fnShowEditMerchantDocumentTypes,
      refreshMerchantDocumentTypeList,
      fnDeleteMerchantDocumentType,
      fnEnableMerchantDocumentType,
      myCustomSearchFilter
    };
  }
});
</script>

<style scoped>
.customModalOverlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customSATableClass {
  width: 100%;
}
</style>