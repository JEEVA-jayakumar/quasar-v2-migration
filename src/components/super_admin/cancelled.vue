<template>
  <q-page padding>

    <!-- Tabs -->
    <q-tabs v-model="activeTab" class="shadow-1" color="grey-1">
      <q-tab name="tab-5" label="Active Cancelled" color="dark" @click="ajaxSpareData" />
      <q-tab name="tab-6" label="Deactive Cancelled" color="dark" />
    </q-tabs>

    <q-tab-panels v-model="activeTab">

      <!-- Active Cancelled -->
      <q-tab-panel name="tab-5">
        <q-table
          :rows="ActivetableData"
          :columns="columns1"
          row-key="name"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter1"
          color="grey-9"
        >
          <template v-slot:top>
            <div class="row items-center q-my-sm">
              <div class="col-3">
                <q-input
                  filled
                  v-model="filterSearch"
                  debounce="300"
                  placeholder="Type.."
                  clearable
                />
              </div>
              <div class="col-3 text-right">
                <q-btn
                  label="Add Service Status"
                  color="purple-9"
                  @click="fnShowCancelStatus()"
                  size="md"
                />
              </div>
            </div>
          </template>

          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>

          <template v-slot:body-cell-updatedAt="props">
            {{ formatDate(props.row.updatedAt) }}
          </template>

          <template v-slot:body-cell-action="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                flat
                color="info"
                label="Modify"
                icon="edit"
                @click="ShowEditServiceCancelStatus(props.row)"
              />
              <q-btn
                dense
                flat
                color="negative"
                label="Disable"
                icon="block"
                class="q-ml-sm"
                @click="fnDeleteServiceRequestCancel(props.row)"
              />
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Deactive Cancelled -->
      <q-tab-panel name="tab-6">
        <q-table
          :rows="DeactivetableData"
          :columns="columns4"
          row-key="name"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl2"
          :filter-method="myCustomSearchFilter2"
          color="grey-9"
        >
          <template v-slot:top>
            <div class="row items-center q-my-sm">
              <div class="col-3">
                <q-input
                  filled
                  v-model="filterSearch"
                  debounce="300"
                  placeholder="Type.."
                  clearable
                />
              </div>
            </div>
          </template>

          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>

          <template v-slot:body-cell-updatedAt="props">
            {{ formatDate(props.row.updatedAt) }}
          </template>

          <template v-slot:body-cell-action1="props">
            <q-btn
              dense
              flat
              color="positive"
              label="Active"
              icon="check"
              @click="fnShowActiveCancelStatus(props.row)"
            />
          </template>
        </q-table>
      </q-tab-panel>

    </q-tab-panels>

    <!-- Add Service Status Modal -->
    <show-cancel-status
      v-if="propShowCancelStatus"
      :prop-show-cancel-status="propShowCancelStatus"
      :prop-row-details3="propRowDetails3"
      @emitfnShowCancelStatus="fnShowCancelStatus"
    />

    <!-- Edit Service Status Modal -->
    <show-edit-service-cancel-status
      v-if="propShowEditServiceCancelStatus"
      :prop-show-edit-service-cancel-status="propShowEditServiceCancelStatus"
      :prop-row-details5="propRowDetails5"
      @emitShowEditServiceCancelStatus="ShowEditServiceCancelStatus"
    />

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import ShowCancelStatus from '../../components/super_admin/showCancelStatus.vue'
import ShowEditServiceCancelStatus from '../../components/super_admin/ShowEditServiceCancelStatus.vue'

export default {
  name: 'GetServiceRequestCancelReasonDetails',
  components: { ShowCancelStatus, ShowEditServiceCancelStatus },
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const activeTab = ref('tab-5')

    const propShowCancelStatus = ref(false)
    const propShowEditServiceCancelStatus = ref(false)
    const propRowDetails3 = ref(null)
    const propRowDetails5 = ref(null)

    const filterSearch = ref('')
    const paginationControl = ref({ rowsPerPage: 10 })
    const paginationControl2 = ref({ rowsPerPage: 10 })

    const ActivetableData = ref([])
    const DeactivetableData = ref([])

    const columns1 = [
      { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
      { name: 'createdAt', label: 'Created Date', field: 'createdAt', align: 'left', sortable: true },
      { name: 'updatedAt', label: 'Updated Date', field: 'updatedAt', align: 'left', sortable: true },
      { name: 'action', label: '', field: 'action', align: 'left', sortable: false }
    ]

    const columns4 = [
      { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
      { name: 'createdAt', label: 'Created Date', field: 'createdAt', align: 'left', sortable: true },
      { name: 'updatedAt', label: 'Updated Date', field: 'updatedAt', align: 'left', sortable: true },
      { name: 'action1', label: '', field: 'action1', align: 'left', sortable: false }
    ]

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
    }

    const ajaxSpareData = async () => {
      try {
        await store.dispatch('serviceRequestCancelled/FETCH_SERVICE_REQUEST_CANCELLED_DETAILS')
        const allData = store.getters['serviceRequestCancelled/getserviceRequestCancelReasonDetails']
        ActivetableData.value = allData.filter(item => item.active === true)
        DeactivetableData.value = allData.filter(item => item.active === false)
      } catch {
        $q.loading.hide()
        $q.notify({ color: 'negative', message: 'Error fetching data', icon: 'thumb_down', position: 'bottom' })
      }
    }

    const fnShowCancelStatus = (token) => {
      propShowCancelStatus.value = !propShowCancelStatus.value
      if (token === 'refresh') ajaxSpareData()
    }

    const ShowEditServiceCancelStatus = (rowDetails) => {
      propShowEditServiceCancelStatus.value = !propShowEditServiceCancelStatus.value
      propRowDetails5.value = rowDetails
      if (!propShowEditServiceCancelStatus.value) ajaxSpareData()
    }

    const fnShowActiveCancelStatus = (rowDetails) => {
      $q.dialog({ title: 'Confirm', message: 'Are you sure want to delete?', cancel: true, persistent: true })
        .onOk(async () => {
          $q.loading.show({ message: 'Please Wait', spinnerColor: 'purple-9' })
          try {
            await store.dispatch('serviceRequestCancelled/EDIT_CANCEL_STATUS_TYPES', { id: rowDetails.id, request: rowDetails })
            $q.notify({ color: 'positive', message: 'Successfully updated!', icon: 'thumb_up', position: 'bottom' })
            ajaxSpareData()
          } catch {
            $q.notify({ color: 'negative', message: 'Please Try Again Later!', icon: 'thumb_down', position: 'bottom' })
          } finally {
            $q.loading.hide()
          }
        })
    }

    const fnDeleteServiceRequestCancel = (rowDetails) => {
      $q.dialog({ title: 'Confirm', message: 'Are you sure want to delete?', cancel: true, persistent: true })
        .onOk(async () => {
          $q.loading.show({ message: 'Please Wait', spinnerColor: 'purple-9' })
          try {
            await store.dispatch('serviceRequestCancelled/DELETE_SERVICE_CANCEL_STATUS_TYPES', rowDetails)
            $q.notify({ color: 'positive', message: 'Successfully removed', icon: 'thumb_up', position: 'bottom' })
            ajaxSpareData()
          } catch {
            $q.notify({ color: 'negative', message: 'No changes made!', icon: 'thumb_down', position: 'bottom' })
          } finally {
            $q.loading.hide()
          }
        })
    }

    const myCustomSearchFilter1 = (rows, terms, cols, cellValue) => {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(row => cols.some(col => (cellValue(col, row) + '').toLowerCase().includes(lowerTerms)))
    }

    const myCustomSearchFilter2 = myCustomSearchFilter1

    onMounted(() => {
      ajaxSpareData()
    })

    return {
      activeTab,
      propShowCancelStatus,
      propShowEditServiceCancelStatus,
      propRowDetails3,
      propRowDetails5,
      filterSearch,
      paginationControl,
      paginationControl2,
      ActivetableData,
      DeactivetableData,
      columns1,
      columns4,
      ajaxSpareData,
      fnShowCancelStatus,
      ShowEditServiceCancelStatus,
      fnShowActiveCancelStatus,
      fnDeleteServiceRequestCancel,
      myCustomSearchFilter1,
      myCustomSearchFilter2,
      formatDate
    }
  }
}
</script>
