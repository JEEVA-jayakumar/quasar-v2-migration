<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    no-backdrop-dismiss
    position="right"
    class="customModalOverlay"
    :content-css="{ padding:'25px', paddingTop:'60px', minWidth:'40vw', minHeight:'100vh' }"
    @escape-key="emitToggleModal"
  >
    <q-card flat>
      <!-- Header -->
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col q-title text-weight-regular">Manage Prefix</div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="close" @click="emitToggleModal"/>
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="selectedTab" color="grey-9">
        <q-tab name="tab-1" label="Active List" @click="leadSourceActiveList" />
        <q-tab name="tab-2" label="De-Activated List" @click="leadSourceDeActiveList" />
      </q-tabs>

      <!-- Active List Table -->
      <q-tab-panels v-model="selectedTab">
        <q-tab-panel name="tab-1">
          <q-table
            :rows="activeLeadSourceList"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row items-center q-my-sm">
                <div class="col-8">
                  <q-input
                    filled
                    v-model="activeFilterSearch"
                    debounce="300"
                    placeholder="Search lead source"
                    clearable
                  />
                </div>
                <div class="col-4 text-right">
                  <q-btn
                    color="purple-9"
                    label="Add Prefix"
                    icon="add"
                    @click="fnCreatePrefix()"
                    class="q-ml-sm"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  flat
                  dense
                  color="info"
                  label="Modify"
                  icon="edit"
                  @click="leadSourceEdit(props.row)"
                  class="text-light-blue"
                />
                <q-btn
                  flat
                  dense
                  color="negative"
                  label="Disable"
                  icon="block"
                  class="q-ml-sm"
                  @click="leadSourceDisable(props.row.id)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- De-Activated List Table -->
        <q-tab-panel name="tab-2">
          <q-table
            :rows="deActiveLeadSourceList"
            :columns="deActivatedColumns"
            row-key="id"
            :filter="deActivatedFilterSearch"
            v-model:pagination="paginationControl"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row items-center q-my-sm">
                <div class="col">
                  <q-input
                    filled
                    v-model="deActivatedFilterSearch"
                    debounce="300"
                    placeholder="Search by name"
                    clearable
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <q-btn
                flat
                dense
                color="positive"
                label="Enable"
                icon="check"
                @click="fnEnableLeadSource(props.row)"
              />
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Prefix Modal -->
      <show-create-prefix
        v-if="propShowCreatePrefix"
        :prop-show-create-prefix="propShowCreatePrefix"
        @emitfnshowPrefix="fnCreatePrefix"
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

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import ShowCreatePrefix from "./CreatePrefix.vue";
import ShowEditLeadSource from "./editLeadSource.vue";

export default {
  name: "ManagePrefix",
  components: { ShowCreatePrefix, ShowEditLeadSource },
  props: {
    propToggleModal: { type: Boolean, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const toggleModal = ref(props.propToggleModal);
    const selectedTab = ref("tab-1");

    const propShowCreatePrefix = ref(false);
    const propShowEditLeadSource = ref(false);
    const propRowDetails = ref(null);

    const activeLeadSourceList = ref([]);
    const deActiveLeadSourceList = ref([]);

    const activeFilterSearch = ref("");
    const deActivatedFilterSearch = ref("");
    const paginationControl = ref({ rowsPerPage: 5 });

    const activatedColumns = [
      { name: "sourceName", label: "Lead Source", align: "left", field: "sourceName", sortable: false },
      { name: "action", label: "", align: "left", field: "action", sortable: false }
    ];

    const deActivatedColumns = [
      { name: "sourceName", label: "Lead Source", align: "left", field: "sourceName", sortable: false },
      { name: "action", label: "", align: "left", field: "action", sortable: false }
    ];

    // Load Active Lead Sources
    const leadSourceActiveList = async () => {
      await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
      activeLeadSourceList.value = store.getters["leadSource/getActiveLeadSource"];
    };

    // Load De-Activated Lead Sources
    const leadSourceDeActiveList = async () => {
      await store.dispatch("leadSource/LEAD_SOURCE_DEACTIVED_LIST");
      deActiveLeadSourceList.value = store.getters["leadSource/getDeActivatedLeadSource"];
    };

    const fnCreatePrefix = (token) => {
      propShowCreatePrefix.value = !propShowCreatePrefix.value;
      if (token === "refresh") leadSourceActiveList();
    };

    const leadSourceEdit = (rowDetails) => {
      propShowEditLeadSource.value = !propShowEditLeadSource.value;
      propRowDetails.value = rowDetails;
    };

    const refreshLeadSourceList = () => {
      propShowEditLeadSource.value = !propShowEditLeadSource.value;
      leadSourceActiveList();
    };

    const leadSourceDisable = (id) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to disable lead source?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" });
        try {
          await store.dispatch("leadSource/DELETE_LEAD_SOURCE_AND_SET_ACTIVE", id);
          await leadSourceActiveList();
          $q.notify({ color: "negative", message: "Lead source deactivated", icon: "thumb_up", position: "bottom" });
        } catch {
          $q.notify({ color: "warning", message: "Please try again!", icon: "thumb_down", position: "bottom" });
        } finally {
          $q.loading.hide();
        }
      });
    };

    const fnEnableLeadSource = (rowDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to enable lead source?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" });
        try {
          await store.dispatch("leadSource/UPDATE_LEAD_SOURCE_AND_SET_ACTIVE", rowDetails);
          await leadSourceDeActiveList();
          $q.notify({
            color: "positive",
            message: `Lead source: ${rowDetails.sourceName} has been enabled`,
            icon: "thumb_up",
            position: "bottom"
          });
        } catch {
          $q.notify({ color: "warning", message: "Please try again!", icon: "thumb_down", position: "bottom" });
        } finally {
          $q.loading.hide();
        }
      });
    };

    const emitToggleModal = () => emit("emitToggleModal");

    onMounted(() => {
      leadSourceActiveList();
    });

    return {
      toggleModal,
      selectedTab,
      propShowCreatePrefix,
      propShowEditLeadSource,
      propRowDetails,
      activeLeadSourceList,
      deActiveLeadSourceList,
      activeFilterSearch,
      deActivatedFilterSearch,
      paginationControl,
      activatedColumns,
      deActivatedColumns,
      leadSourceActiveList,
      leadSourceDeActiveList,
      fnCreatePrefix,
      leadSourceEdit,
      refreshLeadSourceList,
      leadSourceDisable,
      fnEnableLeadSource,
      emitToggleModal
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  max-height: 100vh;
}
</style>
