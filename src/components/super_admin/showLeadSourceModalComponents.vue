<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitModalClose"
    transition-show="slide"
    transition-hide="slide"
    class="customModalOverlay"
  >
    <q-card style="min-width:40vw; min-height:100vh; padding:25px; padding-top:60px">

      <!-- Header -->
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col">
          <div class="q-title text-weight-regular">Manage Lead Source</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9">
        <q-tab name="tab-1" label="Active List" @click="leadSourceActiveList" />
        <q-tab name="tab-2" label="De-Activated List" @click="leadSourceDeActiveList" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Active List Tab -->
        <q-tab-panel name="tab-1">
          <q-table
            :rows="activeLeadSourceList"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row q-pa-sm">
                <div class="col-8">
                  <q-search
                    v-model="activeFilterSearch"
                    placeholder="Search lead source"
                    clearable
                    dense
                    outlined
                  />
                </div>
                <div class="col-4" align="right">
                  <q-btn
                    no-caps
                    no-wrap
                    label="Add New"
                    class="text-weight-regular"
                    color="purple-9"
                    icon="far fa-plus-square"
                    @click="leadSourceCreate"
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
                  @click="leadSourceEdit(props.row)"
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
                  @click="leadSourceDisable(props.row.id)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- De-Activated List Tab -->
        <q-tab-panel name="tab-2">
          <q-table
            :rows="deActiveLeadSourceList"
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
                  @click="fnEnableLeadSource(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Lead Source Modal -->
      <show-create-lead-source
        v-if="propShowCreateLeadSource"
        :prop-show-create-lead-source="propShowCreateLeadSource"
        @emitfnshowLeadSources="leadSourceCreate"
      />

      <!-- Edit Lead Source Modal -->
      <show-edit-lead-source
        v-if="propShowEditLeadSource"
        :prop-show-edit-lead-sources="propShowEditLeadSource"
        :prop-row-details="propRowDetails"
        @emitfnshowLeadSources="refreshLeadSourceList"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showCreateLeadSource from "./createLeadSource.vue";
import showEditLeadSource from "./editLeadSource.vue";

// Props & Emits
const props = defineProps({ propToggleModal: Boolean });
const emit = defineEmits(["emitToggleModal"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleModal);
const activeTab = ref("tab-1");

const activeLeadSourceList = ref([]);
const deActiveLeadSourceList = ref([]);
const activeFilterSearch = ref("");
const deActivatedFilterSearch = ref("");
const paginationControl = ref({ rowsPerPage: 5 });

const propShowCreateLeadSource = ref(false);
const propShowEditLeadSource = ref(false);
const propRowDetails = ref(null);

// Table Columns
const activatedColumns = ref([
  { name: "sourceName", label: "Lead source", align: "left", field: "sourceName", sortable: false },
  { name: "action", label: "", align: "left", field: "action", sortable: false }
]);

const deActivatedColumns = ref([
  { name: "sourceName", label: "Lead source", align: "left", field: "sourceName", sortable: false },
  { name: "action", label: "", align: "left", field: "action", sortable: false }
]);

// Close modal
const emitModalClose = () => emit("emitToggleModal");

// Fetch Active Lead Sources
const leadSourceActiveList = async () => {
  await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
  activeLeadSourceList.value = store.getters.getActiveLeadSource;
};

// Fetch Deactivated Lead Sources
const leadSourceDeActiveList = async () => {
  await store.dispatch("leadSource/LEAD_SOURCE_DEACTIVED_LIST");
  deActiveLeadSourceList.value = store.getters.getDeActivatedLeadSource;
};

// Create Lead Source
const leadSourceCreate = (token) => {
  propShowCreateLeadSource.value = !propShowCreateLeadSource.value;
  if (token === "refresh") leadSourceActiveList();
};

// Edit Lead Source
const leadSourceEdit = (rowDetails) => {
  propShowEditLeadSource.value = !propShowEditLeadSource.value;
  propRowDetails.value = rowDetails;
};

// Refresh list after edit
const refreshLeadSourceList = () => {
  propShowEditLeadSource.value = false;
  leadSourceActiveList();
};

// Disable Lead Source
const leadSourceDisable = (rowId) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to disable lead source?",
    ok: "Continue",
    cancel: "Cancel"
  })
  .onOk(async () => {
    $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
    try {
      await store.dispatch("leadSource/DELETE_LEAD_SOURCE_AND_SET_ACTIVE", rowId);
      $q.notify({ color: "negative", message: "Lead source deactivated", icon: "thumb_up", position: "bottom" });
      leadSourceActiveList();
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

// Enable Lead Source
const fnEnableLeadSource = (rowDetails) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to enable lead source?",
    ok: "Continue",
    cancel: "Cancel"
  })
  .onOk(async () => {
    $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
    try {
      await store.dispatch("leadSource/UPDATE_LEAD_SOURCE_AND_SET_ACTIVE", rowDetails);
      $q.notify({ color: "positive", message: `Lead source: ${rowDetails.sourceName} has been enabled`, icon: "thumb_up", position: "bottom" });
      leadSourceDeActiveList();
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

// On mounted, fetch active list
onMounted(() => leadSourceActiveList());
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
