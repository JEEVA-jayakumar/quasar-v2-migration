<template>
  <q-dialog
    v-model="showEditUser"
    position="right"
    maximized
    class="customModalOverlay"
    @hide="emitShowEditUser"
    @escape-key="emitShowEditUser"
    :content-css="{ paddingTop: '50px', paddingBottom: '50px', maxWidth: '50vw', minHeight: '100vh' }"
  >
    <form @submit.prevent="submitForm">
      <!-- Header -->
      <div class="q-px-md">
        <div class="q-pa-sm">
          <div class="row gutter-sm q-py-sm items-center bottom-border">
            <div class="col-md-8">
              <div class="q-title text-weight-regular">Edit User</div>
            </div>
            <div class="col-md-2">
              <q-btn flat size="md" class="bg-white text-weight-regular text-grey-8" @click="emitShowEditUser">
                Cancel
              </q-btn>
            </div>
            <div class="col-md-2">
              <q-btn size="md" type="submit" color="purple-9">Save</q-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- User Details -->
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row gutter-sm q-py-sm">
            <div class="col-md-12">
              <div class="q-title text-weight-regular">User Details</div>
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.name"
                label="*Username"
                placeholder="Username"
                color="grey-9"
                :error="v$.addUserDetails.name.$error"
                @blur="v$.addUserDetails.name.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.employeeID"
                label="*Employee ID"
                placeholder="Employee ID"
                color="grey-9"
                :error="v$.addUserDetails.employeeID.$error"
                @blur="v$.addUserDetails.employeeID.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.email"
                label="*Email"
                placeholder="Email"
                color="grey-9"
                :error="v$.addUserDetails.email.$error"
                @blur="v$.addUserDetails.email.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.contactNumber"
                label="*Contact Number"
                placeholder="Contact Number"
                color="grey-9"
                :error="v$.addUserDetails.contactNumber.$error"
                @blur="v$.addUserDetails.contactNumber.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.alternateContactNumber"
                label="Alt Contact Number"
                placeholder="Alt Contact Number"
                color="grey-9"
                :error="v$.addUserDetails.alternateContactNumber.$error"
                @blur="v$.addUserDetails.alternateContactNumber.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.userAddress"
                label="*Address"
                placeholder="Address"
                color="grey-9"
                :error="v$.addUserDetails.userAddress.$error"
                @blur="v$.addUserDetails.userAddress.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-input
                v-model="form.addUserDetails.city"
                label="*City"
                placeholder="City"
                color="grey-9"
                :error="v$.addUserDetails.city.$error"
                @blur="v$.addUserDetails.city.$touch()"
                @keyup.enter="submitForm"
              />
            </div>

            <div class="col-md-6">
              <q-select
                v-model="form.addUserDetails.state.id"
                label="*State"
                color="grey-9"
                :options="props.propGetAllStatesData"
              />
            </div>
          </div>
        </div>

        <!-- Role Selection -->
        <div class="q-pa-md">
          <div class="row gutter-sm q-py-md">
            <div class="col-md-12">
              <div class="q-title text-weight-regular">Role*</div>
            </div>
            <div v-for="role in props.propFilterRoles" :key="role.value" class="col-md-12 q-mb-xs">
              <q-checkbox
                v-model="form.addUserDetails.tempRoles"
                :val="role.label"
                color="purple-9"
                :error="v$.addUserDetails.tempRoles.$error"
              >
                <q-chip color="blue-grey-2" class="text-weight-regular text-grey-8">
                  {{ role.label }}
                </q-chip>
              </q-checkbox>
            </div>
            <div
              class="col-md-12 text-red text-weight-medium q-caption"
              v-if="v$.addUserDetails.tempRoles.$invalid"
            >
              *Role is mandatory
            </div>
          </div>
        </div>
      </div>
    </form>
  </q-dialog>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength, alpha, alphaNum, numeric } from "@vuelidate/validators";
import { useStore } from "vuex";

// Props
const props = defineProps({
  propShowEditUser: Boolean,
  propFilterRoles: Array,
  propGetAllStatesData: Array,
  propExistingUserItems: Object
});

// Emits
const emit = defineEmits(["emitfnShowEditUser"]);

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();

// Reactive Form
const showEditUser = reactive({ value: false });

// Initialize form with props data
const form = reactive({
  addUserDetails: {
    userId: "",
    profilePicture: "",
    tempRoles: [],
    roles: [],
    name: "",
    employeeID: "",
    email: "",
    contactNumber: "",
    alternateContactNumber: "",
    userAddress: "",
    city: "",
    password: "password",
    state: { id: "" }
  }
});

// Vuelidate
const rules = {
  addUserDetails: {
    name: { required, alpha, minLength: minLength(4) },
    employeeID: { required, alphaNum, minLength: minLength(2), maxLength: maxLength(20) },
    email: { required, email },
    contactNumber: { required, numeric, minLength: minLength(10), maxLength: maxLength(10) },
    alternateContactNumber: { numeric, minLength: minLength(10), maxLength: maxLength(10) },
    userAddress: { required, minLength: minLength(2), maxLength: maxLength(50) },
    city: { required, alpha, minLength: minLength(2), maxLength: maxLength(20) },
    tempRoles: { required, minLength: minLength(1) }
  }
};

const v$ = useVuelidate(rules, form);

// Sync prop to local reactive
watch(() => props.propShowEditUser, val => (showEditUser.value = val), { immediate: true });

// Watch for propExistingUserItems changes and update form
watch(() => props.propExistingUserItems, (newVal) => {
  if (newVal) {
    form.addUserDetails.userId = newVal.id || "";
    form.addUserDetails.profilePicture = newVal.profilePicture || "";
    form.addUserDetails.tempRoles = newVal.roles?.map(r => r.role) || [];
    form.addUserDetails.name = newVal.name || "";
    form.addUserDetails.employeeID = newVal.employeeID || "";
    form.addUserDetails.email = newVal.email || "";
    form.addUserDetails.contactNumber = newVal.contactNumber || "";
    form.addUserDetails.alternateContactNumber = newVal.alternateContactNumber || "";
    form.addUserDetails.userAddress = newVal.userAddress || "";
    form.addUserDetails.city = newVal.city || "";
    form.addUserDetails.state.id = newVal.state?.id || "";
  }
}, { deep: true, immediate: true });

// ------------------
// Methods
// ------------------
function emitShowEditUser() {
  emit("emitfnShowEditUser", showEditUser.value);
}

function submitForm() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    $q.notify({ color: "negative", message: "Please review fields again." });
    return;
  }

  // Map tempRoles to roles
  form.addUserDetails.roles = form.addUserDetails.tempRoles.map(r => ({ role: r }));

  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  store.dispatch("SuperAdminUsers/FEED_UPDATE_USER_DATA", form.addUserDetails)
    .then(() => {
      $q.loading.hide();
      $q.notify({ color: "positive", message: "Successfully updated!", icon: "thumb_up" });
      store.dispatch("SuperAdminUsers/FETCH_ALL_USERS_DATA");
      emitShowEditUser();
    })
    .catch(error => {
      $q.loading.hide();
      $q.notify({
        color: "negative",
        message: error?.body?.message || "Please Try Again Later!",
        icon: "thumb_down"
      });
    });
}
</script>

<style scoped>
.customModalOverlay {
  max-width: 50vw;
  min-height: 100vh;
}
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>