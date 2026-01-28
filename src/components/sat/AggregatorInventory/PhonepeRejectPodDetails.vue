<template>
  <q-dialog :model-value="props.showRejectModel" persistent :maximized="false" :maximized-breakpoint="0"
    @update:model-value="handleDialogUpdate">
    <q-card :style="{ padding: '50px', minWidth: '400px' }">
      <div class="text-center q-subheading q-mb-md capitalize">
        {{ props.propShowRejectComponent?.allocate_region?.regionAreaName }}
      </div>
      <div class="text-light-blue q-title q-mb-md text-center">
        #{{ props.propShowRejectComponent?.pod_number }}
      </div>

      <!-- Remarks Input -->
      <q-input
        filled
        type="textarea"
        v-model="formData.regionRemarks"
        label="Reason / Remarks"
        placeholder="Type.."
        :error="!!$v.formData.regionRemarks.$error"
        @blur="$v.formData.regionRemarks.$touch()"
        class="q-my-md"
      />

      <div class="row justify-end q-mt-md">
        <q-btn
          color="negative"
          label="Reject"
          class="q-mr-sm"
          @click="PodRejectDetails"
        />
        <q-btn
          color="grey-9"
          label="Cancel"
          @click="emitToggleReject"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'; // Removed unused 'toRefs'
import { useQuasar } from 'quasar';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  showRejectModel: Boolean,
  propShowRejectComponent: Object
});

// Emits
const emit = defineEmits(['closeRejectModel', 'reloadPaymentTrackerData']);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();
const router = useRouter();

// Reactive form
const formData = reactive({
  regionRemarks: ''
});

// Vuelidate
const rules = {
  formData: {
    regionRemarks: { required }
  }
};

const $v = useVuelidate(rules, { formData });

// Watch for modal close
watch(() => props.showRejectModel, (val) => {
  if (!val) {
    $v.value.$reset();
    formData.regionRemarks = '';
  }
});

// Handle dialog update
function handleDialogUpdate(value) {
  if (!value) {
    emit('closeRejectModel');
  }
}

// Methods
function emitToggleReject() {
  emit('closeRejectModel', 'reloadPaymentTrackerData');
}

async function PodRejectDetails() {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({ message: 'Please review fields again.', color: 'negative', position: 'bottom' });
    return;
  }

  try {
    const confirm = await $q.dialog({
      title: 'Confirm',
      message: 'Are you sure want to Reject?',
      cancel: true,
      ok: 'Continue'
    }).onOk(() => true).onCancel(() => false);

    if (!confirm) return;

    const podData = { pod_number: props.propShowRejectComponent?.pod_number };

    const response = await store.dispatch('singlePodData/FETCH_PHONEPE_SINGLE_POD_DETAILS', podData);
    const param = response.data.data;

    // Add remarks
    param.soRemarks = response.data.data.soRemarks === 'null' ? 'null' : formData.soRemarks;
    param.regionRemarks = response.data.data.regionRemarks === 'null' ? 'null' : formData.regionRemarks;

    await store.dispatch('regionalInventoryDetails/REJECT_PHONEPE_INCOMING_POD_DETAILS', param);

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully updated!',
      icon: 'thumb_up'
    });

    emit('reloadPaymentTrackerData');
    emitToggleReject();
    router.push('/sat/inventory/allocation');
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    });
  }
}
</script>

<style scoped>
.text-light-blue {
  color: #1976d2;
}
</style>