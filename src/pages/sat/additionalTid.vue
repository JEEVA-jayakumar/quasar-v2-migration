<template>
  <q-page padding>
    <!-- Table title -->
    <div
      class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
    >
      Bijlipay Additional Terminals
    </div>

    <!-- General Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table for Additional TIDs -->
    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="name"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >
      <!-- Table header -->
      <template v-slot:top-row="props">
        <q-tr>
          <q-th v-for="col in props.columns" :key="col.name">{{ col.label }}</q-th>
        </q-tr>
      </template>

      <!-- MID Column -->
      <template v-slot:body-cell-mid="props">
        <span class="label text-primary"># {{ props.row.mid }}</span>
      </template>

      <!-- Lead Number Column -->
      <template v-slot:body-cell-leadNumber="props">
        <span
          class="label text-primary cursor-pointer"
          @click="toggleLeadInformation(props.row.leadInformation)"
        >
          # {{ props.row.leadInformation?.leadNumber || 'NA' }}
        </span>
      </template>

      <!-- Lead Address Column -->
      <template v-slot:body-cell-leadAddress="props">
        {{ props.row.leadInformation?.leadAddress || 'NA' }}
      </template>

      <!-- Action Column -->
      <template v-slot:body-cell-action="props">
        <q-btn
          highlight
          push
          class="q-mx-sm"
          color="positive"
          size="sm"
          @click="additionalTid(props.row)"
        >
          Additional TID
        </q-btn>
      </template>

      <!-- Table top slot (filter/search) -->
      <template v-slot:top>
        <div class="col-5 bottom-border">
          <q-input
            clearable
            v-model="filter"
            outlined
            dense
            label="Search Using MID"
            placeholder="Type..."
            class="q-mr-lg q-py-sm"
          />
        </div>
      </template>
    </q-table>

    <!-- Merchant Transaction Level Details -->
    <showMerchantTransactionLevelDetails
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!-- Global Spinner -->
    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { mapGetters, mapActions } from "vuex";

import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "GetAdditionalTid",
  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation
  },
  setup(_, { root }) {
    // Reactive state
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const tableData = ref([]);
    const valueToggleMerchantTransaction = ref(false);
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const toggleAjaxLoadFilter1 = ref(false);

    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "tid",
      descending: false,
      rowsPerPage: 10
    });

    // Table columns
    const columns = [
      {
        name: "mid",
        required: true,
        label: "MID",
        align: "left",
        field: "mid",
        sortable: true
      },
      {
        name: "leadNumber",
        required: true,
        label: "Lead Id",
        align: "left",
        field: row => row.leadInformation?.leadNumber || "NA",
        sortable: false
      },
      {
        name: "leadAddress",
        required: true,
        label: "Merchant Address",
        align: "center",
        field: row => row.leadInformation?.leadAddress || "NA",
        sortable: false
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "center",
        field: "action",
        sortable: true
      }
    ];

    // Vuex getters & actions
    const { getadditionalTid } = mapGetters("additionalTid", ["getadditionalTid"]);
    const { FETCH_ADDITIONAL_TID_DATAS, ADDITIONAL_TID_VERIFY_DATA } = mapActions("additionalTid", [
      "FETCH_ADDITIONAL_TID_DATAS",
      "ADDITIONAL_TID_VERIFY_DATA"
    ]);

    // Fetch table data
    const ajaxLoadAllLeadInfo = ({ pagination, filter: f } = {}) => {
      toggleAjaxLoadFilter.value = true;

      root.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      FETCH_ADDITIONAL_TID_DATAS({ pagination, filter: f })
        .then(() => {
          // Update pagination
          paginationControl.value = pagination || paginationControl.value;
          paginationControl.value.rowsNumber = getadditionalTid.totalElements;
          paginationControl.value.page = getadditionalTid.number + 1;

          // Update table rows
          tableData.value = getadditionalTid.content;

          if (getadditionalTid.sort) {
            paginationControl.value.sortBy = getadditionalTid.sort[0].property;
            paginationControl.value.descending = getadditionalTid.sort[0].ascending;
          }
        })
        .finally(() => {
          toggleAjaxLoadFilter.value = false;
          root.$q.loading.hide();
        });
    };

    // Handle Additional TID
    const additionalTid = reqData => {
      root.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to Move Additional Tid?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .onOk(() => {
          root.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Processing .." });

          ADDITIONAL_TID_VERIFY_DATA(reqData).then(() => {
            root.$q.loading.hide();
            root.$router.push({ name: "additionalTidform", params: { data: reqData } });
          });
        });
    };

    // Toggle lead info popup
    const toggleLeadInformation = leadDetails => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      tableData,
      valueToggleMerchantTransaction,
      toggleAjaxLoadFilter,
      toggleAjaxLoadFilter1,
      paginationControl,
      filter,
      columns,
      ajaxLoadAllLeadInfo,
      additionalTid,
      toggleLeadInformation
    };
  }
};
</script>

<style scoped>
/* Spinner overlay style */
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
}

/* Add custom table styles if needed */
.customTableClass {
  width: 100%;
}
</style>
