<template>
  <q-page>
    <div>

      <!-- Tabs -->
      <q-tabs
        v-model="activeTab"
        class="shadow-1"
        color="dark"
        align="left"
      >
        <q-tab name="active" label="Active RegionsGroups" />
      </q-tabs>

      <!-- Tab Panels -->
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="active">

          <q-table
            :rows="activeTableData"
            :columns="columns"
            row-key="id"
            :filter="filterSearch"
            :pagination="pagination"
            :filter-method="myCustomSearchFilter"
            class="customSATableClass"
          >

            <!-- Top Slot -->
            <template #top>
              <div class="row full-width items-center q-gutter-sm">

                <div class="col-6">
                  <q-input
                    v-model="filterSearch"
                    debounce="300"
                    dense
                    outlined
                    placeholder="Type.."
                  >
                    <template #append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>

                <div class="col-6 text-right">
                  <q-btn
                    label="Add New RegionGroup"
                    color="purple-9"
                    no-caps
                    @click="fnShowAddNewRegionsGroups()"
                  />
                </div>

              </div>
            </template>

            <!-- Region Group Column -->
            <template #body-cell-regionGroup="props">
              <q-td :props="props">
                {{ props.row.regionName ?? 'NA' }}
              </q-td>
            </template>

            <!-- Action Column -->
            <template #body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  icon="edit"
                  label="Modify"
                  no-caps
                  class="text-light-blue"
                  @click="fnShowEditRegionsGroup(props.row)"
                />
              </q-td>
            </template>

          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Create Region -->
      <showCreateRegion
        v-if="propShowCreateRegions"
        :propShowCreateRegions="propShowCreateRegions"
        @emitfnshowRegions="fnshowCreateRegions"
        @emitfnForRegionTable="ajaxLoadDataForRegionTable"
      />

      <!-- Edit Region Group -->
      <showEditRegionGroup
        v-if="propShowEditRegionsGroup"
        :propShowEditRegionsGroup="propShowEditRegionsGroup"
        :propRowDetails="propRowDetails"
        @emitfnshowRegionsGroup="fnShowEditRegionsGroup"
      />

      <!-- Add New Regions -->
      <ShowAddNewRegions
        v-if="propShowAddNewRegions"
        :propShowAddNewRegions="propShowAddNewRegions"
        :propRowDetails="propRowDetails"
        @emitfnShowAddNewRegions="fnShowAddNewRegions"
      />

      <!-- Add New Region Group -->
      <ShowAddNewRegionGroup
        v-if="propShowAddNewRegionsGroup"
        :propShowAddNewRegionsGroup="propShowAddNewRegionsGroup"
        :propRowDetails="propRowDetails"
        @emitfnShowAddNewRegionsGroups="fnShowAddNewRegionsGroups"
      />

    </div>
  </q-page>
</template>

<script setup>
/* -------------------------------------------------------
 * Vue 3 + Quasar 2.18 + Node 20
 * ----------------------------------------------------- */

import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import showCreateRegion from '../../components/super_admin/showCreateRegions.vue'
import showEditRegionGroup from '../../components/super_admin/showEditRegionGroup.vue'
import ShowAddNewRegions from '../../components/super_admin/ShowAddNewRegions.vue'
import ShowAddNewRegionGroup from '../../components/super_admin/ShowAddNewRegionGroup.vue'

const $q = useQuasar()
const store = useStore()

/* -------------------------------------------------------
 * State
 * ----------------------------------------------------- */
const activeTab = ref('active')
const filterSearch = ref('')
const propShowCreateRegions = ref(false)
const propShowEditRegionsGroup = ref(false)
const propShowAddNewRegions = ref(false)
const propShowAddNewRegionsGroup = ref(false)
const propRowDetails = ref(null)

const pagination = ref({
  rowsPerPage: 10
})

/* -------------------------------------------------------
 * Columns
 * ----------------------------------------------------- */
const columns = [
  {
    name: 'regionGroup',
    label: 'Region group',
    field: row => row.regionName,
    align: 'left'
  },
  {
    name: 'action',
    label: '',
    align: 'left'
  }
]

/* -------------------------------------------------------
 * Computed
 * ----------------------------------------------------- */
const activeTableData = computed(() =>
  store.getters['regionGroupDatas/getAllRegionGroupData']
    ?.filter(r => r.active === true) || []
)

/* -------------------------------------------------------
 * Lifecycle
 * ----------------------------------------------------- */
onMounted(() => {
  ajaxLoadDataForRegionTable()
})

/* -------------------------------------------------------
 * Methods
 * ----------------------------------------------------- */
const ajaxLoadDataForRegionTable = async () => {
  try {
    $q.loading.show()
    await store.dispatch('regionGroupDatas/FETCH_REGION_GROUP_DATAS')
  } finally {
    $q.loading.hide()
  }
}

const fnshowCreateRegions = () => {
  propShowCreateRegions.value = !propShowCreateRegions.value
}

const fnShowEditRegionsGroup = row => {
  propRowDetails.value = row
  propShowEditRegionsGroup.value = !propShowEditRegionsGroup.value
}

const fnShowAddNewRegions = row => {
  propRowDetails.value = row
  propShowAddNewRegions.value = !propShowAddNewRegions.value
}

const fnShowAddNewRegionsGroups = row => {
  propRowDetails.value = row || null
  propShowAddNewRegionsGroup.value = !propShowAddNewRegionsGroup.value
}

const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lower = (terms || '').toLowerCase()
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(lower)
    )
  )
}
</script>

<style scoped>
</style>
