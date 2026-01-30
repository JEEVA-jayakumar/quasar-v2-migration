const routes = [
  {
    path: '/',
    component: () => import('../layouts/loginLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('../pages/loginPages.vue') },
      { path: 'passwordRecovery/:id', name: 'passwordRecovery', component: () => import('../pages/passwordRecovery.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('../pages/inventoryTable.vue') },
      { path: 'central', component: () => import('../pages/inventoryCentral.vue') },
      { path: 'faulty', component: () => import('../pages/inventoryFaulty.vue') },
      { path: 'regional', component: () => import('../pages/inventoryRegional.vue') },
      { path: 'transit', component: () => import('../pages/inventoryTransit.vue') },
      { path: 'merchant', component: () => import('../pages/inventoryMerchant.vue') },
      { path: 'master/inventory', component: () => import('../pages/masterInventory.vue') },
      { path: 'master/reports', component: () => import('../pages/Reports.vue') },
      { path: 'master/global-search', component: () => import('../pages/GlobalSearch.vue') },
      { path: 'master/send-to-repair', component: () => import('../pages/SendToRepair.vue') },
      { path: 'master/moved-to-scrap', component: () => import('../pages/MovedToScrap.vue') },
      { path: 'master/lost', component: () => import('../pages/lostInventory.vue') },
      { path: 'master/spare-parts', component: () => import('../pages/spareParts.vue') },
      { path: 'master/spare-parts-inventory', component: () => import('../pages/sparePartsInventory.vue') },
      { path: 'master/inventory-region', component: () => import('../pages/InventoryRegion.vue') },
      { path: 'podlist', component: () => import('../pages/podList.vue') },
      { path: 'inventorywithso', component: () => import('../pages/inventorywithSo.vue') },
      { path: 'inventorywithresellar', component: () => import('../pages/inventorywithResellar.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/404Error.vue')
  }
]

export default routes
