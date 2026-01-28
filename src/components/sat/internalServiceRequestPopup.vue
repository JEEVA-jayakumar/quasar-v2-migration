<template>
  <div>
    <q-dialog :model-value="opened" persistent @update:model-value="handleDialogUpdate" :maximized="false">
      <q-card style="min-width: 40vw; max-width: 90vw; padding: 20px;">
        
        <!-- Header -->
        <q-card-section class="row items-center q-pb-sm q-mb-sm border-bottom">
          <div class="col text-h6">Lead Information</div>
          <div class="col-auto">
            <q-btn round size="sm" color="dark" outline icon="close" @click="emitToggleRemarks" />
          </div>
        </q-card-section>

        <!-- Lead Information Scroll Area -->
        <q-card-section>
          <q-scroll-area style="width: 100%; height: 400px;">
            <q-list separator dense class="q-pa-none">

              <!-- Loop through all subTicketsList fields -->
              <div v-for="(col, index) in ServiceRequest.subTicketsList" :key="index" class="q-mb-sm">
                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Request Type</div>
                    <div>{{ col.serviceRequestType?.name ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Issue Type</div>
                    <div>{{ col.serviceRequestIssueType ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">SubTicket Status</div>
                    <div>{{ col.serviceRequestSubTicketStatus?.name ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Schedule Date</div>
                    <div>{{ col.scheduleDate ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Pod Number</div>
                    <div>{{ col.podNumber ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Service Remarks</div>
                    <div>{{ col.serviceRemarks ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Cancel Reason</div>
                    <div>{{ col.cancelReason ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Issue Remark</div>
                    <div>{{ col.issueRemark ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Remark</div>
                    <div>{{ col.remark ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Latitude</div>
                    <div>{{ col.latitude ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Longitude</div>
                    <div>{{ col.longitude ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Implementation Form</div>
                    <div>{{ col.implementationForm ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Picture Of Shop</div>
                    <div>{{ col.pictureOfShop ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Old Sim Number</div>
                    <div>{{ col.oldSimNumber ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Old Sim Network</div>
                    <div>{{ col.oldSimNetwork ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">New Sim Number</div>
                    <div>{{ col.newSimNumber ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">New Sim Network</div>
                    <div>{{ col.newSimNetwork ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Scan Sim Number</div>
                    <div>{{ col.scanSimNumber ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Scan Device</div>
                    <div>{{ col.scanDeviceSerialNumber ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Part Type</div>
                    <div>{{ col.partType ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-grey-8 text-caption text-weight-medium">Paper Roll Count</div>
                    <div>{{ col.paperRollCount ?? 'NA' }}</div>
                  </q-item-section>
                </q-item>

              </div>
              
            </q-list>
          </q-scroll-area>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar"; // Import useQuasar

export default {
  props: {
    ServiceRequest: { type: Object, required: true },
    propToggleServiceRequestPop: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const store = useStore();
    const $q = useQuasar(); // Get Quasar instance
    const opened = ref(props.propToggleServiceRequestPop);

    watch(() => props.propToggleServiceRequestPop, (val) => {
      opened.value = val;
    });

    // Handle dialog update
    const handleDialogUpdate = (value) => {
      if (!value) {
        emit("closeServiceRequest");
      }
    };

    const emitToggleRemarks = () => emit("closeServiceRequest");

    // Function to fetch lead info (if needed in future)
    const ajaxLoadShortLeadInfo = async () => {
      try {
        // Show Quasar loading - use $q directly
        $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data ..." });

        await store.dispatch("SatLeadValidation/FETCH_SHORT_LEAD_DATA", props.ServiceRequest.leadInformation.id);

        $q.loading.hide();
      } catch {
        // Removed unused 'err' parameter
        $q.loading.hide();
        console.error("Error fetching lead data");
      }
    };

    return {
      opened,
      emitToggleRemarks,
      ajaxLoadShortLeadInfo,
      handleDialogUpdate
    };
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>