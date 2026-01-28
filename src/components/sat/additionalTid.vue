<template>
  <div>
    <q-dialog
      class="customModalOverlay"
      v-model="toggleModel"
      persistent
      @hide="closeRejectModel"
      :max-width="'75vw'"
    >
      <q-card style="padding: 50px; min-width: 50vw">
        <div class="row">
          <div
            class="col-md-12 q-title text-center q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
          >
            Additional TID
          </div>
          <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
            <q-card style="width:225%">
              <q-card-section>
                <q-list no-border>
                  <div class="col-md-6">
                    <q-input
                      color="grey-9"
                      disable
                      v-model="additionalTerminal.mid"
                      label="MID*"
                      outlined
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      color="grey-9"
                      disable
                      v-model="additionalTerminal.tid"
                      label="TID*"
                      outlined
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      color="grey-9"
                      disable
                      v-model="additionalTerminal.institutionCode"
                      label="Institution code*"
                      outlined
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      color="grey-9"
                      :disable="props.propsAdditionalData?.merchantRefCode"
                      v-model="additionalTerminal.merchantRefCode"
                      :error="$v.additionalTerminal.merchantRefCode.$error"
                      label="Merchant RefCode*"
                      outlined
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      color="grey-9"
                      disable
                      v-model="additionalTerminal.applicationNumber"
                      label="Application Number*"
                      outlined
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      v-model="additionalTerminal.AdditionalTerminalDetails.numberOfTerminals"
                      @blur="$v.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals.$touch()"
                      :error="$v.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals.$error"
                      class="text-weight-regular text-grey-8"
                      color="grey-9"
                      label="*Number Of Terminals"
                      outlined
                    />
                  </div>
                  <!-- City & State with autocomplete -->
                  <div class="col-md-6">
                    <q-input
                      @blur="fnClrCity"
                      color="grey-9"
                      v-model="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                      @input="fninputTyping($event, 1)"
                      label="City (type min 3 characters)*"
                      outlined
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6">
                    <q-input
                      @blur="fnClrState"
                      color="black-9"
                      v-model="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                      @input="fninputTyping($event, 2)"
                      label="State (type min 3 characters)*"
                      outlined
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </q-list>
              </q-card-section>

              <q-card-actions align="end">
                <q-btn
                  flat
                  align="right"
                  class="bg-white text-weight-regular text-grey-8"
                  @click="closeRejectModel"
                >
                  Cancel
                </q-btn>
                <q-btn
                  label="Submit"
                  @click="fnAdditionalSubmit(additionalTerminal)"
                  color="purple-9"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// Props
const props = defineProps({
  showRejectPaymentMode: Boolean,
  propsAdditionalData: Object
});

// Emits
const emit = defineEmits(["closeRejectModel"]);

// Quasar
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(false);

const additionalTerminal = reactive({
  mid: "",
  tid: "",
  institutionCode: "",
  merchantRefCode: "",
  applicationNumber: "",
  AdditionalTerminalDetails: {
    numberOfTerminals: "",
    address: "",
    pinCode: "",
    citySerNumber: "",
    citySerNumberLabel: "",
    stateSerNumber: "",
    stateSerNumberLabel: ""
  }
});

// Validation rules
const rules = reactive({
  additionalTerminal: {
    merchantRefCode: { required },
    AdditionalTerminalDetails: {
      numberOfTerminals: { required }
    }
  }
});

const $v = useVuelidate(rules, { additionalTerminal });

// Lifecycle
onBeforeMount(() => {
  const data = props.propsAdditionalData; // Fixed: Added 'props.'
  additionalTerminal.mid = data[0]?.mid || "null";
  additionalTerminal.tid = data[0]?.tid || "null";
  additionalTerminal.institutionCode = data[0]?.institutionCode || "";
  additionalTerminal.merchantRefCode = data[0]?.merchantRefCode || "null";
  additionalTerminal.applicationNumber = data[0]?.applicationNumber || "null";
  additionalTerminal.AdditionalTerminalDetails.address = data[0]?.leadInformation?.leadAddress || "";
  additionalTerminal.AdditionalTerminalDetails.pinCode = data[0]?.leadInformation?.pincode || "";
  additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = data[0]?.leadInformation?.city || "";
  additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = data[0]?.leadInformation?.state || "";
});

// Methods
function closeRejectModel() {
  emit("closeRejectModel");
}

function fnAdditionalSubmit(request) {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please fill all mandatory fields",
      icon: "info"
    });
    return;
  }

  $q.loading.show({ spinnerColor: "purple-9", message: "Validating ..." });

  // Call your Vuex action (example)
  store.dispatch("mars_additional_tid/ADDITIONAL_TID_FROM_MARS", { additionalTerminal: request })
    .then(() => { // Removed unused 'response' parameter
      $q.loading.hide();
      $q.notify({ color: "positive", message: "Merchant Details successfully Updated", icon: "thumb_up" });
      emit("closeRejectModel");
    })
    .catch(() => { // Removed unused 'err' parameter
      $q.loading.hide();
      $q.notify({ color: "negative", message: "Error occurred", icon: "thumb_down" });
    });
}

// Placeholder methods for city/state autocomplete
function fnClrCity() {}
function fnClrState() {}
</script>