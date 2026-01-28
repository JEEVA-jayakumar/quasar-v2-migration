<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowEditPincode"
      persistent
      class="customModalOverlay"
    >
      <q-card style="padding: 30px; min-width: 40vw">
        <form @submit.prevent="submitPincode">
          <div class="column group">
            <div class="col-md-12">
              <div class="q-title text-weight-regular">Edit Pincode</div>
            </div>

            <div class="col-md-12">
              <q-input
                v-model.number="formData.pincode"
                :error="v$.formData.pincode.$error"
                @blur="v$.formData.pincode.$touch()"
                @keyup.enter="submitPincode"
                class="text-weight-regular text-grey-8"
                type="number"
                color="grey-9"
                label="Pincode"
                placeholder="Pincode"
              />
              <div v-if="v$.formData.pincode.$error" class="text-negative text-caption q-mt-xs">
                Pincode must be 5-7 digits
              </div>
            </div>

            <div class="col-md-12">
              <q-input
                v-model="formData.stateName"
                :error="v$.formData.stateName.$error"
                @blur="v$.formData.stateName.$touch()"
                @keyup.enter="submitPincode"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="State Name"
                placeholder="State Name"
              />
              <div v-if="v$.formData.stateName.$error" class="text-negative text-caption q-mt-xs">
                State name is required
              </div>
            </div>

            <div class="col-md-12">
              <q-input
                v-model="formData.cityName"
                :error="v$.formData.cityName.$error"
                @blur="v$.formData.cityName.$touch()"
                @keyup.enter="submitPincode"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="City Name"
                placeholder="City Name"
              />
              <div v-if="v$.formData.cityName.$error" class="text-negative text-caption q-mt-xs">
                City name is required
              </div>
            </div>

            <div class="col-md-12 group" align="right">
              <q-btn
                flat
                class="bg-white text-weight-regular text-grey-8"
                @click="emitfnshowEditPincode"
              >
                Cancel
              </q-btn>
              <q-btn
                color="purple-9"
                type="submit"
                :loading="isSubmitting"
              >
                Save
              </q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, minLength } from "@vuelidate/validators";

// Props
const props = defineProps({
  propShowEditPincodes: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowEditPincodes"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(false);
const isSubmitting = ref(false);
const formData = reactive({
  id: 0,
  pincode: "",
  stateName: "",
  cityName: ""
});

// Initialize reactive state from props
watch(
  () => props.propShowEditPincodes,
  (val) => (toggleModel.value = val),
  { immediate: true }
);

watch(
  () => props.propRowDetails,
  (val) => {
    if (val) {
      formData.id = val.id;
      formData.pincode = val.pincode;
      formData.stateName = val.stateName;
      formData.cityName = val.cityName;
    }
  },
  { immediate: true }
);

// Vuelidate rules
const rules = {
  formData: {
    pincode: { 
      required, 
      maxLength: maxLength(7), 
      minLength: minLength(5),
      $message: 'Pincode must be 5-7 digits'
    },
    stateName: { 
      required,
      $message: 'State name is required'
    },
    cityName: { 
      required,
      $message: 'City name is required'
    }
  }
};

const v$ = useVuelidate(rules, { formData });

// Methods
function emitfnshowEditPincode() {
  emit("emitfnshowEditPincodes");
}

async function submitPincode() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    $q.notify({ 
      message: "Please review fields again.", 
      color: "negative", 
      position: "bottom" 
    });
    return;
  }

  isSubmitting.value = true;
  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  try {
    await store.dispatch("pincodes/EDIT_NEW_PINCODE", formData);
    await store.dispatch("pincodes/FETCH_ALL_PINCODES");
    
    emitfnshowEditPincode();
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Pincode successfully updated!",
      icon: "thumb_up"
    });
  } catch (error) {
    console.error("Update pincode error:", error);
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || 
              error?.response?.data?.message || 
              "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    isSubmitting.value = false;
    $q.loading.hide();
  }
}
</script>

<style scoped>
.q-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 20px;
}
</style>