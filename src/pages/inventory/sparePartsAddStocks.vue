<template>
  <q-page>
    <div>
      <div class="row q-px-md q-py-md items-center">
        <!-- Table title placeholder -->
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9"></div>
      </div>

      <!-- Spare Parts Types Section -->
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-7">
          <p class="caption">Bijlipay Spare Parts Types*</p>
          <div class="row">
            <div
              class="row items-center"
              v-for="menu in sparePartsTypes"
              :key="menu.value.id"
            >
              <input
                style="width: 18px; height: 18px"
                type="checkbox"
                :id="menu.value.id + '_CB'"
                :name="menu.value.spare_parts_types"
                @input="clearEvent($event)"
                @click="getSelectedDetails($event, sparePartsTypes, menu.value)"
              />
              <label>{{ menu.value.spare_parts_types }}</label>
            </div>
          </div>

          <div v-for="menu in sparePartsTypes" :key="menu.value.id">
            <div
              :id="menu.value.id + '_DV'"
              style="display: none"
              @click="finding(menu.value.id)"
            >
              <label>{{ menu.value.spare_parts_types }}</label>
              <input
                :id="menu.value.id + '_IP'"
                type="number"
                min="1"
                max="5000"
                @blur="getAllCounts($event, menu)"
              />
              <q-btn
                type="button"
                size="sm"
                color="purple"
                :disable="dis()"
                @click="fnSubmit(formData)"
              >
                Submit
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock List Section -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
          Stock List
        </div>

        <q-table
          :data="tableData"
          :columns="columns"
          v-model:pagination="paginationControl"
          row-key="name"
          table-class="customSATableClass"
          color="grey-9"
        >
          <template v-slot:body-cell-created_date="props">
            {{ formatDate(props.row.created_date) }}
          </template>
          <template v-slot:body-cell-updated_date="props">
            {{ formatDate(props.row.updated_date) }}
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import moment from "moment";

export default {
  name: "AllocateDevice",
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const sparePartsTypes = ref([]);
    const tableData = ref([]);
    const eventAction = ref("");
    const selectedSpareValue = ref("");
    const requestData = ref({});
    const formData = reactive({
      count: "",
      spare_inventory_data: { id: "", is_active: true },
    });
    const paginationControl = reactive({ rowsPerPage: 10 });

    const columns = [
      {
        name: "spare_parts_types",
        label: "Spare Parts Types",
        align: "left",
        field: row => row.spare_inventory_data.spare_parts_types,
        sortable: true,
      },
      { name: "count", label: "Count", field: "count", sortable: false },
      {
        name: "created_by",
        label: "Spare Created",
        field: row => row.created_by.name,
        sortable: true,
      },
      { name: "created_date", label: "Created Date", field: "created_date", sortable: true },
      { name: "updated_date", label: "Updated Date", field: "updated_date", sortable: true },
    ];

    const clearEvent = (event) => {
      eventAction.value = event.target.id.split("_")[0];
    };

    const dis = () => {
      return formData.spare_inventory_data.id !== eventAction.value;
    };

    const fngetAllInventoryDatas = async () => {
      try {
        await store.dispatch("sparePartsGetTypes/FETCH_ALL_SPARE_PARTS_INVENTORY_DATAS");
        tableData.value = store.getters["sparePartsGetTypes/getallInventorySparePartsGetTypes"];
      } catch (err) {
        console.error(err);
        $q.notify({
          color: "negative",
          message: "Failed to load inventory data",
          icon: "error"
        });
      }
    };

    // Added missing function
    const getAllCounts = (event, menu) => {
      const count = parseInt(event.target.value);
      if (!isNaN(count) && count >= 1 && count <= 5000) {
        formData.count = count;
        formData.spare_inventory_data.id = menu.value.id;
      } else {
        $q.notify({
          color: "negative",
          message: "Please enter a valid count between 1 and 5000",
          icon: "warning"
        });
        event.target.value = "";
        formData.count = "";
      }
    };

    const finding = (requestId) => {
      formData.spare_inventory_data.id = requestId;
    };

    const getSelectedDetails = (event, sparePartsTypesRef, request) => {
      requestData.value = request;
      selectedSpareValue.value = request;
      const chFlag = event.target.checked;
      if (chFlag) {
        document.getElementById(request.id + "_DV").style.display = "block";
        sparePartsTypesRef.forEach((value) => {
          if (value.value.id !== request.id) {
            document.getElementById(value.value.id + "_CB").checked = false;
            document.getElementById(value.value.id + "_DV").style.display = "none";
          }
        });
      } else {
        document.getElementById(request.id + "_DV").style.display = "none";
      }
    };

    const fnSubmit = async (request) => {
      // Validate form data
      if (!request.spare_inventory_data.id || !request.count) {
        $q.notify({
          color: "negative",
          message: "Please select a spare part type and enter a count",
          icon: "warning"
        });
        return;
      }

      try {
        $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Validating .." });
        await store.dispatch("sparePartsGetTypes/SPARE_PARTS_ADD_STOCKS", request);

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Stocks Added Successfully",
          icon: "thumb_up",
        });
        
        // Reset form
        formData.count = "";
        formData.spare_inventory_data.id = "";
        
        // Hide the input section
        const selectedDiv = document.getElementById(request.spare_inventory_data.id + "_DV");
        if (selectedDiv) {
          selectedDiv.style.display = "none";
        }
        
        // Uncheck the checkbox
        const selectedCheckbox = document.getElementById(request.spare_inventory_data.id + "_CB");
        if (selectedCheckbox) {
          selectedCheckbox.checked = false;
        }
        
        // Reload data
        fngetAllInventoryDatas();
      } catch (error) {
        console.error("Error submitting form:", error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.body?.message || "Please try again",
          icon: "thumb_down",
        });
      } finally {
        $q.loading.hide();
      }
    };

    const fnSparePartsTypes = async () => {
      try {
        await store.dispatch("sparePartsGetTypes/FETCH_SPARE_PARTS_GET_TYPES");
        const sparePartsData = store.getters["sparePartsGetTypes/getsparePartsGetTypes"];
        sparePartsTypes.value = sparePartsData.map((item) => ({
          value: item,
          label: item.spare_parts_types
        }));
      } catch (error) {
        console.error("Error loading spare parts types:", error);
        $q.notify({
          color: "negative",
          message: "Failed to load spare parts types",
          icon: "error"
        });
      }
    };

    const formatDate = (dateVal) => (dateVal ? moment(dateVal).format("Do MMM Y") : "NA");

    onMounted(() => {
      fnSparePartsTypes();
      fngetAllInventoryDatas();
    });

    return {
      sparePartsTypes,
      tableData,
      formData,
      paginationControl,
      columns,
      eventAction,
      selectedSpareValue,
      requestData,
      clearEvent,
      dis,
      fngetAllInventoryDatas,
      getAllCounts, // Added this to the return object
      finding,
      getSelectedDetails,
      fnSubmit,
      fnSparePartsTypes,
      formatDate,
    };
  },
};
</script>

<style scoped>
.activeDeviceTab .q-list-header {
  border-bottom: 1px solid rgb(204, 204, 204);
  background: #61116a;
  color: #fff;
}

.row.items-center {
  margin-bottom: 8px;
  align-items: center;
}

.row.items-center label {
  margin-left: 8px;
  cursor: pointer;
}

input[type="number"] {
  margin-left: 8px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
}

.caption {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}
</style>