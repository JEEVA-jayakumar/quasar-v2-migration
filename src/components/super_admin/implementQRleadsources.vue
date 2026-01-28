<template>
  <q-page padding>
    <!-- START >> Setup MDR details -->
    <div class="row">
      <div class="col-md-6 col-sm-4 col-xs-12 q-pa-sm">
        <div><strong>Select the Lead Bank to add List of Banks to implement QR</strong></div>
        <q-card class="full-width">
          <q-card-separator />
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-select
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  float-label="Select Lead bank"
                  color="grey-9"
                  emit-value
                  map-options
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  :disable="!formData.leadSource"
                  no-caps
                  size="md"
                  color="purple-9"
                  label="Add Lead Source"
                  @click="fnAddLeadSource"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <br /><br />
    <div class="text-center q-mb-md"><strong>List of Bank to implement QR Code</strong></div>

    <q-table
      :rows="getActiveandDeactiveLeadSource"
      :columns="columns"
      row-key="id"
      v-model:pagination="paginationControl"
      table-class="customTableClass"
    >
      <template v-slot:body-cell-action="props">
        <div class="row no-wrap no-padding">
          <q-btn
            dense
            flat
            no-caps
            no-wrap
            label="Delete"
            icon="far fa-minus-square"
            size="md"
            class="text-negative"
            @click="fnDeleteLeadSource(props.row.id)"
          />
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { reactive, onMounted ,computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const paginationControl = reactive({ rowsPerPage: 5 });
const formData = reactive({ leadSource: "" });
const dropDown = reactive({ leadSourceOptions: [] });

const columns = [
  {
    name: "sourceName",
    required: true,
    label: "QR Bank",
    align: "center",
    field: (row) => row.sourceName
  },
  {
    name: "action",
    required: true,
    label: "",
    align: "left",
    field: "action"
  }
];

// Vuex getters
const getActiveandDeactiveLeadSource = computed(
  () => store.getters["ACTIVE_DEACTIVE_LEAD_SOURCE/getActiveandDeactiveLeadSource"]
);
const getDeactiveLeadSource = computed(
  () => store.getters["ACTIVE_DEACTIVE_LEAD_SOURCE/getDeactiveLeadSource"]
);

// Fetch initial data
onMounted(() => {
  fetchData();
});

// Methods
function fetchData() {
  store.dispatch("ACTIVE_DEACTIVE_LEAD_SOURCE/LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1");
  store.dispatch("ACTIVE_DEACTIVE_LEAD_SOURCE/LEAD_SOURCE_DEACTIVE_LIST").then(() => {
    dropDown.leadSourceOptions = getDeactiveLeadSource.value.map((item) => ({
      label: item.sourceName,
      value: item.id
    }));
  });
  store.dispatch("QRList/FETCH_QR_LIST");
}

function fnAddLeadSource() {
  const requestParams = { lead: { leadId: formData.leadSource } };
  store.dispatch("ACTIVE_DEACTIVE_LEAD_SOURCE/EDIT_LEAD_SOURCE", requestParams).then((response) => {
    store.dispatch("ACTIVE_DEACTIVE_LEAD_SOURCE/LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1");
    $q.notify({
      color: "positive",
      position: "bottom",
      message: response.data.message,
      icon: "thumb_up"
    });
    formData.leadSource = "";
    store.dispatch("ACTIVE_DEACTIVE_LEAD_SOURCE/LEAD_SOURCE_DEACTIVE_LIST").then(() => {
      dropDown.leadSourceOptions = getDeactiveLeadSource.value.map((item) => ({
        label: item.sourceName,
        value: item.id
      }));
    });
  });
}

function fnDeleteLeadSource(id) {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to delete QR Bank?",
    ok: "Continue",
    cancel: "Cancel"
  })
    .onOk(() => {
      $q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });
      store
        .dispatch("ACTIVE_DEACTIVE_LEAD_SOURCE/DELETE_LEAD_SOURCE", id)
        .then(() => {
          fetchData();
          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Deleted",
            icon: "thumb_up"
          });
        })
        .catch(() => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again!",
            icon: "thumb_down"
          });
        })
        .finally(() => $q.loading.hide());
    })
    .onCancel(() => {
      $q.notify({
        color: "negative",
        position: "bottom",
        message: "No changes made!",
        icon: "thumb_down"
      });
    });
}
</script>

<style scoped>
.customTableClass {
  /* Optional custom table styling */
}
</style>
