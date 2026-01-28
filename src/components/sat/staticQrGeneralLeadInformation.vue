<template>
  <div>
    <q-dialog
      v-model="opened"
      persistent
      transition-show="scale"
      transition-hide="scale"
      @hide="emitToggleLeadInformation"
      style="min-width: 30vw;"
    >
      <q-card class="q-pa-md">
        <!-- Header -->
        <div class="row items-center bottom-border q-py-sm">
          <div class="col">QR Lead Information</div>
          <div class="col-auto">
            <q-btn
              round
              size="sm"
              outline
              color="dark"
              icon="clear"
              @click="emitToggleLeadInformation"
            />
          </div>
        </div>

        <!-- Lead Information -->
        <q-scroll-area style="width: 100%; max-width: 400px; height: 375px;">
          <q-list multiline separator class="q-body-1">
            <q-item v-for="(value, key) in leadFields" :key="key" multiline>
              <q-item-section>
                <div class="text-subtitle2">{{ value.label }}</div>
                <div class="text-body2">{{ value.display }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "QrLeadInformationModal",
  props: {
    leadInformation: { type: Object, required: true },
    propToggleLeadInformationPop: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    const opened = ref(props.propToggleLeadInformationPop);
    const propLeadInformation = reactive({ ...props.leadInformation });
    const leadFields = ref({});

    // Watch prop to update dialog open state
    watch(
      () => props.propToggleLeadInformationPop,
      (val) => {
        opened.value = val;
      }
    );

    // Vuex
    const { FETCH_STATIC_QR_SHORT_LEAD_DATA } = mapActions("iciciStaticQr", [
      "FETCH_STATIC_QR_SHORT_LEAD_DATA"
    ]);

    const { getAllStaticQrShortLeadDatas } = mapGetters("iciciStaticQr", [
      "getAllStaticQrShortLeadDatas"
    ]);

    // Emit close event
    const emitToggleLeadInformation = () => {
      emit("closeLeadInformation");
    };

    // Function to fetch lead info
    const ajaxLoadShortLeadInfo = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      try {
        await FETCH_STATIC_QR_SHORT_LEAD_DATA(props.leadInformation.leadId);
        Object.assign(propLeadInformation, getAllStaticQrShortLeadDatas);
        populateLeadFields();
      } catch (error) {

        console.error(error);
      } finally {
        $q.loading.hide();
      }
    };

    // Map lead information fields for display
    const populateLeadFields = () => {
      leadFields.value = {
        merchantName: {
          label: "Merchant Name",
          display: propLeadInformation.merchantName ?? "NA"
        },
        contactAddress: {
          label: "Address",
          display: propLeadInformation.contactAddress ?? "NA"
        },
        createdBy: {
          label: "SO Name",
          display: propLeadInformation.createdBy?.name ?? "NA"
        },
        leadSource: {
          label: "Source",
          display: propLeadInformation.leadSource?.sourceName ?? "NA"
        },
        contactName: {
          label: "Contact Name",
          display: propLeadInformation.contactName ?? "NA"
        },
        contactNumber: {
          label: "Contact Number",
          display: propLeadInformation.contactNumber ?? "NA"
        },
        contactEmail: {
          label: "Contact Email",
          display: propLeadInformation.contactEmail ?? "NA"
        },
        bankName: {
          label: "Bank Name",
          display: propLeadInformation.bankName ?? "NA"
        },
        qrLeadNumber: {
          label: "QR Lead Number",
          display: propLeadInformation.qrLeadNumber ?? "NA"
        },
        merchantIndustry: {
          label: "Merchant Industry",
          display: propLeadInformation.merchantIndustry?.industryName ?? "NA"
        },
        plan: {
          label: "Plan",
          display: propLeadInformation.plan?.planName ?? "NA"
        },
        setupFees: {
          label: "SetUp Fees",
          display: propLeadInformation.setupFees ?? "NA"
        },
        recurringFees: {
          label: "Recurring Fees",
          display: propLeadInformation.recurringFees ?? "NA"
        },
        qrMerchantType: {
          label: "Merchant Type",
          display: propLeadInformation.qrMerchantType?.qrMerchantType ?? "NA"
        },
        smallMerchantLessThanTwoDebit: {
          label: "Small Merchant < 2000 % debit Card",
          display:
            propLeadInformation.smallMerchantLessThanTwoDebit != null
              ? propLeadInformation.smallMerchantLessThanTwoDebit + "%"
              : "NA"
        },
        smallMerchantGreaterThanTwoDebit: {
          label: "Small Merchant > 2000 % debit Card",
          display:
            propLeadInformation.smallMerchantGreaterThanTwoDebit != null
              ? propLeadInformation.smallMerchantGreaterThanTwoDebit + "%"
              : "NA"
        },
        smallMerchantLessThanTwoCreditAndPrepaid: {
          label: "Small Merchant < 2000 % credit and prepaid card",
          display:
            propLeadInformation.smallMerchantLessThanTwoCreditAndPrepaid != null
              ? propLeadInformation.smallMerchantLessThanTwoCreditAndPrepaid + "%"
              : "NA"
        },
        smallMerchantGreaterThanTwoCreditAndPrepaid: {
          label: "Small Merchant > 2000 % credit and prepaid card",
          display:
            propLeadInformation.smallMerchantGreaterThanTwoCreditAndPrepaid != null
              ? propLeadInformation.smallMerchantGreaterThanTwoCreditAndPrepaid + "%"
              : "NA"
        },
        largeMerchantLessThanTwoDebit: {
          label: "Large Merchant < 2000 % debit Card",
          display:
            propLeadInformation.largeMerchantLessThanTwoDebit != null
              ? propLeadInformation.largeMerchantLessThanTwoDebit + "%"
              : "NA"
        },
        largeMerchantGreaterThanTwoDebit: {
          label: "Large Merchant > 2000 % debit Card",
          display:
            propLeadInformation.largeMerchantGreaterThanTwoDebit != null
              ? propLeadInformation.largeMerchantGreaterThanTwoDebit + "%"
              : "NA"
        },
        largeMerchantLessThanTwoCreditandPrepaid: {
          label: "Large Merchant < 2000 % credit and prepaid card",
          display:
            propLeadInformation.largeMerchantLessThanTwoCreditandPrepaid != null
              ? propLeadInformation.largeMerchantLessThanTwoCreditandPrepaid + "%"
              : "NA"
        },
        largeMerchantGreaterThanTwoCreditandPrepaid: {
          label: "Large Merchant > 2000 % credit and prepaid card",
          display:
            propLeadInformation.largeMerchantGreaterThanTwoCreditandPrepaid != null
              ? propLeadInformation.largeMerchantGreaterThanTwoCreditandPrepaid + "%"
              : "NA"
        }
      };
    };

    onMounted(() => {
      ajaxLoadShortLeadInfo();
    });

    return {
      opened,
      propLeadInformation,
      leadFields,
      emitToggleLeadInformation
    };
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>
