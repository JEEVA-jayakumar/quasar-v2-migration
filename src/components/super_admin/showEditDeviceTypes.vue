<template>
  <div>
    <!-- Edit Device Dialog -->
    <q-dialog
      v-model="toggleModel"
      persistent
      no-backdrop-dismiss
      class="customModalOverlay"
      transition-show="slide"
      transition-hide="slide"
    >
      <q-card style="min-width: 30vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="q-pb-md bottom-border row items-center">
          <q-icon name="border_color" size="25px" color="purple-9" class="q-mr-sm"/>
          <div class="q-title text-weight-regular">Modify Device</div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitDeviceForm">
            <!-- Device Name -->
            <q-input
              v-model="formData.deviceName"
              float-label="Device Type"
              placeholder="Device Type"
              class="text-weight-regular text-grey-8 q-my-sm"
              color="grey-9"
              :error="!!v$.deviceName.$error"
              @blur="v$.deviceName.$touch()"
            />

            <!-- Color Picker -->
            <div class="row items-center q-my-sm">
              <div class="col">
                <q-color
                  v-model="formData.colorCode"
                  clearable
                  popover
                  float-label="Choose a role color"
                  color="grey-9"
                  @input="updateDuplicateColor"
                  :error="!!v$.colorCode.$error"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  round
                  :style="{ background: formData.colorCodeDuplicate }"
                  @click="undoColorChange"
                />
              </div>
            </div>

            <!-- Serial Number Length -->
            <q-input
              v-model="formData.serialNumberLength"
              type="number"
              float-label="Serial Number Length"
              placeholder="Serial Number Length"
              class="text-weight-regular text-grey-8 q-my-sm"
              color="grey-9"
              :error="!!v$.serialNumberLength.$error"
              @blur="v$.serialNumberLength.$touch()"
            />

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                outline
                icon="block"
                label="Cancel"
                color="grey-6"
                class="text-weight-regular q-mr-sm"
                @click="emitEditDeviceTypes"
              />
              <q-btn
                icon="check"
                label="Save"
                color="purple-9"
                @click="submitDeviceForm"
              />
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
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, maxValue } from "@vuelidate/validators";

// Props
const props = defineProps({
  propShowEditDeviceTypes: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowDeviceTypes", "emitfnForDeviceTypeTable"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive states
const toggleModel = ref(props.propShowEditDeviceTypes);

const formData = reactive({
  id: props.propRowDetails?.id || null,
  deviceName: props.propRowDetails?.deviceName || "",
  colorCode: props.propRowDetails?.colorCode || "",
  colorCodeDuplicate: props.propRowDetails?.colorCode || "",
  serialNumberLength: props.propRowDetails?.serialNumberLength || ""
});

// Vuelidate rules
const rules = {
  deviceName: { required },
  colorCode: { required },
  serialNumberLength: { required, maxValue: maxValue(50) }
};
const v$ = useVuelidate(rules, formData);

// Watch prop changes
watch(() => props.propShowEditDeviceTypes, val => toggleModel.value = val);

// Emit cancel
const emitEditDeviceTypes = () => {
  emit("emitfnshowDeviceTypes");
  emit("emitfnForDeviceTypeTable");
};

// Update duplicate color for undo
const updateDuplicateColor = (value) => {
  if (value) formData.colorCodeDuplicate = value;
};

// Undo color change
const undoColorChange = () => {
  formData.colorCode = formData.colorCodeDuplicate;
};

// Submit Device Form
const submitDeviceForm = async () => {
  v$.$touch();

  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

  try {
    await store.dispatch("SA_Devices/UPDATE_DEVICE_DATA", formData);
    await store.dispatch("SA_Devices/FETCH_DEVICES_DATA");
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitEditDeviceTypes();
    location.reload(); // preserves existing behavior
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
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
