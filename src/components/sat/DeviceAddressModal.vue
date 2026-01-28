<template>
  <q-page padding>
    <q-dialog
      v-model="toggleModal.value"
      persistent
      :content-class="'customModalOverlay'"
      :content-style="{ padding: '30px', minWidth: '40vw' }"
    >
      <q-card>
        <!-- Modal Header -->
        <q-card-section class="q-title text-weight-regular bottom-border">
          Update Device Address
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-input
            filled
            v-model="formData.marsDeviceAddress.deviceAddress"
            label="Address"
            placeholder="Address"
            color="grey-9"
            :error="v$.formData.marsDeviceAddress.deviceAddress.$invalid && v$.formData.marsDeviceAddress.deviceAddress.$dirty"
            @blur="v$.formData.marsDeviceAddress.deviceAddress.$touch()"
          />

          <q-input
            filled
            v-model="formData.marsDeviceAddress.pincode"
            label="Pincode"
            placeholder="Pincode"
            color="grey-9"
            :error="v$.formData.marsDeviceAddress.pincode.$invalid && v$.formData.marsDeviceAddress.pincode.$dirty"
          >
            <template #append>
              <q-autocomplete
                :debounce="500"
                :min-characters="1"
                @search="pincodeSearch"
                @selected="pincodeSelected"
              />
            </template>
          </q-input>

          <q-input
            filled
            v-model="formData.marsDeviceAddress.state"
            label="State"
            placeholder="State"
            color="grey-9"
            disable
          />

          <q-input
            filled
            v-model="formData.marsDeviceAddress.city"
            label="City"
            placeholder="City"
            color="grey-9"
            disable
          />

          <!-- Radio Buttons -->
          <div class="q-mt-md">
            <q-radio
              v-if="[0,1].includes(selectedLeadItems.length)"
              v-model="formData.action"
              :val="1"
              label="Change in current occurrence only"
              color="grey-9"
            />
            <q-radio
              v-if="selectedLeadItems.length > 1"
              v-model="formData.action"
              :val="2"
              label="Change in all selected occurrences"
              color="grey-9"
            />
            <q-radio
              v-model="formData.action"
              :val="3"
              label="Change in all occurrences of this merchant"
              color="grey-9"
            />
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey-6"
            icon="block"
            @click="closeModal"
          />
          <q-btn
            label="Save"
            color="positive"
            icon="check"
            @click="UpdateDeviceAddress"
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
import _ from "lodash";

// Props
const props = defineProps({
  showDeviceAddressModal: Boolean,
  currentDeviceInfo: Object,
  stateInformation: Array,
  paginationControl: Object,
  selectedLeadItems: Array
});

// Emit
const emit = defineEmits(["toggleModal"]);

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();

// Reactive state
const toggleModal = ref(props.showDeviceAddressModal);
const formData = reactive({
  action: 3,
  id: props.currentDeviceInfo.id,
  marsDeviceAddress: {
    deviceAddress: props.currentDeviceInfo.marsDeviceAddress.deviceAddress,
    latitude: 0,
    longitude: 0,
    pincode: props.currentDeviceInfo.marsDeviceAddress.pincode,
    city: props.currentDeviceInfo.marsDeviceAddress.city,
    state: props.currentDeviceInfo.marsDeviceAddress.state
  }
});
const pagination = reactive(props.paginationControl);

// Vuelidate rules
const rules = {
  formData: {
    marsDeviceAddress: {
      deviceAddress: { required },
      pincode: { required },
      state: { required },
      city: { required }
    }
  }
};
const v$ = useVuelidate(rules, { formData });

// Watch prop for modal
watch(() => props.showDeviceAddressModal, val => {
  toggleModal.value = val;
});

// Methods
function COMMON_FILTER_FUNCTION(arraySet, terms) {
  return _.filter(arraySet, (item) =>
    item.label.toLowerCase().includes(terms.toLowerCase())
  );
}

function pincodeSearch(terms, done) {
  done(COMMON_FILTER_FUNCTION(props.stateInformation, terms));
}

function pincodeSelected(item) {
  formData.marsDeviceAddress.state = item.value.stateName;
  formData.marsDeviceAddress.city = item.value.cityName;
  formData.marsDeviceAddress.pincode = item.value.pincode;
}

function closeModal() {
  emit("toggleModal", pagination);
}

function UpdateDeviceAddress() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please review fields again.",
      icon: "warning"
    });
    return;
  }

  store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", true);
  store
    .dispatch("SatLeadValidation/UPDATE_DEVICE_ADDRESS", formData)
    .then(() => {
      store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", false);
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Address Updated Successfully",
        icon: "thumb_up"
      });
      closeModal();
    })
    .catch((error) => {
      store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", false);
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error?.body?.message ?? "Please Try Again Later!",
        icon: "thumb_down"
      });
    });
}
</script>

<style scoped>
.customModalOverlay {
  min-width: 40vw;
}
</style>
