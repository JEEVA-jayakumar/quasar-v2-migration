<template>
  <!-- CHANGE: q-modal to q-dialog -->
  <q-dialog
    v-model="dialogModel"
    @hide="emitToggleLost"
    persistent
  >
    <q-card style="padding: 25px; min-width: 400px">
      <div>
        <!-- Header -->
        <div align="center" class="text-weight-light text-grey-8 q-mb-md">
          <h5><b>Reason</b></h5>
        </div>

        <!-- Subtext -->
        <div align="left" class="text-weight-light text-grey-8 q-mb-md">
          Add your Reason and then submit...
        </div>

        <!-- Input -->
        <div class="gutter-xs">
          <q-input
            v-model="remarks"
            type="textarea"
            placeholder="Type.."
            :error="!!errors.remarks"
            @blur="touchRemarks"
            class="q-my-md"
            color="grey-9"
            align="left"
          />
          <div v-if="errors.remarks" class="text-negative text-caption q-mt-xs">
            {{ errors.remarks }}
          </div>
        </div>

        <!-- Buttons -->
        <div class="row justify-end">
          <q-btn
            color="positive"
            class="q-ma-sm"
            label="Submit"
            @click="rejectSelfAssign(formData.data)"
          />
          <q-btn
            color="grey-9"
            class="q-ma-sm"
            label="Cancel"
            @click="emitToggleLost"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useStore } from "vuex";

// Props
const props = defineProps({
  showRequestModal: Boolean,
  showRequestComponent: Object
});

// Emits
const emit = defineEmits(["closeLostModel"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive Data
const remarks = ref("");
const errors = reactive({ remarks: "" });

const formData = reactive({
  data: props.showRequestComponent
});

// Computed for dialog model (to fix prop mutation)
const dialogModel = computed({
  get: () => props.showRequestModal,
  set: (value) => {
    if (!value) {
      emit("closeLostModel");
    }
  }
});

// Vuelidate setup
const rules = {
  remarks: { required }
};
const v$ = useVuelidate(rules, { remarks });

// Watch remarks to clear errors dynamically
watch(remarks, () => {
  errors.remarks = "";
});

// Methods
const touchRemarks = () => {
  v$.value.remarks.$touch();
  if (v$.value.remarks.$error) {
    errors.remarks = "Please enter reason.";
  } else {
    errors.remarks = "";
  }
};

const emitToggleLost = () => {
  emit("closeLostModel");
};

const rejectSelfAssign = (reqData) => {
  touchRemarks();
  if (v$.value.remarks.$error) {
    $q.notify({ 
      type: "negative", 
      color: "negative",
      position: "bottom",
      message: "Please enter reason." 
    });
    return;
  }

  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to Reject?",
    ok: {
      label: "Continue",
      color: "positive"
    },
    cancel: {
      label: "Cancel",
      color: "grey-9",
      flat: true
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    });

    const param = {
      selfAssignmentId: reqData.id,
      remarks: remarks.value
    };

    try {
      await store.dispatch("VerifyDevice/REJECT_SELF_ASSIGNMENT", param);
      emitToggleLost();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully Rejected!",
        icon: "thumb_up"
      });
    } catch (error) {
      console.error("Reject error:", error);
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error?.body?.message || 
                error?.response?.data?.message || 
                "Please Try Again Later !",
        icon: "thumb_down"
      });
    } finally {
      $q.loading.hide();
    }
  });
};
</script>

<style scoped>
/* Optional: keep your modal styling consistent */
</style>