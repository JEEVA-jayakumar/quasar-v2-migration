<template>
  <q-page class="text-grey-9">
    <div class="row bottom-border q-pa-sm items-center">
      <div class="col">
        <q-tabs
          v-model="shortlead"
          class="shadow-1"
          animated
          swipeable
          color="tertiary"
          glossy
          align="justify"
        >
          <q-tab name="shortlead" label="Additional Terminals" />
        </q-tabs>

        <q-tab-panels v-model="shortlead">
          <q-tab-panel name="shortlead">
            <div class="q-my-md col-md-6" align="right">
              <div class="col group"></div>
            </div>

            <form @submit.prevent="fnSubmitBankDetails(additionalTerminal)">
              <div class="q-px-md">
                <div class="q-pa-md">
                  <div class="row gutter-sm q-py-sm">

                    <!-- MID -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.mid"
                        disable
                        color="grey-9"
                        float-label="MID*"
                      />
                    </div>

                    <!-- TID -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.tid"
                        disable
                        color="grey-9"
                        float-label="TID*"
                      />
                    </div>

                    <!-- Institution Code -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.institutionCode"
                        disable
                        color="grey-9"
                        float-label="Institution code*"
                      />
                    </div>

                    <!-- Merchant RefCode -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.merchantRefCode"
                        :disable="!!propRowDetails.leadInformation?.merchantRefCode"
                        :error="$v.additionalTerminal.merchantRefCode.$error"
                        color="grey-9"
                        float-label="Merchant RefCode*"
                      />
                    </div>

                    <!-- Application Number -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.applicationNumber"
                        disable
                        color="grey-9"
                        float-label="Application Number*"
                      />
                    </div>

                    <!-- Number of Terminals -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.AdditionalTerminalDetails.numberOfTerminals"
                        @blur="$v.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals.$touch()"
                        :error="$v.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals.$error"
                        color="grey-9"
                        float-label="*Number Of Terminals"
                        placeholder="Number Of Terminals"
                      />
                    </div>

                    <!-- Address -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.AdditionalTerminalDetails.address"
                        disable
                        color="grey-9"
                        float-label="Address*"
                      />
                    </div>

                    <!-- PinCode -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.AdditionalTerminalDetails.pinCode"
                        disable
                        color="grey-9"
                        float-label="Pincode*"
                      />
                    </div>

                    <!-- City Autocomplete -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                        @blur="fnClrCity"
                        @input="fninputTyping($event, 1)"
                        color="grey-9"
                        float-label="City (type min 3 characters)*"
                        placeholder="Start typing ..*"
                      >
                        <q-autocomplete
                          v-model="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                          :options="cityOptions"
                          :min-characters="3"
                          :debounce="300"
                          @filter="marsCitySearch"
                          @update:model-value="partnerCitySelected"
                        />
                      </q-input>
                    </div>

                    <!-- State Autocomplete -->
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                        @blur="fnClrState"
                        @input="fninputTyping($event, 2)"
                        color="grey-9"
                        float-label="State (type min 3 characters)*"
                        placeholder="Start typing ..*"
                      >
                        <q-autocomplete
                          v-model="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                          :options="stateOptions"
                          :min-characters="3"
                          :debounce="300"
                          @filter="marsStateSearch"
                          @update:model-value="partnerStateSelected"
                        />
                      </q-input>
                    </div>

                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="full-width group" align="center">
                <q-btn size="md" color="purple-9" label="Submit" type="submit" />
              </div>
            </form>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import _ from "lodash";

export default {
  name: "AdditionalTidFromMars",
  setup(props, { root }) {
    const $q = useQuasar();

    // Reactive Data
    const shortlead = ref("shortlead");
    const propRowDetails = ref({});
    const cityOptions = ref([]);
    const stateOptions = ref([]);
    const companyRegisteredCitySelected = ref(false);
    const companyRegisteredStateSelected = ref(false);

    const additionalTerminal = reactive({
      institutionCode: "",
      merchantRefCode: "",
      applicationNumber: "",
      mid: "",
      tid: "",
      AdditionalTerminalDetails: {
        numberOfTerminals: "",
        citySerNumber: "",
        citySerNumberLabel: "",
        stateSerNumberLabel: "",
        stateSerNumber: "",
        pinCode: "",
        address: "",
      },
    });

    // Vuelidate
    const rules = {
      additionalTerminal: {
        merchantRefCode: { required },
        AdditionalTerminalDetails: {
          numberOfTerminals: { required },
        },
      },
    };
    const v$ = useVuelidate(rules, { additionalTerminal });

    // Vuex
    const getters = root.$store.getters;
    const actions = root.$store.dispatch;

    // Methods
    const fninputTyping = (event, type) => {
      if (type === 1) companyRegisteredCitySelected.value = false;
      if (type === 2) companyRegisteredStateSelected.value = false;
      if (!cityOptions.value.length || !stateOptions.value.length) {
        fetchMarsCity(additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel, additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel);
      }
    };

    const fetchMarsCity = async (cityLabel, stateLabel) => {
      await actions("mars_additional_city/CITY_FORM_ADDITIONAL_TID", cityLabel);
      cityOptions.value = getters.marsAdditionalCity.items.map((oo) => ({
        label: oo.name,
        value: oo.code,
      }));
      additionalTerminal.AdditionalTerminalDetails.citySerNumber = cityOptions.value[0]?.value || "";

      await actions("mars_additional_state/STATE_FROM_ADDITIONAL_TID", stateLabel);
      stateOptions.value = getters.marsAdditionalState.items.map((oo) => ({
        label: oo.name,
        value: oo.code,
      }));
      additionalTerminal.AdditionalTerminalDetails.stateSerNumber = stateOptions.value[0]?.value || "";
    };

    const marsCitySearch = (terms, done) => {
      done(_.filter(cityOptions.value, (o) => o.label.toLowerCase().includes(terms.toLowerCase())));
    };

    const marsStateSearch = (terms, done) => {
      done(_.filter(stateOptions.value, (o) => o.label.toLowerCase().includes(terms.toLowerCase())));
    };

    const partnerCitySelected = (item) => {
      companyRegisteredCitySelected.value = true;
      additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = item.label;
      additionalTerminal.AdditionalTerminalDetails.citySerNumber = item.value;
    };

    const fnClrCity = () => {
      if (!companyRegisteredCitySelected.value)
        additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = "";
    };

    const partnerStateSelected = (item) => {
      companyRegisteredStateSelected.value = true;
      additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = item.label;
      additionalTerminal.AdditionalTerminalDetails.stateSerNumber = item.value;
    };

    const fnClrState = () => {
      if (!companyRegisteredStateSelected.value)
        additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = "";
    };

    const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
      return _.filter(arraySet, (oo) => oo.label.toLowerCase().includes(terms.toLowerCase()) || oo.value.toString().includes(terms.toString()));
    };

    const fnSubmitBankDetails = async (request) => {
      v$.value.$touch();
      if (v$.value.$error) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
        return;
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Validating ..",
      });

      const finalFormRequest = { additionalTerminal: { ...request } };
      delete finalFormRequest.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel;
      delete finalFormRequest.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel;

      try {
        const response = await actions("mars_additional_tid/ADDITIONAL_TID_FROM_MARS", finalFormRequest);
        if (response.status === 204) {
          $q.notify({ type: "warning", color: "amber-9", position: "bottom", message: response.data.message });
        } else {
          $q.notify({ color: "positive", position: "bottom", message: "Merchant Details successfully Updated", icon: "thumb_up" });
          await actions("mars_additional_tid/ADDITIONAL_TID_FROM_BACK_END", { params: { Id: { leadId: propRowDetails.value.leadInformation.id }, Count: { count: additionalTerminal.AdditionalTerminalDetails.numberOfTerminals }, Datas: finalFormRequest } });
          $q.notify({ color: "positive", position: "bottom", message: "Saved successfully", icon: "thumb_up" });
        }
      } catch (error) {

        $q.notify({ color: "negative", position: "bottom", message: error?.data?.message || "Error occurred", icon: "thumb_down" });
      } finally {
        $q.loading.hide();
      }
    };

    onBeforeMount(() => {
      const data = root.$route.params.data;
      if (data) {
        propRowDetails.value = data;
        additionalTerminal.mid = data.mid;
        additionalTerminal.tid = data.tid;
        additionalTerminal.merchantRefCode = data.leadInformation?.merchantRefCode;
        additionalTerminal.applicationNumber = data.applicationNumber;
        additionalTerminal.AdditionalTerminalDetails.address = data.deviceAddress;
        additionalTerminal.institutionCode = getters.getadditionalTidVerifyData;
        additionalTerminal.AdditionalTerminalDetails.pinCode = data.pincode;
        additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = data.city;
        additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = data.state;
        fetchMarsCity(additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel, additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel);
      }
    });

    return {
      shortlead,
      propRowDetails,
      additionalTerminal,
      cityOptions,
      stateOptions,
      fninputTyping,
      fnClrCity,
      fnClrState,
      partnerCitySelected,
      partnerStateSelected,
      marsCitySearch,
      marsStateSearch,
      fnSubmitBankDetails,
      COMMON_FILTER_FUNCTION,
      v$,
    };
  },
};
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
