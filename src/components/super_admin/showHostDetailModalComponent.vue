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
          <div class="q-title text-weight-regular">Manage Host</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9">
        <q-tab name="tab-1" label="Host List" @click="loadHostList" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Host List Tab -->
        <q-tab-panel name="tab-1">
          <q-table
            :rows="tableData"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            color="grey-9"
            :loading="loading"
          >
            <template v-slot:top>
              <div class="row q-pa-sm">
                <div class="col-8">
                  <q-search
                    v-model="activeFilterSearch"
                    placeholder="Search host"
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
                    @click="hostCreate"
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
                  @click="hostEdit(props.row)"
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
                  @click="hostDisable(props.row.id)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Host Modal -->
      <show-create-host
        v-if="propShowCreateHost"
        :prop-show-create-host="propShowCreateHost"
        @emitfnshowHost="hostCreate"
      />

      <!-- Edit Host Modal -->
      <show-edit-host
        v-if="propShowEditHost"
        :prop-show-edit-host="propShowEditHost"
        :prop-row-details="propRowDetails"
        @emitfnshowHost="refreshHostList"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showCreateHost from "./createHost.vue";
import showEditHost from "./editHost.vue";

// Props & Emits
const props = defineProps({ propToggleModal: Boolean });
const emit = defineEmits(["emitToggleModal"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleModal);
const activeTab = ref("tab-1");

const tableData = ref([]);
const activeFilterSearch = ref("");
const loading = ref(false);

const propShowCreateHost = ref(false);
const propShowEditHost = ref(false);
const propRowDetails = ref(null);

// Table Columns
const activatedColumns = ref([
  { name: "name", label: "Name", align: "left", field: "name", sortable: false },
  { name: "action", label: "", align: "left", field: "action", sortable: false }
]);

// Close modal
const emitModalClose = () => emit("emitToggleModal");

// Load all hosts
const loadHostList = async () => {
  loading.value = true;
  try {
    await store.dispatch("Host/GET_HOST_DETAILS");
    tableData.value = store.getters.getAllHostDetails;
  } catch {
    $q.notify({ color: "negative", message: "Failed to load hosts", icon: "warning", position: "bottom" });
  } finally {
    loading.value = false;
  }
};

// Create Host
const hostCreate = (token) => {
  propShowCreateHost.value = !propShowCreateHost.value;
  if (token === "refresh") loadHostList();
};

// Edit Host
const hostEdit = (rowDetails) => {
  propShowEditHost.value = !propShowEditHost.value;
  propRowDetails.value = rowDetails;
};

// Refresh list after edit
const refreshHostList = () => {
  propShowEditHost.value = false;
  loadHostList();
};

// Disable Host
const hostDisable = (rowId) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to disable this host?",
    ok: "Continue",
    cancel: "Cancel"
  })
  .onOk(async () => {
    $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
    try {
      await store.dispatch("Host/DELETE_HOST", rowId);
      $q.notify({ color: "negative", message: "Host deactivated", icon: "thumb_up", position: "bottom" });
      loadHostList();
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

// Load hosts on mounted
onMounted(() => loadHostList());
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
