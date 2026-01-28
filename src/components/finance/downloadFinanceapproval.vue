<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      :content-class="'q-pa-md'"
      :maximized="false"
      :max-width="'40vw'"
    >
      <q-card>
        <q-card-section class="q-pa-md column">
          <div class="q-title text-center text-weight-regular mb-md">
            <strong>Download Finance Approval Tracker File</strong>
          </div>

          <q-input
            filled
            v-model="formData.fromDate"
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
            label="From Date"
            type="date"
            :min="yesterday"
            :max="tomorrow"
            class="q-mb-md"
          />

          <q-input
            filled
            v-model="formData.toDate"
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
            label="To Date"
            type="date"
            :min="yesterday"
            :max="tomorrow"
            class="q-mb-md"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              flat
              color="grey-8"
              class="bg-white text-weight-regular"
              label="Cancel"
              @click="emitClose"
            />
            <q-btn
              color="purple-9"
              label="Download"
              :disable="submitDisabled"
              @click="downloadApproval"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, inject } from "vue";
import { date } from "quasar";
import { useStore } from "vuex";
const today = new Date();
const { addToDate, subtractFromDate } = date;

export default {
  name: "FinanceApprovalModal",
  props: {
    propFinanceApprovalDatas: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const $q = inject("$q"); 

    // Reactive state
    const toggleModal = ref(props.propFinanceApprovalDatas);
    const formData = ref({
      fromDate: "",
      toDate: "",
    });

    // Min/max dates
    const tomorrow = addToDate(today, { days: 0 });
    const yesterday = subtractFromDate(today, { days: 7720 });

    // Computed to enable/disable Download button
    const submitDisabled = computed(() => {
      return !(formData.value.fromDate && formData.value.toDate);
    });

    // Emit close
    const emitClose = () => {
      emit("emitfnshowFinanceapproval");
    };

    // Convert date to timestamp
    const toTimestamp = (strDate) => {
      if (!strDate) return null;
      const datePart = strDate.split("T")[0];
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

    // Download Approval file
    const downloadApproval = async () => {
      if (!formData.value.fromDate || !formData.value.toDate) return;

      const params = {
        fromDate: toTimestamp(formData.value.fromDate),
        toDate: toTimestamp(formData.value.toDate),
      };

      try {
        
        $q.loading.show({
          delay: 100,
          spinnerColor: "purple-9",
          message: "Please wait...",
        });

        await store.dispatch("DownloadMasterTrackerData/FINANCE_APPROVAL_TRACKER", params);

        // Reset form
        formData.value.fromDate = "";
        formData.value.toDate = "";

        $q.loading.hide();
        emitClose();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Success, file has been downloaded",
          icon: "thumb_up",
        });
      } catch (error) {
        $q.loading.hide();
        let message = "Please select the field";

        if (error?.status === 400)
          message = "Output file size is high, select smaller date range";
        else if (error?.status === 500) message = "INTERNAL_SERVER_ERROR";
        else if (error?.status === 403 || error?.status === 404)
          message = "Please choose another date";

        $q.notify({
          color: "amber",
          position: "bottom",
          message,
          icon: "thumb_down",
        });

        // Reset form
        formData.value.fromDate = "";
        formData.value.toDate = "";
      }
    };

    return {
      toggleModal,
      formData,
      yesterday,
      tomorrow,
      submitDisabled,
      emitClose,
      downloadApproval,
    };
  },
};
</script>

<style scoped>
</style>
