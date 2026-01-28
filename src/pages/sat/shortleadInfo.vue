<template>
  <q-page class="q-pa-md">

    <!-- Short Lead Table -->
    <q-table
      class="my-sticky-header-table"
      title="Short Lead Information"
      :rows="getShortLead"
      :columns="columns"
      row-key="name"
      flat
      bordered
      square
    >
      <!-- Action Column -->
      <template v-slot:body-cell-action="props">
        <div class="row no-wrap no-padding">
          <q-btn
            dense
            flat
            no-caps
            no-wrap
            size="md"
            icon="add_box"
            label="Convert Wip Lead"
            class="text-light-blue"
            @click="fnShowEditShortLead(props.row)"
          />
        </div>
      </template>

      <!-- Update Column -->
      <template v-slot:body-cell-update="props">
        <div class="row no-wrap no-padding">
          <q-btn
            dense
            flat
            no-caps
            no-wrap
            size="md"
            icon="update"
            label="Update"
            class="text-light-blue"
            @click="fnShowConvertToSat(props.row)"
          />
        </div>
      </template>

    </q-table>

    <!-- Edit Short Lead Dialog -->
    <edit-short-lead
      v-model:show="propShowEditShortLead"
      :row-details="propRowDetails"
    />

    <!-- Convert To SAT Dialog -->
    <convert-to-sat
      v-model:show="propShowConvertToSat"
      :row-details="propRowDetails"
    />

  </q-page>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import editShortLead from "../../components/sat/editShortLead.vue";
import convertToSat from "../../components/sat/convertToSat.vue";

export default {
  name: "InventoryAllocation",
  components: {
    editShortLead,
    convertToSat,
  },
  setup() {
    const store = useStore();

    // --- Reactive State ---
    const propShowEditShortLead = ref(false);
    const propShowConvertToSat = ref(false);
    const propRowDetails = ref(null);

    const shortlead = ref("shortlead");

    const formData = reactive({
      leadName: "",
      contactName: "",
      contactNumber: "",
      alternateContactNumber: "",
      email: "",
      leadAddress: "",
      pincode: "",
      state: "",
      city: "",
      leadSource: "",
      device: "",
      deviceCount: ""
    });

    const dropDown = reactive({
      deviceOptions: [],
      leadSourceOptions: []
    });

    const selectBankEnableOptions = [
      { label: "Yes", value: "True" },
      { label: "No", value: "False" }
    ];

    // --- Columns ---
    const columns = [
      { name: "contactNumber", label: "Contact Number", field: "contactNumber", align: "center", sortable: true },
      { name: "id", label: "ID", field: "id", align: "center", sortable: true },
      { name: "shortleadDate", label: "Short Lead Date", field: "shortleadDate", align: "center", sortable: true },
      { name: "leadName", label: "Lead Name", field: "leadName", align: "center", sortable: true },
      { name: "leadNumber", label: "Lead Number", field: "leadNumber", align: "center", sortable: true },
      { name: "action", label: "Convert Wip Lead", align: "left", sortable: false },
      { name: "update", label: "Update", align: "left", sortable: false }
    ];

    // --- Vuex Getters ---
    const getShortLead = computed(() => store.getters["shortLeadInfo/getShortLead"]);
    const getAllAppDevicesInfo = computed(() => store.getters["appDevice/getAllAppDevicesInfo"]);
    const getAllAppLeadSource = computed(() => store.getters["appLeadSource/getAllAppLeadSource"]);

    // --- Vuex Actions ---
    const FETCH_APP_DEVICES_DATA = () => store.dispatch("appDevice/FETCH_APP_DEVICES_DATA");
    const FETCH_APP_LEADSOURCE_DATA = () => store.dispatch("appLeadSource/FETCH_APP_LEADSOURCE_DATA");
    const FETCH_SHORT_LEAD = () => store.dispatch("shortLeadInfo/FETCH_SHORT_LEAD");
    const STATE_SHORT_LEAD = (payload) => store.dispatch("shortLead/STATE_SHORT_LEAD", payload);

    // --- Methods ---
    const fnSubmitBankDetails = (data) => {
      STATE_SHORT_LEAD(data);
      shortlead.value = "wiplead";
      Object.keys(formData).forEach(k => formData[k] = "");
    };

    const fnShowEditShortLead = (row) => {
      propRowDetails.value = row ?? null;
      propShowEditShortLead.value = true;
    };

    const fnShowConvertToSat = (row) => {
      propRowDetails.value = row ?? null;
      propShowConvertToSat.value = true;
    };

    const appLoadData = async () => {
      await FETCH_APP_DEVICES_DATA();
      dropDown.deviceOptions = getAllAppDevicesInfo.value.map(item => ({
        value: item,
        label: item.deviceName
      }));

      await FETCH_APP_LEADSOURCE_DATA();
      dropDown.leadSourceOptions = getAllAppLeadSource.value.map(item => ({
        value: item,
        label: item.sourceName
      }));
    };

    const fetchAppData = () => {
      FETCH_SHORT_LEAD();
    };

    // --- Lifecycle Hook ---
    onMounted(() => {
      appLoadData();
      fetchAppData();
    });

    return {
      columns,
      getShortLead,
      dropDown,
      selectBankEnableOptions,
      propShowEditShortLead,
      propShowConvertToSat,
      propRowDetails,
      formData,
      fnSubmitBankDetails,
      fnShowEditShortLead,
      fnShowConvertToSat
    };
  }
};
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
.my-sticky-header-table thead tr {
  position: sticky;
  top: 0;
  background: #f9f9f9;
  z-index: 1;
}
</style>
