<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">

          <!-- Tabs -->
          <q-tabs
            v-model="QRselected"
            dense
            class="shadow-1"
            active-color="primary"
            indicator-color="primary"
            align="left"
          >
            <q-tab
              name="createQRSticker"
              label="Create QR Ref No"
            />

            <q-tab
              name="downloadQRcodes"
              label="Download QR Codes"
            />

            <q-tab
              name="implementQRleadsources"
              label="Implement QR for Lead Sources"
            />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="QRselected"
            animated
            class="q-mt-sm"
          >
            <q-tab-panel name="createQRSticker">
              <createQRSticker />
            </q-tab-panel>

            <q-tab-panel name="downloadQRcodes">
              <downloadQRcodes />
            </q-tab-panel>

            <q-tab-panel name="implementQRleadsources">
              <implementQRleadsources />
            </q-tab-panel>
          </q-tab-panels>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/**
 * Vue 3 + Quasar 2.18
 * Node.js 20 compatible
 */

import { ref } from 'vue'

import createQRSticker from '../../components/super_admin/createQRSticker.vue'
import downloadQRcodes from '../../components/super_admin/downloadQRcodes.vue'
import implementQRleadsources from '../../components/super_admin/implementQRleadsources.vue'

/* ------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------ */
const QRselected = ref('createQRSticker')
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
