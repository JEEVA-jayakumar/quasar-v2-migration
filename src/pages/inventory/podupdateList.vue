<template>
  <q-page>
    <div>
      <q-table
        class="customSATableClass"
        :rows="getAllPodList"
        :columns="columns"
        row-key="podNumber"
        :filter="filter"
        v-model:pagination="serverPagination"
        :rows-per-page-options="[5, 10, 15, 20]"
        color="grey-9"
      >
        <!-- Action Column -->
        <template v-slot:body-cell-action="props">
          <div class="row no-wrap no-padding">
            <q-btn
              dense
              flat
              no-caps
              label="Modify"
              icon="far fa-edit"
              size="md"
              class="text-light-blue"
              @click="fnShowEditRegion(props.row)"
            />
          </div>
        </template>

        <!-- Received Date -->
        <template v-slot:body-cell-receivedAt="props">
          {{ formatDate(props.row.receivedAt) }}
        </template>

        <!-- Device Create Date -->
        <template v-slot:body-cell-DeviceList="props">
          {{ formatDate(props.row.device?.createDate) }}
        </template>

        <!-- Top Slot -->
        <template v-slot:top>
          <div class="col-md-5">
            <q-input
              v-model="filter"
              debounce="300"
              clearable
              dense
              outlined
              color="grey-9"
              placeholder="Pod Number, Device Type"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-4" />
        </template>
      </q-table>

      <!-- Edit Region Dialog -->
      <editRegion
        v-if="propShowEditRegion"
        :propShowEditRegion="propShowEditRegion"
        :propRowDetails="propRowDetails"
        @emitfnshowEditRegion="fnShowEditRegion"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import editRegion from '../../components/inventory/editRegion.vue'

export default defineComponent({
  name: 'UsersInventory',

  components: {
    editRegion
  },

  data () {
    return {
      propShowEditRegion: false,
      propRowDetails: null,

      filter: '',

      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },

      columns: [
        {
          name: 'podNumber',
          label: 'Pod Number',
          field: 'podNumber',
          align: 'center',
          sortable: true
        },
        {
          name: 'device',
          label: 'Device Type',
          align: 'center',
          sortable: true,
          field: row => row.device?.deviceName ?? 'NA'
        },
        {
          name: 'receivedAt',
          label: 'Received Date',
          align: 'center',
          sortable: true,
          field: 'receivedAt'
        },
        {
          name: 'DeviceList',
          label: 'Send Date',
          align: 'center',
          sortable: true,
          field: row => row.device?.createDate
        },
        {
          name: 'region',
          label: 'Region',
          align: 'center',
          sortable: true,
          field: row => row.region?.regionAreaName ?? 'NA'
        },
        {
          name: 'action',
          label: 'Modify POD',
          align: 'left',
          sortable: false
        }
      ]
    }
  },

  computed: {
    ...mapGetters('PodList', ['getAllPodList'])
  },

  created () {
    this.FETCH_POD_LIST()
  },

  methods: {
    ...mapActions('PodList', ['FETCH_POD_LIST']),

    formatDate (value) {
      if (!value) return 'NA'
      return moment(value).format('Do MMM YYYY')
    },

    fnShowEditRegion (rowDetails) {
      this.propShowEditRegion = !this.propShowEditRegion
      if (rowDetails) {
        this.propRowDetails = rowDetails
      }
    }
  }
})
</script>

<style scoped>
/* keep existing styles untouched */
</style>
