<template>
  <div>
    <!-- Edit Hierarchy Dialog -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitEditHierarchy"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="q-pb-md bottom-border">
          <div class="q-title text-weight-regular">Edit Hierarchy</div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitHierarchyForm">
            <!-- Hierarchy Name -->
            <q-input
              v-model="formData.hierarchy"
              float-label="Hierarchy"
              placeholder="Hierarchy"
              class="text-weight-regular text-grey-8 q-my-sm"
              color="grey-9"
              :error="!!v$.hierarchy.$error"
              @blur="v$.hierarchy.$touch()"
            />

            <!-- Hierarchy Code -->
            <q-input
              v-model="formData.hierarchyCode"
              float-label="Hierarchy Code"
              placeholder="Hierarchy Code"
              class="text-weight-regular text-grey-8 q-my-sm"
              color="grey-9"
              :error="!!v$.hierarchyCode.$error"
              @blur="v$.hierarchyCode.$touch()"
            />

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-8"
                class="bg-white text-weight-regular q-mr-sm"
                @click="emitEditHierarchy"
              />
              <q-btn
                label="Save"
                color="purple-9"
                @click="submitHierarchyForm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// Props
const props = defineProps({
  propShowEditHierarchy: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitEditHierarchyDetails"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive states
const toggleModel = ref(props.propShowEditHierarchy);

const formData = reactive({
  hierarchy: props.propRowDetails?.label || "",
  hierarchyCode: props.propRowDetails?.shortCode || "",
  hierarchyId: props.propRowDetails?.value || null
});

// Vuelidate rules
const rules = {
  hierarchy: { required },
  hierarchyCode: { required }
};
const v$ = useVuelidate(rules, formData);

// Watch prop changes
watch(() => props.propShowEditHierarchy, val => toggleModel.value = val);

// Emit close
const emitEditHierarchy = () => emit("emitEditHierarchyDetails", toggleModel.value);

// Submit Hierarchy
const submitHierarchyForm = async () => {
  v$.$touch();

  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  const payload = { ...formData };

  $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

  try {
    await store.dispatch("SuperAdminUsers/FEED_EXISTING_HIERARCHY_DATA", payload);
    await store.dispatch("SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA");
    $q.notify({ color: "positive", position: "bottom", message: "Successfully Updated!", icon: "thumb_up" });
    emitEditHierarchy();
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
