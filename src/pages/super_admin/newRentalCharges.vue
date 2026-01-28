<template>
  <q-page>
    <div>
      <!-- Tabs -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        active-color="dark"
        indicator-color="dark"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="active" label="Active Rental Charges" />
        <q-tab name="deactive" label="DeActived Rental Charges" />
      </q-tabs>

      <!-- Panels -->
      <q-tab-panels v-model="selectedTab" animated>
        <!-- ACTIVE -->
        <q-tab-panel name="active">
          <q-table
            table-class="customTableClass"
            :rows="tableData"
            :columns="columns"
            :filter="filterSearch"
            row-key="id"
            :loading="toggleAjaxLoadFilter"
            :rows-per-page-options="[5,10,15,20]"
            v-model:pagination="paginationControl"
            @request="ajaxLoadAllLeadInfo"
          >
            <!-- Top -->
            <template v-slot:top>
              <div class="row q-col-gutter-md full-width">
                <div class="col-md-6">
                  <q-input
                    v-model.trim="filterSearch"
                    type="search"
                    clearable
                    label="Search by Plan Name"
                    color="grey-9"
                  />
                </div>
                <div class="col-md-6 text-right">
                  <q-btn
                    no-caps
                    color="purple-9"
                    label="Add New Rental Charges"
                    @click="$router.push('/super/admin/manage/rental/charges')"
                  />
                </div>
              </div>
            </template>

            <!-- Cells -->
            <template v-slot:body-cell-leadSource="props">
              <q-td :props="props" class="cursor-pointer text-primary">
                {{ props.row.leadSource?.sourceName }}
              </q-td>
            </template>

            <template v-slot:body-cell-device="props">
              <q-td :props="props" class="cursor-pointer text-primary">
                {{ props.row.device?.deviceName }}
              </q-td>
            </template>

            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td :props="props">
                {{ props.row.marsDeviceModel?.name || 'NA' }}
              </q-td>
            </template>

            <template v-slot:body-cell-plan="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  icon="fas fa-pencil-alt"
                  color="primary"
                  :label="props.row.plan?.planName"
                  @click="editPlanDetails(props.row)"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  no-caps
                  icon="far fa-minus-square"
                  label="Disable"
                  class="text-negative"
                  @click="fnDeleteRental(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- DEACTIVE -->
        <q-tab-panel name="deactive">
          <q-table
            table-class="customTableClass"
            :rows="deactiveTableData"
            :columns="columnsDeactive"
            :filter="filterSearch1"
            row-key="id"
            :loading="toggleAjaxLoadFilter1"
            :rows-per-page-options="[5,10,15,20]"
            v-model:pagination="paginationControl1"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:top>
              <div class="row q-col-gutter-md full-width">
                <div class="col-md-6">
                  <q-input
                    v-model.trim="filterSearch1"
                    type="search"
                    clearable
                    label="Search by Plan Name"
                    color="grey-9"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action1="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  no-caps
                  icon="far fa-plus-square"
                  label="Enable"
                  class="text-positive"
                  @click="fnEnableRental(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Edit Dialog -->
      <EditRentalCharges
        v-if="propShoweditPlanDetails"
        :propShoweditPlanDetails="propShoweditPlanDetails"
        :propRowDetails="propRowDetails"
        @emitfnshowEditRental="editPlanDetails"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import EditRentalCharges from '../../pages/super_admin/editRentalCharges.vue'

const $q = useQuasar()
const store = useStore()

/* ---------------- state ---------------- */
const selectedTab = ref('active')
const filterSearch = ref('')
const filterSearch1 = ref('')
const toggleAjaxLoadFilter = ref(false)
const toggleAjaxLoadFilter1 = ref(false)
const tableData = ref([])
const deactiveTableData = ref([])
const propShoweditPlanDetails = ref(false)
const propRowDetails = ref(null)

const paginationControl = ref({ page: 1, rowsPerPage: 10 })
const paginationControl1 = ref({ page: 1, rowsPerPage: 10 })

/* ---------------- columns ---------------- */
const columns = [
  { name: 'plan', label: 'Plan Name', field: r => r.plan?.planName, sortable: true },
  { name: 'leadSource', label: 'Lead Source', field: r => r.leadSource?.sourceName },
  { name: 'device', label: 'Device Type', field: r => r.device?.deviceName },
  { name: 'marsDeviceModel', label: 'Mars Device Model', field: r => r.marsDeviceModel?.name },
  { name: 'setupFees', label: 'Setup Fees', field: 'setupFees' },
  { name: 'monthlyFees', label: 'Recurring Fees', field: 'monthlyFees' },
  { name: 'action', label: '', field: 'action' }
]

const columnsDeactive = [...columns.slice(0, -1), { name: 'action1', label: '', field: 'action' }]

/* ---------------- methods ---------------- */
const goToUnassignedTab = tab => {
  tab === 'deactive'
    ? ajaxLoadAllLeadInfo1()
    : ajaxLoadAllLeadInfo()
}

const ajaxLoadAllLeadInfo = async () => {
  toggleAjaxLoadFilter.value = true
  await store.dispatch('rentalCharges/FETCH_ALL_RENTAL_PLAN_DETAILS')
  tableData.value = store.getters['rentalCharges/getAllRentalPlanDetails']?.content || []
  toggleAjaxLoadFilter.value = false
}

const ajaxLoadAllLeadInfo1 = async () => {
  toggleAjaxLoadFilter1.value = true
  await store.dispatch('rentalCharges/FETCH_DEACTIVATED_RENTAL_PLAN_DETAILS')
  deactiveTableData.value = store.getters['rentalCharges/getDeactivatedRentalPlanDetails']?.content || []
  toggleAjaxLoadFilter1.value = false
}

const fnDeleteRental = row => {
  $q.dialog({ title: 'Confirm', message: 'Delete Rental?', cancel: true })
    .onOk(async () => {
      row.active = false
      await store.dispatch('rentalCharges/ENABLE_OR_DISABLE_RENTAL_PLAN', row)
      ajaxLoadAllLeadInfo()
    })
}

const fnEnableRental = row => {
  $q.dialog({ title: 'Confirm', message: 'Enable Rental?', cancel: true })
    .onOk(async () => {
      row.active = true
      await store.dispatch('rentalCharges/ENABLE_OR_DISABLE_RENTAL_PLAN', row)
      ajaxLoadAllLeadInfo1()
    })
}

const editPlanDetails = row => {
  propShoweditPlanDetails.value = !propShoweditPlanDetails.value
  if (row) propRowDetails.value = row
}

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  ajaxLoadAllLeadInfo()
  ajaxLoadAllLeadInfo1()
})
</script>

<style scoped>
.customTabActive {
  background: purple;
  color: #fff;
}
</style>
