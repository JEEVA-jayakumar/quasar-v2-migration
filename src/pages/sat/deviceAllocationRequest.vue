<template>
  <q-page padding>

    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Device Request
    </div>

    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      row-key="id"
      :filter="filter"
      v-model:pagination="paginationControl"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="onRequest"
    >
      <!-- Body Slots -->
      <template #body-cell-soName="props">
        {{ props.row.soName ?? 'NA' }}
      </template>

      <template #body-cell-action="props">
        <q-btn
          v-if="props.row.status === 0"
          highlight
          push
          class="q-mx-sm"
          color="positive"
          size="sm"
          @click="approveDeviceRequest(props.row)"
        >
          Approve
        </q-btn>

        <q-btn
          v-if="props.row.status === 0"
          highlight
          push
          class="q-mx-sm"
          color="negative"
          size="sm"
          @click="deviceRequest(props.row)"
        >
          Reject
        </q-btn>

        <span v-if="props.row.status === 1" class="label text-green">
          Device Allocated Successfully
        </span>

        <div v-if="props.row.status === 2">
          <span class="label text-red">Rejected</span>
          <br />
          <span class="label text">Remarks: {{ props.row.remarks ?? 'NA' }}</span>
        </div>
      </template>

      <!-- Top Slot for Search -->
      <template #top>
        <div class="col-5">
          <q-search
            clearable
            v-model="filter"
            separator
            color="grey-9"
            placeholder="Type.."
            float-label="Search Using POD, Serial No, Merchant Name"
            class="q-mr-lg q-py-sm"
          />
        </div>
      </template>
    </q-table>

    <!-- Device Allocation Modal -->
    <deviceAllocationRequest
      v-if="showRequestModal"
      :showRequestModal="showRequestModal"
      :showRequestComponent="propsLostAppend"
      @closeLostModel="deviceRequest"
    />

    <!-- Fullscreen Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars
        class="absolute-center"
        size="35"
        color="#61116a"
      />
    </div>

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import moment from 'moment';
import { mapActions } from 'vuex';

import deviceAllocationRequest from '../../components/sat/rejectDeviceRequest.vue';

export default {
  name: 'DeviceRequestPage',

  components: { deviceAllocationRequest },

  setup() {
    const $q = useQuasar();

    // Reactive Data
    const tableData = ref([]);
    const filter = ref('');
    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      rowsPerPage: 10
    });

    const toggleAjaxLoadFilter = ref(false);
    const toggleAjaxLoadFilter1 = ref(false);
    const showRequestModal = ref(false);
    const propsLostAppend = ref({});

    // Columns
    const columns = [
      { name: 'soName', label: 'SO Name', align: 'left', field: row => row.soName ?? 'NA', sortable: true },
      { name: 'serialNumber', label: 'Serial Number', align: 'left', field: row => row.regionalInventory?.serialNumber ?? 'NA', sortable: true },
      { name: 'podNumber', label: 'POD', align: 'left', field: row => row.podNumber ?? 'NA', sortable: false },
      { name: 'requestedAt', label: 'Requested Date', align: 'left', field: row => moment(row.requestedAt).format('DD/MM/YYYY'), sortable: false },
      { name: 'actionedAt', label: 'Actioned Date', align: 'center', field: row => row.actionedAt ? moment(row.actionedAt).format('DD/MM/YYYY') : 'NA', sortable: false },
      { name: 'action', label: 'Action', align: 'center', field: 'action', sortable: false }
    ];

    // Vuex
    const { BIJLIPAY_SELF_ASSIGNMENT_TRACKER, APPROVE_BIJLIPAY_SELF_ASSIGNMENT } = mapActions('VerifyDevice', [
      'BIJLIPAY_SELF_ASSIGNMENT_TRACKER',
      'APPROVE_BIJLIPAY_SELF_ASSIGNMENT'
    ]);

    // Methods
    const loadTableData = async ({ pagination, filterValue }) => {
      toggleAjaxLoadFilter.value = true;
      $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ...' });
      try {
        const res = await BIJLIPAY_SELF_ASSIGNMENT_TRACKER({ pagination, filter: filterValue });
        const responseData = res.body.data;
        paginationControl.value = pagination;
        paginationControl.value.rowsNumber = responseData.totalElements;
        paginationControl.value.page = responseData.number + 1;
        tableData.value = responseData.content;
      } catch (err) {
        console.error(err);
      } finally {
        toggleAjaxLoadFilter.value = false;
        $q.loading.hide();
      }
    };

    const onRequest = ({ pagination, filter }) => loadTableData({ pagination, filterValue: filter });

    const deviceRequest = (row) => {
      showRequestModal.value = !showRequestModal.value;
      propsLostAppend.value = row;
      if (!showRequestModal.value) {
        loadTableData({ pagination: paginationControl.value, filterValue: filter.value });
      }
    };

    const approveDeviceRequest = (row) => {
      const param = { selfAssignmentId: row.id, serialNumber: row.regionalInventory.serialNumber };
      $q.dialog({ title: 'Confirm', message: 'Are you sure want to Approve the lead?', ok: 'Continue', cancel: 'Cancel' })
        .onOk(async () => {
          $q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Processing ..' });
          try {
            await APPROVE_BIJLIPAY_SELF_ASSIGNMENT(param);
            loadTableData({ pagination: paginationControl.value, filterValue: filter.value });
            $q.notify({ color: 'positive', position: 'bottom', message: 'Approved Successfully', icon: 'clear' });
          } catch (error) {

            $q.notify({ color: 'negative', position: 'bottom', message: error.body?.message ?? 'Please try again later!', icon: 'thumb_down' });
          } finally {
            $q.loading.hide();
          }
        });
    };

    onMounted(() => {
      loadTableData({ pagination: paginationControl.value, filterValue: filter.value });
    });

    return {
      tableData,
      columns,
      filter,
      paginationControl,
      toggleAjaxLoadFilter,
      toggleAjaxLoadFilter1,
      showRequestModal,
      propsLostAppend,
      deviceRequest,
      approveDeviceRequest,
      onRequest
    };
  }
};
</script>

<style scoped>
.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
