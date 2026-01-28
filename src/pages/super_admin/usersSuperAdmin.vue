<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" @update:model-value="changeTabs">
        <q-tab name="tab-1" label="Active Users" />
        <q-tab name="tab-2" label="De-activated Users" />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <!--START: table Data -->
            <q-table :rows="getAllUsers" :columns="columns" table-class="customSATableClass" v-model:filter="filterSearch"
              v-model:selected="formData.selectedUsersToDelete" v-model:pagination="paginationControl"
              :loading="tableAjaxLoading" :filter-method="myCustomSearchFilter" row-key="userId" color="grey-9">
              
              <template #body-cell-name="props">
                <q-td :props="props">
                  <q-btn align="left" dense flat no-wrap no-caps icon="fas fa-pencil-alt" color="primary"
                    @click="fnShowEditUser(props.row.userId)" :label="props.row.user.name" class="capitalize" />
                </q-td>
              </template>

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

              <template #top>
                <!--START: table filter,search -->
                <div class="col-md-12 group">
                  <div class="row">
                    <div class="col-md-6">
                      <q-input clearable v-model="filterSearch" color="grey-9" placeholder="Type.."
                        label="Search by Name, Merchant Name, Lead ID" filled>
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-md-3"></div>
                    <div class="col-md-3">
                      <q-select clearable v-model="filter_values" color="grey-9" placeholder="Select"
                        label="Filter By" @clear="ajaxLoadDataForAllUsersList"
                        @update:model-value="ajaxLoadDataForRoleIdFilter" :options="getAllRoles" filled />
                    </div>
                  </div>
                </div>
                <!--END: table filter,search -->
                <!--START: Tabs -->
                <div class="col-md-12">
                  <div class="row justify-between">
                    <div class="col">
                      <q-btn v-for="(tab, index) in getAllHierarchiesData" :key="index" ref="removeClass"
                        class="text-black q-ma-xs" size="sm" :class="[
                          activeItemId === index
                            ? 'customTabActive text-light'
                            : 'bg-blue-grey-2'
                        ]" @click="ajaxLoadDataForHeirarchyIdFilter(index, tab)" rounded :label="tab.label" />
                    </div>
                    <div class="col-auto" align="right">
                      <div class="row justify-evenly">
                        <div class="col-auto q-px-xs">
                          <q-btn :disabled="formData.selectedUsersToDelete.length == 0" flat color="white"
                            class="text-grey-9"
                            @click="activate_deactivate_users(formData.selectedUsersToDelete)"
                            icon="far fa-trash-alt" />
                        </div>
                        <div class="col-auto q-px-xs">
                          <downloadExcel :data="getAllUsers" :fields="json_fields" name="UserDetails.xls">
                            <q-btn outline color="grey-9" label="Download as excel" />
                          </downloadExcel>
                        </div>
                        <div class="col-auto q-px-xs">
                          <q-btn no-caps class="text-weight-regular" @click="router.push('/super/admin/users/add/user')"
                            label="Add User" color="purple-9" size="md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--END: Tabs -->
              </template>
            </q-table>
            <!--END: table Data -->
          </q-tab-panel>

          <q-tab-panel name="tab-2">
            <!--START: table Data -->
            <q-table :rows="getAllUsers" :columns="columns" table-class="customSATableClass" v-model:filter="filterSearch"
              v-model:selected="formData.selectedUsersToDelete" v-model:pagination="paginationControl"
              :loading="tableAjaxLoading" :filter-method="myCustomSearchFilter" row-key="userId" color="grey-9">
              
              <template #body-cell-name="props">
                <q-td :props="props">
                  <q-btn align="left" dense flat no-wrap no-caps icon="fas fa-pencil-alt" color="primary"
                    @click="fnShowEditUser(props.row.userId)" :label="props.row.user.name" class="capitalize" />
                </q-td>
              </template>

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

              <template #top>
                <!--START: table filter,search -->
                <div class="col-md-12 group">
                  <div class="row items-stretch">
                    <div class="col-md-6">
                      <q-input clearable v-model="filterSearch" color="grey-9" placeholder="Type.."
                        label="Search by Name, Merchant Name, Lead ID" filled>
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-md-6" align="right">
                      <q-btn :disabled="formData.selectedUsersToDelete.length == 0" flat color="white"
                        class="text-grey-9 q-mr-md" size="md"
                        @click="activate_deactivate_users(formData.selectedUsersToDelete)" icon="far fa-trash-alt" />
                    </div>
                  </div>
                </div>
              </template>
            </q-table>
            <!--END: table Data -->
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>

      <deleteUsersDetails v-if="showDeleteUserDetails" :propDeteledUsers="deteledUsers"
        :propToggleModal="showDeleteUserDetails" @emitToggleDeleteUsersModal="toggleDeleteUsersModal" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

// Try different import names for the excel export library
// First check if the original vue-json-excel package supports Vue 3
import downloadExcel from 'vue-json-excel'

// If the above doesn't work, you might need to use a different library
// Alternative: json2excel for Vue 3 or implement custom export
// import { exportToExcel } from '@/utils/excelExport' // Custom implementation

import deleteUsersDetails from '../../components/super_admin/deleteUsersDetails.vue'

// Store and router
const store = useStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Constants
const INACTIVE_FLAG_FOR_LIST = 'inactive'

// Refs
const customizedHirarchyFilter = ref([])
const activeItemId = ref(0)
const activeTab = ref('tab-1')
const deteledUsers = ref([])
const showDeleteUserDetails = ref(false)
const filterSearch = ref('')
const filter_values = ref('')
const tableAjaxLoading = ref(false)
const paginationControl = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Reactive data
const formData = reactive({
  selectedUsersToDelete: []
})

// Excel export fields
const json_fields = {
  Name: "user.name",
  EmployeeID: "user.employeeID",
  ContactNo: "user.contactNumber",
  EmailID: "user.email",
  Role: {
    field: 'roles',
    callback: (value) => {
      let role = ""
      if (value && value.length > 0) {
        value.forEach(v => {
          if (role === "") {
            role = v.role
          } else {
            role = role + " | " + v.role
          }
        })
      }
      return role
    }
  },
  ReportingTo: {
    field: 'roles',
    callback: (value) => {
      let predecessor = ""
      if (value && value.length > 0) {
        value.forEach(v => {
          const predEmail = v.predecessor ? v.predecessor.email : ""
          if (predecessor === "") {
            predecessor = predEmail
          } else {
            predecessor = predecessor + " | " + predEmail
          }
        })
      }
      return predecessor
    }
  },
  Location: "user.city"
}

// Table columns
const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: row => row.user?.name || '',
    sortable: false
  },
  {
    name: "employeeID",
    required: true,
    label: "Employee ID",
    align: "left",
    field: row => row.user?.employeeID || '',
    sortable: true
  },
  {
    name: "contactNumber",
    required: true,
    label: "Contact No",
    align: "left",
    field: row => row.user?.contactNumber || '',
    sortable: false
  },
  {
    name: "email",
    required: true,
    label: "Email ID",
    align: "left",
    field: row => row.user?.email || '',
    sortable: false
  },
  {
    name: "role",
    required: true,
    label: "Role",
    align: "left",
    field: "role",
    sortable: false
  },
  {
    name: "city",
    required: true,
    label: "Location",
    align: "left",
    field: row => row.user?.city || '',
    sortable: false
  }
]

// Computed properties
const getAllUsers = computed(() => store.getters['SuperAdminUsers/getAllUsers'])
const getAllRoles = computed(() => store.getters['SuperAdminUsers/getAllRoles'])
const getAllRegionsData = computed(() => store.getters['SuperAdminUsers/getAllRegionsData'])
const getAllHierarchiesData = computed(() => store.getters['SuperAdminUsers/getAllHierarchiesData'])
const getAllUserByUserIdData = computed(() => store.getters['SuperAdminUsers/getAllUserByUserIdData'])
const getAllStatesData = computed(() => store.getters['SuperAdminUsers/getAllStatesData'])

// Methods
const changeTabs = (tab) => {
  if (tab === "tab-2") {
    ajaxLoadDataForAllUsersList()
  } else {
    ajaxLoadDataForAllUsersList()
  }
}

const activate_deactivate_users = (selectedUsersToDelete) => {
  if (selectedUsersToDelete.length < 1) {
    $q.notify({
      color: "warning",
      position: "bottom",
      message: "You must select atleast one item to proceed!",
      icon: "warning"
    })
    return
  }

  $q.dialog({
    title: "Confirm",
    message: activeTab.value === "tab-2"
      ? "Are you sure want to activate users?"
      : "Are you sure want to delete users?",
    ok: "Continue",
    cancel: "Cancel"
  }).then(async () => {
    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "purple-9",
      customClass: "shadow-none"
    })

    const usersSelectSync = selectedUsersToDelete.map(value => value.userId)

    try {
      if (activeTab.value === "tab-2") {
        await store.dispatch('SuperAdminUsers/ACTIVATE_SELECTED_USERS', usersSelectSync)
        await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_DATA')
        formData.selectedUsersToDelete = []
        $q.loading.hide()
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Activated!",
          icon: "thumb_up"
        })
      } else {
        const response = await store.dispatch('SuperAdminUsers/DELETE_SELECTED_USERS', usersSelectSync)
        formData.selectedUsersToDelete = []
        $q.loading.hide()
        deteledUsers.value = response?.data?.data || []
        toggleDeleteUsersModal()
      }
    } catch (error) {
      $q.loading.hide()
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.body?.message || "Please Try Again Later !",
        icon: "thumb_down"
      })
    }
  }).catch(() => {
    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "No changes made!",
      icon: "thumb_down"
    })
  })
}

const toggleDeleteUsersModal = () => {
  showDeleteUserDetails.value = !showDeleteUserDetails.value
}

const fnShowEditUser = (userId) => {
  router.push(
    `/super/admin/users/edit/user/${userId}/${paginationControl.value.page}/${paginationControl.value.rowsPerPage}`
  )
}

const ajaxLoadDataForAllUsersList = async () => {
  $q.loading.show({
    delay: 100,
    message: "Fetching List ..",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  })
  formData.selectedUsersToDelete = []
  
  try {
    const params = activeTab.value === "tab-2" ? { flag: INACTIVE_FLAG_FOR_LIST } : {}
    await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_DATA', params)
    
    paginationControl.value.page = route.params.page || 1
    paginationControl.value.rowsPerPage = route.params.perPage || 10
    $q.loading.hide()
  } catch {
    $q.loading.hide()
  }
}

const ajaxLoadDataForRolesFilter = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_ROLES_DATA')
}

const ajaxLoadDataForRoleIdFilter = () => {
  if (filter_values.value) {
    store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_BY_ROLE_DATA', filter_values.value)
  }
}

const ajaxLoadDataForHeirarchyFilter = async () => {
  await store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA')
  customizedHirarchyFilter.value = getAllHierarchiesData.value
  customizedHirarchyFilter.value.unshift({ value: 0, label: "All" })
}

const ajaxLoadDataForRegionsFilter = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')
}

const ajaxLoadDataForHeirarchyIdFilter = async (itemIndex, tab) => {
  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  })
  activeItemId.value = itemIndex
  
  try {
    if (tab.value == 0) {
      await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_DATA')
    } else {
      await store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_BY_HIERARCHY_DATA', tab.value)
    }
    $q.loading.hide()
  } catch {
    $q.loading.hide()
  }
}

const myCustomSearchFilter = (rows, terms, cols, getCellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ""
  return rows.filter(row =>
    cols.some(col => {
      const cellValue = getCellValue(col, row)
      return String(cellValue).toLowerCase().includes(lowerTerms)
    })
  )
}

// Alternative Excel export function (if vue-json-excel doesn't work)
const exportToExcel = () => {
  const data = getAllUsers.value
  if (!data || data.length === 0) {
    $q.notify({
      color: 'warning',
      message: 'No data to export'
    })
    return
  }

  // Convert data to CSV format
  const headers = Object.keys(json_fields)
  const csvContent = [
    headers.join(','),
    ...data.map(row => {
      return headers.map(header => {
        let value = row
        const fieldConfig = json_fields[header]
        
        if (typeof fieldConfig === 'function') {
          value = fieldConfig.callback(value)
        } else if (typeof fieldConfig === 'object' && fieldConfig.callback) {
          const fieldValue = fieldConfig.field.split('.').reduce((obj, key) => obj?.[key], row)
          value = fieldConfig.callback(fieldValue)
        } else if (typeof fieldConfig === 'string') {
          value = fieldConfig.split('.').reduce((obj, key) => obj?.[key], row)
        }
        
        return `"${String(value || '').replace(/"/g, '""')}"`
      }).join(',')
    })
  ].join('\n')

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'UserDetails.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Lifecycle hooks
onMounted(() => {
  ajaxLoadDataForAllUsersList()
  ajaxLoadDataForRolesFilter()
  ajaxLoadDataForHeirarchyFilter()
  ajaxLoadDataForRegionsFilter()
})

// Watch for route changes
watch(() => route.params, () => {
  if (route.params.page) {
    paginationControl.value.page = parseInt(route.params.page)
  }
  if (route.params.perPage) {
    paginationControl.value.rowsPerPage = parseInt(route.params.perPage)
  }
})
</script>

<style scoped>
.customTabActive {
  background: purple;
  color: #fff;
}
</style>