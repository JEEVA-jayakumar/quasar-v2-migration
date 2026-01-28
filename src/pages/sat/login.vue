<template>
  <q-page>
    <div class="row items-center window-height">
      <!-- Left Image -->
      <div class="col-md-4 gt-sm bg-grey-4" align="center">
        <div class="row items-center window-height full-width inline" align="center">
          <div class="col-auto no-padding full-width" align="center">
            <img src="~assets/images/Phonepe.png" style="width:300px" />
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="col-md-7 q-px-xl">
        <div class="row justify-center gutter-md">

          <div class="col-md-8" align="center">
            <div class="q-display-1 text-grey-9 text-weight-medium q-py-lg">
              Please SignUp
            </div>
          </div>

          <div class="col-md-8">
            <q-input
              v-model="FormData.fname"
              placeholder="Enter Name"
              float-label="Enter Name"
              :error="v$.FormData.fname.$invalid && v$.FormData.fname.$dirty"
              @blur="v$.FormData.fname.$touch()"
            />
          </div>

          <div class="col-md-8">
            <q-input
              v-model="FormData.email"
              placeholder="Enter Email"
              float-label="Enter Email"
              :error="v$.FormData.email.$invalid && v$.FormData.email.$dirty"
              @blur="v$.FormData.email.$touch()"
            />
          </div>

          <div class="col-md-8">
            <q-input
              v-model="FormData.dob"
              placeholder="Select DOB"
              float-label="Select DOB"
              type="date"
              :error="v$.FormData.dob.$invalid && v$.FormData.dob.$dirty"
              @blur="v$.FormData.dob.$touch()"
            />
          </div>

          <div class="col-md-8">
            <q-select
              v-model="FormData.gender"
              placeholder="Select Gender"
              float-label="Select Gender"
              :options="selectGender"
              :error="v$.FormData.gender.$invalid && v$.FormData.gender.$dirty"
              @blur="v$.FormData.gender.$touch()"
            />
          </div>

          <div class="col-md-8">
            <q-input
              v-model="FormData.password"
              type="password"
              placeholder="Enter Password"
              float-label="Enter Password"
              :error="v$.FormData.password.$invalid && v$.FormData.password.$dirty"
              @blur="v$.FormData.password.$touch()"
            />
          </div>

          <div class="col-md-8">
            <q-input
              v-model="FormData.repassword"
              type="password"
              placeholder="Re-Enter Password"
              float-label="Re-Enter Password"
              :error="v$.FormData.repassword.$invalid && v$.FormData.repassword.$dirty"
              @blur="v$.FormData.repassword.$touch()"
            />
          </div>

          <div class="col-md-8" align="center">
            <q-btn
              class="full-width text-weight-regular q-pa-md"
              no-caps
              color="purple-9"
              style="max-width:300px"
              @click="fnsubmit"
            >Submit</q-btn>
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

export default {
  name: "SignUpPage",
  setup() {
    const FormData = reactive({
      fname: "",
      email: "",
      dob: "",
      gender: "",
      password: "",
      repassword: ""
    });

    const selectGender = [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" }
    ];

    const rules = {
      FormData: {
        fname: { required },
        email: { required, email },
        dob: { required },
        gender: { required },
        password: { required },
        repassword: { required }
      }
    };

    const v$ = useVuelidate(rules, { FormData });

    const fnsubmit = () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        // Show Quasar notify
        import("quasar").then(({ Notify }) => {
          Notify.create({ type: "negative", message: "Please review fields again." });
        });
        return;
      }
      console.log("Submitted Data:", JSON.stringify(FormData));
    };

    return { FormData, selectGender, v$, fnsubmit };
  }
};
</script>

<style scoped>
.window-height {
  min-height: 100vh;
}
</style>
