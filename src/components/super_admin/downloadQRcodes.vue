<template>
  <q-page>
    <div>
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        <!-- Header placeholder -->
      </div>

      <q-table
        table-class="customTableClass"
        :rows="getAllQRList"
        :columns="columns"
        :filter="filter"
        :filter-method="myCustomSearchFilter"
        row-key="id"
        v-model:pagination="paginationControl"
      >
        <!-- Create Date -->
        <template v-slot:body-cell-createDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.createDate) }}
          </q-td>
        </template>

        <!-- Action -->
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              dense
              no-caps
              flat
              icon="download"
              label="Download QR String"
              class="text-light-blue"
              @click="fnDownload(props.row.id)"
            />
          </q-td>
        </template>

        <!-- Top Search -->
        <template v-slot:top>
          <div class="row full-width">
            <div class="col-md-6">
              <q-input
                v-model.trim="filter"
                dense
                outlined
                clearable
                color="grey-9"
                placeholder="Search by Batch no / QR API source"
                class="q-mr-lg q-py-sm"
              />
            </div>
            <div class="col-md-6"></div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'

/* ---------------- Quasar & Store ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- State ---------------- */
const filter = ref('')
const paginationControl = ref({
  rowsPerPage: 5,
  page: 1
})

/* ---------------- Vuex Getters ---------------- */
const getAllQRList = computed(() =>
  store.getters['QRList/getAllQRList']
)

/* ---------------- Lifecycle ---------------- */
onMounted(() => {
  store.dispatch('QRList/FETCH_QR_LIST')
})

/* ---------------- Methods ---------------- */
const fnDownload = (batchId) => {
  $q.loading.show({ delay: 100 })

  const requestParams = {
    params: {
      items: [batchId]
    }
  }

  store
    .dispatch('reports/QR_LIST_DOWNLOAD', requestParams)
    .then(() => {
      $q.loading.hide()
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Success, file has been downloaded',
        icon: 'check'
      })
    })
    .catch(() => {
      $q.loading.hide()
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Please try again',
        icon: 'thumb_down'
      })
    })
}

const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(lowerTerms)
    )
  )
}

const formatDate = (date) => {
  return date ? moment(date).format('Do MMM Y') : 'NA'
}

/* ---------------- Table Columns ---------------- */
const columns = [
  {
    name: 'id',
    label: 'Batch No',
    align: 'center',
    field: row => `BatchNo_000${row.id}`
  },
  {
    name: 'createDate',
    label: 'Creation Date',
    align: 'center',
    field: 'createDate',
    sortable: true
  },
  {
    name: 'qrCount',
    label: 'No of QR Requested',
    align: 'center',
    field: 'qrCount'
  },
  {
    name: 'sourceName',
    label: 'QR Bank Selected',
    align: 'center',
    field: row => row.apiInstance.apiInstanceName
  },
  {
    name: 'action',
    label: '',
    align: 'left',
    field: 'action'
  }
]
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
