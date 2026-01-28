<template>
  <q-page class="q-pa-md">

    <q-tabs
      v-model="activeTab"
      class="shadow-1"
      active-color="dark"
      indicator-color="purple-9"
    >
      <q-tab name="active" label="Active CS Sub Issue" />
      <q-tab name="deactive" label="Deactive CS Sub Issue" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>

      <!-- ACTIVE TAB -->
      <q-tab-panel name="active">
        <q-table
          :rows="ActivetableData"
          :columns="columnsActive"
          row-key="id"
          :filter="filterSearchActive"
          :pagination="paginationActive"
          @update:pagination="val => paginationActive = val"
          :filter-method="customFilter"
          class="customSATableClass"
        >

          <template v-slot:top>
            <div class="row full-width items-center">
              <q-input
                dense
                debounce="300"
                v-model="filterSearchActive"
                placeholder="Search by Issue Name"
                class="col-4 q-mr-md"
              />
              <q-space />
              <q-btn
                color="purple-9"
                label="Add Sub Task"
                @click="fnShowAddNewCsSubIssue()"
              />
            </div>
          </template>

          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>

          <template v-slot:body-cell-updatedAt="props">
            {{ formatDate(props.row.updatedAt) }}
          </template>

          <template v-slot:body-cell-action="props">
            <q-btn
              flat
              dense
              label="Modify"
              class="text-light-blue"
              @click="fnShowEditCsSubIssue(props.row)"
            />
            <q-btn
              flat
              dense
              label="Disable"
              class="text-negative"
              @click="fnDeleteCsSubIssue(props.row)"
            />
          </template>

        </q-table>
      </q-tab-panel>

      <!-- DEACTIVE TAB -->
      <q-tab-panel name="deactive">
        <q-table
          :rows="DeactivetableData"
          :columns="columnsDeactive"
          row-key="id"
          :filter="filterSearchDeactive"
          :pagination="paginationDeactive"
          @update:pagination="val => paginationDeactive = val"
          :filter-method="customFilter"
          class="customSATableClass"
        >

          <template v-slot:top>
            <q-input
              dense
              debounce="300"
              v-model="filterSearchDeactive"
              placeholder="Search by Issue Name"
              class="col-4"
            />
          </template>

          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>

          <template v-slot:body-cell-updatedAt="props">
            {{ formatDate(props.row.updatedAt) }}
          </template>

          <template v-slot:body-cell-action="props">
            <q-btn
              flat
              dense
              label="Activate"
              class="text-light-blue"
              @click="fnShowActiveCsSubIssue(props.row)"
            />
          </template>

        </q-table>
      </q-tab-panel>

    </q-tab-panels>

    <!-- Modals -->
    <ShowEditCSSubIssue
      v-if="showEdit"
      :propShowEditCsSubIssue="showEdit"
      :propRowDetails1="editRow"
      @emitfnshowEditCsSubIssue="toggleEdit"
    />

    <ShowAddCSSubIssue
      v-if="showAdd"
      :propShowAddCsSubIssue="showAdd"
      @emitfnShowAddNewCsSubIssue="toggleAdd"
    />

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

import ShowEditCSSubIssue from '../../components/super_admin/ShowEditCSSubIssue.vue'
import ShowAddCSSubIssue from '../../components/super_admin/ShowAddCSSubIssue.vue'

const $q = useQuasar()
const store = useStore()

/* ---------------- STATE ---------------- */
const activeTab = ref('active')

const showEdit = ref(false)
const showAdd = ref(false)
const editRow = ref(null)

const filterSearchActive = ref('')
const filterSearchDeactive = ref('')

let paginationActive = ref({ rowsPerPage: 10 })
let paginationDeactive = ref({ rowsPerPage: 10 })

/* ---------------- TABLE DATA ---------------- */
const ActivetableData = computed(() =>
  store.getters['serviceRequest/getcsActiveSubIssueDetails']
    ?.filter(i => i.active === true) || []
)

const DeactivetableData = computed(() =>
  store.getters['serviceRequest/getcsDeactiveSubIssueDetails']
    ?.filter(i => i.active === false) || []
)

/* ---------------- COLUMNS ---------------- */
const columnsActive = [
  { name: 'name', label: 'Issue Name', field: 'name', sortable: true },
  { name: 'createdAt', label: 'Created Date', field: 'createdAt', sortable: true },
  { name: 'updatedAt', label: 'Updated Date', field: 'updatedAt', sortable: true },
  { name: 'action', label: '', field: 'action' }
]

const columnsDeactive = [...columnsActive]

/* ---------------- METHODS ---------------- */
onMounted(loadData)

function loadData () {
  store.dispatch('serviceRequest/FETCH_ACTIVE_CS_SUB_ISSUE_DATAS')
  store.dispatch('serviceRequest/FETCH_DEACTIVE_CS_SUB_ISSUE_DATAS')
}

function toggleEdit (token) {
  showEdit.value = !showEdit.value
  if (token === 'refresh') loadData()
}

function toggleAdd (token) {
  showAdd.value = !showAdd.value
  if (token === 'refresh') loadData()
}

function fnShowEditCsSubIssue (row) {
  editRow.value = row
  showEdit.value = true
}

function fnShowAddNewCsSubIssue () {
  showAdd.value = true
}

function fnDeleteCsSubIssue (row) {
  confirmAction('Are you sure want to delete?', () =>
    store.dispatch('serviceRequest/DELETE_CS_SUB_ISSUE', row)
      .then(loadData)
  )
}

function fnShowActiveCsSubIssue (row) {
  confirmAction('Are you sure want to activate this issue?', () =>
    store.dispatch('serviceRequest/ACTIVE_CS_SUB_ISSUE', {
      id: row.id,
      request: row
    }).then(loadData)
  )
}

function confirmAction (message, action) {
  $q.dialog({ title: 'Confirm', message, ok: 'Continue', cancel: 'Cancel' })
    .onOk(async () => {
      $q.loading.show()
      await action()
      $q.loading.hide()
      $q.notify({ color: 'positive', message: 'Successfully Updated!' })
    })
}

function customFilter (rows, terms, cols, cellValue) {
  const search = terms?.toLowerCase() || ''
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(search)
    )
  )
}

function formatDate (date) {
  return dayjs(date).format('DD MMM YYYY')
}
</script>
