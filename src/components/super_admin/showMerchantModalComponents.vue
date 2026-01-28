<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitModalClose"
    transition-show="slide"
    transition-hide="slide"
    class="customModalOverlay"
  >
    <q-card style="min-width:40vw; min-height:100vh; padding:75px 25px">

      <!-- Header -->
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col">
          <div class="q-title text-weight-regular">Manage Merchant Type</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9" class="text-grey-9">
        <q-tab name="tab-1" label="Active List" @click="merchantTypeActiveList" />
        <q-tab name="tab-2" label="De-Actived List" @click="merchantTypeDeActiveList" />
      </q-tabs>

      <!-- Active List Tab -->
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="tab-1">
          <q-table
            :rows="activeMerchantTypeList"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row q-pa-sm">
                <div class="col">
                  <q-search
                    v-model="activeFilterSearch"
                    placeholder="Search by name"
                    clearable
                    dense
                    outlined
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  label="Modify"
                  icon="far fa-plus-square"
                  size="md"
                  class="text-light-blue"
                  @click="merchantTypeEdit(props.row)"
                />
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  label="Disable"
                  icon="far fa-minus-square"
                  size="md"
                  class="text-negative"
                  @click="merchantTypeDisable(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- De-Actived List Tab -->
        <q-tab-panel name="tab-2">
          <q-table
            :rows="deActiveMerchantTypeList"
            :columns="deActivatedColumns"
            row-key="id"
            :filter="deActivatedFilterSearch"
            v-model:pagination="paginationControl"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row q-pa-sm">
                <div class="col">
                  <q-search
                    v-model="deActivatedFilterSearch"
                    placeholder="Search by name"
                    clearable
                    dense
                    outlined
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  label="Enable"
                  icon="far fa-check-square"
                  size="md"
                  class="text-positive"
                  @click="fnEnableMerchantType(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Merchant Modal -->
      <show-create-merchant-type
        v-if="propShowCreateMerchantType"
        :prop-show-create-merchant-type="propShowCreateMerchantType"
        @emitfnshowMerchantTypes="merchantTypeCreate"
      />

      <!-- Edit Merchant Modal -->
      <show-edit-merchant-type
        v-if="propShowEditMerchantType"
        :prop-show-edit-merchant-types="propShowEditMerchantType"
        :prop-row-details="propRowDetails"
        @emitfnshowMerchantTypes="refreshMerchantTypeList"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showCreateMerchantType from "./createMerchantType.vue";
import showEditMerchantType from "./editMerchantType.vue";

// Props
const props = defineProps({ propToggleModal: Boolean });
const emit = defineEmits(["emitToggleModal"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleModal);
const activeTab = ref("tab-1");

const activeMerchantTypeList = ref([]);
const deActiveMerchantTypeList = ref([]);
const activeFilterSearch = ref("");
const deActivatedFilterSearch = ref("");
const paginationControl = ref({ rowsPerPage: 5 });

const propShowCreateMerchantType = ref(false);
const propShowEditMerchantType = ref(false);
const propRowDetails = ref(null);

// Columns
const activatedColumns = ref([
  { name: "merchantTypeName", label: "Merchant type", align: "left", field: "merchantTypeName", sortable: false },
  { name: "action", label: "", align: "left", field: "action", sortable: false }
]);
const deActivatedColumns = ref([...activatedColumns.value]);

// Modal Close
const emitModalClose = () => emit("emitToggleModal");

// Fetch Active Merchant Types
const merchantTypeActiveList = async () => {
  await store.dispatch("merchantTypes/MERCHANT_TYPE_ACTIVE_LIST");
  activeMerchantTypeList.value = store.getters.getActiveMerchantTypes;
};

// Fetch De-Active Merchant Types
const merchantTypeDeActiveList = async () => {
  await store.dispatch("merchantTypes/MERCHANT_TYPE_DEACTIVED_LIST");
  deActiveMerchantTypeList.value = store.getters.getDeActivatedMerchantTypes;
};

// Open Create Merchant Modal
const merchantTypeCreate = (token) => {
  propShowCreateMerchantType.value = !propShowCreateMerchantType.value;
  if (token === "refresh") merchantTypeActiveList();
};

// Open Edit Merchant Modal
const merchantTypeEdit = (rowDetails) => {
  propShowEditMerchantType.value = !propShowEditMerchantType.value;
  propRowDetails.value = rowDetails;
};

// Refresh after Edit
const refreshMerchantTypeList = () => {
  propShowEditMerchantType.value = false;
  merchantTypeActiveList();
};

// Disable Merchant Type
const merchantTypeDisable = (rowDetails) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to disable Merchant type?",
    ok: "Continue",
    cancel: "Cancel"
  })
  .onOk(async () => {
    $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
    try {
      await store.dispatch("merchantTypes/DELETE_MERCHANT_TYPE_AND_SET_ACTIVE", rowDetails);
      $q.notify({ color: "negative", message: "Merchant type deactivated", icon: "thumb_up", position: "bottom" });
      merchantTypeActiveList();
    } catch {
      $q.notify({ color: "warning", message: "Please try again!", icon: "thumb_down", position: "bottom" });
    } finally {
      $q.loading.hide();
    }
  })
  .onCancel(() => {
    $q.notify({ color: "negative", message: "No changes made!", icon: "thumb_down", position: "bottom" });
  });
};

// Enable Merchant Type
const fnEnableMerchantType = (rowDetails) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to enable Merchant type?",
    ok: "Continue",
    cancel: "Cancel"
  })
  .onOk(async () => {
    $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
    try {
      await store.dispatch("merchantTypes/UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE", rowDetails);
      $q.notify({ color: "positive", message: `Merchant type: ${rowDetails.merchantTypeName} has been enabled`, icon: "thumb_up", position: "bottom" });
      merchantTypeDeActiveList();
    } catch {
      $q.notify({ color: "warning", message: "Please try again!", icon: "thumb_down", position: "bottom" });
    } finally {
      $q.loading.hide();
    }
  })
  .onCancel(() => {
    $q.notify({ color: "negative", message: "No changes made!", icon: "thumb_down", position: "bottom" });
  });
};

// Auto-fetch Active List on mount
onMounted(() => merchantTypeActiveList());
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
