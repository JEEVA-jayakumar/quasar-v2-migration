<template>
  <q-page padding>

    <!-- Page Title -->
    <div class="row">
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Statement View
      </div>
    </div>

    <!-- Form -->
    <div class="q-px-lg q-py-md gutter-y-sm">

      <!-- TID -->
      <div class="row">
        <div class="col-md-6 text-grey-9">
          <q-input
            v-model="formData.statementDetails.tid"
            label="TID"
            outlined
            color="grey-9"
            dense
          />
        </div>
      </div>

      <!-- MID -->
      <div class="row">
        <div class="col-md-6 text-grey-9">
          <q-input
            v-model="formData.statementDetails.mid"
            label="MID"
            outlined
            color="grey-9"
            dense
          />
        </div>
      </div>

      <!-- From Date -->
      <div class="row">
        <div class="col-md-6 text-grey-9">
          <q-input
            v-model="formData.statementDetails.fromDate"
            label="From Date"
            outlined
            dense
            clearable
          >
            <template #append>
              <q-icon name="date_range" class="cursor-pointer" @click="fromDatePicker = true" />
            </template>
            <q-popup-proxy v-model="fromDatePicker" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="formData.statementDetails.fromDate"
                :options="disablePastDates"
                mask="YYYY-MM-DD"
                @update:model-value="fromDatePicker = false"
              />
            </q-popup-proxy>
          </q-input>
        </div>
      </div>

      <!-- To Date -->
      <div class="row">
        <div class="col-md-6 text-grey-9">
          <q-input
            v-model="formData.statementDetails.toDate"
            label="To Date"
            outlined
            dense
            clearable
          >
            <template #append>
              <q-icon name="date_range" class="cursor-pointer" @click="toDatePicker = true" />
            </template>
            <q-popup-proxy v-model="toDatePicker" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="formData.statementDetails.toDate"
                :options="disablePastDates"
                mask="YYYY-MM-DD"
                @update:model-value="toDatePicker = false"
              />
            </q-popup-proxy>
          </q-input>
        </div>
      </div>

      <!-- Retrigger Button -->
      <div class="row q-mt-md">
        <div class="col-md-6 text-grey-9">
          <q-btn
            flat
            label="Retrigger"
            class="common-dark-blue"
            @click="retriggerStatement"
          />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "StatementView",
  setup() {
    // Reactive state
    const formData = reactive({
      statementDetails: {
        tid: 122,
        mid: 190,
        fromDate: "2017-10-22",
        toDate: "2018-05-22"
      }
    });

    // QDate popups
    const fromDatePicker = ref(false);
    const toDatePicker = ref(false);

    // Disable past dates if needed
    const today = new Date().toISOString().split("T")[0];
    const disablePastDates = (date) => {
      return date >= today;
    };

    // Retrigger button action
    const retriggerStatement = () => {
      console.log("Retrigger clicked with:", formData.statementDetails);
      // Add actual API call or logic here
    };

    return {
      formData,
      fromDatePicker,
      toDatePicker,
      disablePastDates,
      retriggerStatement
    };
  }
};
</script>

<style scoped>
/* Optional styling */
</style>
