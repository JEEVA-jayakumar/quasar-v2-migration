<template>
  <div>
    <!-- Modal -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitShowEditServiceStatus"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px">

        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">
              Modify Service Status Info
            </div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitEditedServiceStatus">

            <!-- Service Status Name -->
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12">
                <q-input
                  v-model="formData.name"
                  float-label="Service Status Name"
                  placeholder="Service Status Name"
                  color="grey-9"
                  class="text-weight-regular text-grey-8"
                  :error="!!v$.name.$error"
                  @blur="v$.name.$touch()"
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
                  @click="emitShowEditServiceStatus"
                />
                <q-btn
                  label="Save"
                  color="purple-9"
                  @click="submitEditedServiceStatus"
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
import showServiceSubTaskDetails from '../../components/super_admin/showServiceSubTaskDetails.vue';

// Props
const props = defineProps({
  propShowEditServiceStatus: Boolean,
  propRowDetails5: Object
});

// Emits
const emit = defineEmits(["emitfnShowEditNewServiceStatus"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditServiceStatus);
const propShowServiceSubTaskDetails = ref(false);
const propRowDetails = ref(props.propRowDetails5 || {});

const formData = reactive({
  name: props.propRowDetails5?.issueReason || ""
});

// Vuelidate
const rules = { name: { required } };
const v$ = useVuelidate(rules, formData);

// Watch modal prop
watch(() => props.propShowEditServiceStatus, val => toggleModel.value = val);

// Watch propRowDetails5 to update local state
watch(() => props.propRowDetails5, (val) => {
  propRowDetails.value = val || {};
  if (val) {
    formData.name = val.issueReason || "";
  }
}, { immediate: true });

// Emit close
const emitShowEditServiceStatus = () => emit("emitfnShowEditNewServiceStatus");

// Sub task toggle
const fnShowSubTaskDetails = (rowDetails) => {
  propShowServiceSubTaskDetails.value = !propShowServiceSubTaskDetails.value;
  // Create a copy of the rowDetails to pass to child component
  propRowDetails.value = { ...rowDetails };
};

// Submit edited service status
const submitEditedServiceStatus = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  const payload = {
    id: props.propRowDetails5.id,
    request: formData
  };

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

  try {
    await store.dispatch("ServiceRequestStatus/EDIT_SERVICE_STATUS_TYPES", payload);
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitShowEditServiceStatus();
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
  console.log("Service Status Modal Loaded:", props.propRowDetails5);
});
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>