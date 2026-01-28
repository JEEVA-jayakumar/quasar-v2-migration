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
          <div class="q-title text-weight-regular">Manage Mars Instance</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9">
        <q-tab name="tab-1" label="Active List" @click="marsInstanceActiveList" />
        <!-- Future Deactive Tab can be added here -->
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Active List Tab -->
        <q-tab-panel name="tab-1">
          <q-table
            :rows="activeMarsInstanceList"
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
                    placeholder="Search Mars Instance"
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
                    @click="marsInstanceCreate()"
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
                  @click="marsInstanceEdit(props.row)"
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
                  @click="marsInstanceDisable(props.row.id)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Instance Modal -->
      <show-create-mars-instance
        v-if="propShowCreateMarsInstance"
        :prop-show-create-mars-instance="propShowCreateMarsInstance"
        @emitfnshowMarsInstance="marsInstanceCreate"
      />

      <!-- Edit Instance Modal -->
      <show-edit-instance
        v-if="propShowEditMarsInstance"
        :prop-show-edit-mars-instance="propShowEditMarsInstance"
        :prop-row-details="propRowDetails"
        @emitfnshowMarsInstance="refreshMarsInstanceList"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showCreateMarsInstance from "./marsInstanceCreate.vue";
import showEditInstance from "./editMarsInstance.vue";

// Props & Emits
const props = defineProps({ propToggleModal: Boolean });
const emit = defineEmits(["emitToggleModal"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleModal);
const activeTab = ref("tab-1");

const activeMarsInstanceList = ref([]);
const activeFilterSearch = ref("");

const propShowCreateMarsInstance = ref(false);
const propShowEditMarsInstance = ref(false);
const propRowDetails = ref(null);


// Table Columns
const activatedColumns = ref([
  { name: "institutionName", label: "Institution Name", align: "left", field: "institutionName", sortable: false },
  { name: "action", label: "", align: "left", field: "action", sortable: false }
]);

// Close modal
const emitModalClose = () => emit("emitToggleModal");

// Fetch Mars Instances
const marsInstanceActiveList = async () => {
  await store.dispatch("MarsInstance/GET_MARS_INSTITUTION_DETAILS");
  activeMarsInstanceList.value = store.getters.getMarsInstanceDetails.filter(i => i.institutionActive);
};

// Open Create Instance Modal
const marsInstanceCreate = (token) => {
  propShowCreateMarsInstance.value = !propShowCreateMarsInstance.value;
  if (token === "refresh") marsInstanceActiveList();
};

// Open Edit Instance Modal
const marsInstanceEdit = (rowDetails) => {
  propShowEditMarsInstance.value = !propShowEditMarsInstance.value;
  propRowDetails.value = rowDetails;
};

// Refresh list after Edit
const refreshMarsInstanceList = () => {
  propShowEditMarsInstance.value = false;
  marsInstanceActiveList();
};

// Disable Instance
const marsInstanceDisable = (rowId) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to disable this instance?",
    ok: "Continue",
    cancel: "Cancel"
  })
  .onOk(async () => {
    $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
    try {
      await store.dispatch("MarsInstance/DELETE_INSTANCE", rowId);
      $q.notify({ color: "negative", message: "Instance deactivated", icon: "thumb_up", position: "bottom" });
      marsInstanceActiveList();
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



// On mounted, fetch active instances
onMounted(() => marsInstanceActiveList());
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
