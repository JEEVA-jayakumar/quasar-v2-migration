<template>
  <div>
    <form>
      <div class="q-px-md">
        <div class="q-pa-sm">
          <div class="row gutter-sm q-py-sm items-center bottom-border">
            <div>
              <div class="q-title text-weight-regular">Update User</div>
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
              <q-select :disabled="formData.disableRegionSelection"
                :class="[formData.disableRegionSelection ? 'no-pointer-events' : '']" color="grey-9"
                :label="'Choose a region'" v-model="formData.addUserDetails.region.id"
                :error="v$.formData.addUserDetails.region.id.$error" @blur="v$.formData.addUserDetails.region.id.$touch"
                :options="getAllRegionsData" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.name" @blur="v$.formData.addUserDetails.name.$touch"
                :error="v$.formData.addUserDetails.name.$error" class="text-weight-regular text-grey-8" color="grey-9"
                :label="'*Name'" placeholder="Name" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.employeeID"
                @blur="v$.formData.addUserDetails.employeeID.$touch"
                :error="v$.formData.addUserDetails.employeeID.$error" class="text-weight-regular text-grey-8"
                color="grey-9" :label="'*Employee ID'" placeholder="Employee ID" />
            </div>

            <div class="col-md-6">
              <q-input disable v-model.trim="formData.addUserDetails.email" class="text-weight-regular text-grey-8"
                color="grey-9" @blur="v$.formData.addUserDetails.email.$touch"
                :error="v$.formData.addUserDetails.email.$error" :label="'*Email'" placeholder="Email" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.contactNumber"
                @blur="v$.formData.addUserDetails.contactNumber.$touch"
                :error="v$.formData.addUserDetails.contactNumber.$error" class="text-weight-regular text-grey-8"
                color="grey-9" :label="'*Contact Number'" placeholder="Contact Number" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.alternateContactNumber"
                @blur="v$.formData.addUserDetails.alternateContactNumber.$touch"
                :error="v$.formData.addUserDetails.alternateContactNumber.$error"
                class="text-weight-regular text-grey-8" color="grey-9" :label="'Alt Contact Number'"
                placeholder="Alt Contact Number" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.userAddress"
                @blur="v$.formData.addUserDetails.userAddress.$touch"
                :error="v$.formData.addUserDetails.userAddress.$error" class="text-weight-regular text-grey-8"
                color="grey-9" :label="'*Address'" placeholder="Address" />
            </div>

            <div class="col-md-6">
              <q-input type="number" :error="v$.formData.addUserDetails.pincodeTemp.$error" clearable
                @clear="fnGetCityAndState" color="grey-9" v-model.trim="formData.addUserDetails.pincodeTemp"
                :label="'Pincode'" placeholder="Pincode">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-menu v-if="pincodeOptions.length > 0">
                <q-list dense>
                  <q-item v-for="(option, index) in pincodeOptions" :key="index"
                    clickable @click="pincodeSelected(option)">
                    <q-item-section>
                      <q-item-label>{{ option.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>
            
            <div class="col-md-6">
              <q-input disable v-model.trim="formData.addUserDetails.state" class="text-weight-regular text-grey-8"
                color="grey-9" :label="'*State'" placeholder="State" />
            </div>

            <div class="col-md-6">
              <q-input disable v-model.trim="formData.addUserDetails.city" class="text-weight-regular text-grey-8"
                color="grey-9" :label="'*City'" placeholder="City" />
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
              <q-select :disable="!item.checked" color="grey-9"
                :placeholder="item.predecessor.length == 0 ? 'No data available to display' : 'Choose a predecessor'"
                v-model="item.predecessorChecked" :options="item.predecessor" />
            </div>
          </div>
          
          <div v-if="formData.showBankOpsList" class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select multiple color="grey-9" :label="'Choose bank (can be multiple)'"
                v-model="formData.addUserDetails.banksList" :error="v$.formData.addUserDetails.banksList.$error"
                @blur="v$.formData.addUserDetails.banksList.$touch" :options="leadSourceOptions" />
            </div>
          </div>
          
          <div v-if="getAllUserByUserIdData?.roles?.[0]?.id == 25" class="row gutter-sm q-py-sm" :disabled="getAllUserByUserIdData?.serviceReqClients?.sourceId != null">
            <label> Lead Source Enable? </label>
            <div class="col-md-9">
              <q-radio v-for="(item, index) in LeadSourceOptions1" :key="index" color="grey-9"
                v-model.trim="formData.addUserDetails.leadSource" @blur="v$.formData.addUserDetails.leadSource.$touch"
                :error="v$.formData.addUserDetails.leadSource.$error" :val="item.value" :label="item.label" />
            </div>
          </div>
          
          <div v-if="getAllUserByUserIdData?.roles?.[0]?.hierarchy?.hierarchyCode == 'SC'"
            class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-input :label="'Please enter authMethod.....'"
                v-model="formData.addUserDetails.serviceReqClients.authMethod"
                :error="v$.formData.addUserDetails.serviceReqClients.authMethod.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.authMethod.$touch" />
            </div>
            <div class="col-md-6">
              <q-input :label="'Please enter authKey.....'"
                v-model="formData.addUserDetails.serviceReqClients.authKey"
                :error="v$.formData.addUserDetails.serviceReqClients.authKey.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.authKey.$touch" />
            </div>
            <div class="col-md-6">
              <q-input :label="'Please enter authValue.....'"
                v-model="formData.addUserDetails.serviceReqClients.authValue"
                :error="v$.formData.addUserDetails.serviceReqClients.authValue.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.authValue.$touch" />
            </div>
            <div class="col-md-6">
              <q-input :label="'Please enter callBackUrl.....'"
                v-model="formData.addUserDetails.serviceReqClients.callBackUrl"
                :error="v$.formData.addUserDetails.serviceReqClients.callBackUrl.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.callBackUrl.$touch" />
            </div>
          </div>
        </div>
      </div>

      <div class="full-width group" align="right">
        <q-btn flat class="bg-white text-weight-regular text-grey-8" @click="GoToUsers()">Cancel</q-btn>
        <q-btn class="text-weight-regular" color="amber-9" @click="refreshData()">Reset</q-btn>
        <q-btn type="button" color="purple-9" @click="fnSubmitShowEditUser(formData.addUserDetails)">Submit</q-btn>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, email, minLength, maxLength, alphaNum, numeric } from '@vuelidate/validators';
import { useStore } from 'vuex'; // ← ADD THIS - Vuex store
import _ from 'lodash'; // ← ADD THIS - for lodash functions

// Vue Router and Quasar
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const store = useStore(); // Vuex store instance

// Store Getters using Vuex
const getAllUserByUserIdData = computed(() => store.getters['SuperAdminusers/getAllUserByUserIdData']);
const getAllRegionsData = computed(() => store.getters['SuperAdminusers/getAllRegionsData']);
const getAllStatesData = computed(() => store.getters['SuperAdminusers/getAllStatesData']);
const getAllHierarchiesAndRolesData = computed(() => store.getters['SuperAdminusers/getAllHierarchiesAndRolesData']);
const getPredecessorByRoleHierarchyData = computed(() => store.getters['SuperAdminusers/getPredecessorByRoleHierarchyData']);

// For BankOpsShortLead store - assuming it's also Vuex
const getSelectOptionsLeadSourceInfo = computed(() => {
  // Check if this getter exists, if not return empty array
  return store.getters['BankOpsShortLead/getSelectOptionsLeadSourceInfo'] || [];
});

// Store Actions using Vuex
const FETCH_ALL_USERS_BY_USER_ID_DATA = (id) => store.dispatch('SuperAdminusers/FETCH_ALL_USERS_BY_USER_ID_DATA', id);
const FEED_UPDATE_USER_DATA = (data) => store.dispatch('SuperAdminusers/FEED_UPDATE_USER_DATA', data);
const FETCH_ALL_STATES_DATA = () => store.dispatch('SuperAdminusers/FETCH_ALL_STATES_DATA');
const FETCH_PINCODE_WITH_TERM = (term) => store.dispatch('SuperAdminusers/FETCH_PINCODE_WITH_TERM', term);
const FETCH_ALL_HIERARCHIES_ROLES_DATA = () => store.dispatch('SuperAdminusers/FETCH_ALL_HIERARCHIES_ROLES_DATA');
const FETCH_ALL_REGIONS_DATA = () => store.dispatch('SuperAdminusers/FETCH_ALL_REGIONS_DATA');
const FETCH_PREDECESSOR_ON_ROLE = (data) => store.dispatch('SuperAdminusers/FETCH_PREDECESSOR_ON_ROLE', data);

// For BankOpsShortLead actions
const FETCH_ALL_LEAD_SOURCE_DATA = () => {
  // Check if this action exists
  if (store._actions['BankOpsShortLead/FETCH_ALL_LEAD_SOURCE_DATA']) {
    return store.dispatch('BankOpsShortLead/FETCH_ALL_LEAD_SOURCE_DATA');
  }
  console.warn('BankOpsShortLead/FETCH_ALL_LEAD_SOURCE_DATA action not found');
  return Promise.resolve();
};

// Reactive Data
const leadSourceOptions = ref([]);
const pincodeOptions = ref([]);
const pincodeSearchTimeout = ref(null);

const LeadSourceOptions1 = [
  {
    label: "Yes",
    value: "Yes"
  },
  {
    label: "No",
    value: "No"
  },
];

const formData = reactive({
  showBankOpsList: false,
  disableRegionSelection: false,
  addUserDetails: {
    hasReadPermission: false,
    hasWritePermission: false,
    hasDeletePermission: false,
    hasEditPermission: false,
    hasDownloadPermission: false,
    banksList: [],
    region: {
      id: ""
    },
    leadSource: null,
    serviceReqClients: {
      authMethod: "",
      authKey: "",
      authValue: "",
      callBackUrl: ""
    },
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
    pincodeDisplayValue: "",
    stateTemp: [],
    userMapSets: [],
    latitude: 13.25,
    longitude: 80.25
  }
});

// Validations
const rules = {
  formData: {
    addUserDetails: {
      region: {
        id: {
          required: requiredIf(() => formData.disableRegionSelection === false)
        }
      },
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
      banksList: {
        required: requiredIf(() => formData.showBankOpsList),
        minLength: minLength(1)
      },
      leadSource: {
        required: requiredIf(() => getAllUserByUserIdData.value?.roles?.[0]?.id == '25')
      },
      serviceReqClients: {
        authMethod: {
          required: requiredIf(() => getAllUserByUserIdData.value?.roles?.[0]?.hierarchy?.hierarchyCode == 'SC')
        },
        authKey: {
          required: requiredIf(() => getAllUserByUserIdData.value?.roles?.[0]?.hierarchy?.hierarchyCode == 'SC')
        },
        authValue: {
          required: requiredIf(() => getAllUserByUserIdData.value?.roles?.[0]?.hierarchy?.hierarchyCode == 'SC')
        },
        callBackUrl: {
          required: requiredIf(() => getAllUserByUserIdData.value?.roles?.[0]?.hierarchy?.hierarchyCode == 'SC')
        }
      }
    }
  }
};

const v$ = useVuelidate(rules, { formData });

// Lifecycle
onMounted(() => {
  // Load initial data
  ajaxLoadUserInfo();
  ajaxLoadDataForAllStatesList();
  ajaxLoadDataForRegionsFilter();
  ajaxLoadDataForBankListFilter();
});

// Watch for pincode changes for search
watch(() => formData.addUserDetails.pincodeTemp, (newVal) => {
  if (newVal && newVal.length >= 1) {
    if (pincodeSearchTimeout.value) {
      clearTimeout(pincodeSearchTimeout.value);
    }
    pincodeSearchTimeout.value = setTimeout(() => {
      pincodeSearch(newVal);
    }, 500);
  }
});

// Methods
const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
  if (!arraySet || !Array.isArray(arraySet)) return [];
  return arraySet.filter(item => {
    return item.label?.toString().toLowerCase().includes(terms.toLowerCase());
  });
};

const pincodeSearch = async (terms) => {
  if (!terms || terms.length < 1) {
    pincodeOptions.value = [];
    return;
  }
  
  try {
    await FETCH_PINCODE_WITH_TERM(terms);
    pincodeOptions.value = COMMON_FILTER_FUNCTION(getAllStatesData.value || [], terms);
  } catch (error) {
    pincodeOptions.value = [];
    console.error('Error searching pincode:', error);
  }
};

const pincodeSelected = (item) => {
  if (item && item.value) {
    formData.addUserDetails.state = item.value.stateName || '';
    formData.addUserDetails.city = item.value.cityName || '';
    formData.addUserDetails.pincode = item.value.pincode || '';
    formData.addUserDetails.pincodeTemp = item.value.pincode || '';
  }
  pincodeOptions.value = [];
};

const fnGetCityAndState = () => {
  // Clear city and state when pincode is cleared
  formData.addUserDetails.state = '';
  formData.addUserDetails.city = '';
  formData.addUserDetails.pincode = '';
};

const refreshData = () => {
  ajaxLoadUserInfo();
};

const ajaxLoadUserInfo = async () => {
  $q.loading.show({
    delay: 100,
    message: "Loading user data...",
    spinnerColor: "purple-9"
  });

  try {
    await FETCH_ALL_USERS_BY_USER_ID_DATA(route.params.id);
    
    const userData = getAllUserByUserIdData.value;
    
    // Update form data
    formData.showBankOpsList = userData.bankOpsUser != null;
    
    // Determine if region selection should be disabled
    formData.disableRegionSelection = 
      userData.bankOpsUser != null ? true : 
      (userData.roles?.[0]?.hierarchy?.id == 10 ? true : 
      (userData.serviceReqClients == null && userData.roles?.[0]?.hierarchy?.hierarchyCode != "CU" ? false : true));
    
    // Update user details
    formData.addUserDetails = {
      ...formData.addUserDetails,
      hasReadPermission: userData.user?.hasReadPermission || false,
      hasWritePermission: userData.user?.hasWritePermission || false,
      hasDeletePermission: userData.user?.hasDeletePermission || false,
      hasEditPermission: userData.user?.hasEditPermission || false,
      hasDownloadPermission: userData.user?.hasDownloadPermission || false,
      banksList: userData.bankOpsUser || [],
      userId: userData.user?.id,
      region: {
        id: userData.region?.id || ""
      },
      name: userData.user?.name || "",
      employeeID: userData.user?.employeeID || "",
      email: userData.user?.email || "",
      contactNumber: userData.user?.contactNumber || "",
      alternateContactNumber: userData.user?.alternateContactNumber || "",
      leadSource: userData.serviceReqClients != null ? 
        (userData.serviceReqClients.sourceId == null ? "No" : "Yes") : null,
      serviceReqClients: userData.serviceReqClients || {
        authMethod: "",
        authKey: "",
        authValue: "",
        callBackUrl: ""
      },
      userAddress: userData.user?.userAddress || "",
      city: userData.user?.city || "",
      state: userData.user?.state || "",
      pincode: userData.user?.pincode || "",
      pincodeTemp: userData.user?.pincode || "",
      pincodeDisplayValue: String(userData.user?.pincode || "")
    };

    // Load hierarchies and roles
    await FETCH_ALL_HIERARCHIES_ROLES_DATA();
    
    // Map user roles to hierarchies
    if (userData.roles && getAllHierarchiesAndRolesData.value) {
      userData.roles.forEach((role) => {
        const hierarchyIndex = getAllHierarchiesAndRolesData.value.findIndex(
          h => h.id === role.hierarchy?.id
        );
        
        if (hierarchyIndex !== -1) {
          // Update the hierarchy item
          getAllHierarchiesAndRolesData.value[hierarchyIndex].checked = true;
          getAllHierarchiesAndRolesData.value[hierarchyIndex].roleChecked = role.id;
          
          // Fetch predecessor data
          const predecessorRequest = {
            region: { id: formData.addUserDetails.region.id },
            role: { id: role.id }
          };
          
          FETCH_PREDECESSOR_ON_ROLE(predecessorRequest).then(() => {
            const cookedArr = (getPredecessorByRoleHierarchyData.value || []).map(value => ({
              label: value.user?.name || '',
              value: value.user?.id
            }));
            
            getAllHierarchiesAndRolesData.value[hierarchyIndex].predecessor = cookedArr;
            getAllHierarchiesAndRolesData.value[hierarchyIndex].predecessorChecked = role.predecessor?.id;
          });
        }
      });
    }
    
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      message: 'Oops! Something went wrong',
      type: 'negative',
      timeout: 5000,
      detail: 'Please ensure you have good network connectivity.',
      position: 'bottom',
      actions: [
        {
          label: 'Go back',
          handler: () => {
            router.push({ name: 'users' });
          }
        }
      ]
    });
  }
};

const ajaxLoadDataForAllStatesList = () => {
  FETCH_ALL_STATES_DATA();
};

const ajaxLoadDataForRegionsFilter = () => {
  FETCH_ALL_REGIONS_DATA();
};

const ajaxLoadDataForBankListFilter = async () => {
  try {
    await FETCH_ALL_LEAD_SOURCE_DATA();
    if (getSelectOptionsLeadSourceInfo.value) {
      leadSourceOptions.value = getSelectOptionsLeadSourceInfo.value.map(item => ({
        label: item.sourceName,
        value: item.id
      }));
    }
  } catch (error) {
    console.error('Error loading bank list:', error);
  }
};

const GoToUsers = () => {
  router.push("/super/admin/users/");
};

const getPredecessorList = async (item) => {
  if (!item.roleChecked) return;
  
  const requestData = {
    region: { id: formData.addUserDetails.region.id },
    role: { id: item.roleChecked }
  };
  
  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9"
  });
  
  try {
    await FETCH_PREDECESSOR_ON_ROLE(requestData);
    
    const cookedArr = (getPredecessorByRoleHierarchyData.value || []).map(value => ({
      label: value.user?.name || '',
      value: value.user?.id
    }));
    
    item.predecessor = cookedArr;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: 'warning',
      color: 'amber-9',
      position: 'bottom',
      message: error.data?.message || 'Error loading predecessor list'
    });
  }
};

const fnSubmitShowEditUser = async (requestParams) => {
  // Prepare userMapSets
  const cookedArr = [];
  
  (getAllHierarchiesAndRolesData.value || []).forEach(value => {
    if (value.checked && value.roleChecked && value.predecessorChecked) {
      cookedArr.push({
        hierarchy: { id: value.id },
        role: { id: value.roleChecked },
        region: { id: formData.addUserDetails.region.id },
        predecessor: { id: value.predecessorChecked }
      });
    }
  });
  
  requestParams.userMapSets = cookedArr;
  
  // Validation
  if (requestParams.userMapSets.length === 0) {
    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: 'Role mapping is mandatory',
      icon: 'warning'
    });
    return;
  }
  
  // Form validation
  v$.value.formData.addUserDetails.$touch();
  if (v$.value.formData.addUserDetails.$error) {
    $q.notify('Please review fields again.');
    return;
  }
  
  // Prepare banks list
  const banksListArr = (formData.addUserDetails.banksList || []).map(value => ({ id: value.value || value }));
  requestParams.banksList = banksListArr;
  
  // Handle special hierarchies (Service Clients, CRM, etc.)
  const specialHierarchy = requestParams.userMapSets.find(oo => 
    oo.hierarchy.id == 9 || oo.hierarchy.id == 10 || oo.hierarchy.id == 11
  );
  
  if (specialHierarchy) {
    requestParams.userMapSets[0].predecessor = null;
    requestParams.userMapSets[0].region = null;
  }
  
  // Handle lead source
  const userData = getAllUserByUserIdData.value;
  if (userData?.serviceReqClients) {
    if (userData.serviceReqClients.sourceId == null) {
      requestParams.leadSource = formData.addUserDetails.leadSource == "Yes" ? {
        sourceName: formData.addUserDetails.name,
        sourceCode: formData.addUserDetails.name,
        id: 0
      } : null;
    } else if (userData.serviceReqClients.sourceId != null) {
      requestParams.leadSource = formData.addUserDetails.leadSource == "Yes" ? {
        sourceName: formData.addUserDetails.name,
        sourceCode: formData.addUserDetails.name,
        id: userData.serviceReqClients.sourceId.id
      } : null;
    }
  }
  
  $q.loading.show({
    delay: 100,
    message: "Updating user...",
    spinnerColor: "purple-9"
  });
  
  try {
    await FEED_UPDATE_USER_DATA(requestParams);
    $q.loading.hide();
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'User successfully updated',
      icon: 'thumb_up'
    });
    router.push("/super/admin/users/");
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: 'warning',
      color: 'amber-9',
      position: 'bottom',
      message: error.data?.message || 'Error updating user'
    });
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.group {
  margin-bottom: 16px;
}

.group > div {
  margin-bottom: 8px;
}
</style>