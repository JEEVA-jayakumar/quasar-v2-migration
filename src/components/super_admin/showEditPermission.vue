<template>
  <div>
    <!-- Dialog for Editing Permission -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitEditPermission"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="column q-pa-md bottom-border">
          <div class="q-title text-weight-regular">Edit Permission</div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitPermissionForm">
            <!-- Permission Input -->
            <div class="q-mb-md">
              <q-input
                v-model="formData.permissionDetails.permission"
                float-label="Permission"
                placeholder="Permission"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :error="!!v$.permissionDetails.permission.$error"
                @blur="v$.permissionDetails.permission.$touch()"
                @keyup.enter="submitPermissionForm"
              />
            </div>

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-8"
                class="bg-white text-weight-regular q-mr-sm"
                @click="emitEditPermission"
              />
              <q-btn
                label="Save"
                color="purple-9"
                @click="submitPermissionForm"
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
import { required } from "@vuelidate/validators";

// Props
const props = defineProps({
  propRowDetails: Object,
  propShowEditPermission: Boolean
});

// Emits
const emit = defineEmits(["emitEditpermissionDetails"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditPermission);

const formData = reactive({
  permissionDetails: {
    permission: props.propRowDetails?.permission || "",
    permissionId: props.propRowDetails?.id || null
  }
});

// Vuelidate rules
const rules = {
  permissionDetails: {
    permission: { required }
  }
};

const v$ = useVuelidate(rules, formData);

// Watch prop changes
watch(() => props.propShowEditPermission, val => toggleModel.value = val);

// Emit close
const emitEditPermission = () => emit("emitEditpermissionDetails", toggleModel.value);

// Submit function
const submitPermissionForm = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", delay: 100 });

  try {
    await store.dispatch("SuperAdminUsers/FEED_EXISTING_PERMISSION_DATA", formData.permissionDetails);
    await store.dispatch("SuperAdminUsers/FETCH_ALL_PERMISSIONS_DATA");

    $q.notify({ color: "positive", position: "bottom", message: "Successfully Updated!", icon: "thumb_up" });
    emitEditPermission();
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
