// START >> Default files are loaded here to avoid async components
import Default_Login from "../layouts/loginLayout.vue";
import Default_Layout from "../layouts/defaultLayout.vue";
import Default_Finance from "../layouts/finance_default.vue";
import Default_BankOps from "../layouts/bank_ops_default.vue";
import Default_Inventory from "../layouts/inventoryLayout.vue";
import Default_SuperAdmin from "../layouts/super_admin_default.vue";
import Default_OpsHead from "../layouts/ops_head_default.vue";
import Default_SalesManager from "../layouts/sales_manager_default.vue";
import error_404 from "../pages/404Error.vue";
import error_500 from "../pages/500Error.vue";
import error_403 from "../pages/403Error.vue";
// END >> Default files are loaded here to avoid async components

// START >> LOGIN pages are loaded here to avoid async
import Login from "../pages/loginPages.vue";
import PasswordRecovery from "../pages/passwordRecovery.vue";
// END >> LOGIN pages are loaded here to avoid async
// import login from "../pages/sat/login";

// START >> SAT pages are loaded here to avoid async
import AuDocument from "../pages/sat/auDocument.vue";
import SatDashboard from "../pages/sat/dashboardSat.vue";
import LeadDataEntryScreen from "../pages/sat/leaddataentryscreen.vue";
import LeadInformation from "../pages/sat/leadInformation.vue";
import LeadDataEntryScreen1 from "../pages/sat/leaddataentryScreen1.vue";
import DeviceList from "../pages/sat/deviceList.vue";
import LeadValidation from "../pages/sat/leadValidation.vue";
import aggOpenMerchTracker from '../pages/sat/aggOpenMerchTracker.vue';
import hitachiDetails from '../pages/sat/hitachiDetails.vue';
import equitasSoundboxOnboarding from '../pages/sat/equitasSoundboxOnboarding.vue'
// import AggregatorInventory from "../pages/sat/AggregatorInventory.vue";
import aggregatorLeadValidation from "../pages/sat/aggregatorLeadValidation.vue";
import Changemanagement from "../pages/sat/changemanagement.vue";
import Changemanagementterminal from "../pages/sat/changemanagementterminal.vue";
import BijlipaySat from "../pages/sat/BijlipaySat.vue";
import deactivelist from "../pages/sat/DeactiveList.vue"
import AggregatorSat from "../pages/sat/AggregatorSat.vue";
import ChangemanagementEditData from "../pages/sat/changemanagementeditdata.vue";
import ChangemanagementEditDataKyc from "../pages/sat/changemanagementeditdatakyc.vue";
import ChangemanagementEditDatareject from "../pages/sat/changemanagementeditdatareject.vue";
import ChangemanagementEditDatarejectrsm from "../pages/sat/changemanagementeditdatarsmreject.vue";
import ChangemanagementEditDatarejectfinance from "../pages/sat/changemanagementeditdatafinancereject.vue";
import deviceDeployementEditData from "../pages/sat/devicedeployement.vue";
import TestingRecovery from "../pages/sat/TestingRecovery.vue";
import PhonepeSparePartsSoPodList from "../pages/sat/PhonepeSparePartsSoPodList.vue";
import Other from "../pages/sat/OtherOther.vue";
import ShortLead from "../pages/sat/shortLead.vue";
import qrShortLead from '../pages/sat/QrShortLead.vue'
import AppShortLead from "../pages/sat/appshortlead.vue"
import LeadDataEntry from "../pages/sat/leadDataEntry.vue";
import ExceptionQueue from "../pages/sat/exceptionQueue.vue";
import ExceptionQueueKYCLeadDetails from "../pages/sat/exceptionQueueKycLeadDetails.vue";
import ExceptionQueueBankLeadDetails from "../pages/sat/exceptionQueueBankLeadDetails.vue";
import ExceptionQueuePricingLeadDetails from "../pages/sat/exceptionQueuePricingLeadDetails.vue";
import updateRegionalRejectPods from "../pages/sat/updateRegionalRejectPods.vue";
import OpenMerchantTracker from "../pages/sat/openMerchantTracker.vue";
import MerchantTracker from "../pages/sat/merchantTracker.vue";
import MerchantTransactionLevel from "../pages/sat/merchantTransactionLevel.vue";
import StatementView from "../pages/sat/statementView.vue";
// import ImplementationQueue from "../pages/sat/implementationQueue.vue";
import varaneekimplementationRequest from '../components/sat/varaneekimplementationRequest.vue';
import internalimplementationRequest from '../components/sat/internalimplementationRequest.vue';
import externalimplementationRequest from '../components/sat/externalimplementationRequest.vue';
import internalserviceRequest from '../components/sat/internalserviceRequest.vue';
import externalserviceRequest from '../components/sat/externalserviceRequest.vue';
import varaneekRejectedLead from '../components/sat/varaneekRejectedLead.vue';
import demapping from '../components/sat/demapping.vue';
import internalRegionalInventory from "../pages/sat/internalRegionalInventory.vue";
import AggregatorInventory from "../pages/sat/AggregatorInventory.vue";
import dashboardPhonepe from "../pages/sat/dashboardPhonepe.vue";
import dashboardMobikwik from "../pages/sat/dashboardMobikwik.vue";
import AggregatorVerificationQueue from "../pages/sat/AggregatorVerificationQueue.vue";
import AggregatorDeactiveList from 'src/pages/sat/AggregatorDeactiveList.vue'
import AggregatorMasterTracker from "../pages/sat/AggregatorMasterTracker.vue";
import AggregatorServiceTicket from 'src/pages/sat/AggregatorServiceTicket.vue'
import MasterTracker from "../pages/sat/masterTracker.vue";
import internalLostOrStolen from "../pages/sat/internalLostOrStolen.vue";
import InternalGlobalSearchFilter from "../pages/sat/InternalGlobalSearchFilter.vue";
import AggregatorGlobalSearchFilter from "../pages/sat/AggregatorGlobalSearchFilter.vue";
import AggregatorDeviceReplacement from "../pages/sat/AggregatorDeviceReplacement.vue";
import DeviceRecoveryTracker from "../pages/sat/deviceRecoveryTracker.vue";
import AggregatorDeviceRecovery from "../pages/sat/AggregatorDeviceRecovery.vue";
import hitachiIndianBankOnboarding from "../pages/sat/hitachiIndianBankOnboarding.vue";
import DeviceRecovery from "../pages/sat/deviceRecovery.vue";
import DeviceReplacement from "../pages/sat/deviceReplacement.vue";
//  import serviceRequestSat from "../pages/sat/serviceRequestSat.vue";
// import lostSAT from "../pages/sat/lostSAT.vue";
import AggregatorsLostOrStolen from "../pages/sat/AggregatorsLostOrStolen.vue";
// import GlobalSearchFilter from "../pages/sat/GlobalSearchFilter.vue";
import additionalTid from '../pages/sat/additionalTid.vue';
import internalServiceAddressFetch from '../components/sat/internalServiceAddressFetch.vue';
import externalServiceAddressFetch from '../components/sat/externalServiceAddressFetch.vue';
import sparePartsAssignedToSoDetails from "../components/sat/sparePartsAssignedToSoDetails.vue";
import openRejectLeadDetails from "../components/sat/openRejectLeadDetails.vue";
import additionalTidform from '../pages/sat/additionalTidform.vue';
import MtidAdditionalTidform from '../pages/sat/MtidAdditionalTidform.vue';
import internalimplementationAddressFetch from '../components/sat/internalimplementationAddressFetch.vue';
import externalimplementationAddressFetch from '../components/sat/externalimplementationAddressFetch.vue';
import addNewPrefixConfig from "../pages/super_admin/addNewPrefixConfig.vue";
import addLeadSourceVasDeviceConfig from "../pages/super_admin/addLeadSourceVasDeviceConfig.vue";
import DeviceRecoveryTrackerScanner from "../pages/sat/deviceRecoveryTrackerScanner.vue";
import DeviceRecoveryTrackerScannerFaulty from "../pages/sat/deviceRecoveryTrackerScannerFaulty.vue";
import shortleadInfo from "../pages/sat/shortleadInfo.vue";
import staticQrLeads from '../pages/sat/staticQrLeads.vue'
import staticQRinventory from '../pages/sat/staticQRinventory.vue'
import OnboardingExistingMerchants from '../pages/sat/OnboardingExistingMerchants.vue'
// END >> SAT pages are loaded here to avoid async

// START >> FINANCE pages are loaded here to avoid async
import PaymentVerificationTracker from "../pages/finance/paymentVerificationTracker.vue";
import FinanceApprovedTracker from "../pages/finance/financeApprovedTracker.vue";
import LostFinance from "../pages/finance/LostFinance.vue";
import PosInventory from "../pages/finance/PosInventory.vue";
// import LostOrStolen from "../pages/finance/LostOrStolen.vue";
// END >> FINANCE pages are loaded here to avoid async

// START >> BANK OPS pages are loaded here to avoid async
import AssignShortLead from "../pages/bank_ops/assignShortLead.vue";
import NewShortLead from "../pages/bank_ops/newShortLead.vue";
import BankMerchantTracker from "../pages/bank_ops/bankMerchantTracker.vue";
// END >> BANK OPS pages are loaded here to avoid async

// START >> INVENTORY pages are loaded here to avoid async
import DeviceRecoveryUpload from "../pages/sat/DeviceRecoveryUpload.vue";
// END >> INVENTORY pages are loaded here to avoid async

// START >> SUPER ADMIN pages are loaded here to avoid async
import SuperAdminDashboard from "../pages/super_admin/dashboard.vue";
import Users from "../pages/super_admin/usersSuperAdmin.vue";
import EditUser from "../pages/super_admin/editUser.vue";
import addNewHierarchy from "../pages/super_admin/addNewHierarchy.vue";
// import EditMatmPlans from "../pages/super_admin/editMatmPlans.vue";
import AddUser from "../pages/super_admin/addUser.vue";
import RolesPermissions from "../pages/super_admin/rolesPermissions.vue";
import Hierarchy from "../pages/super_admin/hierarchy.vue";
import Permissions from "../pages/super_admin/permissions.vue";
import Regions from "../pages/super_admin/regionsSuperAdmin.vue";
import regionGroup from "../pages/super_admin/regionGroup.vue";
import SubRegions from "../pages/super_admin/subregions.vue"
import ManageRentalCharge from "../pages/super_admin/manageRentalCharge.vue";
import addMultiTidConfiguration from "../pages/super_admin/addMultiTidConfiguration.vue";
import ManageMDRCharges from "../pages/super_admin/manageMDRCharges.vue";
import AddMDRCharges from "../pages/super_admin/addMDRCharges.vue";
import MarsApiSync from "../pages/super_admin/MarsApiSync.vue";
import AddRentalCharges from "../pages/super_admin/addRentalCharges.vue";
import BankSO from "../pages/super_admin/bankSO.vue";
import Notications from "../pages/super_admin/notifications.vue";
import Pincodes from "../pages/super_admin/pincodes.vue";
import DeviceTypes from "../pages/super_admin/deviceTypes.vue";
import QRSticker from "../pages/super_admin/QRSticker.vue";
import mATMplan from "../pages/super_admin/mATMplan.vue"
import existingmATMplan from "../pages/super_admin/existingmATMplan.vue";
import editMatmPlans from "../pages/super_admin/editMatmPlans.vue";
import MerchantTypes from "../pages/super_admin/merchantTypes.vue";
import mdrCharges from "../pages/super_admin/mdrCharges.vue";
import serviceRequest from "../pages/super_admin/serviceRequest.vue";
import newRentalCharges from "../pages/super_admin/newRentalCharges.vue";
import sparePartsTypes from "../pages/super_admin/sparePartsTypes.vue";
import multiTid from "../pages/super_admin/multiTid.vue";
import aggregators from "../pages/super_admin/aggregators.vue";
import aggregatorsDevice from "../pages/super_admin/aggregatorsDevice.vue";
import prefixConfig from "../pages/super_admin/prefixConfig.vue";
import DeviceModelApiSync from "../pages/super_admin/DeviceModelApiSync.vue";
import CityApiSync from "../pages/super_admin/CityApiSync.vue";
import RegionApiSync from "../pages/super_admin/RegionApiSync.vue";
import RentalPlanApiSync from "../pages/super_admin/RentalPlanApiSync.vue";
import LeadFormApiSync from "../pages/super_admin/LeadFormApiSync.vue";
import StateApiSync from "../pages/super_admin/StateApiSync.vue";
// import addLeadSource from "../pages/super_admin/addLeadSource.vue";
// import vasUpdates from "../pages/super_admin/vasUpdates.vue";
// END >> SUPER ADMIN pages are loaded here to avoid async

// START >> OPS HEAD pages are loaded here to avoid async
import OpsHeadDashboard from "../pages/opsHead/dashboard.vue";
import Exceptions from "../pages/opsHead/exceptions.vue";
import ExceptionQueueDetail from "../pages/opsHead/exceptionQueueDetail.vue";
// END >> OPS HEAD pages are loaded here to avoid async

// START >> SALES MANAGER pages are loaded here to avoid async
import SalesManagerLeadAllocation from "../pages/salesManager/leadAllocation.vue";
import SalesManagerLeadAllocationEdit from "../pages/salesManager/leadAllocationEdit.vue";
import SalesManagerLeadAllocationTracker from "../pages/salesManager/leadAllocationTracker.vue";
import SalesManagerLeadStatus from "../pages/salesManager/leadStatus.vue";
import SalesManagerRevenueTrackers from "../pages/salesManager/revenueTrackers.vue";
import SalesManagerPricingExceptionVerification from "../pages/salesManager/pricingExceptionVerification.vue";
import SalesManagerPricingExceptionVerificationLeadDetails from "../pages/salesManager/pricingExceptionVerificationLeadDetails.vue";
import SalesManagerLeadsPendingAssignment from "../pages/salesManager/leadsPendingAssignment.vue";
import SalesManagerAgingTrackerPendingLeads from "../pages/salesManager/agingTrackerPendingLeads.vue";
// END >> SALES MANAGER pages are loaded here to avoid async

// START >> SALES MANAGER pages are loaded here to avoid async
import leadApprovalTracker from "../pages/reports/leadApprovalTracker.vue";
import sourcewiseLeadTracker from "../pages/reports/sourcewiseLeadTracker.vue";
import sourceRegionLeadTracker from "../pages/reports/sourceRegionLeadTracker.vue";
import inActiveMerchantTracker from "../pages/reports/inActiveMerchantTracker.vue";
import monthOldInactiveMerchantTracker from "../pages/reports/monthOldInactiveMerchantTracker.vue";
import proxyLeadTracker from "../pages/reports/proxyLeadTracker.vue";
import serialupdate from "../pages/super_admin/serialupdate.vue";

// CRM=====>>>>>>>>>CRM_Users
import PhonepePendingCRM from "../pages/crm/phonepePendingCrm.vue";
import bijlipayCRM from "../pages/crm/bijlipayCrm.vue";
import globalTicketSearch from "../pages/crm/globalTicketSearch.vue"
import docviewer from 'src/pages/crm/docviewer.vue'
import serviceticket from 'src/pages/crm/serviceticket.vue'






// END >> SALES MANAGER pages are loaded here to avoid async

const routes = [
  // Router for login
  {
    name: "primaryLogin",
    path: "/",
    component: Default_Login,
    children: [{
      name: "login",
      path: "",
      component: Login,
    },
    {
      name: "passwordRecovery",
      path: "passwordRecovery/:id",
      component: PasswordRecovery,
    },
    ],
  },

  // Router for SAT
  {
    name: "OH",
    path: "/sat/",
    component: Default_Layout,
    children: [{
      name: "satDashboard",
      path: "dashboard",
      component: SatDashboard,
    },
    // {
    //   name: "login",
    //   path: "login",
    //   component: login
    // },
    {
      name: "leadValidation",
      path: "lead/validation",
      component: LeadValidation,
    },
    {
      name: "hitachiDetails",
      path: "hitachiDetails",
      component: hitachiDetails,
    },
    {
    name:"equitasSoundboxOnboarding",
    path:"equitasSoundboxOnboarding",
    component:equitasSoundboxOnboarding,
    },
    {
      name: "aggOpenMerchTracker",
      path: "aggOpenMerchantTracker",
      component: aggOpenMerchTracker,
    },
    {
      name: "DeviceRecoveryUpload",
      path: "DeviceRecoveryUpload",
      component: DeviceRecoveryUpload
    },
    {
      name: "aggregatorLeadValidation",
      path: "aggregator/lead/validation",
      component: aggregatorLeadValidation,
    },
    {
      name: "additionalTid",
      path: "additionalTid",
      component: additionalTid,
      //props: true
    },
    {
      name: "BijlipaySat",
      path: "master/BijlipaySat",
      component: BijlipaySat,
    },
    {
      name: "AggregatorSat",
      path: "master/AggregatorSat",
      component: AggregatorSat,
    },
    {
      name: "additionalTidform",
      path: "additionalTidform",
      component: additionalTidform,
      props: true
    },
    {
      name: "MtidAdditionalTidform",
      path: "MtidAdditionalTidform",
      component: MtidAdditionalTidform,
      props: true
    },
    //  {
    //    name : "spareParts",
    //    path: "spareParts",
    //    component: spareParts,

    //  },
    {
      name: "sparePartsAssignedToSoDetails",
      path: "sparePartsAssignedToSoDetails",
      component: sparePartsAssignedToSoDetails,
    },
    {
      name: "openRejectLeadDetails",
      path: "openRejectLeadDetails",
      component: openRejectLeadDetails,
      props: true
    },
    {
      name: "internalServiceAddressFetch",
      path: "internalServiceAddressFetch",
      component: internalServiceAddressFetch,
      props: true
    },
    {
      name: "externalServiceAddressFetch",
      path: "externalServiceAddressFetch",
      component: externalServiceAddressFetch,
      props: true
    },
    {
      name: "changemanagement",
      path: "change/management",
      component: Changemanagement
    },
    {
      name: "changemanagement",
      path: "change/management/terminal",
      component: Changemanagementterminal
    },
    {
      name: "ChangemanagementEditData",
      path: "change/management/:id/edit/data",
      component: ChangemanagementEditData
    },
    {
      name: "ChangemanagementEditDataKyc",
      path: "change/management/:id/edit/dataInfo",
      component: ChangemanagementEditDataKyc
    },
    {
      name: "internalimplementationAddressFetch",
      path: "internalimplementationAddressFetch",
      component: internalimplementationAddressFetch,
      props: true
    },
    {
      name: "externalimplementationAddressFetch",
      path: "externalimplementationAddressFetch",
      component: externalimplementationAddressFetch,
      props: true
    },
    {
      name: "ChangemanagementEditDatareject",
      path: "change/management/:id/edit/data/reject",
      component: ChangemanagementEditDatareject
    },

    {
      name: "ChangemanagementEditDatarejectrsm",
      path: "change/management/:id/edit/data/rejectrsm",
      component: ChangemanagementEditDatarejectrsm
    },

    {
      name: "deactivelist",
      path: "deactivelist",
      component: deactivelist,
    },
    {
      name: "ChangemanagementEditDatarejectfinance",
      path: "change/management/:id/edit/data/rejectfinance",
      component: ChangemanagementEditDatarejectfinance
    },
    {
      name: "ChangemanagementEditData",
      path: "inventory/:id/edit/data",
      component: deviceDeployementEditData
    },
    // {
    //   name: "lostSAT",
    //   path: "lostSAT",
    //   component: lostSAT
    // },
    {
      name: "TestingRecovery",
      path: "TestingRecovery",
      component: TestingRecovery
    },
    {
      name: "AggregatorDeviceRecovery",
      path: "AggregatorDeviceRecovery",
      component: AggregatorDeviceRecovery,
    },
    {
      name: "PhonepeSparePartsSoPodList",
      path: "PhonepeSparePartsSoPodList",
      component: PhonepeSparePartsSoPodList,
      props: true
    },
    {
      name: "AggregatorsLostOrStolen",
      path: "AggregatorsLostOrStolen",
      component: AggregatorsLostOrStolen
    },
    // {
    //   name: "GlobalSearchFilter",
    //   path: "GlobalSearchFilter",
    //   component: GlobalSearchFilter
    // },

    {
      name: "auDocument",
      path: "lead/lead/view/audocuments",
      component: AuDocument,
    },
    {
      name: "Lead Data Entry",
      path: "lead/lead/dataentry",
      component: LeadDataEntryScreen
    },
    {
      name: "shortLead",
      path: "lead/validation/:id",
      component: ShortLead,
    },
   {
      name: 'QrShortLead',
      path: 'qrLead/validation/:id',
      component: qrShortLead
    },
    {
      name: "appshortlead",
      path: "lead/appshortlead",
      component: AppShortLead

    },
    {
      name: "leadDataEntry",
      path: "lead/validation/:id/data/entry",
      component: LeadDataEntry,
    },
    {
      name: "Lead",
      path: "/lead/information",
      component: LeadInformation,
    },
    {
      name: "leadDataEntryScreen1",
      path: "lead/validation/1/data/entryscreen",
      component: LeadDataEntryScreen1
    },
    {
      name: "exceptionQueue",
      path: "exception/queue/:id?",
      component: ExceptionQueue,
    },
    {
      name: "exceptionQueueKycLeadDetails",
      path: "exception/queue/kyc/lead/details/:id",
      component: ExceptionQueueKYCLeadDetails,
    },
    {
      name: "exceptionQueueBankLeadDetails",
      path: "exception/queue/bank/subvention/lead/details/:id",
      component: ExceptionQueueBankLeadDetails,
    },
    {
      name: "exceptionQueuePricingLeadDetails",
      path: "exception/queue/pricing/lead/details/:id",
      component: ExceptionQueuePricingLeadDetails,
    },
    {
      name: "openMerchantTracker",
      path: "open/merchant/tracker",
      component: OpenMerchantTracker,
    },
    {
      name: "merchantTracker",
      path: "merchant/tracker",
      component: MerchantTracker,
    },
    {
      name: "merchantTransactionLevel",
      path: "merchant/transaction/level",
      component: MerchantTransactionLevel,
    },
    {
      name: "statementView",
      path: "statement/view",
      component: StatementView,
    },
    // {
    //   name: "implementationQueue",
    //   path: "implementation/queue",
    //   component: ImplementationQueue,
    // },
    {
      name: "varaneekimplementationRequest",
      path: "varaneekimplementationRequest",
      component: varaneekimplementationRequest,
    },
    {
      name: "varaneekRejectedLead",
      path: "varaneekRejectedLead",
      component: varaneekRejectedLead,
    },
    {
      name: "internalimplementationRequest",
      path: "internalimplementationRequest",
      component: internalimplementationRequest,
    },
    {
      name: "externalimplementationRequest",
      path: "externalimplementationRequest",
      component: externalimplementationRequest,
    },
    {
      name: "internalserviceRequest",
      path: "internalserviceRequest",
      component: internalserviceRequest,
    },
    {
      name: "externalserviceRequest",
      path: "externalserviceRequest",
      component: externalserviceRequest,
    },
    {
      name: "demapping",
      path: "demapping",
      component: demapping,
    },
    // {
    //   name: "inventoryAllocation",
    //   path: "inventory/allocation",
    //   component: InventoryAloocation,
    // },
    {
      name: "internalRegionalInventory",
      path: "internalRegionalInventory",
      component: internalRegionalInventory,
    },
    {
      name: "AggregatorInventory",
      path: "AggregatorInventory",
      component: AggregatorInventory,
    },
    // {
    //   name: "AggregatorInventory",
    //   path: "Aggregator/inventory",
    //   component: AggregatorInventory,
    // },

    {
      name: "masterTracker",
      path: "master/tracker",
      component: MasterTracker,
    },
    {
      name: "AggregatorMasterTracker",
      path: "AggregatorMasterTracker",
      component: AggregatorMasterTracker,
    },
    {
      name: "AggregatorServiceTicket",
      path: "AggregatorServiceTicket",
      component: AggregatorServiceTicket,
    },
    {
      name: "AggregatorVerificationQueue",
      path: "AggregatorVerificationQueue",
      component: AggregatorVerificationQueue,
    },
    {
      name: "AggregatorDeactiveList",
      path: "AggregatorDeactiveList",
      component: AggregatorDeactiveList,
    },
    {
      name: "dashboardPhonepe",
      path: "dashboardPhonepe",
      component: dashboardPhonepe,
    },
    {
      name: "dashboardMobikwik",
      path: "dashboardMobikwik",
      component: dashboardMobikwik,
    },
    {
      name: "'internalLostOrStolen'",
      path: "internalLostOrStolen",
      component: internalLostOrStolen,
    },
    {
      name: "'InternalGlobalSearchFilter'",
      path: "InternalGlobalSearchFilter",
      component: InternalGlobalSearchFilter,
    },
    {
      name: "'AggregatorGlobalSearchFilter'",
      path: "AggregatorGlobalSearchFilter",
      component: AggregatorGlobalSearchFilter,
    },
    {
      name: "'AggregatorDeviceReplacement'",
      path: "AggregatorDeviceReplacement",
      component: AggregatorDeviceReplacement,
    },
    {
      name: "deviceRecoveryTracker",
      path: "device/recovery/tracker",
      component: DeviceRecoveryTracker,
    },
    {
      name: "hitachiIndianBankOnboarding",
      path: "hitachiIndianBankOnboarding",
      component: hitachiIndianBankOnboarding,
    },
    {
      name: "deviceRecovery",
      path: "device/recovery",
      component: DeviceRecovery,
    },
    {
      name: "Device Replacement",
      path: "device/replacement",
      component: DeviceReplacement,
    },
    // {
    //   name: "serviceRequestSat",
    //   path: "service/request",
    //   component: serviceRequestSat,
    // },


    {
      name: "deviceRecoveryTrackerScanner",
      path: "device/recovery/tracker/scanner",
      component: DeviceRecoveryTrackerScanner,
    },
    {
      name: "deviceRecoveryTrackerScannerFaulty",
      path: "device/recovery/tracker/scanner/faulty",
      component: DeviceRecoveryTrackerScannerFaulty,
    },
    {
      name: "shortleadInfo",
      path: "shortleadInfo",
      component: shortleadInfo,
    },
    {
      name: "updateRegionalRejectPods",
      path: "updateRegionalRejectPods",
      component: updateRegionalRejectPods,
      props: true
    },
   {
      name: 'staticQrLeads',
      path: 'staticQrLeads',
      component: staticQrLeads
    },
    {
      name: 'staticQRinventory',
      path: 'staticQRinventory',
      component: staticQRinventory
    },
    {
      name: 'OnboardingExistingMerchants',
      path: 'OnboardingExistingMerchants',
      component: OnboardingExistingMerchants
    },

    {
      name: "Device List",
      path: "lead/device",
      component: DeviceList
    }

    ],
  },

  // Router for finance
  {
    name: "FH",
    path: "/finance/",
    component: Default_Layout,
    children: [{
      name: "paymentVerificationTracker",
      path: "payment/verification/tracker",
      component: PaymentVerificationTracker,
    },
    {
      name: "financeApprovedTracker",
      path: "finance/approved/tracker",
      component: FinanceApprovedTracker,
    },
    {
      name: "tidRentalTracker",
      path: "tid/rental/tracker",
      component: FinanceApprovedTracker,
    },
    {
      name: "invoiceGenerator",
      path: "invoice/generator",
      component: FinanceApprovedTracker,
    },
    // {
    //   name: "LostOrStolen",
    //   path: "LostOrStolen",
    //   component: LostOrStolen
    // }
    {
      name: "lostfinance",
      path: "lost/finance",
      component: LostFinance
    },
    {
      name: "PosInventory",
      path: "PosInventory",
      component: PosInventory
    }
    ],
  },

  // ROuter for bank ops
  {
    name: "BOH",
    path: "/bank/ops/",
    component: Default_Layout,
    children: [{
      name: "assignShortLead",
      path: "assign/short/lead",
      component: AssignShortLead,
    },
    {
      name: "newShortLead",
      path: "assign/short/lead/new",
      component: NewShortLead,
    },
    {
      name: "bankMerchantTracker",
      path: "bank/merchant/tracker",
      component: BankMerchantTracker,
    },
    ],
  },
  // CRM_ROUTER
  {
    name: "CU",
    path: "/crm/",
    component: Default_Layout,
    children: [{
      name: "phonepePendingCrm",
      path: "phonepePendingCrm",
      component: PhonepePendingCRM,
    },
    {
      name: "bijlipayCrm",
      path: "bijlipayCrm",
      component: bijlipayCRM,
    },
    {
      name: "globalTicketSearch",
      path: "globalTicketSearch",
      component: globalTicketSearch,
    },
    {
      name: "docviewer",
      path: "docviewer",
      component: docviewer,
    },
    {
      name: "serviceticket",
      path: "serviceticket",
      component: serviceticket,
    }
    ],
  },


  // Router for super admin
  {
    name: "BM",
    path: "/super/admin/",
    component: Default_Layout,
    children: [{
      name: "adminDashboard",
      path: "dashboard",
      component: SuperAdminDashboard,
    },
    {
      name: "users",
      path: "users/:page?",
      component: Users,
    },
    {
      name: "editUser",
      path: "users/edit/user/:id/:page?/:perPage?",
      component: EditUser,
    },
    // {
    //   name: "editMatmPlans",
    //   path: "existing/mATM/plan/edit/matm/plans/:id/:page?/:perPage?",
    //   component: EditMatmPlans,
    // },
    {
      name: "addUser",
      path: "users/add/user",
      component: AddUser,
    },
    {
      name: "rolesPermissions",
      path: "roles/permissions",
      component: RolesPermissions,
    },
    {
      name: "hierarchy",
      path: "hierarchy",
      component: Hierarchy,
    },
    {
      name: "addNewHierarchy",
      path: "add/New/Hierarchy",
      component: addNewHierarchy,
    },
    {
      name: "sparePartsTypes",
      path: "sparePartsTypes",
      component: sparePartsTypes,
    },
    {
      name: "permissions",
      path: "permissions",
      component: Permissions,
    },
    {
      name: "regions",
      path: "regions",
      component: Regions,
    },
    {
      name: "regionGroup",
      path: "regionGroup",
      component: regionGroup,
    },
    {
      name: "subregions",
      path: "subregions",
      component: SubRegions
    },
    {
      name: "manageRentalCharges",
      path: "manage/rental/charges",
      component: ManageRentalCharge,
    },
    {
      name: "addMultiTidConfiguration",
      path: "add/Multi/Tid/Configuration",
      component: addMultiTidConfiguration,
    },
    // {
    //   name: "addLeadSource",
    //   path: "addLeadSource",
    //   component: addLeadSource,
    // },
    {
      name: "manageMDRcharges",
      path: "manage/mdr/charges",
      component: ManageMDRCharges,
    },
    {
      name: "addMDRcharges",
      path: "manage/add/mdr/charges",
      component: AddMDRCharges,
    },
    {
      name: "addRentalcharges",
      path: "manage/add/rental/charges",
      component: AddRentalCharges,

    },
    {
      name: "MarsApiSync",
      path: "manage/APISync",
      component: MarsApiSync,
    },
    {
      name: "mdrCharges",
      path: "manage/mdrCharges",
      component: mdrCharges,

    },
    // {
    //   name: "vasUpdates",
    //   path: "manage/vasUpdates",
    //   component: vasUpdates,
    // },

    {
      name: "newRentalCharges",
      path: "manage/newRentalCharges",
      component: newRentalCharges,

    },
    {
      name: "serviceRequest",
      path: "manage/serviceRequest",
      component: serviceRequest,
    },
    {
      name: "multiTid",
      path: "manage/multiTid",
      component: multiTid
    },
    {
      name: "aggregators",
      path: "manage/aggregators",
      component: aggregators
    },
    {
      name: "aggregatorsDevice",
      path: "manage/aggregatorsDevice",
      component: aggregatorsDevice
    },
    {
      name: "DeviceModelApiSync",
      path: "manage/DeviceModelApiSync",
      component: DeviceModelApiSync
    },
    {
      name: "CityApiSync",
      path: "manage/CityApiSync",
      component: CityApiSync
    },
    {
      name: "RegionApiSync",
      path: "manage/RegionApiSync",
      component: RegionApiSync
    },
    {
      name: "RentalPlanApiSync",
      path: "manage/RentalPlanApiSync",
      component: RentalPlanApiSync
    },
    {
      name: "LeadFormApiSync",
      path: "manage/LeadFormApiSync",
      component: LeadFormApiSync
    },
    {
      name: "StateApiSync",
      path: "manage/StateApiSync",
      component: StateApiSync
    },
    {
      name: "prefixConfig",
      path: "manage/prefixConfig",
      component: prefixConfig
    },
    {
      name: "addNewPrefixConfig",
      path: "addNewPrefixConfig",
      component: addNewPrefixConfig,
    },
    {
      name: "addLeadSourceVasDeviceConfig",
      path: "addLeadSourceVasDeviceConfig",
      component: addLeadSourceVasDeviceConfig,
    },


    {
      name: "Bank SO",
      path: "manage/mdr/bankSO",
      component: BankSO,
    },
    {
      name: "Notications",
      path: "manage/notifications",
      component: Notications,
    },
    {
      name: "pincodes",
      path: "pincodes",
      component: Pincodes,
    },
    {
      name: "deviceTypes",
      path: "device/types",
      component: DeviceTypes,
    },
    {
      name: "QRSticker",
      path: "manage/QR/Sticker",
      component: QRSticker,
    },
    {
      name: "mATMplan",
      path: "manage/mATMplan",
      component: mATMplan,
    },
    {
      name: "existingmATMplan",
      path: "manage/existingmATMplan",
      component: existingmATMplan,
    },
    // {
    //   name: "users",
    //   path: "users/:page?",
    //   component: Users,
    // },
    {
      name: "editMatmPlans",
      path: "manage/existingmATMplan/editMatmPlans/:id/:page?/:perPage?",
      component: editMatmPlans,
      props: true
    },
    {
      name: "QRSticker",
      path: "manage/serialupdate",
      component: serialupdate,
    },


    {
      name: "merchantTypes",
      path: "manage/merchant/types",
      component: MerchantTypes,
    },
    ],
  },

  // Router for Operations head
  {
    name: "OH",
    path: "/ops/head/",
    component: Default_Layout,
    children: [{
      name: "opsHeadDashboard",
      path: "dashboard",
      component: OpsHeadDashboard,
    },
    {
      name: "exceptions",
      path: "exceptions",
      component: Exceptions,
    },
    {
      name: "exceptionQueueDetail",
      path: "exceptions/:id",
      component: ExceptionQueueDetail,
    },
    {
      name: "leadApprovalTracker",
      path: "lead/approval/tracker",
      component: leadApprovalTracker,
    },
    {
      name: "sourcewiseLeadTracker",
      path: "sourcewise/lead/tracker",
      component: sourcewiseLeadTracker,
    },
    {
      name: "sourceRegionLeadTracker",
      path: "source/region/lead/tracker",
      component: sourceRegionLeadTracker,
    },
    {
      name: "inActiveMerchantTracker",
      path: "inactive/merchant/tracker",
      component: inActiveMerchantTracker,
    },
    {
      name: "monthOldInactiveMerchantTracker",
      path: "month/old/inactive/merchant/tracker",
      component: monthOldInactiveMerchantTracker,
    },
    {
      name: "proxyLeadTracker",
      path: "proxy/lead/tracker",
      component: proxyLeadTracker,
    },
    ],
  },

  // Router for sales manager
  {
    name: "SH",
    path: "/sales/manager/",
    component: Default_Layout,
    children: [{
      name: "leadAllocationAdd",
      path: "lead/allocation/tracker/add/new",
      component: SalesManagerLeadAllocation,
    },
    {
      name: "leadAllocationEdit",
      path: "lead/allocation/tracker/edit/:id",
      component: SalesManagerLeadAllocationEdit,
    },
    {
      name: "leadAllocation",
      path: "lead/allocation/tracker",
      component: SalesManagerLeadAllocationTracker,
    },
    {
      name: "leadStatus",
      path: "leads/status",
      component: SalesManagerLeadStatus,
    },
    {
      name: "revenueTrackers",
      path: "revenue/trackers",
      component: SalesManagerRevenueTrackers,
    },
    {
      name: "pricingExceptionVerification",
      path: "pricing/exception/verification",
      component: SalesManagerPricingExceptionVerification,
    },
    {
      name: "revenueApprovalLeadDetails",
      path: "pricing/exception/verification/lead/:id/details/:showAction?",
      component: SalesManagerPricingExceptionVerificationLeadDetails,
    },
    {
      name: "leadsPendingAssignment",
      path: "leads/pending/assignment",
      component: SalesManagerLeadsPendingAssignment,
    },
    {
      name: "agingTrackerPendingLeads",
      path: "aging/tracker/pending/leads",
      component: SalesManagerAgingTrackerPendingLeads,
    },
    ],
  },

  {
    // Route for 404
    name: "404",
    path: "/404",
    component: error_404,
  },

  {
    // Route for 500
    name: "error_403",
    path: "/403",
    component: error_403,
  },
  {
    // Route for 500
    name: "500",
    path: "/500",
    component: error_500,
  },

  {
    // Always leave this as last one
    path: "*",
    component: error_404,
  },
];
export default routes;

