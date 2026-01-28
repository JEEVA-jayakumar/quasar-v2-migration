<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      minimized
      no-backdrop-dismiss
      :maximized="false"
      class="customModalOverlay"
    >
      <q-card :style="{ padding: '50px', minWidth: '30vw' }">
        <!-- Header -->
        <q-card-section class="q-title q-pa-md text-weight-regular bottom-border">
          RE-Assign
        </q-card-section>

        <!-- Re-Assign Form -->
        <q-card-section>
          <q-card style="width: 250%">
            <q-card-section>
              <q-list no-border>

                <!-- Select SO -->
                <div class="col-md-12">
                  <q-select
                    v-model="formData.so"
                    :options="assignToOptions"
                    label="Select SO*"
                    color="grey-9"
                    clearable
                    emit-value
                    map-options
                    use-input
                    input-debounce="0"
                    outlined
                  />
                </div>

                <!-- Select Reason -->
                <div class="col-md-12 q-mt-md">
                  <q-select
                    v-model="formData.Reassign"
                    :options="ReasonListOptions"
                    label="Select Reason List*"
                    color="grey-9"
                    outlined
                  />
                </div>

                <!-- Other reason input -->
                <div v-if="formData.Reassign === 'Other reason'" class="q-mt-md">
                  <q-input
                    v-model="formData.reason"
                    type="textarea"
                    label="Reason Type.."
                    color="grey-9"
                    outlined
                  />
                </div>

              </q-list>
            </q-card-section>

            <!-- Action Buttons -->
            <q-card-actions align="end">
              <q-btn
                flat
                label="Cancel"
                class="bg-white text-weight-regular text-grey-8"
                @click="emitfnshowUpdateOpenedExternal"
              />
              <q-btn
                label="Submit"
                color="purple-9"
                @click="fnEDITREOPEN"
              />
            </q-card-actions>
          </q-card>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "ReassignModal",
  props: {
    propShowUpdateOpenedExternal: { type: Boolean, required: true },
    propRowDetails: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const toggleModel = ref(props.propShowUpdateOpenedExternal);

    const formData = reactive({
      so: "",
      Reassign: "",
      reason: ""
    });

    const assignToOptions = ref([]);
    const ReasonListOptions = ref([]);

    // Emit cancel
    const emitfnshowUpdateOpenedExternal = () => {
      emit("emitfnshowUpdateOpenedExternal");
    };

    // Load SO and Reason lists
    const implementationExecutiveList = async () => {
      await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST");
      assignToOptions.value = store.getters["ImplementationExecutive/getImplementationExecutiveList"].map(
        (v) => ({
          label: `${v.name} | ${v.employeeID} | ${v.email}`,
          value: v.id,
        })
      );
    };

    const ReassignReasonList = async () => {
      await store.dispatch("reassignReasonList/REASSIGN_REASON_LIST");
      ReasonListOptions.value = store.getters["reassignReasonList/getreassignReasonList"].map(
        (v) => ({ label: v.name, value: v.name })
      );
    };

    onBeforeMount(() => {
      implementationExecutiveList();
      ReassignReasonList();
    });

    // Submit Re-Assign
    const fnEDITREOPEN = () => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to reject the lead?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          $q.loading.show({ spinnerColor: "purple-9", message: "Processing ..." });

          const param = {
            userId: formData.so,
            request: [{
              ...props.propRowDetails,
              reAssignReason: formData.Reassign,
              reAssignRemark: formData.reason,
            }]
          };

          await store.dispatch("reassignReasonList/REASSIGNED_REASON_TYPE_DETAILS", param);

          $q.loading.hide();
          $q.notify({ color: "positive", position: "bottom", message: "Updated Successfully", icon: "thumb_up" });
          emitfnshowUpdateOpenedExternal();
        } catch (error) {

          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error?.body?.message || "Please Try Again Later !",
            icon: "thumb_down"
          });
        }
      }).onCancel(() => {
        $q.notify({ color: "negative", position: "bottom", message: "No changes made!", icon: "thumb_down" });
      });
    };

    return {
      toggleModel,
      formData,
      assignToOptions,
      ReasonListOptions,
      emitfnshowUpdateOpenedExternal,
      fnEDITREOPEN,
    };
  }
};
</script>

<style scoped>
</style>
