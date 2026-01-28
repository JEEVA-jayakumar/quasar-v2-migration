<template>
  <q-page>
    <div>
      <!-- Table -->
      <q-table
        table-class="customTableClass"
        class="q-py-none"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        :rows-per-page-options="[50, 100, 150, 200, 250]"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top slot -->
        <template v-slot:top>
          <div class="row full-width items-center bottom-border q-pa-sm">
            <div class="col">
              <q-select
                outlined
                dense
                v-model="filter"
                label="Select a Region"
                color="grey-9"
                :options="getAllocatedDevicesRegionMenu"
                emit-value
                map-options
                clearable
              />
            </div>

            <div class="col-md-7 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                size="md"
                @click="downloadInventorySummaryInfoMenu"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Spinner Overlay -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          style="color: #61116a"
          :size="35"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

// -------------------------------------------------------------------
// Quasar & Store
// -------------------------------------------------------------------
const $q = useQuasar()
const store = useStore()

// -------------------------------------------------------------------
// State
// -------------------------------------------------------------------
const filter = ref('')
const toggleAjaxLoadFilter = ref(false)
const tableData = ref([])
const getAllocatedDevicesRegionMenu = ref([])

const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: 'tid',
  descending: false,
  rowsPerPage: 10
})

// -------------------------------------------------------------------
// Table Columns (unchanged behavior)
// -------------------------------------------------------------------
const columns = [
  {
    name: 'BpRegion',
    label: 'BP Region',
    field: 'BpRegion',
    align: 'left'
  },
  {
    name: 'deviceType',
    label: 'Device Type',
    field: 'deviceType',
    align: 'left'
  },
  {
    name: 'Total',
    label: 'Total',
    field: 'Total',
    align: 'left'
  }
]

// -------------------------------------------------------------------
// Actions
// -------------------------------------------------------------------
const fnAjaxgetAllocatedDevice = async () => {
  try {
    await store.dispatch('AllocatedDevices/ALLOCATED_MENU')

    const menu = store.getters['AllocatedDevices/getAllocatedMenu'] || []
    const options = [{ label: 'ALL', value: '%' }]

    menu.forEach(value => {
      options.push({ label: value, value })
    })

    getAllocatedDevicesRegionMenu.value = options
  } catch {
    getAllocatedDevicesRegionMenu.value = []
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  try {
    await store.dispatch('summary/ALLOCATED_DEVICE', { pagination, filter })

    const result = store.getters['summary/getAllocatedDevice']

    paginationControl.value = pagination
    paginationControl.value.rowsNumber = result.totalElements
    paginationControl.value.page = result.number + 1

    tableData.value = result.content

    if (result.sort) {
      paginationControl.value.sortBy = result.sort[0].property
      paginationControl.value.descending = result.sort[0].ascending
    }
  } finally {
    $q.loading.hide()
  }
}

const downloadInventorySummaryInfoMenu = async () => {
  $q.loading.show({ delay: 100 })

  try {
    await store.dispatch('InventoryCentral/REPORT_INVENTORY_SUMMARY1')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Success, file has been downloaded',
      icon: 'check'
    })
  } catch {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please try again',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

// -------------------------------------------------------------------
// Lifecycle
// -------------------------------------------------------------------
onMounted(() => {
  fnAjaxgetAllocatedDevice()
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filter.value
  })
})
</script>

<style scoped>
/* keep empty or project-specific styles */
</style>
