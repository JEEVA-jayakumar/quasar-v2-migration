<template>
  <q-dialog v-model="localShow" persistent>
    <q-card class="q-pa-lg" style="min-width: 40vw">

      <div class="text-center q-mb-md">
        <strong>Download Device History Files</strong>
      </div>

      <!-- FROM DATE -->
      <q-date
        v-model="formData.from"
        :min="yesterday"
        :max="tomorrow"
        mask="YYYY-MM-DD"
        label="From Date"
        class="q-mb-md"
      />

      <!-- TO DATE -->
      <q-date
        v-model="formData.to"
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
          @click="emitfnshowDeviceHistory"
        />
        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadHistory"
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
  name: "DownloadDeviceHistoryDialog",

  props: {
    propDeviceHistoryReport: {
      type: Boolean,
      required: true
    }
  },

  emits: ["emitfnshowDeviceHistory"],

  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    /* ------------------------------------
     * Dialog visibility sync
     * ---------------------------------- */
    const localShow = ref(props.propDeviceHistoryReport);

    watch(
      () => props.propDeviceHistoryReport,
      val => (localShow.value = val)
    );

    /* ------------------------------------
     * Date limits
     * ---------------------------------- */
    const today = new Date();
    const tomorrow = addToDate(today, { days: 0 });
    const yesterday = subtractFromDate(today, { days: 720 });

    /* ------------------------------------
     * Form data (UNCHANGED LOGIC)
     * ---------------------------------- */
    const formData = reactive({
      from: "",
      to: ""
    });

    /* ------------------------------------
     * Submit button state
     * ---------------------------------- */
    const submitDisabled = computed(() => {
      return !(formData.from && formData.to);
    });

    /* ------------------------------------
     * Close dialog
     * ---------------------------------- */
    const emitfnshowDeviceHistory = () => {
      emit("emitfnshowDeviceHistory");
    };

    /* ------------------------------------
     * Date → timestamp logic (PRESERVED)
     * ---------------------------------- */
    const toTimestamp = (strDate) => {
      const datePart = strDate;
      const curDate = new Date();
      const mnth = curDate.getMonth() + 1;
      const chDate =
        curDate.getFullYear() +
        "-" +
        (mnth < 10 ? "0" + mnth : mnth) +
        "-" +
        curDate.getDate();

      return chDate === datePart ? Date.now() : Date.parse(strDate);
    };

    /* ------------------------------------
     * Download logic (UNCHANGED)
     * ---------------------------------- */
    const downloadHistory = async () => {
      const params = {
        from: toTimestamp(formData.from),
        to: toTimestamp(formData.to)
      };

      $q.loading.show({
        spinnerColor: "purple-9",
        message: "Please wait.."
      });

      try {
        await store.dispatch(
          "DownloadInventoryDeviceHistoryReports/FETCH_PHONE_PE_INVENTORY_DEVICE_HISTORY_DATAS",
          params
        );

        emitfnshowDeviceHistory();

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Downloaded",
          icon: "thumb_up"
        });
      } catch (error) {

        const status = error?.status;

        let message = "Please select the field";

        if (status === 400)
          message = "Output file size is high, Select smaller date range";
        else if (status === 500)
          message = "INTERNAL_SERVER_ERROR";
        else if (status === 403)
          message = "please choose some another date";

        $q.notify({
          color: "amber",
          position: "bottom",
          message,
          icon: "thumb_down"
        });
      } finally {
        formData.from = "";
        formData.to = "";
        $q.loading.hide();
      }
    };

    return {
      localShow,
      tomorrow,
      yesterday,
      formData,
      submitDisabled,
      emitfnshowDeviceHistory,
      downloadHistory
    };
  }
};
</script>

<style scoped>
/* kept minimal intentionally */
</style>
