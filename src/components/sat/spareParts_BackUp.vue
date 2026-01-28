<template>
  <q-page>
    <!-- Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Header Card -->
    <q-card class="group q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium">
          <span class="text-h5">{{ formData.marsDeviceIdsCooked.length }}</span>
          / selected
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6">
          <q-select
            v-model="formData.assignTo"
            :options="assignToOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            clearable
            color="grey-9"
            label="Assign To"
          />
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6 text-right">
          <q-btn
            label="Assign"
            no-caps
            class="common-dark-blue"
            :disable="formData.marsDeviceIdsCooked.length === 0"
            @click="assignImplementationUser"
          />
        </div>
      </div>
    </q-card>

    <!-- Table -->
    <q-table
      class="q-mt-md"
      table-class="customTableClass"
      row-key="id"
      :rows="tableData"
      :columns="columns"
      :loading="toggleAjaxLoadFilter"
      :filter="filter"
      selection="multiple"
      v-model:selected="formData.marsDeviceIdsCooked"
      v-model:pagination="paginationControl"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >
      <!-- Top Search -->
      <template #top>
        <q-input
          v-model="filter"
          debounce="300"
          clearable
          color="grey-9"
          label="Search Using MID"
          class="q-mb-sm"
        />
      </template>

      <!-- MID -->
      <template #body-cell-mid="props">
        <q-td :props="props">
          <span class="text-primary"># {{ props.row.mid }}</span>
        </q-td>
      </template>

      <!-- Region -->
      <template #body-cell-regionAreaName="props">
        <q-td :props="props">
          {{
            props.row.allocate_region
              ? props.row.allocate_region.regionAreaName
              : 'NA'
          }}
        </q-td>
      </template>

      <!-- Created By -->
      <template #body-cell-name="props">
        <q-td :props="props">
          {{ props.row.created_by ? props.row.created_by.name : 'NA' }}
        </q-td>
      </template>
    </q-table>

    <!-- Transaction Details -->
    <showMerchantTransactionLevelDetails
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!-- Loader Overlay -->
    <div
      v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1"
      class="fullscreen spinner-overlay"
    >
      <q-spinner-bars class="absolute-center" size="35px" color="purple-9" />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { useQuasar } from 'quasar'

import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue'
import generalLeadInformation from '../../components/generalLeadInformation.vue'

export default {
  name: 'GetAdditionalTid',

  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation
  },

  data () {
    return {
      $q: useQuasar(),

      propToggleLeadInformation: false,
      addtnLeadInformation: null,

      assignToOptions: [],

      formData: {
        marsDeviceIdsCooked: [],
        assignTo: ''
      },

      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,

      filter: '',

      paginationControl: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'updated_date',
        descending: false
      },

      tableData: [],
      valueToggleMerchantTransaction: false,

      columns: [
        { name: 'pod_number', label: 'Pod Number', field: 'pod_number' },
        {
          name: 'regionAreaName',
          label: 'Region Area',
          field: row => row.allocate_region?.regionAreaName ?? 'NA'
        },
        {
          name: 'name',
          label: 'Created By',
          field: row => row.created_by?.name ?? 'NA'
        },
        { name: 'total_count', label: 'Total Count', field: 'total_count' },
        {
          name: 'updated_date',
          label: 'Updated Date',
          field: 'updated_date',
          sortable: true
        }
      ]
    }
  },

  computed: {
    ...mapGetters('ImplementationExecutive', ['getImplementationExecutiveList']),
    ...mapGetters('sparePartsRegionalInventoryPodDetails', [
      'getsparePartsRegionalInventoryDetails'
    ])
  },

  mounted () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    })
  },

  methods: {
    ...mapActions('ImplementationExecutive', ['IMPLEMENTATION_EXECUTIVE_LIST']),
    ...mapActions('sparePartsRegionalInventoryPodDetails', [
      'FETCH_SPARE_PARTS_REGIONAL_INVENTORY_DETAILS'
    ]),
    ...mapActions('sparePartsRegionalInventory', [
      'FETCH_ALL_SPARE_PARTS_REGIONAL_INVENTORY_DATAS'
    ]),

    toggleLeadInformation (details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation
      if (details) this.addtnLeadInformation = details
    },

    assignImplementationUser () {
      if (!this.formData.marsDeviceIdsCooked.length) {
        return this.$q.notify({
          color: 'negative',
          message: 'Select atleast one item'
        })
      }

      if (!this.formData.assignTo) {
        return this.$q.notify({
          color: 'negative',
          message: 'Implementation officer cannot be empty!'
        })
      }

      const postValues = {
        request: this.formData.marsDeviceIdsCooked,
        regionId: JSON.parse(localStorage.getItem('u_i')).region.id,
        userId: this.formData.assignTo
      }

      this.FETCH_ALL_SPARE_PARTS_REGIONAL_INVENTORY_DATAS(postValues)
        .then(() => {
          this.$q.notify({
            color: 'positive',
            message: 'Successfully assigned!'
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Please try again'
          })
        })
    },

    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.$q.loading.show({ message: 'Fetching data...' })

      const param = {
        userId: JSON.parse(localStorage.getItem('u_i')).region.id
      }

      this.FETCH_SPARE_PARTS_REGIONAL_INVENTORY_DETAILS({
        pagination,
        filter,
        param
      })
        .then(() => {
          this.paginationControl.rowsNumber =
            this.getsparePartsRegionalInventoryDetails.totalElements
          this.tableData =
            this.getsparePartsRegionalInventoryDetails.content

          return this.IMPLEMENTATION_EXECUTIVE_LIST()
        })
        .then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({
            label: v.name,
            value: v.id
          }))
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    }
  }
}
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
  z-index: 1000;
}
</style>
