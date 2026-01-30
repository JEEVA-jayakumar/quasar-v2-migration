<template>
  <q-page>
    <div>
      <!-- Page Header -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Inventory with SO/Bill Partner/Sub Region
      </div>

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        :data="inventoryData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="name"
      >
        <!-- Date Formatting for created_at -->
        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            {{ props.row.created_at ? moment(props.row.created_at).format('DD/MM/YYYY') : 'NA' }}
          </q-td>
        </template>

        <!-- Date Formatting for updated_at -->
        <template v-slot:body-cell-updated_at="props">
          <q-td :props="props">
            {{ props.row.updated_at ? moment(props.row.updated_at).format('DD/MM/YYYY') : 'NA' }}
          </q-td>
        </template>

        <!-- Top slot for search and download -->
        <template v-slot:top>
          <div class="row q-mb-sm">
            <div class="col-md-5">
              <q-search
                clearable
                v-model="filter"
                separator
                color="grey-9"
                placeholder="Type.."
                float-label="Pod Number, Device Type, Serial Number"
                class="q-mr-lg q-py-sm"
              />
            </div>
            <div class="col-md-5">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm float-right"
                size="md"
                @click="downloadInventoryWithSoList"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Download Reports Modal/Component -->
      <AggregatorDownloadInventorySoList
        v-if="propInventoryWithSo"
        :propInventoryWithSo="propInventoryWithSo"
        @emitfnshowInventoryWithSo="downloadInventoryWithSoList"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import moment from 'moment';
import AggregatorDownloadInventorySoList from '../components/DownloadAggregatorsInventoryWithSoList.vue';

const $q = useQuasar();
const store = useStore();

// Reactive states
const filter = ref('');
const propInventoryWithSo = ref(false);
const paginationControl = reactive({ rowsPerPage: 10 });
const inventoryData = ref([]);

// Table columns
const columns = [
  {
    name: 'name',
    label: 'So Name',
    align: 'center',
    field: row => `${row.name} | ${row.soEmpId}`,
    sortable: true
  },
  { name: 'pod_number', label: 'Pod Number', field: 'pod_number', align: 'center', sortable: true },
  { name: 'serial_number', label: 'Serial Number', field: 'serial_number', align: 'center', sortable: true },
  { name: 'device_name', label: 'Device Type', field: 'device_name', align: 'center', sortable: true },
  {
    name: 'created_at',
    label: 'Create Date',
    field: 'created_at',
    align: 'center',
    sortable: true
  },
  {
    name: 'updated_at',
    label: 'Receive Date',
    field: 'updated_at',
    align: 'center',
    sortable: true
  },
  { name: 'region_name', label: 'BPRegion', field: 'region_name', align: 'center', sortable: true }
];

// Computed getter for inventory data
const getInventoryWithSOAggregatorList = computed(() =>
  store.getters['superAdminAggregators/getInventoryWithSOAggregatorList']
);

// Sync computed data with local reactive variable
inventoryData.value = getInventoryWithSOAggregatorList.value;


// Fetch Inventory data
async function ajaxLoadAllLeadInfo() {
  $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ..' });

  try {
    await store.dispatch('superAdminAggregators/FETCH_AGGREGATOR_INVENTORY_WITH_SO_LIST');
    inventoryData.value = getInventoryWithSOAggregatorList.value;
    $q.loading.hide();
  } catch {
    $q.loading.hide();
  }
}

// Download Inventory Excel
function downloadInventoryWithSoList() {
  propInventoryWithSo.value = !propInventoryWithSo.value;
}

// On mounted, load inventory
onMounted(() => {
  ajaxLoadAllLeadInfo();
});
</script>

<style scoped>
.customTableClass {
  border-radius: 4px;
}

.q-mr-lg {
  margin-right: 1rem;
}

.q-py-sm {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>
