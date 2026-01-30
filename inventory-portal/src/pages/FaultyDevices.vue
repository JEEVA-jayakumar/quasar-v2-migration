<template>
  <q-page>
    <div>
      <!-- Table title -->
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      />

      <!-- Table -->
      <q-table
        class="q-py-none customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        row-key="BpRegion"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        v-model:pagination="pagination"
        :loading="loading"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- TOP SLOT -->
        <template v-slot:top>
          <div class="row full-width bottom-border items-center">
            <div class="col-md-4">
              <q-select
                outlined
                v-model="filter"
                label="Select a Region"
                color="grey-9"
                :options="regionOptions"
                emit-value
                map-options
              />
            </div>

            <div class="col-md-8 text-right">
              <q-btn
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                @click="downloadInventorySummaryInfoMenu"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- FULLSCREEN SPINNER -->
      <div v-if="loading" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          color="purple-9"
          size="35"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
/* ---------------- IMPORTS ---------------- */
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- STATE ---------------- */
const tableData = ref([])
const filter = ref('')
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'tid',
  descending: false
})

const regionOptions = ref([])

/* ---------------- TABLE COLUMNS ---------------- */
const columns = [
  {
    name: 'BpRegion',
    label: 'BpRegion',
    field: 'BpRegion',
    align: 'left',
    sortable: true
  },
  {
    name: 'deviceType',
    label: 'Device Type',
    field: 'deviceType',
    align: 'left',
    sortable: true
  },
  {
    name: 'Total',
    label: 'Total',
    field: 'Total',
    align: 'left',
    sortable: true
  }
]

/* ---------------- METHODS ---------------- */
const loadRegionMenu = async () => {
  try {
    await store.dispatch('FaultyDevices/FAULTY_DEVICE_LIST')

    const regions = store.getters['FaultyDevices/getFaultyDevicesRegionMenu']

    regionOptions.value = [
      { label: 'ALL', value: '%' },
      ...regions.map(r => ({ label: r, value: r }))
    ]
  } catch {
    regionOptions.value = []
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination: pg, filter }) => {
  loading.value = true

  $q.loading.show({
    message: 'Fetching data ..',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('faulty/FAULTY_DEVICE', {
      pagination: pg,
      filter
    })

    const response = store.getters['faulty/getFaultyDevice']

    tableData.value = response.content
    pagination.value.rowsNumber = response.totalElements
    pagination.value.page = response.number + 1

    if (response.sort?.length) {
      pagination.value.sortBy = response.sort[0].property
      pagination.value.descending = !response.sort[0].ascending
    }
  } finally {
    loading.value = false
    $q.loading.hide()
  }
}

const downloadInventorySummaryInfoMenu = async () => {
  $q.loading.show({ delay: 100 })

  try {
    await store.dispatch('InventoryCentral/REPORT_INVENTORY_SUMMARY3')
    $q.notify({
      type: 'positive',
      message: 'Success, file has been downloaded'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Please try again'
    })
  } finally {
    $q.loading.hide()
  }
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(() => {
  loadRegionMenu()
  ajaxLoadAllLeadInfo({
    pagination: pagination.value,
    filter: filter.value
  })
})
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
}
</style>
