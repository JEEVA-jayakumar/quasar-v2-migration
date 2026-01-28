<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border"></div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          <strong>MARS API SYNC - REGION</strong>
        </div>

        <q-card class="q-pa-md" style="width: 1047px">

          <!-- Token Display -->
          <q-card-section>
            <q-input
              v-model="formData.tokenRegion"
              type="textarea"
              outlined
              disable
              rows="5"
              class="text-grey-8"
            />
          </q-card-section>

          <!-- Submit Button -->
          <q-card-section class="text-center">
            <q-btn
              class="common-btn"
              color="purple-9"
              label="Submit"
              size="15px"
              :disable="!formData.tokenRegion"
              @click="fnFinalSubmit"
            />
          </q-card-section>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/**
 * Vue 3 + Quasar 2.18
 * Node.js 20 compatible
 */

import { reactive, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

/* ------------------------------------------------------------------
 * Quasar & Store
 * ------------------------------------------------------------------ */
const $q = useQuasar()
const store = useStore()

/* ------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------ */
const formData = reactive({
  tokenRegion: `Token ${localStorage.getItem('auth_token') || ''}`
})

/* ------------------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------------------ */
onBeforeMount(() => {
  console.log(
    'REGION AUTH_TOKEN DETAILS--------->>>>',
    formData.tokenRegion
  )
})

/* ------------------------------------------------------------------
 * Methods
 * ------------------------------------------------------------------ */
const fnFinalSubmit = async () => {
  if (!formData.tokenRegion) {
    $q.notify({
      type: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Submitting data...'
  })

  try {
    await store.dispatch(
      'MarsApiSync/REGION_MARS',
      formData.tokenRegion
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully created!',
      icon: 'thumb_up'
    })
  } catch {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please try again later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
p {
  text-indent: 30px;
}

label {
  margin-right: 20px;
}

.common-btn {
  min-width: 150px;
}
</style>
