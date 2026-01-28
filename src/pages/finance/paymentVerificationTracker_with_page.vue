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
        <!--END: table title -->
        <!-- table payment verification tracker -->
        <q-table
          table-class="customTableClass"
          :rows="tableData"
          :columns="columns"
          row-key="field"
          color="grey-9"
          :filter="filter"
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
              <q-td auto-width key="id" :props="props">
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
              <q-td auto-width key="createdBy" :props="props">{{ props.row.createdBy?.name }}</q-td>
              <q-td auto-width key="leadName" :props="props">{{ props.row.leadName }}</q-td>

              <q-td auto-width key="leadAddress" :props="props">
                {{ props.row.leadAddress == "null" ? '' : props.row.leadAddress }}
                <p class="capitalize no-margin">{{props.row.city}}, {{props.row.state}}</p>
              </q-td>

              <q-td auto-width key="state" :props="props">{{ props.row.state }}</q-td>

              <q-td auto-width key="leadSource" :props="props">{{props.row.leadSource?.sourceName}}</q-td>

              <q-td
                auto-width
                key="device"
                :props="props"
              >{{ props.row.deviceCount }}-{{ props.row.device?.deviceName }}</q-td>

              <q-td auto-width key="action" :props="props">
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
                  @click="financeApproveSubmit(props.row.id)"
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
                  v-if="!props.row.plan?.planName"
                >NA</div>
                <div class="text-left" v-else>{{ props.row.plan?.planName }}</div>
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
                        <div style="display: none;">
                          <img
                            :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.paymentDocumentFile"
                            ref="multiAttachedImageViewer"
                            style="max-width:100%"
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
                <div v-else class="text-left">NA</div>
              </q-td>
              <q-td>
                <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Date</div>
                <div
                  class="text-left"
                  v-if="!props.row.paymentMadeon"
                >NA</div>
                <div class="text-left" v-else>{{ formatDate(props.row.paymentMadeon) }}</div>
              </q-td>
              <q-td>
                <div class="text-left q-caption text-grey-8 text-weight-medium">Payment Reference</div>
                <div
                  class="text-left"
                  v-if="!props.row.referenceNumber"
                >NA</div>
                <div class="text-left" v-else>{{ props.row.referenceNumber }}</div>
              </q-td>
              <q-td colspan="2">
                <div
                  class="text-left q-caption text-grey-8 text-weight-medium"
                >Document Uploaded by SAT</div>
                <div
                  class="text-left"
                  v-if="fnShowCellIfBankSubvention(props.row.leadVerificationStatus)"
                >
                  <div
                    v-if="fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0]?.mimeType?.includes('pdf')"
                    class="cursor-pointer"
                  >
                    <div
                      @click="fnPDFViewModal(fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0]?.bankAttachedFile)"
                    >
                      <q-icon name="fas fa-file-pdf" color="primary" />
                      &nbsp;{{fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0]?.bankAttachedFile}}
                    </div>
                  </div>
                  <div
                    v-else-if="fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0]?.mimeType?.includes('image')"
                    class="cursor-pointer"
                  >
                    <div
                      @click="fnViewMultiAttachedFileImageUploadedBySat(fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0])"
                    >
                      <div style="display: none;">
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0]?.bankAttachedFile"
                          ref="multiAttachedImageViewerUploadedBySAT"
                          style="max-width:100%"
                        />
                      </div>
                      <q-icon name="fas fa-image" color="amber-9" />
                      &nbsp;{{fnShowBankUploadedDocumentBySat(props.row.leadVerificationStatus)[0]?.bankAttachedFile}}
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
                label="Search"
                class="q-mr-lg q-py-sm"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <!--END: table search -->
          </template>
          <!--END: table search, filter -->
        </q-table>
      </q-pull-to-refresh>

      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
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
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import _ from 'lodash';

dayjs.extend(advancedFormat);

export default defineComponent({
  name: "paymentVerificationTrackerModule",
  components: {
    openRejectModelComp,
    showPdfModalComponent,
    generalLeadInformation
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const toggleshowPDFModal = ref(false);
    const PDFDetails = ref("");
    const paginationControl = reactive({
      rowsNumber: 10,
      page: 1,
      rowsPerPage: 10,
      sortBy: null,
      descending: false
    });
    const propsRejectAppend = ref([]);
    const showRejectModel = ref(false);
    const filter = ref("");
    const tableData = ref([]);

    // Computed properties
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
    const getPaymentTrackerInfo = computed(() => store.getters["Finance/getPaymentTrackerInfo"]);

    // Columns definition
    const columns = [
      {
        name: "id",
        required: true,
        label: "Lead Number",
        align: "left",
        field: row => {
          return "# " + row.leadNumber;
        },
        sortable: true
      },
      {
        name: "createdBy",
        required: true,
        label: "SO Name",
        align: "left",
        field: row => {
          return row.createdBy?.name || '';
        },
        sortable: true
      },
      {
        name: "leadName",
        required: true,
        label: "Merchant Name",
        align: "left",
        field: "leadName",
        sortable: true
      },
      {
        name: "leadAddress",
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
        name: "leadSource",
        required: true,
        label: "Lead Source/Bank Name",
        align: "left",
        field: row => row.leadSource?.sourceName || '',
        sortable: true
      },
      {
        name: "device",
        required: true,
        label: "Device Type & Count",
        align: "left",
        field: row => `${row.deviceCount || 0}-${row.device?.deviceName || ''}`,
        sortable: true
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "center",
        field: "action",
        sortable: true
      }
    ];

    // Methods
    const onRefresh = (done) => {
      ajaxLoadAllPaymentTrackerInfo({ pagination: paginationControl, filter: filter.value })
        .finally(() => done());
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
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
        .catch(error => {
          console.error(error);
          $q.loading.hide();
        });
    };

    const reloadPaymentTrackerData = () => {
      ajaxLoadAllPaymentTrackerInfo({ pagination: paginationControl, filter: filter.value });
    };

    const openRejectModel = (exceptionDetails) => {
      showRejectModel.value = !showRejectModel.value;
      propsRejectAppend.value = exceptionDetails;
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
            reloadPaymentTrackerData();
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
      console.log(documentUrl);
      PDFDetails.value = documentUrl;
      toggleshowPDFModal.value = !toggleshowPDFModal.value;
    };

    const fnViewMultiAttachedFileImage = (row) => {
      if (row.paymentDocumentFile) {
        const url = GLOBAL_FILE_FETCH_URL.value + '/' + row.paymentDocumentFile;
        window.open(url, '_blank');
      }
    };

    const fnViewMultiAttachedFileImageUploadedBySat = (document) => {
      if (document?.bankAttachedFile) {
        const url = GLOBAL_FILE_FETCH_URL.value + '/' + document.bankAttachedFile;
        window.open(url, '_blank');
      }
    };

    const fnShowCellIfBankSubvention = (rowDetails) => {
      const VERIFICATION_TYPE_BANKSUBVENTION = 1; // Replace with actual constant
      const returnValue = _.filter(rowDetails, (value) => {
        return value.verificationType === VERIFICATION_TYPE_BANKSUBVENTION;
      });
      return returnValue.length > 0;
    };

    const fnShowBankUploadedDocumentBySat = (rowDetails) => {
      const VERIFICATION_TYPE_BANKSUBVENTION = 1; // Replace with actual constant
      const returnValue = _.filter(rowDetails, (value) => {
        return (
          value.verificationType === VERIFICATION_TYPE_BANKSUBVENTION &&
          value.status
        );
      });
      return returnValue;
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadAllPaymentTrackerInfo({
        pagination: paginationControl,
        filter: filter.value
      });
    });

    return {
      // State
      propToggleLeadInformation,
      addtnLeadInformation,
      toggleshowPDFModal,
      PDFDetails,
      paginationControl,
      propsRejectAppend,
      showRejectModel,
      filter,
      tableData,
      columns,
      
      // Computed
      GLOBAL_FILE_FETCH_URL,
      
      // Methods
      onRefresh,
      toggleLeadInformation,
      ajaxLoadAllPaymentTrackerInfo,
      reloadPaymentTrackerData,
      openRejectModel,
      financeApproveSubmit,

      formatDate,
      fnPDFViewModal,
      fnViewMultiAttachedFileImage,
      fnViewMultiAttachedFileImageUploadedBySat,
      fnShowCellIfBankSubvention,
      fnShowBankUploadedDocumentBySat
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