<template>
  <q-page class="q-pa-md">

    <!-- TABS -->
    <q-tabs
      v-model="activeTab"
      class="shadow-1"
      align="left"
      indicator-color="purple-9"
    >
      <q-tab name="tab-3" label="Active Service Status" />
      <q-tab name="tab-4" label="Deactive Service Status" />
    </q-tabs>

    <q-separator />

    <!-- TAB PANELS -->
    <q-tab-panels v-model="activeTab" animated>

      <!-- ACTIVE -->
      <q-tab-panel name="tab-3">
        <q-table
          :rows="ActivetableData"
          :columns="columnsActive"
          row-key="name"
          :filter="filterSearch"
          v-model:pagination="paginationActive"
          :filter-method="customFilter"
          class="customSATableClass"
        >

          <!-- TOP -->
          <template v-slot:top>
            <div class="row q-col-gutter-sm full-width">
              <div class="col-3">
                <q-input
                  dense
                  debounce="300"
                  clearable
                  v-model="filterSearch"
                  placeholder="Type.."
                />
              </div>

              <div class="col-3 text-right">
                <q-btn
                  color="purple-9"
                  label="Add Service Status"
                  @click="toggleAddServiceStatus"
                />
              </div>
            </div>
          </template>

          <!-- DATE FORMAT -->
          <template v-slot:body-cell-updatedDate="props">
            {{ formatDate(props.row.updatedDate) }}
          </template>

          <!-- ACTION -->
          <template v-slot:body-cell-action="props">
            <q-btn
              flat
              dense
              color="primary"
              label="Modify"
              @click="toggleEditServiceStatus(props.row)"
            />
            <q-btn
              flat
              dense
              color="negative"
              label="Disable"
              @click="deleteServiceStatus(props.row)"
            />
          </template>

        </q-table>
      </q-tab-panel>

      <!-- DEACTIVE -->
      <q-tab-panel name="tab-4">
        <q-table
          :rows="DeactivetableData"
          :columns="columnsDeactive"
          row-key="name"
          :filter="filterSearch3"
          v-model:pagination="paginationDeactive"
          :filter-method="customFilter"
          class="customSATableClass"
        >

          <template v-slot:top>
            <div class="col-3">
              <q-input
                dense
                debounce="300"
                clearable
                v-model="filterSearch3"
                placeholder="Type.."
              />
            </div>
          </template>

          <template v-slot:body-cell-updatedDate="props">
            {{ formatDate(props.row.updatedDate) }}
          </template>

          <template v-slot:body-cell-action1="props">
            <q-btn
              flat
              dense
              color="positive"
              label="Active"
              @click="activateServiceStatus(props.row)"
            />
          </template>

        </q-table>
      </q-tab-panel>

    </q-tab-panels>

    <!-- MODALS -->
    <ShowAddServiceStatus
      v-if="showAddServiceStatus"
      :propShowAddServiceStatus="showAddServiceStatus"
      @emitfnShowAddNewServiceStatus="toggleAddServiceStatus"
    />

    <ShowEditServiceStatus
      v-if="showEditServiceStatus"
      :propShowEditServiceStatus="showEditServiceStatus"
      :propRowDetails5="selectedRow"
      @emitfnShowEditNewServiceStatus="toggleEditServiceStatus"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import dayjs from 'dayjs'

import ShowAddServiceStatus from '../../components/super_admin/ShowAddServiceStatus.vue'
import ShowEditServiceStatus from '../../components/super_admin/ShowEditServiceStatus.vue'

/* CORE */
const $q = useQuasar()
const store = useStore()

/* STATE */
const activeTab = ref('tab-3')
const filterSearch = ref('')
const filterSearch3 = ref('')
const showAddServiceStatus = ref(false)
const showEditServiceStatus = ref(false)
const selectedRow = ref(null)

const paginationActive = ref({ rowsPerPage: 10, page: 1 })
const paginationDeactive = ref({ rowsPerPage: 10, page: 1 })

const ActivetableData = ref([])
const DeactivetableData = ref([])

/* COLUMNS */
const columnsActive = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'updatedDate', label: 'Updated Date', field: 'updatedDate', sortable: true },
  { name: 'action', label: '', field: 'action' }
]

const columnsDeactive = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'updatedDate', label: 'Updated Date', field: 'updatedDate', sortable: true },
  { name: 'action1', label: '', field: 'action1' }
]

/* METHODS */
const formatDate = date => dayjs(date).format('DD MMM YYYY')

const customFilter = (rows, terms, cols, getCellValue) => {
  const needle = terms.toLowerCase()
  return rows.filter(row =>
    cols.some(col =>
      String(getCellValue(col, row)).toLowerCase().includes(needle)
    )
  )
}

const loadServiceStatus = async () => {
  await store.dispatch('ServiceRequestStatus/FETCH_SERVICE_REQUEST_STATUS_DETAILS')
  const data = store.getters['ServiceRequestStatus/getserviceRequestStatusDetails']
  ActivetableData.value = data.filter(i => i.active)
  DeactivetableData.value = data.filter(i => !i.active)
}

const toggleAddServiceStatus = (refresh) => {
  showAddServiceStatus.value = !showAddServiceStatus.value
  if (refresh === 'refresh') loadServiceStatus()
}

const toggleEditServiceStatus = (row) => {
  showEditServiceStatus.value = !showEditServiceStatus.value
  selectedRow.value = row || null
  if (!showEditServiceStatus.value) loadServiceStatus()
}

const deleteServiceStatus = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    $q.loading.show()
    await store.dispatch('ServiceRequestStatus/DELETE_SERVICE_STATUS_TYPES', row)
    $q.loading.hide()
    loadServiceStatus()
  })
}

const activateServiceStatus = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to activate?',
    cancel: true
  }).onOk(async () => {
    $q.loading.show()
    await store.dispatch('ServiceRequestStatus/EDIT_SERVICE_STATUS_TYPES', {
      id: row.id,
      request: row
    })
    $q.loading.hide()
    loadServiceStatus()
  })
}

/* LIFECYCLE */
onMounted(loadServiceStatus)
</script>

<style scoped>
.customSATableClass {
  min-height: 300px;
}
</style>
