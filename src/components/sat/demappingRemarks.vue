<template>
  <q-page padding>
    <q-dialog
      :model-value="toggleModel"
      persistent
      @update:model-value="handleDialogUpdate"
      :maximized="false"
      :max-width="'50vw'"
    >
      <q-card style="padding: 30px; min-width: 20vw">
        <!-- Modal Header -->
        <q-card-section class="row items-center q-pa-md bottom-border">
          <div class="col text-h6 text-weight-regular">
            Serial Number Remarks
          </div>
        </q-card-section>

        <!-- Remarks Input -->
        <q-card-section>
          <q-input
            type="textarea"
            filled
            v-model="formData.reason"
            label="Reason Type"
            :error="v$.formData.reason.$invalid && v$.formData.reason.$dirty"
            @blur="v$.formData.reason.$touch()"
            autogrow
          />
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey-8"
            text-color="black"
            @click="emitfnshowUpdateDemapping"
          />
          <q-btn
            label="Submit"
            color="purple-9"
            @click="fnReasonRemarks"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();

// Props - store in a variable
const props = defineProps({
  propShowUpdateDemapping: Boolean,
  propRowDetails: [Array, Object, Number, String] // Accept whatever type deviceId is
});

// Emit - store in a variable
const emit = defineEmits(["emitfnshowUpdateDemapping"]);

// Reactive state
const toggleModel = ref(false);
const formData = reactive({
  reason: ""
});

// Vuelidate setup
const rules = {
  formData: {
    reason: { required }
  }
};
const v$ = useVuelidate(rules, { formData });

// Watch prop to open/close modal
watch(
  () => props.propShowUpdateDemapping, // Fixed: Use props.propShowUpdateDemapping
  (val) => {
    toggleModel.value = val;
  }
);

// Handle dialog update
const handleDialogUpdate = (value) => {
  if (!value) {
    emit("emitfnshowUpdateDemapping");
  }
};

// Methods
function emitfnshowUpdateDemapping() {
  emit("emitfnshowUpdateDemapping");
}

function fnReasonRemarks() {
  v$.value.$touch();

  if (v$.value.$invalid) {
    $q.notify({
      color: "negative",
      message: "Please review fields again.",
      position: "bottom",
      icon: "warning"
    });
    return;
  }

  const param = {
    remarks: formData.reason,
    deviceId: props.propRowDetails // Fixed: Use props.propRowDetails
  };

  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  store
    .dispatch("deMapping/REMARKS_REASON_DETAILS", param)
    .then(() => {
      emitfnshowUpdateDemapping();
      $q.loading.hide();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "De-Mapped Successfully",
        icon: "thumb_up"
      });
    })
    .catch((error) => {
      $q.loading.hide();
      $q.notify({
        color: "negative",
        position: "bottom",
        message:
          error?.body?.message ?? "Please Try Again Later!",
        icon: "thumb_down"
      });
    });
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>