<template>
  <q-dialog
    v-model="localToggleModal"
    persistent
    maximized
    class="customModalOverlay"
    @escape-key="emitModalClose"
  >
    <q-card class="full-height" style="min-width: 40vw">
      <!-- HEADER -->
      <q-card-section class="row items-center bottom-border">
        <div class="text-h6 text-weight-regular">
          Manage merchant types
        </div>
        <q-space />
        <q-btn
          outline
          round
          color="dark"
          size="sm"
          icon="close"
          @click="emitModalClose"
        />
      </q-card-section>

      <!-- TABS -->
      <q-tabs v-model="activeTab" color="grey-9">
        <q-tab name="active" label="Active List" @click="fetchMerchantTypeList" />
        <q-tab
          name="inactive"
          label="De-Activated List"
          @click="fetchMerchantTypeDeActivatedList"
        />
      </q-tabs>

      <q-separator />

      <!-- TAB PANELS -->
      <q-tab-panels v-model="activeTab" animated>
        <!-- ACTIVE LIST -->
        <q-tab-panel name="active">
          <q-table
            :rows="merchantTypesList"
            :columns="columns"
            row-key="merchantTypeName"
            :filter="filterSearch"
            :pagination="pagination"
            @update:pagination="pagination = $event"
            :filter-method="myCustomSearchFilter"
          >
            <!-- ACTION COLUMN -->
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  class="text-light-blue"
                  icon="edit"
                  label="Modify"
                  @click="fnShowEditMerchantTypes(props.row)"
                />
                <q-btn
                  flat
                  dense
                  class="text-negative"
                  icon="block"
                  label="Disable"
                  @click="fnDeleteMerchantType(props.row)"
                />
              </q-td>
            </template>

            <!-- TOP -->
            <template v-slot:top>
              <div class="row full-width items-center">
                <div class="col-8">
                  <q-input
                    v-model="filterSearch"
                    label="Search merchant type"
                    clearable
                    dense
                  />
                </div>
                <div class="col-4 text-right">
                  <q-btn
                    color="purple-9"
                    icon="add"
                    label="Add New"
                    @click="fnshowCreateMerchantType()"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- DEACTIVATED LIST -->
        <q-tab-panel name="inactive">
          <q-table
            :rows="merchantTypesDeactivatedList"
            :columns="columns"
            row-key="merchantTypeName"
            :filter="deActivatedSearch"
            :pagination="pagination"
            @update:pagination="pagination = $event"
            :filter-method="myCustomSearchFilter"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  class="text-positive"
                  icon="check"
                  label="Enable"
                  @click="fnEnableMerchantType(props.row)"
                />
              </q-td>
            </template>

            <template v-slot:top>
              <q-input
                v-model="deActivatedSearch"
                label="Search merchant type"
                clearable
                dense
              />
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- CHILD MODALS -->
      <showCreateMerchantType
        v-if="propShowCreateMerchantTypes"
        :propShowCreateMerchantTypes="propShowCreateMerchantTypes"
        @emitfnshowMerchantTypes="fnshowCreateMerchantType"
      />

      <showEditMerchantType
        v-if="showEditMerchantTypes"
        :propShowEditMerchantTypes="showEditMerchantTypes"
        :propRowDetails="propRowDetails"
        @emitfnshowMerchantTypes="refreshMerchantTypeList"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

import showCreateMerchantType from './createMerchantTypes.vue';
import showEditMerchantType from './editMerchantTypes.vue';

/* ---------------- props & emits ---------------- */
const props = defineProps({
  propToggleModal: Boolean,
  propactiveMerchantTypes: Array
});

const emit = defineEmits(['emitToggleModal']);

/* ---------------- state ---------------- */
const $q = useQuasar();
const store = useStore();

const activeTab = ref('active');

const merchantTypesList = ref([]);
const merchantTypesDeactivatedList = ref([]);

const propShowCreateMerchantTypes = ref(false);
const showEditMerchantTypes = ref(false);
const propRowDetails = ref(null);

const filterSearch = ref('');
const deActivatedSearch = ref('');

const pagination = ref({ rowsPerPage: 5 });

const localToggleModal = computed({
  get: () => props.propToggleModal,
  set: () => emit('emitToggleModal')
});

/* ---------------- table ---------------- */
const columns = [
  {
    name: 'merchantTypeName',
    label: 'Merchant Type',
    field: 'merchantTypeName',
    align: 'left',
    sortable: true
  },
  {
    name: 'action',
    label: '',
    align: 'right'
  }
];

/* ---------------- lifecycle ---------------- */
onMounted(fetchMerchantTypeList);

/* ---------------- methods ---------------- */
function emitModalClose() {
  emit('emitToggleModal');
}

async function fetchMerchantTypeList() {
  await store.dispatch('merchantTypes/MERCHANT_TYPE_ACTIVE_LIST');
  merchantTypesList.value =
    store.getters['merchantTypes/getActiveMerchantTypes'];
}

async function fetchMerchantTypeDeActivatedList() {
  await store.dispatch('merchantTypes/MERCHANT_TYPE_DEACTIVED_LIST');
  merchantTypesDeactivatedList.value =
    store.getters['merchantTypes/getDeActivatedMerchantTypes'];
}

function fnshowCreateMerchantType(token) {
  propShowCreateMerchantTypes.value = !propShowCreateMerchantTypes.value;
  if (token === 'refresh') fetchMerchantTypeList();
}

function fnShowEditMerchantTypes(row) {
  propRowDetails.value = row;
  showEditMerchantTypes.value = true;
}

function refreshMerchantTypeList() {
  showEditMerchantTypes.value = false;
  fetchMerchantTypeList();
}

function fnDeleteMerchantType(row) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to delete merchant type?',
    cancel: true
  }).onOk(async () => {
    await store.dispatch(
      'merchantTypes/DELETE_MERCHANT_TYPE_AND_SET_ACTIVE',
      row.id
    );
    fetchMerchantTypeList();
    $q.notify({
      color: 'negative',
      message: `Merchant type ${row.merchantTypeName} deactivated`
    });
  });
}

function fnEnableMerchantType(row) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to enable merchant type?',
    cancel: true
  }).onOk(async () => {
    await store.dispatch(
      'merchantTypes/UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE',
      row
    );
    fetchMerchantTypeDeActivatedList();
    $q.notify({
      color: 'positive',
      message: `Merchant type ${row.merchantTypeName} activated`
    });
  });
}

function myCustomSearchFilter(rows, terms, cols, cellValue) {
  const lower = terms?.toLowerCase() || '';
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(lower)
    )
  );
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 2000;
}
</style>
