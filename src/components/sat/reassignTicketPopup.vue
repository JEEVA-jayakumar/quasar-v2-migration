<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      :content-css="{ padding: '6px', minWidth: '60vw' }"
    >
      <q-card class="q-pa-md" style="width: 150%">
        <div class="row q-gutter-md q-justify-between">
          <!-- Left Column -->
          <div class="col">
            <div class="q-mb-md">
              <q-item-label><b>Reported Status:</b></q-item-label>
              <div>{{ propRowDetails.subTicketsList[0].serviceRequestType.name }}</div>
            </div>

            <div class="q-mb-md">
              <q-item-label><b>TID:</b></q-item-label>
              <div>{{ propRowDetails.tid }}</div>
            </div>

            <div class="q-mb-md">
              <q-item-label><b>Ticket ID:</b></q-item-label>
              <div>{{ propRowDetails.serviceReqTicketId }}</div>
            </div>

            <div class="q-mb-md">
              <q-item-label><b>SAT forwarded date:</b></q-item-label>
              <div>{{ formatDate(propRowDetails.subTicketsList[0].moveToSatDate, "Do MMM Y") }}</div>
            </div>

            <div class="q-mb-md">
              <q-item-label><b>Reassign Remarks:</b></q-item-label>
              <q-input
                v-model="formData.reason"
                type="textarea"
                filled
                placeholder="Reason Type..."
                class="q-my-md custom-textarea"
                :style="{ width: '60%', height: '56px' }"
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-auto">
            <q-select
              v-model="formData.so"
              :options="assignToOptions"
              filter
              clearable
              float-label="Select FSE Name*"
              style="width: 300px"
            />
            <br /><br />
            <div class="q-mb-md row justify-end items-center">
              <q-item-label><b>Reassign Count:</b></q-item-label>
              <div class="q-ml-sm">{{ count }}</div>
            </div>
            <div class="q-mb-md row justify-end items-center">
              <q-btn
                label="Assign History"
                color="purple-9"
                @click="fnAssignHistoryPopup(propRowDetails)"
              />
            </div>
          </div>
        </div>

        <q-card-actions align="center">
          <q-btn
            :disable="!formData.so || !formData.reason"
            label="Re-Assign"
            color="blue"
            push
            highlight
            style="width: 90px"
            @click="fnReassignTickets(formData)"
          />
          <q-btn
            label="Close"
            color="negative"
            push
            highlight
            style="width: 90px"
            @click="emitfnshowUpdateOpenedExternal"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Assign History Popup -->
    <assignHistoryPopup
      v-if="propShowUpdateAssignHistoryPopup"
      :propShowUpdateAssignHistoryPopup="propShowUpdateAssignHistoryPopup"
      :propRowDetails="propRowDetails"
      @emitfnshowUpdateOpenedExternal="fnAssignHistoryPopup"
    />
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { Notify, Loading, Dialog } from "quasar";
import moment from "moment";
import assignHistoryPopup from "../../components/sat/assignHistoryPopup.vue";

// Props
const props = defineProps({
  propShowUpdateReassignTicket: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowUpdateOpenedExternal"]);

// Vuex
const store = useStore();

// Reactive State
const toggleModel = ref(props.propShowUpdateReassignTicket);
const propShowUpdateAssignHistoryPopup = ref(false);
const assignToOptions = ref([]);
const assignHistoryRemarks = ref([]);
const count = ref(0);

const formData = ref({
  so: "",
  Reassign: "",
  reason: null
});

// Date formatting function
const formatDate = (date, format) => {
  return date ? moment(date).format(format) : 'NA';
};

// Lifecycle
onBeforeMount(() => {
  console.log("propRowDetails ------->", JSON.stringify(props.propRowDetails));
  assignHistoryList(props.propRowDetails);
  implementationExecutiveList();
});

// Methods
function emitfnshowUpdateOpenedExternal() {
  emit("emitfnshowUpdateOpenedExternal");
}

async function fnReassignTickets(request) {
  try {
    await Dialog.create({
      title: "Confirm",
      message: "Are you sure want to Re-Assign the lead?",
      ok: "Continue",
      cancel: "Cancel"
    });

    Loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    });

    const param = {
      userId: request.so,
      request: [
        {
          id: props.propRowDetails.id,
          tid: props.propRowDetails.tid,
          mid: props.propRowDetails.mid,
          leadId: props.propRowDetails.leadId,
          meName: props.propRowDetails.meName,
          address: props.propRowDetails.address,
          state: props.propRowDetails.state,
          city: props.propRowDetails.city,
          pincode: props.propRowDetails.pincode,
          contactNumber: props.propRowDetails.contactNumber,
          emailId: props.propRowDetails.emailId,
          deviceType: props.propRowDetails.deviceType,
          serviceReqTicketId: props.propRowDetails.serviceReqTicketId,
          serviceRequestTicketStatus: props.propRowDetails.serviceRequestTicketStatus,
          source: props.propRowDetails.source,
          serviceRequestMode: props.propRowDetails.serviceRequestMode,
          bpRegion: props.propRowDetails.bpRegion,
          assignedTo: props.propRowDetails.assignedTo,
          createdBy: props.propRowDetails.createdBy,
          crmRemark: props.propRowDetails.crmRemark,
          reAssignReason: request.Reassign,
          reAssignRemark: request.reason,
          createdDate: props.propRowDetails.createdDate,
          updatedDate: props.propRowDetails.updatedDate,
          subTicketsList: null
        }
      ]
    };

    await store.dispatch("serviceRequestPhonepeSat/PHONEPE_REASSIGNED_MERCHANT_TICKETS", param);

    emitfnshowUpdateOpenedExternal();
    Loading.hide();
    Notify.create({
      color: "positive",
      position: "bottom",
      message: "Updated Successfully",
      icon: "thumb_up"
    });
  } catch (err) {
    Loading.hide();
    if (err !== true) {
      Notify.create({
        color: "negative",
        position: "bottom",
        message: err?.body?.message || "No changes made!",
        icon: "thumb_down"
      });
    } else {
      Notify.create({
        color: "negative",
        position: "bottom",
        message: "No changes made!",
        icon: "thumb_down"
      });
    }
  }
}

function fnAssignHistoryPopup(rowDetails) {
  propShowUpdateAssignHistoryPopup.value = !propShowUpdateAssignHistoryPopup.value;
  assignHistoryList(props.propRowDetails);
  // Don't mutate props - removed the prop mutation
  if (rowDetails !== undefined) {
    // Props are read-only, don't assign to them
    // If you need to update parent data, emit an event instead
  }
}

async function assignHistoryList(request) {
  try {
    Loading.show();
    await store.dispatch("serviceRequestPhonepeSat/ASSIGN_HISTORY_REMARKS_LIST", { Id: request.id });
    assignHistoryRemarks.value = store.getters["serviceRequestPhonepeSat/getassignHistoryLists"];
    count.value = assignHistoryRemarks.value.length;
    Loading.hide();
  } catch {
    Loading.hide();
  }
}

async function implementationExecutiveList() {
  await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST");
  const list = store.getters["ImplementationExecutive/getImplementationExecutiveList"];
  assignToOptions.value = list.map(value => ({
    label: `${value.name} | ${value.employeeID} | ${value.email}`,
    value: value.id
  }));
}
</script>

<style scoped>
.custom-textarea {
  resize: none;
}
</style>