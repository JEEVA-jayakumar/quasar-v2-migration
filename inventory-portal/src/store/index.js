import { createStore } from 'vuex'
import Authentication from './Authentication'
import InventoryCentral from './InventoryCentral'
import InventoryScanAddDevice from './InventoryScanAddDevice'
import inventoryBulkUploadDevice from './inventoryBulkUploadDevice'
import AggregatorInventoryCentral from './AggregatorInventoryCentral'
import PhonepeInventoryBulkUploadDevice from './PhonepeInventoryBulkUploadDevice'
import SendToRepair from './SendToRepair'
import sparePartsInventory from './sparePartsInventory'
import faulty from './faulty'
import podlist from './podlist'
import inventorywithso from './inventorywithso'
import inventorywithresellar from './inventorywithresellar'
import AllocatedDevices from './AllocatedDevices'
import UnallocatedDevices from './UnallocatedDevices'
import FaultyDevices from './FaultyDevices'
import Regional from './Regional'
import RegionalSum from './RegionalSum'
import summary from './summary'
import inventoryWithRegion from './inventoryWithRegion'
import staticQrInventory from './staticQrInventory'
import inventoryStolenData from './inventoryStolenData'
import regionalInventoryDetails from './regionalInventoryDetails'
import sparePartsPodListInventoryDetails from './sparePartsPodListInventoryDetails'
import sparePartsRegionalInventory from './sparePartsRegionalInventory'
import sparePartsRegionalInventoryPodDetails from './sparePartsRegionalInventoryPodDetails'
import sparePodUpdateDetails from './sparePodUpdateDetails'
import GlobalVariables from './GlobalVariables'
import api from './api'

const store = createStore({
  modules: {
    Authentication,
    InventoryCentral,
    InventoryScanAddDevice,
    inventoryBulkUploadDevice,
    AggregatorInventoryCentral,
    PhonepeInventoryBulkUploadDevice,
    SendToRepair,
    sparePartsInventory,
    faulty,
    podlist,
    inventorywithso,
    inventorywithresellar,
    AllocatedDevices,
    UnallocatedDevices,
    FaultyDevices,
    Regional,
    RegionalSum,
    summary,
    inventoryWithRegion,
    staticQrInventory,
    inventoryStolenData,
    regionalInventoryDetails,
    sparePartsPodListInventoryDetails,
    sparePartsRegionalInventory,
    sparePartsRegionalInventoryPodDetails,
    sparePodUpdateDetails,
    GlobalVariables,
    api
  }
})

export default store
