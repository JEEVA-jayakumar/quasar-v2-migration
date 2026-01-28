<template>
  <q-dialog v-model="localShow" persistent>
    <q-card class="q-pa-lg" style="min-width: 40vw">

      <div class="text-center q-mb-md">
        <strong>Download Aggregator Inventory Merchant File</strong>
      </div>

      <!-- FROM DATE -->
      <q-date
        v-model="formData.fromDate"
        :min="yesterday"
        :max="tomorrow"
        mask="YYYY-MM-DD"
        label="From Date"
        class="q-mb-md"
      />

      <!-- TO DATE -->
      <q-date
        v-model="formData.toDate"
        :min="yesterday"
        :max="tomorrow"
        mask="YYYY-MM-DD"
        label="To Date"
        class="q-mb-md"
      />

      <!-- ACTION BUTTONS -->
      <div class="row justify-end q-gutter-sm">
        <q-btn
          flat
          label="Cancel"
          color="grey-8"
          @click="emitfnshowInventoryWithMerchant"
        />
        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadInventoryWithMerchant"
        />
      </div>

    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";

const { addToDate, subtractFromDate } = date;

export default {
  name: "DownloadAggregatorInventoryMerchantDialog",

  props: {
    propInventoryWithMerchant: {
      type: Boolean,
      required: true
    },
    propData: {
      type: Object,
      required: false
    }
  },

  emits: ["emitfnshowInventoryWithMerchant"],

  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    /* ------------------------------------
     * Dialog visibility sync
     * ---------------------------------- */
    const localShow = ref(props.propInventoryWithMerchant);

    watch(
      () => props.propInventoryWithMerchant,
      val => (localShow.value = val)
    );

    /* ------------------------------------
     * Date limits (unchanged logic)
     * ---------------------------------- */
    const today = new Date();
    const tomorrow = addToDate(today, { days: 0 });
    const yesterday = subtractFromDate(today, { days: 7720 });

    /* ------------------------------------
     * Form data
     * ---------------------------------- */
    const formData = reactive({
      fromDate: "",
      toDate: ""
    });

    /* ------------------------------------
     * Submit button logic (unchanged)
     * ---------------------------------- */
    const submitDisabled = computed(() => {
      return !(
        formData.fromDate ||
        formData.toDate ||
        (!formData.fromDate && !formData.toDate)
      );
    });

    /* ------------------------------------
     * Close dialog
     * ---------------------------------- */
    const emitfnshowInventoryWithMerchant = () => {
      emit("emitfnshowInventoryWithMerchant");
    };

    /* ------------------------------------
     * Timestamp logic (PRESERVED)
     * ---------------------------------- */
    const toTimestamp = (strDate) => {
      const dateOnly = strDate;
      const curDate = new Date();
      const mnth = curDate.getMonth() + 1;
      const chDate =
        curDate.getFullYear() +
        "-" +
        (mnth < 10 ? "0" + mnth : mnth) +
        "-" +
        curDate.getDate();

      return chDate === dateOnly ? Date.now() : Date.parse(strDate);
    };

    /* ------------------------------------
     * Download logic (UNCHANGED)
     * ---------------------------------- */
    const downloadInventoryWithMerchant = async () => {
      let params = {
        fromDate: toTimestamp(formData.fromDate),
        toDate: toTimestamp(formData.toDate)
      };

      if (params.fromDate === params.toDate) {
        const d = new Date(params.toDate);
        d.setHours(d.getHours() + 12);
        params.toDate = d;
      }

      $q.loading.show({
        spinnerColor: "purple-9",
        message: "Please wait.."
      });

      try {
        await store.dispatch(
          "DownloadInventoryMerchantReports/FETCH_AGGREGATORS_INVENTORY_WITH_MERCHANT_ALL_DATAS",
          params
        );

        emitfnshowInventoryWithMerchant();

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Downloaded",
          icon: "thumb_up"
        });
      } catch (error) {

        let message = "Please select the field";

        if (error?.status === 400)
          message = "Output file size is high, Select smaller date range";
        else if (error?.status === 500)
          message = "INTERNAL_SERVER_ERROR";
        else if (error?.status === 403 || error?.status === 404)
          message = "please choose some another date";

        $q.notify({
          color: "amber",
          position: "bottom",
          message,
          icon: "thumb_down"
        });
      } finally {
        formData.fromDate = "";
        formData.toDate = "";
        $q.loading.hide();
      }
    };

    return {
      localShow,
      tomorrow,
      yesterday,
      formData,
      submitDisabled,
      emitfnshowInventoryWithMerchant,
      downloadInventoryWithMerchant
    };
  }
};
</script>

<style scoped>
/* kept intentionally minimal */
</style>
