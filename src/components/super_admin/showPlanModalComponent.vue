<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitModalClose"
    transition-show="slide"
    transition-hide="slide"
    class="customModalOverlay"
  >
    <q-card style="min-width:40vw; min-height:100vh; padding:75px 25px">

      <!-- Header -->
      <q-card-section class="row items-center bottom-border q-py-sm">
        <div class="col">
          <div class="q-title text-weight-regular">Manage Plan</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose"/>
        </div>
      </q-card-section>

      <!-- Form Section -->
      <q-card-section>
        <q-form @submit.prevent="makeUpdateElementActive ? fnFinalUpdate() : fnFinalCreate()">
          <div class="q-gutter-md">

            <!-- Plan Name Input -->
            <q-input
              v-model="formData.planName"
              label="Plan"
              placeholder="Plan"
              @blur="$v.formData.planName.$touch()"
              :error="!!$v.formData.planName.$error"
              dense
              outlined
            />

            <!-- Action Buttons -->
            <div class="row justify-end q-pt-md">
              <q-btn
                label="Save"
                color="purple-9"
                v-if="!makeUpdateElementActive"
                type="submit"
                class="q-mr-sm"
              />
              <q-btn
                label="Update"
                color="purple-9"
                v-else
                type="submit"
                class="q-mr-sm"
              />
            </div>

          </div>
        </q-form>
      </q-card-section>

      <!-- Table Section -->
      <q-card-section>
        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="planName"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          color="grey-9"
        >

          <!-- Action Column -->
          <template v-slot:body-cell-action="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                flat
                no-caps
                no-wrap
                label="Modify"
                icon="far fa-plus-square"
                size="md"
                class="text-light-blue"
                @click="populateForUpdate(props.row)"
              />
            </div>
          </template>

          <!-- Top Slot for Search -->
          <template v-slot:top>
            <div class="row q-pa-sm">
              <div class="col">
                <q-search
                  v-model="filterSearch"
                  placeholder="Type.."
                  float-label="Search by name, short name"
                  clearable
                  dense
                  outlined
                />
              </div>
            </div>
          </template>

        </q-table>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// Props & Emit
const props = defineProps({
  propToggleModal: Boolean
});
const emit = defineEmits(["emitToggleModal"]);

const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleModal);
const makeUpdateElementActive = ref(false);
const filterSearch = ref("");
const paginationControl = ref({ rowsPerPage: 5 });
const tableData = ref([]);
const columns = ref([
  { name: "planName", label: "Plan", align: "left", field: "planName", sortable: true },
  { name: "planCode", label: "Code", align: "left", field: "planCode", sortable: true },
  { name: "action", label: "", align: "left", field: "action" }
]);

const formData = ref({
  planName: "",
  planCode: null
});

// Vuelidate rules
const rules = {
  formData: {
    planName: { required },
    planCode: { required }
  }
};
const $v = useVuelidate(rules, { formData });

// Lifecycle - Fetch table data
const fetchPlans = async () => {
  await store.dispatch("plan/PLAN_ACTIVE_LIST");
  tableData.value = store.getters["plan/getActivePlan"];
};

onMounted(() => {
  fetchPlans();
});

// Emit modal close
const emitModalClose = () => emit("emitToggleModal");

// Save Plan
const fnFinalCreate = async () => {
  $v.value.$touch();
  if ($v.value.$invalid) {
    $q.notify({ color: "negative", message: "Please review fields.", position: "bottom" });
    return;
  }

  $q.loading.show({ message: "Saving..." });
  try {
    await store.dispatch("plan/ADD_NEW_PLAN", formData.value);
    $q.notify({ color: "positive", message: "Plan successfully added!", icon: "thumb_up", position: "bottom" });
    emitModalClose();
    fetchPlans();
  } catch (error) {

    $q.notify({ color: "negative", message: error?.data?.message ?? "Failed to add plan.", icon: "thumb_down", position: "bottom" });
  } finally {
    $q.loading.hide();
  }
};

// Update Plan
const fnFinalUpdate = async () => {
  $v.value.$touch();
  if ($v.value.$invalid) {
    $q.notify({ color: "negative", message: "Please review fields.", position: "bottom" });
    return;
  }

  $q.loading.show({ message: "Updating..." });
  try {
    await store.dispatch("plan/ADD_NEW_PLAN", formData.value); // replace with UPDATE action if exists
    $q.notify({ color: "positive", message: "Plan successfully updated!", icon: "thumb_up", position: "bottom" });
    emitModalClose();
    fetchPlans();
  } catch (error) {

    $q.notify({ color: "negative", message: error?.data?.message ?? "Failed to update plan.", icon: "thumb_down", position: "bottom" });
  } finally {
    $q.loading.hide();
    makeUpdateElementActive.value = false;
  }
};

// Populate form for update
const populateForUpdate = (row) => {
  formData.value.planName = row.planName;
  formData.value.planCode = row.planCode;
  makeUpdateElementActive.value = true;
};

// Custom search
const myCustomSearchFilter = (rows, terms, cols, getCellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : "";
  return rows.filter(row =>
    cols.some(col => (getCellValue(col, row) + "").toLowerCase().includes(lowerTerms))
  );
};
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
