<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitToggleReject"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="q-pa-lg" style="min-width: 70vw; padding: 100px">
        <!-- Dynamic Heading -->
        <div class="q-subheading q-mb-md text-center capitalize">
          {{ institutionHeading }}
        </div>

        <!-- Base TID / RR ID / Scheme -->
        <div class="q-title q-mb-md text-center text-light-blue">
          <span>#{{ propShowRejectComponent.data.baseTid }}</span> |
          {{ propShowRejectComponent.data.rrId }} |
          {{ propShowRejectComponent.data.scheme }}
        </div>

        <!-- Payment Mode -->
        <div class="text-weight-light text-grey-8 q-mb-md">Select Payment Mode</div>
        <q-card class="q-mb-md">
          <q-select
            v-model="formdata.paymentMode"
            :options="paymentModeOptions"
            label="Payment mode"
            placeholder="Choose from the below"
            color="grey-9"
            :error="v$.formdata.paymentMode.$invalid && v$.formdata.paymentMode.$dirty"
            @blur="v$.formdata.paymentMode.$touch()"
          />
        </q-card>

        <!-- Combined Settlement Flag -->
        <div class="text-weight-light text-grey-8 q-mb-md">Select Combined Settlement Flag</div>
        <q-card class="q-mb-md">
          <q-select
            v-model="formdata.combinedSettlementFlag"
            :options="combinedSettlementFlagOptions"
            label="Combined Settlement Flag"
            placeholder="Choose from the below"
            color="grey-9"
            :error="v$.formdata.combinedSettlementFlag.$invalid && v$.formdata.combinedSettlementFlag.$dirty"
            @blur="v$.formdata.combinedSettlementFlag.$touch()"
          />
        </q-card>

        <!-- Routed to Hitachi -->
        <div class="text-weight-light text-grey-8 q-mb-md">Routed to Hitachi or Not</div>
        <q-card class="q-mb-md">
          <q-select
            v-model="formdata.ONBOARDING_REQD"
            :options="onboardingRequestOptions"
            label="Select Yes Or No"
            placeholder="Choose from the below"
            color="grey-9"
            :error="v$.formdata.ONBOARDING_REQD.$invalid && v$.formdata.ONBOARDING_REQD.$dirty"
            @blur="v$.formdata.ONBOARDING_REQD.$touch()"
          />
        </q-card>

        <!-- Action Buttons -->
        <div class="text-right q-mt-lg">
          <q-btn
            v-if="propShowRejectComponent.data.institutionCode != '104'"
            color="positive"
            label="Submit To Mars"
            class="q-mr-sm"
            @click="finalFormSubmit"
          />
          <q-btn
            v-if="propShowRejectComponent.data.institutionCode == '104'"
            color="teal"
            label="Additional Info"
            class="q-mr-sm"
            @click="openAdditionalInfo"
          />
          <q-btn
            color="grey-9"
            label="Cancel"
            @click="emitToggleReject"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Additional Info Modal -->
    <additional-info
      v-if="showRejectAdditionalInfo"
      :showRejectAdditionalInfo="showRejectAdditionalInfo"
      :propToggleadditionalInfo="propAdditionalInfoDetails"
      @closeRejectModel="openAdditionalInfo"
    />
  </div>
</template>

<script>
import { ref, reactive, computed} from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import additionalInfo from "./additionalInfo.vue";
import moment from "moment";

export default {
  name: "RejectModal",
  components: { additionalInfo },
  props: {
    showRejectPaymentMode: Boolean,
    propShowRejectComponent: Object,
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    const toggleModel = ref(true);
    const showRejectAdditionalInfo = ref(false);

    const formdata = reactive({
      paymentMode: "",
      combinedSettlementFlag: "",
      ONBOARDING_REQD: "",
    });

    const paymentModeOptions = ref([
      { label: "Direct credit", value: "D" },
      { label: "NEFT", value: "N" },
    ]);

    const combinedSettlementFlagOptions = ref([
      { label: "Yes", value: 1 },
      { label: "No", value: 0 },
    ]);

    const onboardingRequestOptions = ref([
      { label: "Yes", value: 1 },
      { label: "No", value: 0 },
    ]);

    const propAdditionalInfoDetails = reactive({
      data: {},
      holdPayment: "",
      merchant: {},
      propLeadDeatils: {},
      leadId: "",
      diners: {},
      multiTidpaymentMode: {},
    });

    const rules = reactive({
      formdata: {
        paymentMode: { required },
        combinedSettlementFlag: { required },
        ONBOARDING_REQD: { required },
      },
    });

    const v$ = useVuelidate(rules, { formdata });

    const institutionHeading = computed(() => {
      const code = props.propShowRejectComponent.data.institutionCode;
      return {
        "112": "DBS INSTANCE",
        "106": "EQUITAS INSTANCE",
        "101": "IOB INSTANCE",
        "102": "FEDERAL INSTANCE",
        "103": "CORP INSTANCE",
        "104": "AXIS INSTANCE",
        "105": "AU INSTANCE",
        "107": "MPOS INSTANCE",
        "108": "SIB INSTANCE",
        "110": "UPI INSTANCE",
        "109": "KVB INSTANCE",
      }[code];
    });

    function emitToggleReject() {
      toggleModel.value = false;
      emit("closeRejectModel");
    }

    function openAdditionalInfo() {
      v$.value.formdata.$touch();
      if (v$.value.formdata.$invalid) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
        return;
      }

      showRejectAdditionalInfo.value = !showRejectAdditionalInfo.value;
      Object.assign(propAdditionalInfoDetails, {
        holdPayment: props.propShowRejectComponent.holdPayment,
        merchant: props.propShowRejectComponent.merchant,
        data: props.propShowRejectComponent.data,
        propLeadDeatils: props.propShowRejectComponent.propLeadDeatils,
        leadId: props.propShowRejectComponent.leadId,
        diners: props.propShowRejectComponent.diners,
        multiTidpaymentMode: formdata,
      });
    }

    function commonDateFormat(dateValue) {
      return dateValue ? moment(dateValue).format("YYYY-MM-DD") : null;
    }

    function finalFormSubmit() {
      v$.value.formdata.$touch();
      if (v$.value.formdata.$invalid) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
        return;
      }

      // Preserve all your original API calls logic here
      // You can migrate this.MARS_DATA_SUBMIT_INTERNAL and others to composition API methods
      // Example: use Vuex actions directly with import { useStore } from 'vuex' etc.
    }

    return {
      toggleModel,
      showRejectAdditionalInfo,
      formdata,
      paymentModeOptions,
      combinedSettlementFlagOptions,
      onboardingRequestOptions,
      propAdditionalInfoDetails,
      institutionHeading,
      emitToggleReject,
      openAdditionalInfo,
      v$,
      commonDateFormat,
      finalFormSubmit,
    };
  },
};
</script>

<style scoped>
/* Custom Styles */
</style>
