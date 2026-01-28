<template>
  <q-page class="q-pa-md">

    <div class="text-h6 q-px-lg q-py-md bottom-border text-grey-9">
      Aggregator Implementation Queue
    </div>

    <!-- POPUPS -->
    <generalLeadInformation
      v-if="showLeadInfo"
      :leadInformation="selectedLeadInfo"
      @closeLeadInformation="showLeadInfo = false"
    />

    <changeRegionModal
      v-if="showRegionChange"
      :regionInformation="selectedRegionInfo"
      @closeRegionInformation="onRegionClose"
    />

    <!-- ACTION BAR -->
    <q-card v-if="selectedTab === 'unAssigned'" class="q-pa-md q-mb-md">
      <div class="row items-center">

        <div class="col-3 text-grey-7">
          <span class="text-h6">{{ selectedUnassigned.length }}</span> / selected
        </div>

        <div class="col-4">
          <q-select
            v-model="form.assignTo"
            :options="assignToOptions"
            label="Assign To"
            clearable
            :disable="selectedUnassigned.length === 0"
          />
          <q-checkbox
            v-model="form.courier"
            label="Courier Device"
          />
        </div>

        <div class="col-3 text-right">
          <q-btn
            label="Assign"
            color="primary"
            :disable="selectedUnassigned.length === 0 || !form.assignTo"
            @click="assignImplementationUser"
          />
        </div>

        <div v-if="id === '3'" class="col-2 text-right">
          <q-btn
            label="Re-Assign Region"
            color="primary"
            :disable="selectedUnassigned.length === 0"
            @click="openRegionChange"
          />
        </div>

      </div>
    </q-card>

    <!-- TABS -->
    <q-tabs v-model="selectedTab" dense class="shadow-1">
      <q-tab name="unAssigned" label="Unassigned" />
      <q-tab name="assigned" label="Assigned" />
      <q-tab name="cancelledMerchants" label="Cancelled Merchants" />
    </q-tabs>

    <!-- TAB PANELS -->
    <q-tab-panels v-model="selectedTab" animated>

      <!-- UNASSIGNED -->
      <q-tab-panel name="unAssigned">
        <q-table
          :rows="tableUnassigned"
          :columns="columnUnassigned"
          row-key="id"
          selection="multiple"
          v-model:selected="selectedUnassigned"
          v-model:pagination="paginationUnassigned"
          :loading="loadingUnassigned"
          @request="loadUnassigned"
        >

          <template v-slot:top>
            <q-input
              v-model="filterUnassigned"
              type="search"
              label="Search MID / Merchant"
              dense
              debounce="400"
            />
          </template>

          <template v-slot:body-cell-leadNumber="props">
            <q-td>
              <span
                class="text-primary cursor-pointer"
                @click="openLeadInfo(props.row.leadInformation)"
              >
                # {{ props.row.leadInformation.leadNumber }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-deviceAddress="props">
            <q-td>
              <q-btn
                icon="edit"
                size="xs"
                round
                color="purple"
                @click="openDeviceAddress(props.row)"
              />
              {{ props.row.deviceAddress }}
            </q-td>
          </template>

        </q-table>
      </q-tab-panel>

      <!-- ASSIGNED -->
      <q-tab-panel name="assigned">
        <Phonepeassigned />
      </q-tab-panel>

      <!-- CANCELLED -->
      <q-tab-panel name="cancelledMerchants">
        <q-table
          :rows="tableCancelled"
          :columns="columnCancelled"
          row-key="id"
          selection="multiple"
          v-model:selected="selectedCancelled"
          v-model:pagination="paginationCancelled"
          :loading="loadingCancelled"
          @request="loadCancelled"
        />

        <div class="row q-mt-md justify-end">
          <q-btn
            label="Cancel"
            color="negative"
            class="q-mr-sm"
            :disable="selectedCancelled.length === 0"
            @click="cancelImplementationUser"
          />
          <q-btn
            label="Re-Assign"
            color="primary"
            :disable="selectedCancelled.length === 0"
            @click="reAssignImplementationUser"
          />
        </div>
      </q-tab-panel>

    </q-tab-panels>

    <!-- DEVICE ADDRESS MODAL -->
    <DeviceAddressModal
      v-if="showDeviceAddress"
      :currentDeviceInfo="currentDeviceInfo"
      :stateInformation="states"
      @toggleModal="showDeviceAddress = false"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import DeviceAddressModal from 'components/sat/DeviceAddressModal.vue'
import generalLeadInformation from 'components/generalLeadInformation.vue'
import Phonepeassigned from 'components/sat/Phonepeassigned.vue'
import changeRegionModal from 'components/changeRegionModal.vue'

const store = useStore()
const $q = useQuasar()

/* STATE */
const selectedTab = ref('assigned')
const id = ref(localStorage.getItem('selectedTab')?.split('|')[1])

const showLeadInfo = ref(false)
const showRegionChange = ref(false)
const showDeviceAddress = ref(false)

const selectedLeadInfo = ref(null)
const selectedRegionInfo = ref(null)
const currentDeviceInfo = ref({})

const form = ref({
  assignTo: null,
  courier: false
})

/* TABLE STATES */
const selectedUnassigned = ref([])
const selectedCancelled = ref([])

const filterUnassigned = ref('')
const tableUnassigned = ref([])
const tableCancelled = ref([])

const loadingUnassigned = ref(false)
const loadingCancelled = ref(false)

const paginationUnassigned = ref({ page: 1, rowsPerPage: 10 })
const paginationCancelled = ref({ page: 1, rowsPerPage: 10 })

/* OPTIONS */
const assignToOptions = ref([])
const states = store.getters['SuperAdminUsers/getAllStatesData']

/* METHODS */
const openLeadInfo = info => {
  selectedLeadInfo.value = info
  showLeadInfo.value = true
}

const openRegionChange = () => {
  selectedRegionInfo.value = selectedUnassigned.value
  showRegionChange.value = true
}

const onRegionClose = () => {
  showRegionChange.value = false
  loadUnassigned({ pagination: paginationUnassigned.value })
}

const openDeviceAddress = row => {
  currentDeviceInfo.value = row
  showDeviceAddress.value = true
}

/* API LOADERS */
const loadUnassigned = async ({ pagination }) => {
  loadingUnassigned.value = true
  await store.dispatch('phonepeImplementationQueue/PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST', {
    pagination,
    filter: filterUnassigned.value
  })
  tableUnassigned.value =
    store.getters['phonepeImplementationQueue/getPhonepeImplementationQueueUnassignedList'].content
  loadingUnassigned.value = false
}

const loadCancelled = async ({ pagination }) => {
  loadingCancelled.value = true
  await store.dispatch('phonepeImplementationQueue/PHONEPE_CANCELLED_MERCHANTS', {
    pagination
  })
  tableCancelled.value =
    store.getters['phonepeImplementationQueue/getPhonepeCancelledMerchants'].content
  loadingCancelled.value = false
}

/* ACTIONS */
const assignImplementationUser = async () => {
  $q.loading.show({ message: 'Assigning...' })
  await store.dispatch('phonepeImplementationQueue/PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT', {
    marsDeviceIds: selectedUnassigned.value.map(v => v.id),
    userId: form.value.assignTo,
    courier: form.value.courier
  })
  $q.loading.hide()
  loadUnassigned({ pagination: paginationUnassigned.value })
}

/* INIT */
onMounted(() => {
  loadUnassigned({ pagination: paginationUnassigned.value })
  loadCancelled({ pagination: paginationCancelled.value })
})
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
