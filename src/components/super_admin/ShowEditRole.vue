<template>
  <div>
    <!-- Dialog for Editing Role/Permissions -->
    <q-dialog
      v-model="showEditRoleToggle"
      persistent
      @hide="emitEditRolePermissions"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 40vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm bottom-border">
          <div class="col">
            <div class="q-title text-weight-regular">Update Role/Permissions</div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitEditRolePermissions">
            <!-- Hierarchy Select -->
            <div class="q-mb-md">
              <q-select
                v-model="formData.rolePermissions.hierarchyId"
                disable
                :options="propGetAllHierarchiesData"
                float-label="Hierarchy"
                placeholder="Select Hierarchy"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :error="!!v$.rolePermissions.hierarchyId.$error"
                @blur="v$.rolePermissions.hierarchyId.$touch()"
              />
            </div>

            <!-- Role Input -->
            <div class="q-mb-md">
              <q-input
                v-model="formData.rolePermissions.role"
                float-label="Role"
                placeholder="Role"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :error="!!v$.rolePermissions.role.$error"
                @blur="v$.rolePermissions.role.$touch()"
                @keyup.enter="submitEditRolePermissions"
              />
            </div>

            <!-- Role Color -->
            <div class="q-mb-md">
              <q-color
                v-model="formData.rolePermissions.roleColor"
                clearable
                popover
                float-label="Choose a role color"
                color="grey-9"
                :error="!!v$.rolePermissions.roleColor.$error"
                @blur="v$.rolePermissions.roleColor.$touch()"
              />
            </div>

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-8"
                class="bg-white text-weight-regular"
                @click="emitEditRolePermissions"
              />
              <q-btn
                label="Save"
                color="purple-9"
                class="q-ml-sm"
                @click="submitEditRolePermissions"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength } from "@vuelidate/validators";

// Props
const props = defineProps({
  propGetAllHierarchiesData: Array,
  proprolePermissions: Boolean,
  propRowDetails: Object,
  propFilterRolesPermissions: Array
});

// Emits
const emit = defineEmits(["emitfnEditrolePermissions"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const showEditRoleToggle = ref(props.proprolePermissions);

const formData = reactive({
  rolePermissions: {
    roleId: props.propRowDetails?.id || null,
    role: props.propRowDetails?.role || "",
    hierarchyId: props.propRowDetails?.hierarchy?.id || null,
    roleColor: props.propRowDetails?.roleColor || ""
  }
});

// Custom validator for alphabets and space
const custom = helpers.regex("custom", /^[a-zA-Z\s]*$/);

// Vuelidate rules
const rules = {
  rolePermissions: {
    role: { required, custom, minLength: minLength(2) },
    hierarchyId: { required },
    roleColor: { required }
  }
};

const v$ = useVuelidate(rules, formData);

// Sync prop changes to local state
watch(() => props.proprolePermissions, val => showEditRoleToggle.value = val);

// Emit close modal
const emitEditRolePermissions = () => emit("emitfnEditrolePermissions", showEditRoleToggle.value);

// Submit form
const submitEditRolePermissions = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", delay: 100 });

  try {
    await store.dispatch("SuperAdminUsers/FEED_ROLE_ORIGINAL_DATA", formData.rolePermissions);
    await store.dispatch("SuperAdminUsers/FETCH_ALL_ROLES_PERMISSIONS_DATA");

    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitEditRolePermissions();
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
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
