<template>
  <div>
    <!-- Upload Button -->
    <div class="col-md-6 q-my-md text-right">
      <q-btn
        no-caps
        no-wrap
        label="Upload Bank List"
        class="q-mt-lg text-weight-regular"
        color="purple-9"
        icon="add"
        size="md"
        @click="fnShowCreateUploadFile"
      />
    </div>

    <!-- Title -->
    <div class="col-12 q-title q-my-lg text-weight-regular">Bank SO Details</div>

    <!-- Bank SO Form -->
    <form @submit.prevent="fnSubmitBankDetails">
      <div class="q-px-md q-pa-md">
        <div class="row gutter-sm q-py-sm">
          <!-- Location -->
          <div class="col-md-6">
            <q-input
              v-model="formData.location"
              outlined
              dense
              :error="v$.formData.location.$invalid"
              label="*Location"
              placeholder="Location"
              @blur="v$.formData.location.$touch()"
            />
          </div>

          <!-- Bank -->
          <div class="col-md-6">
            <q-select
              v-model="formData.bank"
              outlined
              dense
              :options="dropDown.leadSourceOptions"
              :error="v$.formData.bank.$invalid"
              label="*Bank"
              placeholder="Bank"
              @blur="v$.formData.bank.$touch()"
            />
          </div>

          <!-- Branch Code -->
          <div class="col-md-6">
            <q-input
              v-model="formData.branch_code"
              outlined
              dense
              :error="v$.formData.branch_code.$invalid"
              label="*Branch Code"
              placeholder="Branch Code"
              @blur="v$.formData.branch_code.$touch()"
            />
          </div>

          <!-- SO Name -->
          <div class="col-md-6">
            <q-input
              v-model="formData.so_name"
              outlined
              dense
              :error="v$.formData.so_name.$invalid"
              label="*SO Name"
              placeholder="SO Name"
              @blur="v$.formData.so_name.$touch()"
            />
          </div>

          <!-- Mail ID -->
          <div class="col-md-6">
            <q-input
              v-model="formData.mail_id"
              outlined
              dense
              :error="v$.formData.mail_id.$invalid"
              label="*Mail ID"
              placeholder="Mail ID"
              @blur="v$.formData.mail_id.$touch()"
            />
          </div>

          <!-- Emp ID -->
          <div class="col-md-6">
            <q-input
              v-model="formData.emp_id"
              outlined
              dense
              :error="v$.formData.emp_id.$invalid"
              label="*Emp ID"
              placeholder="Emp ID"
              @blur="v$.formData.emp_id.$touch()"
            />
          </div>

          <!-- Bank Enable -->
          <div class="col-md-6">
            <q-select
              v-model="formData.bank_enable"
              outlined
              dense
              :options="selectBankEnableOptions"
              :error="v$.formData.bank_enable.$invalid"
              label="Bank Enable"
              placeholder="Bank Enable"
              @blur="v$.formData.bank_enable.$touch()"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="full-width text-center q-my-md">
        <q-btn
          size="md"
          color="purple-9"
          label="Submit"
          @click="fnSubmitBankDetails"
        />
      </div>
    </form>

    <!-- Upload File Modal -->
    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="fnShowCreateUploadFile"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import uploadFile from "../../components/super_admin/uploadFile.vue";

export default {
  name: "BankSODetails",
  components: { uploadFile },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive form data
    const formData = reactive({
      location: "",
      bank: "",
      branch_code: "",
      so_name: "",
      mail_id: "",
      emp_id: "",
      bank_enable: "",
    });

    // Dropdowns
    const dropDown = reactive({ leadSourceOptions: [] });
    const selectBankEnableOptions = [
      { label: "Yes", value: "True" },
      { label: "No", value: "False" },
    ];

    // Modal toggle
    const propShowCreateUploadFile = ref(false);

    // Vuelidate rules
    const rules = {
      formData: {
        location: { required },
        bank: { required },
        branch_code: { required },
        so_name: { required },
        mail_id: { required },
        emp_id: { required, email },
        bank_enable: { required },
      },
    };
    const v$ = useVuelidate(rules, { formData });

    // Load Lead Sources
    const ajaxLoadLeadSource = async () => {
      await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
      dropDown.leadSourceOptions = store.getters["leadSource/getActiveLeadSource"].map(
        (item) => ({ label: item.sourceName, value: item.sourceName })
      );
    };

    // Show/Hide Upload File Modal
    const fnShowCreateUploadFile = () => {
      propShowCreateUploadFile.value = !propShowCreateUploadFile.value;
    };

    // Submit Form
    const fnSubmitBankDetails = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please review fields again.",
        });
        return;
      }

      try {
        const response = await store.dispatch("Bank_SO/SAVE_BANK_SO", { ...formData });
        $q.notify({
          color: "positive",
          position: "bottom",
          message: response.data.message,
          icon: "thumb_up",
        });

        // Reset form
        Object.keys(formData).forEach((key) => (formData[key] = ""));
        v$.value.$reset();
      } catch (error) {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.data?.message || "Something went wrong",
        });
      }
    };

    onMounted(() => {
      ajaxLoadLeadSource();
    });

    return {
      formData,
      dropDown,
      selectBankEnableOptions,
      propShowCreateUploadFile,
      v$,
      fnSubmitBankDetails,
      fnShowCreateUploadFile,
    };
  },
};
</script>

<style scoped>
/* Add any extra styles here if needed */
</style>
