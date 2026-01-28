<template>
  <q-page padding>
    <!-- HEADER -->
    <div class="text-h6 q-mb-md bottom-border">
      Manage Document Types
    </div>

    <!-- FORM -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <!-- Merchant Type -->
          <div class="col-3">
            <q-select
              v-model="formData.merchantType"
              :options="activeMerchantType"
              label="Select merchant type"
              emit-value
              map-options
              :error="v$.formData.merchantType.$error"
              @update:model-value="merchantDocumentTypeActiveList"
            />
          </div>

          <div class="col-auto">
            <q-btn round dense icon="add" color="purple-9" @click="fnManagemerchantTypes" />
          </div>

          <!-- Document Type -->
          <div class="col-3">
            <q-select
              v-model="formData.parentIDtemp"
              :options="activeDocumentMerchantType"
              label="Merchant Document Type"
              emit-value
              map-options
              @update:model-value="mapParentIdToSubDocument"
            />
          </div>

          <div class="col-auto">
            <q-btn round dense icon="add" color="purple-9" @click="fnManagemerchanDocumentTypes" />
          </div>

          <!-- Sub Document -->
          <div class="col-3">
            <q-input
              v-model="formData.subDocumentType"
              label="Merchant Sub Document Type"
              :error="v$.formData.subDocumentType.$error"
            />
          </div>

          <!-- Mars ID -->
          <div class="col-auto">
            <q-input
              v-model.number="formData.marsDocumentId"
              type="number"
              label="Mars Document Id"
            />
          </div>
        </div>

        <div class="row q-mt-md">
          <q-btn
            color="purple-9"
            label="Submit"
            @click="submitMerchantSubDocumentType"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- TABS -->
    <q-tabs v-model="activeTab" class="text-grey-9" dense>
      <q-tab name="active" label="Active List" />
      <q-tab name="inactive" label="De-Activated List" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated>
      <!-- ACTIVE -->
      <q-tab-panel name="active">
        <q-table
          :rows="activatedTableData"
          :columns="activatedColumns"
          row-key="id"
          :filter="filterSearch"
        >
          <template v-slot:top>
            <q-input
              dense
              debounce="300"
              v-model="filterSearch"
              placeholder="Search..."
            />
          </template>

          <template v-slot:body-cell-action="props">
            <q-td>
              <q-btn
                flat
                dense
                color="primary"
                label="Modify"
                @click="editMerchantSubDocumentType(props.row)"
              />
              <q-btn
                flat
                dense
                color="negative"
                label="Disable"
                @click="fnDeleteDocumentType(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- INACTIVE -->
      <q-tab-panel name="inactive">
        <q-table
          :rows="deActivatedTableData"
          :columns="deActivatedColumns"
          row-key="id"
        />
      </q-tab-panel>
    </q-tab-panels>

    <!-- MODALS -->
    <merchantTypes
      v-if="toggleMerchantTypes"
      :propToggleModal="toggleMerchantTypes"
      @emitToggleModal="fnManagemerchantTypes"
    />

    <merchanDocumentTypes
      v-if="toggleMerchantdocumentTypes"
      :propToggleModal="toggleMerchantdocumentTypes"
      :propMerchantType="formData.merchantType"
      @emitToggleModal="fnManagemerchanDocumentTypes"
    />

    <showEditMerchantSubDocumentType
      v-if="toggleMerchantSubdocumentTypes"
      :propToggleMerchantSubdocumentTypes="toggleMerchantSubdocumentTypes"
      :propActiveMerchantTypes="activeMerchantType"
      :propActiveDocumentMerchantType="activeDocumentMerchantType"
      :propRowDetails="propRowDetails"
      @emitfnshowMerchantSubDocumentTypes="editMerchantSubDocumentType"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import merchantTypes from '../../components/super_admin/merchantTypes.vue'
import merchanDocumentTypes from '../../components/super_admin/merchanDocumentTypes.vue'
import showEditMerchantSubDocumentType from '../../components/super_admin/editMerchantSubDocumentType.vue'

const $q = useQuasar()
const store = useStore()

const activeTab = ref('active')
const filterSearch = ref('')

const toggleMerchantTypes = ref(false)
const toggleMerchantdocumentTypes = ref(false)
const toggleMerchantSubdocumentTypes = ref(false)

const propRowDetails = ref(null)

const activeMerchantType = ref([])
const activeDocumentMerchantType = ref([])
const activatedTableData = ref([])
const deActivatedTableData = ref([])

const formData = reactive({
  merchantType: null,
  subDocumentType: null,
  parentIDtemp: null,
  marsDocumentId: null,
  id: null,
  documentType: null
})

const rules = {
  formData: {
    merchantType: { required },
    subDocumentType: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

const activatedColumns = [
  { name: 'merchantTypeName', label: 'Merchant Type', field: 'merchantTypeName' },
  { name: 'documentType', label: 'Document Type', field: 'documentType' },
  { name: 'subDocumentType', label: 'Sub Document Type', field: row => row.subDocumentType || 'NA' },
  { name: 'marsDocumentId', label: 'Mars Document Id', field: 'marsDocumentId' },
  { name: 'action', label: 'Action', field: 'action' }
]

const deActivatedColumns = [
  { name: 'documentType', label: 'Document Type', field: 'documentType' }
]

onMounted(() => {
  fetchActiveMerchantTypesOptions()
})

function fetchActiveMerchantTypesOptions () {
  activeMerchantType.value = []
  store.dispatch('merchantTypes/MERCHANT_TYPE_ACTIVE_LIST').then(() => {
    store.getters['merchantTypes/getActiveMerchantTypes'].forEach(item => {
      activeMerchantType.value.push({
        label: item.merchantTypeName,
        value: item.id
      })
    })
  })
}

function merchantDocumentTypeActiveList () {
  store.dispatch('merchantDocumentTypes/MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST', {
    merchantTypeId: formData.merchantType,
    parentId: 0
  }).then(() => {
    activeDocumentMerchantType.value =
      store.getters['merchantDocumentTypes/getActiveMerchantDocumentTypes']
        .map(v => ({ label: v.documentType, value: v }))
  })
}

function mapParentIdToSubDocument (val) {
  if (!val) return
  formData.id = val.id
  formData.documentType = val.documentType
}

function submitMerchantSubDocumentType () {
  v$.value.$touch()
  if (v$.value.$invalid) return

  $q.loading.show()
  store.dispatch('merchantDocumentTypes/ADD_NEW_MERCHANT_DOCUMENT_TYPE', {
    url: {
      id: formData.id,
      merchantType: formData.merchantType,
      hasSubDoc: true
    },
    params: {
      documentType: formData.documentType,
      subDocumentType: formData.subDocumentType,
      marsDocumentId: formData.marsDocumentId,
      required: true
    }
  }).then(() => {
    $q.notify({ type: 'positive', message: 'Saved successfully' })
    formData.subDocumentType = null
    formData.marsDocumentId = null
  }).finally(() => {
    $q.loading.hide()
  })
}

function fnDeleteDocumentType (row) {
  $q.dialog({
    title: 'Confirm',
    message: 'Deactivate this document type?',
    cancel: true
  }).onOk(() => {
    store.dispatch('merchantDocumentTypes/DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE', row.id)
  })
}

function fnManagemerchantTypes () {
  toggleMerchantTypes.value = !toggleMerchantTypes.value
}

function fnManagemerchanDocumentTypes () {
  toggleMerchantdocumentTypes.value = !toggleMerchantdocumentTypes.value
}

function editMerchantSubDocumentType (row) {
  propRowDetails.value = row || null
  toggleMerchantSubdocumentTypes.value = !toggleMerchantSubdocumentTypes.value
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
