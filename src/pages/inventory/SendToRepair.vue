<template>
  <q-page>
    <q-pull-to-refresh @refresh="onPullToRefresh">
      <!-- Title -->
      <div class="q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Send To Repair
      </div>

      <!-- Table -->
      <q-table
        class="customTableClass"
        color="grey-9"
        :rows="tableData"
        :columns="columns"
        row-key="serialNumber"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top Section -->
        <template v-slot:top>
          <div class="row full-width items-center q-col-gutter-md">
            <div class="col-md-5 col-sm-12">
              <q-input
                dense
                outlined
                debounce="300"
                v-model="filterSearch"
                placeholder="Search Using Device Serial Number"
                clearable
              />
            </div>

            <div class="col-md-5 col-sm-12">
              <q-btn
                outline
                color="purple-9"
                label="Download as Excel"
                class="float-right"
                @click="downloadSendToRepair"
              />
            </div>

            <div class="col-md-12 text-right">
              <q-btn
                outline
                color="grey-9"
                icon="attach_file"
                label="Bulk Upload"
                @click="fnOpenBulkModal"
              />
            </div>
          </div>
        </template>

        <!-- Body -->
        <template v-slot:body="props">
          <q-tr :props="props" class="bottom-border">
            <q-td>{{ props.row.device?.deviceName }}</q-td>
            <q-td>{{ props.row.serialNumber }}</q-td>
            <q-td class="text-center">
              {{ formatDate(props.row.updatedAt) }}
            </q-td>
            <q-td class="text-center">
              <q-btn
                push
                size="sm"
                color="positive"
                class="q-mx-sm"
                label="Accept"
                @click="openAcceptModel(props.row)"
              />
              <q-btn
                push
                size="sm"
                color="negative"
                class="q-mx-sm"
                label="Moved To Scrap"
                @click="moveToScrap(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Download Modal -->
    <DownloadSendToRepair
      v-if="propSendToRepair"
      :propSendToRepair="propSendToRepair"
      @emitfnshowSendToRepair="downloadSendToRepair"
    />

    <!-- Bulk Upload -->
    <openAddBulkModelComp
      v-if="openBulkModal"
      :propOpenBulkModal="openBulkModal"
      @closeModel="fnOpenBulkModal"
      @emitToggleinventoryBulkUploadOnSuccess="reloadPage"
    />

    <!-- Scrap Modal -->
    <moveToScrapComp
      v-if="showScrapModel"
      :showScrapModel="showScrapModel"
      :propShowScrapComponent="propsScrapAppend"
      @closeScrapModel="moveToScrap"
    />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

import moveToScrapComp from '../../components/inventory/moveToScrapComp.vue'
import openAddBulkModelComp from '../../components/inventory/openAddBulkModelComp.vue'
import DownloadSendToRepair from '../../components/inventory/DownloadSendToRepair.vue'

export default defineComponent({
  name: 'GetSendToRepairDetails',

  components: {
    moveToScrapComp,
    openAddBulkModelComp,
    DownloadSendToRepair
  },

  data () {
    return {
      filterSearch: '',
      tableData: [],
      toggleAjaxLoadFilter: false,
      propSendToRepair: false,
      openBulkModal: false,
      showScrapModel: false,
      propsScrapAppend: null,

      paginationControl: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0,
        sortBy: 'serialNumber',
        descending: false
      },

      columns: [
        {
          name: 'device',
          label: 'Device Type',
          field: row => row.device?.deviceName,
          align: 'left',
          sortable: true
        },
        {
          name: 'serialNumber',
          label: 'Device Serial Numbers',
          field: 'serialNumber',
          align: 'left'
        },
        {
          name: 'updatedAt',
          label: 'Receive Date',
          field: 'updatedAt',
          align: 'center'
        },
        {
          name: 'action',
          label: '',
          align: 'center'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('SendToRepair', ['getSendToRepairDetails'])
  },

  mounted () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filterSearch
    })
  },

  methods: {
    ...mapActions('SendToRepair', [
      'FETCH_SEND_TO_REPAIR_DETAILS',
      'APPROVE_SEND_TO_REPAIR'
    ]),

    formatDate (date) {
      return date ? moment(date).format('Do MMM YYYY') : 'NA'
    },

    fnOpenBulkModal () {
      this.openBulkModal = !this.openBulkModal
    },

    downloadSendToRepair () {
      this.propSendToRepair = !this.propSendToRepair
    },

    reloadPage () {
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: this.filterSearch
      })
    },

    moveToScrap (row) {
      this.showScrapModel = !this.showScrapModel
      this.propsScrapAppend = row
    },

    onPullToRefresh (done) {
      this.reloadPage()
      done()
    },

    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true
      this.$q.loading.show({ message: 'Fetching data...' })

      this.FETCH_SEND_TO_REPAIR_DETAILS({ pagination, filter })
        .then(() => {
          const res = this.getSendToRepairDetails
          this.tableData = res.content
          this.paginationControl.rowsNumber = res.totalElements
          this.paginationControl.page = res.number + 1
        })
        .finally(() => {
          this.toggleAjaxLoadFilter = false
          this.$q.loading.hide()
        })
    },

    openAcceptModel (row) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to approve ?',
        ok: 'Continue',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$q.loading.show({ message: 'Processing...' })

        this.APPROVE_SEND_TO_REPAIR(row)
          .then(() => {
            this.$q.notify({
              color: 'positive',
              message: 'Successfully Approved!',
              icon: 'thumb_up'
            })
            this.reloadPage()
          })
          .finally(() => this.$q.loading.hide())
      })
    }
  }
})
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
