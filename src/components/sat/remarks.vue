<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card style="padding: 30px; min-width: 40vw">
        <form @submit.prevent="saveRemarks(formData)">
          <div class="column group">
            <div class="col-12 q-title q-py-md">Save with remarks</div>

            <div class="col-12">
              <q-input
                color="grey-9"
                v-model="formData.remarks"
                type="textarea"
                label="Remarks"
                :max-height="100"
                @blur="touchRemarks"
                :error="!!errors.remarks"
              />
              <div v-if="errors.remarks" class="text-negative text-caption q-mt-xs">
                {{ errors.remarks }}
              </div>
            </div>

            <div class="col-12 group row justify-end">
              <q-btn
                icon="save"
                color="amber-9"
                class="q-ma-sm"
                label="Save"
                @click="saveRemarks(formData)"
              />
              <q-btn
                icon="block"
                color="grey-5"
                class="q-ma-sm text-dark"
                label="Cancel"
                @click="emitToggleRemarks"
              />
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

// Props
const props = defineProps({
  propToggleLeadModal: Boolean,
  propLeadDetails: Object,
});

// Emits
const emit = defineEmits(["toggleLeadModal", "refreshContentOnSavingRemarks"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Modal control
const toggleModal = ref(props.propToggleLeadModal);

// Reactive form data
const formData = reactive({
  id: props.propLeadDetails.id,
  remarks: "",
});

// Reactive errors
const errors = reactive({ remarks: "" });

// Vuelidate rules
const rules = { remarks: { required } };
const v$ = useVuelidate(rules, formData);

// Clear errors dynamically
watch(() => formData.remarks, () => {
  errors.remarks = "";
});

// Watch prop to sync modal
watch(() => props.propToggleLeadModal, (val) => {
  toggleModal.value = val;
});

// Validation touch
const touchRemarks = () => {
  v$.value.remarks.$touch();
  errors.remarks = v$.value.remarks.$error ? "Please enter remarks." : "";
};

// Emit close modal
const emitToggleRemarks = () => {
  emit("toggleLeadModal");
};

// Save remarks
const saveRemarks = async (finalFormData) => {
  touchRemarks();
  if (v$.value.remarks.$error) {
    $q.notify({ 
      type: "negative", 
      color: "negative",
      position: "bottom",
      message: "Please enter remarks." 
    });
    return;
  }

  $q.loading.show({ 
    delay: 0, 
    spinnerColor: "purple-9", 
    message: "Saving data .." 
  });

  try {
    await store.dispatch("SatLeadValidation/SAVE_REMARKS", finalFormData);
    emit("refreshContentOnSavingRemarks");
    emitToggleRemarks();

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Remarks saved successfully",
      icon: "thumb_up",
    });
  } catch (error) {
    console.error("Save remarks error:", error);
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || 
              error?.response?.data?.message || 
              "Please Try Again Later !",
      icon: "thumb_down",
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
/* Optional styling to maintain modal appearance */
.customModalOverlay {
  max-height: 90vh;
}
.q-title {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>