<template>
  <div>
    <!-- Modal -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitShowEditServiceType"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw; padding: 30px">

        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">
              Modify Service Request Info
            </div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitEditedServiceType">

            <!-- Service Req Name -->
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12">
                <q-input
                  v-model="formData.serviceReqType.name"
                  float-label="Service Req Data"
                  placeholder="Service Req Data"
                  color="grey-9"
                  class="text-weight-regular text-grey-8"
                  :error="!!$v.serviceReqTypeName.$error"
                  @blur="$v.serviceReqTypeName.$touch()"
                />
              </div>
            </div>

            <!-- Service Req Issue Type -->
            <div class="row gutter-sm q-py-sm">
              <div class="col-md-6">
                <p>Service Req Issue Type*</p>
                <div class="row items-center" v-for="menu in serviceReqIssueTypeSetsPro" :key="menu.id">
                  <q-checkbox
                    v-model="selectedIssueTypes"
                    :val="menu"
                    color="purple-9"
                    label="menu.serviceReqIssueType.name"
                    dense
                  />
                </div>
              </div>

              <!-- Service Status -->
              <div class="col-md-6">
                <p>Service Status*</p>
                <div class="row items-center" v-for="menu in serviceRequestStatus" :key="menu.id">
                  <q-checkbox
                    v-model="selectedStatuses"
                    :val="menu"
                    color="purple-9"
                    label="menu.serviceRequestStatus.name"
                    dense
                  />
                </div>
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
                  @click="emitShowEditServiceType"
                />
                <q-btn
                  label="Save"
                  color="purple-9"
                  @click="submitEditedServiceType"
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
  propShowEditServiceType: Boolean,
  propRowDetails2: Object
});

// Emits
const emit = defineEmits(["emitfnshowEditServiceType"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditServiceType);
const propShowServiceSubTaskDetails = ref(false);
const propRowDetails = ref(props.propRowDetails2 || {});

const formData = reactive({
  serviceReqType: {
    name: props.propRowDetails2?.serviceReqType?.name || ""
  },
  serviceReqIssueTypeSets: [],
  serviceRequestStatusSets: []
});

// Selected checkboxes
const selectedIssueTypes = ref([...props.propRowDetails2?.serviceReqIssueTypeSets || []]);
const selectedStatuses = ref([...props.propRowDetails2?.serviceRequestStatusSets || []]);

// Vuelidate
const rules = {
  serviceReqTypeName: { required }
};
const v$ = useVuelidate(rules, { serviceReqTypeName: formData.serviceReqType.name });

// Sync modal with prop
watch(() => props.propShowEditServiceType, val => toggleModel.value = val);

// Watch propRowDetails2 to update local state
watch(() => props.propRowDetails2, (val) => {
  propRowDetails.value = val || {};
  if (val) {
    formData.serviceReqType.name = val.serviceReqType?.name || "";
    selectedIssueTypes.value = [...val.serviceReqIssueTypeSets || []];
    selectedStatuses.value = [...val.serviceRequestStatusSets || []];
  }
}, { immediate: true });

// Emit close
const emitShowEditServiceType = () => emit("emitfnshowEditServiceType");

// Sub task toggle
const fnShowSubTaskDetails = (rowDetails) => {
  propShowServiceSubTaskDetails.value = !propShowServiceSubTaskDetails.value;
  // Create a copy of the rowDetails to pass to child component
  propRowDetails.value = { ...rowDetails };
};

// Submit edited service type
const submitEditedServiceType = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  formData.serviceReqIssueTypeSets = selectedIssueTypes.value;
  formData.serviceRequestStatusSets = selectedStatuses.value;

  const payload = {
    id: props.propRowDetails2.serviceReqType.id,
    request: {
      serviceReqType: formData.serviceReqType,
      serviceReqIssueTypeSets: formData.serviceReqIssueTypeSets,
      serviceRequestStatusSets: formData.serviceRequestStatusSets
    }
  };

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

  try {
    await store.dispatch("serviceRequest/EDIT_SERVICE_REQUEST_TYPES", payload);
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitShowEditServiceType();
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

// Load Issue Types & Status Types if needed
onMounted(() => {
  // Example: store.dispatch("serviceRequest/GET_SERVICE_ISSUE_TYPES")
  // Example: store.dispatch("ServiceRequestStatus/FETCH_SERVICE_REQUEST_STATUS_DETAILS")
});
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>