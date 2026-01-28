<template>
  <q-dialog
    v-model="localToggleModal"
    persistent
    class="customModalOverlay"
    @hide="toggleModal"
  >
    <q-card style="min-width: 30vw; padding: 30px">
      <q-card-section>
        <div class="text-h6 text-weight-regular">Add New Instance</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.institutionName"
          label="Institution Name"
          color="grey-9"
          class="text-grey-8"
          :error="v$.formData.institutionName.$error"
          @blur="v$.formData.institutionName.$touch()"
          @keyup.enter="submitInstanceData"
        />

        <q-input
          v-model="formData.institutionRRCode"
          label="Institution RR Code"
          color="grey-9"
          class="text-grey-8 q-mt-sm"
          :error="v$.formData.institutionRRCode.$error"
          @blur="v$.formData.institutionRRCode.$touch()"
          @keyup.enter="submitInstanceData"
        />

        <q-input
          v-model="formData.institutionCode"
          label="Institution Code"
          color="grey-9"
          class="text-grey-8 q-mt-sm"
          :error="v$.formData.institutionCode.$error"
          @blur="v$.formData.institutionCode.$touch()"
          @keyup.enter="submitInstanceData"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="text-grey-8"
          label="Cancel"
          @click="toggleModal"
        />
        <q-btn
          color="purple-9"
          label="Save"
          @click="submitInstanceData"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/* ---------------- props & emits ---------------- */
const props = defineProps({
  propShowCreatemarsInstance: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['emitfnshowMarsInstance']);

/* ---------------- state ---------------- */
const localToggleModal = computed({
  get: () => props.propShowCreatemarsInstance,
  set: () => emit('emitfnshowMarsInstance')
});

const formData = reactive({
  institutionName: '',
  institutionRRCode: '',
  institutionCode: '',
  institutionActive: 1
});

/* ---------------- validation ---------------- */
const rules = {
  formData: {
    institutionName: { required },
    institutionRRCode: { required },
    institutionCode: { required }
  }
};

const v$ = useVuelidate(rules, { formData });

/* ---------------- services ---------------- */
const $q = useQuasar();
const store = useStore();

/* ---------------- methods ---------------- */
const toggleModal = () => {
  emit('emitfnshowMarsInstance');
};

const submitInstanceData = async () => {
  v$.value.$touch();

  if (v$.value.$error) return;

  $q.loading.show({
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  });

  try {
    await store.dispatch('MarsInstance/ADD_NEW_INSTANCE', formData);

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Instance successfully created!',
      icon: 'thumb_up'
    });

    emit('emitfnshowMarsInstance', 'refresh');
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.customModalOverlay {
  z-index: 2000;
}
</style>
