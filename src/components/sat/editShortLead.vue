<template>
  <div>
    <!-- Display Lead Name for debug -->
    <div>{{ propRowDetails.leadName }}</div>

    <q-dialog
      v-model="toggleModal.value"
      persistent
      class="customModalOverlay"
      :content-style="{ padding: '30px', minWidth: '40vw' }"
    >
      <q-card>
        <!-- Header -->
        <q-card-section class="q-title text-weight-regular">
          Edit ShortLead
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-input
            v-model="formData.id"
            label="Lead ID"
            disable
            filled
            class="q-mb-md"
            @keyup.enter="submitShortLead"
          />

          <q-input
            v-model="formData.leadName"
            label="Lead Name"
            filled
            class="q-mb-md"
            :error="v$.formData.leadName.$invalid && v$.formData.leadName.$dirty"
            @blur="v$.formData.leadName.$touch()"
            @keyup.enter="submitShortLead"
          />

          <q-input
            v-model="formData.leadNumber"
            label="Lead Number"
            filled
            class="q-mb-md"
            :error="v$.formData.leadNumber.$invalid && v$.formData.leadNumber.$dirty"
            @blur="v$.formData.leadNumber.$touch()"
            @keyup.enter="submitShortLead"
          />

          <q-input
            v-model="formData.shortleadDate"
            label="ShortLead Date"
            filled
            class="q-mb-md"
            :error="v$.formData.shortleadDate.$invalid && v$.formData.shortleadDate.$dirty"
            @blur="v$.formData.shortleadDate.$touch()"
            @keyup.enter="submitShortLead"
          />

          <q-input
            v-model="formData.contactNumber"
            label="Contact Number"
            filled
            class="q-mb-md"
            :error="v$.formData.contactNumber.$invalid && v$.formData.contactNumber.$dirty"
            @blur="v$.formData.contactNumber.$touch()"
            @keyup.enter="submitShortLead"
          />
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="emitfnshowEditShortLead" />
          <q-btn label="Save" color="purple-9" @click="submitShortLead" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// Props & emits
const props = defineProps({
  propShowEditShortLead: Boolean,
  propRowDetails: Object
});
const emit = defineEmits(["emitfnshowEditShortLead"]);

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();

// Reactive modal
const toggleModal = ref(props.propShowEditShortLead);

// Watch prop to update modal
watch(() => props.propShowEditShortLead, (val) => {
  toggleModal.value = val;
});

// Form data
const formData = reactive({
  id: props.propRowDetails.id,
  leadName: props.propRowDetails.leadName,
  leadNumber: props.propRowDetails.leadNumber,
  shortleadDate: props.propRowDetails.shortleadDate,
  contactNumber: props.propRowDetails.contactNumber
});

// Validation rules
const rules = {
  formData: {
    leadName: { required },
    leadNumber: { required },
    shortleadDate: { required },
    contactNumber: { required }
  }
};

// Initialize Vuelidate
const v$ = useVuelidate(rules, { formData });

// Emit cancel
function emitfnshowEditShortLead() {
  emit("emitfnshowEditShortLead");
}

// Submit form
async function submitShortLead() {
  v$.$touch();
  if (v$.$invalid) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please review fields again.",
      icon: "warning"
    });
    return;
  }

  const params = {
    data1: { ...formData },
    url: { id: props.propRowDetails.id }
  };

  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  try {
    await store.dispatch("convertToWip/CONVERT_TO_WIP", params);
    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "WIP Lead successfully created!",
      icon: "thumb_up"
    });
    emitfnshowEditShortLead();
  } catch (error) {

    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  }
}
</script>

<style scoped>
.customModalOverlay {
  max-width: 600px;
}
</style>
