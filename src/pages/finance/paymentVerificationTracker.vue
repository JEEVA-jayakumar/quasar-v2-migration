<template>
  <q-page>
    <div>
      <q-pull-to-refresh @refresh="onRefresh" inline>
        <!--START: table title -->
        <div
          class="col-md-12 capitalize q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >
          Finance
        </div>
        <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" @update:model-value="goToQrMerchant">
          <q-tab name="tab-1" label="Pos Merchant" />
          <q-tab name="tab-2" label="QR Merchant" />
        </q-tabs>

        <!--END: table title -->
        <!-- table payment verification tracker -->
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <q-table
              table-class="customTableClass"
              :rows="tableData"
              :columns="columns"
              :filter="filter"
              row-key="field"
              color="grey-9"
              v-model:pagination="paginationControl"
              :rows-per-page-options="[5,10,15,20]"
              @request="ajaxLoadAllPaymentTrackerInfo"
              table-style="word-break: break-all"
              class="payment_verification_table capitalize"
            >
              <!--START: table header -->
              <template #header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                </q-tr>
              </template>
              <!--END: table header -->
              <!--START: Table body -->
              <template #body="props">
                <!--START: table rows -->
                <q-tr :props="props" class="bottom-border">
                  <!--START: table expand button :Checkbox -->
                  <q-td key="leadInformation.leadNumber" :props="props">
                    <q-checkbox
                      color="grey-9"
                      v-model="props.row.expand"
                      checked-icon="fas fa-chevron-up"
                      unchecked-icon="fas fa-chevron-down"
                      class="q-mr-md"
                      @update:model-value="expandRowPlease(props.row)"
                    />
                    <span
                      class="cursor-pointer"
                      :class="[props.row.priority?'text-negative text-weight-bolder':'text-primary']"
                      @click.prevent="toggleLeadInformation(props.row)"
                    ># {{ props.row.leadNumber }}</span>
                  </q-td>
                  <!--END: table expand button :Checkbox -->
                  <!--START: table other data -->
                  <q-td key="assignedTo.name" :props="props">{{ props.row.name }}</q-td>
                  <q-td key="leadInformation.leadName" :props="props">{{ props.row.leadName }}</q-td>
                  <q-td key="leadInformation.leadAddress" :props="props">{{props.row.leadAddress }}</q-td>
                  <q-td key="state" :props="props">{{ props.row.state }}</q-td>
                  <q-td key="leadSource.sourceName" :props="props">{{props.row.leadSource}}</q-td>
                  <q-td
                    key="deviceCount"
                    :props="props"
                  >{{ props.row.deviceCount }}-{{ props.row.deviceName }}</q-td>

                  <q-td key="action" :props="props">
                    <q-btn
                      highlight
                      push
                      outline
                      class="q-mx-sm"
                      color="negative"
                      @click="openRejectModel(props.row)"
                      size="sm"
                    >Reject</q-btn>
                    <q-btn
                      highlight
                      push
                      outline
                      class="q-mx-sm"
                      color="purple-9"
                      size="sm"
                      @click="financeApproveSubmit(props.row.leadId)"
                    >Approve</q-btn>
                  </q-td>
                  <!--END: table other data -->
                </q-tr>
                <!--END: table rows -->
                <!-- START: table expand values -->
                <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Rental Plan</div>
                    <div
                      class="text-left"
                      v-if="props.row.planName == '' || props.row.planName == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ props.row.planName }}</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Amount Collected</div>
                    <div class="text-left" v-if="props.row.amountCollected == null">NA</div>
                    <div class="text-left" v-else>{{ props.row.amountCollected }}</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Type</div>
                    <div v-if="props.row.paymentOption == 2" class="text-left">
                      <div>Cheque</div>
                      <div v-if="props.row.paymentDocumentMimeType != null">
                        <div
                          v-if="props.row.paymentDocumentMimeType.includes('pdf')"
                          class="cursor-pointer"
                        >
                          <div @click="fnPDFViewModal(props.row.paymentDocumentFile)">
                            <q-icon name="fas fa-file-pdf" color="primary" />
                            &nbsp;{{props.row.paymentDocumentFile}}
                          </div>
                        </div>
                        <div
                          v-else-if="props.row.paymentDocumentMimeType.includes('image')"
                          class="cursor-pointer"
                        >
                          <div @click="fnViewMultiAttachedFileImage(props.row)">
                            <div>
                              <img
                                :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.paymentDocumentFile"
                                style="display: none; max-width:100%"
                                ref="multiAttachedImageViewer"
                              />
                            </div>
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{props.row.paymentDocumentFile}}
                          </div>
                        </div>
                        <div v-else>No document attached</div>
                      </div>
                    </div>
                    <div v-else-if="props.row.paymentOption == 3" class="text-left">Swipe</div>
                    <div v-else-if="props.row.paymentOption == 1" class="text-left">NEFT</div>
                    <div v-else-if="props.row.paymentOption == 4" class="text-left">UPI LINK</div>
                    <div v-else class="text-left">NA</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Date</div>
                    <div
                      class="text-left"
                      v-if="props.row.paymentMadeon == '' || props.row.paymentMadeon == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ formatDate(props.row.paymentMadeon) }}</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Reference</div>
                    <div
                      class="text-left"
                      v-if="props.row.referenceNumber == '' || props.row.referenceNumber == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ props.row.referenceNumber }}</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Ref.No Count</div>
                    <div
                      class="text-left"
                      v-if="props.row.referenceNumbercount == '' || props.row.referenceNumbercount == null"
                    >
                      <q-chip square color="purple">NA</q-chip>
                    </div>
                    <div class="text-left" v-else>
                      <q-chip square color="purple">{{ props.row.referenceNumbercount }}</q-chip>
                    </div>
                  </q-td>
                  <q-td colspan="2">
                    <div
                      class="text-left q-caption text-grey-8 text-weight-medium"
                    >Document Uploaded by SAT</div>
                    <div
                      class="text-left"
                      v-if="props.row.leadVerificationStatusMimeType != '' && props.row.leadVerificationStatusMimeType != null"
                    >
                      <div
                        v-if="props.row.leadVerificationStatusMimeType.includes('pdf')"
                        class="cursor-pointer"
                      >
                        <div @click="fnPDFViewModal(props.row.leadVerificationStatusBankAttachedFile)">
                          <q-icon name="fas fa-file-pdf" color="primary" />
                          &nbsp;{{props.row.leadVerificationStatusBankAttachedFile}}
                        </div>
                      </div>
                      <div
                        v-else-if="props.row.leadVerificationStatusMimeType.includes('image')"
                        class="cursor-pointer"
                      >
                        <div
                          @click="fnViewMultiAttachedFileImageUploadedBySat(props.row.leadVerificationStatusBankAttachedFile)"
                        >
                          <div>
                            <img
                              :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.leadVerificationStatusBankAttachedFile"
                              style="display: none; max-width:100%"
                              ref="multiAttachedImageViewerUploadedBySAT"
                            />
                          </div>
                          <q-icon name="fas fa-image" color="amber-9" />
                          &nbsp;{{props.row.leadVerificationStatusBankAttachedFile}}
                        </div>
                      </div>
                      <div v-else>No document attached</div>
                    </div>
                    <div v-else>NA</div>
                  </q-td>
                </q-tr>
                <!--END: table expand values -->
              </template>
              <!--END: Table body -->
              <!--START: table search, filter -->
              <template #top>
                <!--START: table search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filter"
                    placeholder="Type.."
                    label="Search .. "
                    class="q-mr-lg q-py-sm"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <!--END: table search -->
                <!--START: table filter dropdown -->
                <div class="col-md-3"></div>
                <!--END: table filter dropdown -->
              </template>
              <!--END: table search, filter -->
            </q-table>
          </q-tab-panel>
          
          <q-tab-panel name="tab-2">
            <q-table
              table-class="customTableClass"
              :rows="tableData1"
              :columns="columns1"
              :filter="filter1"
              row-key="field"
              color="grey-9"
              v-model:pagination="paginationControl1"
              :rows-per-page-options="[5,10,15,20]"
              @request="ajaxLoadAllPaymentTrackerInfo1"
              table-style="word-break: break-all"
              class="payment_verification_table capitalize"
            >
              <!--START: table header -->
              <template #header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                </q-tr>
              </template>
              <!--END: table header -->
              <!--START: Table body -->
              <template #body="props">
                <!--START: table rows -->
                <q-tr :props="props" class="bottom-border">
                  <!--START: table expand button :Checkbox -->
                  <q-td key="qrLeadNumber" :props="props">
                    <q-checkbox
                      color="grey-9"
                      v-model="props.row.expand"
                      checked-icon="fas fa-chevron-up"
                      unchecked-icon="fas fa-chevron-down"
                      class="q-mr-md"
                      @update:model-value="expandQrRowPlease(props.row)"
                    />
                    <span
                      class="cursor-pointer"
                      :class="[props.row.priority?'text-negative text-weight-bolder':'text-primary']"
                      @click.prevent="toggleQrLeadInformation(props.row)"
                    ># {{ props.row.qrLeadNumber }}</span>
                  </q-td>
                  <!--END: table expand button :Checkbox -->
                  <!--START: table other data -->
                  <q-td key="createdBy.name" :props="props">{{ props.row.createdBy?.name }}</q-td>
                  <q-td key="leadInformation.marketingName" :props="props">{{ props.row.marketingName }}</q-td>
                  <q-td key="leadInformation.contactAddress" :props="props">{{props.row.contactAddress }}</q-td>
                  <q-td key="state" :props="props">{{ props.row.state }}</q-td>
                  <q-td key="leadSource.sourceName" :props="props">{{props.row.leadSource?.sourceName}}</q-td>
                  <q-td
                    key="deviceCount"
                    :props="props"
                  >{{ props.row.device == null   ? "NA" : props.row.device.deviceName }}</q-td>

                  <q-td key="action" :props="props">
                    <q-btn
                      highlight
                      push
                      outline
                      class="q-mx-sm"
                      color="negative"
                      @click="openQrRejectModel(props.row)"
                      size="sm"
                    >Reject</q-btn>
                    <q-btn
                      highlight
                      push
                      outline
                      class="q-mx-sm"
                      color="purple-9"
                      size="sm"
                      @click="qrFinanceApproveSubmit(props.row.id)"
                    >Approve</q-btn>
                  </q-td>
                  <!--END: table other data -->
                </q-tr>
                <!--END: table rows -->
                <!-- START: table expand values -->
                <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Rental Plan</div>
                    <div
                      class="text-left"
                      v-if="props.row.plan == '' || props.row.plan == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ props.row.plan?.planName }}</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Type</div>
                    <div v-if="props.row.neftId == '' || props.row.neftId == null " class="text-left">
                      <div>Cheque</div>
                      <div v-if="props.row.paymentDocumentMimeType != null">
                        <div
                          v-if="props.row.paymentDocumentMimeType.includes('pdf')"
                          class="cursor-pointer"
                        >
                          <div @click="fnPDFViewModal(props.row.paymentDocumentFile)">
                            <q-icon name="fas fa-file-pdf" color="primary" />
                            &nbsp;{{props.row.paymentDocumentFile}}
                          </div>
                        </div>
                        <div
                          v-else-if="props.row.paymentDocumentMimeType.includes('image')"
                          class="cursor-pointer"
                        >
                          <div @click="fnViewMultiAttachedQrFile(props.row.paymentDocumentFile)">
                            <div>
                              <img
                                :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.paymentDocumentFile"
                                style="display: none; max-width: 15%"
                                ref="handedOverImageViewerCheque"
                              />
                            </div>
                            <div
                              @click="fnViewHandedOverFileImageCheque()"
                              class="ellipsis"
                            >
                              <q-icon name="fas fa-image" color="amber-9" />
                              &nbsp;{{props.row.paymentDocumentFile}}
                            </div>
                          </div>
                        </div>
                        <div v-else>No document attached</div>
                      </div>
                    </div>
                    <div v-else-if="props.row.paymentDocumentMimeType == null || props.row.paymentDocumentMimeType== '' " class="text-left">NEFT</div>
                    <div v-else class="text-left">NA</div>
                  </q-td>
                  <q-td>
                    <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Reference</div>
                    <div
                      class="text-left"
                      v-if="(props.row.chequeNumber == '' || props.row.chequeNumber == null) && (props.row.neftId == '' || props.row.neftId == null)"
                    >NA</div>
                    <div class="text-left" v-else>
                      {{ ((props.row.chequeNumber != null || props.row.chequeNumber != '') ? props.row.chequeNumber : props.row.neftId) || ((props.row.neftId != null || props.row.neftId != '') ? props.row.neftId : props.row.chequeNumber ) }}
                    </div>
                  </q-td>
                </q-tr>
                <!--END: table expand values -->
              </template>
              <!--END: Table body -->
              <!--START: table search, filter -->
              <template #top>
                <!--START: table search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filter1"
                    placeholder="Type.."
                    label="Search .. "
                    class="q-mr-lg q-py-sm"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <!--END: table search -->
                <!--START: table filter dropdown -->
                <div class="col-md-3"></div>
                <!--END: table filter dropdown -->
              </template>
              <!--END: table search, filter -->
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-pull-to-refresh>
     
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <generalQrLeadInformation
        v-if="propToggleQrLeadInformation"
        :QrleadInformation="addQrLeadInformation"
        :propToggleQrLeadInformationPop="propToggleQrLeadInformation"
        @closeLeadInformation="toggleQrLeadInformation"
      />
      <!--START: Open Reject model -->
      <openRejectModelComp
        v-if="showRejectModel"
        :showRejectModel="showRejectModel"
        :propShowRejectComponent="propsRejectAppend"
        @reloadPaymentTrackerData="reloadPaymentTrackerData"
        @closeRejectModel="openRejectModel"
      ></openRejectModelComp>
      <!--END: Open Reject model -->

      <openQrRejectModelComp
        v-if="showQrRejectModel"
        :showQrRejectModel="showQrRejectModel"
        :propShowQrRejectComponent="propsQRRejectAppend"
        @reloadQrPaymentTrackerData="reloadQrPaymentTrackerData"
        @closeQrRejectModel="openQrRejectModel"
      ></openQrRejectModelComp>

      <!-- START >> COMPONENT: View PDF  -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      ></showPdfModalComponent>
      <!-- END >> COMPONENT: View PDF -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import openRejectModelComp from "../../components/finance/openRejectModelComp.vue";
import openQrRejectModelComp from "../../components/finance/openQrRejectModelComp.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import generalQrLeadInformation from "../../components/generalQrLeadInformation.vue";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export default defineComponent({
  name: "paymentVerificationTrackerModule",
  components: {
    openRejectModelComp,
    openQrRejectModelComp,
    showPdfModalComponent,
    generalLeadInformation,
    generalQrLeadInformation
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const propToggleLeadInformation = ref(false);
    const propToggleQrLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const addQrLeadInformation = ref(null);
    const toggleshowPDFModal = ref(false);
    const PDFDetails = ref("");
    const activeTab = ref("tab-1");
    
    const paginationControl = reactive({
      rowsNumber: 10,
      page: 1,
      sortBy: "leadNumber",
      descending: false,
      rowsPerPage: 10
    });
    
    const paginationControl1 = reactive({
      rowsNumber: 10,
      page: 1,
      sortBy: "qrLeadNumber",
      descending: false,
      rowsPerPage: 10
    });
    
    const propsRejectAppend = ref([]);
    const propsQRRejectAppend = ref([]);
    const showRejectModel = ref(false);
    const showQrRejectModel = ref(false);
    const filter = ref("");
    const filter1 = ref("");
    const tableData = ref([]);
    const tableData1 = ref([]);

    // Computed properties
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
    const getPaymentTrackerInfo = computed(() => store.getters["Finance/getPaymentTrackerInfo"]);
    const getstaticQrPaymentTrackerData = computed(() => store.getters["qrFinance/getstaticQrPaymentTrackerData"]);

    // Columns definitions
    const columns = [
      {
        name: "leadInformation.leadNumber",
        required: true,
        label: "Lead Number",
        align: "left",
        field: row => {
          return "# " + row.leadNumber;
        },
        sortable: true
      },
      {
        name: "assignedTo.name",
        required: true,
        label: "SO Name",
        align: "left",
        field: "name",
        sortable: true
      },
      {
        name: "leadInformation.leadName",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: "leadName",
        sortable: true
      },
      {
        name: "leadInformation.leadAddress",
        required: true,
        label: "Address",
        align: "left",
        field: "leadAddress",
        sortable: true
      },
      {
        name: "state",
        required: true,
        label: "State",
        align: "left",
        field: "state",
        sortable: true
      },
      {
        name: "leadSource.sourceName",
        required: true,
        label: "Lead Source/Bank Name",
        align: "left",
        field: "leadSource",
        sortable: true
      },
      {
        name: "deviceCount",
        required: true,
        label: "Device Type & Count",
        align: "left",
        field: "device",
        sortable: true
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "center",
        field: "action",
        sortable: false
      }
    ];

    const columns1 = [
      {
        name: "qrLeadNumber",
        required: true,
        label: "Lead Number",
        align: "left",
        field: row => {
          return "# " + row.qrLeadNumber;
        },
        sortable: true
      },
      {
        name: "createdBy.name",
        required: true,
        label: "SO Name",
        align: "left",
        field: row => row.createdBy?.name || '',
        sortable: false
      },
      {
        name: "leadInformation.marketingName",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: "marketingName",
        sortable: false
      },
      {
        name: "leadInformation.contactAddress",
        required: true,
        label: "Address",
        align: "left",
        field: "contactAddress",
        sortable: false
      },
      {
        name: "state",
        required: true,
        label: "State",
        align: "left",
        field: "state",
        sortable: false
      },
      {
        name: "leadSource.sourceName",
        required: true,
        label: "Lead Source/Bank Name",
        align: "left",
        field: row => row.leadSource?.sourceName || '',
        sortable: false
      },
      {
        name: "deviceCount",
        required: true,
        label: "Device Type",
        align: "left",
        field: row => row.device?.deviceName || "NA",
        sortable: false
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "center",
        field: "action",
        sortable: false
      }
    ];

    // Methods
    const onRefresh = (done) => {
      if (activeTab.value === "tab-1") {
        ajaxLoadAllPaymentTrackerInfo({ pagination: paginationControl, filter: filter.value }).finally(() => done());
      } else {
        ajaxLoadAllPaymentTrackerInfo1({ pagination: paginationControl1, filter: filter1.value }).finally(() => done());
      }
    };

    const goToQrMerchant = (tab) => {
      if (tab === "tab-2") {
        ajaxLoadAllPaymentTrackerInfo1({
          pagination: paginationControl1,
          filter: filter1.value
        });
      } else {
        ajaxLoadAllPaymentTrackerInfo({
          pagination: paginationControl,
          filter: filter.value
        });
      }
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    const toggleQrLeadInformation = (qrLeadDetails) => {
      propToggleQrLeadInformation.value = !propToggleQrLeadInformation.value;
      if (qrLeadDetails !== undefined) {
        addQrLeadInformation.value = qrLeadDetails;
      }
    };

    const ajaxLoadAllPaymentTrackerInfo = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      return store.dispatch("Finance/FETCH_ALL_PAYMENT_TRACKER_DATA", { pagination, filter })
        .then(() => {
          Object.assign(paginationControl, pagination);
          paginationControl.rowsNumber = getPaymentTrackerInfo.value.totalElements;
          paginationControl.page = getPaymentTrackerInfo.value.number + 1;
          tableData.value = getPaymentTrackerInfo.value.content;

          if (getPaymentTrackerInfo.value.sort && getPaymentTrackerInfo.value.sort.length > 0) {
            paginationControl.sortBy = getPaymentTrackerInfo.value.sort[0].property;
            paginationControl.descending = !getPaymentTrackerInfo.value.sort[0].ascending;
          }
          $q.loading.hide();
        })
        .catch(err => {
          console.error(err);
          $q.loading.hide();
        });
    };

    const ajaxLoadAllPaymentTrackerInfo1 = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });

      return store.dispatch("qrFinance/FETCH_ALL_QR_PAYMENT_TRACKER_DATA", { pagination, filter })
        .then(() => {
          Object.assign(paginationControl1, pagination);
          paginationControl1.rowsNumber = getstaticQrPaymentTrackerData.value.totalElements;
          paginationControl1.page = getstaticQrPaymentTrackerData.value.number + 1;
          tableData1.value = getstaticQrPaymentTrackerData.value.content;

          if (getstaticQrPaymentTrackerData.value.sort && getstaticQrPaymentTrackerData.value.sort.length > 0) {
            paginationControl1.sortBy = getstaticQrPaymentTrackerData.value.sort[0].property;
            paginationControl1.descending = !getstaticQrPaymentTrackerData.value.sort[0].ascending;
          }
          $q.loading.hide();
        })
        .catch(err => {
          console.error(err);
          $q.loading.hide();
        });
    };

    const openRejectModel = (exceptionDetails) => {
      showRejectModel.value = !showRejectModel.value;
      propsRejectAppend.value = exceptionDetails;
    };

    const openQrRejectModel = (exceptionDetails) => {
      showQrRejectModel.value = !showQrRejectModel.value;
      propsQRRejectAppend.value = exceptionDetails;
    };

    const reloadPaymentTrackerData = () => {
      ajaxLoadAllPaymentTrackerInfo({ pagination: paginationControl, filter: filter.value });
    };

    const reloadQrPaymentTrackerData = () => {
      ajaxLoadAllPaymentTrackerInfo1({ pagination: paginationControl1, filter: filter1.value });
    };

    const financeApproveSubmit = (exceptionDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to approve the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing .."
        });

        const usersSelectSync = {
          leadInformation: {
            verifiedFinanceStatus: 1
          },
          leadVerificationStatus: {
            status: 1,
            fieldName: "Finance"
          },
          leadId: exceptionDetails
        };

        store.dispatch("Finance/APPROVE_FINANCE_EXCEPTION", usersSelectSync)
          .then(() => {
            ajaxLoadAllPaymentTrackerInfo({
              pagination: paginationControl,
              filter: filter.value
            });
            $q.loading.hide();
            $q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Approved!",
              icon: "thumb_up"
            });
          })
          .catch(error => {
            $q.loading.hide();
            $q.notify({
              color: "negative",
              position: "bottom",
              message: error.body?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }).onCancel(() => {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "No changes made!",
          icon: "thumb_down"
        });
      });
    };

    const qrFinanceApproveSubmit = (exceptionDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to approve the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing .."
        });

        const qrUsersSelectSync = {
          qrLeadInformation: {
            verifiedFinanceStatus: 1
          },
          qrLeadVerificationStatus: {
            status: 1,
            fieldName: "Finance"
          },
          leadId: exceptionDetails
        };

        store.dispatch("qrFinance/QR_APPROVE_FINANCE_EXCEPTION", qrUsersSelectSync)
          .then(() => {
            ajaxLoadAllPaymentTrackerInfo1({
              pagination: paginationControl1,
              filter: filter1.value
            });
            $q.loading.hide();
            $q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Approved!",
              icon: "thumb_up"
            });
          })
          .catch(error => {
            $q.loading.hide();
            $q.notify({
              color: "negative",
              position: "bottom",
              message: error.body?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }).onCancel(() => {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "No changes made!",
          icon: "thumb_down"
        });
      });
    };



    const formatDate = (date) => {
      if (!date) return 'NA';
      return dayjs(date).format('Do MMM Y');
    };

    const fnPDFViewModal = (documentUrl) => {
      PDFDetails.value = documentUrl;
      toggleshowPDFModal.value = !toggleshowPDFModal.value;
    };

    const fnViewMultiAttachedFileImage = (row) => {
      // Implementation for viewing attached image
      if (row.paymentDocumentFile) {
        const url = GLOBAL_FILE_FETCH_URL.value + '/' + row.paymentDocumentFile;
        window.open(url, '_blank');
      }
    };

    const fnViewMultiAttachedQrFile = (fileUrl) => {
      if (fileUrl) {
        const url = GLOBAL_FILE_FETCH_URL.value + '/' + fileUrl;
        window.open(url, '_blank');
      }
    };

    const fnViewHandedOverFileImageCheque = () => {
      // Implementation for viewing cheque image
    };

    const fnViewMultiAttachedFileImageUploadedBySat = (fileUrl) => {
      if (fileUrl) {
        const url = GLOBAL_FILE_FETCH_URL.value + '/' + fileUrl;
        window.open(url, '_blank');
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadAllPaymentTrackerInfo({
        pagination: paginationControl,
        filter: filter.value
      });
      ajaxLoadAllPaymentTrackerInfo1({
        pagination: paginationControl1,
        filter: filter1.value
      });
    });

    return {
      // State
      propToggleLeadInformation,
      propToggleQrLeadInformation,
      addtnLeadInformation,
      addQrLeadInformation,
      toggleshowPDFModal,
      PDFDetails,
      activeTab,
      paginationControl,
      paginationControl1,
      propsRejectAppend,
      propsQRRejectAppend,
      showRejectModel,
      showQrRejectModel,
      filter,
      filter1,
      tableData,
      tableData1,
      columns,
      columns1,
      
      // Computed
      GLOBAL_FILE_FETCH_URL,
      
      // Methods
      onRefresh,
      goToQrMerchant,
      toggleLeadInformation,
      toggleQrLeadInformation,
      ajaxLoadAllPaymentTrackerInfo,
      ajaxLoadAllPaymentTrackerInfo1,
      openRejectModel,
      openQrRejectModel,
      reloadPaymentTrackerData,
      reloadQrPaymentTrackerData,
      financeApproveSubmit,
      qrFinanceApproveSubmit,
      formatDate,
      fnPDFViewModal,
      fnViewMultiAttachedFileImage,
      fnViewMultiAttachedQrFile,
      fnViewHandedOverFileImageCheque,
      fnViewMultiAttachedFileImageUploadedBySat
    };
  }
});
</script>

<style scoped>
.payment_verification_table i {
  transition: none !important;
}

.q-table tbody td {
  word-wrap: break-word !important;
}
</style>