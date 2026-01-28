<template>
  <!-- CHANGE: q-modal to q-dialog -->
  <q-dialog
    v-model="toggleModal"
    persistent
    class="customModalOverlay"
    :maximized="false"
  >
    <q-card style="padding: 25px; padding-top: 60px; min-width: 40vw; min-height: 100vh; max-height: 90vh; overflow-y: auto">
      <!-- Modal Header -->
      <div class="row items-center bottom-border q-py-sm">
        <div class="col">
          <div class="q-title text-weight-regular">Manage Lead Sources</div>
        </div>
        <div class="col text-right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </div>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9" class="q-mt-md">
        <q-tab name="tab-1" label="Active List" @click="leadSourceActiveList" />
        <q-tab name="tab-2" label="De-Actived List" @click="leadSourceDeActiveList" />
      </q-tabs>

      <!-- Active Lead Sources Table -->
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="tab-1">
          <div class="row items-center q-mb-md">
            <div class="col-8">
              <q-input
                dense
                clearable
                v-model="activeFilterSearch"
                placeholder="Type.."
                label="Search Lead Source"
              />
            </div>
            <div class="col-4 text-right">
              <q-btn
                no-caps
                label="Add New"
                class="text-weight-regular"
                color="purple-9"
                icon="far fa-plus-square"
                @click="leadSourceCreate()"
              />
            </div>
          </div>

          <q-table
            :rows="getActiveLeadSource"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template #body-cell-action="props">
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

        <!-- Deactivated Lead Sources Table -->
        <q-tab-panel name="tab-2">
          <div class="row q-mb-md">
            <div class="col">
              <q-input
                dense
                clearable
                v-model="deActivatedFilterSearch"
                placeholder="Type.."
                label="Search by name"
                class="q-mr-lg"
              />
            </div>
          </div>

          <q-table
            :rows="deActiveLeadSourceList"
            :columns="deActivatedColumns"
            row-key="id"
            :filter="deActivatedFilterSearch"
            v-model:pagination="paginationControl"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template #body-cell-action="props">
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
    </q-card>

    <!-- Create Lead Source Component -->
    <showCreateLeadSource
      v-if="propShowCreateLeadSource"
      :propShowCreateLeadSource="propShowCreateLeadSource"
      @emitfnshowLeadSources="leadSourceCreate"
    />

    <!-- Edit Lead Source Component -->
    <showEditLeadSource
      v-if="propShowEditLeadSource"
      :propShowEditLeadSources="propShowEditLeadSource"
      :propRowDetails="propRowDetails"
      @emitfnshowLeadSources="refreshLeadSourceList"
    />
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import showCreateLeadSource from "./createLeadSource.vue";
import showEditLeadSource from "./editLeadSource.vue";

// Props
const props = defineProps({
  propToggleModal: Boolean
});

// Emits
const emit = defineEmits(["emitToggleModal"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModal = ref(props.propToggleModal);
const activeTab = ref("tab-1");

const propShowCreateLeadSource = ref(false);
const propShowEditLeadSource = ref(false);
const propRowDetails = ref(null);

const activeLeadSourceList = ref([]);
const deActiveLeadSourceList = ref([]);

const activeFilterSearch = ref("");
const deActivatedFilterSearch = ref("");
const paginationControl = ref({ rowsPerPage: 5 });

const activatedColumns = [
  { name: "sourceName", label: "Lead source", align: "left", field: "sourceName" },
  { name: "action", label: "", align: "left", field: "action" }
];
const deActivatedColumns = [
  { name: "sourceName", label: "Lead source", align: "left", field: "sourceName" },
  { name: "action", label: "", align: "left", field: "action" }
];

const getActiveLeadSource = ref([]);
const getDeActivatedLeadSource = ref([]);

// Watch prop to sync modal
watch(() => props.propToggleModal, (val) => {
  toggleModal.value = val;
});

// Load active list initially
onMounted(() => {
  leadSourceActiveList();
});

// Actions
const LEAD_SOURCE_ACTIVE_LIST = async () => {
  try {
    await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
    activeLeadSourceList.value = store.getters["leadSource/getActiveLeadSource"] || [];
    getActiveLeadSource.value = activeLeadSourceList.value;
  } catch (error) {
    console.error("Load active lead sources error:", error);
    activeLeadSourceList.value = [];
    getActiveLeadSource.value = [];
  }
};

const LEAD_SOURCE_DEACTIVED_LIST = async () => {
  try {
    await store.dispatch("leadSource/LEAD_SOURCE_DEACTIVED_LIST");
    deActiveLeadSourceList.value = store.getters["leadSource/getDeActivatedLeadSource"] || [];
    getDeActivatedLeadSource.value = deActiveLeadSourceList.value;
  } catch (error) {
    console.error("Load deactivated lead sources error:", error);
    deActiveLeadSourceList.value = [];
    getDeActivatedLeadSource.value = [];
  }
};

// Tab handlers
const leadSourceActiveList = () => LEAD_SOURCE_ACTIVE_LIST();
const leadSourceDeActiveList = () => LEAD_SOURCE_DEACTIVED_LIST();

const leadSourceCreate = (token) => {
  propShowCreateLeadSource.value = !propShowCreateLeadSource.value;
  if (token === "refresh") LEAD_SOURCE_ACTIVE_LIST();
};

const leadSourceEdit = (rowDetails) => {
  propShowEditLeadSource.value = !propShowEditLeadSource.value;
  propRowDetails.value = rowDetails;
};

const refreshLeadSourceList = () => {
  propShowEditLeadSource.value = false;
  LEAD_SOURCE_ACTIVE_LIST();
};

const leadSourceDisable = async (id) => {
  try {
    const confirm = await $q.dialog({
      title: "Confirm",
      message: "Are you sure want to disable lead source?",
      ok: {
        label: "Continue",
        color: "positive"
      },
      cancel: {
        label: "Cancel",
        color: "grey-9",
        flat: true
      },
      persistent: true
    });

    if (!confirm) {
      $q.notify({ 
        color: "negative", 
        message: "No changes made!", 
        icon: "thumb_down" 
      });
      return;
    }

    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "purple-9",
      customClass: "shadow-none"
    });

    await store.dispatch("leadSource/DELETE_LEAD_SOURCE_AND_SET_ACTIVE", id);
    LEAD_SOURCE_ACTIVE_LIST();
    
    $q.notify({ 
      color: "negative", 
      message: "Lead source deactivated", 
      icon: "thumb_up" 
    });
  } catch (error) {
    console.error("Disable lead source error:", error);
    $q.notify({ 
      color: "warning", 
      message: error?.message || "Please try again!", 
      icon: "thumb_down" 
    });
  } finally {
    $q.loading.hide();
  }
};

const fnEnableLeadSource = async (rowDetails) => {
  try {
    const confirm = await $q.dialog({
      title: "Confirm",
      message: "Are you sure want to enable lead source?",
      ok: {
        label: "Continue",
        color: "positive"
      },
      cancel: {
        label: "Cancel",
        color: "grey-9",
        flat: true
      },
      persistent: true
    });

    if (!confirm) {
      $q.notify({ 
        color: "negative", 
        message: "No changes made!", 
        icon: "thumb_down" 
      });
      return;
    }

    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "purple-9",
      customClass: "shadow-none"
    });

    await store.dispatch("leadSource/UPDATE_LEAD_SOURCE_AND_SET_ACTIVE", rowDetails);
    LEAD_SOURCE_DEACTIVED_LIST();
    
    $q.notify({
      color: "positive",
      message: `Lead source: ${rowDetails.sourceName} has been enabled`,
      icon: "thumb_up"
    });
  } catch (error) {
    console.error("Enable lead source error:", error);
    $q.notify({ 
      color: "warning", 
      message: error?.message || "Please try again!", 
      icon: "thumb_down" 
    });
  } finally {
    $q.loading.hide();
  }
};

const emitModalClose = () => {
  emit("emitToggleModal");
};
</script>

<style scoped>
.customModalOverlay {
  z-index: 7000 !important;
}

.bottom-border {
  border-bottom: 1px solid #ddd;
}

.q-title {
  font-size: 1.5rem;
  font-weight: 500;
}

/* Ensure proper scrolling */
.q-card {
  overflow-y: auto;
}
</style>