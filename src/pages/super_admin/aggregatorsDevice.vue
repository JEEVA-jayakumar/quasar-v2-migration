<template>
  <q-page class="q-pa-md">
    <q-tabs v-model="tab" class="shadow-1" color="grey-1">
      <q-tab name="active" label="Active Aggregators Device" />
      <q-tab name="deactive" label="Deactive Aggregators Device" />

      <q-tab-panels v-model="tab" animated>
        <!-- Active Aggregators Table -->
        <q-tab-panel name="active">
          <q-table
            :rows="activeTableData"
            :columns="columns"
            :filter="filterSearch"
            row-key="id"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            flat
            bordered
            color="grey-9"
          >
            <template #top>
              <div class="row items-center q-my-sm">
                <div class="col-6">
                  <q-input
                    outlined
                    clearable
                    v-model="filterSearch"
                    placeholder="Type.."
                    dense
                    color="grey-9"
                  />
                </div>
                <div class="col-6 text-right">
                  <q-btn
                    no-caps
                    label="Add New Aggregators Device"
                    color="purple-9"
                    size="md"
                    @click="fnShowAddNewAggregatorsDevice"
                  />
                </div>
              </div>
            </template>

            <template #body-cell-name="props">
              {{ props.row.aggregator?.name || 'NA' }}
            </template>

            <template #body-cell-action="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  no-caps
                  label="Modify"
                  icon="far fa-plus-square"
                  size="md"
                  class="text-light-blue"
                  @click="fnShowEditAggregatorDevice(props.row)"
                />
                <q-btn
                  dense
                  flat
                  no-caps
                  label="Disable"
                  icon="far fa-minus-square"
                  size="md"
                  class="text-negative"
                  @click="fnDeleteAggregatorsDevice(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Deactive Aggregators Table -->
        <q-tab-panel name="deactive">
          <q-table
            :rows="deActiveTableData"
            :columns="columns1"
            :filter="filterSearch"
            row-key="id"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            flat
            bordered
            color="grey-9"
          >
            <template #top>
              <div class="row items-center q-my-sm">
                <div class="col-6">
                  <q-input
                    outlined
                    clearable
                    v-model="filterSearch"
                    placeholder="Type.."
                    dense
                    color="grey-9"
                  />
                </div>
              </div>
            </template>

            <template #body-cell-name="props">
              {{ props.row.aggregator?.name || 'NA' }}
            </template>

            <template #body-cell-action1="props">
              <div class="row no-wrap no-padding">
                <q-btn
                  dense
                  flat
                  no-caps
                  label="Active"
                  icon="far fa-plus-square"
                  size="md"
                  class="text-positive"
                  @click="fnActivate(props.row)"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-tabs>

    <!-- Modals -->
    <showCreateRegion
      v-if="propShowCreateRegions"
      :propShowCreateRegions="propShowCreateRegions"
      @emitfnshowRegions="fnshowCreateRegions"
      @emitfnForRegionTable="ajaxLoadDataForRegionTable"
    />

    <showEditAggregatorDevice
      v-if="propShowEditAggregatorDevice"
      :propShowEditAggregatorDevice="propShowEditAggregatorDevice"
      :propRowDetails="propRowDetails"
      @emitfnShowEditAggregatorDevice="fnShowEditAggregatorDevice"
    />

    <ShowAddNewAggregatorsDevice
      v-if="propShowAddNewAggregatorsDevice"
      :propShowAddNewAggregatorsDevice="propShowAddNewAggregatorsDevice"
      :propRowDetails="propRowDetails"
      @emitfnShowAddNewAggregatorsDevice="fnShowAddNewAggregatorsDevice"
    />
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import showCreateRegion from '../../components/super_admin/showCreateRegions.vue';
import showEditAggregatorDevice from '../../components/super_admin/showEditAggregatorDevice.vue';
import ShowAddNewAggregatorsDevice from '../../components/super_admin/ShowAddNewAggregatorsDevice.vue';

export default {
  name: 'regionsDevice',
  components: {
    showCreateRegion,
    showEditAggregatorDevice,
    ShowAddNewAggregatorsDevice,
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const tab = ref('active');
    const filterSearch = ref('');
    const paginationControl = ref({ rowsPerPage: 10 });

    const propShowCreateRegions = ref(false);
    const propShowEditAggregatorDevice = ref(false);
    const propShowAddNewAggregatorsDevice = ref(false);
    const propRowDetails = ref(null);

    const tableData = ref([]);
    const activeTableData = ref([]);
    const deActiveTableData = ref([]);

    const columns = [
      { name: 'name', label: 'Aggregator', field: 'name', align: 'left', sortable: false },
      { name: 'deviceName', label: 'Device', field: 'deviceName', align: 'left', sortable: false },
      { name: 'action', label: '', field: 'action', align: 'left', sortable: false },
    ];

    const columns1 = [
      { name: 'name', label: 'Aggregator', field: 'name', align: 'left', sortable: false },
      { name: 'deviceName', label: 'Device', field: 'deviceName', align: 'left', sortable: false },
      { name: 'action1', label: '', field: 'action1', align: 'left', sortable: false },
    ];

    const getCreatedAggregatorDeviceList = computed(() => store.getters['superAdminAggregatorsDevice/getCreatedAggregatorDeviceList']);

    const ajaxLoadDataForRegionTable = async () => {
      try {
        await store.dispatch('superAdminAggregatorsDevice/GET_CREATED_AGGREGATORS_DEVICE_LIST');
        tableData.value = getCreatedAggregatorDeviceList.value;
        activeTableData.value = tableData.value.filter(item => item.active);
        deActiveTableData.value = tableData.value.filter(item => !item.active);
      } catch (error) {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: error?.body?.message || 'Please Try Again Later!',
          icon: 'thumb_down',
        });
      }
      store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA');
    };

    const fnActivate = async (row) => {
      try {
        await $q.dialog({ title: 'Confirm', message: 'Are you sure want to activate?', ok: 'Continue', cancel: 'Cancel' });
        $q.loading.show({ delay: 100, message: 'Please Wait', spinnerColor: 'purple-9', customClass: 'shadow-none' });
        await store.dispatch('superAdminAggregatorsDevice/EDIT_CREATED_AGGREGATORS_DEVICE_LIST', row);
        $q.notify({ color: 'positive', position: 'bottom', message: 'Successfully Activated', icon: 'thumb_up' });
        await ajaxLoadDataForRegionTable();
      } catch {
        $q.notify({ color: 'negative', position: 'bottom', message: 'No changes made!', icon: 'thumb_down' });
      } finally {
        $q.loading.hide();
      }
    };

    const fnDeleteAggregatorsDevice = async (row) => {
      try {
        await $q.dialog({ title: 'Confirm', message: 'Are you sure want to delete?', ok: 'Continue', cancel: 'Cancel' });
        $q.loading.show({ delay: 100, message: 'Please Wait', spinnerColor: 'purple-9', customClass: 'shadow-none' });
        await store.dispatch('superAdminAggregatorsDevice/DELETE_CREATED_AGGREGATORS_DEVICE_LIST', row);
        $q.notify({ color: 'positive', position: 'bottom', message: 'Successfully removed', icon: 'thumb_up' });
        await ajaxLoadDataForRegionTable();
      } catch {
        $q.notify({ color: 'negative', position: 'bottom', message: 'No changes made!', icon: 'thumb_down' });
      } finally {
        $q.loading.hide();
      }
    };

    const fnShowAddNewAggregatorsDevice = (row) => {
      propShowAddNewAggregatorsDevice.value = !propShowAddNewAggregatorsDevice.value;
      propRowDetails.value = row || null;
    };

    const fnShowEditAggregatorDevice = (row, token) => {
      propShowEditAggregatorDevice.value = !propShowEditAggregatorDevice.value;
      propRowDetails.value = row || null;
      if (token === 'refresh') ajaxLoadDataForRegionTable();
    };

    const fnshowCreateRegions = () => {
      propShowCreateRegions.value = !propShowCreateRegions.value;
    };

    const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
      const lowerTerms = terms?.toLowerCase() || '';
      return rows.filter(row => cols.some(col => `${cellValue(col, row)}`.toLowerCase().includes(lowerTerms)));
    };

    onMounted(() => {
      ajaxLoadDataForRegionTable();
    });

    return {
      tab,
      filterSearch,
      paginationControl,
      propShowCreateRegions,
      propShowEditAggregatorDevice,
      propShowAddNewAggregatorsDevice,
      propRowDetails,
      activeTableData,
      deActiveTableData,
      columns,
      columns1,
      fnActivate,
      fnDeleteAggregatorsDevice,
      fnShowAddNewAggregatorsDevice,
      fnShowEditAggregatorDevice,
      fnshowCreateRegions,
      myCustomSearchFilter,
    };
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
