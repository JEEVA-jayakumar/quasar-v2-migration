<template>
  <q-page class="q-pa-md">
    <div>
      <q-tabs
        v-model="activeTab"
        class="shadow-1"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
        @update:model-value="changeTabs"
      >
        <q-tab name="tab-1" label="Active Users" />
        <q-tab name="tab-2" label="De-activated Users" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="tab-1">
          <!-- Active Users Table -->
          <q-table
            :rows="getAllUsers"
            :columns="columns"
            class="customSATableClass"
            :filter="filterSearch"
            :selected="selectedUsersToDelete"
            @update:selected="updateSelectedUsers"
            :pagination="paginationControl"
            :loading="tableAjaxLoading"
            row-key="userId"
            color="grey-9"
            :rows-per-page-options="[10, 20, 30, 50]"
          >
            <template #body-cell-name="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="fnShowEditUser(props.row.userId)"
                  :label="props.row.user.name"
                  class="capitalize"
                />
              </q-td>
            </template>

            <template #body-cell-role="props">
              <q-td :props="props">
                <div class="row no-wrap q-gutter-xs" v-for="role in props.row.roles" :key="role.role">
                  <q-chip
                    color="light"
                    text-color="dark"
                    dense
                  >
                    <span>{{ role.hierarchy.hierarchyCode }}</span>
                    | {{ role.role }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template #top>
              <!-- Filter and Search -->
              <div class="col-md-12 q-mb-md">
                <div class="row q-col-gutter-md">
                  <div class="col-md-6">
                    <q-input
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Name, Merchant Name, Lead ID"
                      color="grey-9"
                      outlined
                      dense
                      clearable
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6">
                    <q-select
                      v-model="filter_values"
                      :options="getAllRoles"
                      label="Filter By"
                      color="grey-9"
                      outlined
                      dense
                      clearable
                      emit-value
                      map-options
                      @clear="ajaxLoadDataForAllUsersList"
                      @update:model-value="ajaxLoadDataForRoleIdFilter"
                    />
                  </div>
                </div>
              </div>

              <!-- Hierarchy Tabs -->
              <div class="col-md-12 q-mb-md">
                <div class="row justify-between items-center">
                  <div class="col">
                    <div class="q-gutter-xs">
                      <q-btn
                        v-for="(tab, index) in getAllHierarchiesData"
                        :key="index"
                        class="text-black"
                        size="sm"
                        :class="[
                          activeItemId === index
                            ? 'customTabActive text-white'
                            : 'bg-blue-grey-2'
                        ]"
                        @click="ajaxLoadDataForHeirarchyIdFilter(index, tab)"
                        :label="tab.label"
                        rounded
                        unelevated
                      />
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="row q-gutter-xs">
                      <div class="col-auto">
                        <q-btn
                          :disabled="selectedUsersToDelete.length === 0"
                          flat
                          color="grey-9"
                          @click="activate_deactivate_users(selectedUsersToDelete)"
                          icon="far fa-trash-alt"
                          :title="activeTab === 'tab-2' ? 'Activate Users' : 'Deactivate Users'"
                        />
                      </div>
                      <div class="col-auto">
                        <export-excel
                          :data="getAllUsers"
                          :fields="json_fields"
                          name="UserDetails.xls"
                        >
                          <q-btn
                            outline
                            color="grey-9"
                            label="Download as excel"
                            unelevated
                          />
                        </export-excel>
                      </div>
                      <div class="col-auto">
                        <q-btn
                          no-caps
                          class="text-weight-regular"
                          @click="$router.push('/super/admin/users/add/user')"
                          label="Add User"
                          color="purple-9"
                          size="md"
                          unelevated
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2">
          <!-- Deactivated Users Table -->
          <q-table
            :rows="getAllUsers"
            :columns="columns"
            class="customSATableClass"
            :filter="filterSearch"
            :selected="selectedUsersToDelete"
            @update:selected="updateSelectedUsers"
            :pagination="paginationControl"
            :loading="tableAjaxLoading"
            row-key="userId"
            color="grey-9"
            :rows-per-page-options="[10, 20, 30, 50]"
          >
            <template #body-cell-name="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="fnShowEditUser(props.row.userId)"
                  :label="props.row.user.name"
                  class="capitalize"
                />
              </q-td>
            </template>

            <template #body-cell-role="props">
              <q-td :props="props">
                <div class="row no-wrap q-gutter-xs" v-for="role in props.row.roles" :key="role.role">
                  <q-chip
                    color="light"
                    text-color="dark"
                    dense
                  >
                    <span>{{ role.hierarchy.hierarchyCode }}</span>
                    | {{ role.role }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template #top>
              <!-- Filter and Search for Deactivated -->
              <div class="col-md-12 q-mb-md">
                <div class="row items-center">
                  <div class="col-md-6">
                    <q-input
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Name, Merchant Name, Lead ID"
                      color="grey-9"
                      outlined
                      dense
                      clearable
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 text-right">
                    <q-btn
                      :disabled="selectedUsersToDelete.length === 0"
                      flat
                      color="grey-9"
                      class="q-mr-md"
                      size="md"
                      @click="activate_deactivate_users(selectedUsersToDelete)"
                      icon="far fa-trash-alt"
                      label="Activate Selected"
                      unelevated
                    />
                  </div>
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Delete Users Modal -->
      <delete-users-details
        v-if="showDeleteUserDetails"
        :prop-deteled-users="deteledUsers"
        :prop-toggle-modal="showDeleteUserDetails"
        @emit-toggle-delete-users-modal="toggleDeleteUsersModal"
      />
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useSuperAdminUsersStore } from 'src/stores/super-admin-users'
import JsonExcel from 'vue-json-excel3'
import DeleteUsersDetails from '../../components/super_admin/DeleteUsersDetails.vue'

// Component registration
const ExportExcel = JsonExcel

// Quasar and Router
const $q = useQuasar()
const router = useRouter()

// Pinia Stores
const superAdminUsersStore = useSuperAdminUsersStore()

// Reactive state
const activeTab = ref('tab-1')
const activeItemId = ref(0)
const filterSearch = ref('')
const filter_values = ref(null)
const selectedUsersToDelete = ref([])
const deteledUsers = ref([])
const showDeleteUserDetails = ref(false)
const tableAjaxLoading = ref(false)
const customizedHirarchyFilter = ref([])

// Pagination
const paginationControl = ref({
  rowsPerPage: 10,
  page: 1
})

// Excel export fields
const json_fields = {
  Name: 'user.name',
  EmployeeID: 'user.employeeID',
  ContactNo: 'user.contactNumber',
  EmailID: 'user.email',
  Role: {
    field: 'roles',
    callback: (value) => {
      let role = ''
      if (value && value.length > 0) {
        value.map(v => {
          if (role === '') {
            role = v.role
          } else {
            role = role + ' | ' + v.role
          }
        })
      }
      return role
    }
  },
  ReportingTo: {
    field: 'roles',
    callback: (value) => {
      let predecessor = ''
      if (value && value.length > 0) {
        value.map(v => {
          const predecessorEmail = v.predecessor != null ? v.predecessor.email : ''
          if (predecessor === '') {
            predecessor = predecessorEmail
          } else {
            predecessor = predecessor + ' | ' + predecessorEmail
          }
        })
      }
      return predecessor
    }
  },
  Location: 'user.city'
}

// Table columns
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: row => row.user.name,
    sortable: false
  },
  {
    name: 'employeeID',
    required: true,
    label: 'Employee ID',
    align: 'left',
    field: row => row.user.employeeID,
    sortable: true
  },
  {
    name: 'contactNumber',
    required: true,
    label: 'Contact No',
    align: 'left',
    field: row => row.user.contactNumber,
    sortable: false
  },
  {
    name: 'email',
    required: true,
    label: 'Email ID',
    align: 'left',
    field: row => row.user.email,
    sortable: false
  },
  {
    name: 'role',
    required: true,
    label: 'Role',
    align: 'left',
    field: 'role',
    sortable: false
  },
  {
    name: 'city',
    required: true,
    label: 'Location',
    align: 'left',
    field: row => row.user.city,
    sortable: false
  }
]

// Get store getters using storeToRefs for reactivity
const {
  getAllUsers,
  getAllRoles,
  getAllHierarchiesData,
} = storeToRefs(superAdminUsersStore)

// Get store actions
const {
  FETCH_ALL_USERS_DATA,
  FETCH_ALL_ROLES_DATA,
  FETCH_ALL_USERS_BY_ROLE_DATA,
  FETCH_ALL_HIERARCHIES_DATA,
  FETCH_ALL_REGIONS_DATA,
  FETCH_ALL_USERS_BY_HIERARCHY_DATA,
  DELETE_SELECTED_USERS,
  ACTIVATE_SELECTED_USERS
} = superAdminUsersStore


// Lifecycle hooks
onMounted(() => {
  loadInitialData()
})

onBeforeMount(() => {
  console.log('GET ALL USER--------->', JSON.stringify(getAllUsers.value))
})

// Methods
const loadInitialData = async () => {
  try {
    // Load user table data
    await ajaxLoadDataForAllUsersList()
    
    // Load user table data filter > Roles
    await ajaxLoadDataForRolesFilter()
    
    // Load user table data filter > Hierarchy
    await ajaxLoadDataForHeirarchyFilter()
    
    // Load user table data filter > Regions
    await ajaxLoadDataForRegionsFilter()
  } catch (error) {

    console.error('Error loading initial data:', error)
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to load initial data',
      icon: 'error'
    })
  }
}



const updateSelectedUsers = (selected) => {
  selectedUsersToDelete.value = selected
}

const activate_deactivate_users = async (selectedUsers) => {
  if (selectedUsers.length < 1) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'You must select at least one item to proceed!',
      icon: 'warning'
    })
    return
  }

  $q.dialog({
    title: 'Confirm',
    message: activeTab.value === 'tab-2'
      ? 'Are you sure want to activate users?'
      : 'Are you sure want to delete users?',
    ok: 'Continue',
    cancel: 'Cancel',
    persistent: true
  }).onOk(async () => {
    $q.loading.show({
      delay: 100,
      message: 'Please Wait',
      spinnerColor: 'purple-9',
      customClass: 'shadow-none'
    })

    const usersSelectSync = selectedUsers.map(user => user.userId)

    try {
      if (activeTab.value === 'tab-2') {
        // Activate users
        await ACTIVATE_SELECTED_USERS(usersSelectSync)
        await FETCH_ALL_USERS_DATA()
        selectedUsersToDelete.value = []
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully Activated!',
          icon: 'thumb_up'
        })
      } else {
        // Deactivate users
        const response = await DELETE_SELECTED_USERS(usersSelectSync)
        selectedUsersToDelete.value = []
        deteledUsers.value = response.data.data
        toggleDeleteUsersModal()
      }
    } catch (error) {

      console.error('Error:', error)
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.response?.data?.message || 'Please Try Again Later!',
        icon: 'thumb_down'
      })
    } finally {
      $q.loading.hide()
    }
  }).onCancel(() => {
    $q.notify({
      color: 'info',
      position: 'bottom',
      message: 'No changes made!',
      icon: 'info'
    })
  })
}

const toggleDeleteUsersModal = () => {
  showDeleteUserDetails.value = !showDeleteUserDetails.value
}

const fnShowEditUser = (userId) => {
  router.push({
    path: `/super/admin/users/edit/user/${userId}`,
    query: {
      page: paginationControl.value.page,
      perPage: paginationControl.value.rowsPerPage
    }
  })
}

// API Methods
const ajaxLoadDataForAllUsersList = async () => {
  tableAjaxLoading.value = true
  try {
    const params = activeTab.value === 'tab-2' 
      ? { flag: 'INACTIVE' } // Replace with your actual inactive flag
      : {}
    
    await FETCH_ALL_USERS_DATA(params)
    
    // Update pagination from route params if available
    if (router.currentRoute.value.query.page) {
      paginationControl.value.page = parseInt(router.currentRoute.value.query.page)
    }
    if (router.currentRoute.value.query.perPage) {
      paginationControl.value.rowsPerPage = parseInt(router.currentRoute.value.query.perPage)
    }
  } catch (error) {

    console.error('Error loading users:', error)
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to load users data',
      icon: 'error'
    })
  } finally {
    tableAjaxLoading.value = false
    $q.loading.hide()
  }
}

const ajaxLoadDataForRolesFilter = async () => {
  try {
    await FETCH_ALL_ROLES_DATA()
  } catch (error) {

    console.error('Error loading roles:', error)
  }
}

const ajaxLoadDataForRoleIdFilter = async () => {
  if (filter_values.value) {
    try {
      await FETCH_ALL_USERS_BY_ROLE_DATA(filter_values.value)
    } catch (error) {

      console.error('Error filtering by role:', error)
    }
  } else {
    await ajaxLoadDataForAllUsersList()
  }
}

const ajaxLoadDataForHeirarchyFilter = async () => {
  try {
    await FETCH_ALL_HIERARCHIES_DATA()
    if (getAllHierarchiesData.value) {
      customizedHirarchyFilter.value = [
        { value: 0, label: 'All' },
        ...getAllHierarchiesData.value
      ]
    }
  } catch (error) {

    console.error('Error loading hierarchies:', error)
  }
}

const ajaxLoadDataForRegionsFilter = async () => {
  try {
    await FETCH_ALL_REGIONS_DATA()
  } catch (error) {

    console.error('Error loading regions:', error)
  }
}

const ajaxLoadDataForHeirarchyIdFilter = async (itemIndex, tab) => {
  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9',
    customClass: 'shadow-none'
  })
  
  activeItemId.value = itemIndex
  try {
    if (tab.value === 0) {
      await FETCH_ALL_USERS_DATA()
    } else {
      await FETCH_ALL_USERS_BY_HIERARCHY_DATA(tab.value)
    }
  } catch (error) {

    console.error('Error filtering by hierarchy:', error)
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to filter data',
      icon: 'error'
    })
  } finally {
    $q.loading.hide()
  }
}



</script>

<style scoped>
.customTabActive {
  background: #6a1b9a; // purple color
  color: #fff;
}

.customSATableClass {
  .q-table__top {
    padding: 16px 0;
  }
  
  .q-table__control {
    min-height: 40px;
  }
}

:deep(.q-chip) {
  font-size: 12px;
  padding: 2px 8px;
}
</style>