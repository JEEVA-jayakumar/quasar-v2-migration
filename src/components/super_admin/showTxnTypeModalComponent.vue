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
          <div class="q-title text-weight-regular">Manage VAS</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" color="grey-9" class="q-mb-md">
        <q-tab name="tab-1" label="Active Vas List" @click="loadActiveVas" />
        <!-- <q-tab name="tab-2" label="Deactive Vas List" @click="loadDeActiveVas" /> -->
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Active VAS List -->
        <q-tab-panel name="tab-1">
          <q-table
            :rows="tableData"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            table-class="customSATableClass"
          >
            <template v-slot:top>
              <div class="row q-pa-sm items-center">
                <div class="col-8">
                  <q-input
                    v-model="activeFilterSearch"
                    clearable
                    color="grey-9"
                    placeholder="Type.."
                    float-label="Search VAS"
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
                    @click="vasCreate"
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
                  @click="vasEdit(props.row)"
                />
                <!-- Uncomment for Disable button
                <q-btn
                  dense
                  flat
                  no-caps
                  no-wrap
                  label="Disable"
                  icon="far fa-minus-square"
                  class="text-negative"
                  @click="hostDisable(props.row.id)"
                /> -->
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Deactive VAS List (Optional) -->
        <!-- <q-tab-panel name="tab-2"> ... </q-tab-panel> -->
      </q-tab-panels>

      <!-- Modals -->
      <showVasCreate
        v-if="propShowVasCreate"
        :propShowVasCreate="propShowVasCreate"
        @emitfnshowVas="vasCreate"
      />
      <showEditVas
        v-if="propShowEditVas"
        :propShowEditVas="propShowEditVas"
        :propRowDetails="propRowDetails"
        @emitfnshowVas="refreshVasEdit"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref , watch } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"

import showEditVas from "./vasEdit.vue"
import showVasCreate from "./vasCreate.vue"

// Props & Emits
const props = defineProps({ propToggleModal: Boolean })
const emit = defineEmits(["emitToggleModal"])

// Quasar & Store
const $q = useQuasar()
const store = useStore()
const GET_ALL_VAS_DETAILS = () => store.dispatch("vasCreation/GET_ALL_VAS_DETAILS")

// Reactive State
const toggleModal = ref(props.propToggleModal)
const tableData = ref([])
const activeFilterSearch = ref("")
const activeTab = ref("tab-1")
const propShowVasCreate = ref(false)
const propShowEditVas = ref(false)
const propRowDetails = ref(null)

const activatedColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: false },
  { name: "action", label: "", field: "action", align: "left", sortable: false }
]

// Watch propToggleModal
watch(() => props.propToggleModal, val => toggleModal.value = val)

// ---------------- Methods ----------------
const emitModalClose = () => emit("emitToggleModal")

const ajaxLoadAllLeadInfo = async () => {
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." })
  try {
    await GET_ALL_VAS_DETAILS()
    tableData.value = store.getters["vasCreation/getAllVasDetails"]
  } catch (e) {
    console.error(e)
  } finally {
    $q.loading.hide()
  }
}

const loadActiveVas = () => {
  ajaxLoadAllLeadInfo()
}

// const loadDeActiveVas = async () => { ... }

const vasCreate = (token) => {
  propShowVasCreate.value = !propShowVasCreate.value
  if (token === "refresh") ajaxLoadAllLeadInfo()
}

const vasEdit = (rowDetails) => {
  propRowDetails.value = rowDetails
  propShowEditVas.value = !propShowEditVas.value
}

const refreshVasEdit = () => {
  propShowEditVas.value = false
  ajaxLoadAllLeadInfo()
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
