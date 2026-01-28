<template>
  <div>
    <form>
      <div class="q-px-md">
        <div class="q-pa-sm">
          <div class="row gutter-sm q-py-sm items-center bottom-border">
            <div>
              <div class="q-title text-weight-regular">Add New User</div>
            </div>
          </div>
        </div>
        <div class="q-pa-md">
          <div class="row q-py-sm">
            <div class="group">
              <div>Permissions</div>
              <q-checkbox color="purple-9" label="Read" v-model="formData.addUserDetails.hasReadPermission" />
              <q-checkbox color="purple-9" label="Write" v-model="formData.addUserDetails.hasWritePermission" />
              <q-checkbox color="purple-9" label="Update" v-model="formData.addUserDetails.hasEditPermission" />
              <q-checkbox color="purple-9" label="Delete" v-model="formData.addUserDetails.hasDeletePermission" />
              <q-checkbox color="purple-9" label="Download" v-model="formData.addUserDetails.hasDownloadPermission" />
            </div>
          </div>
        </div>
        <div class="q-pa-md">
          <div class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select :disable="formData.disableRegionSelection"
                :class="[formData.disableRegionSelection ? 'no-pointer-events' : '']" color="grey-9"
                label="Choose a region" v-model="formData.addUserDetails.region.id"
                :error="$v.formData.addUserDetails.region.id.$error" @blur="$v.formData.addUserDetails.region.id.$touch"
                :options="getAllRegionsData" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.name" @blur="$v.formData.addUserDetails.name.$touch"
                :error="$v.formData.addUserDetails.name.$error" class="text-weight-regular text-grey-8" color="grey-9"
                label="*Name" placeholder="Name" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.employeeID"
                @blur="$v.formData.addUserDetails.employeeID.$touch"
                :error="$v.formData.addUserDetails.employeeID.$error" class="text-weight-regular text-grey-8"
                color="grey-9" label="*Employee ID" placeholder="Employee ID" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.email" class="text-weight-regular text-grey-8"
                color="grey-9" @blur="$v.formData.addUserDetails.email.$touch"
                :error="$v.formData.addUserDetails.email.$error" label="*Email" placeholder="Email" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.contactNumber"
                @blur="$v.formData.addUserDetails.contactNumber.$touch"
                :error="$v.formData.addUserDetails.contactNumber.$error" class="text-weight-regular text-grey-8"
                color="grey-9" label="*Contact Number" placeholder="Contact Number" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.alternateContactNumber"
                @blur="$v.formData.addUserDetails.alternateContactNumber.$touch"
                :error="$v.formData.addUserDetails.alternateContactNumber.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Alt Contact Number"
                placeholder="Alt Contact Number" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.userAddress"
                @blur="$v.formData.addUserDetails.userAddress.$touch"
                :error="$v.formData.addUserDetails.userAddress.$error" class="text-weight-regular text-grey-8"
                color="grey-9" label="*Address" placeholder="Address" />
            </div>

            <div class="col-md-6">
              <q-input type="number" :error="$v.formData.addUserDetails.pincodeTemp.$error" clearable
                @clear="fnGetCityAndState" color="grey-9" v-model.trim="formData.addUserDetails.pincodeTemp"
                label="Pincode" placeholder="Pincode">
                <template v-slot:after>
                  <q-menu touch-position>
                    <q-list dense style="min-width: 200px">
                      <q-item v-for="item in pincodeResults" :key="item.value.pincode"
                        clickable @click="pincodeSelected(item)">
                        <q-item-section>
                          <q-item-label>{{ item.label }}</q-item-label>
                          <q-item-label caption>{{ item.value.cityName }}, {{ item.value.stateName }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </template>
              </q-input>
            </div>

            <div class="col-md-6">
              <q-input readonly v-model.trim="formData.addUserDetails.state" class="text-weight-regular text-grey-8"
                color="grey-9" label="*State" placeholder="State" />
            </div>

            <div class="col-md-6">
              <q-input readonly v-model.trim="formData.addUserDetails.city" class="text-weight-regular text-grey-8"
                color="grey-9" label="*City" placeholder="City" />
            </div>
          </div>

          <div class="row group" v-for="(item, index) in getAllHierarchiesAndRolesData" :key="index">
            <div class="col">
              <q-checkbox color="purple-9" v-model="item.checked" @update:model-value="getRoleCheckedItem(item)"
                :label="item.hierarchy" />
            </div>
            <div class="col">
              <q-select :disable="!item.checked" color="grey-9" placeholder="Choose a role" v-model="item.roleChecked"
                :options="item.roles" @update:model-value="getPredecessorList(item)" />
            </div>
            <div class="col">
              <q-select :disable="item.id>7" color="grey-9"
                :placeholder="item.predecessor.length == 0 ? 'No data available to display' : 'Choose a predecessor'"
                v-model="item.predecessorChecked" :options="item.predecessor" />
            </div>
          </div>
          <div v-if="formData.showBankOpsList" class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select multiple color="grey-9" label="Choose bank (can be multiple)"
                v-model="formData.addUserDetails.banksList" :error="$v.formData.addUserDetails.banksList.$error"
                @blur="$v.formData.addUserDetails.banksList.$touch" :options="leadSourceOptions" />
            </div>
          </div>
          <div v-if="formData.showAllRoleDetails == 25" class="row gutter-sm q-py-sm">
            <label> Lead Source Enable? </label>
            <div class="col-md-9">
              <q-radio v-for="(item, index) in LeadSourceOptions1" :key="index" color="grey-9"
                v-model.trim="formData.addUserDetails.leadSource.sourceName"
                @blur="$v.formData.addUserDetails.leadSource.sourceName.$touch"
                :error="$v.formData.addUserDetails.leadSource.sourceName.$error" :val="item.value"
                :label="item.label" />
            </div>
          </div>
          <div v-if="formData.showLeadSource" class="row gutter-sm q-py-sm">
            <div class="col-md-6">
             <q-field hint="Token, Basic, Barrier" >
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.authMethod"
                @blur="$v.formData.addUserDetails.serviceReqClients.authMethod.$touch"
                :error="$v.formData.addUserDetails.serviceReqClients.authMethod.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Auth Method"
                placeholder="Auth Method" /></q-field>
            </div>
            <div class="col-md-6">
            <q-field hint="Authorization">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.authKey"
                @blur="$v.formData.addUserDetails.serviceReqClients.authKey.$touch"
                :error="$v.formData.addUserDetails.serviceReqClients.authKey.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Auth Key " placeholder="Auth Key" />
            </q-field>
            </div>
            <div class="col-md-6">
            <q-field hint="Encrypted Data">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.authValue"
                @blur="$v.formData.addUserDetails.serviceReqClients.authValue.$touch"
                :error="$v.formData.addUserDetails.serviceReqClients.authValue.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Auth Value" placeholder="Auth Value" />
            </q-field>
            </div>
            <div class="col-md-6">
            <q-field hint="callBackUrl">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.callBackUrl"
                @blur="$v.formData.addUserDetails.serviceReqClients.callBackUrl.$touch"
                :error="$v.formData.addUserDetails.serviceReqClients.callBackUrl.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="URL" placeholder="URL" />
            </q-field>
            </div>
          </div>
        </div>
        <div class="full-width group" align="right">
          <q-btn flat size="md" class="bg-white text-weight-regular text-grey-8" @click="$router.go(-1)">Cancel</q-btn>
          <q-btn size="md" type="button" color="purple-9" @click="fnSubmitShowAddUser(formData.addUserDetails)">Submit
          </q-btn>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { required, requiredIf, email, minLength, maxLength, alphaNum, numeric } from "@vuelidate/validators"
import useVuelidate from '@vuelidate/core'
import _ from 'lodash'

// Store imports - adjust these based on your actual store setup
import { useStore } from 'vuex'

const $q = useQuasar()
const router = useRouter()
const store = useStore()

const leadSourceOptions = ref([])
const LeadSourceOptions1 = ref([
  {
    label: "Yes",
    value: "Yes"
  },
  {
    label: "No",
    value: "No"
  },
])
const pincodeResults = ref([])

const formData = ref({
  showBankOpsList: false,
  showLeadSource: false,
  showAllRoleDetails: false,
  disableRegionSelection: false,
  addUserDetails: {
    hasReadPermission: false,
    hasWritePermission: false,
    hasDeletePermission: false,
    hasEditPermission: false,
    hasDownloadPermission: false,
    banksList: [],
    banksListTitle: [],
    region: {
      id: ""
    },
    leadSource: {
      sourceName: null
    },
    dynamicDataBinding: "",
    profilePicture: "uploads/c7818f74-9652-42f9-a902-9da6a692cdf3.png",
    name: "",
    employeeID: "",
    email: "",
    contactNumber: "",
    alternateContactNumber: "",
    userAddress: "",
    city: "",
    state: "",
    pincode: "",
    pincodeTemp: "",
    stateTemp: [],
    latitude: 13.25,
    longitude: 80.25,
    serviceReqClients: {
      authMethod: null,
      authKey: null,
      authValue: null,
      callBackUrl: null,
    },
  }
})

// Vuelidate rules
const rules = {
  formData: {
    addUserDetails: {
      name: {
        required,
        minLength: minLength(2)
      },
      employeeID: {
        required,
        alphaNum,
        minLength: minLength(2)
      },
      email: {
        required,
        email
      },
      contactNumber: {
        required,
        minLength: minLength(7),
        maxLength: maxLength(10),
        numeric
      },
      alternateContactNumber: {
        minLength: minLength(7),
        maxLength: maxLength(10),
        numeric
      },
      userAddress: {
        required,
        minLength: minLength(2)
      },
      pincodeTemp: {
        required
      },
      region: {
        id: {
          required: requiredIf(() => formData.value.disableRegionSelection === false)
        }
      },
      banksList: {
        required: requiredIf(() => formData.value.showBankOpsList),
        minLength: minLength(1)
      },
      leadSource: {
        sourceName: {
          required: requiredIf(() => formData.value.showAllRoleDetails == 25)
        }
      },
      serviceReqClients: {
        authMethod: {
          required: requiredIf(() => formData.value.showLeadSource === true)
        },
        authKey: {
          required: requiredIf(() => formData.value.showLeadSource === true)
        },
        authValue: {
          required: requiredIf(() => formData.value.showLeadSource === true)
        },
        callBackUrl: {
          required: requiredIf(() => formData.value.showLeadSource === true)
        },
      },
    }
  }
}

const $v = useVuelidate(rules, formData)

// Computed properties
const getAllRegionsData = computed(() => store.getters['SuperAdminUsers/getAllRegionsData'] || [])
const getAllHierarchiesAndRolesData = computed(() => store.getters['SuperAdminUsers/getAllHierarchiesAndRolesData'] || [])
const getPredecessorByRoleHierarchyData = computed(() => store.getters['SuperAdminUsers/getPredecessorByRoleHierarchyData'] || [])
const getSelectOptionsLeadSourceInfo = computed(() => store.getters['BankOpsShortLead/getSelectOptionsLeadSourceInfo'] || [])

onMounted(() => {
  // Load initial data
  ajaxLoadDataForAllStatesList()
  ajaxLoadDataForHeirarchyFilter()
  ajaxLoadDataForRegionsFilter()
  ajaxLoadDataForBankListFilter()
})

// Methods
const ajaxLoadDataForHeirarchyFilter = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_ROLES_DATA')
}

const ajaxLoadDataForAllStatesList = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA')
}

const ajaxLoadDataForRegionsFilter = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')
}

const ajaxLoadDataForBankListFilter = () => {
  store.dispatch('BankOpsShortLead/FETCH_ALL_LEAD_SOURCE_DATA').then(() => {
    const assumeArr = []
    _.map(getSelectOptionsLeadSourceInfo.value, function (oo) {
      assumeArr.push({ label: oo.sourceName, value: oo.id })
    })
    leadSourceOptions.value = assumeArr
  })
}


const pincodeSelected = (item) => {
  formData.value.addUserDetails.state = item.value.stateName
  formData.value.addUserDetails.city = item.value.cityName
  formData.value.addUserDetails.pincode = item.value.pincode
  formData.value.addUserDetails.pincodeTemp = item.value.pincode
  pincodeResults.value = []
}



const fnGetCityAndState = () => {
  if (formData.value.addUserDetails.pincodeTemp && typeof formData.value.addUserDetails.pincodeTemp === 'object') {
    formData.value.addUserDetails.pincode = formData.value.addUserDetails.pincodeTemp.pincode
    formData.value.addUserDetails.state = formData.value.addUserDetails.pincodeTemp.stateName
    formData.value.addUserDetails.city = formData.value.addUserDetails.pincodeTemp.cityName
  }
}

const fnSubmitShowAddUser = async (reqData) => {
  console.log("fnSubmitShowAddUser--------->", JSON.stringify(reqData))
  
  const requestParams = { ...formData.value.addUserDetails }
  const cookedArr = []
  
  // Remove unused variable assignment and just use the map function
  getAllHierarchiesAndRolesData.value.forEach(function (value) {
    if (
      value.checked == true &&
      value.roleChecked != null &&
      value.predecessorChecked != null
    ) {
      const assumeObj = {
        hierarchy: {
          id: value.id
        },
        role: {
          id: value.roleChecked
        },
        region: {
          id: formData.value.addUserDetails.region.id
        },
        predecessor: {
          id: value.predecessorChecked
        }
      }
      cookedArr.push(assumeObj)
    }
  })

  requestParams.userMapSets = cookedArr
  console.log("cookedArr----------->", JSON.stringify(requestParams))
  
  if (requestParams.userMapSets.length == 0) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Role mapping is mandatory",
      icon: "warning"
    })
    return false
  } else {
    console.log("SUBMITTING THE CHECKSUM VALUES-1234------->", JSON.stringify(requestParams.userMapSets))
    const checkSum = _.find(requestParams.userMapSets, function (oo) {
      return (oo.hierarchy.id == 0 || oo.role.id == 0 || oo.predecessor.id == 0)
    })
    console.log("THE CHECKSUM VALUES-------->", JSON.stringify(checkSum))
    
    if (checkSum != undefined && checkSum.hierarchy.id != 9 && checkSum.hierarchy.id != 10 && checkSum.hierarchy.id != 11) {
      if (checkSum.hierarchy.id == 0) {
        $q.notify({
          type: "negative",
          color: "amber-9",
          position: "bottom",
          message: "Hierarchy is mandatory"
        })
      } else if (checkSum.role.id == 0) {
        $q.notify({
          type: "negative",
          color: "amber-9",
          position: "bottom",
          message: "Role is mandatory"
        })
      } else if (checkSum.predecessor.id == 0 && checkSum.hierarchy.id != 9 && checkSum.hierarchy.id != 10 && checkSum.hierarchy.id != 11) {
        $q.notify({
          type: "negative",
          color: "amber-9",
          position: "bottom",
          message: "Predecessor is mandatory"
        })
      }
      return
    } else {
      $v.value.formData.addUserDetails.$touch()
      if ($v.value.formData.addUserDetails.$error) {
        $q.notify("Please review fields again.")
      } else {
        const banksListArr = []
        _.map(requestParams.banksList, function (oo) {
          banksListArr.push({ id: oo })
        })
        requestParams.banksList = banksListArr
        
        console.log("before requestParams ----------->", JSON.stringify(requestParams))
        
        requestParams.leadSource = requestParams.leadSource.sourceName == "Yes" ? {
          sourceName: requestParams.name,
          sourceCode: requestParams.name
        } : null
        
        requestParams.serviceReqClients = requestParams.serviceReqClients.authMethod != null && 
          requestParams.serviceReqClients.authKey != null && 
          requestParams.serviceReqClients.authValue != null && 
          requestParams.serviceReqClients.callBackUrl != null ? {
            authMethod: requestParams.serviceReqClients.authMethod,
            authKey: requestParams.serviceReqClients.authKey,
            authValue: requestParams.serviceReqClients.authValue,
            callBackUrl: requestParams.serviceReqClients.callBackUrl,
          } : null
        
        console.log("after requestParams ----------->", JSON.stringify(requestParams))
        
        const checkSum = _.find(requestParams.userMapSets, function (oo) {
          return (oo.hierarchy.id == 9 || oo.hierarchy.id == 10 || oo.hierarchy.id == 11)
        })
        
        if (checkSum != undefined)
          requestParams.userMapSets[0].predecessor = null

        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        })
        
        try {
          await store.dispatch('SuperAdminUsers/FEED_USER_DATA', requestParams)
          $q.loading.hide()
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "User successfully created",
            icon: "thumb_up"
          })
          router.push("/super/admin/users/")
        } catch (error) {
          $q.loading.hide()
          $q.notify({
            type: "warning",
            color: "amber-9",
            position: "bottom",
            message: error.data?.message || "An error occurred"
          })
        }
      }
    }
  }
}

const getPredecessorList = async (item) => {
  console.log("ROLE DETAILS--------->", JSON.stringify(item))

  const requestData = {
    region: {
      id: formData.value.addUserDetails.region.id
    },
    role: {
      id: item.roleChecked
    }
  }
  
  formData.value.showAllRoleDetails = requestData.role.id
  console.log("ROLE requestData-------->", JSON.stringify(requestData))
  
  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9"
  })
  
  try {
    await store.dispatch('SuperAdminUsers/FETCH_PREDECESSOR_ON_ROLE', requestData)
    $q.loading.hide()
    const cookedArr = []
    getPredecessorByRoleHierarchyData.value.forEach(function (value) {
      cookedArr.push({ label: value.user.name, value: value.user.id })
    })
    item.predecessor = cookedArr
  } catch (error) {
    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    })
  }
}

const getRoleCheckedItem = (request) => {
  console.log("checksum request : ---------->", JSON.stringify(request))
  
  // Define hierarchy constants (these should be defined somewhere in your app)
  const HIERARCHY_BANKS_OPS = 'HIERARCHY_BANKS_OPS'
  const HIERARCHY_SERVICE_CLIENTS = 'HIERARCHY_SERVICE_CLIENTS'
  const HIERARCHY_CRM = 'HIERARCHY_CRM'
  
  const checksum = _.find(getAllHierarchiesAndRolesData.value, function (oo) {
    return oo.hierarchyCode == HIERARCHY_BANKS_OPS && oo.checked
  })
  
  const checksum1 = _.find(getAllHierarchiesAndRolesData.value, function (oo) {
    return oo.hierarchyCode == HIERARCHY_SERVICE_CLIENTS && oo.checked
  })
  
  const checksum2 = _.find(getAllHierarchiesAndRolesData.value, function (oo) {
    return oo.hierarchyCode == HIERARCHY_CRM && oo.checked
  })
  
  // Update formData based on checksums
  formData.value.showBankOpsList = !!(checksum || checksum1 && checksum2 || checksum && checksum1 && checksum2)
  formData.value.disableRegionSelection = !!(checksum || checksum1 || checksum2)
  formData.value.showLeadSource = !!(checksum1 || checksum1 && checksum2 || checksum && checksum1 && checksum2)
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.group {
  margin-bottom: 20px;
}
</style>
