<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    @hide="emitfnshowServiceSubTaskDetails"
    transition-show="slide"
    transition-hide="slide"
    class="customModalOverlay"
  >
    <q-card style="min-width:30vw; padding:30px">

      <!-- Header -->
      <q-card-section class="row gutter-sm q-py-sm items-center">
        <div class="col">
          <div class="q-title text-weight-regular">Add Sub Task</div>
        </div>
      </q-card-section>

      <!-- Form -->
      <q-card-section>
        <q-form @submit.prevent="fnfinalsubmitEditedSpareParts">
          <div class="q-gutter-sm">

            <!-- Service Request ID -->
            <q-input
              v-model="formData.id"
              label="Service Request Id"
              placeholder="Service Request Id"
              disable
              :error="!!$v.formData.id.$error"
              dense
              outlined
            />

            <!-- Service Request Name -->
            <q-input
              v-model="service_req_data"
              label="Service Request"
              placeholder="Service Request"
              disable
              dense
              outlined
            />

            <!-- Select Subtask -->
            <q-select
              v-model="formData.issue_reason"
              :options="subtaskDetails"
              label="Select Subtask"
              radio
              color="grey-9"
              :error="!!$v.formData.issue_reason.$error"
              dense
              outlined
            />

            <!-- Action Buttons -->
            <div class="row justify-end q-pt-md">
              <q-btn flat label="Cancel" color="grey-8" @click="emitfnshowServiceSubTaskDetails" class="q-mr-sm"/>
              <q-btn type="submit" label="Save" color="purple-9"/>
            </div>

          </div>
        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

// Props & Emit
const props = defineProps({
  propShowServiceSubTaskDetails: Boolean,
  propRowDetails: Object
});
const emit = defineEmits(["emitfnshowServiceSubTaskDetails"]);

const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModel = ref(props.propShowServiceSubTaskDetails);
const service_req_data = ref(props.propRowDetails?.service_req_data ?? "");
const subtaskDetails = ref([]);

const formData = ref({
  id: props.propRowDetails?.id ?? "",
  issue_reason: ""
});

// Validation rules
const rules = {
  formData: {
    id: { required },
    issue_reason: { required }
  }
};
const $v = useVuelidate(rules, { formData });

// Watch props
watch(() => props.propShowServiceSubTaskDetails, val => toggleModel.value = val);

// Fetch subtasks
const fnsubTaskLoader = async () => {
  try {
    await store.dispatch("serviceRequest/FETCH_SUB_TASK_DATAS");
    subtaskDetails.value = store.getters["serviceRequest/getsubTaskDetails"].map(item => ({
      label: item.issue_reason,
      value: item.id
    }));
  } catch {

    subtaskDetails.value = [];
  }
};

// Lifecycle
onMounted(() => {
  fnsubTaskLoader();
});

// Emit close
const emitfnshowServiceSubTaskDetails = () => emit("emitfnshowServiceSubTaskDetails");

// Submit
const fnfinalsubmitEditedSpareParts = async () => {
  $v.value.$touch();
  if ($v.value.$invalid) {
    $q.notify({ color: "negative", message: "Please review fields again.", position: "bottom" });
    return;
  }

  $q.loading.show({ message: "Saving..." });

  try {
    const param = {
      id: formData.value.id,
      service_req_data: service_req_data.value
    };
    await store.dispatch("sparePartsGetTypes/EDIT_SPARE_PARTS_TYPES", param);
    $q.notify({ color: "positive", message: "Successfully updated!", icon: "thumb_up", position: "bottom" });
    emitfnshowServiceSubTaskDetails();
  } catch (error) {

    $q.notify({
      color: "negative",
      message: error?.body?.message ?? "Please try again later!",
      icon: "thumb_down",
      position: "bottom"
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
