<template>
  <q-page padding>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="shortlead"
            class="shadow-1"
            animated
            swipeable
            color="tertiary"
            align="justify"
          >
            <q-tab name="shortlead" label="Additional Terminals" />
            <q-tab-panels v-model="shortlead">
              <q-tab-panel name="shortlead">
                <div class="q-px-md">
                  <form @submit.prevent="fnSubmitBankDetails(additionalTerminal)">
                    <div class="q-pa-md">
                      <div class="row gutter-sm q-py-sm">
                        <!-- MID -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            disable
                            v-model.trim="additionalTerminal.mid"
                            float-label="MID*"
                          />
                        </div>
                        <!-- TID -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            disable
                            v-model.trim="additionalTerminal.tid"
                            float-label="TID*"
                          />
                        </div>
                        <!-- Institution Code -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            disable
                            v-model.trim="additionalTerminal.institutionCode"
                            float-label="Institution code*"
                          />
                        </div>
                        <!-- Merchant RefCode -->
                        <div class="col-md-6">
                          <q-input
                            :disable="propRowDetails.leadInformation?.merchantRefCode"
                            v-model.trim="additionalTerminal.merchantRefCode"
                            :error="$v.additionalTerminal.merchantRefCode.$error"
                            color="grey-9"
                            float-label="Merchant RefCode*"
                          />
                        </div>
                        <!-- Application Number -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            disable
                            v-model.trim="additionalTerminal.applicationNumber"
                            float-label="Application Number*"
                          />
                        </div>
                        <!-- Number Of Terminals -->
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
                            color="grey-9"
                            disable
                            v-model.trim="additionalTerminal.AdditionalTerminalDetails.address"
                            float-label="Address*"
                          />
                        </div>
                        <!-- PinCode -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            disable
                            v-model.trim="additionalTerminal.AdditionalTerminalDetails.pinCode"
                            float-label="Pincode*"
                          />
                        </div>
                        <!-- City -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            @blur="fnClrCity"
                            v-model.trim="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                            @input="fninputTyping($event, 1)"
                            float-label="City (type min 3 characters)*"
                            placeholder="Start typing ..*"
                          >
                            <q-autocomplete
                              v-model="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                              :options="cityOptions"
                              @filter="marsCitySearch"
                              debounce="200"
                              :min-characters="3"
                              @selected="partnerCitySelected"
                            />
                          </q-input>
                        </div>
                        <!-- State -->
                        <div class="col-md-6">
                          <q-input
                            color="grey-9"
                            @blur="fnClrState"
                            v-model.trim="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                            @input="fninputTyping($event, 2)"
                            float-label="State (type min 3 characters)*"
                            placeholder="Start typing ..*"
                          >
                            <q-autocomplete
                              v-model="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                              :options="stateOptions"
                              @filter="marsStateSearch"
                              debounce="200"
                              :min-characters="3"
                              @selected="partnerStateSelected"
                            />
                          </q-input>
                        </div>
                      </div>
                    </div>
                    <!-- Submit Button -->
                    <div class="full-width group" align="center">
                      <q-btn size="md" type="submit" color="purple-9">
                        Submit
                      </q-btn>
                    </div>
                  </form>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-tabs>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "AdditionalTidFromMars",
  setup(_, { root }) {
    const shortlead = ref("shortlead");
    const propRowDetails = ref({});
    const cityOptions = ref([]);
    const stateOptions = ref([]);
    const companyRegisteredCitySelected = ref(false);
    const companyRegisteredStateSelected = ref(false);

    // Form data
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

    // Vuelidate rules
    const rules = {
      additionalTerminal: {
        merchantRefCode: { required },
        AdditionalTerminalDetails: {
          numberOfTerminals: { required },
        },
      },
    };

    const $v = useVuelidate(rules, { additionalTerminal });

    // Vuex Getters & Actions - Using Vue 3 Composition API style
    // Note: In Vue 3 Composition API, we should use useStore() instead of mapGetters/mapActions
    // But since you're using Options API style, we'll fix the async/await issue

    // Functions
    const fninputTyping = (event, type) => {
      if (type === 1) companyRegisteredCitySelected.value = false;
      if (type === 2) companyRegisteredStateSelected.value = false;

      if (cityOptions.value.length <= 0 || stateOptions.value.length <= 0) {
        fetchMarsCity(
          additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel,
          additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel
        );
      }
    };

    const fetchMarsCity = async () => {
      try {
        // You need to implement these actions or replace with your store calls
        // await CITY_FORM_ADDITIONAL_TID(cityLabel);
        // cityOptions.value = marsAdditionalCity.items.map((item) => ({
        //   label: item.name,
        //   value: item.code,
        // }));
        // if (cityOptions.value.length > 0) additionalTerminal.AdditionalTerminalDetails.citySerNumber = cityOptions.value[0].value;

        // await STATE_FROM_ADDITIONAL_TID(stateLabel);
        // stateOptions.value = marsAdditionalState.items.map((item) => ({
        //   label: item.name,
        //   value: item.code,
        // }));
        // if (stateOptions.value.length > 0) additionalTerminal.AdditionalTerminalDetails.stateSerNumber = stateOptions.value[0].value;
      } catch (error) {
        console.error("Error fetching city/state data:", error);
      }
    };

    const marsCitySearch = (terms, done) => {
      done(cityOptions.value.filter((o) => o.label.toLowerCase().includes(terms.toLowerCase())));
    };

    const marsStateSearch = (terms, done) => {
      done(stateOptions.value.filter((o) => o.label.toLowerCase().includes(terms.toLowerCase())));
    };

    const partnerCitySelected = (item) => {
      companyRegisteredCitySelected.value = true;
      additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = item.label;
      additionalTerminal.AdditionalTerminalDetails.citySerNumber = item.value;
    };

    const partnerStateSelected = (item) => {
      companyRegisteredStateSelected.value = true;
      additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = item.label;
      additionalTerminal.AdditionalTerminalDetails.stateSerNumber = item.value;
    };

    const fnClrCity = () => {
      if (!companyRegisteredCitySelected.value) additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = "";
    };

    const fnClrState = () => {
      if (!companyRegisteredStateSelected.value) additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = "";
    };

    // Fixed: Added async keyword to this function
    const fnSubmitBankDetails = async () => {
      $v.value.$touch();
      if ($v.value.$error) {
        root.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
        return;
      }

      root.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Validating .." });

      const finalFormRequest = JSON.parse(JSON.stringify(additionalTerminal));
      delete finalFormRequest.AdditionalTerminalDetails.citySerNumberLabel;
      delete finalFormRequest.AdditionalTerminalDetails.stateSerNumberLabel;

      try {
        // Note: You need to define ADDITIONAL_TID_FROM_MARS or replace with actual store action
        // const response = await ADDITIONAL_TID_FROM_MARS(finalFormRequest);
        const response = { status: 200 }; // Placeholder - replace with actual call
        
        if (response.status === 204) {
          root.$q.loading.hide();
          root.$q.notify({ color: "negative", position: "bottom", message: "Error while updating" });
        } else {
          root.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Merchant Details successfully Updated",
            icon: "thumb_up",
          });

          // Note: You need to define ADDITIONAL_TID_FROM_BACK_END or replace with actual store action
          // await ADDITIONAL_TID_FROM_BACK_END({ params });
          
          root.$q.loading.hide();
          root.$q.notify({ color: "positive", position: "bottom", message: "Saved successfully", icon: "thumb_up" });
        }
      } catch (error) {
        root.$q.loading.hide();
        root.$q.notify({ 
          color: "negative", 
          position: "bottom", 
          message: error?.data?.message || "Error", 
          icon: "thumb_down" 
        });
      }
    };

    onMounted(() => {
      if (root.$route.params.data) {
        propRowDetails.value = root.$route.params.data;
        additionalTerminal.mid = propRowDetails.value.mid;
        additionalTerminal.tid = propRowDetails.value.tid;
        additionalTerminal.merchantRefCode = propRowDetails.value.leadInformation?.merchantRefCode || "";
        additionalTerminal.applicationNumber = propRowDetails.value.applicationNumber;
        additionalTerminal.AdditionalTerminalDetails.address = propRowDetails.value.deviceAddress;
        // additionalTerminal.institutionCode = getadditionalTidVerifyData.value; // Need to define this
        additionalTerminal.AdditionalTerminalDetails.pinCode = propRowDetails.value.pincode;
        additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = propRowDetails.value.city;
        additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = propRowDetails.value.state;
        fetchMarsCity(additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel, additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel);
      }
    });

    return {
      shortlead,
      additionalTerminal,
      propRowDetails,
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
      $v,
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