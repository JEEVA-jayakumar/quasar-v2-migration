<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitToggleReject"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 70vw; padding: 100px;">
        <div class="q-title q-px-lg q-py-md text-center text-weight-regular bottom-border text-grey-9">
          <div class="col q-title">Additional Info</div>
        </div>

        <q-card-section>
          <div class="row gutter-sm q-py-sm">
            <!-- Zone -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.branchZone"
                :options="getAllZone"
                float-label="Zone*"
                @blur="v$.formdata.branchZone.$touch()"
                :error="v$.formdata.branchZone.$error"
                @clear="fnClearZone"
                @update:model-value="fnFetchZone"
              />
            </div>

            <!-- IA District -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.iaDistrict"
                :options="getAllDistrict"
                float-label="IA_District*"
                @blur="v$.formdata.iaDistrict.$touch()"
                :error="v$.formdata.iaDistrict.$error"
                @update:model-value="fnFetchBranchName"
              />
            </div>

            <!-- RA District -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.raDistrict"
                :options="getAllDistrict"
                float-label="RA_District*"
                disable
              />
            </div>

            <!-- OD1 District -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.od1District"
                :options="getAllDistrict"
                float-label="OD1_District*"
                disable
              />
            </div>

            <!-- OD2 District -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.od2District"
                :options="getAllDistrict"
                float-label="OD2_District*"
                disable
              />
            </div>

            <!-- Installation Branch -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.installationBranchCode"
                :options="getAllBranchName"
                float-label="InstallationBranchName*"
                @blur="v$.formdata.installationBranchCode.$touch()"
                :error="v$.formdata.installationBranchCode.$error"
              />
            </div>

            <!-- IOR State -->
            <div class="col-md-6">
              <q-input
                placeholder="Start typing ..*"
                color="grey-9"
                v-model.trim="formdata.lorState"
                float-label="IOR_STATE(type min 3 characters)*"
                @blur="v$.formdata.lorState.$touch()"
              >
                <q-autocomplete
                  :debounce="10"
                  :min-characters="3"
                  @search="searchIorState"
                />
              </q-input>
            </div>

            <!-- Pincode -->
            <div class="col-md-6">
              <q-input
                placeholder="Start typing ..*"
                color="grey-9"
                v-model.trim="formdata.pin"
                float-label="Pincode"
                @blur="v$.formdata.pin.$touch()"
                :error="v$.formdata.pin.$error"
                @update:model-value="pincodeBasedDistrict"
              >
                <q-autocomplete
                  :min-characters="3"
                  @search="searchAxisBankPincode"
                />
              </q-input>
            </div>

            <!-- State -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.state"
                :options="getPincodeBasedDistrict"
                float-label="State*"
                @update:model-value="pincodeandDistrictBasedCity"
              />
            </div>

            <!-- City -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.city"
                :options="getPincodeDistrict"
                float-label="City*"
                @blur="v$.formdata.city.$touch()"
                :error="v$.formdata.city.$error"
                @update:model-value="citybasedlocation"
              />
            </div>

            <!-- IA Location -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.iaLocation"
                float-label="IA_LOCATION*"
                :options="getCityBasedLocation"
              />
            </div>

            <!-- IA Salutation -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.iaSalutation"
                float-label="IA_Salution*"
                :options="iaSalutationOptions"
              />
            </div>

            <!-- IA Gender -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.iaGender"
                float-label="IA_Gender*"
                :options="iaGenderOptions"
              />
            </div>

            <!-- OD1 Salutation -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.od1Salutation"
                float-label="OD1_Salutation*"
                :options="od1SalutationOptions"
              />
            </div>

            <!-- OD1 Gender -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.od1Gender"
                float-label="OD1_Gender*"
                :options="od1GenderOptions"
              />
            </div>

            <!-- OD2 Salutation -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.od2Salutation"
                float-label="OD2_Salutation*"
                :options="od2SalutationOptions"
              />
            </div>

            <!-- OD2 Gender -->
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.od2Gender"
                float-label="OD2_Gender*"
                :options="od2GenderOptions"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="positive" label="Submit To Mars" @click="finalFormSubmit" />
          <q-btn color="grey-9" label="Cancel" @click="emitToggleReject" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

export default {
  props: ["showRejectAdditionalInfo", "propToggleadditionalInfo"],

  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const toggleModel = ref(props.propToggleadditionalInfo);

    const formdata = reactive({
      installationBranchCode: "",
      iaLocation: "",
      iaDistrict: "",
      branchZone: "",
      raDistrict: "",
      od1District: "",
      od2District: "",
      lorState: "",
      iaSalutation: "",
      iaGender: "",
      od1Salutation: "",
      od1Gender: "",
      od2Salutation: "",
      od2Gender: "",
      state: "",
      city: "",
      pin: "",
    });

    // Vuelidate setup
    const rules = {
      formdata: {
        branchZone: { required },
        city: { required },
        iaDistrict: { required },
        installationBranchCode: { required },
        lorState: { required },
        pin: { required },
      },
    };

    const v$ = useVuelidate(rules, { formdata });

    // Options
    const iaSalutationOptions = [
      { label: "MR", value: "Mr" },
      { label: "MRS", value: "Mrs" },
      { label: "Ms", value: "Ms" },
    ];
    const iaGenderOptions = [
      { label: "Male", value: "M" },
      { label: "FeMale", value: "F" },
      { label: "Transgender", value: "T" },
    ];

    const od1SalutationOptions = iaSalutationOptions;
    const od1GenderOptions = iaGenderOptions;
    const od2SalutationOptions = iaSalutationOptions;
    const od2GenderOptions = iaGenderOptions;

    // Computed getters from Vuex
    const getAllDistrict = computed(() => store.getters["District/getAllDistrict"]);
    const getAllBranchName = computed(() => store.getters["BranchName/getAllBranchName"]);
    const getPincodeBasedDistrict = computed(() => store.getters["PincodeBasedDistrict/getPincodeBasedDistrict"]);
    const getAllZone = computed(() => store.getters["AllZone/getAllZone"]);
    const getPincodeDistrict = computed(() => store.getters["StateBasedDistrict/getPincodeDistrict"]);
    const getiorState = computed(() => store.getters["StateName/getiorState"]);
    const getAxisBankPincode = computed(() => store.getters["AxisBankPincode/getAxisBankPincode"]);
    const getCityBasedLocation = computed(() => store.getters["CityBasedLocation/getCityBasedLocation"]);

   

    // Lifecycle hooks
    onMounted(() => {
      store.dispatch("AllZone/FETCH_ALL_ZONE");
      store.dispatch("District/FETCH_ALL_DISTRICT");
      store.dispatch("InstitutionCode/INSTITUTIONCODE_FROM_FROM_MARS");
    });

    // Methods
    const emitToggleReject = () => emit("closeRejectModel");

    const fnClearZone = () => (formdata.branchZone = "");

    const fnFetchZone = () => store.dispatch("District/FETCH_ALL_DISTRICT", formdata.branchZone);

    const fnFetchBranchName = () => {
      store.dispatch("BranchName/FECTCH_ALL_BRANCH", formdata.iaDistrict);
      formdata.raDistrict = formdata.iaDistrict;
      formdata.od1District = formdata.iaDistrict;
      formdata.od2District = formdata.iaDistrict;
    };

    const searchIorState = (request, done) => {
      store.dispatch("StateName/FETCH_IOR_STATE", request).then(() => done(getiorState.value));
    };

    const citybasedlocation = () => {
      store.dispatch("CityBasedLocation/FETCH_AXIS_BANK_CITY_LOCATION", formdata.city);
    };

    const searchAxisBankPincode = (request, done) => {
      store.dispatch("AxisBankPincode/FETCH_AXIS_BANK_PINCODE_LOCATION", request).then(() => done(getAxisBankPincode.value));
    };

    const pincodeBasedDistrict = () => {
      store.dispatch("PincodeBasedDistrict/FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT", formdata.pin);
    };

    const pincodeandDistrictBasedCity = () => {
      store.dispatch("StateBasedDistrict/FETCH_AXIS_BANK_PINCODE_DISTRICT", `${formdata.pin}/${formdata.state}`);
    };

    const finalFormSubmit = async () => {
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
      // Add your existing finalFormSubmit logic here
      // Make sure to replace this.$q.loading and this.MARS_DATA_SUBMIT_INTERNAL with $q and store.dispatch
    };

    return {
      toggleModel,
      formdata,
      v$,
      iaSalutationOptions,
      iaGenderOptions,
      od1SalutationOptions,
      od1GenderOptions,
      od2SalutationOptions,
      od2GenderOptions,
      getAllDistrict,
      getAllBranchName,
      getPincodeBasedDistrict,
      getAllZone,
      getPincodeDistrict,
      getiorState,
      getAxisBankPincode,
      getCityBasedLocation,
      emitToggleReject,
      fnClearZone,
      fnFetchZone,
      fnFetchBranchName,
      searchIorState,
      citybasedlocation,
      searchAxisBankPincode,
      pincodeBasedDistrict,
      pincodeandDistrictBasedCity,
      finalFormSubmit,
    };
  },
};
</script>
