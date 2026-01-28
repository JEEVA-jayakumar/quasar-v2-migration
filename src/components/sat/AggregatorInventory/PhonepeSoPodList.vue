<template>
  <q-page class="q-pa-md">

    <!-- Tabs -->
    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      align="left"
      active-color="primary"
      indicator-color="primary"
      @update:model-value="goToSelectedTab"
    >
      <q-tab name="tab-1" label="Approved Pod" />
      <q-tab name="tab-2" label="Rejected Pod" />
      <q-tab name="tab-3" label="Allocated Pod" />
    </q-tabs>

    <!-- Panels -->
    <q-tab-panels v-model="selectedTab" animated>

      <!-- TAB 1 -->
      <q-tab-panel name="tab-1">
        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="pod_number"
          v-model:pagination="paginationControl"
          :filter="filterSearch"
          :filter-method="myCustomSearchFilter"
          @request="ajaxLoadAllLeadInfo"
        >

          <template v-slot:top>
            <q-input
              v-model="filterSearch"
              label="Search By POD Number"
              dense
              clearable
            />
          </template>

          <template v-slot:body-cell-createdAt="{ row }">
            {{ formatDate(row.created_date) }}
          </template>

          <template v-slot:body-cell-updated_date="{ row }">
            {{ formatDate(row.updated_date) }}
          </template>

          <template v-slot:body-cell-status="{ row }">
            <span :class="statusClass(row.status)">
              {{ statusLabel(row.status) }}
            </span>
          </template>

          <template v-slot:body-cell-owner="{ row }">
            {{ ownerLabel(row.owner) }}
          </template>

          <template v-slot:body-cell-regionAreaName="{ row }">
            {{ row.allocate_region?.regionAreaName || 'NA' }}
          </template>

        </q-table>
      </q-tab-panel>

      <!-- TAB 2 -->
      <q-tab-panel name="tab-2">
        <q-table
          :rows="tableData1"
          :columns="columns1"
          row-key="pod_number"
          v-model:pagination="paginationControl1"
          :filter="filterSearch1"
          :filter-method="myCustomSearchFilter"
          @request="ajaxLoadAllLeadInfo1"
        >

          <template v-slot:top>
            <q-input
              v-model="filterSearch1"
              label="Search By POD Number"
              dense
              clearable
            />
          </template>

          <template v-slot:body-cell-createdAt="{ row }">
            {{ formatDate(row.created_date) }}
          </template>

          <template v-slot:body-cell-updated_date="{ row }">
            {{ formatDate(row.updated_date) }}
          </template>

          <template v-slot:body-cell-name="{ row }">
            {{ row.allocate_so ? `${row.allocate_so.name} | ${row.allocate_so.employeeID}` : 'NA' }}
          </template>

          <template v-slot:body-cell-action1="{ row }">
            <q-btn
              flat
              dense
              label="Update"
              color="primary"
              @click="fnUpdateRejectedPodDetails(row)"
            />
          </template>

        </q-table>
      </q-tab-panel>

      <!-- TAB 3 -->
      <q-tab-panel name="tab-3">
        <q-table
          :rows="tableData2"
          :columns="columns2"
          row-key="pod_number"
          v-model:pagination="paginationControl2"
          :filter="filterSearch2"
          :filter-method="myCustomSearchFilter"
          @request="ajaxLoadAllLeadInfo2"
        >

          <template v-slot:top>
            <q-input
              v-model="filterSearch2"
              label="Search By POD Number"
              dense
              clearable
            />
          </template>

        </q-table>
      </q-tab-panel>

    </q-tab-panels>
  </q-page>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PodManagement',

  data () {
    return {
      selectedTab: 'tab-1',
      filterSearch: '',
      filterSearch1: '',
      filterSearch2: '',

      tableData: [],
      tableData1: [],
      tableData2: [],

      paginationControl: { page: 1, rowsPerPage: 5 },
      paginationControl1: { page: 1, rowsPerPage: 5 },
      paginationControl2: { page: 1, rowsPerPage: 5 },

      columns: [
        { name: 'pod_number', label: 'Pod Number', field: 'pod_number', sortable: true },
        { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'owner', label: 'Owner', field: 'owner' },
        { name: 'total_count', label: 'Total Count', field: 'total_count' },
        { name: 'createdAt', label: 'Created Date', field: 'created_date' },
        { name: 'updated_date', label: 'Updated Date', field: 'updated_date', sortable: true }
      ],

      columns1: [
        { name: 'pod_number', label: 'Pod Number', field: 'pod_number' },
        { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName },
        { name: 'name', label: 'SO', field: row => row.allocate_so?.name },
        { name: 'createdAt', label: 'Created Date', field: 'created_date' },
        { name: 'updated_date', label: 'Updated Date', field: 'updated_date' },
        { name: 'action1', label: '', field: 'action1' }
      ],

      columns2: [
        { name: 'pod_number', label: 'Pod Number', field: 'pod_number' },
        { name: 'regionAreaName', label: 'Region', field: row => row.allocate_region?.regionAreaName },
        { name: 'name', label: 'SO Name', field: row => row.allocate_so?.name },
        { name: 'updated_date', label: 'Updated Date', field: 'updated_date' }
      ]
    }
  },

  computed: {
    ...mapGetters('soPodListDatas', [
      'getPhonepeApprovedSoPodListDatas',
      'getPhoneperejectedSoPodListDatas'
    ]),
    ...mapGetters('regionalInventoryDetails', [
      'getPhonePeRegionalInventoryAllocatedSoPodDetails'
    ])
  },

  created () {
    this.goToSelectedTab('tab-1')
  },

  methods: {
    ...mapActions('soPodListDatas', [
      'FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS',
      'FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS'
    ]),
    ...mapActions('regionalInventoryDetails', [
      'FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS'
    ]),

    formatDate (date) {
      return date ? dayjs(date).format('DD MMM YYYY') : 'NA'
    },

    statusLabel (status) {
      return {
        1: 'Created',
        2: 'Assigned to R.I',
        3: 'Approved By R.I',
        4: 'Assigned To SO',
        5: 'Approved By SO',
        6: 'Rejected'
      }[status] || 'NA'
    },

    statusClass (status) {
      return status === 6 ? 'text-negative' : 'text-primary'
    },

    ownerLabel (owner) {
      return {
        1: 'Central Inventory',
        2: 'Regional Inventory',
        3: 'SO'
      }[owner] || 'NA'
    },

    goToSelectedTab (tab) {
      if (tab === 'tab-1') this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl })
      if (tab === 'tab-2') this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1 })
      if (tab === 'tab-3') this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2 })
    },

    ajaxLoadAllLeadInfo ({ pagination }) {
      this.FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS({ pagination })
        .then(() => {
          this.tableData = this.getPhonepeApprovedSoPodListDatas.content
        })
    },

    ajaxLoadAllLeadInfo1 ({ pagination }) {
      this.FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS({ pagination })
        .then(() => {
          this.tableData1 = this.getPhoneperejectedSoPodListDatas.content
        })
    },

    ajaxLoadAllLeadInfo2 ({ pagination }) {
      this.FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS({ pagination })
        .then(() => {
          this.tableData2 = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.content
        })
    },

    myCustomSearchFilter (rows, terms, cols, cellValue) {
      const t = terms?.toLowerCase() || ''
      return rows.filter(row =>
        cols.some(col =>
          String(cellValue(col, row)).toLowerCase().includes(t)
        )
      )
    },

    fnUpdateRejectedPodDetails (row) {
      this.$router.push({
        name: 'updateRegionalRejectPods',
        params: { data: row }
      })
    }
  }
}
</script>
