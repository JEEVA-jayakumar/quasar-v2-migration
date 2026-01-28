<template>
  <q-page padding>
    <!-- Table Title -->
    <div class="col-md-12 q-title q-px-md q-py-md text-weight-regular bottom-border text-grey-9">
      Lead Approval Tracker
    </div>

    <!-- Option Radios -->
    <div class="row q-pa-md">
      <div class="col-6 group">
        <p>Choose one from the below or you can choose start and end date manually</p>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="1" label="Past 6 months"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="2" label="Past 3 months"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="3" label="Past 1 month"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="4" label="Past 4 weeks"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="5" label="Past 3 weeks"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="6" label="Past 2 weeks"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="7" label="Past 1 week"/>
        <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="8" label="Today"/>
      </div>
    </div>

    <!-- Date Pickers -->
    <div class="row q-pa-md">
      <div class="col-6 group">
        <q-datetime v-model="formData.from" type="date" color="grey-9" label="Start date" mask="YYYY-MM-DD" />
        <q-datetime v-model="formData.to" type="date" color="grey-9" label="End date" mask="YYYY-MM-DD" />
      </div>

      <!-- Download Button -->
      <div class="col-12 group q-mt-md">
        <q-btn class="common-dark-blue" @click="downloadReport" label="Download" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { date, Notify, Loading } from "quasar";
import { useStore } from "vuex";

export default {
  name: "LeadApprovalTracker",
  setup() {
    const store = useStore();

    // Reactive form data
    const formData = ref({
      option: 8,
      from: new Date(),
      to: new Date()
    });

    // Calculate start and end date based on radio selection
    const calculateDate = () => {
      const now = new Date();
      let newDate = new Date();

      switch (formData.value.option) {
        case 1: newDate = date.subtractFromDate(now, { month: 6 }); break;
        case 2: newDate = date.subtractFromDate(now, { month: 3 }); break;
        case 3: newDate = date.subtractFromDate(now, { month: 1 }); break;
        case 4: newDate = date.subtractFromDate(now, { days: 28 }); break;
        case 5: newDate = date.subtractFromDate(now, { days: 21 }); break;
        case 6: newDate = date.subtractFromDate(now, { days: 14 }); break;
        case 7: newDate = date.subtractFromDate(now, { days: 7 }); break;
        default: newDate = new Date(); break;
      }

      formData.value.from = newDate;
      formData.value.to = now;
    };

    // Download report function
    const downloadReport = async () => {
      Loading.show({ delay: 100 });
      try {
        await store.dispatch("reports/REPORT_LEAD_APPROVAL_TRACKER", formData.value);
        Notify.create({
          color: "positive",
          position: "bottom",
          message: "Success, file has been downloaded",
          icon: "check"
        });
      } catch {
        Notify.create({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down"
        });
      } finally {
        Loading.hide();
      }
    };

    // Initialize dates on load
    calculateDate();

    return {
      formData,
      calculateDate,
      downloadReport
    };
  }
};
</script>

<style scoped>
.group p {
  margin-bottom: 10px;
}
</style>
