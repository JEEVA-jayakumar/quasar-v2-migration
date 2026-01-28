<template>
  <q-dialog v-model="dialogModel" persistent :content-css="{ padding: '25px' }">
    <q-card flat class="q-pa-none">
      <div>
        <!-- Header -->
        <div align="center" class="text-weight-light text-grey-8 q-mb-md">
          <h5><b>Remarks</b></h5>
        </div>
        <div align="left" class="text-weight-light text-grey-8 q-mb-md">
          Add your remarks and then submit....
        </div>

        <!-- Remarks Input -->
        <div class="gutter-xs">
          <q-input
            type="textarea"
            filled
            placeholder="Type.."
            v-model="remarks"
            :error="v$.remarks.$error"
            @blur="v$.remarks.$touch()"
            color="grey-9"
            class="q-my-md"
            align="left"
          />
        </div>

        <!-- Buttons -->
        <div class="row justify-end q-mt-md">
          <q-btn
            color="positive"
            label="Submit"
            class="q-ma-sm"
            @click="loststolendevice(formData.data)"
          />
          <q-btn
            color="grey-9"
            label="Cancel"
            class="q-ma-sm"
            flat
            @click="emitToggleLost"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, watch, getCurrentInstance, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

export default {
  name: "LostStolenModal",
  props: {
    showLostModel: { type: Boolean, default: false },
    propShowLostComponent: { type: Object, required: true }
  },
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();

    // Reactive States
    const remarks = ref("");
    const formData = reactive({
      data: props.propShowLostComponent.regionalInventory || {}
    });

    // Vuelidate
    const rules = { remarks: { required } };
    const v$ = useVuelidate(rules, { remarks });

    // Watch for remarks changes
    watch(remarks, (val) => {
      formData.data.lostOrStolenRemarks = val;
    });

    // Emit toggle
    const emitToggleLost = () => {
      emit("closeLostModel");
    };

    // Computed getter/setter for v-model
    const dialogModel = computed({
      get: () => props.showLostModel,
      set: (value) => {
        if (!value) {
          emit("closeLostModel");
        }
      }
    });

    // Submit Lost/Stolen Device
    const loststolendevice = async (reqData) => {
      v$.$touch();
      if (v$.$invalid) {
        proxy.$q.notify({
          color: "negative",
          message: "Please review fields again",
          position: "bottom",
          icon: "warning"
        });
        return;
      }

      try {
        const confirm = await proxy.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to Move Lost/Stolen Inventory?",
          cancel: true,
          persistent: true
        });

        if (!confirm) return;

        proxy.$q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing .."
        });

        await store.dispatch("MasterTracker/APPROVE_LOST_STOLEN_DEVICE", reqData);

        proxy.$q.loading.hide();
        proxy.$q.notify({
          color: "positive",
          message: "Successfully Approved!",
          icon: "thumb_up",
          position: "bottom"
        });
        emitToggleLost();
      } catch (error) {
        proxy.$q.loading.hide();
        proxy.$q.notify({
          color: "negative",
          message: error?.body?.message || "Please Try Again Later !",
          icon: "thumb_down",
          position: "bottom"
        });
      }
    };

    return {
      dialogModel,
      remarks,
      formData,
      v$,
      loststolendevice,
      emitToggleLost
    };
  }
};
</script>

<style scoped>
</style>