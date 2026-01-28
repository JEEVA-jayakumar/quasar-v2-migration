<template>
  <div class="col-md-7 q-px-xl">
    <div class="row gutter-md">
      <div class="col-md-8 text-center">
        <div class="col-12 q-title q-my-lg text-weight-regular">
          Existing M-ATM Plan
        </div>
      </div>

      <div class="col-md-5">
        <q-input
          v-model.trim="formData.planName"
          :error="!!$v.formData.planName.$error"
          @blur="$v.formData.planName.$touch()"
          class="text-weight-regular text-grey-8"
          color="grey-9"
          float-label="Name of the Plan*"
          placeholder="Name of the Plan*"
        />
      </div>

      <div class="col-md-5">
        <q-input
          type="number"
          v-model.number="formData.incentivePercentage"
          :error="!!$v.formData.incentivePercentage.$error"
          @blur="$v.formData.incentivePercentage.$touch()"
          float-label="Incentive Percentage *"
          color="grey-9"
        />
      </div>

      <div class="col-md-5">
        <q-input
          type="number"
          v-model.number="formData.minTxnVal"
          :error="!!$v.formData.minTxnVal.$error"
          @blur="$v.formData.minTxnVal.$touch()"
          float-label="Minimum Transaction Value*"
          color="grey-9"
        />
      </div>

      <div class="col-md-5">
        <q-input
          type="number"
          v-model.number="formData.maxIncPerTxn"
          :error="!!$v.formData.maxIncPerTxn.$error"
          @blur="$v.formData.maxIncPerTxn.$touch()"
          float-label="Maximum Incentive Per Transaction *"
          color="grey-9"
        />
      </div>
    </div>

    <div class="full-width group text-right q-mt-md">
      <q-btn flat class="bg-white text-weight-regular text-grey-8" @click="goToUsers">
        Cancel
      </q-btn>
      <q-btn color="purple-9" class="q-ml-sm" @click="submitPlans">
        Submit
      </q-btn>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";

export default {
  name: "ExistingMatmPlan",
  setup(_, { root }) {
    const $q = useQuasar();
    const store = useStore();

    const route = root.$route;

    const formData = reactive({
      planName: "",
      incentivePercentage: "",
      minTxnVal: "",
      maxIncPerTxn: "",
    });

    const propRowDetails = ref({});

    const rules = {
      formData: {
        planName: { required },
        incentivePercentage: { required, numeric },
        minTxnVal: { required, numeric },
        maxIncPerTxn: { required, numeric },
      },
    };

    const $v = useVuelidate(rules, { formData });

    // Vuex getters
    const getMatmPlanDetails = computed(() => store.getters["getMatmDatas/getMatmPlanDetails"]);
    const getInstitutionCode = computed(() => store.getters["InstitutionCode/getinstitutionCode"]);

    // Load initial data from route
    onMounted(() => {
      if (route.params.data) {
        propRowDetails.value = route.params.data;
        formData.planName = propRowDetails.value.planName || "";
        formData.incentivePercentage = propRowDetails.value.incentivePercentage || "";
        formData.minTxnVal = propRowDetails.value.minTxnVal || "";
        formData.maxIncPerTxn = propRowDetails.value.maxIncPerTxn || "";
      }
      fetchInstitutionCode();
      loadMatmPlanDetails();
    });

    // Actions
    const loadMatmPlanDetails = async () => {
      await store.dispatch("getMatmDatas/FETCH_ALL_MATM_PLAN_DETAILS");
    };

    const fetchInstitutionCode = async () => {
      await store.dispatch("InstitutionCode/INSTITUTIONCODE_FROM_FROM_MARS");
    };

    const submitPlans = async () => {
      $v.value.$touch();
      if ($v.value.$error) {
        $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
        return;
      }

      const requestParams = {
        params: { id: propRowDetails.value.deviceId?.id },
        formData: { ...formData },
      };

      try {
        await store.dispatch("updatePlanDetails/UPDATE_PLAN_DETAILS_DATAS", requestParams);
        $q.notify({ color: "positive", position: "bottom", message: "Plan has been updated successfully", icon: "thumb_up" });
      } catch {
        $q.notify({ color: "negative", position: "bottom", message: "Please try again", icon: "thumb_down" });
      }
    };

    const goToUsers = () => {
      root.$router.push("/super/admin/manage/existingmATMplan/");
    };

    return {
      formData,
      submitPlans,
      goToUsers,
      $v,
      getMatmPlanDetails,
      getInstitutionCode,
      propRowDetails,
    };
  },
};
</script>

<style scoped>
</style>
