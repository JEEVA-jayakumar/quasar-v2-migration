<template>
  <q-page padding>
    <div>
      <!-- Table Title -->
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        DE-Mapping
      </div>

      <!-- Common lead information popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation.value"
        :leadInformation="addtnLeadInformation.value"
        :propToggleLeadInformationPop="propToggleLeadInformation.value"
        @closeLeadInformation="toggleLeadInformation"
      />

      <div class="side2 q-mb-md">
        <div class="row items-center gutter-y-sm">
          <div
            class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium"
            align="left"
          >
            <span class="q-display-2">{{
              formData.value.marsDeviceIdsDemapping.length
            }}</span>
            / selected
          </div>
        </div>
      </div>

      <!-- DE-Mapping Table -->
      <q-table
        flat
        :rows="tableData.value"
        :columns="columns"
        row-key="id"
        :filter="filter.value"
        selection="multiple"
        v-model:selected="formData.value.marsDeviceIdsDemapping"
        v-model:pagination="paginationControl.value"
        :loading="toggleAjaxLoadFilter.value"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        color="dark"
        @request="ajaxLoadAllLeadInfo"
        table-class="customTableClass"
      >
        <!-- Lead Number clickable -->
        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label text-primary cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            # {{ props.row.leadInformation.leadNumber }}
          </span>
        </template>

        <!-- Top slot: search & demap button -->
        <template v-slot:top>
          <div class="row items-center q-mb-md">
            <div class="col-5">
              <q-search
                clearable
                v-model="filter.value"
                separator
                color="grey-9"
                placeholder="Type.."
                float-label="Search By Device Serial Number"
                class="q-mr-lg q-py-sm"
              />
            </div>
            <div class="side1">
              <q-btn
                no-caps
                :disabled="formData.value.marsDeviceIdsDemapping.length === 0"
                label="De-Mapping"
                class="common-dark-blue"
                @click="fnDemappingData"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Demapping Remarks Modal -->
      <demappingRemarks
        v-if="propShowUpdateDemapping.value"
        :propShowUpdateDemapping="propShowUpdateDemapping.value"
        :propRowDetails="propRowDetails.value"
        @emitfnshowUpdateDemapping="fnDemappingData"
      />

      <!-- Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter.value" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          style="color:#61116a"
          :size="35"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import demappingRemarks from "../../components/sat/demappingRemarks.vue";

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();
const getdemappingStatusList = ref([]);

// Props (use ref for reactivity)
const propRowDetails = ref(null);

// Local State
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const propShowUpdateDemapping = ref(false);
const toggleAjaxLoadFilter = ref(false);
const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  rowsPerPage: 10
});
const formData = ref({
  marsDeviceIdsDemapping: []
});
const tableData = ref([]);
const filter = ref("");

// Table Columns
const columns = [
  {
    name: "deviceSerialNumber",
    required: true,
    label: "Device Serial Number",
    align: "left",
    field: row => row.aggregatorRegionalInventory?.serialNumber ?? "NA",
    sortable: false
  },
  {
    name: "deviceStatusDate",
    required: true,
    label: "Status",
    align: "left",
    field: row =>
      row.deviceStatus === 5 ? "Scanned Picked" : "Scheduled for Deployment",
    sortable: false
  }
];

// Lifecycle
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filter.value
  });
});

// Methods
function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
}

function fnDemappingData() {
  const marsDeviceIdsDemapping = formData.value.marsDeviceIdsDemapping.map(
    value => value.aggregatorRegionalInventory.id
  );

  propShowUpdateDemapping.value = !propShowUpdateDemapping.value;

  if (marsDeviceIdsDemapping !== undefined) {
    propRowDetails.value = marsDeviceIdsDemapping;
  }

  if (!propShowUpdateDemapping.value) {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filter.value
    });
    formData.value.marsDeviceIdsDemapping = [];
  }
}

function ajaxLoadAllLeadInfo({ pagination, filter }) {
  toggleAjaxLoadFilter.value = true;
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  });

  store
    .dispatch("deMapping/DEMAPPING_STATUS_LIST", { pagination, filter })
    .then(() => {
      const list = store.getters["deMapping/getdemappingStatusList"];
      getdemappingStatusList.value = list.content;
      tableData.value = list.content;

      paginationControl.value.rowsNumber = list.totalElements;
      paginationControl.value.page = list.number + 1;

      if (list.sort != null && list.sort.length) {
        paginationControl.value.sortBy = list.sort[0].property;
        paginationControl.value.descending = list.sort[0].ascending;
      }

      toggleAjaxLoadFilter.value = false;
      $q.loading.hide();
    })
    .catch(() => {
      toggleAjaxLoadFilter.value = false;
      $q.loading.hide();
    });
}
</script>

<style scoped>
.side1 {
  margin-left: 170px;
}

.side2 {
  margin-left: 20px;
}
</style>
