<template>
  <div class="row q-ma-md">

    <!-- LEFT PANEL -->
    <div class="col-md-4" style="border-right: 1px solid #ccc;">

      <!-- STEP 1 -->
      <div class="row group items-baseline">
        <div class="col-12">
          <q-chip color="purple-9">Step -1</q-chip>
          &nbsp; Enter POD number and submit
        </div>

        <div class="col">
          <q-input
            v-model="podNumber"
            color="grey-9"
            label="Enter POD Number"
            placeholder="POD Number"
            @keyup.enter="fnCookDispatchedHistoryDetails"
            class="q-py-sm"
          />
        </div>

        <div class="col-auto">
          <q-btn
            :disabled="!podNumber"
            label="Submit"
            class="text-white common-dark-blue q-py-sm"
            @click="fnCookDispatchedHistoryDetails"
          />
        </div>
      </div>

      <!-- STEP 2 -->
      <div class="row q-mt-md">
        <div class="col-12 q-pa-sm">
          <q-chip color="purple-9">Step -2</q-chip>
          &nbsp; Select a device type
        </div>

        <div class="col-12">
          <div
            v-for="(item, index) in inventoryData.regionalInventoryCount"
            :key="index"
            class="q-pa-sm cursor-pointer"
            @click="fnShowDisptachedeviceHistory(index, item)"
          >
            <q-card
              class="q-pa-sm"
              :class="activeDispatchedItemId === index ? 'shadow-8' : 'shadow-0'"
              :style="{
                background: item.device.colorCode || '#ccc'
              }"
            >
              <q-card-section>
                <div class="row text-dark">
                  <div class="col-8">
                    <div>{{ item.device.deviceName }}</div>
                    <div>{{ formatDate(item.device.createDate) }}</div>
                  </div>
                  <div class="col-4 text-right">
                    <div>Count</div>
                    <div class="text-h6">{{ item.count }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="col-md-8">

      <div class="q-pa-sm">
        <p>
          <q-chip color="purple-9">Step -3</q-chip> Click on scan
        </p>
        <p>
          <q-chip color="purple-9">Step -4</q-chip> Upload to regional inventory
        </p>
      </div>

      <q-table
        title="Lead Validation"
        class="customTableClass"
        :rows="inventoryData.regionalInventoryList"
        :columns="columnData"
        :filter="filter"
        row-key="serialNumber"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
      >

        <!-- STATUS CELL -->
        <template v-slot:body-cell-inboundVerified="props">
          <q-td :props="props">
            <q-icon
              v-if="props.row.inboundVerifiedStatus === 1"
              name="check"
              color="positive"
            />
            <q-icon
              v-else-if="props.row.inboundVerifiedStatus === 2"
              name="close"
              color="negative"
            />
            <q-icon
              v-else
              name="warning"
              color="amber-9"
            />
          </q-td>
        </template>

        <!-- TOP BAR -->
        <template v-slot:top>
          <div class="row full-width items-center">
            <div class="col-12 col-lg-4">
              <q-input
                v-model="filter"
                debounce="300"
                clearable
                color="grey-9"
                placeholder="Search by device name, serial no"
              />
            </div>

            <div class="col-12 col-lg-8 text-right">
              <q-btn
                outline
                class="common-dark-blue"
                v-if="toggleScanButton"
                :disable="!currentDeviceId"
                @click="fnShowDevicesVerificationStart"
              >
                Scan
              </q-btn>

              <q-btn
                outline
                class="text-faded q-ml-sm"
                :disable="computeEnableUploadToInventory.length === 0"
                @click="fnUploadDeviceSerialNumbersAsPending"
              >
                Upload to regional inventory
              </q-btn>
            </div>
          </div>
        </template>

      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

/* props */
defineProps({
  propMerchantTypeFromSO: String
})

const $q = useQuasar()
const store = useStore()

/* state */
const podNumber = ref('')
const currentDeviceId = ref(null)
const toggleScanButton = ref(true)
const toggleAjaxLoadFilter = ref(false)
const activeDispatchedItemId = ref(null)
const filter = ref('')

const paginationControl = ref({
  rowsPerPage: 10
})

/* getters */
const inventoryData = computed(() =>
  store.getters['SAT_RegionalInventoryAllocation/getAllRegionalInventoryPDOBasedDevicesWithCount']
)

/* computed */
const computeEnableUploadToInventory = computed(() =>
  inventoryData.value.regionalInventoryList?.filter(
    d => d.inboundVerifiedStatus === 1
  ) || []
)

/* columns */
const columnData = [
  {
    name: 'device',
    label: 'Device',
    field: row => row.device.deviceName,
    sortable: true
  },
  {
    name: 'serialNumber',
    label: 'Serial Number',
    field: 'serialNumber',
    sortable: true
  },
  {
    name: 'inboundVerified',
    label: 'Status',
    sortable: true
  }
]

/* utils */
const formatDate = date =>
  dayjs(date).format('MMMM D YYYY')

/* actions */
const dispatch = store.dispatch

const fnCookDispatchedHistoryDetails = async () => {
  toggleAjaxLoadFilter.value = true
  try {
    await dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_PDO_BASED_DEVICE_DETAIL_WITH_COUNT',
      { podNumber: podNumber.value }
    )
  } catch (err) {
    $q.notify({
      color: 'warning',
      message: err?.data?.message || 'Error occurred'
    })
  } finally {
    toggleAjaxLoadFilter.value = false
  }
}

const fnShowDisptachedeviceHistory = async (index, item) => {
  activeDispatchedItemId.value = index
  currentDeviceId.value = item.device.id
  toggleAjaxLoadFilter.value = true

  try {
    await dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_PDO_BASED_DEVICE_DETAIL_WITH_COUNT',
      { podNumber: podNumber.value, device: item.device.id }
    )
  } finally {
    toggleAjaxLoadFilter.value = false
  }
}

const fnShowDevicesVerificationStart = () => {
  if (!currentDeviceId.value) {
    $q.notify({ color: 'negative', message: 'Choose a device from the list' })
    return
  }
  toggleScanButton.value = false
}

const fnUploadDeviceSerialNumbersAsPending = async () => {
  try {
    await dispatch(
      'SAT_RegionalInventoryAllocation/CONVERT_INBOUND_TO_ACTIVE_DEVICE',
      { podNumber: podNumber.value }
    )
    $q.notify({
      color: 'positive',
      message: 'Successfully added to inventory'
    })
  } catch {
    $q.notify({ color: 'negative', message: 'Please try again' })
  }
}
</script>
