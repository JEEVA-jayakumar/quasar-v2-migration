<template>
  <div>
    <!-- Dialog for Editing Service Resolution Remarks -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitShowEditServiceResolutionRemarks"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px">
        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">
              Modify Service Resolution Remarks
            </div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitServiceResolutionRemarks">
            <!-- Remarks Input -->
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12">
                <q-input
                  v-model="formData.name"
                  float-label="Enter Service Resolution Remarks"
                  placeholder="Enter Service Resolution Remarks"
                  color="grey-9"
                  class="text-weight-regular text-grey-8"
                  :error="!!v$.name.$error"
                  @blur="v$.name.$touch()"
                />
              </div>
            </div>

            <!-- Category Radio Options -->
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12">
                <q-radio
                  v-for="(item, index) in options.flagOptions"
                  :key="index"
                  v-model="formData.category"
                  :val="item.value"
                  :label="item.label"
                  color="grey-9"
                  dense
                  class="q-mb-sm"
                />
              </div>
            </div>

            <!-- Buttons -->
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12 text-right">
                <q-btn
                  flat
                  label="Cancel"
                  color="grey-8"
                  class="bg-white text-weight-regular"
                  @click="emitShowEditServiceResolutionRemarks"
                />
                <q-btn
                  label="Save"
                  color="purple-9"
                  @click="submitServiceResolutionRemarks"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Sub Task Details -->
    <showServiceSubTaskDetails
      v-if="propShowServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="propShowServiceSubTaskDetails"
      :propRowDetails="propRowDetails"
      @emitfnshowServiceSubTaskDetails="fnShowSubTaskDetails"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";
import showServiceSubTaskDetails from "../../components/super_admin/showServiceSubTaskDetails.vue";

// Props
const props = defineProps({
  propShowEditServiceResolutionRemarks: Boolean,
  propRowDetails1: Object
});

// Emits
const emit = defineEmits(["emitfnshowEditServiceResolutionRemarks", "updatePropRowDetails"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditServiceResolutionRemarks);
const propShowServiceSubTaskDetails = ref(false);
const propRowDetails = ref(props.propRowDetails1 || {});

const formData = reactive({
  name: props.propRowDetails1?.name || "",
  category: props.propRowDetails1?.category || null
});

// Radio options
const options = reactive({
  flagOptions: [
    { label: "APP", value: 1 },
    { label: "PORTAL", value: 2 }
  ]
});

// Vuelidate
const rules = { name: { required } };
const v$ = useVuelidate(rules, formData);

// Watch modal prop to sync toggle
watch(() => props.propShowEditServiceResolutionRemarks, val => toggleModel.value = val);

// Watch propRowDetails1 to update local state
watch(() => props.propRowDetails1, (val) => {
  propRowDetails.value = val || {};
  if (val) {
    formData.name = val.name || "";
    formData.category = val.category || null;
  }
}, { immediate: true });

// Emit close modal
const emitShowEditServiceResolutionRemarks = () => emit("emitfnshowEditServiceResolutionRemarks");

// Show/hide sub task modal
const fnShowSubTaskDetails = (rowDetails) => {
  propShowServiceSubTaskDetails.value = !propShowServiceSubTaskDetails.value;
  // Create a copy of the rowDetails to pass to child component
  propRowDetails.value = { ...rowDetails };
};

// Submit edited service resolution remarks
const submitServiceResolutionRemarks = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  const payload = {
    id: props.propRowDetails1.id,
    request: { ...formData }
  };

  $q.loading.show({ message: "Please wait...", spinnerColor: "purple-9" });

  try {
    await store.dispatch("serviceRequest/EDIT_SERVICE_RESOLUTION_REMARKS", payload);
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitShowEditServiceResolutionRemarks();
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  console.log("Service Resolution Remarks Modal Loaded:", props.propRowDetails1);
});
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
.alignsize {
  margin-right: 10px;
}
</style>