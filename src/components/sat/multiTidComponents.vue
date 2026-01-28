<template>
  <div>
    <q-card dense class="q-pa-xs">
      <q-dialog v-model="toggleModel" persistent :maximized="false">
        <q-card class="customModalOverlay" style="min-width: 70vw; padding: 100px">
          <!-- Header -->
          <div class="q-title q-px-lg q-py-md text-center justify-center text-weight-regular bottom-border text-grey-9 row items-center">
            <div class="col q-title">Base-Tid Configurations</div>
            <div class="col-auto">
              <q-btn round @click="goToValidationPage" outline color="dark" icon="clear" />
            </div>
          </div>

          <!-- Base TID Section -->
          <div v-if="baseTidFlag" class="q-pa-md">
            <q-btn color="primary" class="q-ma-xs" icon="check" @click="fnCreateOrGetBaseTid" label="Create Base TID" />
          </div>

          <!-- Sub-TID Section -->
          <div v-if="SubTidField">
            <q-card flat class="q-pa-md">
              <q-card-subtitle class="text-weight-bold text-grey-9 row q-px-md q-py-md items-center">
                <span class="col">Base-Tid Configurations</span>
                <q-btn color="green" @click="getSubTidConfOrCreateSubTids">Generate Sub-Tid</q-btn>
              </q-card-subtitle>
              <q-card-separator />
              <q-collapsible v-for="menu in baseAndSubTidList" :key="menu.id" :label="menu.baseTidList.tid" opened flat class="q-ma-xs">
                <q-card flat>
                  <table class="q-pa-sm" style="width:100%; border-collapse: collapse;">
                    <thead>
                      <tr style="border-bottom: 1px solid #e7e7e7">
                        <th>Institution</th>
                        <th>Lead Source</th>
                        <th>Host Name</th>
                        <th>RRID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="sub in menu.subTidConfsList" :key="sub.id">
                        <td>{{ sub.institution.institutionName }}</td>
                        <td>{{ sub.leadSource.sourceName }}</td>
                        <td>{{ sub.masterHost.name }}</td>
                        <td>{{ sub.institution.institutionRRCode }}|{{ sub.masterHost.hostRRCode }}|{{ sub.leadSource.sourceCode }}</td>
                      </tr>
                    </tbody>
                  </table>
                </q-card>
              </q-collapsible>
            </q-card>
          </div>

          <!-- List All Sub TID Details -->
          <div v-if="genSubTidFlag && !SubTidField" class="q-pa-md">
            <q-card flat>
              <q-card-subtitle class="text-weight-bold text-grey-9 row q-px-md q-py-md items-center">
                <span class="col">List All Sub TID Details</span>
              </q-card-subtitle>
              <q-card-separator />
              <q-table
                :rows="listAllSubTidDetails"
                :columns="columns"
                row-key="name"
                :rows-per-page-options="[1,3,5,7,9,12,15]"
                table-class="customTableClass"
                class="payment_verification_table capitalize"
              >
                <template v-slot:body-cell-baseTid="props">
                  <span class="label text-primary">{{ props.row.baseTid ?? "NA" }}</span>
                </template>

                <template v-slot:body-cell-action="props">
                  <q-btn highlight push class="q-mx-sm" color="positive" size="sm" 
                    @click="finalFormSubmit(props.row)"
                    :disabled="props.row.submittedToMars">
                    Submit To Mars
                  </q-btn>
                </template>
              </q-table>
              <q-btn color="primary" :disabled="fndisable" class="q-mt-md" @click="finalSubmit" label="Final Submit" />
            </q-card>
          </div>
        </q-card>
      </q-dialog>
    </q-card>

    <!-- Payment Mode Component -->
    <multiTidPaymentMode 
      v-if="showRejectPaymentMode"
      :showRejectPaymentMode="showRejectPaymentMode"
      :propShowRejectComponent="propsRejectAppend"
      @closeRejectModel="finalFormSubmit"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import multiTidPaymentMode from "./multiTidPaymentMode.vue";
import { useStore } from "vuex";

export default {
  name: "MultiTidComponent",
  components: { multiTidPaymentMode },
  props: ["multiTidComponentDetails", "propTogglemultiTidComponentDetails"],

  setup(props) {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const toggleModel = ref(props.propTogglemultiTidComponentDetails);
    const showRejectPaymentMode = ref(false);
    const baseAndSubTidList = ref([]);
    const listAllSubTidDetails = ref([]);
    const genSubTidFlag = ref(false);
    const SubTidField = ref(false);
    const baseTidFlag = ref(false);

    const merchant = reactive({ ...props.multiTidComponentDetails.merchant });
    const propLeadDeatils = reactive({ ...props.multiTidComponentDetails.propLeadDeatils });
    const leadId = ref(props.multiTidComponentDetails.leadId);
    const holdPayment = ref(props.multiTidComponentDetails.holdPayment);

    const propsRejectAppend = reactive({
      data: {},
      holdPayment: "",
      merchant: {},
      propLeadDeatils: {},
      leadId: "",
      diners: {}
    });

    const columns = ref([
      { name: 'tid', label: 'Tid', field: row => row.tid ?? "NA", sortable: true },
      { name: 'mid', label: 'Mid', field: row => row.mid ?? "NA", sortable: true },
      { name: 'baseTid', label: 'BaseTid', field: 'baseTid', sortable: true },
      { name: 'institutionCode', label: 'Institution Code', field: 'institutionCode', sortable: true },
      { name: 'subTid', label: 'SubTid', field: 'subTid', sortable: true },
      { name: 'tidIdentifier', label: 'Tid Identifier', field: 'tidIdentifier', sortable: true },
      { name: 'action', label: '', field: 'action', sortable: true, align: 'center' }
    ]);

    // Computed
    const fndisable = computed(() => {
      if (!listAllSubTidDetails.value.length) return true;
      return !listAllSubTidDetails.value.every(item => item.submittedToMars);
    });

    // Methods
    const goToValidationPage = () => {
      $q.router.push({ name: "leadValidation" });
    };

    const loadBaseTidList = async () => {
      try {
        const response = await store.dispatch("leadInformationVasMapping/GET_BASE_TID_LIST", merchant);
        if (response.status === 200) {
          $q.notify({ color: "positive", position: "bottom", message: response.body.message, icon: "thumb_up" });
          baseAndSubTidList.value = response.body.data.baseTids.map(bTids => ({
            baseTidList: bTids,
            subTidConfsList: response.body.data.subTidConfs
          }));
          baseTidFlag.value = false;
          SubTidField.value = true;
        } else {
          $q.notify({ color: "negative", position: "bottom", message: "Something went wrong!", icon: "clear" });
        }
      } catch {
        baseTidFlag.value = true;
        SubTidField.value = false;
      }
    };

    const fnCreateOrGetBaseTid = async () => {
      try {
        const response = await store.dispatch("leadInformationVasMapping/CREATE_BASE_TID", merchant);
        if (response.status === 200) {
          $q.notify({ color: "positive", position: "bottom", message: response.message, icon: "thumb_up" });
          baseTidFlag.value = false;
          SubTidField.value = true;
          await loadBaseTidList();
        } else {
          $q.notify({ color: "negative", position: "bottom", message: "Something went wrong!", icon: "clear" });
        }
      } catch (err) {
        baseTidFlag.value = true;
        SubTidField.value = false;
        $q.notify({ color: "negative", position: "bottom", message: err.body?.message ?? "Base TID creation failed!", icon: "clear" });
      }
    };

    const finalSubmit = () => {
      // Simulates status update
      $q.router.push({ name: "leadValidation" });
    };

    const finalFormSubmit = (request) => {
      showRejectPaymentMode.value = !showRejectPaymentMode.value;
      propsRejectAppend.holdPayment = holdPayment.value;
      propsRejectAppend.data = request;
      propsRejectAppend.merchant = merchant;
      propsRejectAppend.propLeadDeatils = propLeadDeatils;
      propsRejectAppend.leadId = leadId.value;
      propsRejectAppend.diners = merchant.mdrPlan?.diners;
    };

    onMounted(() => {
      loadBaseTidList();
    });

    return {
      toggleModel,
      showRejectPaymentMode,
      baseAndSubTidList,
      listAllSubTidDetails,
      genSubTidFlag,
      SubTidField,
      baseTidFlag,
      merchant,
      propLeadDeatils,
      leadId,
      columns,
      fndisable,
      goToValidationPage,
      fnCreateOrGetBaseTid,
      finalSubmit,
      finalFormSubmit,
      propsRejectAppend
    };
  }
};
</script>

<style scoped>
label {
  padding: 10px;
  display: table;
}

input[type="file"] {
  display: none;
}
</style>
