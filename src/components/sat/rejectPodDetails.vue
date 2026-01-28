<template>
  <!-- CHANGE: q-modal to q-dialog -->
  <q-dialog
    v-model="dialogModel"
    @hide="emitToggleReject"
    persistent
  >
    <q-card style="padding: 50px; min-width: 400px">
      <div>
        <!-- Header -->
        <div align="center" class="q-subheading q-mb-md capitalize">
          {{ props.propShowRejectComponent.allocate_region.regionAreaName }}
        </div>
        <div align="center" class="text-light-blue q-title q-mb-md">
          #{{ props.propShowRejectComponent.pod_number }}
        </div>

        <!-- Remarks Input -->
        <q-input
          type="textarea"
          placeholder="Type.."
          v-model="formData.regionRemarks"
          :error="!!errors.regionRemarks"
          @blur="touchRegionRemarks"
          class="q-my-md"
          color="grey-9"
          align="left"
        />
        <div v-if="errors.regionRemarks" class="text-negative text-caption q-mt-xs">
          {{ errors.regionRemarks }}
        </div>

        <!-- Buttons -->
        <div class="row justify-end">
          <q-btn
            color="negative"
            class="q-ma-sm"
            label="Reject"
            @click="PodRejectDetails(formData)"
          />
          <q-btn
            color="grey-9"
            class="q-ma-sm"
            label="Cancel"
            @click="emitToggleReject"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, watch, computed } from "vue";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// Props
const props = defineProps({
  showRejectModel: Boolean,
  propShowRejectComponent: Object,
});

// Emits
const emit = defineEmits(["closeRejectModel"]);

// Quasar, Vuex & Router
const $q = useQuasar();
const store = useStore();
const router = useRouter();

// Reactive form data
const formData = reactive({
  regionRemarks: "",
  soRemarks: "", // Added since you use it in the function
});

// Error handling
const errors = reactive({
  regionRemarks: "",
});

// Vuelidate rules
const rules = {
  regionRemarks: { required },
};
const v$ = useVuelidate(rules, formData);

// Computed for dialog model (to fix prop mutation)
const dialogModel = computed({
  get: () => props.showRejectModel,
  set: (value) => {
    if (!value) {
      emit("closeRejectModel", "reloadPaymentTrackerData");
    }
  }
});

// Watch to clear errors dynamically
watch(() => formData.regionRemarks, () => {
  errors.regionRemarks = "";
});

// Methods
const touchRegionRemarks = () => {
  v$.value.regionRemarks.$touch();
  errors.regionRemarks = v$.value.regionRemarks.$error ? "Please enter remarks." : "";
};

const emitToggleReject = () => {
  emit("closeRejectModel", "reloadPaymentTrackerData");
};

const PodRejectDetails = async (reqData) => {
  touchRegionRemarks();
  if (v$.value.regionRemarks.$error) {
    $q.notify({ 
      type: "negative", 
      color: "negative",
      position: "bottom",
      message: "Please enter remarks." 
    });
    return;
  }

  try {
    const confirm = await $q.dialog({
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
    });

    if (!confirm) return;

    $q.loading.show({ 
      delay: 0, 
      spinnerColor: "purple-9", 
      message: "Processing .." 
    });

    // Fetch single POD details
    const response = await store.dispatch("singlePodData/FETCH_SINGLE_POD_DETAILS", {
      pod_number: props.propShowRejectComponent.pod_number
    });

    const param = { ...response.data.data };
    param.soRemarks = param.soRemarks === "null" ? "null" : reqData.soRemarks || "";
    param.regionRemarks = param.regionRemarks === "null" ? "null" : reqData.regionRemarks || "";

    // Reject POD
    await store.dispatch("regionalInventoryDetails/REJECT_INCOMING_POD_DETAILS", param);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully updated!",
      icon: "thumb_up",
    });

    emitToggleReject();
    router.push("/sat/inventory/allocation");
  } catch (error) {
    console.error("Pod reject error:", error);
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
/* Optional: keep your modal styling consistent */
</style>