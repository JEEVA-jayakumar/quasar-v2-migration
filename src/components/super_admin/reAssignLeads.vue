<template>
  <q-dialog
    v-model="localToggleModal"
    persistent
    maximized
  >
    <q-card class="q-pa-none">

      <!-- GENERAL LEAD INFO POPUP -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :propLeadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- HEADER -->
      <q-card-section class="row items-center q-px-lg q-py-md bottom-border">
        <div class="text-h6">Lead Details</div>
        <q-space />
        <q-btn
          size="sm"
          round
          outline
          color="dark"
          icon="close"
          @click="emitToggleRemarks"
        />
      </q-card-section>

      <!-- TABLE -->
      <q-table
        title="Lead Validation"
        class="q-px-md"
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        row-key="id"
        selection="multiple"
        v-model:selected="formData.deletedSoLeadIds"
        v-model:pagination="pagination"
        :filter="filter"
      >
        <!-- CREATED DATE -->
        <template v-slot:body-cell-createdAt="props">
          {{ formatDate(props.row.createdAt) }}
        </template>

        <!-- LEAD ID -->
        <template v-slot:body-cell-lead_id="props">
          <span
            class="cursor-pointer"
            :class="props.row.priority ? 'text-negative text-weight-bold' : 'text-primary'"
            @click="toggleLeadInformation(props.row)"
          >
            # {{ props.row.leadNumber }}
          </span>
        </template>

        <!-- MERCHANT -->
        <template v-slot:body-cell-merchantName="props">
          <span class="capitalize">{{ props.row.leadName }}</span>
        </template>

        <!-- STATE -->
        <template v-slot:body-cell-state="props">
          <span class="capitalize">{{ props.row.state }}</span>
        </template>

        <!-- FINANCE APPROVAL -->
        <template v-slot:body-cell-finance_approval="props">
          <span
            v-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS"
            class="text-positive"
          >Approved</span>

          <span
            v-else-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_PENDING"
            class="text-warning"
          >Pending</span>

          <span
            v-else-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_REJECT"
            class="text-negative"
          >Rejected</span>

          <span v-else>NA</span>
        </template>

        <!-- TOP BAR -->
        <template v-slot:top>
          <div class="row q-col-gutter-md full-width">
            <div class="col-12 col-lg-6">
              <q-input
                v-model="filter"
                label="Search by SO name, Merchant Name, Lead ID"
                clearable
                dense
              />
            </div>

            <div class="col-12 col-lg-4">
              <q-select
                v-model="formData.reassignToNewSo"
                label="Choose a user from below"
                :options="dropDown.regionwiseUsers"
                dense
              />
            </div>

            <div class="col-12 col-lg-auto flex items-center">
              <q-btn
                icon="check"
                color="positive"
                label="Assign"
                @click="fnAssign"
              />
            </div>
          </div>
        </template>
      </q-table>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import dayjs from 'dayjs';

import generalLeadInformation from '../generalLeadInformation.vue';

/* ---------------- props & emits ---------------- */
const props = defineProps({
  propRowDetails: Object,
  propToggleModal: Boolean
});

const emit = defineEmits(['closeLeadsList']);

/* ---------------- global ---------------- */
const { proxy } = getCurrentInstance();
const VERIFIED_FINANCE_STATUS_SUCCESS = proxy.$VERIFIED_FINANCE_STATUS_SUCCESS;
const VERIFIED_FINANCE_STATUS_PENDING = proxy.$VERIFIED_FINANCE_STATUS_PENDING;
const VERIFIED_FINANCE_STATUS_REJECT = proxy.$VERIFIED_FINANCE_STATUS_REJECT;

/* ---------------- state ---------------- */
const $q = useQuasar();
const store = useStore();

const localToggleModal = computed({
  get: () => props.propToggleModal,
  set: () => emit('closeLeadsList')
});

const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);

const filter = ref('');

const pagination = ref({
  page: 1,
  rowsPerPage: 6
});

const formData = ref({
  deletedSoLeadIds: [],
  reassignToNewSo: ''
});

const dropDown = ref({
  regionwiseUsers: []
});

const tableData = ref(props.propRowDetails.leadsList);

/* ---------------- columns ---------------- */
const columns = [
  { name: 'createdAt', label: 'Date(C)', field: 'createdAt', sortable: true },
  { name: 'lead_id', label: 'Lead ID', field: 'leadNumber', sortable: true },
  { name: 'merchantName', label: 'Merchant Name', field: 'merchantName', sortable: true },
  { name: 'state', label: 'State', field: 'state', sortable: true },
  {
    name: 'salesOfficerName',
    label: 'SO Name',
    field: row => row.assignedTo?.name,
    sortable: true
  },
  { name: 'finance_approval', label: 'Finance Approval', sortable: true }
];

/* ---------------- lifecycle ---------------- */
onMounted(loadRegionWiseUsers);

/* ---------------- methods ---------------- */
function formatDate(date) {
  return dayjs(date).format('Do MMM YYYY');
}

function toggleLeadInformation(lead) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (lead) addtnLeadInformation.value = lead;
}

function emitToggleRemarks() {
  emit('closeLeadsList');
}

function loadRegionWiseUsers() {
  dropDown.value.regionwiseUsers =
    props.propRowDetails.regionwiseusers.map(u => ({
      label: u.name,
      value: u.id
    }));
}

async function fnAssign() {
  if (!formData.value.deletedSoLeadIds.length) {
    return $q.notify({ color: 'negative', message: 'Select at least one item' });
  }

  if (!formData.value.reassignToNewSo) {
    return $q.notify({ color: 'negative', message: 'Please choose user' });
  }

  const payload = {
    deletedSoLeadIds: formData.value.deletedSoLeadIds.map(i => i.id),
    reassignToNewSo: formData.value.reassignToNewSo
  };

  try {
    await store.dispatch('AssignDeleteLeads/DELETE_ASSIGN_USER', payload);
    $q.notify({ color: 'positive', message: 'Successfully assigned!' });
    location.reload();
  } catch {
    $q.notify({ color: 'negative', message: 'Please try again' });
  }
}
</script>

<style scoped>
.customTableClass {
  min-height: 300px;
}
</style>
