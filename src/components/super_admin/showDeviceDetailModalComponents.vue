<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    no-backdrop-dismiss
    transition-show="slide"
    transition-hide="slide"
  >
    <q-card class="customModalOverlay" style="padding:60px 25px; min-width:40vw; min-height:100vh">

      <!-- Header -->
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col">
          <div class="text-h6 text-weight-regular">Manage Devices</div>
        </div>
        <div class="col-auto">
          <q-btn round flat outline color="dark" size="sm" icon="clear" @click="emitModalClose" />
        </div>
      </q-card-section>

      <!-- Table & Actions -->
      <q-card-section>
        <div class="row items-center q-mb-md">
          <div class="col-8">
            <q-input
              v-model="filterSearch"
              outlined
              dense
              clearable
              placeholder="Type.."
              label="Search by name, short name"
              color="grey-9"
            />
          </div>
          <div class="col-4 text-right">
            <q-btn
              label="Add New"
              color="purple-9"
              icon="far fa-plus-square"
              class="text-weight-regular"
              @click="fnShowCreateDeviceType"
            />
          </div>
        </div>

        <q-table
          :rows="getAllDevicesInfo"
          :columns="columns"
          row-key="id"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          flat
        >
          <template v-slot:body-cell-action="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                flat
                color="light-blue"
                no-caps
                no-wrap
                label="Modify"
                icon="far fa-plus-square"
                size="md"
                @click="fnShowEditDeviceType(props.row)"
              />
              <q-btn
                dense
                flat
                color="negative"
                no-caps
                no-wrap
                label="Disable"
                icon="far fa-minus-square"
                size="md"
                @click="fnDeleteDeviceType(props.row.id)"
              />
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- Modals for create/edit device -->
      <show-create-device-type
        v-if="propShowCreateDeviceTypes"
        :prop-show-create-device-types="propShowCreateDeviceTypes"
        @emitfnshow-device-types="fnShowCreateDeviceType"
        @emitfn-for-device-type-table="ajaxLoadDataForDeviceTypeTable"
      />
      <show-edit-device-type
        v-if="propShowEditDeviceTypes"
        :prop-show-edit-device-types="propShowEditDeviceTypes"
        :prop-row-details="propRowDetails"
        @emitfnshow-device-types="fnShowEditDeviceType"
        @emitfn-for-device-type-table="ajaxLoadDataForDeviceTypeTable"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"

import ShowCreateDeviceType from "../../components/super_admin/ShowCreateDeviceTypes.vue"
import ShowEditDeviceType from "../../components/super_admin/ShowEditDeviceTypes.vue"

// ---------------- Props & Emits ----------------
const props = defineProps({
  propToggleModal: { type: Boolean, default: false }
})
const emit = defineEmits(["emitToggleModal"])

// ---------------- State ----------------
const $q = useQuasar()
const store = useStore()

const toggleModal = ref(props.propToggleModal)
watch(() => props.propToggleModal, val => toggleModal.value = val)

const filterSearch = ref("")

const propShowCreateDeviceTypes = ref(false)
const propShowEditDeviceTypes = ref(false)
const propRowDetails = ref(null)

const paginationControl = ref({
  page: 1,
  rowsPerPage: 5
})

// Table Columns
const columns = [
  { name: "deviceType", label: "Device Type", align: "left", field: "deviceName", sortable: true },
  { name: "action", label: "", align: "right", field: "action", sortable: false }
]

// ---------------- Vuex Getters & Actions ----------------
const getAllDevicesInfo = store.getters["SA_Devices/getAllDevicesInfo"]

const FETCH_DEVICES_DATA = () => store.dispatch("SA_Devices/FETCH_DEVICES_DATA")
const DELETE_DEVICE_DATA = (id) => store.dispatch("SA_Devices/DELETE_DEVICE_DATA", id)

// ---------------- Methods ----------------
const emitModalClose = () => {
  emit("emitToggleModal")
}

// Load table data
const ajaxLoadDataForDeviceTypeTable = () => {
  FETCH_DEVICES_DATA()
}

// Create / Edit toggle
const fnShowCreateDeviceType = () => {
  propShowCreateDeviceTypes.value = !propShowCreateDeviceTypes.value
}
const fnShowEditDeviceType = (rowDetails) => {
  propShowEditDeviceTypes.value = !propShowEditDeviceTypes.value
  propRowDetails.value = rowDetails
}

// Delete Device
const fnDeleteDeviceType = (id) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to delete device type?",
    cancel: true,
    ok: true
  }).onOk(async () => {
    $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" })
    try {
      await DELETE_DEVICE_DATA(id)
      await FETCH_DEVICES_DATA()
      $q.notify({ color: "positive", position: "bottom", message: "Successfully removed", icon: "thumb_up" })
    } catch {
      $q.notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" })
    } finally {
      $q.loading.hide()
    }
  }).onCancel(() => {
    $q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" })
  })
}

// Custom search filter
const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ""
  return rows.filter(row =>
    cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
  )
}

// ---------------- Initial Load ----------------
ajaxLoadDataForDeviceTypeTable()
</script>

<style scoped>
.customModalOverlay {
  border-radius: 8px;
}
</style>
