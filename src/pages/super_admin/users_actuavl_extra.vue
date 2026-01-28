<template>
  <q-page>
    <div>
      <q-tabs
        v-model="activeTab"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
      >
        <!-- Tabs -->
        <q-tab
          @click="ajaxLoadDataForAllUsersList"
          name="tab-1"
          label="Active Users"
        />
        <q-tab
          @click="ajaxLoadDataForAllUsersList"
          name="tab-2"
          label="De-Actived Users"
        />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Tab 1: Active Users -->
        <q-tab-panel name="tab-1" class="no-padding">
          <q-table
            :rows="getAllUsers"
            :columns="columns"
            :filter="filterSearch"
            v-model:selected="selectedUsersToDelete"
            :pagination="paginationControl"
            :loading="tableAjaxLoading"
            :filter-method="myCustomSearchFilter"
            row-key="userId"
            color="grey-9"
            selection="multiple"
            class="customSATableClass"
          >
            <!-- Custom name column with edit button -->
            <template #body-cell-name="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="fnShowEditUser(props.row.userId)"
                  :label="props.row.user.name"
                  class="capitalize"
                />
              </q-td>
            </template>

            <!-- Custom role column -->
            <template #body-cell-role="props">
              <q-td :props="props">
                <div class="row no-wrap group" v-for="role in props.row.roles" :key="role.role">
                  <q-chip color="light" class="text-dark">
                    <span>{{ role.hierarchy.hierarchyCode }}</span>
                    | {{ role.role }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <!-- Top slot -->
            <template #top>
              <!-- START: table filter,search -->
              <div class="col-md-12 group q-mb-md">
                <div class="row q-col-gutter-md">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by SO name, Merchant Name, Lead ID"
                      outlined
                      dense
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-3"></div>
                  <div class="col-md-3">
                    <q-select
                      clearable
                      v-model="filter_values"
                      color="grey-9"
                      placeholder="Select"
                      label="Filter By"
                      @clear="ajaxLoadDataForAllUsersList"
                      @update:model-value="ajaxLoadDataForRoleIdFilter()"
                      :options="getAllRoles"
                      outlined
                      dense
                      emit-value
                      map-options
                    />
                  </div>
                </div>
              </div>
              <!-- END: table filter,search -->

              <!-- START: Tabs -->
              <div class="col-md-12 q-mb-md">
                <div class="row items-center">
                  <div class="col">
                    <q-btn
                      v-for="(tab, index) in getAllHierarchiesData"
                      :key="index"
                      class="text-black q-ma-xs"
                      size="sm"
                      :class="[activeItemId === index ? 'customTabActive text-light' : 'bg-blue-grey-2']"
                      @click="ajaxLoadDataForHeirarchyIdFilter(index, tab)"
                      rounded
                      :label="tab.label"
                    />
                  </div>
                  <div class="col-auto" align="right">
                    <q-btn
                      :disabled="selectedUsersToDelete.length == 0"
                      flat
                      color="grey-9"
                      class="q-mr-md"
                      size="md"
                      @click="activate_deactivate_users(selectedUsersToDelete)"
                      icon="far fa-trash-alt"
                    />
                  </div>
                  <div class="col-auto" align="right">
                    <q-btn
                      no-caps
                      class="text-weight-regular"
                      @click="$router.push('/super/admin/users/add/user')"
                      label="Add User"
                      color="purple-9"
                      size="md"
                    />
                  </div>
                </div>
              </div>
              <!-- END: Tabs -->
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Tab 2: Deactivated Users -->
        <q-tab-panel name="tab-2" class="no-padding">
          <q-table
            :rows="getAllUsers"
            :columns="columns"
            :filter="filterSearchDeactivated"
            v-model:selected="selectedUsersToDelete"
            :pagination="paginationControl"
            :loading="tableAjaxLoading"
            :filter-method="myCustomSearchFilter"
            row-key="userId"
            color="grey-9"
            selection="multiple"
            class="customSATableClass"
          >
            <!-- Custom name column (read-only for deactivated) -->
            <template #body-cell-name="props">
              <q-td :props="props">{{ props.row.user.name }}</q-td>
            </template>

            <!-- Custom role column -->
            <template #body-cell-role="props">
              <q-td :props="props">
                <div class="row no-wrap group" v-for="role in props.row.roles" :key="role.role">
                  <q-chip color="light" class="text-dark">
                    <span>{{ role.hierarchy.hierarchyCode }}</span>
                    | {{ role.role }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <!-- Top slot for deactivated tab -->
            <template #top>
              <div class="col-md-12 group q-mb-md">
                <div class="row items-center q-col-gutter-md">
                  <!-- START: table filter,search -->
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearchDeactivated"
                      placeholder="Type.."
                      label="Search by SO name, Merchant Name, Lead ID"
                      outlined
                      dense
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-3"></div>
                  <div class="col-md-3" align="right">
                    <q-btn
                      color="amber-9"
                      @click="activate_deactivate_users(selectedUsersToDelete)"
                      no-caps
                      label="Activate"
                    />
                  </div>
                </div>
              </div>
              <!-- END: table filter,search -->
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <deleteUsersDetails
        v-if="showDeleteUserDetails"
        :propDeteledUsers="deteledUsers"
        :propToggleModal="showDeleteUserDetails"
        @emitToggleDeleteUsersModal="toggleDeleteUsersModal"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import deleteUsersDetails from '../../components/super_admin/deleteUsersDetails.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Reactive state
const customizedHirarchyFilter = ref([])
const activeItemId = ref(0)
const activeTab = ref('tab-1')
const deteledUsers = ref([])
const showDeleteUserDetails = ref(false)
const filter_values = ref('')
const tableAjaxLoading = ref(false)
const filterSearch = ref('')
const filterSearchDeactivated = ref('')
const selectedUsersToDelete = ref([])

// Pagination
const paginationControl = reactive({
  rowsPerPage: 10,
  page: 1
})

// Columns definition
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

// Computed properties from Vuex store
const getAllUsers = computed(() => store.getters['SuperAdminUsers/getAllUsers'])
const getAllRoles = computed(() => store.getters['SuperAdminUsers/getAllRoles'])
const getAllHierarchiesData = computed(() => store.getters['SuperAdminUsers/getAllHierarchiesData'])

// Lifecycle hooks
onMounted(() => {
  // Load initial data
  ajaxLoadDataForAllUsersList()
  ajaxLoadDataForRolesFilter()
  ajaxLoadDataForHeirarchyFilter()
  ajaxLoadDataForRegionsFilter()
})

// Methods
const toggleDeleteUsersModal = () => {
  showDeleteUserDetails.value = !showDeleteUserDetails.value
}

const fnShowEditUser = (userId) => {
  router.push(
    '/super/admin/users/edit/user/' +
      userId +
      '/' +
      paginationControl.page +
      '/' +
      paginationControl.rowsPerPage
  )
}

const activate_deactivate_users = async (selectedUsers) => {
  if (selectedUsers.length < 1) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'You must select atleast one item to proceed!',
      icon: 'warning'
    })
    return
  }

  try {
    

    $q.loading.show({
      delay: 100,
      message: 'Please Wait',
      spinnerColor: 'purple-9',
      customClass: 'shadow-none'
    })

    const usersSelectSync = selectedUsers.map(user => user.userId)

    if (activeTab.value == 'tab-2') {
      // Activate users
      await store.dispatch('SuperAdminUsers/ACTIVATE_SELECTED_USERS', usersSelectSync)
      await ajaxLoadDataForAllUsersList()
      selectedUsersToDelete.value = []
      
      $q.loading.hide()
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Successfully Activated!',
        icon: 'thumb_up'
      })
    } else {
      // Deactivate users
      const response = await store.dispatch('SuperAdminUsers/DELETE_SELECTED_USERS', usersSelectSync)
      selectedUsersToDelete.value = []
      
      $q.loading.hide()
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Deactivation initiated',
        icon: 'refresh'
      })
      
      deteledUsers.value = response.data.data
      toggleDeleteUsersModal()
    }
  } catch (error) {

    $q.loading.hide()
    if (error === undefined) {
      // Dialog was cancelled
      $q.notify({
        color: 'info',
        position: 'bottom',
        message: 'Operation cancelled!',
        icon: 'info'
      })
      return
    }
    
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  }
}

const ajaxLoadDataForAllUsersList = async () => {
  $q.loading.show({
    delay: 100,
    message: 'Fetching List ..',
    spinnerColor: 'purple-9',
    customClass: 'shadow-none'
  })
  
  selectedUsersToDelete.value = []
  
  try {
    const inactiveFlag = activeTab.value == 'tab-2' ? import.meta.env.VITE_INACTIVE_FLAG_FOR_LIST : undefined
    await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_DATA', inactiveFlag)
    
    if (route.params.page) {
      paginationControl.page = parseInt(route.params.page)
    }
    if (route.params.perPage) {
      paginationControl.rowsPerPage = parseInt(route.params.perPage)
    }
  } catch (error) {

    console.error('Error loading users:', error)
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadDataForRolesFilter = async () => {
  try {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_ROLES_DATA')
  } catch (error) {

    console.error('Error loading roles:', error)
  }
}

const ajaxLoadDataForRoleIdFilter = async () => {
  if (filter_values.value) {
    try {
      await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_BY_ROLE_DATA', filter_values.value)
    } catch (error) {

      console.error('Error filtering by role:', error)
    }
  }
}

const ajaxLoadDataForHeirarchyFilter = async () => {
  try {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA')
    const hierarchies = store.getters['SuperAdminUsers/getAllHierarchiesData']
    if (hierarchies) {
      customizedHirarchyFilter.value = [{ value: 0, label: 'All' }, ...hierarchies]
    }
  } catch (error) {

    console.error('Error loading hierarchies:', error)
  }
}

const ajaxLoadDataForRegionsFilter = async () => {
  try {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')
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
    if (tab.value == 0) {
      await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_DATA')
    } else {
      await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_BY_HIERARCHY_DATA', tab.value)
    }
  } catch (error) {

    console.error('Error filtering by hierarchy:', error)
  } finally {
    $q.loading.hide()
  }
}

const myCustomSearchFilter = (rows, terms, cols, getCellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  return rows.filter(row =>
    cols.some(
      col =>
        (getCellValue(col, row) + '').toLowerCase().includes(lowerTerms)
    )
  )
}
</script>

<style scoped>
.customTabActive {
  background: purple;
  color: #fff;
}

.customSATableClass {
  /* Add any custom table styles here */
}
</style>