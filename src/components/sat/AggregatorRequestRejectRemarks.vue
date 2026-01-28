<template>
  <div>
    <q-dialog
      v-model="showRejectModalRef"
      @hide="emitToggleLost"
      persistent
    >
      <q-card class="q-pa-md" style="min-width: 30vw">
        <q-card-section class="text-center q-mb-md text-grey-8 text-weight-light">
          <h5><b>Reason</b></h5>
        </q-card-section>

        <q-card-section class="text-left q-mb-md text-grey-8 text-weight-light">
          Add your Reason and then submit...
        </q-card-section>

        <q-card-section class="q-my-md">
          <q-input
            filled
            type="textarea"
            placeholder="Type.."
            v-model="remarks"
            @blur="$v.remarks.$touch()"
            :error="$v.remarks.$error"
            color="grey-9"
            autogrow
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="positive"
            label="Submit"
            @click="rejectSelfAssign(formData.data)"
            class="q-ml-sm"
          />
          <q-btn
            color="grey-9"
            label="Cancel"
            flat
            @click="emitToggleLost"
            class="q-ml-sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    showRejectModal: Boolean,
    propsRejectDeviceComponent: Object,
  },
  setup(props, { emit }) {
    // Refs
    const showRejectModalRef = ref(props.showRejectModal);
    const remarks = ref("");

    // Reactive form data
    const formData = reactive({
      data: props.propsRejectDeviceComponent,
    });

    // Vuelidate rules
    const rules = reactive({
      remarks: { required },
    });

    const $v = useVuelidate(rules, { remarks });

    // Watch for prop changes
    watch(
      () => props.showRejectModal,
      (val) => {
        showRejectModalRef.value = val;
      }
    );

    watch(showRejectModalRef, (val) => {
      if (!val) emit("closeLostModel");
    });

    // Vuex
    const { REJECT_SELF_ASSIGNMENT } = mapActions("VerifyDevice", [
      "REJECT_SELF_ASSIGNMENT",
    ]);
    const getters = mapGetters("MasterTracker", ["getApproveLostOrStolenData"]);

    // Methods
    const emitToggleLost = () => {
      showRejectModalRef.value = false;
    };

    const rejectSelfAssign = async (reqData) => {
      $v.value.$touch();
      if ($v.value.$error) {
        return window.$q.notify("Please enter reason.");
      }

      const param = {
        selfAssignmentId: reqData.id,
        remarks: remarks.value,
      };

      try {
        const confirmed = await window.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to Reject?",
          ok: "Continue",
          cancel: "Cancel",
        });

        if (confirmed) {
          window.$q.loading.show({
            delay: 0,
            spinnerColor: "purple-9",
            message: "Processing ..",
          });

          await REJECT_SELF_ASSIGNMENT(param);

          window.$q.loading.hide();
          window.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Rejected!",
            icon: "thumb_up",
          });

          emit("closeLostModel");
        }
      } catch (error) {

        window.$q.loading.hide();
        window.$q.notify({
          color: "negative",
          position: "bottom",
          message:
            error?.body?.message ?? "Please Try Again Later !",
          icon: "thumb_down",
        });
      }
    };

    return {
      showRejectModalRef,
      remarks,
      formData,
      rejectSelfAssign,
      emitToggleLost,
      $v,
      getters,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
