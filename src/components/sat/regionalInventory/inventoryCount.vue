<template>
  <div class="row">
    <!-- LEFT PANEL -->
    <div class="col-md-4" style="border-right: 1px solid #ccc;">
      <div class="q-ma-md">
        <div class="q-mb-md text-subtitle1">
          Region: {{ computedUserRegion }}
        </div>

        <!-- Inventory with Region -->
        <q-card flat bordered>
          <q-card-section>
            <h6 class="q-ma-none">Inventory with Region</h6>
          </q-card-section>

          <q-separator />

          <q-card-section
            class="cursor-pointer bg-grey-5 text-center"
            :class="activeItemId === $REGIONAL_INVENTORY_ALL_DEVICES ? 'shadow-5' : ''"
            @click="loadDevicesTableData($REGIONAL_INVENTORY_ALL_DEVICES,{name:'Total Devices'})"
          >
            <div>Count</div>
            <div class="text-h6">{{ fngetAllRegionalInventorySerialNumbersByDevice() }}</div>
          </q-card-section>
        </q-card>

        <!-- COUNTERS -->
        <div class="row q-col-gutter-md q-mt-md">
          <template v-for="(cfg, idx) in summaryCards" :key="idx">
            <div class="col-md-6">
              <q-card flat bordered class="cursor-pointer">
                <q-card-section class="text-subtitle2">
                  {{ cfg.title }}
                </q-card-section>
                <q-separator />
                <q-card-section
                  class="bg-grey-5 text-center"
                  :class="activeItemId === cfg.id ? 'shadow-5' : ''"
                  @click="loadDevicesTableData(cfg.id,{name:cfg.title})"
                >
                  <div>Count</div>
                  <div class="text-h6">{{ cfg.count }}</div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="col-md-8">
      <div class="row items-center q-pa-sm bottom-border">
        <div class="text-grey-9 text-subtitle1">
          {{ inventoryCountTableTitle }}
        </div>
      </div>

      <q-table
        class="q-mt-sm"
        :rows="getAllRegionalInventorySerialNumbersByDevice"
        :columns="columnData"
        row-key="serialNumber"
        :loading="toggleAjaxLoadFilter"
        v-model:pagination="paginationControl"
        :filter="filter"
      >
        <!-- ACTION COLUMN -->
        <template #body-cell-action="{ row }" v-if="info === 6">
          <q-btn
            flat
            dense
            label="Usable"
            icon="check"
            color="primary"
            @click="fnShowUsable(row)"
          />
          <q-btn
            flat
            dense
            label="Faulty"
            icon="close"
            color="negative"
            @click="fnShowFaulty(row)"
          />
        </template>

        <!-- TOP SLOT -->
        <template #top>
          <div class="row full-width items-center">
            <div class="col-md-6">
              <q-input
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search by SO Name, Serial Number"
                clearable
              />
            </div>

            <div class="col-md-6 text-right">
              <downloadExcel
                :data="getAllRegionalInventorySerialNumbersByDevice"
                :fields="json_fields"
                name="InventoryWithSO.xls"
              >
                <q-btn outline label="Download as Excel" />
              </downloadExcel>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import downloadExcel from 'vue-json-excel'

export default {
  name: 'RegionalInventory',

  components: { downloadExcel },

  data () {
    return {
      toggleAjaxLoadFilter: false,
      paginationControl: { rowsPerPage: 10 },
      filter: '',
      info: '',
      activeItemId: null,
      inventoryCountTableTitle: 'Total Devices',

      json_fields: {
        DeviceType: 'device.deviceName',
        SerialNumber: 'serialNumber'
      },

      columnData: [
        {
          name: 'device_type',
          label: 'Device Type',
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
          name: 'user',
          label: 'SO Name',
          field: row => row.user ? `${row.user.name} | ${row.user.employeeID}` : 'NA'
        },
        { name: 'action', label: '', sortable: false }
      ]
    }
  },

  computed: {
    ...mapGetters('SAT_RegionalInventoryAllocation', [
      'getAllRegionalInventoryDeviceDetailsWithCount',
      'getAllRegionalInventorySerialNumbersByDevice'
    ]),

    computedUserRegion () {
      return JSON.parse(localStorage.getItem('u_i')).region.regionAreaName
    },

    summaryCards () {
      const d = this.getAllRegionalInventoryDeviceDetailsWithCount
      return [
        { id: this.$REGIONAL_INVENTORY_PENDING_ALLOCATION_DEVICE, title: 'Pending Allocation', count: d.pendingDeviceCount?.count },
        { id: this.$REGIONAL_INVENTORY_ALLOCATED_DEVICE, title: 'Allocated Devices', count: d.allocatedCount?.count },
        { id: this.$REGIONAL_INVENTORY_DAMAGED_DEVICE, title: 'Damaged Devices', count: d.damageDeviceCount?.count },
        { id: this.$REGIONAL_INVENTORY_INBOUND_DEVICE, title: 'Inbound Devices', count: d.inbountDeviceCount?.count },
        { id: this.$REGIONAL_INVENTORY_FAULTY_DEVICE, title: 'Pending List From App', count: d.pendingListFromAppCount?.count }
      ]
    }
  },

  created () {
    this.FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT()
  },

  methods: {
    ...mapActions('SAT_RegionalInventoryAllocation', [
      'FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT',
      'FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE'
    ]),
    ...mapActions('InventoryCentral', ['USEABLE_DEVICE', 'FAULTY_DEVICE']),

    fngetAllRegionalInventorySerialNumbersByDevice () {
      return this.getAllRegionalInventoryDeviceDetailsWithCount.inventryCount
        ?.reduce((sum, v) => sum + v.count, 0)
    },

    loadDevicesTableData (id, item) {
      this.activeItemId = id
      this.inventoryCountTableTitle = item.name
    },

    fnShowUsable (row) {
      this.USEABLE_DEVICE(row)
    },

    fnShowFaulty (row) {
      this.FAULTY_DEVICE(row)
    }
  }
}
</script>
