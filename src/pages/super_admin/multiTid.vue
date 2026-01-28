<template>
  <q-page>
    <div>
      <!-- Tabs -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        active-color="dark"
        indicator-color="dark"
      >
        <q-tab name="active" label="Active TID" />
      </q-tabs>

      <!-- Tab Panels -->
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="active">
          <q-table
            :rows="getlsVasHostInstanceDetails"
            :columns="columns"
            row-key="name"
            table-class="customSATableClass"
            color="grey-9"
            :filter="filterSearch"
            :filter-method="myCustomSearchFilter"
            v-model:pagination="paginationControl"
            @request="ajaxLoadAllLeadInfo"
          >
            <!-- Top slot -->
            <template v-slot:top>
              <div class="row q-col-gutter-md items-center full-width">
                <div class="col-md-6">
                  <q-input
                    v-model.trim="filterSearch"
                    type="search"
                    color="grey-9"
                    clearable
                    label="Search by Plan Name"
                  />
                </div>

                <div class="col-md-6 text-right">
                  <q-btn
                    no-caps
                    color="purple-9"
                    label="Add New Configurations"
                    @click="fnaddnewConfigurarions"
                  />
                </div>
              </div>
            </template>

            <!-- Action column -->
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  no-caps
                  icon="far fa-plus-square"
                  label="Disable"
                  class="text-light-blue"
                  @click="fnDisable(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Add Config Modal -->
      <AddNewConfigurarions
        v-if="propShowAddNewConfigurarions"
        :propShowAddNewConfigurarions="propShowAddNewConfigurarions"
        @emitfnshowAddConfiguration="propShowAddNewConfigurarions = $event"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import AddNewConfigurarions from '../../pages/super_admin/addMultiTidConfiguration.vue'

const $q = useQuasar()
const store = useStore()

/* ---------------- state ---------------- */
const selectedTab = ref('active')
const propShowAddNewConfigurarions = ref(false)
const filterSearch = ref('')

const paginationControl = ref({
  rowsPerPage: 10
})

/* ---------------- getters ---------------- */
const getlsVasHostInstanceDetails = computed(
  () => store.getters['lsVasHostInstance/getlsVasHostInstanceDetails']
)

/* ---------------- columns ---------------- */
const columns = [
  {
    name: 'institutionName',
    label: 'Institution Name',
    align: 'left',
    field: row => row.institution?.institutionName ?? '',
    sortable: false
  },
  {
    name: 'leadSource',
    label: 'Lead Source',
    align: 'left',
    field: row => row.leadSource?.sourceName ?? '',
    sortable: false
  },
  {
    name: 'masterHost',
    label: 'Master Host',
    align: 'left',
    field: row => row.masterHost?.name ?? '',
    sortable: false
  },
  {
    name: 'vas',
    label: 'VAS',
    align: 'left',
    field: row => row.vas?.name ?? '',
    sortable: false
  }
]

/* ---------------- methods ---------------- */
const fnaddnewConfigurarions = () => {
  propShowAddNewConfigurarions.value = !propShowAddNewConfigurarions.value
}

const ajaxLoadAllLeadInfo = async () => {
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data...'
  })

  try {
    await store.dispatch('lsVasHostInstance/GET_LS_VAS_HOST_INSTANCE_DETAILS')
  } finally {
    $q.loading.hide()
  }
}

const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const search = terms?.toLowerCase() || ''
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(search)
    )
  )
}

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  ajaxLoadAllLeadInfo()
})
</script>

<style scoped>
/* keep existing styles */
</style>
