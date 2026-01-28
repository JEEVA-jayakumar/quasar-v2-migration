<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Debugging -->
      <h2>Users Data</h2>
      <pre>{{ getAllUsers }}</pre>
      <pre>{{ testData }}</pre>

      <!-- Users Table -->
      <q-table
        :rows="getAllUsers"
        :columns="columns"
        row-key="name"
        :filter="filterSearch"
        selection="multiple"
        v-model:selected="selectedSecond"
        v-model:pagination="paginationControl"
        :loading="tableAjaxLoading"
        color="grey-9"
      >
        <!-- Sales / Profile Picture -->
        <template v-slot:body-cell-profilePicture="props">
          <img :src="props.row.profilePicture" class="avatar" />
        </template>

        <!-- Role Column -->
        <template v-slot:body-cell-role="props">
          <div class="row no-wrap">
            <div v-for="role in props.row.roles" :key="role.role">
              <q-chip color="light-blue" class="q-mr-xs q-mb-xs">
                {{ role.role }}
              </q-chip>
            </div>
          </div>
        </template>

        <!-- Permissions Column -->
        <template v-slot:body-cell-permission="props">
          <div class="row no-wrap">
            <div v-for="role in props.row.roles" :key="role.role">
              <q-chip
                v-for="rolePermission in role.permission"
                :key="rolePermission.permission"
                color="grey-5"
                class="text-grey-9 q-mr-xs q-mb-xs"
              >
                {{ rolePermission.permission }}
              </q-chip>
            </div>
          </div>
        </template>

        <!-- Top Slot: Title, Search, Tabs, Filters, Buttons -->
        <template v-slot:top>
          <div class="row items-center q-mb-md">
            <!-- Title -->
            <div class="col-md-6 q-title q-mt-lg text-weight-regular">
              Users
            </div>

            <!-- Search -->
            <div class="col-md-6">
              <q-input
                outlined
                dense
                clearable
                v-model="filter"
                placeholder="Search by SO name, Merchant Name, Lead ID"
                float-label="Search by SO name, Merchant Name, Lead ID"
                class="q-mt-lg q-mr-lg"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <!-- Tabs -->
            <div class="col-md-6 q-my-md">
              <div>
                <q-btn
                  v-for="tab in filtertabs"
                  :key="tab.name"
                  color="blue-grey-2 q-mx-xs"
                  class="text-black"
                  size="sm"
                  rounded
                  :label="tab.name"
                />
              </div>
            </div>

            <!-- Role Filter Dropdown -->
            <div class="col-md-3 q-my-md">
              <q-select
                v-model="filter_values"
                separator
                color="grey-9"
                placeholder="Select"
                float-label="Filter By"
                :options="filterRoles"
                dense
              />
            </div>

            <!-- Buttons -->
            <div class="col-md-3 q-my-md text-right">
              <q-btn
                flat
                color="white"
                class="text-grey-9 q-mr-md"
                size="md"
                icon="far fa-trash-alt"
                @click="fnDeleteUser"
              />
              <q-btn
                label="Add User"
                color="purple-9"
                size="md"
                @click="fnShowAddUser"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Add User Modal -->
      <showAddUser
        v-if="propShowAddUser"
        :propShowAddUser="propShowAddUser"
        :propFilterRoles="filterRoles"
        @emitfnShowAddUser="fnShowAddUser"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import showAddUser from "../../components/super_admin/showAddUser.vue";

/* ---------------------------
   Quasar & Vuex
--------------------------- */
const $q = useQuasar();
const store = useStore();

/* ---------------------------
   Reactive State
--------------------------- */
const propShowAddUser = ref(false);
const filter = ref("");
const filter_values = ref("");
const selectedSecond = ref([]);

const paginationControl = reactive({
  page: 1,
  rowsPerPage: 10
});

const tableAjaxLoading = ref(false);
const filterSearch = ref("");

const filtertabs = [
  { name: "ALL", value: 1 },
  { name: "Sales", value: 2 },
  { name: "Implementation", value: 3 },
  { name: "Finance", value: 4 }
];

const filterRoles = ref([]);

/* Table Columns */
const columns = [
  { name: "profilePicture", label: "Sales", field: "profilePicture", align: "left", sortable: true },
  { name: "name", label: "Name", field: "name", align: "center", sortable: true },
  { name: "employeeID", label: "Employee ID", field: "employeeID", align: "left", sortable: true },
  { name: "contactNumber", label: "Contact No", field: "contactNumber", align: "left", sortable: true },
  { name: "email", label: "Email ID", field: "email", align: "left", sortable: true },
  { name: "role", label: "Role", field: "role", align: "center", sortable: true },
  { name: "permission", label: "Permissions", field: "permission", align: "center", sortable: true },
  { name: "state", label: "Location", field: "state", align: "left", sortable: true }
];

/* ---------------------------
   Computed
--------------------------- */
const getAllUsers = computed(() => store.getters["SuperAdminUsers/testData"]);
const testData = computed(() => store.getters["SuperAdminUsers/testData"]);

/* ---------------------------
   Methods
--------------------------- */
const fnShowAddUser = () => {
  propShowAddUser.value = !propShowAddUser.value;
};

const fnDeleteUser = async () => {
  try {
    await $q.dialog({
      title: "Confirm",
      message: "Are you sure want to delete users?",
      cancel: true,
      persistent: true
    });
    $q.notify({ color: "positive", position: "bottom", message: "Deleted successfully!", icon: "thumb_up" });
  } catch {
    $q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" });
  }
};

/* API Calls */
const ajaxLoadDataForAllUsersList = async () => {
  tableAjaxLoading.value = true;
  await store.dispatch("SuperAdminUsers/FETCH_ALL_USERS_DATA");
  tableAjaxLoading.value = false;
};

const ajaxLoadDataForRolesFilter = async () => {
  await store.dispatch("SuperAdminUsers/FETCH_ALL_ROLES_DATA");
  filterRoles.value = store.state.SuperAdminUsers.allRolesData;
};

/* ---------------------------
   Lifecycle
--------------------------- */
onMounted(() => {
  ajaxLoadDataForAllUsersList();
  ajaxLoadDataForRolesFilter();
});
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
