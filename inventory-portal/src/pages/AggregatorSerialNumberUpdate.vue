<template>
  <div>
    <!-- Title -->
    <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Serial Number Update
    </div>

    <form @submit.prevent="fnSubmitBankDetails">
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row gutter-sm q-py-sm">
            <!-- TID input with autocomplete -->
            <div class="col-md-6">
              <q-input
                v-model.trim="formData.tid"
                clearable
                color="grey-9"
                label="TID"
                placeholder="TID"
                :error="v$.formData.tid.$invalid && v$.formData.tid.$dirty"
              >
                <q-autocomplete
                  v-model="formData.tid"
                  @search="tidSearch"
                  @selected="tidSelected"
                  :debounce="500"
                  :min-characters="3"
                />
              </q-input>
            </div>

            <!-- Serial Number (readonly) -->
            <div class="col-md-6">
              <q-input
                v-model.trim="formData.serialNumber"
                clearable
                color="grey-9"
                label="Serial Number"
                placeholder="Serial Number"
                disable
                :error="v$.formData.serialNumber.$invalid && v$.formData.serialNumber.$dirty"
              />
            </div>

            <!-- New Serial Number -->
            <div class="col-md-6">
              <q-input
                v-model.trim="formData.newSerialNumber"
                clearable
                color="grey-9"
                label="New Serial Number"
                placeholder="New Serial Number"
                :error="v$.formData.newSerialNumber.$invalid && v$.formData.newSerialNumber.$dirty"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="full-width group" align="center">
        <q-btn size="md" type="submit" color="purple-9">Submit</q-btn>
      </div>
    </form>

    <!-- Upload File Modal -->
    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="propShowCreateUploadFile = $event"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import uploadFile from "./uploadFile.vue";

const store = useStore();
const $q = useQuasar();

const propShowCreateUploadFile = ref(false);

const formData = reactive({
  tid: "",
  serialNumber: "",
  newSerialNumber: ""
});

// Vuelidate rules
const rules = {
  formData: {
    tid: { required },
    serialNumber: { required },
    newSerialNumber: { required }
  }
};

const v$ = useVuelidate(rules, { formData });

// ---------------- Methods ---------------- //

const fnSubmitBankDetails = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please review fields again."
    });
    return;
  }

  const serialNumberUpdate = {
    url: {
      tid: formData.tid,
      newSerialNumber: formData.newSerialNumber
    }
  };

  try {
    const response = await store.dispatch(
      "AggregatorTid/UPDATE_AGGREGATOR_SERIAL_NUMBER",
      serialNumberUpdate
    );
    $q.notify({
      color: "positive",
      position: "bottom",
      message: response.data.message,
      icon: "thumb_up"
    });
  } catch (error) {

    $q.notify({
      type: "warning",
      color: "amber-9",
      position: "bottom",
      message: error?.data?.message || "Something went wrong!"
    });
  }
};

// Autocomplete TID search
const tidSearch = async (terms, done) => {
  try {
    await store.dispatch("AggregatorTid/FETCH_AGGREGATOR_TID", terms);
    const tids = store.getters["AggregatorTid/getAllAggregatorTids"] || [];
    done(tids, terms);
  } catch {
    done([]);
  }
};

// When TID is selected, fetch serial number
const tidSelected = async () => {
  if (!formData.tid) return;

  try {
    const payload = { url: { tid: formData.tid } };
    const response = await store.dispatch(
      "AggregatorTid/FETCH_AGGREGATOR_TID_SERIAL_NUMBER",
      payload
    );
    formData.serialNumber = response.data.data.serial_no || "";
  } catch {

    formData.serialNumber = "";
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Unable to fetch serial number"
    });
  }
};
</script>

<style scoped>
.group {
  margin-bottom: 1rem;
}
</style>
