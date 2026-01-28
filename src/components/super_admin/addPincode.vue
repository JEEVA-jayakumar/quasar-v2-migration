<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
      @hide="emitfnshowAddPincode"
      @escape-key="emitfnshowAddPincode"
      :maximized="false"
      minimized
    >
      <q-card :style="{ padding: '30px', minWidth: '40vw' }">
        <q-card-section class="q-title text-weight-regular">
          Add Pincode
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="submitPincode">
            <q-input
              v-model="formData.pincode"
              label="Pincode*"
              placeholder="Pincode*"
              outlined
              color="grey-9"
              :error="$v.formData.pincode.$error"
              @keyup.enter="submitPincode"
            />

            <q-input
              v-model="formData.stateName"
              label="State Name"
              placeholder="State name"
              outlined
              color="grey-9"
              :error="$v.formData.stateName.$error"
              class="q-mt-md"
              @keyup.enter="submitPincode"
            />

            <q-input
              v-model="formData.cityName"
              label="City Name"
              placeholder="City name"
              outlined
              color="grey-9"
              :error="$v.formData.cityName.$error"
              class="q-mt-md"
              @keyup.enter="submitPincode"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                color="grey-8"
                label="Cancel"
                class="bg-white"
                @click="emitfnshowAddPincode"
              />
              <q-btn
                color="purple-9"
                label="Save"
                class="q-ml-sm"
                @click="submitPincode"
              />
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "AddPincodeModal",
  props: {
    propShowCreatePincodes: { type: Boolean, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Modal visibility
    const toggleModel = ref(props.propShowCreatePincodes);

    // Form data
    const formData = reactive({
      pincode: "",
      stateName: "",
      cityName: ""
    });

    // Vuelidate rules
    const rules = {
      formData: {
        pincode: { required, minLength: minLength(5), maxLength: maxLength(7) },
        stateName: { required },
        cityName: { required }
      }
    };
    const $v = useVuelidate(rules, { formData });

    // Emit to parent to close modal
    const emitfnshowAddPincode = () => {
      emit("emitfnshowAddPincodes");
    };

    // Submit form
    const submitPincode = async () => {
      $v.value.$touch();
      if ($v.value.$error) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please review fields again.",
          icon: "info"
        });
        return;
      }

      try {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none"
        });

        await store.dispatch("pincodes/ADD_NEW_PINCODE", formData);
        await store.dispatch("pincodes/FETCH_ALL_PINCODES");

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Pincode successfully created!",
          icon: "thumb_up"
        });

        // Reset form
        formData.pincode = "";
        formData.stateName = "";
        formData.cityName = "";

        emitfnshowAddPincode();
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

    return {
      toggleModel,
      formData,
      $v,
      emitfnshowAddPincode,
      submitPincode
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  max-height: 90vh;
}
</style>
