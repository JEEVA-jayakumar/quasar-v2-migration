<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    no-backdrop-dismiss
    transition-show="slide"
    transition-hide="slide"
    class="customModalOverlay"
  >
    <q-card style="min-width:40vw; min-height:100vh; padding:25px; padding-top:60px">

      <!-- Header -->
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col">
          <div class="q-title text-weight-regular">Manage TID Group</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9" class="q-mb-md">
        <q-tab name="tab-1" label="Active List" @click="loadActiveList" />
        <q-tab name="tab-2" label="De-Activated List" @click="loadDeActiveList" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Active List -->
        <q-tab-panel name="tab-1">
          <q-table
            :rows="getActiveLeadSource"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template v-slot:top>
              <div class="row q-pa-sm items-center">
                <div class="col-8">
                  <q-input
                    v-model="activeFilterSearch"
                    clearable
                    color="grey-9"
                    placeholder="Type.."
                    float-label="Search lead source"
                    dense
                    outlined
                  />
                </div>
                <div class="col-4" align="right">
                  <q-btn
                    label="Add New"
                    color="purple-9"
                    icon="far fa-plus-square"
                    class="text-weight-regular"
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
                  class="text-negative"
                  @click="leadSourceDisable(props.row.id)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- De-Activated List -->
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
              <div class="col">
                <q-input
                  v-model="deActivatedFilterSearch"
                  clearable
                  color="grey-9"
                  placeholder="Type.."
                  float-label="Search by name"
                  class="q-mr-lg"
                  dense
                  outlined
                />
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <q-btn
                dense
                flat
                no-caps
                no-wrap
                label="Enable"
                icon="far fa-check-square"
                class="text-positive"
                @click="fnEnableLeadSource(props.row)"
              />
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create/Edit Modals -->
      <showCreateLeadSource
        v-if="propShowCreateLeadSource"
        :propShowCreateLeadSource="propShowCreateLeadSource"
        @emitfnshowLeadSources="leadSourceCreate"
      />

      <showEditLeadSource
        v-if="propShowEditLeadSource"
        :propShowEditLeadSources="propShowEditLeadSource"
        :propRowDetails="propRowDetails"
        @emitfnshowLeadSources="refreshLeadSourceList"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"

import showCreateLeadSource from "./createLeadSource.vue"
import showEditLeadSource from "./editLeadSource.vue"

// Props & Emits
const props = defineProps({ propToggleModal: Boolean })
const emit = defineEmits(["emitToggleModal"])

// Quasar & Store
const $q = useQuasar()
const store = useStore()

const LEAD_SOURCE_ACTIVE_LIST = () => store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST")
const LEAD_SOURCE_DEACTIVED_LIST = () => store.dispatch("leadSource/LEAD_SOURCE_DEACTIVED_LIST")
const UPDATE_LEAD_SOURCE_AND_SET_ACTIVE = (payload) => store.dispatch("leadSource/UPDATE_LEAD_SOURCE_AND_SET_ACTIVE", payload)
const DELETE_LEAD_SOURCE_AND_SET_ACTIVE = (payload) => store.dispatch("leadSource/DELETE_LEAD_SOURCE_AND_SET_ACTIVE", payload)

const getActiveLeadSource = store.getters["leadSource/getActiveLeadSource"]

// Reactive State
const toggleModal = ref(props.propToggleModal)
const activeTab = ref("tab-1")
const activeFilterSearch = ref("")
const deActivatedFilterSearch = ref("")
const paginationControl = ref({ rowsPerPage: 5 })

const propShowCreateLeadSource = ref(false)
const propShowEditLeadSource = ref(false)
const propRowDetails = ref(null)

const activatedColumns = [
  { name: "sourceName", label: "Lead source", field: "sourceName", align: "left", sortable: false },
  { name: "action", label: "", field: "action", align: "left", sortable: false }
]

const deActivatedColumns = [
  { name: "sourceName", label: "Lead source", field: "sourceName", align: "left", sortable: false },
  { name: "action", label: "", field: "action", align: "left", sortable: false }
]

// ---------------- Methods ----------------
watch(() => props.propToggleModal, val => toggleModal.value = val)

const emitModalClose = () => emit("emitToggleModal")

const loadActiveList = async () => {
  await LEAD_SOURCE_ACTIVE_LIST()
}

const loadDeActiveList = async () => {
  await LEAD_SOURCE_DEACTIVED_LIST()
}

const leadSourceCreate = (token) => {
  propShowCreateLeadSource.value = !propShowCreateLeadSource.value
  if (token === "refresh") loadActiveList()
}

const leadSourceEdit = (rowDetails) => {
  propRowDetails.value = rowDetails
  propShowEditLeadSource.value = !propShowEditLeadSource.value
}

const refreshLeadSourceList = () => {
  propShowEditLeadSource.value = false
  loadActiveList()
}

const leadSourceDisable = (rowId) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to disable lead source?",
    ok: "Continue",
    cancel: "Cancel"
  })
    .onOk(() => {
      $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" })
      DELETE_LEAD_SOURCE_AND_SET_ACTIVE(rowId)
        .then(() => {
          loadActiveList()
          $q.notify({ color: "negative", position: "bottom", message: "Lead source deactivated", icon: "thumb_up" })
        })
        .catch(() => $q.notify({ color: "warning", position: "bottom", message: "Please try again!", icon: "thumb_down" }))
        .finally(() => $q.loading.hide())
    })
    .onCancel(() => $q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" }))
}

const fnEnableLeadSource = (rowDetails) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to enable lead source?",
    ok: "Continue",
    cancel: "Cancel"
  })
    .onOk(() => {
      $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" })
      UPDATE_LEAD_SOURCE_AND_SET_ACTIVE(rowDetails)
        .then(() => {
          loadDeActiveList()
          $q.notify({ color: "positive", position: "bottom", message: `Lead source: ${rowDetails.sourceName} has been enabled`, icon: "thumb_up" })
        })
        .catch(() => $q.notify({ color: "warning", position: "bottom", message: "Please try again!", icon: "thumb_down" }))
        .finally(() => $q.loading.hide())
    })
    .onCancel(() => $q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" }))
}
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
  height: 100%;
}
.q-table .q-btn {
  min-width: 80px;
}
</style>
