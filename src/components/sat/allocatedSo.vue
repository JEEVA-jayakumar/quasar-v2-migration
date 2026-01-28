<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="selectedTab"
      dense
      indicator-color="primary"
      class="shadow-1"
      @update:model-value="goToSelectedTab"
    >
      <q-tab name="tab-1" label="Approved Pod" />
      <q-tab name="tab-2" label="Rejected Pod" />
      <q-tab name="tab-3" label="Allocated Pod" />
    </q-tabs>

    <q-separator spaced />

    <q-tab-panels v-model="selectedTab" animated>
      <!-- Approved Pod Table -->
      <q-tab-panel name="tab-1">
        <q-table
          :rows="approvedPods"
          :columns="columns"
          row-key="podNumber"
          flat
          bordered
          :filter="searchApproved"
          v-model:pagination="paginationApproved"
          :filter-method="customFilter"
        >
          <template v-slot:top>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="searchApproved"
              placeholder="Search By POD Number"
              clearable
              class="q-mb-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-createdAt="props">
            {{ props.row.created_date ? formatDate(props.row.created_date) : 'NA' }}
          </template>

          <template v-slot:body-cell-updated_date="props">
            {{ props.row.updated_date ? formatDate(props.row.updated_date) : 'NA' }}
          </template>

          <template v-slot:body-cell-status="props">
            <q-chip
              :color="statusColor(props.row.status)"
              text-color="white"
              dense
              outlined
            >
              {{ statusText(props.row.status) }}
            </q-chip>
          </template>

          <template v-slot:body-cell-owner="props">
            <q-chip
              :color="ownerColor(props.row.owner)"
              text-color="white"
              dense
              outlined
            >
              {{ ownerText(props.row.owner) }}
            </q-chip>
          </template>

          <template v-slot:body-cell-regionAreaName="props">
            {{ props.row.allocate_region?.regionAreaName || 'NA' }}
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Rejected Pod Table -->
      <q-tab-panel name="tab-2">
        <q-table
          :rows="rejectedPods"
          :columns="columns"
          row-key="podNumber"
          flat
          bordered
          :filter="searchRejected"
          v-model:pagination="paginationRejected"
          :filter-method="customFilter"
        >
          <template v-slot:top>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="searchRejected"
              placeholder="Search By POD Number"
              clearable
              class="q-mb-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-createdAt="props">
            {{ props.row.created_date ? formatDate(props.row.created_date) : 'NA' }}
          </template>

          <template v-slot:body-cell-updated_date="props">
            {{ props.row.updated_date ? formatDate(props.row.updated_date) : 'NA' }}
          </template>

          <template v-slot:body-cell-status="props">
            <q-chip
              :color="statusColor(props.row.status)"
              text-color="white"
              dense
              outlined
            >
              {{ statusText(props.row.status) }}
            </q-chip>
          </template>

          <template v-slot:body-cell-owner="props">
            <q-chip
              :color="ownerColor(props.row.owner)"
              text-color="white"
              dense
              outlined
            >
              {{ ownerText(props.row.owner) }}
            </q-chip>
          </template>

          <template v-slot:body-cell-regionAreaName="props">
            {{ props.row.allocate_region?.regionAreaName || 'NA' }}
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Allocated Pod Table (example) -->
      <q-tab-panel name="tab-3">
        <q-table
          :rows="allocatedPods"
          :columns="columns"
          row-key="podNumber"
          flat
          bordered
          :filter="searchAllocated"
          v-model:pagination="paginationAllocated"
          :filter-method="customFilter"
        >
          <template v-slot:top>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="searchAllocated"
              placeholder="Search By POD Number"
              clearable
              class="q-mb-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { date } from 'quasar'

// --- Reactive State ---
const selectedTab = ref('tab-1')

// Example Data Arrays (Replace with API data)
const approvedPods = ref([])
const rejectedPods = ref([])
const allocatedPods = ref([])

// Pagination & Search
const paginationApproved = ref({ page: 1, rowsPerPage: 10 })
const paginationRejected = ref({ page: 1, rowsPerPage: 10 })
const paginationAllocated = ref({ page: 1, rowsPerPage: 10 })

const searchApproved = ref('')
const searchRejected = ref('')
const searchAllocated = ref('')

// Table Columns
const columns = [
  { name: 'podNumber', label: 'POD Number', field: 'podNumber', sortable: true },
  { name: 'createdAt', label: 'Created Date', field: 'created_date', sortable: true },
  { name: 'updated_date', label: 'Updated Date', field: 'updated_date', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  { name: 'owner', label: 'Owner', field: 'owner', sortable: true },
  { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName || 'NA', sortable: false }
]

// --- Methods ---
const goToSelectedTab = (tabName) => {
  selectedTab.value = tabName
}

// Custom Filter Function
const customFilter = (row, filter) => {
  if (!filter) return true
  return Object.values(row).some(val =>
    String(val).toLowerCase().includes(filter.toLowerCase())
  )
}

// Status Display
const statusText = (status) => {
  switch (status) {
    case 1: return 'Created'
    case 2: return 'Assigned to R.I'
    case 3: return 'Approved By R.I'
    case 4: return 'Assigned To SO'
    case 5: return 'Approved By SO'
    case 6: return 'Rejected'
    default: return 'NA'
  }
}
const statusColor = (status) => {
  switch (status) {
    case 1: return 'positive'
    case 2: return 'primary'
    case 3: case 4: case 5: case 6: return 'orange'
    default: return 'negative'
  }
}

// Owner Display
const ownerText = (owner) => {
  switch (owner) {
    case 1: return 'Central Inventory'
    case 2: return 'Regional Inventory'
    case 3: return 'SO'
    default: return 'NA'
  }
}
const ownerColor = (owner) => {
  switch (owner) {
    case 1: return 'positive'
    case 2: case 3: return 'primary'
    default: return 'grey'
  }
}

// Date Formatter
const formatDate = (dateStr) => {
  return date.formatDate(dateStr, 'DD MMM YYYY')
}
</script>

<style scoped>
.q-table .q-chip {
  min-width: 90px;
  text-align: center;
}
</style>
