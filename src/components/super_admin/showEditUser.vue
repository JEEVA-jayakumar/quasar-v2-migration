<template>
  <q-dialog
    v-model="showEditUser"
    persistent
    @hide="emitShowEditUser"
    transition-show="slide"
    transition-hide="slide"
    class="customModalOverlay"
  >
    <q-card style="max-width:50vw; min-height:100vh; padding-top:50px; padding-bottom:50px">

      <!-- Header -->
      <q-card-section class="row gutter-sm q-py-sm items-center bottom-border">
        <div class="col-md-8">
          <div class="q-title text-weight-regular">Edit User</div>
        </div>
        <div class="col-md-2">
          <q-btn
            flat
            label="Cancel"
            color="grey-8"
            class="bg-white text-weight-regular"
            @click="emitShowEditUser"
          />
        </div>
        <div class="col-md-2">
          <q-btn
            color="purple-9"
            label="Save"
            @click="submitUserEdit"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitUserEdit">
          <div class="row gutter-sm q-py-sm">

            <!-- Name -->
            <div class="col-md-6">
              <q-input
                v-model="formData.name"
                float-label="*Username"
                placeholder="Username"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.name.$error"
                @blur="$v.name.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- Employee ID -->
            <div class="col-md-6">
              <q-input
                v-model="formData.employeeID"
                float-label="*Employee ID"
                placeholder="Employee ID"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.employeeID.$error"
                @blur="$v.employeeID.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- Email -->
            <div class="col-md-6">
              <q-input
                v-model="formData.email"
                float-label="*Email"
                placeholder="Email"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.email.$error"
                @blur="$v.email.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- Contact Number -->
            <div class="col-md-6">
              <q-input
                v-model="formData.contactNumber"
                float-label="*Contact Number"
                placeholder="Contact Number"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.contactNumber.$error"
                @blur="$v.contactNumber.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- Alternate Contact -->
            <div class="col-md-6">
              <q-input
                v-model="formData.alternateContactNumber"
                float-label="Alt Contact Number"
                placeholder="Alt Contact Number"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.alternateContactNumber.$error"
                @blur="$v.alternateContactNumber.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- Address -->
            <div class="col-md-6">
              <q-input
                v-model="formData.userAddress"
                float-label="*Address"
                placeholder="Address"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.userAddress.$error"
                @blur="$v.userAddress.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- City -->
            <div class="col-md-6">
              <q-input
                v-model="formData.city"
                float-label="*City"
                placeholder="City"
                color="grey-9"
                class="text-weight-regular text-grey-8"
                :error="!!$v.city.$error"
                @blur="$v.city.$touch()"
                @keyup.enter="submitUserEdit"
              />
            </div>

            <!-- State -->
            <div class="col-md-6">
              <q-select
                v-model="formData.state.id"
                :options="propGetAllStatesData"
                float-label="*State"
                color="grey-9"
                class="text-weight-regular text-grey-8"
              />
            </div>

            <!-- Roles -->
            <div class="col-md-12 q-mt-md">
              <div class="q-title text-weight-regular">Role*</div>
              <div class="row q-gutter-sm q-mt-sm">
                <div v-for="role in propFilterRoles" :key="role.value" class="col-auto">
                  <q-checkbox
                    v-model="formData.tempRoles"
                    :val="role.label"
                    color="purple-9"
                    @change="$v.tempRoles.$touch()"
                  >
                    <q-chip color="blue-grey-2" class="text-weight-regular text-grey-8">
                      {{ role.label }}
                    </q-chip>
                  </q-checkbox>
                </div>
              </div>
              <div v-if="!$v.tempRoles.required" class="text-red text-weight-medium q-caption">
                *Role is mandatory
              </div>
            </div>

          </div>
        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, maxLength, alpha, alphaNum, numeric } from "@vuelidate/validators";

// Props & Emits
const props = defineProps({
  propShowEditUser: Boolean,
  propFilterRoles: Array,
  propGetAllStatesData: Array,
  propExistingUserItems: Object
});
const emit = defineEmits(["emitfnShowEditUser"]);

const $q = useQuasar();
const store = useStore();

// Reactive States
const showEditUser = ref(props.propShowEditUser);
const formData = reactive({
  userId: props.propExistingUserItems.id,
  name: props.propExistingUserItems.name,
  employeeID: props.propExistingUserItems.employeeID,
  email: props.propExistingUserItems.email,
  contactNumber: props.propExistingUserItems.contactNumber,
  alternateContactNumber: props.propExistingUserItems.alternateContactNumber,
  userAddress: props.propExistingUserItems.userAddress,
  city: props.propExistingUserItems.city,
  state: { id: props.propExistingUserItems.state.id },
  tempRoles: props.propExistingUserItems.roles.map(r => r.role),
  roles: [],
  profilePicture: "uploads/c7818f74-9652-42f9-a902-9da6a692cdf3.png",
  password: "password"
});

// Vuelidate
const rules = {
  name: { required, alpha, minLength: minLength(4) },
  employeeID: { required, alphaNum, minLength: minLength(2), maxLength: maxLength(20) },
  email: { required, email },
  contactNumber: { required, numeric, minLength: minLength(10), maxLength: maxLength(10) },
  alternateContactNumber: { numeric, minLength: minLength(10), maxLength: maxLength(10) },
  userAddress: { required, minLength: minLength(2), maxLength: maxLength(20) },
  city: { required, alpha, minLength: minLength(2), maxLength: maxLength(20) },
  tempRoles: { required, minLength: minLength(1) }
};
const $v = useVuelidate(rules, formData);

// Watch props for opening modal
watch(() => props.propShowEditUser, val => showEditUser.value = val);

// Emit Close
const emitShowEditUser = () => emit("emitfnShowEditUser", showEditUser.value);

// Submit form
const submitUserEdit = async () => {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  formData.roles = formData.tempRoles.map(r => ({ role: r }));

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
  try {
    await store.dispatch("SuperAdminUsers/FEED_UPDATE_USER_DATA", formData);
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    await store.dispatch("SuperAdminUsers/FETCH_ALL_USERS_DATA");
    emitShowEditUser();
  } catch (err) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
