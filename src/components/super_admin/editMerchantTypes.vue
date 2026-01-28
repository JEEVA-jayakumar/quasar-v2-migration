<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="propToggleModal"
      @hide="toggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card style="padding: 30px; min-width: 30vw">
        <form @submit.prevent="submitMerchantTypeData">
          <div class="row gutter-sm q-py-sm items-center">
            <div class="col-md-12">
              <div class="q-title text-weight-regular">Edit Merchant Type</div>
            </div>
          </div>

          <div class="row gutter-sm q-py-sm items-center">
            <div class="col-md-12">
              <q-input
                v-model="formData.merchantTypeName"
                @blur="v$.formData.merchantTypeName.$touch"
                :error="v$.formData.merchantTypeName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Merchant Type"
                placeholder="Merchant Type"
                @keyup.enter="submitMerchantTypeData"
              />
            </div>

            <div class="col-md-12">
              <q-input
                v-model.number="formData.marsAgreementId"
                @blur="v$.formData.marsAgreementId.$touch"
                :error="v$.formData.marsAgreementId.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                type="number"
                label="Mars Agreement Id"
                placeholder="Mars Agreement Id"
                @keyup.enter="submitMerchantTypeData"
              />
            </div>
          </div>

          <div class="row gutter-sm q-py-sm items-center">
            <div class="col-md-12 group" align="right">
              <q-btn
                flat
                align="right"
                class="bg-white text-weight-regular text-grey-8"
                @click="toggleModal"
              >
                Cancel
              </q-btn>
              <q-btn
                align="right"
                color="purple-9"
                type="submit"
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
import { useVuelidate } from "@vuelidate/core";
import { required, integer } from "@vuelidate/validators";
import { useStore } from "vuex";

// Props
const props = defineProps({
  propShowEditMerchantTypes: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits([
  "emitfnshowMerchantTypes",
  "emitfnForMerchantTypeTableRefresh"
]);

// Quasar instance
const $q = useQuasar();

// Vuex store
const store = useStore();

// Reactive state
const propToggleModal = ref(false);
const formData = reactive({
  id: 0,
  merchantTypeName: "",
  marsAgreementId: 0
});

// Initialize props to reactive state
watch(
  () => props.propShowEditMerchantTypes,
  (val) => (propToggleModal.value = val),
  { immediate: true }
);

watch(
  () => props.propRowDetails,
  (val) => {
    if (val) {
      formData.id = val.id;
      formData.merchantTypeName = val.merchantTypeName;
      formData.marsAgreementId = val.marsAgreementId || 0;
    }
  },
  { immediate: true }
);

// Vuelidate rules
const rules = {
  formData: {
    merchantTypeName: { required },
    marsAgreementId: { required, integer }
  }
};

const v$ = useVuelidate(rules, { formData });

// Methods
function toggleModal() {
  emit("emitfnshowMerchantTypes");
}

function submitMerchantTypeData() {
  v$.value.$touch();
  if (!v$.value.$error) {
    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "purple-9",
      customClass: "shadow-none"
    });

    store
      .dispatch("merchantTypes/UPDATE_MERCHANT_TYPE", formData)
      .then(() => {
        $q.loading.hide();
        emit("emitfnshowMerchantTypes", "refresh");
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Merchant type successfully updated!",
          icon: "thumb_up"
        });
      })
      .catch((error) => {
        console.error("Update merchant type error:", error);
        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.body?.message || 
                  error?.response?.data?.message ||
                  "Please Try Again Later !",
          icon: "thumb_down"
        });
      });
  } else {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please fill in all required fields correctly",
      icon: "warning"
    });
  }
}
</script>

<style scoped>
/* Scoped styles for this component */
.q-title {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>