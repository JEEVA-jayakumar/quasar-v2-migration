<template>
  <q-page>
    <q-dialog
      v-model="toggleModal"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      class="customModalOverlay"
    >
      <q-card class="q-pa-md" style="min-width: 60vw">
        <!-- Modal Title -->
        <div class="row q-pa-md">
          <div class="col-12 q-title text-weight-regular bottom-border">
            Action Bar
          </div>
        </div>

        <q-card-section>
          <div class="row q-gutter-md q-justify-between">
            <!-- Left side details -->
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
            </div>

            <!-- Right side Q-Select -->
            <div class="col-auto">
              <q-select
                v-model="formData.so"
                :options="assignToOptions"
                clearable
                filter
                color="grey-9"
                float-label="Select FSE Name*"
                style="width: 300px"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            :disable="!formData.so"
            label="Assign"
            color="blue"
            push
            highlight
            class="q-mx-sm"
            style="width: 90px"
            @click="fnAssignTickets"
          />
          <q-btn
            label="Close"
            color="negative"
            push
            highlight
            class="q-mx-sm"
            style="width: 90px"
            @click="emitfnshowUpdateOpenedExternal"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { Notify, Loading } from "quasar";
import moment from "moment";

// Props
const props = defineProps({
  propShowUpdatePickTicket: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowUpdateOpenedExternal"]);

// Vuex Store
const store = useStore();
const { getImplementationExecutiveList } = store.getters;

// Reactive state
const toggleModal = ref(false);
const assignToOptions = ref([]);
const formData = ref({
  so: "",
  Reassign: "",
  reason: null
});

// Format date utility function
const formatDate = (date, format) => {
  return date ? moment(date).format(format) : 'NA';
};

// Lifecycle hook
onBeforeMount(() => {
  toggleModal.value = true;
  console.log("propRowDetails ------->", JSON.stringify(props.propRowDetails));
  loadImplementationExecutiveList();
});

// Methods
function emitfnshowUpdateOpenedExternal() {
  emit("emitfnshowUpdateOpenedExternal");
}

async function fnAssignTickets() {
  if (!formData.value.so) {
    Notify.create({
      color: "negative",
      position: "bottom",
      message: "Request Mode cannot be empty!",
      icon: "thumb_down"
    });
    return;
  }

  Loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait.."
  });

  const postValues = {
    userId: formData.value.so,
    request: [props.propRowDetails]
  };

  try {
    await store.dispatch("serviceRequestPhonepeSat/PHONEPE_PICKUP_TICKET_ASSIGNED", postValues);
    emitfnshowUpdateOpenedExternal();
    Notify.create({
      color: "positive",
      position: "bottom",
      message: "Updated Successfully",
      icon: "thumb_up"
    });
  } catch (error) {
    Notify.create({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later!",
      icon: "thumb_down"
    });
  } finally {
    Loading.hide();
  }
}

// Load Implementation Executives
async function loadImplementationExecutiveList() {
  try {
    await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST");
    assignToOptions.value = getImplementationExecutiveList.map((value) => ({
      label: `${value.name} | ${value.employeeID} | ${value.email}`,
      value: value.id
    }));
  } catch (err) {
    console.error("Failed to load implementation executives", err);
  }
}
</script>

<style scoped>
.customModalOverlay {
  max-width: 95vw;
}
</style>