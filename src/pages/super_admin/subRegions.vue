<template>
  <q-page class="q-pa-md">
    <div>
      <q-table
        :rows="getAllPincodes"
        :columns="columns"
        row-key="name"
        :filter="filter"
        :loading="loading"
        v-model:pagination="serverPagination"
        @request="searchRequest"
        table-class="customSATableClass"
        color="grey-9"
      >
        <!-- Action Column -->
        <template v-slot:body-cell-action="props">
          <div class="row no-wrap no-padding">
            <q-btn
              dense
              no-caps
              no-wrap
              label="Modify"
              icon="far fa-plus-square"
              size="md"
              flat
              class="text-light-blue"
              @click="fnShowEditPincode(props.row)"
            />
            <!-- Uncomment to enable Delete -->
            <!--
            <q-btn
              dense
              no-caps
              no-wrap
              label="Disable"
              icon="far fa-minus-square"
              size="md"
              flat
              class="text-negative"
              @click="fnDisablePermission(props.row.id)"
            />
            -->
          </div>
        </template>

        <!-- Top Slot: Title + Add Button + Search -->
        <template v-slot:top>
          <div class="row items-center q-mb-md">
            <div class="col-md-6 q-title q-mt-lg text-weight-regular">Pincodes</div>

            <div class="col-md-6 text-right">
              <q-btn
                no-caps
                no-wrap
                label="Add New Regions"
                class="q-mt-lg text-weight-regular"
                color="purple-9"
                icon="far fa-plus-square"
                size="md"
                @click="fnshowCreatePincodes"
              />
            </div>

            <div class="col-md-5 q-mt-md">
              <q-input
                outlined
                clearable
                v-model="filter"
                placeholder="Type.."
                color="grey-9"
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>

      <!-- Add Pincode Modal -->
      <addPincode
        v-if="propShowCreatePincodes"
        :propShowCreatePincodes="propShowCreatePincodes"
        @emitfnshowAddPincodes="fnshowCreatePincodes"
      />

      <!-- Edit Pincode Modal -->
      <editPincode
        v-if="propShowEditPincodes"
        :propShowEditPincodes="propShowEditPincodes"
        :propRowDetails="propRowDetails"
        @emitfnshowEditPincodes="fnShowEditPincode"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import addPincode from "../../components/super_admin/addPincode.vue";
import editPincode from "../../components/super_admin/editPincode.vue";

/* ---------------------------
   Store & Quasar
--------------------------- */
const store = useStore();
const $q = useQuasar();

/* ---------------------------
   Reactive State
--------------------------- */
const propShowCreatePincodes = ref(false);
const propShowEditPincodes = ref(false);
const propRowDetails = ref(null);

const loading = ref(false);
const filter = ref("");

const serverPagination = reactive({
  page: 1,
  rowsNumber: 10
});

/* ---------------------------
   Table Columns
--------------------------- */
const columns = [
  { name: "pincode", label: "Pincode", field: "pincode", align: "left", required: true, sortable: false },
  { name: "stateName", label: "State", field: "stateName", align: "left", required: true, sortable: false },
  { name: "cityName", label: "City", field: "cityName", align: "left", required: true, sortable: false },
  { name: "action", label: "", field: "action", align: "left", required: true, sortable: false }
];

/* ---------------------------
   Computed
--------------------------- */
const getAllPincodes = computed(() => store.getters["pincodes/getAllPincodes"]);

/* ---------------------------
   Methods
--------------------------- */
const fnshowCreatePincodes = () => {
  propShowCreatePincodes.value = !propShowCreatePincodes.value;
};

const fnShowEditPincode = (rowDetails) => {
  propShowEditPincodes.value = !propShowEditPincodes.value;
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails;
  }
};

const ajaxLoadDataForPermissionTable = async () => {
  loading.value = true;
  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  try {
    await store.dispatch("pincodes/FETCH_ALL_PINCODES");
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error.body?.message ?? "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
    loading.value = false;
  }
};

/* Server-side pagination & search */
const searchRequest = async ({ pagination, filter: filterValue }) => {
  loading.value = true;

  try {
    await store.dispatch("pincodes/FETCH_ALL_PINCODES", filterValue);
    serverPagination.page = pagination.page;
  } catch {

    // handle error silently
  } finally {
    loading.value = false;
  }
};

/* ---------------------------
   Lifecycle
--------------------------- */
onMounted(() => {
  ajaxLoadDataForPermissionTable();
});
</script>

<style scoped>
/* Add your custom styles here */
</style>
