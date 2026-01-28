<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
      :maximized="false"
      :content-css="{ minWidth: '50%', height: 'auto', maxHeight: '50vh', margin: '20px', padding: '20px' }"
    >
      <!-- START >> Lead reject -->
      <div class="column group">
        <div class="q-title q-py-md">Are you sure want to reject?</div>
        <div>
          <q-input
            v-model="formData.leadVerificationStatus.reason"
            float-label="SAT Remarks"
            color="grey-9"
            :error="!!$v.formData.leadVerificationStatus.reason.$error"
            :rules="[() => !$v.formData.leadVerificationStatus.reason.$invalid || 'Reason is required']"
          />
        </div>
        <div class="group q-mt-md">
          <q-btn
            icon="clear"
            color="negative"
            class="q-ma-sm float-right"
            @click="sendRemarks"
            label="Reject"
          />
          <q-btn
            icon="block"
            color="grey-5"
            @click="emitToggleRemarks"
            class="q-ma-sm float-right text-dark"
            label="Cancel"
          />
        </div>
      </div>
      <!-- END >> Lead reject -->
    </q-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

export default {
  name: "LeadRejectModal",
  props: {
    propToggleLeadModal: Boolean,
    propLeadDetails: Object
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const router = useRouter();
    const store = useStore();

    const toggleModel = reactive({ value: props.propToggleLeadModal });

    watch(
      () => props.propToggleLeadModal,
      (val) => {
        toggleModel.value = val;
      }
    );

    const formData = reactive({
      leadVerificationStatus: {
        fieldName: "Bank Subvention",
        reason: "Bank Issues"
      },
      leadInformation: {
        id: props.propLeadDetails?.id || null,
        verifiedBanksubventionStatus: 0
      }
    });

    const rules = {
      formData: {
        leadVerificationStatus: {
          reason: { required }
        }
      }
    };

    const $v = useVuelidate(rules, { formData });

    const emitToggleRemarks = () => {
      emit("toggleLeadModal");
    };

    const sendRemarks = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) {
        $q.notify({ message: "Please review fields again.", color: "negative" });
        return;
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Processing .."
      });

      try {
        await store.dispatch("ExceptionQueue/FEED_SAT_EQ_BANK_FEEDBACK", formData);

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Rejected Lead : #" + formData.leadInformation.id,
          icon: "clear"
        });

        router.push("/sat/exception/queue");
      } catch (error) {

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message:
            error?.body?.message ?? "Please Try Again Later !",
          icon: "thumb_down"
        });
      }
    };

    return {
      ...toRefs(toggleModel),
      formData,
      $v,
      emitToggleRemarks,
      sendRemarks
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  max-width: 50%;
  margin: 20px auto;
}
</style>
