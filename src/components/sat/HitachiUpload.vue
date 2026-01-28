<template>
  <q-page class="q-pa-md">
    <!-- DOWNLOAD BUTTON -->
    <div class="row justify-end q-mb-lg">
      <q-btn
        icon="add"
        class="common-btn"
        label="Download"
        @click="toggleHitachiDownload"
      />
    </div>

    <!-- TEMPLATE DOWNLOAD -->
    <q-card class="q-mb-lg">
      <q-card-section class="text-center">
        <a
          href="statics/files/Hitachi_Brand_Emi_Details.xlsx"
          class="hide-underline"
        >
          Click here to download the template
        </a>
      </q-card-section>

      <!-- FILE UPLOAD -->
      <q-card-section class="text-center">
        <div
          v-if="formData.fileSelected.length === 0"
          :class="[
            uploaderHovered
              ? 'toggleBulkUploadDisable'
              : 'toggleBulkUploadActive',
            'drop',
            'cursor-pointer'
          ]"
          @dragover.prevent="setUploaderHover(true)"
          @dragleave.prevent="setUploaderHover(false)"
          @drop.prevent="onDrop"
        >
          <label class="cursor-pointer">
            Drag & Drop or click here to open a file
            <input
              type="file"
              class="hidden"
              @change="onChange"
              accept=".csv,.xlsx,.xls"
            />
          </label>
        </div>

        <q-card v-else dense class="q-mt-md">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="attach_file" class="q-mr-sm" />
              {{ formData.fileSelected[0].name }}
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              outline
              size="sm"
              color="negative"
              label="Remove"
              icon="close"
              @click="removeBulkUploadFile"
            />
          </q-card-actions>
        </q-card>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="common-btn"
          label="Upload"
          @click="uploadFileForBulkUpload"
        />
      </q-card-actions>
    </q-card>

    <!-- HITACHI DOWNLOAD MODAL -->
    <HitachiDownload
      v-if="showHitachiDownload"
      :propHitachiDownload="showHitachiDownload"
      @emitfnshowHitachiDownload="toggleHitachiDownload"
    />

    <!-- LEAD INFORMATION POPUP -->
    <generalLeadInformation
      v-if="showLeadInfo"
      :leadInformation="selectedLeadInfo"
      :propToggleLeadInformationPop="showLeadInfo"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- TABLE -->
    <q-table
      :rows="tableData"
      :columns="columns"
      row-key="tid"
      :pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onTableRequest"
      class="customTableClass"
    >
      <!-- SEARCH -->
      <template #top>
        <q-input
          filled
          debounce="300"
          v-model="filter"
          label="Search Using MID"
          class="q-mb-md"
        />
      </template>

      <!-- LEAD NUMBER -->
      <template #body-cell-leadNumber="props">
        <q-td
          :props="props"
          class="text-primary cursor-pointer"
          @click="toggleLeadInformation(props.row.leadInformation)"
        >
          # {{ props.row.leadInformation?.leadNumber }}
        </q-td>
      </template>

      <!-- HITACHI STATUS -->
      <template #body-cell-HitachiStatus="props">
        <q-td :props="props">
          {{ props.row.hitachiLeadStatus || 'NA' }}
        </q-td>
      </template>

      <!-- SERIAL -->
      <template #body-cell-deviceSer="props">
        <q-td :props="props">
          {{ props.row.regionalInventory?.serialNumber || 'NA' }}
        </q-td>
      </template>

      <!-- REGION -->
      <template #body-cell-region="props">
        <q-td :props="props">
          {{ props.row.leadInformation?.region?.regionAreaName || 'NA' }}
        </q-td>
      </template>
    </q-table>

    <!-- GLOBAL LOADER -->
    <q-inner-loading :showing="loading">
      <q-spinner-bars color="purple-9" size="40px" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import HitachiDownload from 'components/sat/HitachiDownload.vue'
import generalLeadInformation from 'components/generalLeadInformation.vue'

const $q = useQuasar()
const store = useStore()

/* STATE */
const showHitachiDownload = ref(false)
const showLeadInfo = ref(false)
const selectedLeadInfo = ref(null)

const uploaderHovered = ref(false)
const loading = ref(false)
const filter = ref('')

const formData = ref({
  fileSelected: []
})

const tableData = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

/* TABLE COLUMNS */
const columns = [
  { name: 'mid', label: 'MID', field: 'mid', sortable: true },
  { name: 'tid', label: 'TID', field: 'tid', sortable: true },
  { name: 'leadNumber', label: 'Lead Id' },
  { name: 'HitachiStatus', label: 'Hitachi Lead Status' },
  { name: 'deviceSer', label: 'Serial Number' },
  { name: 'region', label: 'Region' }
]

/* METHODS */
const toggleHitachiDownload = () => {
  showHitachiDownload.value = !showHitachiDownload.value
}

const toggleLeadInformation = (lead) => {
  selectedLeadInfo.value = lead || null
  showLeadInfo.value = !showLeadInfo.value
}

const setUploaderHover = (val) => {
  uploaderHovered.value = val
}

const onDrop = (e) => {
  formData.value.fileSelected = e.dataTransfer.files
  validateFile()
}

const onChange = (e) => {
  formData.value.fileSelected = e.target.files
  validateFile()
}

const validateFile = () => {
  const file = formData.value.fileSelected[0]
  if (!file || !/(\.csv|\.xlsx|\.xls)$/i.test(file.name)) {
    formData.value.fileSelected = []
    $q.notify({ type: 'negative', message: 'Invalid file format' })
  }
}

const removeBulkUploadFile = () => {
  formData.value.fileSelected = []
}

const uploadFileForBulkUpload = async () => {
  if (!formData.value.fileSelected.length) {
    $q.notify({ type: 'warning', message: 'Please upload file' })
    return
  }

  const fd = new FormData()
  fd.append('file', formData.value.fileSelected[0])

  try {
    await store.dispatch('InventoryBulkUploadDevice/UPLOAD_EMI_DATAS', { file: fd })
    formData.value.fileSelected = []
    $q.notify({ type: 'positive', message: 'Successfully added!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Upload failed' })
  }
}

const onTableRequest = async ({ pagination: p, filter }) => {
  loading.value = true
  await store.dispatch('hitachi/FETCH_HITACHI_EMI_DATAS', { pagination: p, filter })
  const data = store.getters['hitachi/gethitachiEmiData']
  tableData.value = data.content
  pagination.value.rowsNumber = data.totalElements
  loading.value = false
}

onMounted(() => {
  onTableRequest({ pagination: pagination.value, filter: '' })
})
</script>

<style scoped>
.drop {
  padding: 20px;
  background: #f6f6f6;
  border-radius: 4px;
}
.toggleBulkUploadActive {
  border: 3px dashed #ccc;
}
.toggleBulkUploadDisable {
  border: 3px dashed #61116a;
}
.hide-underline {
  text-decoration: none;
}
.hidden {
  display: none;
}
</style>
