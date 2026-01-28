<template>
  <div>
    <!-- Dialog for Editing Cancel Status -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitShowEditServiceCancelStatus"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">
              Modify Cancel Status Info
            </div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitEditedServiceCancelStatus">
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
                  @click="emitShowEditServiceCancelStatus"
                />
                <q-btn
                  label="Save"
                  color="purple-9"
                  @click="submitEditedServiceCancelStatus"
                />
              </div>
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
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

// Props
const props = defineProps({
  propShowEditServiceCancelStatus: Boolean,
  propRowDetails5: Object
});

// Emits
const emit = defineEmits(["emitShowEditServiceCancelStatus"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditServiceCancelStatus);

const formData = reactive({
  name: props.propRowDetails5?.name || ""
});

// Vuelidate rules
const rules = { name: { required } };
const v$ = useVuelidate(rules, formData);

// Watch modal prop to sync toggle
watch(() => props.propShowEditServiceCancelStatus, val => toggleModel.value = val);

// Emit close modal
const emitShowEditServiceCancelStatus = () => emit("emitShowEditServiceCancelStatus");

// Submit form
const submitEditedServiceCancelStatus = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  const payload = {
    id: props.propRowDetails5.id,
    request: { ...formData }
  };

  $q.loading.show({ message: "Please wait...", spinnerColor: "purple-9" });

  try {
    await store.dispatch("serviceRequestCancelled/EDIT_SERVICE_CANCEL_STATUS_TYPES", payload);
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitShowEditServiceCancelStatus();
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
