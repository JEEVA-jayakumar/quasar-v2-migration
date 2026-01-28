<template>
  <div>
    <!-- Modal -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitShowEditSubTaskType"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px">

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
          <q-form @submit.prevent="submitEditedSubTask">
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12">
                <q-input
                  v-model="formData.name"
                  float-label="Service Sub Task Name"
                  placeholder="Service Sub Task Name"
                  color="grey-9"
                  class="text-weight-regular text-grey-8"
                  :error="!!$v.name.$error"
                  @blur="$v.name.$touch()"
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
                  @click="emitShowEditSubTaskType"
                />
                <q-btn
                  label="Save"
                  color="purple-9"
                  @click="submitEditedSubTask"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

      </q-card>
    </q-dialog>

    <!-- Show Sub Task Details -->
    <ShowServiceSubTaskDetailsComponent
      v-if="showServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="showServiceSubTaskDetails"
      :propRowDetails="rowDetails"
      @emitfnshowServiceSubTaskDetails="toggleSubTaskDetails"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch} from "vue";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

import ShowServiceSubTaskDetailsComponent from "../../components/super_admin/showServiceSubTaskDetails.vue";

// Props
const props = defineProps({
  propShowEditSubTaskType: Boolean,
  propRowDetails1: Object
});

// Emits
const emit = defineEmits(["emitfnshowEditSubTaskType"]);

const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditSubTaskType);
const formData = reactive({
  name: props.propRowDetails1?.name || ""
});

const showServiceSubTaskDetails = ref(false);
const rowDetails = ref({});

// Vuelidate rules
const rules = {
  name: { required }
};
const $v = useVuelidate(rules, formData);

// Watch prop to update modal state
watch(() => props.propShowEditSubTaskType, val => toggleModel.value = val);

// Emit modal close
const emitShowEditSubTaskType = () => emit("emitfnshowEditSubTaskType");

// Toggle Sub Task Details modal
const toggleSubTaskDetails = (details) => {
  showServiceSubTaskDetails.value = !showServiceSubTaskDetails.value;
  rowDetails.value = details;
};

// Submit edited Sub Task
const submitEditedSubTask = async () => {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

  try {
    const payload = {
      id: props.propRowDetails1.id,
      request: { name: formData.name }
    };
    await store.dispatch("serviceRequest/EDIT_SUB_TASK_TYPES", payload);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully updated!",
      icon: "thumb_up"
    });

    emitShowEditSubTaskType();
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
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>