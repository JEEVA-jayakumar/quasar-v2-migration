<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      :max-width="'500px'"
      :content-class="'q-pa-lg'"
    >
      <form class="column q-gutter-md">
        <!-- Title -->
        <div class="q-title text-center text-weight-regular">
          <strong>Download Pod File</strong>
        </div>

        <!-- From Date -->
        <q-datetime
          v-model="formData.fromDate"
          hide-underline
          float-label="From Date"
          :min="yesterday"
          :max="tomorrow"
          class="q-mb-sm"
        />

        <!-- To Date -->
        <q-datetime
          v-model="formData.toDate"
          hide-underline
          float-label="To Date"
          :min="yesterday"
          :max="tomorrow"
          class="q-mb-sm"
        />

        <!-- Buttons -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            color="grey-8"
            label="Cancel"
            @click.prevent="emitfnshowPodList"
          />
          <q-btn
            color="purple-9"
            label="Download"
            :disabled="submitDisabled"
            @click.prevent="downloadPodList"
          />
        </div>
      </form>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch, computed } from "vue"; // Added 'computed' here
import { date, useQuasar } from "quasar"; // Added useQuasar
import { useStore } from "vuex"; // Added useStore for Composition API

const today = new Date();
const { addToDate, subtractFromDate } = date;

export default {
  name: "DownloadPodModal",
  props: {
    propPodListDatas: { type: Boolean, default: false },
    propData: { type: Object, default: () => ({}) }
  },
  emits: ["emitfnshowPodList"],
  setup(props, { emit }) {
    // Quasar instance
    const $q = useQuasar();
    const store = useStore();
    
    // Modal toggle ref
    const toggleModel = ref(props.propPodListDatas);
    watch(
      () => props.propPodListDatas,
      (val) => (toggleModel.value = val)
    );

    // Date limits
    const tomorrow = addToDate(today, { days: 0 });
    const yesterday = subtractFromDate(today, { days: 720 });

    // Form data
    const formData = reactive({
      fromDate: "",
      toDate: ""
    });

    // Submit disabled logic
    const submitDisabled = computed(() => {
      return !(formData.fromDate && formData.toDate);
    });

    // Cancel button
    const emitfnshowPodList = () => emit("emitfnshowPodList");

    // Convert date to timestamp
    const toTimestamp = (strDate) => {
      if (!strDate) return null;
      const curDate = new Date();
      const mnth = curDate.getMonth() + 1;
      const chDate =
        curDate.getFullYear() +
        "-" +
        (mnth < 10 ? "0" + mnth : mnth) +
        "-" +
        curDate.getDate();
      const datePart = strDate.split("T")[0];
      return chDate === datePart ? Date.now() : Date.parse(strDate);
    };

    // Download POD
    const downloadPodList = async () => {
      const params = {
        fromDate: toTimestamp(formData.fromDate),
        toDate: toTimestamp(formData.toDate)
      };

      $q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Please wait.."
      });

      try {
        await store.dispatch("DownloadPodAllDatas/AGGREGATOR_POD_LISTED_ALL_DATAS", params);
        
        emit("emitfnshowPodList");
        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Downloaded",
          icon: "thumb_up"
        });
        
        // Reset form
        formData.fromDate = "";
        formData.toDate = "";
      } catch (error) {
        $q.loading.hide();
        const msg =
          error?.status === 400
            ? "Output file size is high, select smaller date range"
            : error?.status === 500
            ? "INTERNAL_SERVER_ERROR"
            : error?.status === 403 || error?.status === 404
            ? "Please choose another date"
            : "Please select the field";

        $q.notify({
          color: "amber",
          position: "bottom",
          message: msg,
          icon: "thumb_down"
        });

        // Reset form
        formData.fromDate = "";
        formData.toDate = "";
      }
    };

    return {
      toggleModel,
      tomorrow,
      yesterday,
      formData,
      submitDisabled,
      emitfnshowPodList,
      downloadPodList
    };
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
  position: absolute;
  text-transform: lowercase;
}
</style>