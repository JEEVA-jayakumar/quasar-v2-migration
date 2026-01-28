<template>
  <q-page>
    <div>
      <div class="col-12 q-title q-my-lg text-weight-regular">Spare Parts Types</div>

      <!-- Tabs -->
      <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" dense>
        <q-tab name="active" label="Active" color="dark" />
        <q-tab name="deactive" label="Deactive" color="dark" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated keep-alive>

        <!-- Active Tab -->
        <q-tab-panel name="active">
          <q-table
            :data="activeTableData"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template #top>
              <div class="row q-mb-md">
                <div class="col-6">
                  <q-search
                    v-model="filterSearch"
                    placeholder="Type.."
                    clearable
                    color="grey-9"
                  />
                </div>
                <div class="col-6 text-right">
                  <q-btn
                    label="Add Spare Type"
                    color="purple-9"
                    size="md"
                    no-caps
                    class="text-weight-regular"
                    @click="fnShowAddNewSpareParts()"
                  />
                </div>
              </div>
            </template>

            <template #body-cell-created_date="props">
              {{ formatDate(props.row.created_date) }}
            </template>

            <template #body-cell-updated_date="props">
              {{ formatDate(props.row.updated_date) }}
            </template>

            <template #body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Modify"
                  icon="far fa-plus-square"
                  flat
                  class="text-light-blue"
                  @click="fnShowEditSpareParts(props.row)"
                />
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Disable"
                  icon="far fa-minus-square"
                  flat
                  class="text-negative"
                  @click="fnDeleteSpareParts(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Deactive Tab -->
        <q-tab-panel name="deactive">
          <q-table
            :data="deActiveTableData"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            table-class="customSATableClass"
            color="grey-9"
          >
            <template #top>
              <div class="row q-mb-md">
                <div class="col-6">
                  <q-search
                    v-model="filterSearch"
                    placeholder="Type.."
                    clearable
                    color="grey-9"
                  />
                </div>
              </div>
            </template>

            <template #body-cell-created_date="props">
              {{ formatDate(props.row.created_date) }}
            </template>

            <template #body-cell-updated_date="props">
              {{ formatDate(props.row.updated_date) }}
            </template>

            <template #body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  no-caps
                  no-wrap
                  label="Active"
                  icon="far fa-minus-square"
                  flat
                  class="text-positive"
                  @click="fnShowActiveSpareparts(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

      </q-tab-panels>

      <!-- Show Edit Spare Parts -->
      <showEditSpareParts
        v-if="propShowEditSpareParts"
        :propShowEditSpareParts="propShowEditSpareParts"
        :propRowDetails="propRowDetails"
        @emitfnshowEditSpareParts="fnShowEditSpareParts"
      />

      <!-- Show Add Spare Parts -->
      <ShowAddSpareParts
        v-if="propShowAddSpareParts"
        :propShowAddSpareParts="propShowAddSpareParts"
        :propRowDetails="propRowDetails"
        @emitfnShowAddNewSpareParts="fnShowAddNewSpareParts"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import ShowAddSpareParts from '../../components/super_admin/ShowAddSpareParts.vue'
import showEditSpareParts from '../../components/super_admin/showEditSpareParts.vue'
import dayjs from 'dayjs'

/* ---------------------------
   State
--------------------------- */
const store = useStore()
const $q = useQuasar()
const activeTab = ref('active')
const filterSearch = ref('')
const propShowAddSpareParts = ref(false)
const propShowEditSpareParts = ref(false)
const propRowDetails = ref(null)
const paginationControl = ref({ rowsPerPage: 10 })

/* ---------------------------
   Columns
--------------------------- */
const columns = [
  { name: 'id', label: 'ID', align: 'left', field: row => row.id, sortable: true },
  { name: 'spare_parts_types', label: 'Spare Parts Types', align: 'left', field: 'spare_parts_types' },
  { name: 'created_date', label: 'Created Date', align: 'left', field: 'created_date', sortable: true },
  { name: 'updated_date', label: 'Updated Date', align: 'left', field: 'updated_date', sortable: true },
  { name: 'is_active', label: 'Is Active', align: 'left', field: 'is_active' },
  { name: 'action', label: '', align: 'left', field: 'action' }
]

/* ---------------------------
   Table Data
--------------------------- */
const activeTableData = ref([])
const deActiveTableData = ref([])

/* ---------------------------
   Vuex Getters
--------------------------- */
const getSparePartsTypes = computed(() => store.getters['sparePartsGetTypes/getsparePartsGetTypes'])

/* ---------------------------
   Lifecycle
--------------------------- */
onMounted(() => {
  fetchSparePartsData()
})

/* ---------------------------
   Methods
--------------------------- */
const fetchSparePartsData = async () => {
  await store.dispatch('sparePartsGetTypes/FETCH_SPARE_PARTS_GET_TYPES')
  const data = getSparePartsTypes.value || []
  activeTableData.value = data.filter(row => row.is_active)
  deActiveTableData.value = data.filter(row => !row.is_active)
}

const fnDeleteSpareParts = async row => {
  try {
    await store.dispatch('sparePartsGetTypes/DELETE_SPARE_PARTS_TYPES', row)
    await fetchSparePartsData()
    $q.notify({ color: 'positive', message: 'Successfully removed', icon: 'thumb_up' })
  } catch {
    $q.notify({ color: 'negative', message: 'No changes made!', icon: 'thumb_down' })
  }
}

const fnShowActiveSpareparts = async row => {
  const payload = { ...row, is_active: true }
  try {
    await store.dispatch('sparePartsGetTypes/ACTIVE_SPARE_PARTS_TYPES', payload)
    await fetchSparePartsData()
    $q.notify({ color: 'positive', message: 'Successfully Activated', icon: 'thumb_up' })
  } catch {
    $q.notify({ color: 'negative', message: 'No changes made!', icon: 'thumb_down' })
  }
}

const fnShowAddNewSpareParts = row => {
  propShowAddSpareParts.value = !propShowAddSpareParts.value
  propRowDetails.value = row
}

const fnShowEditSpareParts = row => {
  propShowEditSpareParts.value = !propShowEditSpareParts.value
  propRowDetails.value = row
}

const formatDate = date => dayjs(date).format('D MMM YYYY')

const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  return rows.filter(row =>
    cols.some(col => String(cellValue(col, row)).toLowerCase().includes(lowerTerms))
  )
}
</script>

<style scoped>
</style>
