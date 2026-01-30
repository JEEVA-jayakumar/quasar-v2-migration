<template>
  <q-page class="row items-center window-height">
    <!-- Left side / Logo -->
    <div class="col-md-5 gt-sm bg-grey-4 flex flex-center">
      <div class="col-auto full-width text-center">
        <img
          :src="logo"
          class="responsive vertical-align"
          style="width:200px"
          alt="Logo"
        />
      </div>
    </div>

    <!-- Right side / Login Form -->
    <div class="col-md-7 q-px-xl">
      <div class="row justify-center gutter-md">
        <div class="col-md-8 text-center">
          <div class="q-display-1 text-grey-9 text-weight-medium q-py-lg">
            Please Log In
          </div>
        </div>

        <!-- Email -->
        <div class="col-md-8">
          <q-input
            v-model.trim="formData.email"
            :error="v$.formData.email.$error"
            @blur="v$.formData.email.$touch()"
            float-label="Email"
            color="grey-9"
            placeholder="Enter your email id"
            @keyup.enter="submitLogin()"
          />
        </div>

        <!-- Password -->
        <div class="col-md-8">
          <q-input
            v-model.trim="formData.password"
            :error="v$.formData.password.$error"
            @blur="v$.formData.password.$touch()"
            placeholder="Enter your password"
            type="password"
            float-label="Password"
            color="grey-9"
            @keyup.enter="submitLogin()"
          />
        </div>

        <!-- Remember password -->
        <div class="col-md-8">
          <q-checkbox
            v-model="formData.rememberPassword"
            color="purple-9"
            label="Remember Password"
          />
        </div>

        <!-- Login button -->
        <div class="col-md-8 text-center">
          <q-btn
            class="full-width text-weight-regular q-pa-md"
            no-caps
            color="purple-9"
            style="max-width:300px"
            @click="submitLogin"
          >
            Log In
          </q-btn>
        </div>

        <!-- Forgot password -->
        <div class="col-md-8 text-center">
          <q-btn
            flat
            no-caps
            class="text-purple-9 text-weight-regular"
            color="white"
            @click="toggleForgetPassword"
          >
            Forgot your password?
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Forget Password Component -->
    <showForgetPasswordComp
      v-if="showForgetPassword"
      :propShowForgetPassword="showForgetPassword"
      @emitfnShowForgetPasswordModal="toggleForgetPassword"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import showForgetPasswordComp from '../components/forgetPassword.vue'
import * as CryptoJS from 'crypto-js'

// Import logo image
import logo from '/src/assets/images/logo.png'

// Router
import { useRouter } from 'vue-router'

// AES Utility
class AesUtil {
  constructor(keySize, iterationCount) {
    this.keySize = keySize / 32
    this.iterationCount = iterationCount
  }

  generateKey(salt, passPhrase) {
    return CryptoJS.PBKDF2(
      passPhrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount }
    )
  }

  encrypt(salt, iv, passPhrase, plainText) {
    const key = this.generateKey(salt, passPhrase)
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    })
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  }
}

// Composables
const router = useRouter()
const $q = useQuasar()
const store = useStore()

// Reactive state
const showForgetPassword = ref(false)
const formData = reactive({
  email: '',
  password: '',
  rememberPassword: false
})

// Vuelidate
const rules = {
  formData: {
    email: { required, email },
    password: { required }
  }
}
const v$ = useVuelidate(rules, { formData })

// Methods
const toggleForgetPassword = () => {
  showForgetPassword.value = !showForgetPassword.value
}

const submitLogin = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ message: 'Please review fields again.', color: 'negative' })
    return
  }

  // AES encrypt password
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const aesUtil = new AesUtil(128, 1000)
  const ciphertext = aesUtil.encrypt(salt, iv, 'BijliWeAreMakers', formData.password)
  const aesPassword = iv + '::' + salt + '::' + ciphertext
  const password = btoa(aesPassword)

  const requestParams = {
    url: {
      email: formData.email,
      password,
      rememberPassword: formData.rememberPassword
    }
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait...'
  })

  try {
    await store.dispatch('Authentication/FEED_LOGIN_DATA', requestParams)
    await store.dispatch('Authentication/FETCH_LOGGEDIN_USER_DATA')

    const userInfo = JSON.parse(localStorage.getItem('u_i') || '{}')
    const menuArr = userInfo.roles?.map(r => r.hierarchyRoleLevel) || []

    const roleRedirects = [
      { role: '$ROLE_HIERARCHY_OPERATION_SAT', route: 'BijlipaySat' },
      { role: '$ROLE_BIJLIPAY_MANAGER', route: 'adminDashboard' },
      { role: '$ROLE_HIERARCHY_SALES_RSM', route: 'leadAllocation' },
      { role: '$ROLE_HIERARCHY_SALES_ASM', route: 'leadAllocation' },
      { role: '$ROLE_HIERARCHY_SALES_NATIONAL_HEAD', route: 'leadAllocation' },
      { role: '$ROLE_HIERARCHY_BANK_OPS', route: 'assignShortLead' },
      { role: '$ROLE_HIERARCHY_OPERATIONS_HEAD', route: 'exceptions' },
      { role: '$ROLE_HIERARCHY_FINANCE_HEAD', route: 'paymentVerificationTracker' },
      { role: '$ROLE_HIERARCHY_FINANCE_MANAGER', route: 'paymentVerificationTracker' },
      { role: '$ROLE_HIERARCHY_FINANCE_EXECUTIVE', route: 'paymentVerificationTracker' },
      { role: '$ROLE_HIERARCHY_INVENTORY_OFFICER', route: 'Bijlipay' },
      { role: '$ROLE_HIERARCHY_KSN', route: 'Ksn' },
      { role: '$HIERARCHY_CRM1', route: 'phonepePendingCrm' }
    ]

    const matchedRole = roleRedirects.find(r => menuArr.includes(r.role))
    if (matchedRole) {
      $q.notify({ color: 'positive', message: 'Successfully Logged In', position: 'bottom', icon: 'thumb_up' })
      router.push({ name: matchedRole.route })
    } else {
      $q.notify({ type: 'warning', message: 'Permission denied.', position: 'bottom' })
    }

  } catch (error) {

    if (error.status === 401) {
      $q.notify({ type: 'warning', message: 'Oops! Incorrect credentials', position: 'bottom' })
    } else if (error.status === 423) {
      $q.notify({ type: 'warning', message: 'Your account is locked, please contact admin', position: 'bottom' })
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please try again later!',
        icon: 'thumb_down'
      })
    }
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.window-height {
  height: 100vh;
}

.vertical-align {
  vertical-align: middle;
}
</style>