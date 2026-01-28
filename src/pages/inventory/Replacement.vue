<template>
  <q-page>
    <div>
      <!-- Title -->
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Replacement / Recovery
      </div>

      <!-- Table -->
      <q-table
        class="customTableClass q-py-none"
        :rows="tableData"
        :columns="columns"
        row-key="mId"
        :filter="filter"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Date Column -->
        <template v-slot:body-cell-dateOfRecoveryReplacement="props">
          <span class="label">
            {{ formatDate(props.row.dateOfRecoveryReplacement) }}
          </span>
        </template>

        <!-- Top Toolbar -->
        <template v-slot:top>
          <div class="col">
            <q-input
              v-model="filter"
              debounce="300"
              clearable
              outlined
              dense
              color="grey-9"
              placeholder="Search by MID, TID"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-md-6">
            <q-btn
              square
              outline
              color="purple-9"
              label="Download as Excel"
              class="q-mr-lg q-py-sm float-right"
              size="md"
              @click="downloadRecoveryReplacementHist"
            />
          </div>
        </template>
      </q-table>

      <!-- Download Report Modal -->
      <DownloadReplacementReport
        v-if="propReplacementReport"
        :propReplacementReport="propReplacementReport"
        @emitfnshowReplacement="downloadRecoveryReplacementHist"
      />

      <!-- Fullscreen Loader -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          style="color:#61116a"
          :size="35"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
import moment from 'moment'
import DownloadReplacementReport from '../../components/inventory/DownloadReplacementReport.vue'

const { startOfDate, addToDate, subtractFromDate } = date
const today = new Date()

export default defineComponent({
  name: 'GetReplacementRecoveryList',

  components: {
    DownloadReplacementReport
  },

  data () {
    return {
      propReplacementReport: false,

      filter: '',
      toggleAjaxLoadFilter: false,

      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: 'dateOfRecoveryReplacement',
        descending: false,
        rowsPerPage: 10
      },

      tableData: [],

      tomorrow: addToDate(today, { days: -1 }),
      yesterday: subtractFromDate(today, { days: 90 }),
      defaultValue: startOfDate(today, 'year'),

      columns: [
        {
          name: 'MID',
          label: 'MID',
          align: 'left',
          field: row => row.mId ?? 'NA'
        },
        {
          name: 'TID',
          label: 'TID',
          align: 'left',
          field: row => row.tId ?? 'NA'
        },
        {
          name: 'BP Region',
          label: 'BP Region',
          align: 'left',
          field: row => row.bpRegions ?? 'NA'
        },
        {
          name: 'SO Id',
          label: 'SO Id',
          align: 'left',
          field: 'so'
        },
        {
          name: 'ME Name',
          label: 'Merchant Name',
          align: 'left',
          field: row => row.meName ?? 'NA'
        },
        {
          name: 'Merchant Address',
          label: 'Merchant Address',
          align: 'left',
          field: row => row.merchantAddress ?? 'NA'
        },
        {
          name: 'Device Type',
          label: 'Device Type',
          align: 'left',
          field: row => row.deviceType ?? 'NA'
        },
        {
          name: 'replacementStatus',
          label: 'Replacement Status',
          align: 'left',
          field: row => {
            const status = row.marsDeviceDetails?.devicereplacementStatus
            return status === 1 ? 'Initiated'
              : status === 2 ? 'Device Scanned'
              : status === 3 ? 'Submitted'
              : 'NA'
          }
        },
        {
          name: 'recoveryStatus',
          label: 'Recovery Status',
          align: 'left',
          field: row => {
            const status = row.marsDeviceDetails?.deviceRecoveryStatus
            return status === 1 ? 'Initiated'
              : status === 2 ? 'Device Scanned'
              : status === 3 ? 'Submitted'
              : 'NA'
          }
        },
        {
          name: 'dateOfRecoveryReplacement',
          label: 'Date Of Replacement / Recovery',
          align: 'left',
          field: 'dateOfRecoveryReplacement'
        },
        {
          name: 'Old Device Serial Number',
          label: 'Old Device Serial Number',
          align: 'left',
          field: 'oldDeviceSerialNumber'
        },
        {
          name: 'New Device Serial Number',
          label: 'New Device Serial Number',
          align: 'left',
          field: 'newDeviceSerialNumber'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('replacement', ['getReplacementRecoveryList'])
  },

  mounted () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    })
  },

  methods: {
    ...mapActions('replacement', ['REPLACEMENT_RECOVERY_LIST']),
    ...mapActions('InventoryCentral', ['REPORT_RECOVERY_REPLACEMENT_HIST']),

    formatDate (value) {
      return value ? moment(value).format('Do MMM YYYY') : 'NA'
    },

    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true

      this.$q.loading.show({
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      })

      this.REPLACEMENT_RECOVERY_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl = pagination
          this.paginationControl.rowsNumber =
            this.getReplacementRecoveryList.totalElements
          this.paginationControl.page =
            this.getReplacementRecoveryList.number + 1

          this.tableData = this.getReplacementRecoveryList.content || []

          if (this.getReplacementRecoveryList.sort) {
            this.paginationControl.sortBy =
              this.getReplacementRecoveryList.sort[0].property
            this.paginationControl.descending =
              this.getReplacementRecoveryList.sort[0].ascending
          }
        })
        .finally(() => {
          this.toggleAjaxLoadFilter = false
          this.$q.loading.hide()
        })
    },

    downloadRecoveryReplacementHist () {
      this.propReplacementReport = !this.propReplacementReport
    }
  }
})
</script>

<style scoped>
/* keep existing styles */
</style>
