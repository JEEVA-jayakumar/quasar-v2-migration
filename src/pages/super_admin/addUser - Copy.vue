<template>
  <div>
    <form>
      <div class="q-px-md">
        <div class="q-pa-sm">
          <div class="row q-col-gutter-sm q-py-sm items-center bottom-border">
            <div>
              <div class="text-h5 text-weight-regular">Add New User</div>
            </div>
          </div>
        </div>

        <div class="q-pa-sm">
          <div class="row q-col-gutter-sm q-py-sm items-center">
            <div class="full-width text-body1 text-weight-medium">Mapping Information:</div>
            <div
              class="col-md-4 col-sm-6 col-xs-12 q-mb-md"
              v-for="(value,index) in formData.addUserDetails.userMapSets"
              :key="index"
            >
              <q-card class="q-pa-sm shadow-6 text-dark" style="background-color: #f5f5f5">
                <div class="row bottom-border q-pa-xs capitalize">
                  <div class="col-md-6">Hierarchy</div>
                  <div class="capitalize">{{fnGetHierarchyTitle(value.hierarchy)}}</div>
                </div>
                <div class="row bottom-border q-pa-xs">
                  <div class="col-md-6">Role</div>
                  <div class="capitalize">{{fnGetRoleTitle(value.roleId)}}</div>
                </div>
                <div class="row bottom-border q-pa-xs">
                  <div class="col-md-6">Region</div>
                  <div class="capitalize">{{fnGetRegionTitle(value.regionId)}}</div>
                </div>
                <div class="row bottom-border q-pa-xs">
                  <div class="col-md-6">Predecessor</div>
                  <div class="capitalize">{{fnGetUserTitle(value.predecessorId)}}</div>
                </div>
                <div class="row q-mt-sm">
                  <div class="q-gutter-sm">
                    <q-btn
                      size="sm"
                      round
                      color="negative"
                      v-if="formData.addUserDetails.userMapSets.length > 0"
                      @click="deleteDynamicComponentDeletion(index)"
                      icon="clear"
                      label="Remove"
                    />

                    <q-btn
                      size="sm"
                      round
                      color="amber-9"
                      v-if="formData.addUserDetails.userMapSets.length > 0"
                      @click="fnShowDynamicHierarchyRoleRegionAddDeleteForEdit(value,index)"
                      icon="edit"
                      label="Edit"
                    />
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <div class="q-pa-sm">
          <div class="row q-col-gutter-sm q-py-sm items-center">
            <div>
              <q-btn
                outline
                color="dark"
                :class="[isRoleEmpty ? 'animate-scale' : '']"
                @click="fnShowDynamicHierarchyRoleRegionAddDelete"
                icon="add"
                label="Add Mapping"
              />
            </div>
          </div>
        </div>

        <div class="q-pa-md">
          <div class="row q-col-gutter-sm q-py-sm">
            <div class="col-12">
              <div class="text-h5 text-weight-regular">User Details</div>
            </div>
            
            <!-- Name -->
            <div class="col-md-6 col-sm-12">
              <q-input
                v-model.trim="formData.addUserDetails.name"
                @blur="v$.formData.addUserDetails.name.$touch"
                :error="v$.formData.addUserDetails.name.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Name"
                placeholder="Name"
                filled
              />
            </div>

            <!-- Employee ID -->
            <div class="col-md-6 col-sm-12">
              <q-input
                v-model.trim="formData.addUserDetails.employeeID"
                @blur="v$.formData.addUserDetails.employeeID.$touch"
                :error="v$.formData.addUserDetails.employeeID.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Employee ID"
                placeholder="Employee ID"
                filled
              />
            </div>

            <!-- Email -->
            <div class="col-md-6 col-sm-12">
              <q-input
                v-model.trim="formData.addUserDetails.email"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                @blur="v$.formData.addUserDetails.email.$touch"
                :error="v$.formData.addUserDetails.email.$error"
                label="*Email"
                placeholder="Email"
                filled
              />
            </div>

            <!-- Contact Number -->
            <div class="col-md-6 col-sm-12">
              <q-input
                v-model.trim="formData.addUserDetails.contactNumber"
                @blur="v$.formData.addUserDetails.contactNumber.$touch"
                :error="v$.formData.addUserDetails.contactNumber.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Contact Number"
                placeholder="Contact Number"
                filled
              />
            </div>

            <!-- Alternate Contact Number -->
            <div class="col-md-6 col-sm-12">
              <q-input
                v-model.trim="formData.addUserDetails.alternateContactNumber"
                @blur="v$.formData.addUserDetails.alternateContactNumber.$touch"
                :error="v$.formData.addUserDetails.alternateContactNumber.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Alt Contact Number"
                placeholder="Alt Contact Number"
                filled
              />
            </div>

            <!-- Address -->
            <div class="col-md-6 col-sm-12">
              <q-input
                v-model.trim="formData.addUserDetails.userAddress"
                @blur="v$.formData.addUserDetails.userAddress.$touch"
                :error="v$.formData.addUserDetails.userAddress.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Address"
                placeholder="Address"
                filled
              />
            </div>

            <!-- Pincode -->
            <div class="col-md-6 col-sm-12">
              <q-select
                v-model="formData.addUserDetails.pincodeTemp"
                label="*Pincode"
                :error="v$.formData.addUserDetails.pincodeTemp.$error"
                @update:model-value="fnGetCityAndState"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :options="getAllStatesData"
                option-label="label"
                option-value="value"
                filled
                emit-value
                map-options
                use-input
                @filter="filterPincodeOptions"
              />
            </div>

            <!-- State -->
            <div class="col-md-6 col-sm-12">
              <q-input
                readonly
                v-model.trim="formData.addUserDetails.state"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*State"
                placeholder="State"
                filled
              />
            </div>

            <!-- City -->
            <div class="col-md-6 col-sm-12">
              <q-input
                readonly
                v-model.trim="formData.addUserDetails.city"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*City"
                placeholder="City"
                filled
              />
            </div>
          </div>
        </div>

        <div class="full-width q-mt-lg" align="right">
          <q-btn
            flat
            size="md"
            class="bg-white text-weight-regular text-grey-8 q-mr-sm"
            @click="$router.go(-1)"
          >Cancel</q-btn>
          <q-btn size="md" type="button" color="purple-9" @click="fnSubmitShowAddUser">Submit</q-btn>
        </div>
      </div>
    </form>
    
    <!-- Modal Components -->
    <dynamicHierarchyRoleRegionAddDelete
      v-model="showDynamicHierarchyRoleRegionAddDelete"
      @update:model-value="fnManageDynamicModal"
      @emitfnToggleModelWithParams="fnShowDynamicHierarchyRoleRegionAddDeleteWithParams"
      @emitfnToggleModelCancel="fnShowDynamicHierarchyRoleRegionAddDeleteWithoutParams"
      :propFilterRoles="getAllRoles"
      :propGetAllRegionsData="getAllRegionsData"
      :propGetAllHierarchiesData="getAllHierarchiesData"
    />
    
    <dynamicHierarchyRoleRegionAddDeleteForEdit
      v-model="showDynamicHierarchyRoleRegionAddDeleteForEdit"
      :propDetailsForEdit="editTempProp"
      @emitfnToggleModelWithParams="fnShowDynamicHierarchyRoleRegionAddDeleteWithParamsEdit"
      @emitfnToggleModelCancelEdit="fnShowDynamicHierarchyRoleRegionAddDeleteWithoutParamsEdit"
      :propFilterRoles="getAllRoles"
      :propGetAllRegionsData="getAllRegionsData"
      :propGetAllHierarchiesData="getAllHierarchiesData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, maxLength, alphaNum, numeric } from '@vuelidate/validators';
import { useStore } from 'vuex';
import _ from 'lodash';

// Components
import dynamicHierarchyRoleRegionAddDelete from "../../components/super_admin/dynamicHierarchyRoleRegionAddDelete.vue";
import dynamicHierarchyRoleRegionAddDeleteForEdit from "../../components/super_admin/dynamicHierarchyRoleRegionAddDeleteForEdit.vue";

const router = useRouter();
const $q = useQuasar();
const store = useStore();

// Modal refs
const showDynamicHierarchyRoleRegionAddDelete = ref(false);
const showDynamicHierarchyRoleRegionAddDeleteForEdit = ref(false);
const editTempProp = ref("");
const isRoleEmpty = ref(false);

// Form data
const formData = ref({
  addUserDetails: {
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
    password: "password",
    stateTemp: [],
    userMapSetsTemp: [],
    userMapSets: [],
    latitude: 13.25,
    longitude: 80.25
  }
});

// Validation rules
const rules = {
  formData: {
    addUserDetails: {
      name: {
        required,
        minLength: minLength(4)
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
      }
    }
  }
};

const v$ = useVuelidate(rules, formData);

// Vuex Getters
const getAllRoles = computed(() => store.getters['SuperAdminUsers/getAllRoles']);
const getAllUsers = computed(() => store.getters['SuperAdminUsers/getAllUsers']);
const getAllRegionsData = computed(() => store.getters['SuperAdminUsers/getAllRegionsData']);
const getAllHierarchiesData = computed(() => store.getters['SuperAdminUsers/getAllHierarchiesData']);
const getAllStatesData = computed(() => store.getters['SuperAdminUsers/getAllStatesData']);

// Vuex Actions
const fetchAllUsersData = () => store.dispatch('SuperAdminUsers/FETCH_ALL_USERS_DATA');
const fetchAllStatesData = () => store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
const fetchAllRolesData = () => store.dispatch('SuperAdminUsers/FETCH_ALL_ROLES_DATA');
const fetchAllHierarchiesData = () => store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA');
const fetchAllRegionsData = () => store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA');

onMounted(() => {
  ajaxLoadDataForRolesFilter();
  ajaxLoadDataForAllStatesList();
  ajaxLoadDataForHeirarchyFilter();
  ajaxLoadDataForRegionsFilter();
  ajaxLoadDataForUsersFilter();
});

// Helper functions
function ajaxLoadDataForHeirarchyFilter() {
  fetchAllHierarchiesData();
}

function ajaxLoadDataForAllStatesList() {
  fetchAllStatesData();
}

function ajaxLoadDataForRolesFilter() {
  fetchAllRolesData();
}

function ajaxLoadDataForRegionsFilter() {
  fetchAllRegionsData();
}

function ajaxLoadDataForUsersFilter() {
  fetchAllUsersData();
}

async function fnSubmitShowAddUser() {
  if (formData.value.addUserDetails.userMapSets.length < 1) {
    isRoleEmpty.value = true;
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "User must have at least one role to continue",
      icon: "warning"
    });
    return false;
  }
  
  v$.value.$touch();
  if (v$.value.$error) {
    $q.notify("Please review fields again.");
  } else {
    try {
      
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "User successfully created",
        icon: "thumb_up"
      });
      
      // Reset form or navigate away
      resetForm();
      router.push("/sat/exception/queue");
    } catch (error) {

      console.error("Error creating user:", error);
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.response?.data?.message || "Please Try Again Later!",
        icon: "thumb_down"
      });
    }
  }
}

function resetForm() {
  formData.value.addUserDetails = {
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
    password: "password",
    stateTemp: [],
    userMapSetsTemp: [],
    userMapSets: [],
    latitude: 13.25,
    longitude: 80.25
  };
}

// Mapping functions
function fnShowDynamicHierarchyRoleRegionAddDelete() {
  showDynamicHierarchyRoleRegionAddDelete.value = !showDynamicHierarchyRoleRegionAddDelete.value;
}

function fnManageDynamicModal() {
  showDynamicHierarchyRoleRegionAddDelete.value = !showDynamicHierarchyRoleRegionAddDelete.value;
}

function fnShowDynamicHierarchyRoleRegionAddDeleteWithParams(mappingInfo) {
  formData.value.addUserDetails.userMapSetsTemp.push(mappingInfo);
  
  const uniqueSortedArrSet = _.map(
    _.uniq(
      _.map(formData.value.addUserDetails.userMapSetsTemp, function(obj) {
        return JSON.stringify(obj);
      })
    ),
    function(obj) {
      return JSON.parse(obj);
    }
  );
  
  formData.value.addUserDetails.userMapSets = uniqueSortedArrSet;
  showDynamicHierarchyRoleRegionAddDelete.value = false;
}

function fnShowDynamicHierarchyRoleRegionAddDeleteWithoutParams() {
  showDynamicHierarchyRoleRegionAddDelete.value = false;
}

function fnShowDynamicHierarchyRoleRegionAddDeleteForEdit(mappingInfo, index) {
  editTempProp.value = { ...mappingInfo, index };
  showDynamicHierarchyRoleRegionAddDeleteForEdit.value = true;
}

function fnShowDynamicHierarchyRoleRegionAddDeleteWithParamsEdit(mappingInfo) {
  if (mappingInfo.index !== undefined) {
    formData.value.addUserDetails.userMapSets[mappingInfo.index] = mappingInfo;
  }
  showDynamicHierarchyRoleRegionAddDeleteForEdit.value = false;
}

function fnShowDynamicHierarchyRoleRegionAddDeleteWithoutParamsEdit() {
  showDynamicHierarchyRoleRegionAddDeleteForEdit.value = false;
}

function fnGetCityAndState() {
  if (formData.value.addUserDetails.pincodeTemp) {
    formData.value.addUserDetails.pincode = formData.value.addUserDetails.pincodeTemp.pincode || '';
    formData.value.addUserDetails.state = formData.value.addUserDetails.pincodeTemp.stateName || '';
    formData.value.addUserDetails.city = formData.value.addUserDetails.pincodeTemp.cityName || '';
  }
}

function deleteDynamicComponentDeletion(index) {
  formData.value.addUserDetails.userMapSets.splice(index, 1);
}

// Helper functions to get titles
function fnGetHierarchyTitle(filterValue) {
  const finalReturnValue = _.filter(getAllHierarchiesData.value, function(item) {
    return item.value == filterValue;
  });
  return finalReturnValue[0]?.label || 'N/A';
}

function fnGetRoleTitle(filterValue) {
  const finalReturnValue = _.filter(getAllRoles.value, function(item) {
    return item.value == filterValue;
  });
  return finalReturnValue[0]?.label || 'N/A';
}

function fnGetRegionTitle(filterValue) {
  const finalReturnValue = _.filter(getAllRegionsData.value, function(item) {
    return item.value == filterValue;
  });
  return finalReturnValue[0]?.label || 'N/A';
}

function fnGetUserTitle(filterValue) {
  if (!filterValue) {
    return "NA";
  } else {
    const finalReturnValue = _.filter(getAllUsers.value, function(item) {
      return item.id == filterValue;
    });
    return finalReturnValue[0]?.name || 'N/A';
  }
}

// Filter function for pincode select
function filterPincodeOptions(val, update) {
  if (val === '') {
    update(() => {
      // Return all options if no filter
    });
    return;
  }
  
  update(() => {
    // Filter logic if needed
  });
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.capitalize {
  text-transform: capitalize;
}

.q-card {
  min-height: 200px;
}

.animate-scale {
  animation: scale 0.5s ease-in-out infinite alternate;
}

@keyframes scale {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
</style>