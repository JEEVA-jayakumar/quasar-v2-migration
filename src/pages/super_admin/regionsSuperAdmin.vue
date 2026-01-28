<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      dense
      class="shadow-1"
      active-color="dark"
      indicator-color="purple-9"
    >
      <q-tab name="active" label="Active Regions" />
      <q-tab name="deactive" label="Deactive Regions" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <!-- ACTIVE REGIONS -->
      <q-tab-panel name="active">
        <q-table
          :rows="activeTableData"
          :columns="columns"
          row-key="id"
          v-model:pagination="paginationControl"
          :filter="filterSearch"
          :filter-method="myCustomSearchFilter"
          class="customSATableClass"
        >
          <!-- Region Group -->
          <template v-slot:body-cell-regionGroup="{ row }">
            {{ row.regionGroup ? row.regionGroup.regionName : 'NA' }}
          </template>

          <!-- Actions -->
          <template v-slot:body-cell-action="{ row }">
            <div class="row no-wrap">
              <q-btn
                flat
                dense
                no-caps
                icon="edit"
                label="Modify"
                class="text-light-blue"
                @click="fnShowEditRegions(row)"
              />
              <q-btn
                flat
                dense
                no-caps
                icon="block"
                label="Disable"
                class="text-negative"
                @click="fnDeleteRegion(row)"
              />
            </div>
          </template>

          <!-- Top -->
          <template v-slot:top>
            <div class="row full-width items-center">
              <div class="col-6">
                <q-input
                  dense
                  outlined
                  debounce="300"
                  v-model="filterSearch"
                  placeholder="Type..."
                  clearable
                />
              </div>
              <div class="col-6 text-right">
                <q-btn
                  color="purple-9"
                  label="Add New Region"
                  no-caps
                  @click="fnShowAddNewRegions(null)"
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- DEACTIVE REGIONS -->
      <q-tab-panel name="deactive">
        <q-table
          :rows="deActiveTableData"
          :columns="columns1"
          row-key="id"
          v-model:pagination="paginationControl1"
          :filter="filterSearch1"
          :filter-method="myCustomSearchFilter"
          class="customSATableClass"
        >
          <template v-slot:body-cell-regionGroup="{ row }">
            {{ row.regionGroup ? row.regionGroup.regionName : 'NA' }}
          </template>

          <template v-slot:body-cell-action1="{ row }">
            <q-btn
              flat
              dense
              no-caps
              icon="check_circle"
              label="Activate"
              class="text-positive"
              @click="fnActiveRegion(row)"
            />
          </template>

          <template v-slot:top>
            <div class="row full-width">
              <div class="col-6">
                <q-input
                  dense
                  outlined
                  debounce="300"
                  v-model="filterSearch1"
                  placeholder="Type..."
                  clearable
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- MODALS -->
    <showCreateRegion
      v-if="propShowCreateRegions"
      :propShowCreateRegions="propShowCreateRegions"
      @emitfnshowRegions="fnshowCreateRegions"
      @emitfnForRegionTable="ajaxLoadDataForRegionTable"
    />

    <showEditRegion
      v-if="propShowEditRegions"
      :propShowEditRegions="propShowEditRegions"
      :propRowDetails="propRowDetails"
      @emitfnshowRegions="fnShowEditRegions"
    />

    <ShowAddNewRegions
      v-if="propShowAddNewRegions"
      :propShowAddNewRegions="propShowAddNewRegions"
      :propRowDetails="propRowDetails"
      @emitfnShowAddNewRegions="fnShowAddNewRegions"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import showCreateRegion from '../../components/super_admin/showCreateRegions.vue'
import showEditRegion from '../../components/super_admin/showEditRegions.vue'
import ShowAddNewRegions from '../../components/super_admin/ShowAddNewRegions.vue'

const $q = useQuasar()
const store = useStore()

const tab = ref('active')

const propShowCreateRegions = ref(false)
const propShowEditRegions = ref(false)
const propShowAddNewRegions = ref(false)
const propRowDetails = ref(null)

const filterSearch = ref('')
const filterSearch1 = ref('')

const paginationControl = ref({ rowsPerPage: 10 })
const paginationControl1 = ref({ rowsPerPage: 10 })

const columns = [
  { name: 'regionGroup', label: 'Region Group', field: row => row.regionGroup?.regionName, align: 'left' },
  { name: 'label', label: 'Region', field: 'regionAreaName', align: 'left' },
  { name: 'action', label: '', field: 'action' }
]

const columns1 = [
  { name: 'regionGroup', label: 'Region Group', field: row => row.regionGroup?.regionName, align: 'left' },
  { name: 'label', label: 'Region', field: 'regionAreaName', align: 'left' },
  { name: 'action1', label: '', field: 'action1' }
]

const allRegions = computed(() => store.getters['SuperAdminUsers/getAllRegionsData1'] || [])

const activeTableData = computed(() => allRegions.value.filter(r => r.active))
const deActiveTableData = computed(() => allRegions.value.filter(r => !r.active))

const ajaxLoadDataForRegionTable = async () => {
  try {
    $q.loading.show()
    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA1')
  } finally {
    $q.loading.hide()
  }
}

const fnshowCreateRegions = () => (propShowCreateRegions.value = !propShowCreateRegions.value)
const fnShowEditRegions = row => {
  propRowDetails.value = row
  propShowEditRegions.value = !propShowEditRegions.value
}
const fnShowAddNewRegions = row => {
  propRowDetails.value = row
  propShowAddNewRegions.value = !propShowAddNewRegions.value
}

const fnDeleteRegion = row => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to delete region?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await store.dispatch('SuperAdminUsers/DELETE_REGIONS_BY_REGIONS_ID_DATA', row)
    await ajaxLoadDataForRegionTable()
    $q.notify({ type: 'positive', message: 'Successfully removed' })
  })
}

const fnActiveRegion = row => {
  console.log('Activate region:', row)
}

const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lower = terms.toLowerCase()
  return rows.filter(row =>
    cols.some(col => String(cellValue(col, row)).toLowerCase().includes(lower))
  )
}

onMounted(ajaxLoadDataForRegionTable)
</script>
